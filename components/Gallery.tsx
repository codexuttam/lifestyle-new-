"use client";

import { useState } from "react";

import type { GalleryRecord } from "@/lib/schemas/gallery";


export default function Gallery({ items }: { items: GalleryRecord[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const changeLightbox = (direction: number) => {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : (prev + direction + items.length) % items.length
    );
  };

  const current = lightboxIndex !== null ? items[lightboxIndex] : null;

  return (
    <>
      <section id="gallery" className="section gallery reveal-section">
        <div className="container">
          <div className="section-header">
            <h2 className="hero-text">Work That Speaks</h2>
            <p className="body-text">
              A glimpse into the homes we have crafted across Delhi NCR.
            </p>
          </div>
          <div className="masonry-grid">
            {items.map((item, index) => (
              <div
                className="masonry-item"
                key={item.src}
                onClick={() => setLightboxIndex(index)}
              >
                <img src={item.src} alt={item.alt} />
                <div className="overlay">
                  <i className="fa-solid fa-plus gold-icon" />
                  <p>{item.caption}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: 40 }}>
            <button className="cta-button outline">Load More</button>
          </div>
        </div>
      </section>

      <div id="lightbox" className={`lightbox${current ? " active" : ""}`}>
        <span className="close-lightbox" onClick={() => setLightboxIndex(null)}>
          &times;
        </span>
        <div className="lightbox-nav prev" onClick={() => changeLightbox(-1)}>
          <i className="fa-solid fa-chevron-left" />
        </div>
        {current && (
          <img className="lightbox-content" id="lightbox-img" src={current.src} alt={current.alt} />
        )}
        <div className="lightbox-nav next" onClick={() => changeLightbox(1)}>
          <i className="fa-solid fa-chevron-right" />
        </div>
        <div id="lightbox-caption">{current ? current.caption : ""}</div>
      </div>
    </>
  );
}
