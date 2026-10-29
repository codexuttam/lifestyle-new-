"use client";

import { useState } from "react";
import styles from "./AuraFloorPlans.module.css";

const PLANS = [
  {
    id: "2bhk",
    label: "2 BHK Luxury Cut Section",
    badge: "1,150 SQFT",
    title: "2 BHK Smart Luxury Residence",
    subtitle: "Commanding views, dual balconies & zero wasted circulation",
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
      "Private Master Suite with Dedicated Toilet (5'0\" x 9'0\")",
      "3-Track Powder Coated Windows with MS Grills",
      "Concealed Jaquar or Equivalent Fittings",
    ],
  },
  {
    id: "3bhk",
    label: "3 BHK Royal Cut Section",
    badge: "1,650 SQFT",
    title: "3 BHK Royal Skyline Residence",
    subtitle: "Grand multi-balcony suite designed for expansive hospitality",
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
      "Separate Washing and Utility Balcony (9'0\" x 5'6\")",
      "Provision for Inverter & Split AC in All Bedrooms",
    ],
  },
  {
    id: "rooftop",
    label: "Rooftop Sky Oasis",
    badge: "SKY LEVEL",
    title: "Skyline Leisure & Multi-Sports Deck",
    subtitle: "Rooftop swimming, box cricket, and viewing promenade",
    image: "/aura/rooftop-sky-thrills-map.jpg",
    specs: [
      { room: "Swimming Pool", dim: "Lap & Leisure Pool" },
      { room: "Kids Pool", dim: "Safe Shallow Splash Zone" },
      { room: "Multi-Sports Turf", dim: "Box Cricket & Tennis" },
      { room: "Viewing Deck", dim: "Panoramic Skyline Seating" },
      { room: "Fitness Track", dim: "Rooftop Jogging Loop" },
      { room: "Party Lawn", dim: "Open-Air Gathering Zone" },
      { room: "Solar Power", dim: "Common Area Renewable System" },
      { room: "Elevators", dim: "4 Elevators with Gen Backup" },
    ],
    features: [
      "Stunning 360-Degree Views Across Amravati & Melghat Horizon",
      "Dedicated Changing Rooms & Shower Areas",
      "Acoustic Glass Railings for Maximum Sky Safety",
      "Solar Panel System for Eco-Friendly Common Energy",
    ],
  },
  {
    id: "typical",
    label: "Typical Floor Plan",
    badge: "LEVELS 1 - 14",
    title: "Typical Architectural Floor Plate",
    subtitle: "Optimum cross-ventilation, 4 high-speed elevators & wide designer lobbies",
    image: "/aura/typical-floor-plan.jpg",
    specs: [
      { room: "Floor Plate", dim: "Levels 1 to 14" },
      { room: "Configurations", dim: "2 & 3 BHK Luxury Suites" },
      { room: "Circulation", dim: "Wide Lobbies & Safe Corridors" },
      { room: "Lifts", dim: "4 High-Speed Passenger Elevators" },
      { room: "Staircases", dim: "Dual Fire & Service Staircases" },
      { room: "Ventilation", dim: "360° Open Air Cross-Ventilation" },
      { room: "Balconies", dim: "Private Sit-Out Balconies" },
      { room: "Compliance", dim: "100% Vastu Compliant Layout" },
    ],
    features: [
      "Master Architectural Floor Layout for Floors 1 to 14",
      "No Common Wall Sharing for Optimal Acoustic Privacy",
      "Dedicated Service Ducts and Concealed Fire-Fighting Network",
      "Emergency Evacuation Corridors & Stretcher Lift Access",
    ],
  },
];

export default function AuraFloorPlans() {
  const [activeTab, setActiveTab] = useState(0);
  const plan = PLANS[activeTab];

  return (
    <section className={styles.section} id="floor-plans">
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Masterfully Planned For <span>Identity & Distinction</span>
          </h2>
          <p className={styles.subtitle}>
            Explore authentic cut-sections and dimensions straight from the official Aura brochure. Every layout is 100% Vastu-compliant with maximum light and cross-ventilation.
          </p>

          {/* Navigation Tabs */}
          <div className={styles.tabs}>
            {PLANS.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.tabBtn} ${activeTab === idx ? styles.activeTab : ""}`}
                onClick={() => setActiveTab(idx)}
              >
                <span>{item.label}</span>
                <span className={styles.tabBadge}>{item.badge}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Plan Display Card */}
        <div className={styles.displayCard}>
          <div className={styles.imageCol}>
            <div className={styles.imageWrapper}>
              <img
                src={plan.image}
                alt={plan.title}
                className={styles.planImg}
              />
              <div className={styles.imageTag}>{plan.badge}</div>
            </div>
          </div>

          <div className={styles.detailsCol}>
            <div className={styles.detailsHeader}>
              <span className={styles.planCategory}>Official Cut Section</span>
              <h3 className={styles.planTitle}>{plan.title}</h3>
              <p className={styles.planSubtitle}>{plan.subtitle}</p>
            </div>

            {/* Room Dimensions Grid */}
            <div className={styles.specsGrid}>
              {plan.specs.map((s) => (
                <div key={s.room} className={styles.specItem}>
                  <span className={styles.specRoom}>{s.room}</span>
                  <span className={styles.specDim}>{s.dim}</span>
                </div>
              ))}
            </div>

            {/* Key Highlights */}
            <div className={styles.highlightsBox}>
              <h4 className={styles.highlightsTitle}>Architectural Highlights</h4>
              <ul className={styles.highlightsList}>
                {plan.features.map((f, i) => (
                  <li key={i}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-wine, #c21a22)" strokeWidth="2.5">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
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
                className={styles.whatsappBtn}
              >
                <span>Request Detailed Floor Plan PDF</span>
              </a>
              <a href="/contact" className={styles.visitBtn}>
                Book Site Preview
              </a>
            </div>
          </div>
        </div>

        {/* Location & Connectivity Banner */}
        <div className={styles.locationBanner}>
          <div className={styles.locationContent}>
            <h3 className={styles.locationTitle}>
              Because Aura Connects You To Everything
            </h3>
            <p className={styles.locationDesc}>
              Located in Congress Nagar, Aura places you at the center of convenience with seamless connectivity to schools, shopping malls, hospitals, and transit hubs.
            </p>
            <div className={styles.distanceChips}>
              <span className={styles.chip}>🏥 Hospitals — 5 min</span>
              <span className={styles.chip}>🎓 Colleges — 5 min</span>
              <span className={styles.chip}>🏫 Schools — 6 min</span>
              <span className={styles.chip}>🛍️ Shopping Malls & D-Mart — 7 min</span>
              <span className={styles.chip}>🚆 Amravati Railway Station — 8 min</span>
              <span className={styles.chip}>🌳 Oxygen Park — Walking Distance</span>
            </div>
          </div>
          <div className={styles.locationMapWrapper}>
            <img
              src="/aura/location-connectivity-map.jpg"
              alt="Aura Congress Nagar Location Map"
              className={styles.mapImg}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
