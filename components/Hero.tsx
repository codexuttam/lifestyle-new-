"use client";

import Link from "next/link";
import { useState } from "react";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

const MENU_ITEMS = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/about", active: false },
  { label: "Projects", href: "/projects", active: false },
  { label: "Services", href: "/services", active: false },
  { label: "Review", href: "/#testimonial-section", active: false },
  { label: "Paint Visualizer", href: "/paint-visualizer", active: false },
];

function SparkleIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C12 2 12.5 8 13.5 10.5C16 11.5 22 12 22 12C22 12 16 12.5 13.5 15C12.5 17.5 12 22 12 22C12 22 11.5 17.5 10.5 15C8 12.5 2 12 2 12C2 12 8 11.5 10.5 10.5C11.5 8 12 2 12 2Z"
        fill="currentColor"
      />
      <path
        d="M12 6C12 6 12.3 9.3 13 11C14.7 11.7 18 12 18 12C18 12 14.7 12.3 13 14C12.3 15.7 12 19 12 19C12 19 11.7 15.7 11 14C9.3 12.3 6 12 6 12C6 12 9.3 11.7 11 11C11.7 9.3 12 6 12 6Z"
        fill="currentColor"
        transform="rotate(45 12 12)"
      />
    </svg>
  );
}

export default function Hero({ content }: { content: HomeRecord["hero"] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <section className={styles.hero} id="hero-section">
      {/* Sky video background */}
      <div className={styles.skyContainer}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.skyVideo}
          aria-hidden="true"
        >
          <source src={content.backgroundVideo} type="video/mp4" />
        </video>
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="The Premium Construction — home">
          <img
            src="/logo/logo-transparent.png"
            alt=""
            width={52}
            height={52}
            className={styles.logoImg}
          />
          {/* The badge's own lettering is unreadable at nav size, so the name
              is set alongside it as type. */}
          <span className={styles.logoLockup}>
            <span className={styles.logoName}>The Premium</span>
            <span className={styles.logoSub}>Construction</span>
          </span>
        </Link>

        <div className={styles.menuCapsule}>
          {MENU_ITEMS.map((item) => {
            const className = `${styles.menuItem}${item.active ? ` ${styles.menuItemActive}` : ""}`;
            // Anchors stay plain <a> so they scroll; routes go through Link.
            return item.href.includes("#") ? (
              <a key={item.label} href={item.href} className={className}>
                {item.label}
              </a>
            ) : (
              <Link key={item.label} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </div>

        <Link href="/contact" className={styles.btnContact}>
          Contact us
        </Link>

        <button
          className={styles.mobileToggle}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {MENU_ITEMS.map((item) =>
            item.href.includes("#") ? (
              <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          )}
          <Link href="/contact" onClick={() => setMenuOpen(false)}>
            Contact us
          </Link>
        </div>
      )}

      {/* Giant gradient headline */}
      <div className={styles.headlineContainer}>
        <h1 className={styles.headline}>{content.headline}</h1>
      </div>

      {/* Building image overlay */}
      <div className={styles.buildingContainer}>
        <img
          src={content.buildingImage}
          alt="Premium residential building"
          className={styles.buildingImage}
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Bottom-left content */}
      <div className={styles.leftBox}>
        <div className={styles.sparkle} aria-hidden="true">
          <SparkleIcon />
        </div>
        <p className={styles.leftDescription}>{content.description}</p>
        <Link href="/about" className={styles.btnMore}>
          {content.ctaLabel}
        </Link>
      </div>

      {/* Bottom-right glass info box */}
      <div className={styles.rightWrapper}>
        <div className={styles.infoBox}>
          <img
            src={content.infoImage}
            alt="Luxury estate close up"
            className={styles.infoImage}
            referrerPolicy="no-referrer"
          />
          <div className={styles.infoText}>
            <h2 className={styles.infoPrice}>{content.infoPrice}</h2>
            <p className={styles.infoDescription}>{content.infoCaption}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
