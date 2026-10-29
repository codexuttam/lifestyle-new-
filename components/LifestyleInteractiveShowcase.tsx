"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import styles from "./LifestyleInteractiveShowcase.module.css";

interface UnifiedPlate {
  id: string;
  index: string;
  tabLabel: string;
  title: string;
  subtitle: string;
  img: string;
  video?: string;
  isBlueprint?: boolean;
  summary: string;
  rooms: { name: string; dim: string }[];
  features: string[];
}

const PLATES: UnifiedPlate[] = [
  {
    id: "landmark",
    index: "01",
    tabLabel: "8-Storey Landmark",
    title: "Delivered 8-Storey Landmark",
    subtitle: "DPS Road, Parvati Nagar · 100% Ready Possession",
    img: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
    video: "/videos/lifestyle-showcase-clip.mp4",
    isBlueprint: false,
    summary:
      "Completed 8-storey residential and commercial landmark on 24-metre DPS Road featuring 30 Vastu residences, 24 high-street showrooms, granite lobby, and dual ARD elevators.",
    rooms: [
      { name: "Residences", dim: "18 × 2 BHK + 12 × 3 BHK" },
      { name: "Commercial", dim: "24 Road-Facing Showrooms" },
      { name: "Elevators", dim: "Passenger + Stretcher ARD" },
      { name: "MahaRERA", dim: "P50300054447 (Delivered)" },
    ],
    features: [
      "100% delivered landmark with immediate key handover and operational retail",
      "Earthquake-resistant IS-code RCC frame with solar-powered common lighting",
      "24×7 CCTV surveillance, gated security cabin, and basement + stilt parking",
    ],
  },
  {
    id: "3bhk",
    index: "02",
    tabLabel: "3 BHK Royal Suite",
    title: "3 BHK Royal Luxury Suite (Type 3/4)",
    subtitle: "1,550 Sqft Super Built-Up · Corner Vastu Suite",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-3bhk-3d-iso.jpg",
    isBlueprint: true,
    summary:
      "Grand 3-bedroom corner suite featuring 3 private balconies, master wardrobe dressing niche, kitchen with store and utility, and 360-degree daylight.",
    rooms: [
      { name: "Drawing Hall", dim: "11'0\" × 18'0\"" },
      { name: "Dining & Kitchen", dim: "10'0\" × 10'3\" · 10'0\" × 9'6\"" },
      { name: "Master Suite", dim: "12'4\" × 13'0\" + Dressing" },
      { name: "Bedrooms 2 & 3", dim: "11'0\" × 12'0\" · 11'0\" × 11'0\"" },
    ],
    features: [
      "Triple-balcony corner layout ensuring natural cross-ventilation",
      "2' × 4' nano-polished double-charged vitrified floor slabs",
      "Teak-wood frame main door with video call doorbell and Jaquar fittings",
    ],
  },
  {
    id: "2bhk",
    index: "03",
    tabLabel: "2 BHK Comfort Home",
    title: "2 BHK Comfort Modern Home (Type 1 & 2)",
    subtitle: "1,100 – 1,245 Sqft · East & North Vastu",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-2bhk-3d-iso.jpg",
    isBlueprint: true,
    summary:
      "Zero-wasted-corridor 2 BHK residences with an expansive 16-foot drawing hall, dedicated dining lobby, dual sit-out balconies, and separate utility wash.",
    rooms: [
      { name: "Drawing Room", dim: "16'0\" × 11'0\"" },
      { name: "Dining Lobby", dim: "9'0\" × 13'5\"" },
      { name: "Master Bedroom", dim: "12'10\" × 11'10\"" },
      { name: "Bedroom 2 & Kitchen", dim: "11'0\" × 11'0\" · 8'11\" × 8'10\"" },
    ],
    features: [
      "Zero dead-space layout maximizing usable family carpet area",
      "Granite kitchen counter with stainless steel sink and utility veranda",
      "3-track powder-coated aluminum windows with integrated mosquito mesh",
    ],
  },
  {
    id: "typical",
    index: "04",
    tabLabel: "Typical Floor Plate",
    title: "Typical 2nd to 6th Floor Plan",
    subtitle: "5 Residences Per Floor · 9-Foot Central Lobby",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-typical-floor.jpg",
    isBlueprint: true,
    summary:
      "Low-density cluster of 5 residences per floor arranged around a 9-foot granite lobby served by passenger and stretcher ARD elevators.",
    rooms: [
      { name: "3 BHK Units", dim: "1,512 – 1,684 Sqft" },
      { name: "2 BHK Units", dim: "1,246 – 1,271 Sqft" },
      { name: "Central Lobby", dim: "9'0\" Wide Granite Corridor" },
      { name: "Lift Core", dim: "1 Passenger + 1 Stretcher ARD" },
    ],
    features: [
      "Privacy-oriented entrance foyers avoiding direct sightlines between flats",
      "3-side open ventilation and dedicated light shafts for every kitchen",
      "Concealed plumbing and electrical service ducts for effortless upkeep",
    ],
  },
  {
    id: "commercial",
    index: "05",
    tabLabel: "24 Shops & Parking",
    title: "24 Retail Showrooms & Basement Bays",
    subtitle: "12 Ground + 12 First Floor · 24m DPS Road",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-ground-commercial.jpg",
    isBlueprint: true,
    summary:
      "24 road-facing glass showrooms on arterial DPS Road (hosting Dee Bakers and MORE Supermarket) paired with two-way ramped basement and stilt resident parking.",
    rooms: [
      { name: "Ground Showrooms", dim: "12 Shops (191 – 337 Sqft)" },
      { name: "First Showrooms", dim: "12 Shops (170 – 400 Sqft)" },
      { name: "Frontage", dim: "24-Metre Main DPS Road" },
      { name: "Parking", dim: "Customer Bays + Basement Stalls" },
    ],
    features: [
      "Direct street-level glass display frontage with dedicated customer parking",
      "Segregated residential lift access straight from basement to apartment floors",
      "3-phase commercial power and round-the-clock CCTV security coverage",
    ],
  },
];

function getDeckTransform(idx: number, activeIdx: number) {
  const diff = idx - activeIdx;
  if (diff === 0) {
    return {
      transform: "translate3d(0px, 0px, 0px) scale(1)",
      opacity: 1,
      zIndex: 30,
      filter: "brightness(1)",
    };
  }
  // Upcoming cards sit below, sliding from down to up
  if (diff > 0) {
    const clamped = Math.min(diff, 3);
    return {
      transform: `translate3d(0px, ${clamped * 44}px, ${-clamped * 20}px) scale(${1 - clamped * 0.045})`,
      opacity: diff > 3 ? 0 : Math.max(0.28, 0.85 - diff * 0.2),
      zIndex: 30 - diff,
      filter: "brightness(0.65)",
    };
  }
  // Past cards scale down and dim into background stack
  const abs = Math.min(Math.abs(diff), 2);
  return {
    transform: `translate3d(0px, ${-abs * 22}px, ${-abs * 40}px) scale(${1 - abs * 0.06})`,
    opacity: Math.abs(diff) > 2 ? 0 : 0.36,
    zIndex: 20 - abs,
    filter: "brightness(0.55)",
  };
}

const GALLERY_ITEMS = [
  {
    id: 1,
    category: "Actual",
    title: "Delivered 8-Storey Highrise Landmark",
    desc: "Actual photograph of the completed building standing proud on DPS Road, Amravati",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-delivered-front.jpg",
  },
  {
    id: 2,
    category: "Actual",
    title: "Active High-Street Retail Arcade",
    desc: "Delivered shops with Dee Bakers, MORE Supermarket, and dedicated customer parking",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-delivered-angled.jpg",
  },
  {
    id: 3,
    category: "Architecture",
    title: "4K Architectural Elevation & Retail Galleria",
    desc: "Corner geometry, cantilevered balconies, and double-storey high-street frontage on DPS Road",
    src: "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg",
  },
  {
    id: 4,
    category: "Commercial",
    title: "DPS Road Commercial Frontage",
    desc: "24 road-facing retail showrooms across Ground and First levels with direct street bays",
    src: "/assets/projects/lifestyle-homes/building/building-hero-polished.jpg",
  },
  {
    id: 5,
    category: "Interiors",
    title: "Designer Chandelier & Wood-Paneled Lobby",
    desc: "Delivered arrival corridor with warm ceiling panelling and herringbone floor tiling",
    src: "/assets/projects/lifestyle-homes/interiors/night-view.jpg",
  },
  {
    id: 6,
    category: "Interiors",
    title: "Delivered Finished Living Room",
    desc: "Actual finished 2 & 3 BHK living hall opening into a cross-ventilated sit-out balcony",
    src: "/assets/projects/lifestyle-homes/interiors/living-room-polished.jpg",
  },
  {
    id: 7,
    category: "Interiors",
    title: "Corridor & Apartment Entrance",
    desc: "Granite flooring, teak door frames, and double-coat smooth interior finishes",
    src: "/assets/projects/lifestyle-homes/interiors/corridor-polished.jpg",
  },
  {
    id: 8,
    category: "Interiors",
    title: "Dual Elevators Lobby & Stretcher Lift",
    desc: "Equipped with automatic battery backup (ARD) ensuring seamless round-the-clock safety",
    src: "/assets/projects/lifestyle-homes/interiors/elevators-lobby.jpg",
  },
];

export default function LifestyleInteractiveShowcase({
  whatsappHref,
  telHref,
}: {
  whatsappHref: string;
  telHref: string;
}) {
  const [activePlateIdx, setActivePlateIdx] = useState(0);
  const activePlate = PLATES[activePlateIdx];
  const runwayRef = useRef<HTMLDivElement>(null);
  const galleryGridRef = useRef<HTMLDivElement>(null);

  const [modalMedia, setModalMedia] = useState<{
    src: string;
    title: string;
    desc: string;
  } | null>(null);

  const [galleryFilter, setGalleryFilter] = useState("All");
  const filteredGallery =
    galleryFilter === "All"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) =>
          galleryFilter === "Actual"
            ? item.category === "Actual"
            : galleryFilter === "Architecture"
            ? item.category === "Architecture" || item.category === "Commercial"
            : item.category === "Interiors" || item.category === "Location"
        );

  // Sticky Scroll-Driven 3D Deck Progress across the 5 Landmark & Layout Plates
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const updateFromScroll = () => {
      rafId = 0;
      if (window.innerWidth < 1024) return;
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const stickyOffset = 88;
      const scrollable = rect.height - (window.innerHeight - stickyOffset);
      if (scrollable <= 0) return;

      const scrolled = stickyOffset - rect.top;
      const progress = Math.min(0.9999, Math.max(0, scrolled / scrollable));
      const idx = Math.floor(progress * PLATES.length);
      setActivePlateIdx((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const handleSelectPlate = (idx: number) => {
    setActivePlateIdx(idx);
    const runway = runwayRef.current;
    if (runway && window.innerWidth >= 1024) {
      const stickyOffset = 88;
      const runwayTop = runway.getBoundingClientRect().top + window.scrollY;
      const scrollable = runway.offsetHeight - (window.innerHeight - stickyOffset);
      if (scrollable > 0) {
        const targetY =
          runwayTop - stickyOffset + ((idx + 0.35) / PLATES.length) * scrollable;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    if (!galleryGridRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cards = Array.from(galleryGridRef.current.children);
    if (!cards.length) return;
    gsap.fromTo(
      cards,
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.45,
        stagger: 0.05,
        ease: "power3.out",
        clearProps: "transform,opacity",
      }
    );
  }, [galleryFilter]);

  // Dynamic EMI Calculator
  const [priceLakhs, setPriceLakhs] = useState(55);
  const [downPercent, setDownPercent] = useState(20);
  const [tenureYears, setTenureYears] = useState(20);
  const interestRate = 8.5;

  const principal = priceLakhs * 100000 * (1 - downPercent / 100);
  const monthlyRate = interestRate / 12 / 100;
  const numMonths = tenureYears * 12;
  const emi = Math.round(
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) /
      (Math.pow(1 + monthlyRate, numMonths) - 1)
  );
  const totalPayment = emi * numMonths;
  const totalInterest = totalPayment - principal;

  return (
    <div className={styles.wrapper}>
      {/* ================= 1. UNIFIED LANDMARK EXPLORER & 3D FLOOR LAYOUTS (STICKY SCROLL 3D DECK) ================= */}
      <section className={styles.unitSection} id="unit-plans">
        <span id="explore-site-section" className={styles.anchorAlias} aria-hidden="true" />
        <span id="explore-lifestyle-section" className={styles.anchorAlias} aria-hidden="true" />
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <h2 className={styles.sectionTitle}>
              LANDMARK EXPLORER &amp; <span>3D FLOOR LAYOUTS</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Scroll through the delivered 8-storey landmark and official 3D isometric cut-sections—inspect room dimensions, Vastu alignment, and commercial floor plates in motion.
            </p>
          </div>

          {/* Desktop Sticky Scroll-Driven 3D Runway */}
          <div className={styles.desktopRunway} ref={runwayRef}>
            <div className={styles.desktopSticky}>
              <div className={styles.selectorRail} role="tablist" aria-label="Landmark and floor plan plates">
                {PLATES.map((plate, idx) => {
                  const isActive = idx === activePlateIdx;
                  return (
                    <button
                      key={plate.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      className={`${styles.railBtn}${isActive ? ` ${styles.railBtnActive}` : ""}`}
                      onClick={() => handleSelectPlate(idx)}
                    >
                      <span className={styles.railIndex}>({plate.index})</span>
                      <span className={styles.railLabel}>{plate.tabLabel}</span>
                    </button>
                  );
                })}
              </div>

              <div className={styles.stageCard}>
                <div className={styles.stageCopy}>
                  <div className={styles.stageMetaRow}>
                    <span className={styles.stageNumber}>({activePlate.index})</span>
                    <span className={styles.stageSub}>{activePlate.subtitle}</span>
                  </div>

                  <h3 className={styles.unitTitle} key={activePlate.id}>
                    {activePlate.title}
                  </h3>
                  <p className={styles.unitSummary}>{activePlate.summary}</p>

                  <div className={styles.roomGrid}>
                    {activePlate.rooms.map((r) => (
                      <div className={styles.roomBox} key={r.name}>
                        <span className={styles.roomName}>{r.name}</span>
                        <span className={styles.roomDim}>{r.dim}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.unitFeaturesList}>
                    {activePlate.features.map((feat) => (
                      <div className={styles.unitFeatureItem} key={feat}>
                        <span className={styles.featureStar} aria-hidden="true">
                          ✦
                        </span>
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <div className={styles.unitActionRow}>
                    <a
                      href={`${whatsappHref}?text=${encodeURIComponent(
                        `Hello Lifestyle Homes, I am interested in "${activePlate.title}" at Lifestyle Home Spaces on DPS Road. Please share pricing and available unit numbers.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.unitWaBtn} roll-button`}
                    >
                      <span className="roll-text" data-text="Enquire For This Layout →">
                        Enquire For This Layout →
                      </span>
                    </a>

                    <button
                      type="button"
                      className={styles.zoomBtn}
                      onClick={() =>
                        setModalMedia({
                          src: activePlate.img,
                          title: activePlate.title,
                          desc: activePlate.summary,
                        })
                      }
                    >
                      ⤢ Inspect 4K Plate
                    </button>
                  </div>

                  <div className={styles.bottomBar}>
                    <div className={styles.progressFooter}>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${((activePlateIdx + 1) / PLATES.length) * 100}%` }}
                        />
                      </div>
                      <span className={styles.progressCount}>
                        {activePlate.index} / 0{PLATES.length}
                      </span>
                    </div>

                    <div className={styles.deckControls}>
                      <button
                        type="button"
                        className={styles.deckStepBtn}
                        onClick={() =>
                          handleSelectPlate((activePlateIdx - 1 + PLATES.length) % PLATES.length)
                        }
                        aria-label="Previous layout plate"
                      >
                        ← Prev
                      </button>
                      <button
                        type="button"
                        className={styles.deckStepBtn}
                        onClick={() => handleSelectPlate((activePlateIdx + 1) % PLATES.length)}
                        aria-label="Next layout plate"
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                </div>

                {/* Right: 3D Fanning Live Video & Floor Plan Deck */}
                <div className={styles.deckStage}>
                  {PLATES.map((plate, idx) => {
                    const isFront = idx === activePlateIdx;
                    const styleObj = getDeckTransform(idx, activePlateIdx);
                    return (
                      <div
                        key={plate.id}
                        className={`${styles.flyingCard}${
                          plate.isBlueprint ? ` ${styles.flyingCardBlueprint}` : ""
                        }${isFront ? ` ${styles.flyingCardActive}` : ""}`}
                        style={styleObj}
                        onClick={() =>
                          isFront
                            ? setModalMedia({
                                src: plate.img,
                                title: plate.title,
                                desc: plate.summary,
                              })
                            : handleSelectPlate(idx)
                        }
                        role="button"
                        tabIndex={0}
                        aria-label={
                          isFront ? `Zoom ${plate.title}` : `Focus (${plate.index}) ${plate.title}`
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (isFront) {
                              setModalMedia({
                                src: plate.img,
                                title: plate.title,
                                desc: plate.summary,
                              });
                            } else {
                              handleSelectPlate(idx);
                            }
                          }
                        }}
                      >
                        {plate.video && isFront ? (
                          <video
                            src={plate.video}
                            poster={plate.img}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className={styles.flyingMediaCover}
                            aria-hidden="true"
                          />
                        ) : (
                          <img
                            src={plate.img}
                            alt={plate.title}
                            className={
                              plate.isBlueprint ? styles.flyingMediaContain : styles.flyingMediaCover
                            }
                            loading="lazy"
                          />
                        )}
                        <div
                          className={
                            plate.isBlueprint ? styles.flyingScrimBlueprint : styles.flyingScrim
                          }
                        />
                        <div
                          className={`${styles.flyingCardCaption}${
                            plate.isBlueprint ? ` ${styles.flyingCaptionDark}` : ""
                          }`}
                        >
                          <div className={styles.flyingIndexRow}>
                            <span className={styles.flyingLine} />
                            <span>({plate.index})</span>
                            {isFront && (
                              <span className={styles.zoomBadge}>⤢ Tap to Zoom</span>
                            )}
                          </div>
                          <h4 className={styles.flyingTitle}>{plate.tabLabel}</h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile / Tablet Stack */}
          <div className={styles.mobilePlates}>
            {PLATES.map((plate) => (
              <article className={styles.mobilePlateCard} key={plate.id}>
                <button
                  type="button"
                  className={
                    plate.isBlueprint ? styles.mobileBlueprintWrap : styles.mobilePhotoWrap
                  }
                  onClick={() =>
                    setModalMedia({
                      src: plate.img,
                      title: plate.title,
                      desc: plate.summary,
                    })
                  }
                >
                  {plate.video ? (
                    <video
                      src={plate.video}
                      poster={plate.img}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      className={styles.mobileCoverMedia}
                      aria-hidden="true"
                    />
                  ) : (
                    <img
                      src={plate.img}
                      alt={plate.title}
                      className={
                        plate.isBlueprint ? styles.mobileContainMedia : styles.mobileCoverMedia
                      }
                      loading="lazy"
                    />
                  )}
                </button>
                <div className={styles.mobilePlateBody}>
                  <span className={styles.mobilePlateMeta}>
                    ({plate.index}) · {plate.subtitle}
                  </span>
                  <h3 className={styles.mobilePlateTitle}>{plate.title}</h3>
                  <p className={styles.unitSummary}>{plate.summary}</p>
                  <div className={styles.roomGrid}>
                    {plate.rooms.map((r) => (
                      <div className={styles.roomBox} key={r.name}>
                        <span className={styles.roomName}>{r.name}</span>
                        <span className={styles.roomDim}>{r.dim}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 2. DELIVERED GALLERY & ARCHITECTURE (WARM IVORY) ================= */}
      <section className={styles.gallerySection} id="gallery">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeaderLight} data-reveal>
            <h2 className={styles.sectionTitleLight}>
              ACTUAL SITE PHOTOGRAPHS &amp; <span>ARCHITECTURAL VIEWS</span>
            </h2>
            <p className={styles.sectionSubtitleLight}>
              Inspect real on-site photographs of the delivered 8-storey landmark alongside architectural views and interior finishes.
            </p>
          </div>

          <div className={styles.filterRow}>
            {["All", "Actual", "Architecture", "Interiors"].map((filt) => (
              <button
                key={filt}
                type="button"
                className={`${styles.filterBtn} ${
                  galleryFilter === filt ? styles.filterBtnActive : ""
                }`}
                onClick={() => setGalleryFilter(filt)}
              >
                {filt === "Actual"
                  ? "On-Site Delivered Photos"
                  : filt === "Architecture"
                  ? "Elevation & Retail Frontage"
                  : filt === "Interiors"
                  ? "Lobby & Interiors"
                  : "All Showcase Media"}
              </button>
            ))}
          </div>

          <div className={styles.galleryGrid} ref={galleryGridRef}>
            {filteredGallery.map((item) => (
              <button
                type="button"
                className={styles.galleryCard}
                key={item.id}
                onClick={() => setModalMedia(item)}
              >
                <img src={item.src} alt={item.title} className={styles.galleryCardImg} />
                <div className={styles.galleryOverlay}>
                  <span className={styles.galleryTag}>{item.category}</span>
                  <h4 className={styles.galleryItemTitle}>{item.title}</h4>
                  <p className={styles.galleryItemDesc}>{item.desc}</p>
                </div>
                <span className={styles.galleryExpandIcon} aria-hidden="true">
                  ⤢
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ================= 3. DYNAMIC EMI & AFFORDABILITY CALCULATOR (CHARCOAL) ================= */}
      <section className={styles.calcSection} id="emi-calculator">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader} data-reveal>
            <h2 className={styles.sectionTitle}>
              READY-POSSESSION <span>EMI &amp; LOAN CALCULATOR</span>
            </h2>
            <p className={styles.sectionSubtitle}>
              Estimate monthly mortgage payments with pre-approved home loan rates from SBI, HDFC, ICICI, Axis Bank, and Bank of Baroda.
            </p>
          </div>

          <div className={styles.calcCard} data-reveal>
            <div className={styles.calcInputsCol}>
              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <label htmlFor="flat-price">Property Value</label>
                  <span className={styles.sliderValueBadge}>₹{priceLakhs} Lakhs</span>
                </div>
                <input
                  id="flat-price"
                  type="range"
                  min="45"
                  max="120"
                  step="1"
                  value={priceLakhs}
                  onChange={(e) => setPriceLakhs(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderMinMax}>
                  <span>₹45 Lakhs (2 BHK)</span>
                  <span>₹1.20 Cr (Grand 3 BHK)</span>
                </div>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <label htmlFor="down-payment">Down Payment</label>
                  <span className={styles.sliderValueBadge}>
                    {downPercent}% (₹{((priceLakhs * downPercent) / 100).toFixed(1)} L)
                  </span>
                </div>
                <input
                  id="down-payment"
                  type="range"
                  min="10"
                  max="50"
                  step="5"
                  value={downPercent}
                  onChange={(e) => setDownPercent(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderMinMax}>
                  <span>10% Minimum</span>
                  <span>50% Maximum</span>
                </div>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderHeader}>
                  <label htmlFor="loan-tenure">Loan Tenure</label>
                  <span className={styles.sliderValueBadge}>{tenureYears} Years</span>
                </div>
                <input
                  id="loan-tenure"
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className={styles.rangeSlider}
                />
                <div className={styles.sliderMinMax}>
                  <span>5 Years</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            <div className={styles.calcResultsCol}>
              <div className={styles.emiHighlightBox}>
                <span className={styles.emiLabel}>ESTIMATED MONTHLY EMI</span>
                <div className={styles.emiAmount}>
                  ₹{emi.toLocaleString("en-IN")}
                  <span className={styles.perMonth}>/ month</span>
                </div>
                <span className={styles.rateBadge}>
                  @ {interestRate}% P.A. · Bank Pre-Approved
                </span>
              </div>

              <div className={styles.breakdownList}>
                <div className={styles.breakdownRow}>
                  <span>Loan Principal Amount</span>
                  <strong>₹{(principal / 100000).toFixed(2)} Lakhs</strong>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Total Interest Payable</span>
                  <strong>₹{(totalInterest / 100000).toFixed(2)} Lakhs</strong>
                </div>
                <div className={styles.breakdownRow}>
                  <span>Total Amount Payable</span>
                  <strong>₹{(totalPayment / 100000).toFixed(2)} Lakhs</strong>
                </div>
              </div>

              <a
                href={`${whatsappHref}?text=${encodeURIComponent(
                  `Hello Lifestyle Homes, I calculated an EMI of approx ₹${emi.toLocaleString("en-IN")}/month for a ₹${priceLakhs} Lakh unit. Please arrange bank loan assistance.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.calcCtaBtn} roll-button`}
              >
                <span className="roll-text" data-text="Request Bank Loan Assistance →">
                  Request Bank Loan Assistance →
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 4K ULTRA-HD LIGHTBOX MODAL ================= */}
      {modalMedia && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setModalMedia(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalHeaderInfo}>
                <h4 className={styles.modalTitle}>{modalMedia.title}</h4>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setModalMedia(null)}
                aria-label="Close Preview"
              >
                ✕ Close
              </button>
            </div>

            <div className={styles.modalImgWrapper}>
              <img
                src={modalMedia.src}
                alt={modalMedia.title}
                className={styles.modalImg}
              />
            </div>

            <div className={styles.modalCaption}>
              <div className={styles.modalTextCol}>
                <p className={styles.modalDesc}>{modalMedia.desc}</p>
                <div className={styles.modalSpecsRow}>
                  <span>DPS Road, Parvati Nagar, Amravati</span>
                  <span>·</span>
                  <span>MahaRERA: P50300054447</span>
                  <span>·</span>
                  <span>100% Ready Possession</span>
                </div>
              </div>

              <div className={styles.modalActions}>
                <a
                  href={`${whatsappHref}?text=${encodeURIComponent(
                    `Hello Lifestyle Homes, I inspected the 4K plan for "${modalMedia.title}". Please share pricing and arrange a site visit.`
                  )}`}
                  className={`${styles.modalWaBtn} roll-button`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="roll-text" data-text="Enquire on WhatsApp →">
                    Enquire on WhatsApp →
                  </span>
                </a>
                <a href={telHref} className={styles.modalCallBtn}>
                  Call Sales Desk
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
