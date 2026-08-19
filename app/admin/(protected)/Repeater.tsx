"use client";

import type { ReactNode } from "react";

import styles from "../admin.module.css";

/**
 * Generic list editor: add, remove, reorder. The caller renders the fields for
 * one entry, so the same component serves stats, milestones, values, process
 * steps, social links and the about cards.
 */
export default function Repeater<T>({
  label,
  items,
  onChange,
  blank,
  renderItem,
  addLabel = "Add",
  /** Fixed-length lists (like the three about cards) hide add/remove. */
  fixedLength = false,
}: {
  label: string;
  items: T[];
  onChange: (next: T[]) => void;
  blank: () => T;
  renderItem: (item: T, update: (patch: Partial<T>) => void, index: number) => ReactNode;
  addLabel?: string;
  fixedLength?: boolean;
}) {
  function update(index: number, patch: Partial<T>) {
    onChange(
      items.map((item, i) => (i === index ? { ...item, ...patch } : item))
    );
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className={`${styles.field} ${styles.formGridFull}`}>
      <span className={styles.label}>{label}</span>

      <div className={styles.repeaterStack}>
        {items.map((item, index) => (
          <div className={styles.repeaterGroup} key={index}>
            {renderItem(item, (patch) => update(index, patch), index)}

            <div className={styles.rowActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${label} item ${index + 1} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, 1)}
                disabled={index === items.length - 1}
                aria-label={`Move ${label} item ${index + 1} down`}
              >
                ↓
              </button>
              {!fixedLength && (
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() =>
                    onChange(items.filter((_, i) => i !== index))
                  }
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!fixedLength && (
        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => onChange([...items, blank()])}
        >
          {addLabel}
        </button>
      )}
    </div>
  );
}
