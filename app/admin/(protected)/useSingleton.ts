"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Shared save behaviour for the singleton editors (home, company, settings).
 *
 * Validation lives in the zod schema on the server, so a payload that would
 * break a layout is rejected there rather than trusted from the browser; this
 * just surfaces which fields it complained about.
 */
export function useSingleton<T>(doc: string, initial: T) {
  const router = useRouter();
  const [draft, setDraft] = useState<T>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function patch(next: Partial<T>) {
    setDraft((current) => ({ ...current, ...next }));
    setSaved(false);
  }

  async function save() {
    setBusy(true);
    setError(null);
    setSaved(false);

    const response = await fetch(`/api/admin/singleton/${doc}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    setBusy(false);

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(
        body.issues
          ? body.issues
              .map(
                (issue: { path: string[]; message: string }) =>
                  `${issue.path.join(".")}: ${issue.message}`
              )
              .join("; ")
          : (body.error ?? "Could not save.")
      );
      return;
    }

    setSaved(true);
    router.refresh();
  }

  return { draft, setDraft, patch, save, busy, error, saved };
}
