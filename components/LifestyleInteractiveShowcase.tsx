"use client";

import { useState } from "react";
import styles from "./LifestyleInteractiveShowcase.module.css";

const UNITS = [
  {
    id: "3bhk",
    title: "3 BHK Royal Luxury Suite (Type 3/4)",
    badge: "1,550 SQFT SUPER BUILT-UP",
    price: "₹65 L – ₹78 L*",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-3bhk-3d-iso.jpg",
    summary:
      "A grand 3-bedroom corner suite featuring 3 expansive private balconies, dedicated master wardrobe dressing niche, kitchen with store & utility, and 100% Vastu alignment on DPS Road.",
    rooms: [
      { name: "Drawing Hall", dim: "11'0\" × 18'0\"" },
      { name: "Dinning Area", dim: "10'0\" × 10'3\"" },
      { name: "Modular Kitchen", dim: "10'0\" × 9'6\"" },
      { name: "Master Suite", dim: "12'4\" × 13'0\" + Dressing" },
      { name: "Bedroom 2", dim: "11'0\" × 12'0\"" },
      { name: "Bedroom 3", dim: "11'0\" × 11'0\"" },
      { name: "Private Balconies", dim: "6'0\" Wide Balcony + Veranda" },
      { name: "Bathrooms", dim: "3 Toilets (Jaquar Fittings)" },
    ],
    features: [
      "Triple Balcony layout ensuring 360-degree cross-ventilation and natural daylight",
      "Minimum 2' × 4' nano-polished double-charged vitrified floor tiling",
      "Teak-wood frame main door with video call doorbell for maximum family safety",
      "Concealed copper wiring with modular switches and dedicated inverter backup line",
    ],
  },
  {
    id: "2bhk",
    title: "2 BHK Comfort Modern Home (Type 1 & 2)",
    badge: "1,100 – 1,245 SQFT",
    price: "₹48 L – ₹58 L*",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-2bhk-3d-iso.jpg",
    summary:
      "Thoughtfully designed 2 BHK residences (Flat Type-1 & Type-2) with zero wasted corridors, expansive 16-foot drawing room, separate dining area, dual sit-outs, and utility wash.",
    rooms: [
      { name: "Drawing Room", dim: "16'0\" × 11'0\"" },
      { name: "Dinning Lobby", dim: "9'0\" × 13'5\"" },
      { name: "Master Bedroom", dim: "12'10\" × 11'10\"" },
      { name: "Children's Room", dim: "11'0\" × 11'0\"" },
      { name: "Kitchen & Utility", dim: "8'11\" × 8'10\" (Utility 6'9\")" },
      { name: "Sit-Out Balconies", dim: "6'11\" Wide Sit-Out" },
      { name: "Bathrooms", dim: "2 Toilets (Master + Common)" },
      { name: "Orientation", dim: "100% Vastu East / North" },
    ],
    features: [
      "Zero dead-space floor design maximizing usable carpet and living space",
      "Granite kitchen counter with stainless steel sink and semi-modular trolley provision",
      "Powder-coated 3-track aluminum sliding windows with integrated mosquito net",
      "24-Hour pressurized dual water supply (Borewell + Common Sump + RCC Overhead)",
    ],
  },
  {
    id: "typical",
    title: "Typical 2nd to 6th Floor Plan",
    badge: "5 FLATS / FLOOR",
    price: "Level 2 to 6",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-typical-floor.jpg",
    summary:
      "Cluster of 5 spacious residences per floor arranged along a wide 9-foot central lobby, served by dual automatic Otis elevators (stretcher ARD lift) and fire safety stairs.",
    rooms: [
      { name: "Central Lobby", dim: "9'0\" Wide Grand Lobby" },
      { name: "Flat 1 (3 BHK)", dim: "1,684 SQFT Super Built-up" },
      { name: "Flat 2 (2 BHK)", dim: "1,271 SQFT Super Built-up" },
      { name: "Flat 3 (3 BHK)", dim: "1,512 SQFT Super Built-up" },
      { name: "Flat 4 (3 BHK)", dim: "1,595 SQFT Super Built-up" },
      { name: "Flat 5 (2 BHK)", dim: "1,246 SQFT Super Built-up" },
      { name: "Elevators", dim: "1 Passenger + 1 Stretcher ARD" },
      { name: "Ventilation", dim: "3-Side Open Light Shafts" },
    ],
    features: [
      "Privacy-focused entrance verandas for each flat avoiding direct eye contact",
      "Granite finished common corridors and staircase with SS safety railings",
      "Independent light and ventilation shafts ensuring fresh air flow into all kitchens",
      "Concealed electrical and plumbing shafts for easy maintenance without disruption",
    ],
  },
  {
    id: "commercial",
    title: "24 Road-Facing Retail Showrooms",
    badge: "12 GROUND + 12 FIRST",
    price: "₹32 L – ₹85 L*",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-ground-commercial.jpg",
    summary:
      "24 road-facing prime commercial showrooms on DPS Road, Parvati Nagar. Delivered with full glass display frontage and customer parking, already hosting Dee Bakers & MORE.",
    rooms: [
      { name: "Ground Floor", dim: "12 Shops (191 to 337 SQFT)" },
      { name: "First Floor", dim: "12 Shops (170 to 400 SQFT)" },
      { name: "Road Width", dim: "24 Metres Main DPS Road" },
      { name: "Frontage", dim: "Direct Street-Level Glass Front" },
      { name: "Customer Parking", dim: "Dedicated Front Stalls" },
      { name: "Power", dim: "3-Phase Commercial Dedicated" },
      { name: "Footfall", dim: "Parvati Nagar Core Commercial" },
      { name: "Possession", dim: "Delivered & Fully Operational" },
    ],
    features: [
      "High visibility on 24-metre wide arterial DPS Road connecting Badnera and Akoli",
      "Surrounded by dense residential developments, DPS School, and hospital hubs",
      "Full glass frontage and wide paved walkways with prominent branding signage",
      "24/7 CCTV surveillance and attractive gated security for retail peace of mind",
    ],
  },
  {
    id: "basement",
    title: "Basement & Stilt Parking Plan",
    badge: "DEDICATED SLOTS",
    price: "Reserved Parking",
    img: "/assets/projects/lifestyle-homes/floor-plans/plan-basement-parking.jpg",
    summary:
      "Spacious basement parking facility with clearly delineated 4-wheeler and 2-wheeler bays, wide two-way ramped driveways, automated sump, and direct elevator connectivity to all residences.",
    rooms: [
      { name: "Driveway", dim: "Two-Way Ramped Access" },
      { name: "Car Bays", dim: "Dedicated Marked Stalls" },
      { name: "2-Wheeler", dim: "Dedicated Parking Zone" },
      { name: "Surveillance", dim: "24/7 CCTV (15-Day Backup)" },
      { name: "Lighting", dim: "Automated Energy-Efficient LED" },
      { name: "Access", dim: "Direct Lift to Residence" },
      { name: "Drainage", dim: "Automated Sump Dewatering" },
      { name: "Security", dim: "Attractive Gate & Guard Cabin" },
    ],
    features: [
      "Direct weatherproof elevator access from basement straight to your flat floor",
      "High ceiling clearance accommodating SUVs and tall passenger vehicles",
      "Heavy-duty paved floor finish resistant to oil spills and tyre wear",
      "Round-the-clock security surveillance recording with 15-day storage backup",
    ],
  },
];

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
    desc: "Delivered shops with Dee Bakers, MORE Supermarket, and bustling customer parking",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-delivered-angled.jpg",
  },
  {
    id: 3,
    category: "Architecture",
    title: "Daytime Architectural Elevation",
    desc: "Official architectural rendering from developer brochure showing corner geometry",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-elevation-day.jpg",
  },
  {
    id: 4,
    category: "Architecture",
    title: "Twilight Evening Illumination",
    desc: "Architectural facade rendered with glowing commercial galleria and private balconies",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-elevation-night.jpg",
  },
  {
    id: 5,
    category: "Commercial",
    title: "Double-Storey Commercial Galleria",
    desc: "High-street retail showrooms with double-height signage and wide pedestrian walkways",
    src: "/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg",
  },
  {
    id: 6,
    category: "Interiors",
    title: "Delivered Finished Living Room",
    desc: "Actual finished 2 & 3 BHK living hall opening into panoramic sit-out balcony",
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
  const [activeUnitIdx, setActiveUnitIdx] = useState(0);
  const activeUnit = UNITS[activeUnitIdx];

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
      {/* ================= 1. DYNAMIC UNIT PLANS & MATRIX ================= */}
      <section className={styles.unitSection} id="unit-plans">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Architectural <span>Cut-Sections &amp; Layouts</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            High-resolution 3D isometric cut-sections from the official Lifestyle Home Spaces brochure. Inspect room dimensions, private balconies, and 100% Vastu compliance.
          </p>
        </div>

        {/* Unit Tabs */}
        <div className={styles.unitTabs}>
          {UNITS.map((unit, idx) => (
            <button
              key={unit.id}
              type="button"
              className={`${styles.unitTab} ${
                activeUnitIdx === idx ? styles.unitTabActive : ""
              }`}
              onClick={() => setActiveUnitIdx(idx)}
            >
              <span>{unit.title}</span>
              <span className={styles.unitBadge}>{unit.badge}</span>
            </button>
          ))}
        </div>

        {/* Active Unit Card */}
        <div className={styles.unitCard}>
          <div className={styles.unitMediaCol}>
            <button
              type="button"
              className={styles.zoomTrigger}
              onClick={() =>
                setModalMedia({
                  src: activeUnit.img,
                  title: `${activeUnit.title} — Floor Plan Layout`,
                  desc: activeUnit.summary,
                })
              }
            >
              <i className="fa-solid fa-expand" />
              <span>Click To Zoom in 4K</span>
            </button>
            <img
              src={activeUnit.img}
              alt={activeUnit.title}
              className={styles.unitPlanImg}
              onClick={() =>
                setModalMedia({
                  src: activeUnit.img,
                  title: `${activeUnit.title} — Floor Plan Layout`,
                  desc: activeUnit.summary,
                })
              }
            />
          </div>

          <div className={styles.unitInfoCol}>
            <div className={styles.unitTitleRow}>
              <div>
                <span className={styles.unitBadge}>{activeUnit.badge}</span>
                <h3 className={styles.unitTitle}>{activeUnit.title}</h3>
              </div>
              <span className={styles.unitPrice}>{activeUnit.price}</span>
            </div>

            <p className={styles.unitSummary}>{activeUnit.summary}</p>

            <div className={styles.roomGrid}>
              {activeUnit.rooms.map((r, i) => (
                <div className={styles.roomBox} key={i}>
                  <span className={styles.roomName}>{r.name}</span>
                  <span className={styles.roomDim}>{r.dim}</span>
                </div>
              ))}
            </div>

            <div className={styles.unitFeaturesList}>
              {activeUnit.features.map((feat, i) => (
                <div className={styles.unitFeatureItem} key={i}>
                  <i className="fa-solid fa-circle-check" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className={styles.unitActionRow}>
              <a
                href={`${whatsappHref}?text=${encodeURIComponent(
                  `Hello Lifestyle Homes, I am interested in the ${activeUnit.title} on DPS Road. Please share pricing and available unit numbers.`
                )}`}
                className={styles.unitWaBtn}
              >
                <i className="fa-brands fa-whatsapp" />
                <span>Enquire For This Layout</span>
              </a>

              <a href={telHref} className={styles.unitSecondaryBtn}>
                <i className="fa-solid fa-phone" />
                <span>Call Sales Desk</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 2. DELIVERED GALLERY & ARCHITECTURE ================= */}
      <section className={styles.gallerySection} id="gallery">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Actual Site Photographs &amp; <span>Architectural Views</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Compare real on-site photographs of the delivered building with official architectural renderings and interior finishes.
          </p>
        </div>

        {/* Gallery Filter Buttons */}
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
                ? "Brochure Renders & Shops"
                : filt === "Interiors"
                ? "Lobby & Interiors"
                : "All Showcase Media"}
            </button>
          ))}
        </div>

        {/* Dynamic Media Grid */}
        <div className={styles.galleryGrid}>
          {filteredGallery.map((item) => (
            <div
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
              <div className={styles.galleryExpandIcon}>
                <i className="fa-solid fa-expand" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= 3. DYNAMIC EMI & AFFORDABILITY CALCULATOR ================= */}
      <section className={styles.calcSection} id="emi-calculator">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Ready-Possession <span>EMI &amp; Loan Calculator</span>
          </h2>
          <p className={styles.sectionSubtitle}>
            Estimate your monthly mortgage payments with bank-approved home loan rates (SBI, HDFC, ICICI, Bank of Baroda).
          </p>
        </div>

        <div className={styles.calcCard}>
          <div className={styles.calcInputsCol}>
            {/* Input 1: Flat Price */}
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
                <span>₹1.20 Cr (Penthouse/3 BHK)</span>
              </div>
            </div>

            {/* Input 2: Down Payment */}
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

            {/* Input 3: Loan Tenure */}
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
              <span className={styles.emiLabel}>Estimated Monthly EMI</span>
              <div className={styles.emiAmount}>
                ₹{emi.toLocaleString("en-IN")}
                <span className={styles.perMonth}>/ month</span>
              </div>
              <span className={styles.rateBadge}>
                @ {interestRate}% P.A. (Floating Nationalized Rate)
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
              className={styles.calcCtaBtn}
            >
              <i className="fa-solid fa-file-invoice-dollar" />
              <span>Get Bank Loan Approval &amp; Subsidy Help</span>
            </a>
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
                <span className={styles.modalBadge}>
                  <i className="fa-solid fa-eye" /> 4K Ultra-HD Layout Inspection
                </span>
                <h4 className={styles.modalTitle}>{modalMedia.title}</h4>
              </div>
              <button
                type="button"
                className={styles.modalCloseBtn}
                onClick={() => setModalMedia(null)}
                aria-label="Close Preview"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
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
                  <span>•</span>
                  <span>MahaRERA: P50300054447</span>
                  <span>•</span>
                  <span>100% Ready Possession</span>
                </div>
              </div>

              <div className={styles.modalActions}>
                <a
                  href={`${whatsappHref}?text=${encodeURIComponent(
                    `Hello Lifestyle Homes, I inspected the 4K plan for "${modalMedia.title}". Please share pricing and arrange a site visit.`
                  )}`}
                  className={styles.modalWaBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-whatsapp" />
                  <span>Enquire on WhatsApp</span>
                </a>
                <a href={telHref} className={styles.modalCallBtn}>
                  <i className="fa-solid fa-phone" />
                  <span>Call Sales Desk</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
