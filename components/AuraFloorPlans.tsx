"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./AuraFloorPlans.module.css";
import EnquiryModal from "@/components/EnquiryModal";

interface RoomSpec {
  room: string;
  dim: string;
  note?: string;
}

interface PlanConfig {
  id: string;
  index: string;
  label: string;
  badge: string;
  areaLabel: string;
  areaType: string;
  title: string;
  subtitle: string;
  image3D: string;
  image2D?: string;
  hasViewToggle?: boolean;
  specs: RoomSpec[];
  features: string[];
  inventoryStatus: string;
}

const PLANS: PlanConfig[] = [
  {
    id: "2bhk",
    index: "01",
    label: "2 BHK Sky Suite",
    badge: "1,150 SQFT",
    areaLabel: "1,150 SQFT",
    areaType: "Super Built-Up Area · RERA Carpet on Request",
    title: "2 BHK Luxury Sky Residence",
    subtitle: "Dual sit-out balconies with panoramic skyline views",
    image3D: "/aura/plan-2bhk-3d-iso.jpg",
    image2D: "/aura/aura-2bhk-floorplan.jpg",
    hasViewToggle: true,
    specs: [
      { room: "Living Room", dim: "11'0\" × 17'0\"", note: "Attached sit-out balcony with panoramic view" },
      { room: "Master Bedroom", dim: "11'0\" × 12'0\"", note: "Ensuite designer bathroom (5'0\" × 9'0\")" },
      { room: "Kid's Bedroom", dim: "11'0\" × 12'0\"", note: "Ample morning daylight & cross-breeze" },
      { room: "Dining Area", dim: "9'6\" × 12'6\"", note: "Central family dining with direct kitchen access" },
      { room: "Kitchen", dim: "9'0\" × 9'6\"", note: "Granite platform with SS sink & service counter" },
      { room: "Main Balcony", dim: "11'0\" × 6'0\"", note: "Toughened glass & MS protective safety railing" },
      { room: "Washing Utility", dim: "8'6\" × 6'0\"", note: "Concealed plumbing and washing machine point" },
      { room: "Flooring", dim: "800 × 1600 mm", note: "Glazed vitrified anti-skid porcelain slabs" },
    ],
    features: [
      "Zero shared walls for complete acoustic privacy",
      "Master bedroom suite with attached luxury bath",
      "3-track sliding windows with mosquito mesh",
      "Concealed Jaquar chrome-plated CP fittings",
      "100% Vastu-compliant North/East layout",
    ],
    inventoryStatus: "Level 3–12 · East-Facing Units Available",
  },
  {
    id: "3bhk",
    index: "02",
    label: "3 BHK Royal Suite",
    badge: "1,650 SQFT",
    areaLabel: "1,650 SQFT",
    areaType: "Super Built-Up Area · RERA Carpet on Request",
    title: "3 BHK Royal Skyline Residence",
    subtitle: "Expansive multi-balcony suite for luxury family living",
    image3D: "/aura/plan-3bhk-3d-iso.jpg",
    image2D: "/aura/aura-3bhk-floorplan.jpg",
    hasViewToggle: true,
    specs: [
      { room: "Grand Living Room", dim: "11'0\" × 18'6\"", note: "Expansive formal reception hall with balcony" },
      { room: "Master Suite", dim: "17'0\" × 11'0\"", note: "Dedicated dressing alcove & private attached bath" },
      { room: "Dining Hall", dim: "15'0\" × 11'0\"", note: "Separate dining space seating 8 guests" },
      { room: "Kid's Bedroom", dim: "12'0\" × 11'0\"", note: "Cross-ventilated with integrated study corner" },
      { room: "Guest Bedroom", dim: "12'0\" × 11'0\"", note: "Ideal for senior family members or visitors" },
      { room: "Kitchen", dim: "9'6\" × 11'0\"", note: "Granite counters, storage loft & utility porch" },
      { room: "Living Balcony", dim: "10'6\" × 6'0\"", note: "Sunset viewing promenade overlooking Camp" },
      { room: "Bed Balcony", dim: "11'0\" × 5'6\"", note: "Private morning coffee deck off master room" },
    ],
    features: [
      "Grand living & dining core for seamless entertaining",
      "3 designer bathrooms with premium fixtures",
      "Dedicated utility & washing balcony",
      "Concealed conduits for modular inverter & split ACs",
      "Independent structural walls for acoustic isolation",
    ],
    inventoryStatus: "Level 8–14 · High-Floor Units Available",
  },
  {
    id: "rooftop",
    index: "03",
    label: "Rooftop Sky Oasis",
    badge: "LEVEL 15",
    areaLabel: "FULL CROWN DECK",
    areaType: "Exclusive Resident Amenity Deck",
    title: "Level 15 Crown Leisure Deck",
    subtitle: "Infinity lap pool, enclosed sports turf & sunset promenade",
    image3D: "/aura/aura-terrace-plan.jpg",
    hasViewToggle: false,
    specs: [
      { room: "Swimming Pool", dim: "Lap & Leisure Pool", note: "Infinity edge design with glass perimeter fence" },
      { room: "Kids Splash Pool", dim: "Safe Shallow Zone", note: "Non-slip textured surface for young children" },
      { room: "Multi-Sports Turf", dim: "Box Cricket & Tennis", note: "Fully enclosed safety net with floodlighting" },
      { room: "Viewing Promenade", dim: "Panoramic Skyline", note: "360° unobstructed horizon over Amravati city" },
      { room: "Fitness Track", dim: "Jogging Loop", note: "Padded rooftop athletic walking track" },
      { room: "Party Lawn", dim: "Open-Air Deck", note: "Curated seating for intimate evening gatherings" },
      { room: "Solar Grid", dim: "Common Utilities", note: "Renewable solar generation for shared power" },
      { room: "Elevator Lobby", dim: "4 High-Speed Lifts", note: "Direct elevator access with ARD & power backup" },
    ],
    features: [
      "360° panorama across Camp green belt & Melghat horizon",
      "Infinity-edge lap pool with glass balustrade",
      "Enclosed floodlit multi-sports box turf",
      "Renewable solar rooftop for shared power",
    ],
    inventoryStatus: "Crown Level 15 · Enquire for Private Tour",
  },
  {
    id: "typical",
    index: "04",
    label: "Typical Floor Plate",
    badge: "LEVELS 1–14",
    areaLabel: "FLOORS 1 TO 14",
    areaType: "4 High-Speed Lifts · Dual Stairwells",
    title: "Architectural Floor Plate",
    subtitle: "Optimum cross-ventilation & wide designer corridors",
    image3D: "/aura/aura-typical-floorplan.jpg",
    hasViewToggle: false,
    specs: [
      { room: "Floor Plate", dim: "Levels 1 to 14", note: "Optimal floor distribution with minimal lobby traffic" },
      { room: "Configurations", dim: "2 & 3 BHK Suites", note: "Carefully segregated private suite entries" },
      { room: "Elevators", dim: "4 High-Speed ARD Lifts", note: "Includes high-capacity stretcher/service lift" },
      { room: "Staircases", dim: "Dual Fire Stairwells", note: "Pressurized fire escape passages conforming to NBC" },
      { room: "Ventilation", dim: "Cross-Ventilated", note: "Open ventilation shafts for continuous fresh air" },
      { room: "Balconies", dim: "Private Sit-Outs", note: "Every residence features at least 2 private balconies" },
      { room: "Security", dim: "24×7 Smart Access", note: "CCTV monitoring at lobbies and entrance foyer" },
      { room: "Vastu", dim: "100% Compliant", note: "Strictly aligned entries, kitchens, and master bedrooms" },
    ],
    features: [
      "Zero shared walls between residences for acoustic privacy",
      "Independent service utility ducts for discreet maintenance",
      "Heavy-duty fire-fighting wet risers & sprinklers",
      "Double-height arrival foyer at ground level",
    ],
    inventoryStatus: "Select High-Floor Residences Available",
  },
];

export default function AuraFloorPlans() {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<"3D" | "2D">("3D");
  const [selectedRoom, setSelectedRoom] = useState<RoomSpec | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const plan = PLANS[activeTab];

  // Reset view mode when switching plans
  useEffect(() => {
    setViewMode("3D");
    setSelectedRoom(null);
  }, [activeTab]);

  useEffect(() => {
    if (!cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      cardRef.current.querySelectorAll("[data-plan-anim]"),
      { y: 14, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.03, ease: "power3.out", clearProps: "transform" }
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

  const activeImage =
    viewMode === "2D" && plan.image2D ? plan.image2D : plan.image3D;

  return (
    <section className={styles.section} id="floor-plans" aria-label="Aura Floor Plans and Architectural Specifications">
      <div className={styles.container}>
        {/* Section Header */}
        <div className={styles.header}>
          <span className={styles.eyebrowBadge}>PROPERTY EXPLORER</span>
          <h2 className={styles.title}>
            SPATIAL <span>P</span>RECISION
          </h2>
          <p className={styles.subtitle}>
            Explore Aura residences with complete transparency. Inspect 3D cut-sections, verified room dimensions, and 2D engineering blueprints.
          </p>
        </div>

        {/* Configuration Tabs with Accessible Role */}
        <div className={styles.tabs} role="tablist" aria-label="Floor plan configurations">
          {PLANS.map((item, idx) => {
            const isActive = idx === activeTab;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`plan-panel-${item.id}`}
                id={`plan-tab-${item.id}`}
                className={`${styles.tabBtn}${isActive ? ` ${styles.activeTab}` : ""}`}
                onClick={() => setActiveTab(idx)}
              >
                <span className={styles.tabIndex}>({item.index})</span>
                <span className={styles.tabName}>{item.label}</span>
                <span className={styles.tabBadge}>{item.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Explorer Display Card */}
        <div
          className={styles.displayCard}
          ref={cardRef}
          id={`plan-panel-${plan.id}`}
          role="tabpanel"
          aria-labelledby={`plan-tab-${plan.id}`}
        >
          {/* Left Column: Visual Drawing & Viewport Controls */}
          <div className={styles.imageCol}>
            {/* View Mode Toggle: 3D Isometric vs 2D Blueprint */}
            {plan.hasViewToggle && (
              <div className={styles.viewToggleBar} role="group" aria-label="Drawing view mode">
                <button
                  type="button"
                  className={`${styles.viewToggleBtn} ${viewMode === "3D" ? styles.viewToggleActive : ""}`}
                  onClick={() => setViewMode("3D")}
                >
                  <span className={styles.toggleIcon} aria-hidden="true">◫</span>
                  <span>3D Isometric</span>
                </button>
                <button
                  type="button"
                  className={`${styles.viewToggleBtn} ${viewMode === "2D" ? styles.viewToggleActive : ""}`}
                  onClick={() => setViewMode("2D")}
                >
                  <span className={styles.toggleIcon} aria-hidden="true">📐</span>
                  <span>2D Blueprint</span>
                </button>
              </div>
            )}

            {/* Interactive Image Frame */}
            <div
              className={`${styles.imageWrapper} ${viewMode === "2D" ? styles.imageWrapperBlueprint : styles.imageWrapperDark}`}
              onClick={() => setZoomOpen(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setZoomOpen(true);
                }
              }}
              title="Click or press Enter to inspect drawing in high resolution"
              aria-label={`Enlarge ${plan.title} ${viewMode} drawing`}
            >
              <img
                key={`${plan.id}-${viewMode}`}
                src={activeImage}
                alt={`${plan.title} - ${viewMode} Architectural Floor Plan`}
                className={`${styles.planImg} ${viewMode === "2D" ? styles.blueprintImg : styles.planImg3D}`}
                loading="lazy"
              />
              <span className={styles.zoomPill}>
                <span className={styles.zoomIcon} aria-hidden="true">⤢</span>
                <span>Inspect in HD</span>
              </span>
            </div>

            {/* Selected Room Spec Callout */}
            {selectedRoom && (
              <div className={styles.selectedRoomCard} data-plan-anim>
                <div className={styles.roomHeader}>
                  <span className={styles.roomIcon} aria-hidden="true">📍</span>
                  <strong className={styles.roomName}>{selectedRoom.room}:</strong>
                  <span className={styles.roomDimension}>{selectedRoom.dim}</span>
                </div>
                {selectedRoom.note && (
                  <p className={styles.roomNote}>{selectedRoom.note}</p>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Verified Specifications & Live Concierge Actions */}
          <div className={styles.detailsCol}>
            <div className={styles.detailsHeader} data-plan-anim>
              <div className={styles.metaBadgeRow}>
                <span className={styles.badgeHighlight}>{plan.areaLabel}</span>
                <span className={styles.badgeSub}>{plan.areaType}</span>
              </div>
              <h3 className={styles.planTitle}>{plan.title}</h3>
              <p className={styles.planSubtitle}>{plan.subtitle}</p>
            </div>

            {/* Interactive Room Specification Chips */}
            <div className={styles.specsSection} data-plan-anim>
              <div className={styles.specsHeadingRow}>
                <h4 className={styles.specsTitle}>ROOM SIZES &amp; DIMENSIONS</h4>
              </div>

              <div className={styles.specsGrid}>
                {plan.specs.map((s) => {
                  const isSelected = selectedRoom?.room === s.room;
                  return (
                    <button
                      key={s.room}
                      type="button"
                      className={`${styles.specItem} ${isSelected ? styles.specItemSelected : ""}`}
                      onClick={() => setSelectedRoom(isSelected ? null : s)}
                      aria-pressed={isSelected}
                    >
                      <span className={styles.specRoom}>{s.room}</span>
                      <span className={styles.specDim}>{s.dim}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Architectural Highlights */}
            <div className={styles.highlightsBox} data-plan-anim>
              <h4 className={styles.highlightsTitle}>KEY HIGHLIGHTS</h4>
              <ul className={styles.highlightsList}>
                {plan.features.map((f) => (
                  <li key={f} className={styles.featureItem}>
                    <span className={styles.checkMark} aria-hidden="true">✦</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Area Measurement Disclaimer Flag */}
            <p className={styles.areaDisclaimer} data-plan-anim>
              <span className={styles.infoIcon} aria-hidden="true">ℹ</span>
              <span>
                Brochure specification. Exact unit RERA carpet verified during site visit.
              </span>
            </p>

            {/* Live Inventory Status Pill */}
            <div
              className={styles.inventoryStatusPill}
              onClick={() => setIsEnquiryOpen(true)}
              role="button"
              tabIndex={0}
              data-plan-anim
            >
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>{plan.inventoryStatus}</span>
              <span className={styles.statusLink}>Check Inventory →</span>
            </div>

            {/* Direct Enquiry Flow Actions */}
            <div className={styles.actionRow} data-plan-anim>
              <button
                type="button"
                className={styles.whatsappBtn}
                onClick={() => setIsEnquiryOpen(true)}
                aria-label={`Request floor plan PDF for ${plan.title}`}
              >
                <span>Request Floor Kit PDF →</span>
              </button>
              <button
                type="button"
                className={styles.visitBtn}
                onClick={() => setIsEnquiryOpen(true)}
                aria-label={`Book site preview for ${plan.title}`}
              >
                <span>Book Site Preview</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen HD Drawing Lightbox / Inspector */}
      {zoomOpen && (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`Enlarged drawing of ${plan.title}`}
          onClick={() => setZoomOpen(false)}
        >
          <div className={styles.lightboxHeader}>
            <div className={styles.lightboxTitleGroup}>
              <strong className={styles.lightboxTitle}>{plan.title}</strong>
              <span className={styles.lightboxSub}>
                {viewMode === "2D" ? "2D Architectural Blueprint" : "3D Isometric Cut-Section"} · {plan.areaLabel}
              </span>
            </div>
            <button
              type="button"
              className={styles.lightboxClose}
              onClick={() => setZoomOpen(false)}
              aria-label="Close enlarged floor plan view"
            >
              ✕ Close
            </button>
          </div>

          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <img
              src={activeImage}
              alt={plan.title}
              className={styles.lightboxImg}
            />
          </div>
        </div>
      )}

      {/* Project Enquiry Modal Connected Directly to Selected Configuration */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={`Floor Plan Enquiry - ${plan.title} (${plan.areaLabel})`}
        source={`Floor Plan Explorer - ${plan.title}`}
      />
    </section>
  );
}
