"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ProjectRecord } from "@/lib/schemas/project";
import styles from "./Properties.module.css";

function getProjectHref(id: string) {
  if (id === "lifestyle-homes") return "/projects/lifestyle-homes";
  if (id === "lifestyle-retail-galleria") return "/projects/lifestyle-homes#commercial-shops";
  if (id === "aura") return "#floor-plans";
  return "/projects";
}

export default function Properties({
  projects,
  content,
}: {
  projects: ProjectRecord[];
  content: HomeRecord["properties"];
}) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const total = projects.length;

  useEffect(() => {
    const video = videoRef.current;
    let observer: IntersectionObserver | null = null;
    if (video && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        },
        { threshold: 0.15 }
      );
      observer.observe(video);
    }
    return () => observer?.disconnect();
  }, [index]);

  if (total === 0) return null;

  const feature = projects[index % total];
  const secondary = projects.filter((_, idx) => idx !== index % total);

  const step = (delta: number) =>
    setIndex((current) => (current + delta + total) % total);

  return (
    <section className={styles.properties} id="properties-section">
      <div className={styles.container}>
        {/* Header + Numbered Selection Controls */}
        <div className={styles.topHeader}>
          <div className={styles.headingBlock}>
            <span className={styles.eyebrow}>PORTFOLIO SHOWCASE · AMRAVATI</span>
            <h2 className={styles.heading}>{content.heading}</h2>
            <p className={styles.desc}>{content.description}</p>
          </div>

          <div className={styles.controlsCluster}>
            <div className={styles.pillSelectors} role="tablist" aria-label="Select landmark project">
              {projects.map((proj, idx) => {
                const isActive = idx === index % total;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.selectPill}${isActive ? ` ${styles.selectPillActive}` : ""}`}
                    onClick={() => setIndex(idx)}
                  >
                    <span className={styles.pillNum}>0{idx + 1}</span>
                    <span>{proj.title}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.arrowGroup}>
              <button
                type="button"
                className={styles.arrowBtn}
                aria-label="Previous project"
                onClick={() => step(-1)}
              >
                ←
              </button>
              <button
                type="button"
                className={styles.arrowBtn}
                aria-label="Next project"
                onClick={() => step(1)}
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Layered Primary Showcase + Supporting Cards */}
        <div className={styles.showcaseGrid}>
          <article className={styles.primaryCard}>
            <div className={styles.primaryMediaWrap}>
              {feature.video ? (
                <video
                  ref={videoRef}
                  key={feature.id}
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={feature.img}
                  className={styles.media}
                  aria-hidden="true"
                >
                  <source src={feature.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  key={feature.id}
                  src={feature.img}
                  alt={feature.title}
                  className={styles.media}
                />
              )}
              <div className={styles.primaryScrim} />

              <div className={styles.topBadges}>
                <span className={styles.badgeCategory}>{feature.category}</span>
                <span className={styles.badgeStatus}>
                  {feature.status === "Delivered" ? "✓ Delivered & Ready" : "✦ Ongoing Landmark"}
                </span>
              </div>
            </div>

            <div className={styles.primaryContent}>
              <div className={styles.primaryMetaRow}>
                <span className={styles.locationText}>{feature.location}</span>
                <span className={styles.yearText}>Target / Year · {feature.year}</span>
              </div>

              <h3 className={styles.primaryTitle}>{feature.title}</h3>
              <p className={styles.primarySummary}>{feature.summary}</p>

              <div className={styles.metricsBar}>
                <div className={styles.metricCell}>
                  <span className={styles.metricKey}>Typology</span>
                  <span className={styles.metricVal}>{feature.beds}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricKey}>Area Range</span>
                  <span className={styles.metricVal}>{feature.area}</span>
                </div>
                <div className={styles.metricCell}>
                  <span className={styles.metricKey}>Pricing</span>
                  <span className={styles.metricVal}>{feature.price}</span>
                </div>
              </div>

              <div className={styles.primaryActions}>
                <Link
                  href={getProjectHref(feature.id)}
                  className={`${styles.btnPrimary} roll-button`}
                >
                  <span className="roll-text" data-text="Explore Development →">
                    Explore Development →
                  </span>
                </Link>
                <Link href="/projects" className={styles.viewAllLink}>
                  {content.ctaLabel}
                </Link>
              </div>
            </div>
          </article>

          <div className={styles.sideStack}>
            {secondary.map((proj) => {
              const originalIdx = projects.findIndex((p) => p.id === proj.id);
              return (
                <div
                  key={proj.id}
                  className={styles.secondaryCard}
                  onClick={() => setIndex(originalIdx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setIndex(originalIdx);
                    }
                  }}
                  aria-label={`Preview ${proj.title}`}
                >
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className={styles.secondaryImg}
                    loading="lazy"
                  />
                  <div className={styles.secondaryScrim} />
                  <div className={styles.secondaryOverlay}>
                    <div className={styles.secondaryTop}>
                      <span className={styles.secondaryNum}>0{originalIdx + 1}</span>
                      <span className={styles.secondaryStatus}>{proj.status}</span>
                    </div>
                    <div className={styles.secondaryBottom}>
                      <span className={styles.secondaryLoc}>{proj.location}</span>
                      <h4 className={styles.secondaryTitle}>{proj.title}</h4>
                      <span className={styles.secondaryHint}>Select to inspect ↗</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
