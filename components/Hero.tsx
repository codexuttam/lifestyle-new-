"use client";

import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

export default function Hero({ content }: { content: HomeRecord["hero"] }) {
  return (
    <section className={styles.hero} id="hero-section">
      {/* 4K Clean Building Background Image */}
      <div className={styles.buildingContainer}>
        <img
          src="/aura/aura-hero-clean-4k.jpg"
          alt="Aura by Lifestyle 15-Storey Tower in 4K"
          className={styles.buildingImage}
          referrerPolicy="no-referrer"
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* Giant Headline */}
      <div className={styles.headlineContainer}>
        <h1 className={styles.headline}>AURA</h1>
      </div>

      {/* Bottom-right glass info box */}
      <div className={styles.rightWrapper}>
        <div className={styles.infoBox}>
          <img
            src={content.infoImage || "/aura/luxury-master-bedroom.jpg"}
            alt="Aura Luxury Residence"
            className={styles.infoImage}
          />
          <div className={styles.infoText}>
            <span className={styles.infoTag}>✦ Signature Highrise</span>
            <h2 className={styles.infoTitle}>Aura Residences</h2>
            <p className={styles.infoDescription}>
              2 &amp; 3 BHK Luxury Suites · Camp, Amravati · MahaRERA: P5030002502915
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

