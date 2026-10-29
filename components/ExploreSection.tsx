"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./ExploreSection.module.css";

interface ZonePreset {
  id: string;
  index: string;
  name: string;
  badge: string;
  title: string;
  sublabel: string;
  description: string;
  image?: string;
  progress: number;
}

const ZONES: ZonePreset[] = [
  {
    id: "full",
    index: "01",
    name: "Full Highrise",
    badge: "15-Storey Tower",
    title: "Aura by Lifestyle",
    sublabel: "Camp, Congress Nagar Road",
    description: "Amravati's premier architectural highrise featuring 2 & 3 BHK luxury residences, rooftop sky pool, and panoramic horizons.",
    progress: 95,
  },
  {
    id: "rooftop",
    index: "02",
    name: "Rooftop Sky Oasis",
    badge: "Level 15 Sky Thrills",
    title: "Aura Sky Oasis & Turf",
    sublabel: "Sky Pool & Sports Court",
    description: "Infinity rooftop pool, multi-sports turf, sunrise yoga deck, open-air cabanas, and uninterrupted 360-degree city horizons.",
    progress: 98,
  },
  {
    id: "residences",
    index: "03",
    name: "2 & 3 BHK Suites",
    badge: "Floors 1 to 14",
    title: "Signature Residences",
    sublabel: "2 & 3 BHK Luxury Suites",
    description: "Private panoramic balconies, 800x1600 vitrified tiles, dedicated cross-ventilation, and designer Jaquar bathroom fittings.",
    progress: 92,
  },
  {
    id: "entrance",
    index: "04",
    name: "Grand Arrival Lobby",
    badge: "Ground Level Entrance",
    title: "Double-Height Arrival Lobby",
    sublabel: "Reception & Portico",
    description: "Grand double-height air-conditioned entrance lobby, landscaped arrival drop-off porch, manned security post, and covered parking.",
    progress: 90,
  },
];

export default function ExploreSection({
  content,
  projectTitle,
}: {
  content: HomeRecord["explore"];
  projectTitle: string;
}) {
  const [activeZone, setActiveZone] = useState<ZonePreset>(ZONES[0]);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = headingRef.current?.querySelectorAll(`.${styles.word}`);
      if (words?.length) {
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        });
      }

      gsap.fromTo(
        panelRef.current,
        { y: 40, opacity: 0.92 },
        {
          y: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 85%",
            end: "top 45%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.explore} id="explore-site-section" ref={sectionRef}>
      {/* Editorial Section Header */}
      <div className={styles.headerRow}>
        <div className={styles.sectionEyebrow}>Interactive Architecture</div>
        <h2 className={styles.heading} ref={headingRef}>
          {content.headline.split(" ").map((word, i) => (
            <span className={styles.word} key={`${word}-${i}`}>
              {word}{" "}
            </span>
          ))}
        </h2>
      </div>

      {/* Interactive Zone Navigation Tabs (Virtuaze-Style Restrained Pills) */}
      <div className={styles.zoneTabs} role="tablist" aria-label="Building Zones">
        {ZONES.map((zone) => {
          const isActive = activeZone.id === zone.id;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              key={zone.id}
              onClick={() => setActiveZone(zone)}
              className={`${styles.zoneTab} ${isActive ? styles.zoneTabActive : ""}`}
            >
              <span className={styles.tabIndex}>{zone.index}</span>
              <span className={styles.tabName}>{zone.name}</span>
            </button>
          );
        })}
      </div>

      {/* Main Architectural Media Panel */}
      <div className={styles.mediaPanel} ref={panelRef}>
        <div className={styles.buildingViewer}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.viewerVideo}
            aria-hidden="true"
          >
            <source src="/videos/aura-showcase-clip.mp4" type="video/mp4" />
          </video>
          <div className={styles.viewerOverlay} />
        </div>

        {/* Virtuaze-Style Editorial Inspection Card */}
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardTopRow}>
              <span className={styles.cardBadge}>{activeZone.badge}</span>
              <span className={styles.cardSublabel}>{activeZone.sublabel}</span>
            </div>

            <h3 className={styles.cardTitle}>{activeZone.title}</h3>

            <p className={styles.cardDescription}>{activeZone.description}</p>

            <div className={styles.cardMetricBlock}>
              <div className={styles.metricTextRow}>
                <span className={styles.metricLabel}>Engineering &amp; Quality</span>
                <span className={styles.metricPercent}>{activeZone.progress}%</span>
              </div>
              <div className={styles.sliderTrack}>
                <div
                  className={styles.sliderFill}
                  style={{ width: `${activeZone.progress}%` }}
                />
              </div>
            </div>

            <div className={styles.cardActions}>
              <span className={styles.reraTag}>MahaRERA: P5030002502915</span>
              <a href="#floor-plans" className={styles.cardActionBtn}>
                Explore Plans →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
