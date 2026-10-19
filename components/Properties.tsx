"use client";

import Link from "next/link";
import { useState } from "react";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ProjectRecord } from "@/lib/schemas/project";
import styles from "./Properties.module.css";

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Properties({
  projects,
  content,
}: {
  projects: ProjectRecord[];
  content: HomeRecord["properties"];
}) {
  const [index, setIndex] = useState(0);

  const total = projects.length;

  const step = (delta: number) =>
    setIndex((current) => (current + delta + total) % total);

  // The layout needs a feature card plus two supporting cards.
  if (total < 3) return null;

  const feature = projects[index % total];
  const secondary = [
    projects[(index + 1) % total],
    projects[(index + 2) % total],
  ];

  return (
    <section className={styles.properties} id="properties-section">
      <div className={styles.grid}>
        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>{content.heading}</h2>
        </div>

        <div className={styles.largeWrapper}>
          <div className={styles.largeCard}>
            {feature.video ? (
              <video
                key={feature.id}
                autoPlay
                loop
                muted
                playsInline
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
            <div className={styles.largeScrim} />
            <div className={styles.pills}>
              <span className={styles.pill}>{feature.category}</span>
              <span className={styles.pill}>{feature.status === "Delivered" ? "✓ Ready to Move" : "✦ Skyline Landmark"}</span>
            </div>
            <div className={styles.largeTitleRow}>
              <h3 className={styles.largeTitle}>{feature.title}</h3>
              <Link
                href={
                  feature.id === "lifestyle-homes"
                    ? "/projects/lifestyle-homes"
                    : feature.id === "lifestyle-retail-galleria"
                    ? "/projects/lifestyle-homes#commercial-shops"
                    : feature.id === "aura"
                    ? "#floor-plans"
                    : "/projects"
                }
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.85rem",
                  color: "#d4af37",
                  textDecoration: "none",
                  fontWeight: 600,
                  marginTop: "0.35rem",
                }}
              >
                View Project Details →
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.smallColumn}>
          <div className={styles.smallRow}>
            {secondary.map((property) => (
              <div className={styles.smallCard} key={property.id}>
                {property.video ? (
                  <video
                    key={property.id}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className={styles.media}
                    aria-hidden="true"
                  >
                    <source src={property.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    key={property.id}
                    src={property.img}
                    alt={property.title}
                    className={styles.media}
                  />
                )}
                <div className={styles.smallScrim} />
                <span className={styles.smallPill}>{property.category}</span>
                <div className={styles.smallTitleRow}>
                  <h3 className={styles.smallTitle}>{property.title}</h3>
                  <Link
                    href={
                      property.id === "lifestyle-homes"
                        ? "/projects/lifestyle-homes"
                        : property.id === "lifestyle-retail-galleria"
                        ? "/projects/lifestyle-homes#commercial-shops"
                        : property.id === "aura"
                        ? "#floor-plans"
                        : "/projects"
                    }
                    style={{
                      display: "inline-block",
                      fontSize: "0.75rem",
                      color: "#d4af37",
                      textDecoration: "none",
                      fontWeight: 600,
                      marginTop: "0.2rem",
                    }}
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomRow}>
            <div className={styles.descBlock}>
              <p className={styles.desc}>{content.description}</p>
              <Link href="/projects" className={styles.viewAll}>
                {content.ctaLabel}
              </Link>
            </div>
            <div className={styles.navButtons}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                aria-label="Previous property"
                onClick={() => step(-1)}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                aria-label="Next property"
                onClick={() => step(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
