"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import type { MediaRecord } from "@/lib/schemas/media";
import styles from "../admin.module.css";
import MediaPicker from "./MediaPicker";

export type SimpleField = {
  key: string;
  label: string;
  type: "text" | "textarea" | "media";
  hint?: string;
  folder?: MediaRecord["folder"];
  accept?: string;
  full?: boolean;
};

type Draft = Record<string, unknown> & { id: string; published?: boolean };

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .slice(0, 5)
    .join("-");
}

/**
 * Field-driven form for the flat collections — testimonials, FAQs, gallery.
 * They differ only in which text fields they carry, so declaring the fields
 * beats writing the same component three more times.
 */
export default function SimpleForm({
  collection,
  fields,
  record,
  mode,
  idSourceKey,
  returnTo,
}: {
  collection: string;
  fields: SimpleField[];
  record?: Draft;
  mode: "create" | "edit";
  /** Field whose value seeds the document id on create. */
  idSourceKey: string;
  returnTo: string;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(
    record ??
      ({
        id: "",
        published: true,
        ...Object.fromEntries(fields.map((field) => [field.key, ""])),
      } as Draft)
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, value: unknown) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { id, ...rest } = draft;
    const documentId =
      mode === "create"
        ? id || slugify(String(draft[idSourceKey] ?? "")) || `item-${Date.now()}`
        : id;

    const response = await fetch(
      mode === "create"
        ? `/api/admin/content/${collection}`
        : `/api/admin/content/${collection}/${documentId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "create" ? { ...rest, id: documentId } : rest
        ),
      }
    );

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      setError(
        body.issues
          ? `Check these fields: ${body.issues
              .map((issue: { path: string[] }) => issue.path.join("."))
              .join(", ")}`
          : (body.error ?? "Could not save.")
      );
      setBusy(false);
      return;
    }

    router.push(returnTo);
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        {fields.map((field) => {
          const value = String(draft[field.key] ?? "");
          const wrapper = field.full === false ? styles.field : `${styles.field} ${styles.formGridFull}`;

          if (field.type === "media") {
            return (
              <div className={styles.formGridFull} key={field.key}>
                <MediaPicker
                  id={field.key}
                  label={field.label}
                  value={value}
                  onChange={(url) => set(field.key, url)}
                  folder={field.folder}
                  accept={field.accept}
                  hint={field.hint}
                  required
                />
              </div>
            );
          }

          return (
            <div className={wrapper} key={field.key}>
              <label className={styles.label} htmlFor={field.key}>
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  id={field.key}
                  className={styles.textarea}
                  value={value}
                  onChange={(event) => set(field.key, event.target.value)}
                  required
                />
              ) : (
                <input
                  id={field.key}
                  className={styles.input}
                  value={value}
                  onChange={(event) => set(field.key, event.target.value)}
                  required
                />
              )}
              {field.hint && <span className={styles.hint}>{field.hint}</span>}
            </div>
          );
        })}

        <label className={`${styles.checkboxRow} ${styles.formGridFull}`}>
          <input
            type="checkbox"
            checked={draft.published !== false}
            onChange={(event) => set("published", event.target.checked)}
          />
          Published — visible on the site
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? "Saving..." : mode === "create" ? "Create" : "Save changes"}
        </button>
        <Link href={returnTo} className={styles.linkBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
