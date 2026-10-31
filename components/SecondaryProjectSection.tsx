import Image from "next/image";
import Link from "next/link";
import styles from "./SecondaryProjectSection.module.css";

export default function SecondaryProjectSection() {
  return (
    <section className={styles.section} id="developer" aria-label="Lifestyle Home Spaces">
      <div className={styles.grid}>
        {/* Left: Narrative & Facts */}
        <div className={styles.contentCol}>
          <span className={styles.sectionLabel}>THE DEVELOPER PORTFOLIO</span>
          <h2 className={styles.title}>LIFESTYLE HOME SPACES</h2>
          <p className={styles.desc}>
            Delivered on DPS Road, Amravati. A landmark mixed-use community executed by Lifestyle,
            combining residential comfort with prime commercial frontage.
          </p>

          <div className={styles.factsRow}>
            <div className={styles.factItem}>
              <span className={styles.factNum}>12</span>
              <span className={styles.factLabel}>3 BHK Residences</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factNum}>18</span>
              <span className={styles.factLabel}>2 BHK Residences</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factNum}>24</span>
              <span className={styles.factLabel}>Commercial Shops</span>
            </div>
            <div className={styles.factItem}>
              <span className={styles.factNum}>₹48L*</span>
              <span className={styles.factLabel}>Starting Price</span>
            </div>
          </div>

          <Link href="/projects/lifestyle-homes" className={styles.ctaBtn}>
            <span>EXPLORE PROJECT</span>
            <span className={styles.arrow}>→</span>
          </Link>
        </div>

        {/* Right: Project Photograph */}
        <div className={styles.imageWrap}>
          <Image
            src="/lifestyle/lifestyle-hero-clean.png"
            alt="Lifestyle Home Spaces Delivered Development"
            fill
            sizes="(max-width: 900px) 100vw, 600px"
            className={styles.image}
          />
        </div>
      </div>
    </section>
  );
}
