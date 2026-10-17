"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./ExploreSection.module.css";

interface ZonePreset {
  id: string;
  name: string;
  badge: string;
  title: string;
  sublabel: string;
  description: string;
  scale: number;
  translateY: number;
  progress: number;
}

const ZONES: ZonePreset[] = [
  {
    id: "full",
    name: "Full Highrise",
    badge: "15-Storey Tower",
    title: "Aura by Lifestyle",
    sublabel: "Camp, Amravati",
    description: "Amravati's premier architectural highrise featuring 2 & 3 BHK luxury residences, rooftop sky pool, and panoramic horizons.",
    scale: 1.0,
    translateY: 0,
    progress: 95,
  },
  {
    id: "rooftop",
    name: "Rooftop Sky Pool",
    badge: "Level 15 Sky Thrills",
    title: "Aura Sky Oasis & Turf",
    sublabel: "Sky Pool & Sports Court",
    description: "Infinity rooftop pool, multi-sports turf, sunrise yoga deck, open-air cabanas, and panoramic city horizons.",
    scale: 2.2,
    translateY: 48,
    progress: 98,
  },
  {
    id: "residences",
    name: "2 & 3 BHK Suites",
    badge: "Floors 1 to 14",
    title: "Signature Residences",
    sublabel: "2 & 3 BHK Luxury Suites",
    description: "Private panoramic balconies, 800x1600 vitrified tiles, dedicated cross-ventilation, and designer Jaquar fittings.",
    scale: 2.0,
    translateY: -18,
    progress: 92,
  },
  {
    id: "entrance",
    name: "Grand Arrival Lobby",
    badge: "Ground Level Entrance",
    title: "Double-Height Arrival Lobby",
    sublabel: "Reception & Portico",
    description: "Grand double-height air-conditioned entrance lobby, landscaped arrival drop-off porch, manned security post, and covered parking.",
    scale: 2.3,
    translateY: -82,
    progress: 90,
  },
];

function SofaIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
      <path d="M4 18v2" />
      <path d="M20 18v2" />
      <path d="M12 4v9" />
    </svg>
  );
}

export default function ExploreSection({
  content,
  projectTitle,
}: {
  content: HomeRecord["explore"];
  projectTitle: string;
}) {
  const HEADLINE = content.headline;
  const [activeZone, setActiveZone] = useState<ZonePreset>(ZONES[0]);
  const [currentScale, setCurrentScale] = useState<number>(1.0);
  const [currentTranslateY, setCurrentTranslateY] = useState<number>(0);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  const selectZone = (zone: ZonePreset) => {
    setActiveZone(zone);
    setCurrentScale(zone.scale);
    setCurrentTranslateY(zone.translateY);
  };

  const handleZoomIn = () => {
    setCurrentScale((prev) => Math.min(Number((prev + 0.3).toFixed(2)), 3.0));
  };

  const handleZoomOut = () => {
    setCurrentScale((prev) => {
      const next = Math.max(Number((prev - 0.3).toFixed(2)), 1.0);
      if (next === 1.0) {
        setActiveZone(ZONES[0]);
        setCurrentTranslateY(0);
      }
      return next;
    });
  };

  const handleReset = () => {
    setActiveZone(ZONES[0]);
    setCurrentScale(1.0);
    setCurrentTranslateY(0);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (barRef.current) barRef.current.style.width = `${activeZone.progress}%`;
      if (percentRef.current) percentRef.current.textContent = `${activeZone.progress}%`;
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
        { y: 50, scale: 0.96, opacity: 0.9 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 90%",
            end: "top 40%",
            scrub: 0.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.explore} id="explore-site-section" ref={sectionRef}>
      <div className={styles.tag}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.tagText}>{content.tag}</span>
      </div>

      <div className={styles.headingContainer}>
        <h2 className={styles.heading} ref={headingRef}>
          {HEADLINE.split(" ").map((word, i) => (
            <span className={styles.word} key={`${word}-${i}`}>
              {word}
            </span>
          ))}
        </h2>
      </div>

      <div className={styles.mediaPanel} ref={panelRef}>
        {/* Architectural Image Viewer with Zoom & Pan */}
        <div className={styles.buildingViewer}>
          <img
            src="/aura/aura-hero-clean-4k.jpg"
            alt="Aura 15-Storey Tower 4K Architectural Inspector"
            className={styles.viewerImage}
            style={{
              transform: `translate3d(0, ${currentTranslateY}%, 0) scale(${currentScale})`,
            }}
          />
          <div className={styles.viewerOverlay} />
        </div>

        {/* Floating Zoom & Zone Inspector Toolbar */}
        <div className={styles.viewerToolbar}>
          <div className={styles.zoneButtonGroup}>
            {ZONES.map((zone) => {
              const isActive = activeZone.id === zone.id && currentScale > 1.0 ? true : (zone.id === "full" && currentScale === 1.0);
              return (
                <button
                  key={zone.id}
                  type="button"
                  className={`${styles.zoneBtn}${isActive ? ` ${styles.zoneBtnActive}` : ""}`}
                  onClick={() => selectZone(zone)}
                  aria-pressed={isActive}
                >
                  {zone.name}
                </button>
              );
            })}
          </div>

          <div className={styles.zoomControls}>
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={handleZoomOut}
              aria-label="Zoom out"
              title="Zoom Out"
              disabled={currentScale <= 1.0}
            >
              −
            </button>
            <span className={styles.zoomScaleText}>{currentScale.toFixed(1)}x</span>
            <button
              type="button"
              className={styles.zoomBtn}
              onClick={handleZoomIn}
              aria-label="Zoom in"
              title="Zoom In"
              disabled={currentScale >= 3.0}
            >
              +
            </button>
            <button
              type="button"
              className={`${styles.zoomBtn} ${styles.resetBtn}`}
              onClick={handleReset}
              aria-label="Reset view"
              title="Reset View"
            >
              ⟲
            </button>
          </div>
        </div>

        {/* Dynamic Architectural Detail Card */}
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconWrapper}>
                <SofaIcon />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardLabel}>{activeZone.badge}</span>
                <span className={styles.cardTitle}>{activeZone.title}</span>
              </div>
            </div>

            <p className={styles.cardDescription}>{activeZone.description}</p>

            <div className={styles.cardMiddleRow}>
              <div className={styles.cardMetricBlock}>
                <span className={styles.cardMetricLabel}>Construction Quality</span>
                <span className={styles.cardPercentage} ref={percentRef}>
                  {activeZone.progress}%
                </span>
              </div>
              <span className={styles.reraTag}>MahaRERA: P5030002502915</span>
            </div>

            <div className={styles.sliderWrapper}>
              <div className={styles.sliderTrack}>
                <div
                  className={styles.sliderFill}
                  ref={barRef}
                  style={{ width: `${activeZone.progress}%` }}
                />
              </div>
            </div>

            <div className={styles.cardBottomRow}>
              <span className={styles.cardSublabel}>{activeZone.sublabel}</span>
              <a href="#floor-plans" className={styles.cardActionBtn}>
                Explore Layouts →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
