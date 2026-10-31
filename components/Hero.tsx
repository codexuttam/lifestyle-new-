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
      {/* Light & Minimal Daytime Architectural Building Facade */}
      <div className={styles.mediaWrap}>
        <Image
          src="/aura/exterior-elevation-day-hd.jpg"
          alt="Aura 15-Storey Daytime Architectural Landmark, Camp Amravati"
          fill
          priority
          sizes="100vw"
          className={styles.mediaImage}
        />
        <div className={styles.mediaOverlay} />
      </div>

      {/* Hero Bottom Content Grid — Reduced & Minimal Editorial Typography */}
      <div className={styles.contentGrid}>
        {/* Left: Clean Minimal Editorial Headline */}
        <div className={styles.headlineWrap}>
          <h1 className={styles.headlineLine}>MATERIAL.</h1>
          <h2 className={styles.headlineLine}>
            <span className={styles.swashInitial}>M</span>EANING.
          </h2>
          <h2 className={styles.headlineLine}>AURA.</h2>
        </div>

        {/* Right: Concise Subline & Minimal CTA */}
        <div className={styles.narrativeCol}>
          <p className={styles.description}>
            Amravati&apos;s premier 15-storey architectural highrise.
          </p>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.ctaLine}
              onClick={() => setIsEnquiryOpen(true)}
              aria-label="Enquire about Aura residences"
            >
              <span>GET IN TOUCH</span>
              <span className={styles.arrow}>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference="General Residence Enquiry"
        source="Hero Section"
      />
    </section>
  );
}
