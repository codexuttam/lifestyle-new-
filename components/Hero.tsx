"use client";

import Link from "next/link";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

export default function Hero({ content }: { content: HomeRecord["hero"] }) {
  const handleOpenEnquiry = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lifestyle_open_enquiry", {
          detail: {
            project: "Aura by Lifestyle",
            source: "Hero Section (Aura)",
          },
        })
      );
    }
  };

  return (
    <section className={styles.hero} id="hero-section">
      {/* 1. Cinematic Architectural Showcase Video Backdrop */}
      <div className={styles.videoContainer}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.heroVideo}
          aria-hidden="true"
        >
          <source src="/videos/aura-showcase-clip.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />
      </div>

      {/* 2. Giant Architectural Monumental Headline */}
      <div className={styles.headlineContainer}>
        <h1 className={styles.headline}>AURA</h1>
      </div>

      {/* 3. Hero Editorial Content & Action Deck */}
      <div className={styles.editorialContent}>
        <div className={styles.specChips}>
          <span className={styles.specChip}>Congress Nagar, Camp</span>
          <span className={styles.specDivider} aria-hidden="true">•</span>
          <span className={styles.specChip}>15-Storey Tower</span>
          <span className={styles.specDivider} aria-hidden="true">•</span>
          <span className={styles.specChip}>2 &amp; 3 BHK Sky Suites</span>
        </div>

        <h2 className={styles.editorialTagline}>
          Amravati&apos;s Flagship 15-Storey Architectural Landmark Featuring Rooftop Sky Oasis &amp; Bespoke Living.
        </h2>

        <div className={styles.btnGroup}>
          <a href="#explore-site-section" className={styles.btnExplore}>
            Explore The Tower ↓
          </a>
          <button
            type="button"
            onClick={handleOpenEnquiry}
            className={styles.btnSchedule}
          >
            Schedule Private Preview →
          </button>
        </div>

        <div className={styles.heroFooterMeta}>
          <span className={styles.reraNumber}>MahaRERA: P5030002502915</span>
          <span className={styles.metaStatus}>Camp, Amravati · Readying for Skyline Benchmark</span>
        </div>
      </div>
    </section>
  );
}
