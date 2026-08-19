"use client";

import { useMemo, useState } from "react";
import { PROJECT_CATEGORIES } from "@/data/projects";
import type { ProjectCategory } from "@/data/projects";
import type { ProjectRecord } from "@/lib/schemas/project";
import { whatsappHref, type SettingsRecord } from "@/lib/schemas/settings";
import styles from "./page.module.css";

type Filter = ProjectCategory | "All";

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export default function ProjectsExplorer({
  projects,
  settings,
}: {
  settings: SettingsRecord;
  projects: ProjectRecord[];
}) {
  const [filter, setFilter] = useState<Filter>("All");

  // Only offer categories that something published actually sits in.
  const filters = useMemo<Filter[]>(
    () => [
      "All",
      ...PROJECT_CATEGORIES.filter((category) =>
        projects.some((project) => project.category === category)
      ),
    ],
    [projects]
  );

  const visible = useMemo(
    () =>
      filter === "All"
        ? projects
        : projects.filter((project) => project.category === filter),
    [filter, projects]
  );

  const countFor = (value: Filter) =>
    value === "All"
      ? projects.length
      : projects.filter((project) => project.category === value).length;

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Project categories">
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={`${styles.filter}${
              filter === value ? ` ${styles.filterActive}` : ""
            }`}
            onClick={() => setFilter(value)}
          >
            {value}
            <span className={styles.filterCount}>{countFor(value)}</span>
          </button>
        ))}
      </div>

      <p className={styles.resultCount} aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "project" : "projects"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      <div className={styles.cards}>
        {visible.map((project) => (
          <article className={styles.card} key={project.id}>
            <div className={styles.thumb}>
              <img
                src={project.img}
                alt={project.title}
                className={styles.thumbImg}
                loading="lazy"
              />
              <span className={styles.categoryPill}>{project.category}</span>
              <span
                className={`${styles.statusPill}${
                  project.status === "In Progress" ? ` ${styles.statusOngoing}` : ""
                }`}
              >
                {project.status}
              </span>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.cardHead}>
                <h2 className={styles.cardTitle}>{project.title}</h2>
                <p className={styles.cardMeta}>
                  {project.location} · {project.year}
                </p>
              </div>

              <p className={styles.summary}>{project.summary}</p>

              <div className={styles.specs}>
                <div className={styles.spec}>
                  <span className={styles.specLabel}>Beds</span>
                  <span className={styles.specValue}>{project.beds}</span>
                </div>
                <div className={styles.spec}>
                  <span className={styles.specLabel}>Baths</span>
                  <span className={styles.specValue}>{project.baths}</span>
                </div>
                <div className={styles.spec}>
                  <span className={styles.specLabel}>Area</span>
                  <span className={styles.specValue}>{project.area}</span>
                </div>
              </div>

              <div className={styles.actionRow}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Price</span>
                  <span className={styles.price}>{project.price}</span>
                </div>
                <a href={whatsappHref(settings)} className={styles.tourBtn}>
                  <CalendarIcon />
                  <span>Schedule Tour</span>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
