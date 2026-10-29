"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AuraFeatureSequence.module.css";

interface FeaturePanel {
  index: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
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
    facts: ["15 Residential & Retail Levels", "Weather-Shield Exterior Finish", "Seismic IS-Code RCC Structure"],
  },
  {
    index: "02",
    tag: "CAMP CONNECTIVITY",
    title: "Five Minutes From Every Daily Landmark",
    subtitle: "Next to Dreamz Signature · Congress Nagar Road, Camp",
    description:
      "Walk to Oxygen Park or reach top hospitals, premier colleges, shopping malls, D-Mart, and Amravati Railway Station within 5 to 8 minutes.",
    image: "/aura/location-connectivity-map.jpg",
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
    image: "/aura/rooftop-amenities-3d.jpg",
    facts: ["Rooftop Lap & Kids Pool", "Enclosed Multi-Sports Turf", "Jogging Track & Viewing Deck"],
  },
  {
    index: "05",
    tag: "INTERIOR CRAFTSMANSHIP",
    title: "Refined Living & Master Bedroom Suites",
    subtitle: "Large-Format 800×1600 Vitrified Slabs & Branded Fittings",
    description:
      "Thoughtfully proportioned suites with dedicated dining alcoves, ensuite master baths with concealed Jaquar fittings, and AC/inverter provisions.",
    image: "/aura/luxury-master-bedroom.jpg",
    facts: ["800×1600 mm Vitrified Flooring", "Concealed Jaquar Plumbing", "Separate Utility Balcony"],
  },
  {
    index: "06",
    tag: "BOULEVARD FRONTAGE",
    title: "Integrated Commercial & Retail Plaza",
    subtitle: "Dedicated Access Separated From Residential Arrival",
    description:
      "Lower and upper ground commercial bays offer high-visibility Congress Nagar frontage while maintaining private residential lift cores and parking.",
    image: "/aura/upper-ground-commercial-plan.jpg",
    facts: ["Lower & Upper Ground Plans", "Segregated Residential Lobby", "Ample Visitor Frontage"],
  },
];

export default function AuraFeatureSequence() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const pinStageRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: pinStageRef.current,
        start: "top 92px",
        end: `+=${PANELS.length * 420}`,
        pin: true,
        scrub: 0.4,
        onUpdate: (self) => {
          const idx = Math.min(
            PANELS.length - 1,
            Math.floor(self.progress * PANELS.length)
          );
          setActiveIdx(idx);
        },
      });
      triggerRef.current = st;
      return () => {
        triggerRef.current = null;
        st.kill();
      };
    });

    return () => mm.revert();
  }, []);

  const handleSelectPanel = (idx: number) => {
    setActiveIdx(idx);
    const st = triggerRef.current;
    if (st) {
      const targetScroll =
        st.start + ((idx + 0.5) / PANELS.length) * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  };

  const current = PANELS[activeIdx];

  return (
    <section className={styles.section} id="feature-sequence-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <div className={styles.eyebrowRow}>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.eyebrow}>SIX SIGNATURE DIMENSIONS</span>
          </div>
          <h2 className={styles.heading}>
            EVERY LAYER OF AURA, <span>EXAMINED IN DETAIL</span>
          </h2>
        </div>

        {/* Desktop Pinned Interactive Stage */}
        <div className={styles.desktopStage} ref={pinStageRef}>
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
            <div className={styles.stageCopy}>
              <div className={styles.stageMeta}>
                <span className={styles.stageNumber}>({current.index})</span>
                <span className={styles.stageTag}>{current.tag}</span>
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
            </div>

            <div className={styles.stageMedia}>
              <img
                key={current.image}
                src={current.image}
                alt={current.title}
                className={styles.stageImg}
              />
            </div>
          </div>
        </div>

        {/* Mobile & Reduced-Motion Stacked Cards */}
        <div className={styles.mobileStack}>
          {PANELS.map((panel) => (
            <article className={styles.mobileCard} key={panel.index}>
              <div className={styles.mobileImgWrap}>
                <img
                  src={panel.image}
                  alt={panel.title}
                  className={styles.mobileImg}
                  loading="lazy"
                />
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

