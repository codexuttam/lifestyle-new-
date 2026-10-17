import Link from "next/link";
import { getListingProjects } from "@/lib/content/projects";
import { getSettings } from "@/lib/content/settings";
import type { HomeRecord } from "@/lib/schemas/home";
import { whatsappHref } from "@/lib/schemas/settings";
import styles from "./AllProperties.module.css";

const ICON_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function BedIcon() {
  return (
    <svg {...ICON_PROPS} className={styles.specIcon}>
      <path d="M2 4v16" />
      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
      <path d="M2 17h20" />
      <path d="M6 8v9" />
    </svg>
  );
}

function BathIcon() {
  return (
    <svg {...ICON_PROPS} className={styles.specIcon}>
      <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
      <line x1="10" x2="8" y1="5" y2="7" />
      <line x1="2" x2="22" y1="12" y2="12" />
      <line x1="7" x2="7" y1="19" y2="21" />
      <line x1="17" x2="17" y1="19" y2="21" />
    </svg>
  );
}

function AreaIcon() {
  return (
    <svg {...ICON_PROPS} className={styles.specIcon}>
      <path d="M8 3H5a2 2 0 0 0-2 2v3" />
      <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
      <path d="M3 16v3a2 2 0 0 0 2 2h3" />
      <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg
      {...ICON_PROPS}
      width={16}
      height={16}
      className={styles.tourIcon}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

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
          <Link href="/projects" className={styles.viewAll}>
            {content.ctaLabel}
          </Link>
        </div>

        <div className={styles.cardsStack}>
          {listings.map((listing, i) => (
            <div
              className={styles.card}
              key={listing.id}
              style={{ top: 120 + i * 40, zIndex: 10 + i }}
            >
              <div className={styles.cardHeader}>
                <div className={styles.thumb}>
                  <img
                    src={listing.img}
                    alt={listing.title}
                    className={styles.thumbImg}
                  />
                </div>
                <div className={styles.headerText}>
                  <div className={styles.badgeRow}>
                    <span className={styles.categoryBadge}>{listing.category}</span>
                    <span className={styles.badge}>{listing.status}</span>
                  </div>
                  <Link
                    href={
                      listing.id === "lifestyle-homes"
                        ? "/projects/lifestyle-homes"
                        : listing.id === "aura"
                        ? "#floor-plans"
                        : "/projects"
                    }
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <h3 className={styles.cardTitle}>{listing.title}</h3>
                  </Link>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.specs}>
                <div className={styles.spec}>
                  <div className={styles.specLabel}>
                    <BedIcon />
                    <span>Beds</span>
                  </div>
                  <span className={styles.specValue}>{listing.beds}</span>
                </div>
                <div className={styles.spec}>
                  <div className={styles.specLabel}>
                    <BathIcon />
                    <span>Baths</span>
                  </div>
                  <span className={styles.specValue}>{listing.baths}</span>
                </div>
                <div className={styles.spec}>
                  <div className={styles.specLabel}>
                    <AreaIcon />
                    <span>Area</span>
                  </div>
                  <span className={styles.specValue}>{listing.area}</span>
                </div>
              </div>

              <div className={styles.divider} />

              <div className={styles.actionRow}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Price</span>
                  <span className={styles.price}>{listing.price}</span>
                </div>
                <a href={whatsappHref(settings)} className={styles.tourBtn}>
                  <CalendarIcon />
                  <span className={styles.tourText}>Schedule Tour</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.banner}>
        <img
          src="/aura/aura-hero-clean-4k.jpg"
          alt="Aura by Lifestyle 15-Storey Tower Showcase"
          className={styles.bannerVideo}
        />
      </div>
    </section>
  );
}
