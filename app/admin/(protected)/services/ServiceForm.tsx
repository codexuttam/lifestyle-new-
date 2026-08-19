"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { SERVICE_CATEGORIES, SERVICE_ICON_KEYS } from "@/data/services";
import type { ServiceRecord } from "@/lib/schemas/service";
import styles from "../../admin.module.css";

const BLANK: ServiceRecord = {
  id: "",
  title: "",
  category: "Construction",
  icon: "house",
  text: "",
  includes: [""],
  startingAt: "",
  timeline: "",
  featured: false,
  order: 0,
  published: true,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function ServiceForm({
  service,
  mode,
  featuredCount,
}: {
  service?: ServiceRecord;
  mode: "create" | "edit";
  featuredCount: number;
}) {
  const router = useRouter();
  const [draft, setDraft] = useState<ServiceRecord>(service ?? BLANK);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof ServiceRecord>(key: K, value: ServiceRecord[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function setInclude(index: number, value: string) {
    setDraft((current) => {
      const includes = [...current.includes];
      includes[index] = value;
      return { ...current, includes };
    });
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    const { id, ...fields } = draft;
    const documentId = mode === "create" ? id || slugify(draft.title) : id;
    const payload = {
      ...fields,
      includes: fields.includes.map((line) => line.trim()).filter(Boolean),
    };

    const response = await fetch(
      mode === "create"
        ? "/api/admin/content/services"
        : `/api/admin/content/services/${documentId}`,
      {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          mode === "create" ? { ...payload, id: documentId } : payload
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

    router.push("/admin/services");
    router.refresh();
  }

  // The homepage grid animates exactly four cards, so warn before a fifth.
  const wouldOverfillHomepage =
    draft.featured &&
    !service?.featured &&
    featuredCount >= 4;

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
              placeholder={slugify(draft.title) || "new-home-construction"}
            />
            <span className={styles.hint}>
              Left blank, it is derived from the title. It cannot be changed
              later.
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
              set("category", event.target.value as ServiceRecord["category"])
            }
          >
            {SERVICE_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="icon">
            Icon
          </label>
          <select
            id="icon"
            className={styles.select}
            value={draft.icon}
            onChange={(event) =>
              set("icon", event.target.value as ServiceRecord["icon"])
            }
          >
            {SERVICE_ICON_KEYS.map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </select>
          <span className={styles.hint}>
            One of the icons registered in ServiceIcons.tsx.
          </span>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="startingAt">
            Starting at
          </label>
          <input
            id="startingAt"
            className={styles.input}
            value={draft.startingAt}
            onChange={(event) => set("startingAt", event.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="timeline">
            Typical timeline
          </label>
          <input
            id="timeline"
            className={styles.input}
            value={draft.timeline}
            onChange={(event) => set("timeline", event.target.value)}
            required
          />
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <label className={styles.label} htmlFor="text">
            Short description
          </label>
          <textarea
            id="text"
            className={styles.textarea}
            value={draft.text}
            onChange={(event) => set("text", event.target.value)}
            required
          />
          <span className={styles.hint}>
            Used on the homepage card and the services page.
          </span>
        </div>

        <div className={`${styles.field} ${styles.formGridFull}`}>
          <span className={styles.label}>What is included</span>
          {draft.includes.map((line, index) => (
            <div className={styles.repeaterRow} key={index}>
              <input
                className={styles.input}
                value={line}
                onChange={(event) => setInclude(index, event.target.value)}
                aria-label={`Inclusion ${index + 1}`}
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    includes: current.includes.filter((_, i) => i !== index),
                  }))
                }
                aria-label={`Remove inclusion ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() =>
              setDraft((current) => ({
                ...current,
                includes: [...current.includes, ""],
              }))
            }
          >
            Add a line
          </button>
        </div>

        <label className={`${styles.checkboxRow} ${styles.formGridFull}`}>
          <input
            type="checkbox"
            checked={draft.featured ?? false}
            onChange={(event) => set("featured", event.target.checked)}
          />
          Featured on the homepage
        </label>

        {wouldOverfillHomepage && (
          <p className={`${styles.notice} ${styles.formGridFull}`}>
            Four services are already featured. The homepage grid animates
            exactly four cards, so this one will not appear there until another
            is unfeatured.
          </p>
        )}

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
              ? "Create service"
              : "Save changes"}
        </button>
        <Link href="/admin/services" className={styles.linkBtn}>
          Cancel
        </Link>
      </div>
    </form>
  );
}
