"use client";

import { useCallback, useEffect, useState } from "react";
import { SHORTLIST_LIMIT, SHORTLIST_STORAGE_KEY } from "../constants";
import type { ShortlistEntry } from "../types";
import { normalizeHex } from "../lib/color";

function readStorage(): ShortlistEntry[] {
  try {
    const raw = window.localStorage.getItem(SHORTLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((entry): entry is ShortlistEntry => {
        if (typeof entry !== "object" || entry === null) return false;
        const candidate = entry as Partial<ShortlistEntry>;
        return (
          typeof candidate.hex === "string" &&
          typeof candidate.name === "string" &&
          normalizeHex(candidate.hex) !== null
        );
      })
      .slice(0, SHORTLIST_LIMIT);
  } catch {
    return [];
  }
}

/**
 * Colours the visitor has saved, persisted locally.
 *
 * Hydration-safe: the list starts empty on the server and on the first client
 * render, then fills from storage in an effect, so the markup always matches.
 */
export function useShortlist() {
  const [entries, setEntries] = useState<ShortlistEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setEntries(readStorage());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SHORTLIST_STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Storage full or blocked (private mode) — the feature degrades to
      // in-memory only, which is acceptable.
    }
  }, [entries, hydrated]);

  const has = useCallback(
    (hex: string) => entries.some((entry) => entry.hex === hex.toLowerCase()),
    [entries]
  );

  const toggle = useCallback((hex: string, name: string) => {
    const normalized = normalizeHex(hex);
    if (!normalized) return;

    setEntries((current) => {
      if (current.some((entry) => entry.hex === normalized)) {
        return current.filter((entry) => entry.hex !== normalized);
      }
      const next: ShortlistEntry = { hex: normalized, name, addedAt: Date.now() };
      return [next, ...current].slice(0, SHORTLIST_LIMIT);
    });
  }, []);

  const remove = useCallback((hex: string) => {
    setEntries((current) => current.filter((entry) => entry.hex !== hex));
  }, []);

  const clear = useCallback(() => setEntries([]), []);

  return { entries, has, toggle, remove, clear, hydrated };
}
