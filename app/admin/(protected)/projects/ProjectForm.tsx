"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { PROJECT_CATEGORIES } from "@/data/projects";
import type { ProjectRecord } from "@/lib/schemas/project";
import styles from "../../admin.module.css";
import MediaPicker from "../MediaPicker";

const STATUSES = ["Delivered", "In Progress"] as const;

const BLANK: ProjectRecord = {
  id: "",
  title: "",
  category: "Residential",
  status: "Delivered",
  location: "",
  year: "",
  price: "",
  beds: "",
  baths: "",
  area: "",
  img: "",
  summary: "",
  order: 0,
  published: true,
};

/** Turn a title into a usable document id. */
function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ProjectForm({
  project,
  mode,
}: {
  project?: ProjectRecord;
  mode: "create" | "edit";
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectRecord>(project ?? BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ProjectRecord>(key: K, value: ProjectRecord[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { id, ...fields } = draft;
    const documentId = mode === "create" ? id || slugify(draft.title) : id;

    const response = await fetch(
      mode === "create"
        ? "/api/admin/content/projects"
        : `/api/admin/content/projects/${documentId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        // On create the id is part of the body; on update it travels in the URL.
        body: JSON.stringify(
          mode === "create" ? { ...fields, id: documentId } : fields
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

    router.push("/admin/projects");
    router.refresh();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGrid}>
        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="title">
            Title
          </label>
          <input
            id="title"
            className={styles.input}
            value={draft.title}
            onChange={(event) => set("title", event.target.value)}
            required
          />
        </div>

        {mode === "create" && (
          <div className={`${styles.field} ${styles.formGridFull}`}>
            <label className={styles.label} htmlFor="id">
              URL id
            </label>
            <input
              id="id"
              className={styles.input}
              value={draft.id}
              onChange={(event) => set("id", event.target.value)}
              placeholder={slugify(draft.title) || "casa-meridian"}
            />
            <span className={styles.hint}>
              Lowercase letters, numbers and hyphens. Left blank, it is derived
              from the title. It cannot be changed later.
            </span>
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="category">
            Category
          </label>
          <select
            id="category"
            className={styles.select}
            value={draft.category}
            onChange={(event) =>
              set("category", event.target.value as ProjectRecord["category"])
            }
          >
            {PROJECT_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className={styles.select}
            value={draft.status}
            onChange={(event) =>
              set("status", event.target.value as ProjectRecord["status"])
            }
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="location">
            Location
          </label>
          <input
            id="location"
            className={styles.input}
            value={draft.location}
            onChange={(event) => set("location", event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="year">
            Year
          </label>
          <input
            id="year"
            className={styles.input}
            value={draft.year}
            onChange={(event) => set("year", event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="price">
            Price
          </label>
          <input
            id="price"
            className={styles.input}
            value={draft.price}
            onChange={(event) => set("price", event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="area">
            Area
          </label>
          <input
            id="area"
            className={styles.input}
            value={draft.area}
            onChange={(event) => set("area", event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="beds">
            Beds
          </label>
          <input
            id="beds"
            className={styles.input}
            value={draft.beds}
            onChange={(event) => set("beds", event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="baths">
            Baths
          </label>
          <input
            id="baths"
            className={styles.input}
            value={draft.baths}
            onChange={(event) => set("baths", event.target.value)}
            required
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="img"
            label="Cover image"
            value={draft.img}
            onChange={(url) => set("img", url)}
            folder="projects"
            required
          />
        </div>

        <div className={styles.formGridFull}>
          <MediaPicker
            id="video"
            label="Walkthrough video"
            value={draft.video ?? ""}
            onChange={(url) => set("video", url || undefined)}
            folder="projects"
            accept="video/mp4,video/webm"
            hint="Optional. Projects with a video appear in the homepage carousel."
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="summary">
            Summary
          </label>
          <textarea
            id="summary"
            className={styles.textarea}
            value={draft.summary}
            onChange={(event) => set("summary", event.target.value)}
            required
          />
        </div>

        <label className={`${styles.checkboxRow} ${styles.formGridFull}`}>
          <input
            type="checkbox"
            checked={draft.published}
            onChange={(event) => set("published", event.target.checked)}
          />
          Published — visible on the site
        </label>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy
            ? "Saving..."
            : mode === "create"
              ? "Create project"
              : "Save changes"}
        </button>
        <Link href="/admin/projects" className={styles.linkBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
