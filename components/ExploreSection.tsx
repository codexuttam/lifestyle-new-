"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./ExploreSection.module.css";

interface ZonePanel {
  id: string;
  index: string;
  tag: string;
  title: string;
  subtitle: string;
  description: string;
  video?: string;
  image: string;
  facts: string[];
}

const ZONES: ZonePanel[] = [
  {
    id: "full",
    index: "01",
    tag: "FULL 15-STOREY TOWER",
    title: "Aura by Lifestyle",
    subtitle: "Flagship 15-Storey Residential Landmark · Congress Nagar, Camp",
    description:
      "Rising 15 storeys above Camp's greenest residential avenue with contemporary rectilinear facades, four high-speed elevators, and MahaRERA registered transparency.",
    video: "/videos/aura-showcase-clip.mp4",
    image: "/aura/aura-hero-clean-4k.jpg",
    facts: [
      "15 Storeys + Level 15 Sky Deck",
      "4 High-Speed Lifts with Power Backup",
      "MahaRERA Reg. P5030002502915",
    ],
  },
  {
    id: "rooftop",
    index: "02",
    tag: "ROOFTOP SKY OASIS",
    title: "Sky Pool & Multi-Sports Turf",
    subtitle: "Level 15 Crown Leisure Above Street Noise",
    description:
      "An elevated sanctuary featuring a panoramic infinity lap pool, kids splash deck, enclosed box-cricket and tennis turf, jogging loop, and sunset cabanas.",
    image: "/videos/web-clip-thumb.png",
    facts: [
      "Panoramic Rooftop Lap & Kids Pool",
      "Enclosed Multi-Sports Box Turf",
      "360° Unobstructed Camp & Melghat Views",
    ],
  },
  {
    id: "residences",
    index: "03",
    tag: "2 & 3 BHK SKY SUITES",
    title: "Cross-Ventilated Vastu Suites",
    subtitle: "Levels 1 to 14 · 1,150 to 1,850 Sqft Residences",
    description:
      "Zero-shared-wall 2 and 3 BHK residences crafted with private sit-out balconies, 800×1600 mm vitrified slabs, and concealed Jaquar bathware.",
    image: "/aura/modern-living-room.jpg",
    facts: [
      "Zero Shared Walls for Acoustic Privacy",
      "800×1600 mm Vitrified Flooring",
      "100% Vastu-Aligned Daylight Layouts",
    ],
  },
  {
    id: "entrance",
    index: "04",
    tag: "ARRIVAL & BOULEVARD",
    title: "Double-Height Designer Lobby",
    subtitle: "Segregated Residential Arrival & Covered Parking",
    description:
      "Grand residential arrival portico separated from street-front bays, complete with 24×7 CCTV surveillance, gated security, and covered resident parking.",
    image: "/aura/building-full-4k.jpg",
    facts: [
      "Double-Height Granite Entrance Lobby",
      "24×7 CCTV & Manned Gated Security",
      "Dedicated Covered Resident Parking",
    ],
  },
];

function getDeckTransform(idx: number, activeIdx: number) {
  const diff = idx - activeIdx;
  if (diff === 0) {
    return {
      transform: "translate3d(0px, 0px, 0px) scale(1)",
      opacity: 1,
      zIndex: 30,
      filter: "brightness(1)",
    };
  }
  // Upcoming cards sit below, sliding from down to up
  if (diff > 0) {
    const clamped = Math.min(diff, 3);
    return {
      transform: `translate3d(0px, ${clamped * 44}px, ${-clamped * 20}px) scale(${1 - clamped * 0.045})`,
      opacity: diff > 2 ? 0 : Math.max(0.24, 0.84 - diff * 0.26),
      zIndex: 30 - diff,
      filter: "brightness(0.65)",
    };
  }
  // Past cards scale down and dim into background stack
  const abs = Math.min(Math.abs(diff), 2);
  return {
    transform: `translate3d(0px, ${-abs * 22}px, ${-abs * 40}px) scale(${1 - abs * 0.06})`,
    opacity: abs > 2 ? 0 : 0.38,
    zIndex: 20 - abs,
    filter: "brightness(0.55)",
  };
}

export default function ExploreSection({
  content,
}: {
  content: HomeRecord["explore"];
  projectTitle?: string;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  // Scroll-scrubbed word illumination on section headline
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = headingRef.current?.querySelectorAll(`.${styles.word}`);
      if (words?.length) {
        gsap.fromTo(
          words,
          { opacity: 0.26, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 86%",
              end: "bottom 54%",
              scrub: 0.45,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Native CSS Sticky Scroll Progress (same motion architecture as AuraFeatureSequence)
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
      const idx = Math.floor(progress * ZONES.length);
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

  const handleSelectZone = (idx: number) => {
    setActiveIdx(idx);
    const runway = runwayRef.current;
    if (runway && window.innerWidth >= 1024) {
      const stickyOffset = 88;
      const runwayTop = runway.getBoundingClientRect().top + window.scrollY;
      const scrollable = runway.offsetHeight - (window.innerHeight - stickyOffset);
      if (scrollable > 0) {
        const targetY =
          runwayTop - stickyOffset + ((idx + 0.35) / ZONES.length) * scrollable;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  const current = ZONES[activeIdx];
  const words = content.headline.trim().split(/\s+/);

  return (
    <section className={styles.explore} id="explore-site-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.headerRow}>
          <h2 className={styles.heading} ref={headingRef}>
            {words.map((word, idx) => (
              <span key={`${word}-${idx}`}>
                <span className={styles.word}>{word}</span>
                {idx < words.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
        </div>

        {/* Desktop Sticky Scroll-Driven 3D Deck Runway */}
        <div className={styles.desktopRunway} ref={runwayRef}>
          <div className={styles.desktopSticky}>
            <div className={styles.selectorRail} role="tablist" aria-label="Explore Aura building levels">
              {ZONES.map((zone, idx) => {
                const isActive = idx === activeIdx;
                return (
                  <button
                    key={zone.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.railBtn}${isActive ? ` ${styles.railBtnActive}` : ""}`}
                    onClick={() => handleSelectZone(idx)}
                  >
                    <span className={styles.railIndex}>({zone.index})</span>
                    <span className={styles.railLabel}>{zone.tag}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.stageCard}>
              <div className={styles.stageCopy}>
                <div className={styles.stageNumberRow}>
                  <span className={styles.stageNumber}>({current.index})</span>
                  <span className={styles.stageSubtitle}>{current.subtitle}</span>
                </div>

                <h3 className={styles.stageTitle} key={`t-${current.index}`}>
                  {current.title}
                </h3>
                <p className={styles.stageDesc}>{current.description}</p>

                <ul className={styles.factList}>
                  {current.facts.map((fact) => (
                    <li key={fact}>
                      <span aria-hidden="true">✦</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>

                <div className={styles.ctaRow}>
                  <a href="#floor-plans" className={`${styles.primaryBtn} roll-button`}>
                    <span className="roll-text" data-text="Inspect Floor Plans ↓">
                      Inspect Floor Plans ↓
                    </span>
                  </a>
                  <button
                    type="button"
                    className={styles.enquireLink}
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("lifestyle_open_enquiry", {
                          detail: {
                            project: "Aura by Lifestyle",
                            source: `Tower Explorer - ${current.title}`,
                          },
                        })
                      )
                    }
                  >
                    Private Enquiry →
                  </button>
                </div>

                <div className={styles.bottomBar}>
                  <div className={styles.progressFooter}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${((activeIdx + 1) / ZONES.length) * 100}%` }}
                      />
                    </div>
                    <span className={styles.progressCount}>
                      {current.index} / 0{ZONES.length}
                    </span>
                  </div>

                  <div className={styles.deckControls}>
                    <button
                      type="button"
                      className={styles.deckStepBtn}
                      onClick={() => handleSelectZone((activeIdx - 1 + ZONES.length) % ZONES.length)}
                      aria-label="Previous tower level"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      className={styles.deckStepBtn}
                      onClick={() => handleSelectZone((activeIdx + 1) % ZONES.length)}
                      aria-label="Next tower level"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.deckStage}>
                {ZONES.map((zone, idx) => {
                  const isFront = idx === activeIdx;
                  const styleObj = getDeckTransform(idx, activeIdx);
                  return (
                    <div
                      key={zone.id}
                      className={`${styles.flyingCard}${isFront ? ` ${styles.flyingCardActive}` : ""}`}
                      style={styleObj}
                      onClick={() => handleSelectZone(idx)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Focus (${zone.index}) ${zone.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectZone(idx);
                        }
                      }}
                    >
                      {zone.video && isFront ? (
                        <video
                          src={zone.video}
                          poster={zone.image}
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
                          src={zone.image}
                          alt={zone.title}
                          className={styles.flyingMedia}
                          loading="lazy"
                        />
                      )}
                      <div className={styles.flyingScrim} />
                      <div className={styles.flyingCardCaption}>
                        <div className={styles.flyingIndexRow}>
                          <span className={styles.flyingLine} />
                          <span>({zone.index})</span>
                        </div>
                        <h4 className={styles.flyingTitle}>{zone.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Responsive Stack */}
        <div className={styles.mobileStack}>
          {ZONES.map((zone) => (
            <article className={styles.mobileCard} key={zone.id}>
              <div className={styles.mobileImgWrap}>
                {zone.video ? (
                  <video
                    src={zone.video}
                    poster={zone.image}
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
                    src={zone.image}
                    alt={zone.title}
                    className={styles.mobileImg}
                    loading="lazy"
                  />
                )}
              </div>
              <div className={styles.mobileBody}>
                <span className={styles.mobileIndex}>({zone.index}) · {zone.tag}</span>
                <h3 className={styles.mobileTitle}>{zone.title}</h3>
                <p className={styles.mobileDesc}>{zone.description}</p>
                <ul className={styles.factList}>
                  {zone.facts.map((fact) => (
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
