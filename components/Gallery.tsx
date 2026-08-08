"use client";

import { useState } from "react";

const GALLERY_ITEMS = [
  { src: "/images/gallery_1_1779379484199.png", alt: "Modern Luxury Villa at Twilight", caption: "Modern Villa · Gurugram 2024" },
  { src: "/images/gallery_2_1779379510372.png", alt: "High-end Residential Construction Site", caption: "Contemporary Home · Noida 2023" },
  { src: "/images/gallery_3_1779379534787.png", alt: "Contemporary Smart Home Exterior", caption: "Luxury Bungalow · Delhi 2022" },
  { src: "/images/gallery_4_1779379550084.png", alt: "Construction Workers Pouring Concrete", caption: "Minimalist Design · Gurugram 2024" },
  { src: "/images/gallery_5_1779379567777.png", alt: "Classic Architecture Luxury Bungalow", caption: "Classic Architecture · Delhi 2023" },
  { src: "/images/gallery_6_1779379588256.png", alt: "Modern House Interior During Construction", caption: "Smart Home · Noida 2024" },
  { src: "/images/gallery_7_1779379605692.png", alt: "Premium Finished Living Room", caption: "Premium Finish · Gurugram 2022" },
  { src: "/images/gallery_8_1779379624217.png", alt: "Large Luxury Estate Exterior", caption: "Spacious Interiors · Delhi 2024" },
  { src: "/images/gallery_9_1779379642249.png", alt: "Residential Building Construction Site", caption: "Luxury Estate · Noida 2023" },
];

export default function Gallery() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const changeLightbox = (direction: number) => {
    setLightboxIndex((prev) =>
      prev === null
        ? null
        : (prev + direction + GALLERY_ITEMS.length) % GALLERY_ITEMS.length
    );
  };

  const current = lightboxIndex !== null ? GALLERY_ITEMS[lightboxIndex] : null;

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
            {GALLERY_ITEMS.map((item, index) => (
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
