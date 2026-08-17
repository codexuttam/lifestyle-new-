"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./Hero.module.css";

const MENU_ITEMS = [
  { label: "Home", href: "/", active: true },
  { label: "About", href: "/#about-us-section", active: false },
  { label: "Properties", href: "/#properties-section", active: false },
  { label: "Services", href: "/#services-section", active: false },
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

export default function Hero() {
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
          <source
            src="https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Header%20Bg%20Video%20Final.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Navbar */}
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="The Premium Construction — home">
          <img
            src="/logo/logo-transparent.png"
            alt="The Premium Construction"
            width={52}
            height={52}
            className={styles.logoImg}
          />
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

        <a href="https://wa.me/916398792951" className={styles.btnContact}>
          Contact us
        </a>

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
          <a href="https://wa.me/916398792951" onClick={() => setMenuOpen(false)}>
            Contact us
          </a>
        </div>
      )}

      {/* Giant gradient headline */}
      <div className={styles.headlineContainer}>
        <h1 className={styles.headline}>Dream Home</h1>
      </div>

      {/* Building image overlay */}
      <div className={styles.buildingContainer}>
        <img
          src="https://cdn.jiro.build/Real%20Estate%20-%20Ospey/Imges/Front%20Image.png"
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
        <p className={styles.leftDescription}>
          Delivering excellence with every project, ensuring trust and
          satisfaction.
        </p>
        <a href="/#about-us-section" className={styles.btnMore}>
          More About Us
        </a>
      </div>

      {/* Bottom-right glass info box */}
      <div className={styles.rightWrapper}>
        <div className={styles.infoBox}>
          <img
            src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=310&h=300&q=80"
            alt="Luxury estate close up"
            className={styles.infoImage}
            referrerPolicy="no-referrer"
          />
          <div className={styles.infoText}>
            <h2 className={styles.infoPrice}>&#8377;1.95 Cr</h2>
            <p className={styles.infoDescription}>
              Signature homes starting here — built across Delhi NCR.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
