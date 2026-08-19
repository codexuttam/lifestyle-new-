"use client";

import styles from "../../admin.module.css";

export type Option = { id: string; label: string };

/**
 * Ordered selection from a fixed set of records.
 *
 * Checking an option appends it, so the order shown is the order it was picked;
 * the arrows adjust it afterwards. `required` is advisory here — the schema on
 * the server is what actually refuses a selection that would break the layout.
 */
export default function IdPicker({
  label,
  hint,
  options,
  value,
  onChange,
  required,
}: {
  label: string;
  hint?: string;
  options: Option[];
  value: string[];
  onChange: (next: string[]) => void;
  /** Exact count the layout needs, if it is fixed. */
  required?: number;
}) {
  const chosen = value
    .map((id) => options.find((option) => option.id === id))
    .filter((option): option is Option => Boolean(option));

  const missing = value.filter(
    (id) => !options.some((option) => option.id === id)
  );

  function toggle(id: string) {
    onChange(
      value.includes(id)
        ? value.filter((entry) => entry !== id)
        : [...value, id]
    );
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= value.length) return;
    const next = [...value];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  const countOff = required !== undefined && value.length !== required;

  return (
    <div className={`${styles.field} ${styles.formGridFull}`}>
      <span className={styles.label}>{label}</span>
      {hint && <span className={styles.hint}>{hint}</span>}

      {chosen.length > 0 && (
        <ol className={styles.chosenList}>
          {chosen.map((option, index) => (
            <li className={styles.chosenItem} key={option.id}>
              <span className={styles.chosenIndex}>{index + 1}</span>
              <span className={styles.rowMain}>{option.label}</span>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, -1)}
                disabled={index === 0}
                aria-label={`Move ${option.label} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, 1)}
                disabled={index === chosen.length - 1}
                aria-label={`Move ${option.label} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => toggle(option.id)}
                aria-label={`Remove ${option.label}`}
              >
                ×
              </button>
            </li>
          ))}
        </ol>
      )}

      {missing.length > 0 && (
        <p className={styles.notice}>
          No longer available: {missing.join(", ")}. These were deleted or
          unpublished — remove them and pick replacements.
        </p>
      )}

      {countOff && (
        <p className={styles.notice}>
          This section needs exactly {required}; {value.length} selected. Saving
          will be refused until that matches.
        </p>
      )}

      <details className={styles.picker}>
        <summary className={styles.pickerSummary}>Choose</summary>
        <div className={styles.pickerOptions}>
          {options.map((option) => (
            <label className={styles.checkboxRow} key={option.id}>
              <input
                type="checkbox"
                checked={value.includes(option.id)}
                onChange={() => toggle(option.id)}
              />
              {option.label}
            </label>
          ))}
        </div>
      </details>
    </div>
  );
}
