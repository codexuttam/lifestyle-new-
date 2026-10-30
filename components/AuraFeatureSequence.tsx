"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./AuraFeatureSequence.module.css";

interface FeaturePanel {
  index: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  facts: string[];
}

const PANELS: FeaturePanel[] = [
  {
    index: "01",
    tag: "EXTERIOR ARCHITECTURE",
    title: "15-Storey Soaring Vertical Facade",
    subtitle: "Congress Nagar's Most Recognizable Contemporary Crown",
    description:
      "Clean rectilinear slab lines, recessed glass balcony balustrades, and warm evening facade illumination distinguish Aura across the Camp skyline.",
    image: "/aura/building-full-4k.jpg",
    video: "/videos/aura-showcase-clip.mp4",
    facts: ["15 Residential & Retail Levels", "Weather-Shield Exterior Finish", "Seismic IS-Code RCC Structure"],
  },
  {
    index: "02",
    tag: "CAMP CONNECTIVITY",
    title: "Five Minutes From Every Daily Landmark",
    subtitle: "Next to Dreamz Signature · Congress Nagar Road, Camp",
    description:
      "Walk to Oxygen Park or reach top hospitals, premier colleges, shopping malls, D-Mart, and Amravati Railway Station within 5 to 8 minutes.",
    image: "/aura/aura-hero-zoomed-out-4k.jpg",
    facts: ["Hospitals & Colleges · 5 min", "D-Mart & Malls · 7 min", "Railway Station · 8 min"],
  },
  {
    index: "03",
    tag: "SKYLINE HORIZONS",
    title: "Private Sit-Out Balconies & Dusk Views",
    subtitle: "Unobstructed East-West Breeze & Open Melghat Horizons",
    description:
      "Deep sit-out balconies extend living rooms and master suites outdoors, capturing morning light and serene twilight panoramas high above street noise.",
    image: "/aura/sky-balcony-lifestyle.jpg",
    facts: ["Up to 11'0\" × 6'0\" Balconies", "3-Track Sliding Glazing", "Acoustic Glass & Metal Railings"],
  },
  {
    index: "04",
    tag: "CROWN LEVEL 15",
    title: "Rooftop Infinity Pool & Sports Turf",
    subtitle: "20+ Curated Wellness & Recreation Zones In The Sky",
    description:
      "Swim laps against the open sky, host evening gatherings on the party lawn, or play box cricket and tennis on the enclosed rooftop multi-sports turf.",
    image: "/videos/web-clip-thumb.png",
    facts: ["Rooftop Lap & Kids Pool", "Enclosed Multi-Sports Turf", "Jogging Track & Viewing Deck"],
  },
  {
    index: "05",
    tag: "INTERIOR CRAFTSMANSHIP",
    title: "Refined Living & Master Bedroom Suites",
    subtitle: "Large-Format 800×1600 Vitrified Slabs & Branded Fittings",
    description:
      "Thoughtfully proportioned suites with dedicated dining alcoves, ensuite master baths with concealed Jaquar fittings, and AC/inverter provisions.",
    image: "/aura/luxury-bedroom-2.jpg",
    facts: ["800×1600 mm Vitrified Flooring", "Concealed Jaquar Plumbing", "Separate Utility Balcony"],
  },
  {
    index: "06",
    tag: "DELIVERED BENCHMARK",
    title: "Integrated Commercial & Retail Frontage",
    subtitle: "Segregated Access Inspired By Our Delivered DPS Road Landmark",
    description:
      "Lower and upper ground commercial bays offer high-visibility Congress Nagar frontage while maintaining private residential lift cores and parking.",
    image: "/videos/2nd-clip-thumb.png",
    video: "/videos/lifestyle-showcase-clip.mp4",
    facts: ["Lower & Upper Ground Retail", "Segregated Residential Lobby", "Ample Visitor Frontage"],
  },
];

function getSlideTransform(idx: number, activeIdx: number) {
  const diff = idx - activeIdx;
  if (diff === 0) {
    return {
      transform: "translate3d(0, 0, 0) scale(1)",
      opacity: 1,
      zIndex: 5,
      pointerEvents: "auto" as const,
      visibility: "visible" as const,
    };
  }
  if (diff > 0) {
    // Incoming slides rest slightly offset diagonally to the bottom-right
    return {
      transform: "translate3d(32px, 20px, 0) scale(0.97)",
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none" as const,
      visibility: "hidden" as const,
    };
  }
  // Exiting slides drift slightly to the top-left
  return {
    transform: "translate3d(-28px, -16px, 0) scale(0.98)",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none" as const,
    visibility: "hidden" as const,
  };
}

export default function AuraFeatureSequence() {
  const [activeIdx, setActiveIdx] = useState(0);
  const runwayRef = useRef<HTMLDivElement>(null);

  // Native CSS Sticky Scroll Progress (Zero fixed-pinning overlap risk)
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const updateFromScroll = () => {
      rafId = 0;
      if (window.innerWidth < 1024) return;
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const stickyOffset = 88;
      const scrollable = rect.height - (window.innerHeight - stickyOffset);
      if (scrollable <= 0) return;

      const scrolled = stickyOffset - rect.top;
      const progress = Math.min(0.9999, Math.max(0, scrolled / scrollable));
      const idx = Math.floor(progress * PANELS.length);
      setActiveIdx((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleSelectPanel = (idx: number) => {
    setActiveIdx(idx);
    const runway = runwayRef.current;
    if (runway && window.innerWidth >= 1024) {
      const stickyOffset = 88;
      const runwayTop = runway.getBoundingClientRect().top + window.scrollY;
      const scrollable = runway.offsetHeight - (window.innerHeight - stickyOffset);
      if (scrollable > 0) {
        const targetY =
          runwayTop - stickyOffset + ((idx + 0.35) / PANELS.length) * scrollable;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  const current = PANELS[activeIdx];

  return (
    <section className={styles.section} id="living-experience">
      <div id="feature-sequence-section" style={{ position: "absolute", top: -88 }} />
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <span className={styles.eyebrowTag}>LIVING EXPERIENCE · LEVEL 15 TO GROUND</span>
          <h2 className={styles.heading}>
            EVERY DETAIL. <span>A BETTER EXPERIENCE.</span>
          </h2>
        </div>

        {/* Desktop Native Sticky Runway (Strictly In-Flow — Never Overlaps Adjacent Sections) */}
        <div className={styles.desktopRunway} ref={runwayRef}>
          <div className={styles.desktopSticky}>
            <div className={styles.selectorRail} role="tablist" aria-label="Aura signature features">
              {PANELS.map((panel, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={panel.index}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.railBtn}${isActive ? ` ${styles.railBtnActive}` : ""}`}
                    onClick={() => handleSelectPanel(idx)}
                  >
                    <span className={styles.railIndex}>({panel.index})</span>
                    <span className={styles.railLabel}>{panel.tag}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.stageCard}>
              {/* Left Narrative Synced to Active 3D Card (Animated Diagonally on Scroll) */}
              <div className={styles.stageCopy} key={current.index}>
                <div className={styles.stageMeta}>
                  <span className={styles.stageNumber}>({current.index})</span>
                </div>

                <h3 className={styles.stageTitle} key={`t-${current.index}`}>
                  {current.title}
                </h3>
                <p className={styles.stageSubtitle}>{current.subtitle}</p>
                <p className={styles.stageDesc}>{current.description}</p>

                <ul className={styles.factList}>
                  {current.facts.map((fact) => (
                    <li key={fact}>
                      <span aria-hidden="true">✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.bottomBar}>
                  <div className={styles.progressFooter}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${((activeIdx + 1) / PANELS.length) * 100}%` }}
                      />
                    </div>
                    <span className={styles.progressCount}>
                      {current.index} / 0{PANELS.length}
                    </span>
                  </div>

                  <div className={styles.deckControls}>
                    <button
                      type="button"
                      className={styles.deckStepBtn}
                      onClick={() => handleSelectPanel((activeIdx - 1 + PANELS.length) % PANELS.length)}
                      aria-label="Previous dimension card"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      className={styles.deckStepBtn}
                      onClick={() => handleSelectPanel((activeIdx + 1) % PANELS.length)}
                      aria-label="Next dimension card"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Architectural Cinematic Preview with Smooth Diagonal Reveal */}
              <div className={styles.deckStage}>
                {PANELS.map((panel, idx) => {
                  const isFront = idx === activeIdx;
                  const styleObj = getSlideTransform(idx, activeIdx);
                  return (
                    <div
                      key={panel.index}
                      className={`${styles.flyingCard}${isFront ? ` ${styles.flyingCardActive}` : ""}`}
                      style={styleObj}
                    >
                      {panel.video && isFront ? (
                        <video
                          src={panel.video}
                          poster={panel.image}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={styles.flyingMedia}
                          aria-hidden="true"
                        />
                      ) : (
                        <img
                          src={panel.image}
                          alt={panel.title}
                          className={styles.flyingMedia}
                          loading="lazy"
                        />
                      )}
                      <div className={styles.flyingScrim} />
                      <div className={styles.flyingCardCaption}>
                        <div className={styles.flyingIndexRow}>
                          <span className={styles.flyingLine} />
                          <span>({panel.index})</span>
                          {panel.video && <span className={styles.videoChip}>LIVE CINEMATIC CLIP</span>}
                        </div>
                        <h4 className={styles.flyingTitle}>{panel.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Dynamic Cards with Live Video Clips */}
        <div className={styles.mobileStack}>
          {PANELS.map((panel) => (
            <article className={styles.mobileCard} key={panel.index}>
              <div className={styles.mobileImgWrap}>
                {panel.video ? (
                  <video
                    src={panel.video}
                    poster={panel.image}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className={styles.mobileImg}
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={panel.image}
                    alt={panel.title}
                    className={styles.mobileImg}
                    loading="lazy"
                  />
                )}
                <span className={styles.mobileBadge}>
                  ({panel.index}) · {panel.tag}
                </span>
              </div>
              <div className={styles.mobileBody}>
                <h3 className={styles.mobileTitle}>{panel.title}</h3>
                <p className={styles.mobileSub}>{panel.subtitle}</p>
                <p className={styles.mobileDesc}>{panel.description}</p>
                <ul className={styles.factList}>
                  {panel.facts.map((fact) => (
                    <li key={fact}>
                      <span aria-hidden="true">✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
