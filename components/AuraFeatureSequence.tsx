"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./AuraFeatureSequence.module.css";
import EnquiryModal from "@/components/EnquiryModal";

interface FeaturePanel {
  index: string;
  tag: string;
  tabLabel: string;
  categoryTag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  video?: string;
  facts: string[];
  preference: string;
}

const PANELS: FeaturePanel[] = [
  {
    index: "01",
    tag: "15-STOREY TOWER",
    tabLabel: "(01) FULL 15-STOREY TOWER",
    categoryTag: "CAMP, AMRAVATI · 15-STOREY ARCHITECTURAL LANDMARK",
    title: "15-STOREY SOARING VERTICAL FACADE",
    subtitle: "Congress Nagar's Most Recognizable Contemporary Crown",
    description:
      "Clean rectilinear slab lines, recessed glass balcony balustrades, and warm evening facade illumination distinguish Aura across the Camp skyline.",
    image: "/aura/building-full-4k.jpg",
    video: "/videos/aura-showcase-clip.mp4",
    facts: [
      "15 Residential & Retail Levels",
      "Weather-Shield Exterior Finish & Structural Glazing",
      "Seismic IS-Code Compliant RCC Framed Structure",
    ],
    preference: "15-Storey Tower Architecture & Structure",
  },
  {
    index: "02",
    tag: "ROOFTOP SKY OASIS",
    tabLabel: "(02) ROOFTOP SKY OASIS",
    categoryTag: "(02) LEVEL 15 CROWN LEISURE ABOVE STREET NOISE",
    title: "SKY POOL & MULTI-SPORTS TURF",
    subtitle: "20+ Curated Wellness & Recreation Zones In The Sky",
    description:
      "An elevated sanctuary featuring a panoramic infinity lap pool, kids splash deck, enclosed box-cricket and tennis turf, jogging loop, and sunset cabanas.",
    image: "/aura/rooftop-amenities-3d.jpg",
    video: "/videos/aura-showcase-clip.mp4",
    facts: [
      "Panoramic Rooftop Lap & Kids Pool",
      "Enclosed Multi-Sports Box Turf",
      "360° Unobstructed Camp & Melghat Views",
    ],
    preference: "Level 15 Rooftop Sky Oasis & Amenities",
  },
  {
    index: "03",
    tag: "2 & 3 BHK SKY SUITES",
    tabLabel: "(03) 2 & 3 BHK SKY SUITES",
    categoryTag: "(03) CROSS-VENTILATED VASTU SUITES",
    title: "LIGHT-FILLED 2 & 3 BHK RESIDENCES",
    subtitle: "Zero Shared Walls · 100% Vastu · Up to 11'0\" × 6'0\" Balconies",
    description:
      "Thoughtfully proportioned residences with dedicated dining alcoves, ensuite master suites, concealed Jaquar bathware, large-format 800×1600 vitrified slabs, and private sit-out balconies.",
    image: "/aura/luxury-master-bedroom.jpg",
    facts: [
      "800×1600 mm Vitrified Large-Format Slabs",
      "Zero Shared Walls with Acoustic Separation",
      "Separate Utility & Washing Balconies",
    ],
    preference: "2 & 3 BHK Luxury Residences",
  },
  {
    index: "04",
    tag: "ARRIVAL & BOULEVARD",
    tabLabel: "(04) ARRIVAL & BOULEVARD",
    categoryTag: "(04) GROUND LEVEL GRAND ARRIVAL",
    title: "DOUBLE-HEIGHT ARRIVAL & HIGH-SPEED LIFTS",
    subtitle: "4 High-Speed Lifts · 24×7 Manned Security · Segregated Access",
    description:
      "Lower and upper ground commercial bays offer high-visibility Congress Nagar frontage while maintaining private residential lift cores, covered parking, and 24×7 security.",
    image: "/aura/aura-hero-zoomed-out-4k.jpg",
    video: "/videos/lifestyle-showcase-clip.mp4",
    facts: [
      "Double-Height Granite Residential Lobby",
      "4 High-Speed Lifts with ARD & Full Power Backup",
      "Segregated Residential Circulation & Covered Parking",
    ],
    preference: "Arrival Foyer & Ground Boulevard",
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
      transform: "translate3d(36px, 24px, 0) scale(0.96)",
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none" as const,
      visibility: "hidden" as const,
    };
  }
  // Exiting slides drift slightly to the top-left
  return {
    transform: "translate3d(-28px, -18px, 0) scale(0.98)",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none" as const,
    visibility: "hidden" as const,
  };
}

export default function AuraFeatureSequence() {
  const [activeIdx, setActiveIdx] = useState(1); // Default to tab 02 as in user's screenshot
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const current = PANELS[activeIdx];
  const nextItem = PANELS[(activeIdx + 1) % PANELS.length];

  const handleSelectPanel = (idx: number) => {
    setActiveIdx(idx);
  };

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + PANELS.length) % PANELS.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % PANELS.length);
  };

  const handleInspectFloorPlans = () => {
    const el = document.querySelector("#floor-plans");
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <section className={styles.section} id="tower-features" aria-label="Aura 15-Storey Tower Features">
      <div className={styles.container}>
        {/* Top 4 Architectural Tabs (Exact Layout from Previous Web) */}
        <div className={styles.selectorRail} role="tablist" aria-label="Aura signature architectural zones">
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
                <span className={styles.railLabel}>{panel.tabLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Main Architectural Stage Card */}
        <div className={styles.stageCard}>
          {/* Left: Narrative Column with Category, Heading, Bullets, and CTAs */}
          <div className={styles.stageCopy} key={current.index}>
            <div className={styles.stageCategoryTag}>{current.categoryTag}</div>

            <h3 className={styles.stageTitle}>{current.title}</h3>

            <p className={styles.stageDesc}>{current.description}</p>

            <ul className={styles.factList}>
              {current.facts.map((fact) => (
                <li key={fact}>
                  <span className={styles.bulletDot} aria-hidden="true">✦</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>

            {/* CTAs: Inspect Floor Plans & Private Enquiry */}
            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.floorPlansBtn}
                onClick={handleInspectFloorPlans}
              >
                <span>INSPECT FLOOR PLANS</span>
                <span>↓</span>
              </button>

              <button
                type="button"
                className={styles.privateEnquiryBtn}
                onClick={() => setIsEnquiryOpen(true)}
              >
                <span>PRIVATE ENQUIRY</span>
                <span>→</span>
              </button>
            </div>

            {/* Slider Progress Bar and Prev/Next Controls */}
            <div className={styles.bottomBar}>
              <div className={styles.progressTrack}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${((activeIdx + 1) / PANELS.length) * 100}%` }}
                />
              </div>

              <div className={styles.controlsCluster}>
                <span className={styles.counterText}>
                  {current.index} / 0{PANELS.length}
                </span>

                <div className={styles.navButtons}>
                  <button
                    type="button"
                    className={styles.deckStepBtn}
                    onClick={handlePrev}
                    aria-label="Previous zone"
                  >
                    ← PREV
                  </button>
                  <button
                    type="button"
                    className={styles.deckStepBtn}
                    onClick={handleNext}
                    aria-label="Next zone"
                  >
                    NEXT →
                  </button>
                </div>
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
                    <Image
                      src={panel.image}
                      alt={panel.title}
                      fill
                      sizes="(max-width: 960px) 100vw, 560px"
                      className={styles.flyingMedia}
                    />
                  )}
                  <div className={styles.flyingScrim} />
                  <div
                    className={styles.flyingCardCaption}
                    style={{
                      opacity: isFront ? 1 : 0,
                      pointerEvents: isFront ? "auto" : "none",
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <div className={styles.flyingIndexRow}>
                      <span className={styles.flyingLine} />
                      <span>({panel.index})</span>
                    </div>
                    <h4 className={styles.flyingTitle}>{panel.title}</h4>
                  </div>
                </div>
              );
            })}

            {/* Subtle Next Slide Peek Below */}
            <div className={styles.peekUnderlay} onClick={handleNext} title={`Next: ${nextItem.title}`}>
              <span className={styles.peekLabel}>{nextItem.categoryTag}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={current.preference}
        source={`Tower Zone - ${current.title}`}
      />
    </section>
  );
}
