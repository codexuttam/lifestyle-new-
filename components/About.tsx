"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";
import type { HomeRecord } from "@/lib/schemas/home";

export default function About({ content }: { content?: HomeRecord["about"] }) {
  return (
    <section className={styles.about} id="about" aria-label="About Aura by Lifestyle">
      <div className={styles.grid}>
        {/* Left: Narrative Column with Rich Content */}
        <div className={styles.narrativeCol}>
          <span className={styles.sectionLabel}>ABOUT US</span>
          <h2 className={styles.title}>
            <span className={styles.swashInitial}>D</span>ESIGN WITH
            <br />
            INTENTION
          </h2>
          <p className={styles.bodyText}>
            At Aura by Lifestyle, we believe that highrise residential living is not just about how a space looks –
            it&apos;s about how it makes you feel. Located next to Dreamz Signature on Congress Nagar Road, Camp,
            Aura brings together 15 soaring storeys of contemporary architecture, 5 minutes from top hospitals,
            premier colleges, and Amravati Railway Station.
          </p>

          {/* Genuine Verified Project Metric Chips */}
          <div className={styles.metricsRow}>
            <span className={styles.metricChip}>15 Storeys</span>
            <span className={styles.metricChip}>2 &amp; 3 BHK Suites</span>
            <span className={styles.metricChip}>Zero Shared Walls</span>
            <span className={styles.metricChip}>Level 15 Sky Oasis</span>
            <span className={styles.metricChip}>MahaRERA Registered</span>
          </div>

          <Link href="#portfolio" className={styles.learnMoreBtn}>
            <span>LEARN MORE</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </div>

        {/* Right: Asymmetric Image Composition */}
        <div className={styles.mediaCol}>
          <div className={styles.primaryImgWrap}>
            <Image
              src="/aura/building-full-4k.jpg"
              alt="Aura 15-Storey Tower Architecture"
              fill
              sizes="(max-width: 640px) 100vw, 300px"
              className={styles.img}
            />
          </div>
          <div className={styles.secondaryImgWrap}>
            <Image
              src="/aura/sky-balcony-lifestyle.jpg"
              alt="Aura Private Sit-out Balcony"
              fill
              sizes="(max-width: 640px) 100vw, 220px"
              className={styles.img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
