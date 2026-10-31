"use client";

import { useState } from "react";
import styles from "./GallerySection.module.css";

interface GalleryImage {
  src: string;
  category: string;
  title: string;
  caption: string;
  span?: string;
}

const GALLERY_ITEMS: GalleryImage[] = [
  {
    src: "/aura/aura-hero-clean-4k.jpg",
    category: "ARCHITECTURE",
    title: "15-Storey Contemporary Crown",
    caption: "Tower elevation rising gracefully over Congress Nagar Road, Camp.",
    span: "featured",
  },
  {
    src: "/aura/modern-living-room.jpg",
    category: "INTERIORS",
    title: "Light-Filled Living Alcoves",
    caption: "Cross-ventilated layouts with private sit-out balconies and expansive glass.",
  },
  {
    src: "/videos/web-clip-thumb.png",
    category: "SKY LEISURE",
    title: "Level 15 Rooftop Infinity Pool",
    caption: "Panoramic rooftop lap pool and enclosed multi-sports turf 15 storeys above street noise.",
  },
  {
    src: "/aura/luxury-bedroom-2.jpg",
    category: "CRAFTSMANSHIP",
    title: "Master Bedroom Sanctuaries",
    caption: "800×1600 mm vitrified slabs with concealed Jaquar fittings and acoustic isolation.",
  },
  {
    src: "/aura/sky-balcony-lifestyle.jpg",
    category: "HORIZONS",
    title: "Deep Sit-Out Balconies",
    caption: "Private open-air decks capturing morning daylight and tranquil Melghat horizons.",
  },
  {
    src: "/aura/building-full-4k.jpg",
    category: "BOULEVARD",
    title: "Grand Arrival & Segregated Access",
    caption: "Double-height designer lobby with dedicated residential entry portico.",
  },
];

export default function GallerySection() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = ["ALL", "ARCHITECTURE", "INTERIORS", "SKY LEISURE", "CRAFTSMANSHIP"];

  const filteredItems =
    activeFilter === "ALL"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeFilter);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  };

  const prevLightbox = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  };

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>CURATED ARCHITECTURAL PORTFOLIO</span>
            <h2 className={styles.heading}>
              CURATED MOMENTS &amp; <span>ARCHITECTURE.</span>
            </h2>
            <p className={styles.sub}>
              Every angle of Aura has been planned with architectural restraint, generous natural illumination, and premium material finishes.
            </p>
          </div>

          <div className={styles.filterBar} role="tablist">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`${styles.filterBtn}${activeFilter === cat ? ` ${styles.filterBtnActive}` : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.masonryGrid}>
          {filteredItems.map((item, idx) => (
            <article
              key={item.src}
              className={`${styles.card}${item.span === "featured" ? ` ${styles.cardFeatured}` : ""}`}
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  openLightbox(idx);
                }
              }}
            >
              <div className={styles.imageWrap}>
                <img
                  src={item.src}
                  alt={item.title}
                  className={styles.image}
                  loading="lazy"
                />
                <div className={styles.scrim} />
              </div>

              <div className={styles.captionOverlay}>
                <span className={styles.cardCategory}>{item.category}</span>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <p className={styles.cardText}>{item.caption}</p>
                <span className={styles.zoomPill}>Expand Preview ↗</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={closeLightbox}>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={closeLightbox}
            aria-label="Close Preview"
          >
            ✕
          </button>
          <button
            type="button"
            className={styles.prevBtn}
            onClick={(e) => {
              e.stopPropagation();
              prevLightbox();
            }}
            aria-label="Previous image"
          >
            ←
          </button>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={filteredItems[lightboxIndex].src}
              alt={filteredItems[lightboxIndex].title}
              className={styles.lightboxImage}
            />
            <div className={styles.lightboxMeta}>
              <span className={styles.lightboxCategory}>
                {filteredItems[lightboxIndex].category}
              </span>
              <h4 className={styles.lightboxTitle}>
                {filteredItems[lightboxIndex].title}
              </h4>
              <p className={styles.lightboxCaption}>
                {filteredItems[lightboxIndex].caption}
              </p>
            </div>
          </div>
          <button
            type="button"
            className={styles.nextBtn}
            onClick={(e) => {
              e.stopPropagation();
              nextLightbox();
            }}
            aria-label="Next image"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}

