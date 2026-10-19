import Link from "next/link";
import { getListingProjects } from "@/lib/content/projects";
import { getSettings } from "@/lib/content/settings";
import type { HomeRecord } from "@/lib/schemas/home";
import { whatsappHref } from "@/lib/schemas/settings";
import AllPropertiesStack from "./AllPropertiesStack";
import styles from "./AllProperties.module.css";

export default async function AllProperties({
  content,
}: {
  content: HomeRecord["allProperties"];
}) {
  const [listings, settings] = await Promise.all([
    getListingProjects(),
    getSettings(),
  ]);

  return (
    <section className={styles.section} id="properties-all-show-section">
      <div className={styles.grid}>
        <div className={styles.leftCol}>
          <div className={styles.label}>
            <span className={styles.dot} aria-hidden="true" />
            <span className={styles.labelText}>{content.label}</span>
          </div>
          <h2 className={styles.heading}>{content.heading}</h2>
          <p className={styles.subheading}>
            Discover signature luxury highrise residences and delivered landmarks crafted with precision across Amravati.
          </p>
          <Link href="/projects" className={styles.viewAll}>
            {content.ctaLabel}
          </Link>
        </div>

        {/* Dynamic Card Stacking Showcase */}
        <AllPropertiesStack
          listings={listings}
          whatsappUrl={whatsappHref(settings)}
        />
      </div>

      {/* Cinematic Showcase Video Banner */}
      <div className={styles.bannerWrapper}>
        <div className={styles.banner}>
          <video
            autoPlay
            loop
            muted
            playsInline
            className={styles.bannerVideo}
            aria-hidden="true"
          >
            <source src="/videos/aura-showcase-clip.mp4" type="video/mp4" />
          </video>
          <div className={styles.bannerOverlay}>
            <div className={styles.bannerContent}>
              <span className={styles.bannerBadge}>
                <i className="fa-solid fa-play" /> CINEMATIC TOUR
              </span>
              <h3 className={styles.bannerTitle}>
                Crafted For Those Who Expect Nothing Less Than Extraordinary
              </h3>
              <p className={styles.bannerDesc}>
                Step inside our vision of elevated living in Amravati — Aura by Lifestyle 15-Storey Tower.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
