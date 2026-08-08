"use client";

import { useState } from "react";
import { PAINT_COLLECTIONS } from "../data/palette";
import { readableInkOn } from "../lib/color";
import type { PaintColor } from "../types";
import styles from "./PaintVisualizer.module.css";

interface ColorPaletteProps {
  activeHex: string;
  onSelect: (color: PaintColor) => void;
  onCustomHex: (hex: string) => void;
}

/** The catalogue browser: collections, swatches, and a custom picker. */
export default function ColorPalette({
  activeHex,
  onSelect,
  onCustomHex,
}: ColorPaletteProps) {
  const [openCollection, setOpenCollection] = useState(PAINT_COLLECTIONS[0].id);

  return (
    <section className={styles.panel} aria-labelledby="palette-heading">
      <h3 id="palette-heading" className={styles.panelTitle}>
        Choose a colour
      </h3>

      <div className={styles.tabRow} role="tablist" aria-label="Paint collections">
        {PAINT_COLLECTIONS.map((collection) => (
          <button
            key={collection.id}
            type="button"
            role="tab"
            aria-selected={openCollection === collection.id}
            aria-controls={`collection-${collection.id}`}
            className={styles.tab}
            data-active={openCollection === collection.id}
            onClick={() => setOpenCollection(collection.id)}
          >
            {collection.name}
          </button>
        ))}
      </div>

      {PAINT_COLLECTIONS.filter((collection) => collection.id === openCollection).map(
        (collection) => (
          <div
            key={collection.id}
            id={`collection-${collection.id}`}
            role="tabpanel"
            aria-label={collection.name}
          >
            <p className={styles.panelHint}>{collection.description}</p>
            <ul className={styles.swatchGrid}>
              {collection.colors.map((color) => {
                const selected = color.hex === activeHex;
                return (
                  <li key={color.id}>
                    <button
                      type="button"
                      className={styles.swatch}
                      style={{ background: color.hex, color: readableInkOn(color.hex) }}
                      data-selected={selected}
                      aria-pressed={selected}
                      onClick={() => onSelect(color)}
                    >
                      <span className={styles.swatchName}>{color.name}</span>
                      <span className={styles.swatchHex}>{color.hex.toUpperCase()}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )
      )}

      <div className={styles.customRow}>
        <label htmlFor="custom-color" className={styles.fieldLabel}>
          Or pick your own
        </label>
        <div className={styles.customControls}>
          <input
            id="custom-color"
            type="color"
            value={activeHex}
            onChange={(event) => onCustomHex(event.target.value)}
            className={styles.colorInput}
          />
          <input
            type="text"
            value={activeHex.toUpperCase()}
            onChange={(event) => onCustomHex(event.target.value)}
            className={styles.hexInput}
            spellCheck={false}
            aria-label="Custom colour hex code"
          />
        </div>
      </div>
    </section>
  );
}
