"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./SiteNav.module.css";

const LIFESTYLE_MENU_ITEMS = [
  { label: "Overview", href: "#hero-section" },
  { label: "About", href: "#about-lifestyle-section" },
  { label: "Building 3D", href: "#explore-site-section" },
  { label: "Floor Plans", href: "#unit-plans" },
  { label: "Commercial", href: "#commercial-shops" },
  { label: "Specs", href: "#specifications" },
  { label: "Location", href: "#location-connectivity" },
  { label: "FAQ", href: "#faq-section" },
  { label: "Aura Flagship ↗", href: "/" },
];

const DEFAULT_MENU_ITEMS = [
  { label: "Aura (Flagship)", href: "/#hero-section" },
  { label: "About", href: "/#about-us-section" },
  { label: "Building 3D", href: "/#explore-site-section" },
  { label: "Floor Plans", href: "/#floor-plans" },
  { label: "Developments", href: "/#properties-section" },
  { label: "FAQ", href: "/#faq-section" },
  { label: "Lifestyle Homes", href: "/projects/lifestyle-homes" },
];

/** Luxury Dark Glassmorphism Nav with Smooth Scroll Interception across all pages */
export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isLifestylePage =
    pathname === "/projects/lifestyle-homes" ||
    pathname === "/projects/lifestyle" ||
    activeHref === "/projects/lifestyle-homes";

  const menuItems = isLifestylePage ? LIFESTYLE_MENU_ITEMS : DEFAULT_MENU_ITEMS;

  // Handle smooth scroll on cross-page and in-page navigation
  useEffect(() => {
    const handleHashScroll = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash;
        [100, 300, 600, 1000].forEach((delay) => {
          setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
              const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
              window.scrollTo({ top, behavior: "smooth" });
            }
          }, delay);
        });
      }
    };

    handleHashScroll();
    window.addEventListener("hashchange", handleHashScroll);
    return () => window.removeEventListener("hashchange", handleHashScroll);
  }, [pathname]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
        window.scrollTo({ top, behavior: "smooth" });
        history.pushState(null, "", href);
      }
      setMenuOpen(false);
    } else if (href.includes("#")) {
      const [pagePath, hash] = href.split("#");
      const isCurrentPage =
        pathname === pagePath ||
        (pagePath === "/" && (pathname === "/" || pathname === "")) ||
        (pagePath === "" && pathname === "/");

      if (isCurrentPage && hash) {
        e.preventDefault();
        const target = document.querySelector(`#${hash}`);
        if (target) {
          const top = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", `#${hash}`);
        }
        setMenuOpen(false);
      } else {
        // Cross-page navigation with hash
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <Link href="/" className={styles.logo} aria-label="Aura & Lifestyle — Home">
          <img
            src="/aura/aura-logo-official.png"
            alt="Aura & Lifestyle Emblem"
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
          {menuItems.map((item, idx) => {
            const isActive =
              isLifestylePage
                ? idx === 0
                : item.href === activeHref ||
                  (item.href === "/projects/lifestyle-homes" && isLifestylePage);

            const className = `${styles.menuItem}${isActive ? ` ${styles.menuItemActive}` : ""}`;

            return (
              <a
                key={item.label}
                href={item.href}
                className={className}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        <div className={styles.navActions}>
          <Link href="/contact" className={styles.btnContact}>
            Enquire Now
          </Link>

          <button
            className={styles.mobileToggle}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className={styles.mobileMenu}>
          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}
          <Link
            href="/contact"
            className={styles.mobileContactBtn}
            onClick={() => setMenuOpen(false)}
          >
            Enquire Now
          </Link>
        </div>
      )}
    </>
  );
}
