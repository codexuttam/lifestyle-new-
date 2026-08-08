"use client";

import { useCallback, useRef, useState, type RefObject } from "react";
import type { ToolMode } from "../hooks/usePaintVisualizer";
import styles from "./PaintVisualizer.module.css";

interface RoomCanvasProps {
  paintedCanvasRef: RefObject<HTMLCanvasElement | null>;
  originalCanvasRef: RefObject<HTMLCanvasElement | null>;
  width: number;
  height: number;
  status: "loading" | "ready" | "error";
  tool: ToolMode;
  onSelect: (point: { x: number; y: number }) => void;
}

/**
 * The stage: the painted canvas, the untouched original clipped to a
 * draggable divider, and the click surface that drives selection.
 */
export default function RoomCanvas({
  paintedCanvasRef,
  originalCanvasRef,
  width,
  height,
  status,
  tool,
  onSelect,
}: RoomCanvasProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(0);
  const [dragging, setDragging] = useState(false);

  /** Maps a viewport point onto a pixel coordinate in the source image. */
  const toImagePoint = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = paintedCanvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return null;

      return {
        x: ((clientX - rect.left) / rect.width) * canvas.width,
        y: ((clientY - rect.top) / rect.height) * canvas.height,
      };
    },
    [paintedCanvasRef]
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (status !== "ready") return;
      const point = toImagePoint(event.clientX, event.clientY);
      if (point) onSelect(point);
    },
    [onSelect, status, toImagePoint]
  );

  /** Keyboard fallback: Enter paints the centre of the frame. */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLCanvasElement>) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      const canvas = paintedCanvasRef.current;
      if (!canvas || status !== "ready") return;
      onSelect({ x: canvas.width / 2, y: canvas.height / 2 });
    },
    [onSelect, paintedCanvasRef, status]
  );

  const updateSplitFromPointer = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const ratio = ((clientX - rect.left) / rect.width) * 100;
    setSplit(Math.min(100, Math.max(0, ratio)));
  }, []);

  const aspectRatio = width > 0 && height > 0 ? `${width} / ${height}` : "16 / 10";

  return (
    <div className={styles.stage}>
      <div
        className={styles.canvasFrame}
        ref={frameRef}
        style={{ aspectRatio }}
        onPointerMove={(event) => {
          if (dragging) updateSplitFromPointer(event.clientX);
        }}
        onPointerUp={() => setDragging(false)}
        onPointerLeave={() => setDragging(false)}
      >
        <canvas
          ref={paintedCanvasRef}
          className={styles.canvas}
          data-tool={tool}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="img"
          aria-label={
            tool === "paint"
              ? "Room preview. Click a wall to paint it."
              : "Room preview. Click a painted wall to remove its colour."
          }
        />

        {/* Untouched original, revealed from the left by the divider. */}
        <canvas
          ref={originalCanvasRef}
          className={styles.originalCanvas}
          aria-hidden="true"
          style={{
            clipPath: `inset(0 ${100 - split}% 0 0)`,
            visibility: split > 0 ? "visible" : "hidden",
          }}
        />

        {split > 0 && (
          <div className={styles.divider} style={{ left: `${split}%` }} aria-hidden="true">
            <span className={styles.dividerLabel}>Before</span>
          </div>
        )}

        {status === "loading" && (
          <div className={styles.canvasOverlay}>
            <span className={styles.spinner} aria-hidden="true" />
            <p>Loading room…</p>
          </div>
        )}
      </div>

      <div className={styles.compareRow}>
        <label htmlFor="compare-slider" className={styles.compareLabel}>
          Compare with original
        </label>
        <input
          id="compare-slider"
          type="range"
          min={0}
          max={100}
          step={1}
          value={split}
          onChange={(event) => setSplit(Number(event.target.value))}
          onPointerDown={() => setDragging(true)}
          className={styles.slider}
          aria-valuetext={`${Math.round(split)} percent original`}
        />
        <span className={styles.compareValue}>{Math.round(split)}%</span>
      </div>
    </div>
  );
}
