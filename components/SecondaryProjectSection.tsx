"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./SecondaryProjectSection.module.css";

export default function SecondaryProjectSection() {
  const [activeTab, setActiveTab] = useState<"residences" | "commercial">("residences");

  return (
    <section className={styles.section} id="developer" aria-label="Lifestyle Home Spaces">
      <div className={styles.grid}>
        {/* Left: Narrative & Facts */}
        <div className={styles.contentCol}>
          <span className={styles.sectionLabel}>DEVELOPER PORTFOLIO</span>
          <h2 className={styles.title}>
            LIFESTYLE <span className={styles.swashInitial}>H</span>OME SPACES
          </h2>
          <p className={styles.desc}>
            Delivered on DPS Road, Amravati. A landmark mixed-use community executed by Lifestyle,
            combining residential comfort with prime commercial frontage.
          </p>

          {/* Interactive Toggle */}
          <div className={styles.toggleRow} role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "residences"}
              className={`${styles.toggleBtn} ${activeTab === "residences" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveTab("residences")}
            >
              Residential Suites (30)
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === "commercial"}
              className={`${styles.toggleBtn} ${activeTab === "commercial" ? styles.toggleBtnActive : ""}`}
              onClick={() => setActiveTab("commercial")}
            >
              Commercial Shops (24)
            </button>
          </div>

          <div className={styles.factsGrid}>
            {activeTab === "residences" ? (
              <>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>12</span>
                  <span className={styles.factLabel}>3 BHK Residences</span>
                </div>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>18</span>
                  <span className={styles.factLabel}>2 BHK Residences</span>
                </div>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>₹48L*</span>
                  <span className={styles.factLabel}>Starting Price</span>
                </div>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>RERA</span>
                  <span className={styles.factLabel}>P50300054447</span>
                </div>
              </>
            ) : (
              <>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>24</span>
                  <span className={styles.factLabel}>High-Street Shops</span>
                </div>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>DPS Rd</span>
                  <span className={styles.factLabel}>Prime Frontage</span>
                </div>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>Ready</span>
                  <span className={styles.factLabel}>Immediate Possession</span>
                </div>
                <div className={styles.factItem}>
                  <span className={styles.factNum}>Footfall</span>
                  <span className={styles.factLabel}>High-Density Catchment</span>
                </div>
              </>
            )}
          </div>

          <Link href="/projects/lifestyle-homes" className={styles.ctaBtn}>
            <span>VIEW LIFESTYLE HOME SPACES</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </div>

        {/* Right: Project Photograph */}
        <div className={styles.imageWrap}>
          <Image
            src={
              activeTab === "residences"
                ? "/assets/projects/lifestyle-homes/building/lifestyle-hero-clean-4k.jpg"
                : "/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg"
            }
            alt="Lifestyle Home Spaces Delivered Landmark, DPS Road Amravati"
            fill
            sizes="(max-width: 900px) 100vw, 600px"
            className={styles.image}
          />
          <div className={styles.imageCaption}>
            <span>DPS Road, Amravati · Delivered</span>
            <span>MahaRERA: P50300054447</span>
          </div>
        </div>
      </div>
    </section>
  );
}

