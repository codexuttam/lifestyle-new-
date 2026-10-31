"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./AuraFloorPlans.module.css";
import EnquiryModal from "@/components/EnquiryModal";

const PLANS = [
  {
    id: "2bhk",
    index: "01",
    label: "2 BHK Sky Suite",
    badge: "1,150 SQFT",
    hasCutsection: true,
    title: "2 BHK Luxury Sky Residence",
    subtitle: "Commanding skyline views, dual sit-out balconies & zero wasted circulation",
    blueprintImage: "/aura/aura-2bhk-floorplan.jpg",
    cutsectionImage: "/aura/plan-2bhk-cutsection.jpg",
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
      "Zero Shared Walls with Private Acoustic Sanctuary",
      "Private Master Suite with Dedicated Bath (5'0\" × 9'0\")",
      "3-Track Powder Coated Windows with MS Safety Grills",
      "Concealed Jaquar or Equivalent Designer Fittings",
    ],
  },
  {
    id: "3bhk",
    index: "02",
    label: "3 BHK Royal Suite",
    badge: "1,650 SQFT",
    hasCutsection: true,
    title: "3 BHK Royal Skyline Residence",
    subtitle: "Grand multi-balcony suite designed for expansive family hospitality",
    blueprintImage: "/aura/aura-3bhk-floorplan.jpg",
    cutsectionImage: "/aura/plan-3bhk-cutsection.jpg",
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
    hasCutsection: false,
    title: "Level 15 Crown Leisure Deck",
    subtitle: "Rooftop lap pool, enclosed box cricket turf & sunset viewing promenade",
    blueprintImage: "/aura/aura-terrace-plan.jpg",
    cutsectionImage: "/aura/rooftop-amenities-3d.jpg",
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
    hasCutsection: false,
    title: "Typical Architectural Floor Plate",
    subtitle: "Optimum cross-ventilation, 4 high-speed elevators & wide designer corridors",
    blueprintImage: "/aura/aura-typical-floorplan.jpg",
    cutsectionImage: "/aura/building-full-4k.jpg",
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
  const [viewMode, setViewMode] = useState<"blueprint" | "cutsection">("blueprint");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const plan = PLANS[activeTab];

  const currentImage = viewMode === "blueprint" ? plan.blueprintImage : plan.cutsectionImage;

  useEffect(() => {
    if (!cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      cardRef.current.querySelectorAll("[data-plan-anim]"),
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: "power3.out", clearProps: "transform" }
    );
  }, [activeTab, viewMode]);

  useEffect(() => {
    if (!zoomOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomOpen]);

  return (
    <section className={styles.section} id="floor-plans" aria-label="Aura Floor Plans and Architectural Specifications">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrowBadge}>THE RESIDENCES &amp; SPECIFICATIONS</span>
          <h2 className={styles.title}>
            SPATIAL <span>P</span>RECISION
          </h2>
          <p className={styles.subtitle}>
            Every residence at Aura is crafted with zero common wall sharing, maximum cross-ventilation, and 100% Vastu compliance across 15 soaring storeys in Camp, Amravati.
          </p>
        </div>

        {/* Configuration Tabs */}
        <div className={styles.tabs} role="tablist" aria-label="Floor plan configurations">
          {PLANS.map((item, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`${styles.tabBtn}${isActive ? ` ${styles.activeTab}` : ""}`}
                onClick={() => {
                  setActiveTab(idx);
                  if (!item.hasCutsection) {
                    setViewMode("blueprint");
                  }
                }}
              >
                <span className={styles.tabIndex}>({item.index})</span>
                <span>{item.label}</span>
                <span className={styles.tabBadge}>{item.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Drawing Card */}
        <div className={styles.displayCard} ref={cardRef}>
          {/* Drawing Column with View Mode Toggle */}
          <div className={styles.imageCol}>
            {plan.hasCutsection && (
              <div className={styles.viewModeRow}>
                <button
                  type="button"
                  className={`${styles.viewPillBtn} ${viewMode === "blueprint" ? styles.viewPillBtnActive : ""}`}
                  onClick={() => setViewMode("blueprint")}
                >
                  Architectural Blueprint
                </button>
                <button
                  type="button"
                  className={`${styles.viewPillBtn} ${viewMode === "cutsection" ? styles.viewPillBtnActive : ""}`}
                  onClick={() => setViewMode("cutsection")}
                >
                  3D Cut-Section
                </button>
              </div>
            )}

            <div
              className={styles.imageWrapper}
              onClick={() => setZoomOpen(true)}
              role="button"
              tabIndex={0}
              title="Click to inspect drawing"
            >
              <img
                key={`${plan.id}-${viewMode}`}
                src={currentImage}
                alt={`${plan.title} - ${viewMode === "blueprint" ? "Floor Plan" : "3D View"}`}
                className={styles.planImg}
                loading="lazy"
              />
            </div>
          </div>

          {/* Details Column with Verified Room Dimensions */}
          <div className={styles.detailsCol}>
            <div className={styles.detailsHeader} data-plan-anim>
              <h3 className={styles.planTitle}>{plan.title}</h3>
              <p className={styles.planSubtitle}>{plan.subtitle}</p>
            </div>

            <div className={styles.specsGrid}>
              {plan.specs.map((s) => (
                <div key={s.room} className={styles.specItem} data-plan-anim>
                  <span className={styles.specRoom}>{s.room}</span>
                  <span className={styles.specDim}>{s.dim}</span>
                </div>
              ))}
            </div>

            <div className={styles.highlightsBox} data-plan-anim>
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

            <div className={styles.actionRow} data-plan-anim>
              <a
                href="https://wa.me/917498256708?text=Hello%20Lifestyle%20Homes,%20I%20am%20interested%20in%20Aura%20floor%20plans%20and%20pricing."
                target="_blank"
                rel="noopener noreferrer"
                className={styles.whatsappBtn}
              >
                <span>Request Detailed Floor Plan PDF →</span>
              </a>
              <button
                type="button"
                className={styles.visitBtn}
                onClick={() => setIsEnquiryOpen(true)}
              >
                <span>Book Site Preview</span>
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
            src={currentImage}
            alt={plan.title}
            className={styles.lightboxImg}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Floor Plan Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={`Floor Plan Enquiry - ${plan.title}`}
        source={`Floor Plans Section - ${plan.title}`}
      />
    </section>
  );
}
