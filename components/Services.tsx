"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceIcon from "./ServiceIcons";
import EnquiryModal from "@/components/EnquiryModal";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ServiceRecord } from "@/lib/schemas/service";
import type { ServiceIconKey } from "@/data/services";
import styles from "./Services.module.css";

const ARCHITECTURAL_PILLARS = [
  {
    index: "01",
    title: "ZERO SHARED WALLS & 360° CROSS-VENTILATION",
    body: "Every 2 & 3 BHK suite at Aura is planned around open daylight corridors with private sit-out balconies, acoustic separation between residences, and 100% Vastu alignment.",
  },
  {
    index: "02",
    title: "ELEVATED SKY LEISURE ABOVE STREET CONGESTION",
    body: "Instead of crowding ground setbacks, Level 15 crowns the tower with a rooftop lap pool, kids splash zone, multi-sports turf, jogging loop, and panoramic horizon decks.",
  },
  {
    index: "03",
    title: "BENCHMARK SPECIFICATIONS & ACCOUNTABLE DELIVERY",
    body: "800×1600 mm vitrified slabs, concealed Jaquar fittings, 3-track powder-coated windows, seismic-grade RCC framing, and 4 high-speed elevators backed by generator power.",
  },
];

interface ProjectPillarCard {
  id: string;
  category: string;
  icon: ServiceIconKey;
  title: string;
  text: string;
  meta: string;
  preference: string;
}

const AURA_PROJECT_PILLARS: ProjectPillarCard[] = [
  {
    id: "skyline-tower",
    category: "ARCHITECTURE",
    icon: "layers",
    title: "15-Storey Skyline Highrise",
    text: "Amravati's signature 15-storey highrise in Camp with 360° panoramic horizon views, seismic-grade RCC engineering, and iconic entrance boulevard.",
    meta: "SCALE · 15 STOREYS + SKY DECK",
    preference: "15-Storey Tower Architecture & Structure",
  },
  {
    id: "sky-suites",
    category: "RESIDENCES",
    icon: "house",
    title: "2 & 3 BHK Luxury Residences",
    text: "1,150 to 1,850 SQFT super built-up residences with 100% Vastu compliance, zero shared walls, cross-ventilated layouts, and grand private sit-out balconies.",
    meta: "CONFIG · 1,150 – 1,850 SQFT",
    preference: "2 & 3 BHK Luxury Residences",
  },
  {
    id: "crown-oasis",
    category: "SKYLINE LEISURE",
    icon: "compass",
    title: "Crown Level 15 Sky Oasis",
    text: "Rooftop lap pool, kids splash pool, multi-sports turf, sky jogging loop, and open-air sunset deck positioned 15 storeys above street noise.",
    meta: "AMENITIES · 20+ ROOFTOP SPACES",
    preference: "Level 15 Rooftop Sky Oasis & Amenities",
  },
  {
    id: "maharera-specs",
    category: "ASSURANCE",
    icon: "shield",
    title: "MahaRERA & Grade-A Specs",
    text: "MahaRERA Reg. P5030002502915. Finished with 800×1600mm vitrified slabs, concealed Jaquar fittings, 4 high-speed ARD lifts, and full generator power backup.",
    meta: "MAHARERA · P5030002502915",
    preference: "Official Specifications & MahaRERA Kit",
  },
];

export default function Services({
  services,
  content,
}: {
  services?: ServiceRecord[];
  content: HomeRecord["services"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const colRuleRef = useRef<HTMLSpanElement>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState("2 & 3 BHK Luxury Residences");

  const handleCardClick = (pref: string) => {
    setSelectedPreference(pref);
    setIsEnquiryOpen(true);
  };

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (colRuleRef.current) {
        gsap.fromTo(
          colRuleRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          }
        );
      }

      gsap.from("[data-pillar-item]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.pillarsCol}`,
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-service-card]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.grid}`,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.services} id="services-section" ref={sectionRef}>
      {/* Virtuaze-Style 3D Perspective Architectural Floor Grid */}
      <div className={styles.perspectiveStage} aria-hidden="true">
        <div className={styles.gridFloor} />
        <div className={styles.horizonGlow} />
      </div>

      <div className={styles.container}>
        {/* Editorial Sticky Left + Scroll-Revealed Right Value Narrative */}
        <div className={styles.editorialSplit}>
          <div className={styles.stickyCol}>
            <h2 className={styles.heading}>{content.heading}</h2>
            <p className={styles.intro}>{content.intro}</p>
            <a href="#floor-plans" className={`${styles.viewAll} roll-button`}>
              <span className="roll-text" data-text="INSPECT FLOOR PLATES →">
                INSPECT FLOOR PLATES →
              </span>
            </a>
            <span className={styles.verticalProgressRule} ref={colRuleRef} aria-hidden="true" />
          </div>

          <div className={styles.pillarsCol}>
            {ARCHITECTURAL_PILLARS.map((pillar) => (
              <article className={styles.pillarBlock} key={pillar.index} data-pillar-item>
                <span className={styles.pillarIndex}>({pillar.index})</span>
                <div className={styles.pillarContent}>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarBody}>{pillar.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 4 Core Aura Project Benchmark Pillars (Interactive Cards) */}
        <div className={styles.grid}>
          {AURA_PROJECT_PILLARS.map((pillar, index) => (
            <button
              type="button"
              key={pillar.id}
              className={styles.card}
              onClick={() => handleCardClick(pillar.preference)}
              data-service-card
              aria-label={`Enquire about ${pillar.title}`}
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBadge}>
                  <ServiceIcon name={pillar.icon} />
                </div>
                <span className={styles.categoryChip}>
                  0{index + 1} · {pillar.category}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardText}>{pillar.text}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.timelineMeta}>{pillar.meta}</span>
                <span className={styles.learnMore} aria-hidden="true">Enquire ↗</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Official Aura Project VIP Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={selectedPreference}
        source="Aura Project Pillars"
      />
    </section>
  );
}
