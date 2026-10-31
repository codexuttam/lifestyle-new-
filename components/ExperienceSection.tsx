"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./ExperienceSection.module.css";
import EnquiryModal from "@/components/EnquiryModal";

interface ServiceCard {
  number: string;
  title: string;
  image: string;
  preference: string;
}

const CARDS: ServiceCard[] = [
  {
    number: "01",
    title: "15-STOREY HIGHRISE",
    image: "/aura/building-full-4k.jpg",
    preference: "15-Storey Tower Architecture & Structure",
  },
  {
    number: "02",
    title: "SKY POOL & TURF",
    image: "/aura/rooftop-amenities-3d.jpg",
    preference: "Level 15 Rooftop Sky Oasis & Amenities",
  },
  {
    number: "03",
    title: "VASTU SUITES",
    image: "/aura/luxury-bedroom-2.jpg",
    preference: "2 & 3 BHK Luxury Residences",
  },
  {
    number: "04",
    title: "BENCHMARK SPECS",
    image: "/aura/cut-section-2bhk-3bhk.jpg",
    preference: "Official Specifications & MahaRERA Kit",
  },
];

export default function ExperienceSection() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState("2 & 3 BHK Luxury Residences");

  const handleCardClick = (pref: string) => {
    setSelectedPreference(pref);
    setIsEnquiryOpen(true);
  };

  return (
    <section className={styles.experience} id="services" aria-label="Aura Living Experience">
      {/* Background Architectural Underlay */}
      <div className={styles.bgImageWrap} aria-hidden="true">
        <Image
          src="/aura/aura-hero-clean-4k.jpg"
          alt="Aura Atmosphere"
          fill
          sizes="1320px"
          className={styles.bgImage}
        />
        <div className={styles.bgScrim} />
      </div>

      <div className={styles.contentGrid}>
        {/* Left Narrative Column */}
        <div className={styles.narrativeCol}>
          <span className={styles.sectionLabel}>SERVICES</span>
          <h2 className={styles.title}>
            DESIGN THAT
            <br />
            <span className={styles.swashInitial}>R</span>ESONATES
          </h2>
          <p className={styles.bodyText}>
            We offer more than design – we craft living experiences through clarity, texture,
            intention, and thoughtful presence across 15 storeys.
          </p>
          <button
            type="button"
            className={styles.ctaLine}
            onClick={() => {
              setSelectedPreference("2 & 3 BHK Luxury Residences");
              setIsEnquiryOpen(true);
            }}
          >
            <span>GET IN TOUCH</span>
            <span className={styles.arrow}>→</span>
          </button>
        </div>

        {/* Right: 2x2 Grid of Floating White Cards */}
        <div className={styles.cardsWrapper}>
          <div className={styles.cardsGrid}>
            {CARDS.map((card) => (
              <button
                type="button"
                key={card.number}
                className={styles.whiteCard}
                onClick={() => handleCardClick(card.preference)}
                aria-label={`Enquire about ${card.title}`}
              >
                <span className={styles.cardNumber}>{card.number}</span>
                <div className={styles.cardImgWrap}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 580px) 100vw, 240px"
                    className={styles.cardImg}
                  />
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
              </button>
            ))}
          </div>
          <div className={styles.bottomNote}>
            Design services crafted for calm, intentional, and meaningful living.
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={selectedPreference}
        source="Services Section"
      />
    </section>
  );
}
