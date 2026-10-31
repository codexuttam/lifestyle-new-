import Link from "next/link";
import styles from "./OtherProjectsSection.module.css";

export default function OtherProjectsSection() {
  return (
    <section className={styles.section} id="other-projects">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>SECONDARY RESIDENTIAL PORTFOLIO</span>
          <h2 className={styles.heading}>
            MORE SPACES. <span>MORE POSSIBILITIES.</span>
          </h2>
          <p className={styles.sub}>
            Explore our secondary residential and commercial project in Amravati, developed by Lifestyle with the same uncompromising engineering standards.
          </p>
        </div>

        <div className={styles.projectCard}>
          <div className={styles.imageCol}>
            <img
              src="/aura/lifestyle-homes-real-hero.jpg"
              alt="Lifestyle Home Spaces Amravati"
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.scrim} />
            <span className={styles.tagBadge}>READY FOR POSSESSION</span>
          </div>

          <div className={styles.contentCol}>
            <div className={styles.brandBadge}>A PROJECT BY LIFESTYLE</div>
            <h3 className={styles.projectTitle}>Lifestyle Home Spaces</h3>
            <p className={styles.location}>
              <span className={styles.locationPin}>📍</span> DPS Road, Amravati, Maharashtra
            </p>
            <p className={styles.desc}>
              A completed boutique residential and commercial enclave offering premium 2 and 3 BHK homes alongside prime street-front commercial showrooms.
            </p>

            <div className={styles.specGrid}>
              <div className={styles.specItem}>
                <span className={styles.specNumber}>18</span>
                <span className={styles.specLabel}>2 BHK Residences</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specNumber}>12</span>
                <span className={styles.specLabel}>3 BHK Residences</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specNumber}>24</span>
                <span className={styles.specLabel}>Commercial Shops</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specNumber}>₹48L*</span>
                <span className={styles.specLabel}>Starting Price</span>
              </div>
            </div>

            <div className={styles.reraBadge}>
              <span className={styles.reraText}>
                MahaRERA Registered · Verified Documentation &amp; Approved Bank Loans
              </span>
            </div>

            <div className={styles.ctaRow}>
              <Link href="/projects/lifestyle-homes" className={styles.viewBtn}>
                View Project Details →
              </Link>
              <Link href="/contact" className={styles.enquireBtn}>
                Enquire On Inventory
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

