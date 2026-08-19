"use client";

import { useEffect, useRef, useState } from "react";

import type { MediaRecord } from "@/lib/schemas/media";
import styles from "../admin.module.css";
import { uploadToBunny } from "./media/upload";

/**
 * A URL field that can also browse the library or upload on the spot.
 *
 * The value stays a plain URL string rather than a media id, so existing
 * `/images/...` paths keep working and nothing breaks if a record is removed
 * from the library.
 */
export default function MediaPicker({
  label,
  value,
  onChange,
  folder = "uploads",
  hint,
  accept = "image/*",
  required,
  id,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: MediaRecord["folder"];
  hint?: string;
  accept?: string;
  required?: boolean;
  id: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [browsing, setBrowsing] = useState(false);
  const [library, setLibrary] = useState<MediaRecord[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!browsing || library) return;
    let cancelled = false;

    fetch("/api/admin/media/list")
      .then((response) => (response.ok ? response.json() : { media: [] }))
      .then((body) => {
        if (!cancelled) setLibrary(body.media ?? []);
      })
      .catch(() => {
        if (!cancelled) setLibrary([]);
      });

    return () => {
      cancelled = true;
    };
  }, [browsing, library]);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    setError(null);

    try {
      const record = await uploadToBunny(file, folder);
      onChange(record.url);
      setLibrary((current) => (current ? [record, ...current] : current));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  const isVideo = /\.(mp4|webm)(\?|$)/i.test(value);

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>

      <div className={styles.pickerRow}>
        {value ? (
          isVideo ? (
            <video className={styles.pickerPreview} src={value} muted />
          ) : (
            <img className={styles.pickerPreview} src={value} alt="" />
          )
        ) : (
          <span className={styles.pickerPreview} aria-hidden="true" />
        )}

        <input
          id={id}
          className={`${styles.input} ${styles.pickerInput}`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          required={required}
        />

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => setBrowsing(true)}
        >
          Browse
        </button>

        <button
          type="button"
          className={styles.secondaryBtn}
          onClick={() => fileRef.current?.click()}
          disabled={busy}
        >
          {busy ? "Uploading..." : "Upload"}
        </button>

        <input
          ref={fileRef}
          type="file"
          accept={accept}
          hidden
          onChange={(event) => onFile(event.target.files?.[0])}
        />
      </div>

      {hint && <span className={styles.hint}>{hint}</span>}
      {error && <p className={styles.error}>{error}</p>}

      {browsing && (
        <div
          className={styles.dialog}
          role="dialog"
          aria-modal="true"
          aria-label="Choose a file"
          onClick={() => setBrowsing(false)}
        >
          <div
            className={styles.dialogPanel}
            onClick={(event) => event.stopPropagation()}
          >
            <div className={styles.dialogHead}>
              <strong>Media library</strong>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() => setBrowsing(false)}
              >
                Close
              </button>
            </div>

            {library === null ? (
              <p className={styles.empty}>Loading...</p>
            ) : library.length === 0 ? (
              <p className={styles.empty}>
                Nothing in the library yet. Use Upload to add the first file.
              </p>
            ) : (
              <div className={styles.pickGrid}>
                {library.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={styles.pickItem}
                    onClick={() => {
                      onChange(item.url);
                      setBrowsing(false);
                    }}
                  >
                    {item.contentType.startsWith("video/") ? (
                      <video className={styles.mediaThumb} src={item.url} muted />
                    ) : (
                      <img
                        className={styles.mediaThumb}
                        src={item.url}
                        alt={item.alt}
                      />
                    )}
                    <span className={styles.mediaPath}>{item.path}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
