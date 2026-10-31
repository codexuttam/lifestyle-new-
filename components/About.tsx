"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";
import AnimatedCounter from "@/components/AnimatedCounter";
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

          {/* Dynamic Animated Metric Counters */}
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>
                <AnimatedCounter target={15} duration={1400} />
              </span>
              <span className={styles.statLabel}>Storeys High</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>
                <AnimatedCounter target={100} suffix="%" duration={1600} />
              </span>
              <span className={styles.statLabel}>Vastu Aligned</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>
                <AnimatedCounter target={20} suffix="+" duration={1500} />
              </span>
              <span className={styles.statLabel}>Sky Amenities</span>
            </div>
            <div className={styles.statBox}>
              <span className={styles.statNumber}>0</span>
              <span className={styles.statLabel}>Shared Walls</span>
            </div>
          </div>

          <Link href="#tower-features" className={styles.learnMoreBtn}>
            <span>EXPLORE THE TOWER</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </div>

        {/* Right: Asymmetric Image Composition with Subtle Overlap */}
        <div className={styles.mediaCol}>
          <div className={styles.primaryImgWrap}>
            <Image
              src="/aura/building-full-4k.jpg"
              alt="Aura 15-Storey Tower Architecture, Camp Amravati"
              fill
              sizes="(max-width: 640px) 100vw, 360px"
              className={styles.img}
            />
          </div>
          <div className={styles.secondaryImgWrap}>
            <Image
              src="/aura/sky-balcony-lifestyle.jpg"
              alt="Aura Private Sit-out Balcony with Sunset Views"
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              className={styles.img}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
