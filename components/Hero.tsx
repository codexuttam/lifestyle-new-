"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import EnquiryModal from "@/components/EnquiryModal";
import type { HomeRecord } from "@/lib/schemas/home";

export default function Hero({ content }: { content?: HomeRecord["hero"] }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  return (
    <section className={styles.hero} id="hero-section" aria-label="Aura Hero">
      {/* Background Architectural Media */}
      <div className={styles.mediaWrap}>
        <Image
          src="/aura/modern-living-room.jpg"
          alt="Aura Architectural Interior"
          fill
          priority
          sizes="(max-width: 1320px) 100vw, 1320px"
          className={styles.mediaImage}
        />
        <div className={styles.mediaOverlay} />
      </div>

      {/* Hero Bottom Content Grid */}
      <div className={styles.contentGrid}>
        {/* Left: Editorial Serif Headline */}
        <div className={styles.headlineWrap}>
          <h1 className={styles.headlineLine}>MATERIAL.</h1>
          <h2 className={styles.headlineLine}>
            <span className={styles.swashInitial}>M</span>EANING.
          </h2>
          <h2 className={styles.headlineLine}>AURA.</h2>
        </div>

        {/* Right: Narrative & Minimal Underlined CTA */}
        <div className={styles.narrativeCol}>
          <p className={styles.description}>
            Aura by Lifestyle is Amravati&apos;s premier 15-storey architectural highrise creating
            light-filled, cross-ventilated residences with purpose and depth.
          </p>
          <button
            type="button"
            className={styles.ctaLine}
            onClick={() => setIsEnquiryOpen(true)}
            aria-label="Enquire about Aura"
          >
            <span>GET IN TOUCH</span>
            <span className={styles.arrow}>→</span>
          </button>
        </div>
      </div>

      {/* VIP Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference="2 & 3 BHK Luxury Residences"
        source="Hero Get in Touch"
      />
    </section>
  );
}
