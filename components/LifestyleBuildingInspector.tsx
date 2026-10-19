"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LifestyleBuildingInspector.module.css";

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
  status: string;
}

const ZONES: ZonePreset[] = [
  {
    id: "full",
    name: "Full 8-Storey Landmark",
    badge: "Delivered Landmark",
    title: "Lifestyle Home Spaces",
    sublabel: "DPS Road, Parvati Nagar",
    description: "Amravati's delivered residential and commercial landmark featuring 30 luxury 2 & 3 BHK flats and 24 road-facing retail showrooms.",
    scale: 1.0,
    translateY: 0,
    progress: 100,
    status: "Ready For Immediate Possession",
  },
  {
    id: "residences",
    name: "2 & 3 BHK Residences",
    badge: "Floors 2 to 7",
    title: "Delivered Living Suites",
    sublabel: "2 & 3 BHK Vastu Homes",
    description: "Naturally ventilated flats with expansive sit-out balconies, minimum 2'x4' vitrified tiles, teak entrance doors, and dual Otis elevators.",
    scale: 1.6,
    translateY: -8,
    progress: 100,
    status: "Immediate Keys Handover",
  },
  {
    id: "commercial",
    name: "24 Retail Showrooms",
    badge: "Ground & 1st Floor",
    title: "High-Street Shopping Arcade",
    sublabel: "MORE, Dee Bakers & Retail",
    description: "Double-storey commercial showrooms with wide glass frontages, dedicated customer parking, and high daily footfall on 24-metre DPS Road.",
    scale: 1.8,
    translateY: -50,
    progress: 100,
    status: "Fully Operational & Delivered",
  },
  {
    id: "entrance",
    name: "Grand Entrance & Parking",
    badge: "Ground Level",
    title: "Main Entrance & Stilt Parking",
    sublabel: "Gated Security & Covered Bays",
    description: "Attractive entrance security gate, manned security cabin, 24/7 CCTV surveillance, and dedicated vehicular parking bays for residents and visitors.",
    scale: 1.85,
    translateY: -64,
    progress: 100,
    status: "Delivered & Secure",
  },
];

export default function LifestyleBuildingInspector({
  whatsappHref,
}: {
  whatsappHref: string;
}) {
  const [activeZone] = useState<ZonePreset>(ZONES[0]);

  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  const HEADLINE = "Inspect The Delivered 8-Storey Landmark In High Resolution";

  return (
    <section className={styles.inspectorSection} id="explore-site-section" ref={sectionRef}>
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
        {/* Delivered Reality Video & Interactive Inspector */}
        <div className={styles.buildingViewer}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.viewerVideo}
            aria-hidden="true"
          >
            <source src="/videos/lifestyle-showcase-clip.mp4" type="video/mp4" />
          </video>
          <div className={styles.viewerOverlay} />
        </div>


        {/* Dynamic Architectural Detail Card */}
        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconWrapper}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-3M9 9v.01M9 13v.01M9 17v.01" />
                </svg>
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardLabel}>{activeZone.badge}</span>
                <span className={styles.cardTitle}>{activeZone.title}</span>
              </div>
            </div>

            <p className={styles.cardDescription}>{activeZone.description}</p>

            <div className={styles.cardMiddleRow}>
              <div className={styles.statusBlock}>
                <span className={styles.statusDot} />
                <span className={styles.statusText}>{activeZone.status}</span>
              </div>
              <span className={styles.reraTag}>MahaRERA: P50300054447</span>
            </div>

            <div className={styles.cardBottomRow}>
              <span className={styles.cardSublabel}>{activeZone.sublabel}</span>
              <a
                href={`${whatsappHref}?text=${encodeURIComponent(
                  `Hello Lifestyle Homes, I am inspecting the ${activeZone.name} at Lifestyle Home Spaces on DPS Road. Please arrange a site visit.`
                )}`}
                className={styles.cardActionBtn}
              >
                Inspect On Site →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
