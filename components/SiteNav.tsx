"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import styles from "./SiteNav.module.css";
import AuthOtpModal from "@/components/AuthOtpModal";
import EnquiryModal from "@/components/EnquiryModal";
import { VerifiedUser } from "@/lib/types/auth";

export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<VerifiedUser | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("lifestyle_verified_user");
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {}

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<VerifiedUser>;
      if (custom.detail) setCurrentUser(custom.detail);
    };

    window.addEventListener("lifestyle_auth_changed", handleAuthChange);
    return () => window.removeEventListener("lifestyle_auth_changed", handleAuthChange);
  }, []);

  return (
    <>
      <header className={styles.nav}>
        {/* Left: Brand Identity */}
        <Link href="/" className={styles.brand} aria-label="Aura by Lifestyle">
          <span className={styles.brandAura}>AURA</span>
          <span className={styles.brandDescriptor}>BY LIFESTYLE</span>
        </Link>

        {/* Center: Minimalist Editorial Navigation */}
        <nav className={styles.centerLinks} aria-label="Main Navigation">
          <Link href="/#about" className={styles.navItem}>
            ABOUT US
          </Link>
          <Link href="/#portfolio" className={styles.navItem}>
            PORTFOLIO
          </Link>
          <Link href="/#services" className={styles.navItem}>
            SERVICES
          </Link>
          <Link href="/blogs" className={styles.navItem}>
            JOURNAL
          </Link>
        </nav>

        {/* Right: Contact & Access */}
        <div className={styles.rightActions}>
          <Link href="/#contact" className={styles.contactLink}>
            CONTACT
          </Link>
          {currentUser ? (
            <button
              type="button"
              className={styles.userTrigger}
              onClick={() => setIsAuthOpen(true)}
              title={currentUser.name || "My Profile"}
              aria-label="Account Settings"
            >
              <i className="fa-regular fa-user" />
            </button>
          ) : (
            <button
              type="button"
              className={styles.userTrigger}
              onClick={() => setIsAuthOpen(true)}
              title="Sign In"
              aria-label="Sign In"
            >
              <i className="fa-regular fa-user" />
            </button>
          )}

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={styles.mobileToggle}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
          >
            <i className={`fa-solid ${menuOpen ? "fa-xmark" : "fa-bars"}`} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileDrawer} role="dialog" aria-modal="true">
          <button
            type="button"
            className={styles.mobileDrawerClose}
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
          <Link href="/" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            HOME
          </Link>
          <Link href="/#about" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            ABOUT US
          </Link>
          <Link href="/#portfolio" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            PORTFOLIO
          </Link>
          <Link href="/#services" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            SERVICES
          </Link>
          <Link href="/projects/lifestyle-homes" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            LIFESTYLE HOME SPACES
          </Link>
          <Link href="/blogs" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            JOURNAL
          </Link>
          <Link href="/#contact" className={styles.mobileDrawerLink} onClick={() => setMenuOpen(false)}>
            CONTACT
          </Link>
        </div>
      )}

      {/* Auth Modal */}
      <AuthOtpModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          setIsAuthOpen(false);
        }}
      />

      {/* VIP Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference="2 & 3 BHK Luxury Residences"
        source="Navigation"
      />
    </>
  );
}
