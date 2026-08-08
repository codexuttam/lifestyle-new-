"use client";

import { FINISH_PROFILES, TOLERANCE_MAX, TOLERANCE_MIN } from "../constants";
import { readableInkOn } from "../lib/color";
import type { PaintFinish, PaintLayer } from "../types";
import type { ToolMode } from "../hooks/usePaintVisualizer";
import styles from "./PaintVisualizer.module.css";

interface SurfacePanelProps {
  layers: PaintLayer[];
  activeLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onOpacityChange: (id: string, opacity: number, committed: boolean) => void;
  finish: PaintFinish;
  onFinishChange: (finish: PaintFinish) => void;
  tolerance: number;
  onToleranceChange: (tolerance: number) => void;
  tool: ToolMode;
  onToolChange: (tool: ToolMode) => void;
}

/** Selection settings plus the list of painted surfaces. */
export default function SurfacePanel({
  layers,
  activeLayerId,
  onSelectLayer,
  onRemoveLayer,
  onOpacityChange,
  finish,
  onFinishChange,
  tolerance,
  onToleranceChange,
  tool,
  onToolChange,
}: SurfacePanelProps) {
  const activeLayer = layers.find((layer) => layer.id === activeLayerId) ?? null;

  return (
    <section className={styles.panel} aria-labelledby="surface-heading">
      <h3 id="surface-heading" className={styles.panelTitle}>
        Surfaces
      </h3>

      <div className={styles.toolRow} role="group" aria-label="Tool">
        <button
          type="button"
          className={styles.toolButton}
          data-active={tool === "paint"}
          aria-pressed={tool === "paint"}
          onClick={() => onToolChange("paint")}
        >
          Paint
        </button>
        <button
          type="button"
          className={styles.toolButton}
          data-active={tool === "erase"}
          aria-pressed={tool === "erase"}
          onClick={() => onToolChange("erase")}
        >
          Erase
        </button>
      </div>

      <div className={styles.field}>
        <label htmlFor="tolerance" className={styles.fieldLabel}>
          Selection spread
        </label>
        <input
          id="tolerance"
          type="range"
          min={TOLERANCE_MIN}
          max={TOLERANCE_MAX}
          value={tolerance}
          onChange={(event) => onToleranceChange(Number(event.target.value))}
          className={styles.slider}
        />
        <p className={styles.panelHint}>
          Lower keeps the fill tight to one flat wall. Raise it if the colour
          stops short of a shadow or a textured patch. If a corner of the wall
          is left unpainted, just click it — it joins as another surface in the
          same colour.
        </p>
      </div>

      <div className={styles.field}>
        <span className={styles.fieldLabel} id="finish-label">
          Finish
        </span>
        <div className={styles.toolRow} role="group" aria-labelledby="finish-label">
          {(Object.keys(FINISH_PROFILES) as PaintFinish[]).map((key) => (
            <button
              key={key}
              type="button"
              className={styles.toolButton}
              data-active={finish === key}
              aria-pressed={finish === key}
              onClick={() => onFinishChange(key)}
            >
              {FINISH_PROFILES[key].label}
            </button>
          ))}
        </div>
      </div>

      {layers.length === 0 ? (
        <p className={styles.emptyState}>
          No surfaces painted yet. Click any wall in the photo to fill it with
          the selected colour.
        </p>
      ) : (
        <ul className={styles.layerList}>
          {layers.map((layer) => (
            <li key={layer.id}>
              <div className={styles.layerRow} data-active={layer.id === activeLayerId}>
                <button
                  type="button"
                  className={styles.layerButton}
                  onClick={() => onSelectLayer(layer.id)}
                  aria-pressed={layer.id === activeLayerId}
                >
                  <span
                    className={styles.layerSwatch}
                    style={{ background: layer.hex, color: readableInkOn(layer.hex) }}
                    aria-hidden="true"
                  />
                  <span className={styles.layerMeta}>
                    <span className={styles.layerLabel}>{layer.label}</span>
                    <span className={styles.layerColor}>
                      {layer.colorName} · {layer.hex.toUpperCase()}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.iconButton}
                  onClick={() => onRemoveLayer(layer.id)}
                  aria-label={`Remove ${layer.label}`}
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {activeLayer && (
        <div className={styles.field}>
          <label htmlFor="layer-opacity" className={styles.fieldLabel}>
            {activeLayer.label} coverage — {Math.round(activeLayer.opacity * 100)}%
          </label>
          <input
            id="layer-opacity"
            type="range"
            min={20}
            max={100}
            value={Math.round(activeLayer.opacity * 100)}
            onChange={(event) =>
              onOpacityChange(activeLayer.id, Number(event.target.value) / 100, false)
            }
            onPointerUp={(event) =>
              onOpacityChange(
                activeLayer.id,
                Number((event.target as HTMLInputElement).value) / 100,
                true
              )
            }
            className={styles.slider}
          />
        </div>
      )}
    </section>
  );
}
