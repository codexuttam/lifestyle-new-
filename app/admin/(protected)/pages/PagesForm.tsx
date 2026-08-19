"use client";

import { useState, type FormEvent } from "react";

import type { PagesRecord } from "@/lib/schemas/pages";
import styles from "../../admin.module.css";
import { useSingleton } from "../useSingleton";

type RouteKey = keyof PagesRecord;

const ROUTES: { key: RouteKey; label: string; path: string }[] = [
  { key: "about", label: "About", path: "/about" },
  { key: "projects", label: "Projects", path: "/projects" },
  { key: "services", label: "Services", path: "/services" },
  { key: "contact", label: "Contact", path: "/contact" },
  { key: "paintVisualizer", label: "Paint Visualizer", path: "/paint-visualizer" },
];

/** Long-form fields that belong in a textarea rather than a single line. */
const MULTILINE = new Set([
  "metaDescription",
  "intro",
  "brandsIntro",
  "ctaText",
]);

const LABELS: Record<string, string> = {
  metaTitle: "Browser tab & search result title",
  metaDescription: "Search result description",
  badge: "Badge",
  title: "Heading",
  intro: "Intro paragraph",
  storyTitle: "Story heading",
  projectsCtaLabel: "Projects button",
  servicesCtaLabel: "Services button",
  valuesTitle: "Values heading",
  milestonesTitle: "Milestones heading",
  processTitle: "Process heading",
  brandsTitle: "Materials heading",
  brandsIntro: "Materials intro",
  ctaTitle: "Closing CTA heading",
  ctaText: "Closing CTA text",
  ctaLabel: "Closing CTA button",
  sidebarTitle: "Sidebar heading",
};

export default function PagesForm({ initial }: { initial: PagesRecord }) {
  const { draft, patch, save, busy, error, saved } = useSingleton(
    "pages",
    initial
  );
  const [active, setActive] = useState<RouteKey>("about");

  const page = draft[active] as Record<string, unknown>;

  function setField(key: string, value: unknown) {
    patch({ [active]: { ...page, [key]: value } } as Partial<PagesRecord>);
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void save();
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.filters}>
        {ROUTES.map((route) => (
          <button
            key={route.key}
            type="button"
            className={`${styles.filterChip}${
              active === route.key ? ` ${styles.filterChipActive}` : ""
            }`}
            onClick={() => setActive(route.key)}
          >
            {route.label}
          </button>
        ))}
      </div>

      <p className={styles.hint}>
        Editing {ROUTES.find((route) => route.key === active)?.path}. Changes to
        all tabs are saved together.
      </p>

      <div className={styles.formGrid}>
        {Object.entries(page).map(([key, value]) => {
          // The about page carries its story as a list of paragraphs.
          if (Array.isArray(value)) {
            return (
              <div
                className={`${styles.field} ${styles.formGridFull}`}
                key={key}
              >
                <label className={styles.label} htmlFor={`${active}-${key}`}>
                  Story paragraphs
                </label>
                <textarea
                  id={`${active}-${key}`}
                  className={styles.textarea}
                  rows={8}
                  value={(value as string[]).join("\n\n")}
                  onChange={(event) =>
                    setField(
                      key,
                      event.target.value
                        .split(/\n\s*\n/)
                        .map((paragraph) => paragraph.trim())
                        .filter(Boolean)
                    )
                  }
                />
                <span className={styles.hint}>
                  Separate paragraphs with a blank line.
                </span>
              </div>
            );
          }

          const multiline = MULTILINE.has(key);

          return (
            <div
              className={`${styles.field}${multiline ? ` ${styles.formGridFull}` : ""}`}
              key={key}
            >
              <label className={styles.label} htmlFor={`${active}-${key}`}>
                {LABELS[key] ?? key}
              </label>
              {multiline ? (
                <textarea
                  id={`${active}-${key}`}
                  className={styles.textarea}
                  value={String(value)}
                  onChange={(event) => setField(key, event.target.value)}
                />
              ) : (
                <input
                  id={`${active}-${key}`}
                  className={styles.input}
                  value={String(value)}
                  onChange={(event) => setField(key, event.target.value)}
                />
              )}
              {key === "metaDescription" && (
                <span className={styles.hint}>
                  {String(value).length} characters — search engines show around
                  155.
                </span>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className={styles.error}>{error}</p>}
      {saved && <p className={styles.hint}>Saved. The site is updating.</p>}

      <div className={styles.formActions}>
        <button className={styles.primaryBtn} type="submit" disabled={busy}>
          {busy ? "Saving..." : "Save page copy"}
        </button>
      </div>
    </form>
  );
}
