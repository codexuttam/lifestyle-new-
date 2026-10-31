"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./PortfolioSection.module.css";
import EnquiryModal from "@/components/EnquiryModal";

interface PortfolioItem {
  id: string;
  tabLabel: string;
  location: string;
  title: string;
  description: string;
  specs: string[];
  caption: string;
  renderImg: string;
  blueprintImg: string;
  accentPalette: string;
  preference: string;
}

const ITEMS: PortfolioItem[] = [
  {
    id: "suite-3bhk",
    tabLabel: "01. 3 BHK Sky Suite",
    location: "Levels 1 to 14 · Camp, Amravati",
    title: "THE 3 BHK SKY SUITE",
    description:
      "1,850 SQFT luxury residence planned with east-facing daylight balconies, zero shared walls, acoustic sanctuary, and dedicated dining alcove.",
    specs: [
      "1,850 SQFT Super Built-up Area",
      "100% Vastu-Compliant Daylight Orientation",
      "800×1600 mm Vitrified Flooring & Jaquar Bathware",
      "Grand Sit-out Balcony (Up to 11'0\" × 6'0\")",
    ],
    caption: "MahaRERA Reg. P5030002502915 · Premium Luxury Inventory.",
    renderImg: "/aura/luxury-master-bedroom.jpg",
    blueprintImg: "/aura/plan-3bhk-cutsection.jpg",
    accentPalette: "Accent palette: warm sand, deep walnut, and pure linen white",
    preference: "3 BHK Luxury Residence (1,850 SQFT)",
  },
  {
    id: "suite-2bhk",
    tabLabel: "02. 2 BHK Luxury Suite",
    location: "Levels 1 to 14 · Camp, Amravati",
    title: "THE 2 BHK SKY RESIDENCE",
    description:
      "1,150 SQFT vastu-aligned cross-ventilated residence crafted with private sit-out balconies, zero shared walls, and acoustic separation between suites.",
    specs: [
      "1,150 SQFT Thoughtful Modern Layout",
      "Cross-Ventilated East-West Light Corridor",
      "Separate Living & Dining Functional Alcoves",
      "Full Generator Power Backup Provision",
    ],
    caption: "MahaRERA Reg. P5030002502915 · Proportioned Urban Living.",
    renderImg: "/aura/modern-living-room.jpg",
    blueprintImg: "/aura/plan-2bhk-cutsection.jpg",
    accentPalette: "Accent palette: warm earth, soft taupe, and stone grey",
    preference: "2 BHK Luxury Residence (1,150 SQFT)",
  },
  {
    id: "sky-oasis",
    tabLabel: "03. Level 15 Sky Oasis",
    location: "Crown Level 15 · Congress Nagar Skyline",
    title: "ROOFTOP SKY OASIS",
    description:
      "An elevated sky sanctuary crowning Level 15 high above street noise, featuring a panoramic infinity lap pool, kids splash deck, enclosed sports turf, and jogging loop.",
    specs: [
      "Panoramic Rooftop Infinity Lap & Kids Pool",
      "Enclosed Multi-Sports Box-Cricket & Tennis Turf",
      "360° Unobstructed Camp & Melghat Horizon Decks",
      "Sky Cabanas, Viewing Pavilions & Sunset Lawn",
    ],
    caption: "20+ Curated Sky Wellness & Recreation Facilities.",
    renderImg: "/aura/rooftop-amenities-3d.jpg",
    blueprintImg: "/aura/rooftop-sky-thrills-map.jpg",
    accentPalette: "Accent palette: sky blue, natural teakwood, and sandstone",
    preference: "Level 15 Rooftop Sky Oasis & Amenities",
  },
  {
    id: "arrival-lobby",
    tabLabel: "04. Arrival & Boulevard",
    location: "Ground Level · Congress Nagar Road",
    title: "DOUBLE-HEIGHT ARRIVAL",
    description:
      "Segregated residential entrance boulevard and grand granite arrival foyer with 4 high-speed ARD elevators, 24×7 manned security, and covered resident parking bays.",
    specs: [
      "Double-Height Granite Residential Foyer",
      "4 High-Speed Lifts with ARD & Full Power Backup",
      "24×7 CCTV Surveillance & Gated Security",
      "Segregated Commercial & Residential Circulation",
    ],
    caption: "Architectural Statement of Contemporary Distinction.",
    renderImg: "/aura/building-full-4k.jpg",
    blueprintImg: "/aura/lower-ground-commercial-plan.jpg",
    accentPalette: "Accent palette: brushed brass, Italian marble, and dark espresso",
    preference: "15-Storey Tower Architecture & Structure",
  },
];

export default function PortfolioSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [viewMode, setViewMode] = useState<"render" | "blueprint">("render");
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

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

      {/* Interactive Tabs */}
      <div className={styles.tabsRow} role="tablist">
        {ITEMS.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={activeIdx === idx}
            className={`${styles.tabBtn} ${activeIdx === idx ? styles.tabBtnActive : ""}`}
            onClick={() => setActiveIdx(idx)}
          >
            {item.tabLabel}
          </button>
        ))}
      </div>

      {/* 3-Column Architectural Showcase */}
      <div className={styles.showcaseGrid}>
        {/* Left: Featured Image with Render / Blueprint Switcher */}
        <div className={styles.mainMediaWrap}>
          <div className={styles.viewTogglePill}>
            <button
              type="button"
              className={`${styles.viewToggleBtn} ${viewMode === "render" ? styles.viewToggleBtnActive : ""}`}
              onClick={() => setViewMode("render")}
            >
              Render
            </button>
            <button
              type="button"
              className={`${styles.viewToggleBtn} ${viewMode === "blueprint" ? styles.viewToggleBtnActive : ""}`}
              onClick={() => setViewMode("blueprint")}
            >
              Floor Plan
            </button>
          </div>

          <Image
            src={viewMode === "render" ? current.renderImg : current.blueprintImg}
            alt={current.title}
            fill
            sizes="(max-width: 960px) 100vw, 500px"
            className={styles.mainImg}
          />
        </div>

        {/* Middle: Details & Real-Estate Specifications */}
        <div className={styles.infoCol}>
          <div>
            <div className={styles.metaTop}>{current.location}</div>
            <h3 className={styles.projectTitle}>{current.title}</h3>
            <p className={styles.projectDesc}>{current.description}</p>

            <div className={styles.specRow}>
              {current.specs.map((spec) => (
                <div key={spec} className={styles.specItem}>
                  <span className={styles.specDot}>✦</span>
                  <span>{spec}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              className={styles.enquireBtn}
              onClick={() => setIsEnquiryOpen(true)}
              aria-label={`Enquire about ${current.title}`}
            >
              <span>ENQUIRE CONFIGURATION</span>
              <span>→</span>
            </button>
          </div>

          <div className={styles.bottomCaption}>{current.caption}</div>
        </div>

        {/* Right: Counter, Next Preview & Controls */}
        <div className={styles.navCol}>
          <div className={styles.counter}>
            0{activeIdx + 1}/0{ITEMS.length}
          </div>

          <div
            className={styles.previewWrap}
            onClick={handleNext}
            title={`View ${nextItem.title}`}
            role="button"
            tabIndex={0}
          >
            <div className={styles.previewThumb}>
              <Image
                src={nextItem.renderImg}
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

      {/* VIP Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={current.preference}
        source={`Portfolio Showcase - ${current.title}`}
      />
    </section>
  );
}
