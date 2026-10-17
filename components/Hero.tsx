"use client";

import Link from "next/link";
import { useState } from "react";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

const MENU_ITEMS = [
  { label: "Aura Overview", href: "/", active: true },
  { label: "Floor Plans", href: "/#floor-plans", active: false },
  { label: "Sky Amenities", href: "#explore-site-section", active: false },
  { label: "Architecture", href: "/services", active: false },
  { label: "All Projects", href: "/projects", active: false },
  { label: "About", href: "/about", active: false },
];

function SparkleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
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
      {/* 4K Clean Building Background Image */}
      <div className={styles.buildingContainer}>
        <img
          src="/aura/aura-hero-clean-4k.jpg"
          alt="Aura by Lifestyle 15-Storey Tower in 4K"
          className={styles.buildingImage}
          referrerPolicy="no-referrer"
        />
        <div className={styles.heroOverlay} />
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="Aura by Lifestyle — Home">
          <img
            src="/aura/aura-logo-official.png"
            alt="Aura Emblem"
            width={46}
            height={46}
            className={styles.logoImg}
          />
          <span className={styles.logoLockup}>
            <span className={styles.logoName}>AURA</span>
            <span className={styles.logoSub}>BY LIFESTYLE</span>
          </span>
        </Link>

        <div className={styles.menuCapsule}>
          {MENU_ITEMS.map((item) => {
            const className = `${styles.menuItem}${item.active ? ` ${styles.menuItemActive}` : ""}`;
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

        <div className={styles.navActions}>
          <Link href="/contact" className={styles.btnContact}>
            Enquire Now
          </Link>
        </div>

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
          <Link href="/contact" onClick={() => setMenuOpen(false)} className={styles.mobileHighlightLink}>
            Enquire Now
          </Link>
        </div>
      )}

      {/* Giant Headline */}
      <div className={styles.headlineContainer}>
        <h1 className={styles.headline}>AURA</h1>
      </div>

      {/* Bottom-left content */}
      <div className={styles.leftBox}>
        <div className={styles.sparkle} aria-hidden="true">
          <SparkleIcon />
        </div>
        <p className={styles.leftDescription}>{content.description}</p>
        <div className={styles.btnRow}>
          <a href="#floor-plans" className={styles.btnMore}>
            {content.ctaLabel}
          </a>
          <Link href="/contact" className={styles.btnOtherProject}>
            Book Private Tour →
          </Link>
        </div>
      </div>
    </section>
  );
}
