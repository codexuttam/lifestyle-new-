"use client";

import Link from "next/link";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

function SparkleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 12.5 8 13.5 10.5C16 11.5 22 12 22 12C22 12 16 12.5 13.5 15C12.5 17.5 12 22 12 22C12 22 11.5 17.5 10.5 15C8 12.5 2 12 2 12C2 12 8 11.5 10.5 10.5C11.5 8 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 6C12 6 12.3 9.3 13 11C14.7 11.7 18 12 18 12C18 12 14.7 12.3 13 14C12.3 15.7 12 19 12 19C12 19 11.7 15.7 11 14C9.3 12.3 6 12 6 12C6 12 9.3 11.7 11 11C11.7 9.3 12 6 12 6Z"
        fill="currentColor"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

export default function Hero({ content }: { content: HomeRecord["hero"] }) {
  return (
    <section className={styles.hero} id="hero-section">
      {/* 1. Cinematic Aura Showcase Video (Full Dynamic Building Video) */}
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

      {/* 2. Giant Architectural Headline */}
      <div className={styles.headlineContainer}>
        <h1 className={styles.headline}>AURA</h1>
      </div>

      {/* 3. Left Box: Sparkle, Subtitle & Action Pills */}
      <div className={styles.leftBox}>
        <div className={styles.sparkle} aria-hidden="true">
          <SparkleIcon />
        </div>
        <p className={styles.leftDescription}>
          Amravati&apos;s Flagship 15-Storey Tower featuring rooftop sky pool, tennis court &amp; bespoke residences.
        </p>
        <div className={styles.btnGroup}>
          <Link href="/about" className={styles.btnMore}>
            More About Us
          </Link>
        </div>
      </div>
    </section>
  );
}
