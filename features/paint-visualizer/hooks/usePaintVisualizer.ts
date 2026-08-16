"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_LAYER_OPACITY,
  DILATE_RADIUS,
  FEATHER_RADIUS,
  TOLERANCE_DEFAULT,
} from "../constants";
import { DEFAULT_COLOR } from "../data/palette";
import { DEFAULT_ROOM } from "../data/rooms";
import { buildBlankRoom, type BlankSurface } from "../lib/blankRoom";
import { floodFillMask } from "../lib/floodFill";
import { analyzeImage, type ImageAnalysis } from "../lib/imageAnalysis";
import { loadImageData } from "../lib/imageLoader";
import { dilateMask, featherMask, isMeaningfulSelection } from "../lib/maskOps";
import { composite, meanLumaInMask } from "../lib/recolor";
import { normalizeHex } from "../lib/color";
import type { PaintColor, PaintFinish, PaintLayer, RoomSource } from "../types";
import { useHistory } from "./useHistory";

export type ToolMode = "paint" | "erase";

interface Selection {
  x: number;
  y: number;
}

/**
 * Orchestrates the whole editor: image intake, selection, layer state,
 * and the render loop. Components stay presentational.
 */
export function usePaintVisualizer() {
  const paintedCanvasRef = useRef<HTMLCanvasElement>(null);
  const originalCanvasRef = useRef<HTMLCanvasElement>(null);

  const originalImageRef = useRef<ImageData | null>(null);
  const analysisRef = useRef<ImageAnalysis | null>(null);
  const scratchRef = useRef<ImageData | null>(null);
  const layerCounterRef = useRef(0);
  /** Exact per-surface masks; only populated when the room is generated. */
  const blankSurfacesRef = useRef<BlankSurface[] | null>(null);

  const [room, setRoom] = useState<RoomSource>(DEFAULT_ROOM);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);

  const [activeColor, setActiveColor] = useState<PaintColor>(DEFAULT_COLOR);
  const [finish, setFinish] = useState<PaintFinish>("matte");
  const [tolerance, setTolerance] = useState(TOLERANCE_DEFAULT);
  const [tool, setTool] = useState<ToolMode>("paint");

  const history = useHistory<PaintLayer[]>([]);
  const layers = history.value;
  const [activeLayerId, setActiveLayerId] = useState<string | null>(null);

  /* ---------------------------------------------------------------- intake */

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    setError(null);

    /** Shared tail of the intake: pixels are in hand, wire up the canvases. */
    const install = (imageData: ImageData, width: number, height: number) => {
      originalImageRef.current = imageData;
      setDimensions({ width, height });

      const originalCanvas = originalCanvasRef.current;
      if (originalCanvas) {
        originalCanvas.width = width;
        originalCanvas.height = height;
        originalCanvas.getContext("2d")?.putImageData(imageData, 0, 0);
      }

      const paintedCanvas = paintedCanvasRef.current;
      if (paintedCanvas) {
        paintedCanvas.width = width;
        paintedCanvas.height = height;
        const context = paintedCanvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          context.putImageData(imageData, 0, 0);
          scratchRef.current = context.createImageData(width, height);
        }
      }

      history.reset([]);
      setActiveLayerId(null);
      layerCounterRef.current = 0;
      setStatus("ready");
    };

    if (room.origin === "blank") {
      // Generated room: pixels and surface masks are drawn synchronously,
      // and selection is a mask lookup — no image analysis needed.
      try {
        const build = buildBlankRoom();
        analysisRef.current = null;
        blankSurfacesRef.current = build.surfaces;
        install(build.imageData, build.width, build.height);
      } catch (cause: unknown) {
        setError(
          cause instanceof Error ? cause.message : "Could not build the blank room."
        );
        setStatus("error");
      }
      return;
    }

    blankSurfacesRef.current = null;
    loadImageData(room.src)
      .then(({ imageData, width, height }) => {
        if (cancelled) return;
        // Luminance / chromaticity / edge maps, computed once per photo so
        // each click only pays for the fill itself.
        analysisRef.current = analyzeImage(imageData);
        install(imageData, width, height);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : "Could not load that image.");
        setStatus("error");
      });

    return () => {
      cancelled = true;
    };
    // `history.reset` is referentially stable; room change is the real trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room.src, room.origin]);

  /* ---------------------------------------------------------------- render */

  useEffect(() => {
    if (status !== "ready") return;

    const canvas = paintedCanvasRef.current;
    const original = originalImageRef.current;
    const scratch = scratchRef.current;
    if (!canvas || !original || !scratch) return;

    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) return;

    const frame = requestAnimationFrame(() => {
      context.putImageData(composite(original, layers, scratch), 0, 0);
    });
    return () => cancelAnimationFrame(frame);
  }, [layers, status]);

  /* ------------------------------------------------------------- selection */

  /**
   * Names a new surface from where it sits in the frame — a region hugging
   * the top of the photo is almost always the ceiling.
   */
  const labelFor = useCallback(
    (bounds: PaintLayer["mask"]["bounds"], height: number): string => {
      const centreY = (bounds.minY + bounds.maxY) / 2;
      if (centreY < height * 0.22) return "Ceiling";
      layerCounterRef.current += 1;
      return `Wall ${layerCounterRef.current}`;
    },
    []
  );

  /**
   * Fills a generated-room surface with the active colour in one step —
   * the mask is exact, so there is nothing to detect. Repainting an
   * already-covered surface swaps its colour instead of stacking a layer.
   */
  const paintSurface = useCallback(
    (surfaceId: string) => {
      const original = originalImageRef.current;
      const surface = blankSurfacesRef.current?.find((s) => s.id === surfaceId);
      if (!original || !surface || status !== "ready") return;

      setError(null);
      const layerId = `blank-${surface.id}`;
      const existing = layers.find((layer) => layer.id === layerId);

      if (existing) {
        if (existing.hex !== activeColor.hex || existing.finish !== finish) {
          history.commit(
            layers.map((layer) =>
              layer.id === layerId
                ? { ...layer, hex: activeColor.hex, colorName: activeColor.name, finish }
                : layer
            )
          );
        }
        setActiveLayerId(layerId);
        return;
      }

      const layer: PaintLayer = {
        id: layerId,
        label: surface.label,
        hex: activeColor.hex,
        colorName: activeColor.name,
        finish,
        opacity: DEFAULT_LAYER_OPACITY,
        mask: surface.mask,
        meanLuma: meanLumaInMask(original, surface.mask),
      };
      history.commit([...layers, layer]);
      setActiveLayerId(layerId);
    },
    [activeColor, finish, history, layers, status]
  );

  const selectAt = useCallback(
    ({ x, y }: Selection) => {
      const original = originalImageRef.current;
      if (!original || status !== "ready") return;

      const totalPixels = original.width * original.height;
      const pixelIndex = Math.round(y) * original.width + Math.round(x);

      if (tool === "erase") {
        // Remove the topmost layer that actually covers this pixel.
        for (let i = layers.length - 1; i >= 0; i--) {
          if (layers[i].mask.data[pixelIndex] > 0) {
            const next = layers.filter((_, index) => index !== i);
            history.commit(next);
            if (activeLayerId === layers[i].id) {
              setActiveLayerId(next.length > 0 ? next[next.length - 1].id : null);
            }
            return;
          }
        }
        return;
      }

      if (room.origin === "blank") {
        // Generated room: resolve the click against the exact surface masks.
        // Antialiased seam pixels belong to two surfaces; highest coverage wins.
        const surfaces = blankSurfacesRef.current ?? [];
        let best: BlankSurface | null = null;
        let bestCoverage = 0;
        for (const surface of surfaces) {
          const coverage = surface.mask.data[pixelIndex];
          if (coverage > bestCoverage) {
            best = surface;
            bestCoverage = coverage;
          }
        }
        if (!best || bestCoverage < 32) {
          setError("The floor keeps its finish — click one of the walls or the ceiling.");
          return;
        }
        paintSurface(best.id);
        return;
      }

      const analysis = analysisRef.current;
      if (!analysis) return;

      const raw = floodFillMask(analysis, x, y, { tolerance });
      if (!raw || !isMeaningfulSelection(raw, totalPixels)) {
        setError(
          "That area is too small or too detailed to fill. Try raising the selection spread."
        );
        return;
      }
      setError(null);

      // Grow back over the edge pixels the fill refused to cross, then soften
      // the boundary so the result reads as paint rather than a cut-out.
      const grown = dilateMask(raw, original.width, original.height, DILATE_RADIUS);
      const mask = featherMask(grown, original.width, original.height, FEATHER_RADIUS);
      const layer: PaintLayer = {
        id: `layer-${Date.now()}-${Math.round(x)}-${Math.round(y)}`,
        label: labelFor(mask.bounds, original.height),
        hex: activeColor.hex,
        colorName: activeColor.name,
        finish,
        opacity: DEFAULT_LAYER_OPACITY,
        mask,
        meanLuma: meanLumaInMask(original, mask),
      };

      history.commit([...layers, layer]);
      setActiveLayerId(layer.id);
    },
    [
      activeColor,
      finish,
      history,
      labelFor,
      layers,
      status,
      tolerance,
      tool,
      activeLayerId,
      room.origin,
      paintSurface,
    ]
  );

  /* ---------------------------------------------------------- layer edits */

  const updateLayer = useCallback(
    (id: string, patch: Partial<PaintLayer>, options?: { transient?: boolean }) => {
      const next = layers.map((layer) =>
        layer.id === id ? { ...layer, ...patch } : layer
      );
      if (options?.transient) history.replace(next);
      else history.commit(next);
    },
    [history, layers]
  );

  /** Picking a colour repaints the active surface, or arms the next selection. */
  const applyColor = useCallback(
    (color: PaintColor) => {
      setActiveColor(color);
      if (activeLayerId) {
        updateLayer(activeLayerId, { hex: color.hex, colorName: color.name });
      }
    },
    [activeLayerId, updateLayer]
  );

  const applyCustomHex = useCallback(
    (hex: string) => {
      const normalized = normalizeHex(hex);
      if (!normalized) return;
      applyColor({
        id: `custom-${normalized.slice(1)}`,
        name: "Custom",
        hex: normalized,
        collection: "custom",
      });
    },
    [applyColor]
  );

  const applyFinish = useCallback(
    (nextFinish: PaintFinish) => {
      setFinish(nextFinish);
      if (activeLayerId) updateLayer(activeLayerId, { finish: nextFinish });
    },
    [activeLayerId, updateLayer]
  );

  const removeLayer = useCallback(
    (id: string) => {
      const next = layers.filter((layer) => layer.id !== id);
      history.commit(next);
      if (activeLayerId === id) {
        setActiveLayerId(next.length > 0 ? next[next.length - 1].id : null);
      }
    },
    [activeLayerId, history, layers]
  );

  const clearAll = useCallback(() => {
    history.commit([]);
    setActiveLayerId(null);
    layerCounterRef.current = 0;
  }, [history]);

  const activeLayer = useMemo(
    () => layers.find((layer) => layer.id === activeLayerId) ?? null,
    [activeLayerId, layers]
  );

  const isBlankRoom = room.origin === "blank";

  // The ref is filled synchronously before status flips to "ready", so
  // gating on status is enough to re-derive this after a room switch.
  const blankSurfaces = useMemo<BlankSurface[]>(
    () => (isBlankRoom && status === "ready" ? blankSurfacesRef.current ?? [] : []),
    [isBlankRoom, status]
  );

  return {
    // refs
    paintedCanvasRef,
    originalCanvasRef,

    // room
    room,
    setRoom,
    dimensions,
    status,
    error,
    setError,

    // generated blank room
    isBlankRoom,
    blankSurfaces,
    paintSurface,

    // tools
    tool,
    setTool,
    tolerance,
    setTolerance,
    finish,
    applyFinish,

    // colour
    activeColor,
    applyColor,
    applyCustomHex,

    // layers
    layers,
    activeLayer,
    activeLayerId,
    setActiveLayerId,
    selectAt,
    updateLayer,
    removeLayer,
    clearAll,

    // history
    undo: history.undo,
    redo: history.redo,
    canUndo: history.canUndo,
    canRedo: history.canRedo,
  };
}
