"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { PROJECT_CATEGORIES } from "@/data/projects";
import type { ProjectCategory } from "@/data/projects";
import type { ProjectRecord } from "@/lib/schemas/project";
import type { SettingsRecord } from "@/lib/schemas/settings";
import styles from "./page.module.css";

type Filter = ProjectCategory | "All";

const WHATSAPP_PHONE = "917498256708";

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
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

function ProjectCardMedia({
  project,
}: {
  project: ProjectRecord;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [project.video]);

  if (project.video) {
    return (
      <video
        ref={videoRef}
        src={project.video}
        poster={project.img || "/aura/aura-hero-clean-4k.jpg"}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className={styles.thumbImg}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      src={project.img || "/aura/aura-hero-clean-4k.jpg"}
      alt={project.title}
      className={styles.thumbImg}
      loading="lazy"
      onError={(e) => {
        (e.currentTarget as HTMLImageElement).src = "/aura/aura-hero-clean-4k.jpg";
      }}
    />
  );
}

export default function ProjectsExplorer({
  projects,
}: {
  settings: SettingsRecord;
  projects: ProjectRecord[];
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const gridRef = useRef<HTMLDivElement>(null);

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

  // Staggered GSAP entrance when filtering or mounting
  useEffect(() => {
    if (!gridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = gridRef.current.querySelectorAll("[data-project-card]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform",
      }
    );
  }, [filter]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mx", `${x.toFixed(1)}%`);
    el.style.setProperty("--my", `${y.toFixed(1)}%`);
  };

  return (
    <>
      {/* Category Filter Pills */}
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
        Showing <strong>{visible.length}</strong> {visible.length === 1 ? "landmark" : "landmarks"}
        {filter === "All" ? " across all categories" : ` in ${filter}`}
      </p>

      {/* Cards Grid */}
      <div className={styles.cards} ref={gridRef}>
        {visible.map((project) => {
          const detailHref =
            project.id === "lifestyle-retail-galleria"
              ? "/projects/lifestyle-homes#commercial-shops"
              : project.id === "lifestyle-homes"
              ? "/projects/lifestyle-homes"
              : project.id === "aura"
              ? "/"
              : `/projects/${project.id}`;

          const isLifestyle =
            project.id === "lifestyle-homes" || project.id === "lifestyle-retail-galleria";

          const reraNumber = isLifestyle ? "P50300054447" : "P5030002502915";

          const tourMsg = encodeURIComponent(
            `Hello Lifestyle Team, I would like to schedule an on-site visit and private walkthrough for "${project.title}" in Amravati.`
          );
          const tourHref = `https://wa.me/${WHATSAPP_PHONE}?text=${tourMsg}`;

          return (
            <article
              className={styles.card}
              key={project.id}
              data-project-card
              onMouseMove={handleCardMouseMove}
            >
              {/* Card Image / Live Video Banner */}
              <a href={detailHref} className={styles.thumb} aria-label={project.title}>
                <ProjectCardMedia project={project} />

                {/* Category Pill */}
                <span className={styles.categoryPill}>
                  {project.video ? "▶ " : ""}
                  {project.category}
                </span>

                {/* Status Pill */}
                <span
                  className={`${styles.statusPill} ${
                    project.status === "Delivered" ? styles.statusDelivered : styles.statusOngoing
                  }`}
                >
                  {project.status === "Delivered" ? "✓ 100% Ready Possession" : "✦ Skyline Landmark"}
                </span>

                {/* Bottom Overlay with RERA Badge */}
                <div className={styles.thumbOverlay}>
                  <span className={styles.reraBadge}>
                    MahaRERA: {reraNumber}
                  </span>
                </div>
              </a>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardHead}>
                  <a href={detailHref} style={{ textDecoration: "none", color: "inherit" }}>
                    <h2 className={styles.cardTitle}>{project.title}</h2>
                  </a>
                  <p className={styles.cardMeta}>
                    {project.location} · {project.year}
                  </p>
                </div>

                <p className={styles.summary}>{project.summary}</p>

                {/* Specifications Grid */}
                <div className={styles.specs}>
                  <div className={styles.spec}>
                    <span className={styles.specLabel}>Configuration</span>
                    <span className={styles.specValue}>{project.beds}</span>
                  </div>
                  <div className={styles.spec}>
                    <span className={styles.specLabel}>Baths</span>
                    <span className={styles.specValue}>{project.baths}</span>
                  </div>
                  <div className={styles.spec}>
                    <span className={styles.specLabel}>Carpet Area</span>
                    <span className={styles.specValue}>{project.area}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className={styles.actionRow}>
                  <div className={styles.btnGroup}>
                    <a href={detailHref} className={`${styles.btnExplore} roll-button`}>
                      <span className="roll-text" data-text="Explore Details →">
                        Explore Details →
                      </span>
                    </a>
                    <a
                      href={tourHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.btnTour}
                      title="Schedule Site Walkthrough"
                    >
                      <CalendarIcon />
                      <span>Tour Walkthrough</span>
                    </a>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </>
  );
}
