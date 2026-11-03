"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./GallerySection.module.css";

export type MediaBadgeType = "RENDER" | "COMPLETED_PHOTO";

export interface GalleryMediaItem {
  id: string;
  src: string;
  category: "AURA (CAMP)" | "LIFESTYLE HOMES (DPS RD)" | "INTERIORS" | "ROOFTOP & AMENITIES";
  typeBadge: MediaBadgeType;
  title: string;
  caption: string;
}

const GALLERY_MEDIA: GalleryMediaItem[] = [
  {
    id: "aura-tower-elevation",
    src: "/aura/exterior-elevation-day-hd.jpg",
    category: "AURA (CAMP)",
    typeBadge: "RENDER",
    title: "15-Storey Tower Elevation",
    caption: "Amravati's premier 15-storey highrise tower on Congress Nagar Road, Camp. Architectural visualization of facade.",
  },
  {
    id: "lifestyle-homes-delivered-front",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-delivered-front.jpg",
    category: "LIFESTYLE HOMES (DPS RD)",
    typeBadge: "COMPLETED_PHOTO",
    title: "Delivered 8-Storey Landmark",
    caption: "Actual on-site photograph of the completed residential & commercial landmark on 24m DPS Road, Parvati Nagar.",
  },
  {
    id: "aura-rooftop-pool-deck",
    src: "/aura/rooftop-pool-turf-hd.jpg",
    category: "ROOFTOP & AMENITIES",
    typeBadge: "RENDER",
    title: "Level 15 Crown Sky Oasis",
    caption: "Rooftop lap pool, kids splash zone, and enclosed box cricket turf 15 storeys above street level.",
  },
  {
    id: "lifestyle-homes-real-building",
    src: "/assets/projects/lifestyle-homes/building/lifestyle-real-delivered-building.jpg",
    category: "LIFESTYLE HOMES (DPS RD)",
    typeBadge: "COMPLETED_PHOTO",
    title: "Delivered Facade & Balconies",
    caption: "Actual on-site photograph of the delivered cantilever balconies and finished exterior structure on DPS Road.",
  },
  {
    id: "aura-living-room",
    src: "/aura/modern-living-room.jpg",
    category: "INTERIORS",
    typeBadge: "RENDER",
    title: "Living & Dining Alcove",
    caption: "Generous cross-ventilation, sit-out balcony connectivity, and 800×1600 mm vitrified floor finishes.",
  },
  {
    id: "aura-master-suite",
    src: "/aura/luxury-master-bedroom.jpg",
    category: "INTERIORS",
    typeBadge: "RENDER",
    title: "Master Bedroom Retreat",
    caption: "Private acoustic isolation, natural morning light, dedicated dressing niche, and attached luxury bath.",
  },
  {
    id: "aura-grand-lobby",
    src: "/aura/grand-entrance-lobby-hd.jpg",
    category: "AURA (CAMP)",
    typeBadge: "RENDER",
    title: "Double-Height Arrival Lobby",
    caption: "Segregated private residential entrance foyer with Italian marble flooring and 4 high-speed elevators.",
  },
  {
    id: "aura-sky-balcony",
    src: "/aura/sky-balcony-lifestyle.jpg",
    category: "ROOFTOP & AMENITIES",
    typeBadge: "RENDER",
    title: "Panoramic Skyline Balcony",
    caption: "Deep sit-out balcony providing expansive horizon views across Camp and the tranquil Melghat greens.",
  },
];

const CATEGORIES = [
  "ALL",
  "AURA (CAMP)",
  "LIFESTYLE HOMES (DPS RD)",
  "INTERIORS",
  "ROOFTOP & AMENITIES",
] as const;

export default function GallerySection() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filteredItems =
    activeCategory === "ALL"
      ? GALLERY_MEDIA
      : GALLERY_MEDIA.filter((item) => item.category === activeCategory);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredItems.length : null));
      if (e.key === "ArrowLeft") setLightboxIndex((prev) => (prev !== null ? (prev - 1 + filteredItems.length) % filteredItems.length : null));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, filteredItems.length]);

  const activeMedia = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section className={styles.section} id="gallery" aria-label="Curated Architectural Gallery">
      <div className={styles.container}>
        {/* Editorial Section Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>EDITORIAL VISUAL PORTFOLIO</span>
          <h2 className={styles.title}>
            MOMENTS &amp; <span>A</span>RCHITECTURE
          </h2>
          <p className={styles.subtitle}>
            Explore on-site delivered photography from Lifestyle Home Spaces alongside verified architectural concept visualizations of our flagship highrise Aura.
          </p>

          {/* Category Filter Pills */}
          <div className={styles.filterBar} role="tablist" aria-label="Gallery categories">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ""}`}
                  onClick={() => {
                    setActiveCategory(cat);
                    setLightboxIndex(null);
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Gallery Grid with Restrained Reveal */}
        <div className={styles.galleryGrid} data-reveal-group>
          {filteredItems.map((item, idx) => (
            <article
              key={item.id}
              className={styles.galleryCard}
              onClick={() => setLightboxIndex(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setLightboxIndex(idx);
                }
              }}
              aria-label={`View ${item.title}`}
            >
              <div className={styles.imageWrap}>
                <img
                  src={item.src}
                  alt={item.title}
                  className={styles.cardImg}
                  loading="lazy"
                />

                {/* Clear distinction between completed photo vs render */}
                <span
                  className={`${styles.typeBadge} ${
                    item.typeBadge === "COMPLETED_PHOTO"
                      ? styles.badgeCompleted
                      : styles.badgeRender
                  }`}
                >
                  {item.typeBadge === "COMPLETED_PHOTO"
                    ? "✓ COMPLETED ON-SITE PHOTO"
                    : "✦ ARCHITECTURAL CONCEPT RENDER"}
                </span>

                <div className={styles.cardOverlay}>
                  <div className={styles.overlayContent}>
                    <span className={styles.overlayCategory}>{item.category}</span>
                    <h3 className={styles.overlayTitle}>{item.title}</h3>
                    <p className={styles.overlayCaption}>{item.caption}</p>
                    <span className={styles.inspectPill}>⤢ Enlarge View</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Enlarged Editorial Lightbox Modal */}
      {activeMedia && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={activeMedia.title}
          onClick={() => setLightboxIndex(null)}
        >
          <div className={styles.lightboxTopBar}>
            <div className={styles.lightboxMeta}>
              <span
                className={`${styles.typeBadge} ${
                  activeMedia.typeBadge === "COMPLETED_PHOTO"
                    ? styles.badgeCompleted
                    : styles.badgeRender
                }`}
              >
                {activeMedia.typeBadge === "COMPLETED_PHOTO"
                  ? "✓ COMPLETED ON-SITE PHOTOGRAPH"
                  : "✦ ARCHITECTURAL CONCEPT RENDER"}
              </span>
              <strong className={styles.lightboxTitle}>{activeMedia.title}</strong>
            </div>

            <button
              type="button"
              className={styles.closeBtn}
              onClick={() => setLightboxIndex(null)}
              aria-label="Close enlarged gallery image"
            >
              ✕ Close
            </button>
          </div>

          <div className={styles.lightboxBody} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.prevBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex! - 1 + filteredItems.length) % filteredItems.length);
              }}
              aria-label="Previous image"
            >
              ←
            </button>

            <div className={styles.lightboxMediaFrame}>
              <img
                src={activeMedia.src}
                alt={activeMedia.title}
                className={styles.lightboxImg}
              />
              <p className={styles.lightboxCaption}>{activeMedia.caption}</p>
            </div>

            <button
              type="button"
              className={`${styles.navBtn} ${styles.nextBtn}`}
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((lightboxIndex! + 1) % filteredItems.length);
              }}
              aria-label="Next image"
            >
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
