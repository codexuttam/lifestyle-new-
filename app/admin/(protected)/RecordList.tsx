"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import styles from "../admin.module.css";

/**
 * One row, already reduced to strings by the server page.
 *
 * Deliberately plain data rather than render callbacks: this is a client
 * component, and functions cannot cross the server/client boundary.
 */
export type ListRow = {
  id: string;
  label: string;
  /** Optional pill shown before the meta line, e.g. a category. */
  tag?: string;
  meta?: string;
  href: string;
  published?: boolean;
};

/**
 * Shared list chrome for every collection: reorder, edit link, delete.
 *
 * Reordering uses move-up/move-down buttons rather than drag-and-drop — no
 * extra dependency, and it stays usable from the keyboard. The whole order is
 * persisted in one request so positions cannot drift apart.
 */
export default function RecordList({
  collection,
  initial,
  emptyLabel,
}: {
  collection: string;
  initial: ListRow[];
  emptyLabel: string;
}) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persistOrder(next: ListRow[]) {
    const previous = rows;
    setRows(next);
    setBusy(true);
    setError(null);

    const response = await fetch(`/api/admin/content/${collection}/reorder`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((row) => row.id) }),
    });

    setBusy(false);
    if (!response.ok) {
      setRows(previous);
      setError("Could not save the new order.");
      return;
    }
    router.refresh();
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    void persistOrder(next);
  }

  async function remove(row: ListRow) {
    if (!window.confirm(`Delete "${row.label}"? This cannot be undone.`)) {
      return;
    }

    setBusy(true);
    const response = await fetch(
      `/api/admin/content/${collection}/${row.id}`,
      { method: "DELETE" }
    );
    setBusy(false);

    if (!response.ok) {
      setError("Could not delete that.");
      return;
    }

    setRows((current) => current.filter((entry) => entry.id !== row.id));
    router.refresh();
  }

  if (rows.length === 0) {
    return <p className={styles.empty}>{emptyLabel}</p>;
  }

  return (
    <>
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.list}>
        {rows.map((row, index) => (
          <div className={styles.row} key={row.id}>
            <div className={styles.rowMain}>
              <Link href={row.href} className={styles.rowTitle}>
                {row.label}
              </Link>
              <div className={styles.rowMeta}>
                {row.tag && <span className={styles.tag}>{row.tag}</span>}{" "}
                {row.meta}
                {row.published === false && (
                  <>
                    {" "}
                    <span className={`${styles.tag} ${styles.tagDraft}`}>
                      Draft
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className={styles.rowActions}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, -1)}
                disabled={busy || index === 0}
                aria-label={`Move ${row.label} up`}
              >
                ↑
              </button>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => move(index, 1)}
                disabled={busy || index === rows.length - 1}
                aria-label={`Move ${row.label} down`}
              >
                ↓
              </button>
              <button
                type="button"
                className={styles.dangerBtn}
                onClick={() => remove(row)}
                disabled={busy}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
