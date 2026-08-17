"use client";

import Link from "next/link";
import { useState } from "react";
import styles from "./SiteNav.module.css";

const MENU_ITEMS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about-us-section" },
  { label: "Properties", href: "/#properties-section" },
  { label: "Services", href: "/#services-section" },
  { label: "Review", href: "/#testimonial-section" },
  { label: "Paint Visualizer", href: "/paint-visualizer" },
];

/** Nav for interior pages, where there is no hero video to sit over. */
export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="The Premium Construction — home">
          <img
            src="/logo/logo-transparent.png"
            alt=""
            width={48}
            height={48}
            className={styles.logoImg}
          />
          <span className={styles.logoLockup}>
            <span className={styles.logoName}>The Premium</span>
            <span className={styles.logoSub}>Construction</span>
          </span>
        </Link>

        <div className={styles.menuCapsule}>
          {MENU_ITEMS.map((item) => {
            const className = `${styles.menuItem}${
              item.href === activeHref ? ` ${styles.menuItemActive}` : ""
            }`;
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
    </>
  );
}
