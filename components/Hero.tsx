"use client";

import { useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import EnquiryModal from "@/components/EnquiryModal";
import type { HomeRecord } from "@/lib/schemas/home";

export default function Hero({ content }: { content?: HomeRecord["hero"] }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section className={styles.hero} id="hero-section" aria-label="Aura Hero">
      {/* Background Architectural 4K Building Media */}
      <div className={styles.mediaWrap}>
        <Image
          src="/aura/aura-hero-clean-4k.jpg"
          alt="Aura 15-Storey Ultra-Luxury Landmark, Camp Amravati"
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
          <div className={styles.locationTag}>
            <span className={styles.locationDot} />
            <span>CAMP, AMRAVATI · 15-STOREY LANDMARK</span>
          </div>
          <h1 className={styles.headlineLine}>MATERIAL.</h1>
          <h2 className={styles.headlineLine}>
            <span className={styles.swashInitial}>M</span>EANING.
          </h2>
          <h2 className={styles.headlineLine}>AURA.</h2>
        </div>

        {/* Right: Narrative & Minimal Underlined CTA */}
        <div className={styles.narrativeCol}>
          <p className={styles.description}>
            Amravati&apos;s premier 15-storey architectural highrise featuring 2 &amp; 3 BHK luxury sky suites,
            Level 15 rooftop infinity pool and sports turf, crafted with zero shared walls and 100% Vastu compliance.
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

            <button
              type="button"
              className={styles.videoPillBtn}
              onClick={() => setIsVideoOpen(true)}
              aria-label="Watch cinematic architectural film"
            >
              <span className={styles.playIcon}>▶</span>
              <span>Watch Film</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cinematic Walkthrough Video Modal */}
      {isVideoOpen && (
        <div
          className={styles.videoModal}
          onClick={() => setIsVideoOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.videoModalInner} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.closeVideoBtn}
              onClick={() => setIsVideoOpen(false)}
              aria-label="Close video modal"
            >
              ✕
            </button>
            <video
              src="/videos/aura-showcase-clip.mp4"
              controls
              autoPlay
              playsInline
              className={styles.modalVideo}
            />
          </div>
        </div>
      )}

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
