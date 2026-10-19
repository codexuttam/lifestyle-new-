"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { ProjectRecord } from "@/lib/schemas/project";
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

interface AllPropertiesStackProps {
  listings: ProjectRecord[];
  whatsappUrl: string;
}

export default function AllPropertiesStack({
  listings,
  whatsappUrl,
}: AllPropertiesStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // ScrollTrigger refresh on mount to ensure accurate sticky calculation
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.refresh();
  }, [listings]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--glow-op", "1");
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
    card.style.setProperty("--glow-op", "0");
  };

  return (
    <div className={styles.cardsStack} ref={containerRef}>
      {listings.map((listing, i) => (
        <div
          className={styles.card}
          key={listing.id}
          ref={(el) => {
            cardRefs.current[i] = el;
          }}
          style={{
            top: 105 + i * 35,
            zIndex: 10 + i,
          }}
          data-card-index={i}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
        >
          {/* Dynamic Mouse Spotlight Glow */}
          <div className={styles.cardSpotlight} aria-hidden="true" />
          <div className={styles.cardBorderGlow} aria-hidden="true" />

          <div className={styles.cardHeader}>
            <div className={styles.thumb}>
              {listing.id === "aura" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.thumbImg}
                  aria-hidden="true"
                >
                  <source src="/videos/aura-showcase-clip.mp4" type="video/mp4" />
                </video>
              ) : listing.id === "lifestyle-homes" ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.thumbImg}
                  aria-hidden="true"
                >
                  <source src="/videos/lifestyle-showcase-clip.mp4" type="video/mp4" />
                </video>
              ) : listing.video ? (
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className={styles.thumbImg}
                  aria-hidden="true"
                >
                  <source src={listing.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={listing.img}
                  alt={listing.title}
                  className={styles.thumbImg}
                />
              )}
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
                    : listing.id === "lifestyle-retail-galleria"
                    ? "/projects/lifestyle-homes#commercial-shops"
                    : listing.id === "aura"
                    ? "#floor-plans"
                    : "/projects"
                }
                className={styles.cardTitleLink}
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
              <span className={styles.priceLabel}>Location</span>
              <span className={styles.price}>{listing.location}</span>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.tourBtn}
            >
              <CalendarIcon />
              <span className={styles.tourText}>Schedule Tour</span>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
