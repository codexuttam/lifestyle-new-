"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { MEDIA_FOLDERS, type MediaRecord } from "@/lib/schemas/media";
import styles from "../../admin.module.css";
import { uploadToBunny } from "./upload";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function MediaLibrary({ initial }: { initial: MediaRecord[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState(initial);
  const [folder, setFolder] = useState<MediaRecord["folder"]>("projects");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError(null);

    const uploaded: MediaRecord[] = [];
    for (const [index, file] of Array.from(files).entries()) {
      setProgress(`Uploading ${index + 1} of ${files.length}: ${file.name}`);
      try {
        uploaded.push(await uploadToBunny(file, folder));
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Upload failed.");
        break;
      }
    }

    setItems((current) => [...uploaded, ...current]);
    setProgress(null);
    setBusy(false);
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  }

  async function remove(item: MediaRecord) {
    if (!window.confirm("Delete this file? Anything using it will break.")) {
      return;
    }

    const response = await fetch(`/api/admin/media/${item.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Could not delete that file.");
      return;
    }

    setItems((current) => current.filter((entry) => entry.id !== item.id));
    router.refresh();
  }

  async function copy(url: string) {
    await navigator.clipboard.writeText(url);
    setProgress("URL copied.");
    window.setTimeout(() => setProgress(null), 1500);
  }

  return (
    <>
      <div className={styles.uploadBar}>
        <select
          className={styles.select}
          value={folder}
          onChange={(event) =>
            setFolder(event.target.value as MediaRecord["folder"])
          }
          disabled={busy}
        >
          {MEDIA_FOLDERS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/mp4,video/webm"
          onChange={(event) => onFiles(event.target.files)}
          disabled={busy}
        />

        {progress && <span className={styles.hint}>{progress}</span>}
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {items.length === 0 ? (
        <p className={styles.empty}>
          Nothing uploaded yet. Files go straight to Bunny and are served from
          the CDN.
        </p>
      ) : (
        <div className={styles.mediaGrid}>
          {items.map((item) => (
            <figure className={styles.mediaCard} key={item.id}>
              {item.contentType.startsWith("video/") ? (
                <video className={styles.mediaThumb} src={item.url} muted />
              ) : (
                <img className={styles.mediaThumb} src={item.url} alt={item.alt} />
              )}

              <figcaption className={styles.mediaMeta}>
                <span className={styles.mediaPath}>{item.path}</span>
                <span className={styles.hint}>
                  {formatBytes(item.bytes)}
                  {item.width && item.height
                    ? ` · ${item.width}×${item.height}`
                    : ""}
                </span>
              </figcaption>

              <div className={styles.mediaActions}>
                <button
                  type="button"
                  className={styles.iconBtn}
                  onClick={() => copy(item.url)}
                  title="Copy URL"
                >
                  ⧉
                </button>
                <button
                  type="button"
                  className={styles.dangerBtn}
                  onClick={() => remove(item)}
                >
                  Delete
                </button>
              </div>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
