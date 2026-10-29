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
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.leftCol}>
            <h2 className={styles.heading}>{content.heading}</h2>
            <p className={styles.subheading}>
              Scroll through our signature Amravati developments — featuring live architectural walkthroughs, verified MahaRERA specifications, and instant private tour booking.
            </p>
            <Link href="/projects" className={`${styles.viewAll} roll-button`}>
              <span className="roll-text" data-text={`${content.ctaLabel} →`}>
                {content.ctaLabel} →
              </span>
            </Link>
          </div>

          {/* Sticky 3D Tilt-Glow Dynamic Card Stacking Showcase */}
          <AllPropertiesStack
            listings={listings}
            whatsappUrl={whatsappHref(settings)}
          />
        </div>

        {/* Cinematic Showcase Video Banner */}
        <div className={styles.bannerWrapper}>
          <div className={styles.banner}>
            <video
              src="/videos/aura-showcase-clip.mp4"
              poster="/aura/aura-hero-clean-4k.jpg"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className={styles.bannerVideo}
              aria-hidden="true"
            />
            <div className={styles.bannerOverlay}>
              <div className={styles.bannerContent}>
                <h3 className={styles.bannerTitle}>
                  CRAFTED FOR THOSE WHO EXPECT BENCHMARK LIVING IN AMRAVATI
                </h3>
                <p className={styles.bannerDesc}>
                  Experience Aura by Lifestyle at Congress Nagar, Camp alongside our 100% delivered Lifestyle Home Spaces landmark on DPS Road.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
