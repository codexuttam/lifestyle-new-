"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PortfolioSection.module.css";

interface PortfolioItem {
  id: string;
  location: string;
  title: string;
  description: string;
  caption: string;
  image: string;
  accentPalette: string;
}

const ITEMS: PortfolioItem[] = [
  {
    id: "suite-3bhk",
    location: "Camp, Amravati · 2026",
    title: "THE 3 BHK SKY SUITE",
    description:
      "1,850 SQFT luxury residence planned with east-facing daylight balconies, zero shared walls, dedicated dining alcove, and serene Melghat horizon views.",
    caption: "MahaRERA Reg. P5030002502915 · Premium Residential Offering.",
    image: "/aura/luxury-master-bedroom.jpg",
    accentPalette: "Accent palette: warm sand, deep walnut, and pure linen white",
  },
  {
    id: "suite-2bhk",
    location: "Camp, Amravati · 2026",
    title: "THE 2 BHK SKY RESIDENCE",
    description:
      "1,150 SQFT vastu-aligned cross-ventilated residence featuring large 800×1600mm vitrified slabs, private balcony sit-outs, and acoustic separation.",
    caption: "MahaRERA Reg. P5030002502915 · Thoughtfully Proportioned Living.",
    image: "/aura/modern-living-room.jpg",
    accentPalette: "Accent palette: warm earth, soft taupe, and stone grey",
  },
  {
    id: "sky-oasis",
    location: "Level 15 Crown · Camp",
    title: "ROOFTOP SKY OASIS",
    description:
      "An elevated sky sanctuary crowning Level 15 with panoramic infinity lap pool, kids splash deck, enclosed multi-sports turf, and sunset viewing lounge.",
    caption: "20+ Curated Sky Wellness & Recreation Facilities.",
    image: "/aura/rooftop-amenities-3d.jpg",
    accentPalette: "Accent palette: sky blue, natural teakwood, and sandstone",
  },
  {
    id: "arrival-lobby",
    location: "Ground Level · Congress Nagar",
    title: "DOUBLE-HEIGHT ARRIVAL",
    description:
      "Segregated residential entrance boulevard and grand granite arrival foyer with 4 high-speed ARD elevators, 24×7 manned security, and covered parking.",
    caption: "Architectural Statement of Contemporary Distinction.",
    image: "/aura/building-full-4k.jpg",
    accentPalette: "Accent palette: brushed brass, Italian marble, and dark espresso",
  },
];

export default function PortfolioSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const current = ITEMS[activeIdx];
  const nextItem = ITEMS[(activeIdx + 1) % ITEMS.length];

  const handlePrev = () => {
    setActiveIdx((prev) => (prev - 1 + ITEMS.length) % ITEMS.length);
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % ITEMS.length);
  };

  return (
    <section className={styles.portfolio} id="portfolio" aria-label="Aura Portfolio">
      {/* Centered Editorial Header */}
      <div className={styles.header}>
        <span className={styles.sectionLabel}>PORTFOLIO</span>
        <h2 className={styles.title}>
          IMPRESSIONS THAT <span className={styles.swashInitial}>E</span>NDURE
        </h2>
      </div>

      {/* 3-Column Architectural Showcase */}
      <div className={styles.showcaseGrid}>
        {/* Left: Featured Image */}
        <div className={styles.mainMediaWrap}>
          <Image
            src={current.image}
            alt={current.title}
            fill
            sizes="(max-width: 960px) 100vw, 500px"
            className={styles.mainImg}
          />
        </div>

        {/* Middle: Details & Narrative */}
        <div className={styles.infoCol}>
          <div>
            <div className={styles.metaTop}>{current.location}</div>
            <h3 className={styles.projectTitle}>{current.title}</h3>
            <p className={styles.projectDesc}>{current.description}</p>
          </div>
          <div className={styles.bottomCaption}>{current.caption}</div>
        </div>

        {/* Right: Counter, Next Preview & Controls */}
        <div className={styles.navCol}>
          <div className={styles.counter}>
            0{activeIdx + 1}/0{ITEMS.length}
          </div>

          <div className={styles.previewWrap}>
            <div className={styles.previewThumb}>
              <Image
                src={nextItem.image}
                alt={nextItem.title}
                fill
                sizes="(max-width: 960px) 100vw, 240px"
                className={styles.previewImg}
              />
            </div>
            <div className={styles.accentNote}>{current.accentPalette}</div>
          </div>

          <div className={styles.controlsRow}>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={handlePrev}
              aria-label="Previous portfolio item"
            >
              ←
            </button>
            <button
              type="button"
              className={styles.controlBtn}
              onClick={handleNext}
              aria-label="Next portfolio item"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
