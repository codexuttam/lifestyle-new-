"use client";

import { useCopyToClipboard } from "../hooks/useCopyToClipboard";
import { readableInkOn } from "../lib/color";
import type { ShortlistEntry } from "../types";
import styles from "./PaintVisualizer.module.css";

interface ShortlistBarProps {
  entries: ShortlistEntry[];
  onApply: (hex: string) => void;
  onRemove: (hex: string) => void;
  onClear: () => void;
}

/** Saved colours, persisted across visits. */
export default function ShortlistBar({
  entries,
  onApply,
  onRemove,
  onClear,
}: ShortlistBarProps) {
  const { copy, copiedKey } = useCopyToClipboard();

  if (entries.length === 0) return null;

  const allCodes = entries
    .map((entry) => `${entry.name} — ${entry.hex.toUpperCase()}`)
    .join("\n");

  return (
    <section className={styles.shortlist} aria-labelledby="shortlist-heading">
      <div className={styles.shortlistHeader}>
        <h3 id="shortlist-heading" className={styles.panelTitle}>
          Your shortlist ({entries.length})
        </h3>
        <div className={styles.shortlistActions}>
          <button
            type="button"
            className={styles.linkButton}
            onClick={() => void copy(allCodes, "shortlist")}
          >
            {copiedKey === "shortlist" ? "Copied" : "Copy all codes"}
          </button>
          <button type="button" className={styles.linkButton} onClick={onClear}>
            Clear
          </button>
        </div>
      </div>

      <ul className={styles.shortlistRow}>
        {entries.map((entry) => (
          <li key={entry.hex} className={styles.shortlistItem}>
            <button
              type="button"
              className={styles.shortlistSwatch}
              style={{ background: entry.hex, color: readableInkOn(entry.hex) }}
              onClick={() => onApply(entry.hex)}
              title={`Apply ${entry.name}`}
            >
              <span>{entry.name}</span>
              <span className={styles.shortlistHex}>{entry.hex.toUpperCase()}</span>
            </button>
            <button
              type="button"
              className={styles.iconButton}
              onClick={() => onRemove(entry.hex)}
              aria-label={`Remove ${entry.name} from shortlist`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
