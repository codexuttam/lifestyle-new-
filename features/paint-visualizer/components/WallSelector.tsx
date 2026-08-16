"use client";

import type { BlankSurface } from "../lib/blankRoom";
import type { PaintLayer } from "../types";
import styles from "./PaintVisualizer.module.css";

interface WallSelectorProps {
  surfaces: BlankSurface[];
  layers: PaintLayer[];
  activeLayerId: string | null;
  onPick: (surfaceId: string) => void;
}

/** Buttons mirror where each surface sits in the view: ceiling above, walls below. */
const GRID_AREA: Record<string, string> = {
  ceiling: "ceiling",
  "left-wall": "left",
  "front-wall": "front",
  "right-wall": "right",
};

/**
 * One button per surface of the generated blank room. Picking a surface
 * fills it with the active colour immediately; its swatch then tracks the
 * applied paint so the panel doubles as a colour legend.
 */
export default function WallSelector({
  surfaces,
  layers,
  activeLayerId,
  onPick,
}: WallSelectorProps) {
  if (surfaces.length === 0) return null;

  return (
    <section className={styles.panel} aria-labelledby="wall-heading">
      <h3 id="wall-heading" className={styles.panelTitle}>
        Choose a surface
      </h3>
      <p className={styles.panelHint}>
        Tap a surface below (or click it in the room) and it fills with the
        selected colour. Pick a different colour to repaint it.
      </p>

      <div className={styles.wallGrid} role="group" aria-label="Room surfaces">
        {surfaces.map((surface) => {
          const layer = layers.find((l) => l.id === `blank-${surface.id}`) ?? null;
          const isActive = layer !== null && layer.id === activeLayerId;
          return (
            <button
              key={surface.id}
              type="button"
              className={styles.wallButton}
              style={{ gridArea: GRID_AREA[surface.id] }}
              data-active={isActive}
              aria-pressed={isActive}
              onClick={() => onPick(surface.id)}
            >
              <span
                className={styles.wallSwatch}
                style={{ background: layer?.hex ?? "#f4f2ed" }}
                aria-hidden="true"
              />
              <span className={styles.wallLabel}>{surface.label}</span>
              <span className={styles.wallStatus}>
                {layer ? layer.hex.toUpperCase() : "Unpainted"}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
