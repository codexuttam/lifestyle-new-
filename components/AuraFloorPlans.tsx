"use client";

import { useEffect, useState } from "react";
import styles from "./AuraFloorPlans.module.css";

const PLANS = [
  {
    id: "2bhk",
    index: "01",
    label: "2 BHK Cut Section",
    badge: "1,150 SQFT",
    title: "2 BHK Smart Luxury Residence",
    subtitle: "Commanding skyline views, dual balconies & zero wasted circulation",
    image: "/aura/plan-2bhk-cutsection.jpg",
    specs: [
      { room: "Living Room", dim: "11'0\" × 17'0\"" },
      { room: "Master Bedroom", dim: "11'0\" × 12'0\" (Ensuite)" },
      { room: "Kid's Bedroom", dim: "11'0\" × 12'0\"" },
      { room: "Dining Area", dim: "9'6\" × 12'6\"" },
      { room: "Kitchen", dim: "9'0\" × 9'6\"" },
      { room: "Main Balcony", dim: "11'0\" × 6'0\"" },
      { room: "Washing Utility", dim: "8'6\" × 6'0\"" },
      { room: "Flooring", dim: "800 × 1600 mm Vitrified" },
    ],
    features: [
      "Isometric 3D Cut Section & Top Architectural View",
      "Private Master Suite with Dedicated Toilet (5'0\" × 9'0\")",
      "3-Track Powder Coated Windows with MS Safety Grills",
      "Concealed Jaquar or Equivalent Designer Fittings",
    ],
  },
  {
    id: "3bhk",
    index: "02",
    label: "3 BHK Royal Cut Section",
    badge: "1,650 SQFT",
    title: "3 BHK Royal Skyline Residence",
    subtitle: "Grand multi-balcony suite designed for expansive family hospitality",
    image: "/aura/plan-3bhk-cutsection.jpg",
    specs: [
      { room: "Grand Living Room", dim: "11'0\" × 18'6\"" },
      { room: "Master Suite", dim: "17'0\" × 11'0\" (Ensuite)" },
      { room: "Dining Hall", dim: "15'0\" × 11'0\"" },
      { room: "Kid's Bedroom", dim: "12'0\" × 11'0\"" },
      { room: "Guest Bedroom", dim: "12'0\" × 11'0\"" },
      { room: "Kitchen", dim: "9'6\" × 11'0\"" },
      { room: "Living Balcony", dim: "10'6\" × 6'0\"" },
      { room: "Bed Balcony", dim: "11'0\" × 5'6\"" },
    ],
    features: [
      "Palatial Living and Dining Core with Cross-Ventilation",
      "3 Well-Appointed Bathrooms with Anti-Skid Vitrified Tiles",
      "Separate Washing and Utility Balcony (9'0\" × 5'6\")",
      "Provision for Inverter & Split AC in All Bedrooms",
    ],
  },
  {
    id: "rooftop",
    index: "03",
    label: "Rooftop Sky Oasis",
    badge: "LEVEL 15",
    title: "Skyline Leisure & Multi-Sports Deck",
    subtitle: "Rooftop lap pool, enclosed box cricket turf & sunset viewing promenade",
    image: "/aura/rooftop-sky-thrills-map.jpg",
    specs: [
      { room: "Swimming Pool", dim: "Lap & Leisure Pool" },
      { room: "Kids Pool", dim: "Safe Shallow Splash Zone" },
      { room: "Multi-Sports Turf", dim: "Box Cricket & Tennis" },
      { room: "Viewing Deck", dim: "Panoramic Skyline Seating" },
      { room: "Fitness Track", dim: "Rooftop Jogging Loop" },
      { room: "Party Lawn", dim: "Open-Air Gathering Zone" },
      { room: "Solar Power", dim: "Common Area Renewable Grid" },
      { room: "Elevators", dim: "4 Elevators with Gen Backup" },
    ],
    features: [
      "Uninterrupted 360-Degree Views Across Amravati & Melghat Horizon",
      "Dedicated Changing Rooms & Poolside Shower Suites",
      "Safety Balustrades & Architectural Evening Lighting",
      "Solar Panel System Powering Common Utilities",
    ],
  },
  {
    id: "typical",
    index: "04",
    label: "Typical Floor Plate",
    badge: "LEVELS 1 – 14",
    title: "Typical Architectural Floor Plate",
    subtitle: "Optimum cross-ventilation, 4 high-speed elevators & wide designer corridors",
    image: "/aura/typical-floor-plan.jpg",
    specs: [
      { room: "Floor Plate", dim: "Levels 1 to 14" },
      { room: "Configurations", dim: "2 & 3 BHK Luxury Suites" },
      { room: "Circulation", dim: "Wide Lobbies & Corridors" },
      { room: "Lifts", dim: "4 High-Speed Passenger Lifts" },
      { room: "Staircases", dim: "Dual Fire & Service Stairs" },
      { room: "Ventilation", dim: "360° Open Cross-Ventilation" },
      { room: "Balconies", dim: "Private Sit-Out Balconies" },
      { room: "Compliance", dim: "100% Vastu Compliant Layout" },
    ],
    features: [
      "Master Architectural Floor Layout for Floors 1 to 14",
      "No Common Wall Sharing for Superior Acoustic Privacy",
      "Dedicated Service Ducts and Concealed Fire-Fighting Network",
      "Emergency Evacuation Corridors & Stretcher Lift Access",
    ],
  },
];

export default function AuraFloorPlans() {
  const [activeTab, setActiveTab] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);
  const plan = PLANS[activeTab];

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen]);

  return (
    <section className={styles.section} id="floor-plans">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>ARCHITECTURAL CUT-SECTIONS &amp; DIMENSIONS</span>
          <h2 className={styles.title}>
            MASTERFULLY PLANNED FOR <span>IDENTITY &amp; DISTINCTION</span>
          </h2>
          <p className={styles.subtitle}>
            Inspect authentic isometric cut-sections and room dimensions from the official Aura brochure. Every residence is 100% Vastu-aligned for natural daylight and airflow.
          </p>

          <div className={styles.tabs} role="tablist" aria-label="Aura floor plans">
            {PLANS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={activeTab === idx}
                className={`${styles.tabBtn}${activeTab === idx ? ` ${styles.activeTab}` : ""}`}
                onClick={() => setActiveTab(idx)}
              >
                <span className={styles.tabIndex}>{item.index}</span>
                <span>{item.label}</span>
                <span className={styles.tabBadge}>{item.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Floor Plan Inspection Card */}
        <div className={styles.displayCard}>
          <div className={styles.imageCol}>
            <button
              type="button"
              className={styles.imageWrapper}
              onClick={() => setZoomOpen(true)}
              aria-label={`Enlarge ${plan.title} architectural drawing`}
            >
              <img
                src={plan.image}
                alt={plan.title}
                className={styles.planImg}
                loading="lazy"
              />
              <span className={styles.imageTag}>{plan.badge}</span>
              <span className={styles.zoomHint}>⊕ Tap to enlarge drawing</span>
            </button>
          </div>

          <div className={styles.detailsCol}>
            <div className={styles.detailsHeader}>
              <span className={styles.planCategory}>OFFICIAL BROCHURE PLATE · {plan.index}</span>
              <h3 className={styles.planTitle}>{plan.title}</h3>
              <p className={styles.planSubtitle}>{plan.subtitle}</p>
            </div>

            <div className={styles.specsGrid}>
              {plan.specs.map((s) => (
                <div key={s.room} className={styles.specItem}>
                  <span className={styles.specRoom}>{s.room}</span>
                  <span className={styles.specDim}>{s.dim}</span>
                </div>
              ))}
            </div>

            <div className={styles.highlightsBox}>
              <h4 className={styles.highlightsTitle}>ARCHITECTURAL SPECIFICATIONS</h4>
              <ul className={styles.highlightsList}>
                {plan.features.map((f) => (
                  <li key={f}>
                    <span className={styles.checkMark} aria-hidden="true">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.actionRow}>
              <a
                href="https://wa.me/917498256708?text=Hello%20Lifestyle%20Homes,%20I%20am%20interested%20in%20Aura%20floor%20plans%20and%20pricing."
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.whatsappBtn} roll-button`}
              >
                <span className="roll-text" data-text="Request Detailed Floor Plan PDF →">
                  Request Detailed Floor Plan PDF →
                </span>
              </a>
              <button
                type="button"
                className={`${styles.visitBtn} roll-button`}
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("lifestyle_open_enquiry", {
                      detail: { project: "Aura by Lifestyle", source: `Floor Plans - ${plan.title}` },
                    })
                  )
                }
              >
                <span className="roll-text" data-text="Book Site Preview">
                  Book Site Preview
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Drawing Lightbox */}
      {zoomOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={plan.title}
          onClick={() => setZoomOpen(false)}
        >
          <button
            type="button"
            className={styles.lightboxClose}
            onClick={() => setZoomOpen(false)}
            aria-label="Close enlarged floor plan"
          >
            ✕ Close
          </button>
          <img
            src={plan.image}
            alt={plan.title}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
