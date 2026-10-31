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

        {/* Right: Architectural Multi-Asset Composition (Editorial Gallery) */}
        <div className={styles.mediaCol}>
          {/* Column 1 */}
          <div className={styles.mediaSubCol}>
            <div className={styles.primaryImgWrap}>
              <Image
                src="/aura/exterior-elevation-day-hd.jpg"
                alt="Aura 15-Storey Tower Architecture, Camp Amravati"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className={styles.img}
              />
              <span className={styles.imgCaption}>15-Storey Facade</span>
            </div>
            <div className={styles.secondaryImgWrap}>
              <Image
                src="/aura/living-dining-suite-hd.jpg"
                alt="Aura Luxury Living and Dining Suite"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className={styles.img}
              />
              <span className={styles.imgCaption}>Living & Dining Suite</span>
            </div>
          </div>

          {/* Column 2 */}
          <div className={`${styles.mediaSubCol} ${styles.mediaSubColOffset}`}>
            <div className={styles.tertiaryImgWrap}>
              <Image
                src="/aura/rooftop-amenities-3d.jpg"
                alt="Aura Level 15 Sky Pool and Amenities Deck"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className={styles.img}
              />
              <span className={styles.imgCaption}>Level 15 Sky Oasis</span>
            </div>
            <div className={styles.quaternaryImgWrap}>
              <Image
                src="/aura/grand-entrance-lobby-hd.jpg"
                alt="Aura Grand Entrance Lobby & Arrival"
                fill
                sizes="(max-width: 640px) 100vw, 300px"
                className={styles.img}
              />
              <span className={styles.imgCaption}>Grand Entrance Foyer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
