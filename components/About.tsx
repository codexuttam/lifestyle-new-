"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./About.module.css";
import type { HomeRecord } from "@/lib/schemas/home";

export default function About({ content }: { content?: HomeRecord["about"] }) {
  return (
    <section className={styles.about} id="about" aria-label="About Aura by Lifestyle">
      <div className={styles.grid}>
        {/* Left: Narrative Column */}
        <div className={styles.narrativeCol}>
          <span className={styles.sectionLabel}>ABOUT US</span>
          <h2 className={styles.title}>
            <span className={styles.swashInitial}>D</span>ESIGN WITH
            <br />
            INTENTION
          </h2>
          <p className={styles.bodyText}>
            At Aura by Lifestyle, we believe that highrise living is not just about how a space looks –
            it&apos;s about how it makes you feel. We approach each residence as a layered composition
            of natural light, cross-ventilation, and structural purpose, where architectural engineering
            meets quiet luxury.
          </p>
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
