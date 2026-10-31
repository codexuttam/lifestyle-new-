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
    image: "/aura/exterior-elevation-day-hd.jpg",
    preference: "15-Storey Tower Architecture & Structure",
  },
  {
    number: "02",
    title: "SKY POOL & TURF",
    image: "/aura/rooftop-pool-turf-hd.jpg",
    preference: "Level 15 Rooftop Sky Oasis & Amenities",
  },
  {
    number: "03",
    title: "VASTU SUITES",
    image: "/aura/master-bedroom-suite-hd.jpg",
    preference: "2 & 3 BHK Luxury Residences",
  },
  {
    number: "04",
    title: "20+ SKY AMENITIES",
    image: "/aura/grand-entrance-lobby-hd.jpg",
    preference: "Official Specifications & MahaRERA Kit",
  },
];

export default function ExperienceSection() {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [selectedPreference, setSelectedPreference] = useState("Level 15 Rooftop Sky Oasis & Amenities");

  const handleCardClick = (pref: string) => {
    setSelectedPreference(pref);
    setIsEnquiryOpen(true);
  };

  return (
    <section className={styles.experience} id="services" aria-label="Aura Sky Amenities & Living Experience">
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
          <span className={styles.sectionLabel}>LIFESTYLE &amp; AMENITIES</span>
          <h2 className={styles.title}>
            SPACES THAT
            <br />
            <span className={styles.swashInitial}>I</span>NSPIRE
          </h2>
          <p className={styles.bodyText}>
            Elevated high above the street noise of Congress Nagar, Level 15 hosts an unprecedented rooftop
            recreation crown – featuring a panoramic infinity lap pool, kids splash deck, enclosed multi-sports
            turf for box cricket and tennis, and sunset cabanas with Melghat views.
          </p>
          <button
            type="button"
            className={styles.ctaLine}
            onClick={() => {
              setSelectedPreference("Level 15 Rooftop Sky Oasis & Amenities");
              setIsEnquiryOpen(true);
            }}
          >
            <span>DISCOVER SKY AMENITIES</span>
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
                <div className={styles.cardHeader}>
                  <span className={styles.cardNumber}>{card.number}</span>
                  <span className={styles.cardArrow}>↗</span>
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <div className={styles.cardImageWrap}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    sizes="(max-width: 640px) 140px, 160px"
                    className={styles.cardImage}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference={selectedPreference}
        source="Living Experience Section"
      />
    </section>
  );
}
