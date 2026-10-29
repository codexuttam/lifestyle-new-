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
  video?: string;
  image: string;
  specs: string[];
}

const ZONES: ZonePreset[] = [
  {
    id: "full",
    index: "01",
    name: "Full 15-Storey Tower",
    badge: "Flagship Elevation",
    title: "Aura by Lifestyle",
    sublabel: "Congress Nagar Road · Camp, Amravati",
    description:
      "Amravati's 15-storey architectural landmark uniting ground-level commercial Boulevard frontage, 14 residential floors, and a crowning sky deck.",
    video: "/videos/aura-showcase-clip.mp4",
    image: "/aura/aura-hero-clean-4k.jpg",
    specs: ["15 Storeys", "4 High-Speed Lifts", "MahaRERA P5030002502915"],
  },
  {
    id: "rooftop",
    index: "02",
    name: "Rooftop Sky Oasis",
    badge: "Level 15 Crown",
    title: "Sky Pool & Multi-Sports Turf",
    sublabel: "360° Unobstructed Amravati & Melghat Views",
    description:
      "Lap & leisure swimming pool, shallow kids pool, enclosed box-cricket & multi-sports turf, rooftop jogging loop, party lawn, and sunset cabanas.",
    image: "/aura/rooftop-amenities-3d.jpg",
    specs: ["Infinity Sky Pool", "Box Cricket Turf", "Solar Common Grid"],
  },
  {
    id: "residences",
    index: "03",
    name: "2 & 3 BHK Sky Suites",
    badge: "Levels 1 to 14",
    title: "Cross-Ventilated Vastu Residences",
    sublabel: "1,150 – 1,850 Sqft · Private Balconies",
    description:
      "Expansive living-dining cores finished with 800×1600 mm vitrified slabs, concealed Jaquar bathware, dedicated utility balconies, and zero shared walls.",
    image: "/aura/modern-living-room.jpg",
    specs: ["800×1600 Vitrified", "Jaquar Bathware", "100% Vastu Layout"],
  },
  {
    id: "entrance",
    index: "04",
    name: "Arrival & Boulevard",
    badge: "Ground & Podium",
    title: "Double-Height Designer Lobby",
    sublabel: "Manned Security, CCTV & Covered Parking",
    description:
      "Welcoming double-height entrance lobby, dedicated residential arrival portico separated from retail bays, 24×7 CCTV surveillance, and generator backup.",
    image: "/aura/aura-brand-showcase.jpg",
    specs: ["24×7 CCTV Security", "Generator Backup", "Dedicated Parking"],
  },
];

export default function ExploreSection({
  content,
  projectTitle,
}: {
  content: HomeRecord["explore"];
  projectTitle: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeZone = ZONES[activeIndex];

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
  }, [activeZone.id]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-explore-reveal]", {
        y: 32,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleKeyNav = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % ZONES.length);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + ZONES.length) % ZONES.length);
    }
  };

  return (
    <section className={styles.explore} id="explore-site-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.headerRow} data-explore-reveal>
          <div className={styles.eyebrowBox}>
            <span className={styles.eyebrow}>INTERACTIVE TOWER EXPLORER</span>
            {projectTitle && <span className={styles.projectMeta}>{projectTitle}</span>}
          </div>
          <h2 className={styles.heading}>{content.headline}</h2>
        </div>

        {/* Keyboard & Touch Accessible Zone Selector */}
        <div
          className={styles.zoneTabs}
          role="tablist"
          aria-label="Explore Aura building levels"
          onKeyDown={handleKeyNav}
          data-explore-reveal
        >
          {ZONES.map((zone, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                type="button"
                role="tab"
                id={`zone-tab-${zone.id}`}
                aria-selected={isActive}
                aria-controls={`zone-panel-${zone.id}`}
                tabIndex={isActive ? 0 : -1}
                key={zone.id}
                onClick={() => setActiveIndex(idx)}
                className={`${styles.zoneTab}${isActive ? ` ${styles.zoneTabActive}` : ""}`}
              >
                <span className={styles.tabIndex}>{zone.index}</span>
                <span className={styles.tabName}>{zone.name}</span>
              </button>
            );
          })}
        </div>

        {/* Framed Interactive Architectural Stage */}
        <div
          className={styles.mediaPanel}
          id={`zone-panel-${activeZone.id}`}
          role="tabpanel"
          aria-labelledby={`zone-tab-${activeZone.id}`}
          data-explore-reveal
        >
          <div className={styles.buildingViewer}>
            {activeZone.video ? (
              <video
                ref={videoRef}
                key={activeZone.video}
                autoPlay
                loop
                muted
                playsInline
                poster={activeZone.image}
                className={styles.viewerMedia}
                aria-hidden="true"
              >
                <source src={activeZone.video} type="video/mp4" />
              </video>
            ) : (
              <img
                key={activeZone.image}
                src={activeZone.image}
                alt={activeZone.title}
                className={styles.viewerMedia}
              />
            )}
            <div className={styles.viewerOverlay} />
          </div>

          <div className={styles.cardWrapper}>
            <div className={styles.card}>
              <div className={styles.cardTopRow}>
                <span className={styles.cardBadge}>{activeZone.badge}</span>
                <span className={styles.cardCounter}>
                  {activeZone.index} / 0{ZONES.length}
                </span>
              </div>

              <h3 className={styles.cardTitle}>{activeZone.title}</h3>
              <p className={styles.cardSublabel}>{activeZone.sublabel}</p>
              <p className={styles.cardDescription}>{activeZone.description}</p>

              <div className={styles.specChips}>
                {activeZone.specs.map((spec) => (
                  <span className={styles.specChip} key={spec}>
                    ✦ {spec}
                  </span>
                ))}
              </div>

              <div className={styles.cardActions}>
                <a href="#floor-plans" className={`${styles.cardActionBtn} roll-button`}>
                  <span className="roll-text" data-text="Inspect Floor Plates ↓">
                    Inspect Floor Plates ↓
                  </span>
                </a>
                <button
                  type="button"
                  className={styles.enquireLink}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("lifestyle_open_enquiry", {
                        detail: { project: "Aura by Lifestyle", source: `Tower Explorer - ${activeZone.name}` },
                      })
                    )
                  }
                >
                  Request Brochure →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
