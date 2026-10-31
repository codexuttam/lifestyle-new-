"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./SiteNav.module.css";
import AuthOtpModal from "@/components/AuthOtpModal";
import EnquiryModal from "@/components/EnquiryModal";
import { VerifiedUser } from "@/lib/types/auth";

interface NavLinkItem {
  label: string;
  href: string;
}

const DESKTOP_LINKS: NavLinkItem[] = [
  { label: "ABOUT US", href: "/#about" },
  { label: "THE TOWER", href: "/#tower-features" },
  { label: "FLOOR PLANS", href: "/#floor-plans" },
  { label: "LIFESTYLE HOMES", href: "/#developer" },
  { label: "JOURNAL", href: "/blogs" },
];

const MOBILE_LINKS: NavLinkItem[] = [
  { label: "Overview", href: "/#hero-section" },
  { label: "About Aura", href: "/#about" },
  { label: "15-Storey Tower", href: "/#tower-features" },
  { label: "Floor Plans", href: "/#floor-plans" },
  { label: "Lifestyle Home Spaces", href: "/#developer" },
  { label: "Journal & Updates", href: "/blogs" },
  { label: "Contact Studio", href: "/#contact-section" },
];

export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<VerifiedUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to verified user session & custom enquiry modal events
  useEffect(() => {
    const checkAuth = () => {
      try {
        const saved = localStorage.getItem("lifestyle_verified_user");
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        } else {
          setCurrentUser(null);
        }
      } catch {
        setCurrentUser(null);
      }
    };

    checkAuth();
    window.addEventListener("lifestyle_auth_changed", checkAuth);

    const handleOpenEnquiry = () => setIsEnquiryOpen(true);
    window.addEventListener("lifestyle_open_enquiry", handleOpenEnquiry);

    return () => {
      window.removeEventListener("lifestyle_auth_changed", checkAuth);
      window.removeEventListener("lifestyle_open_enquiry", handleOpenEnquiry);
    };
  }, []);

  // Click outside to close user dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
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
          const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
          window.scrollTo({ top, behavior: "smooth" });
          history.pushState(null, "", `#${hash}`);
        }
      }
      setMenuOpen(false);
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <header className={`${styles.nav}${scrolled ? ` ${styles.navScrolled}` : ""}`}>
        {/* Left: Minimal Editorial Brand Lockup with Both Aura & Lifestyle Logos */}
        <Link
          href="/"
          className={styles.brandLockup}
          aria-label="Aura by Lifestyle — Home"
          onClick={(e) => {
            if (pathname === "/") {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <Image
            src="/aura/aura-gold-logo-transparent.png"
            alt="Aura Logo"
            width={30}
            height={30}
            className={styles.auraLogoImg}
            priority
          />
          <div className={styles.brandNameWrap}>
            <span className={styles.brandName}>AURA</span>
            <span className={styles.brandDescriptor}>BY LIFESTYLE</span>
          </div>
          <div className={styles.brandDivider} />
          <Image
            src="/assets/brand/lifestyle-logo.png"
            alt="Lifestyle Developer Logo"
            width={24}
            height={24}
            className={styles.lifestyleLogoImg}
          />
        </Link>

        {/* Center: Minimal Section Links */}
        <nav className={styles.centerLinks} aria-label="Primary sections">
          {DESKTOP_LINKS.map((item) => {
            const isExact = pathname === item.href || activeHref === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navLink}${isExact ? ` ${styles.navLinkActive}` : ""}`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Contact & Action Buttons */}
        <div className={styles.rightActions}>
          <Link
            href="/#contact-section"
            className={styles.contactLink}
            onClick={(e) => handleNavClick(e, "/#contact-section")}
          >
            CONTACT
          </Link>

          <button
            type="button"
            className={styles.enquireBtn}
            onClick={() => setIsEnquiryOpen(true)}
            aria-label="Open project enquiry form"
          >
            ENQUIRE
          </button>

          {/* Member Profile or Sign In */}
          {currentUser ? (
            <div className={styles.userMenuWrapper} ref={userMenuRef}>
              <button
                type="button"
                className={styles.accountBtn}
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-label={`Member profile for ${currentUser.name || "Member"}`}
              >
                <span className={styles.userAvatar}>
                  {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                </span>
              </button>

              {userMenuOpen && (
                <div className={styles.userDropdownCard}>
                  <div className={styles.userMetaHeader}>
                    <div className={styles.userMetaAvatar}>
                      {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                    </div>
                    <div>
                      <div className={styles.userName}>{currentUser.name || "Member"}</div>
                      <div className={styles.userBadge}>✦ Verified Member</div>
                    </div>
                  </div>

                  <div className={styles.userDivider} />

                  <button
                    type="button"
                    className={styles.userActionBtn}
                    onClick={() => {
                      setUserMenuOpen(false);
                      setIsEnquiryOpen(true);
                    }}
                  >
                    <span>Schedule Private Visit</span>
                    <span>→</span>
                  </button>

                  <Link
                    href="/projects/lifestyle-homes"
                    className={styles.userActionBtn}
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <span>Lifestyle Home Spaces</span>
                    <span>→</span>
                  </Link>

                  <div className={styles.userDivider} />

                  <button
                    type="button"
                    className={`${styles.userActionBtn} ${styles.signOutBtn}`}
                    onClick={() => {
                      try {
                        localStorage.removeItem("lifestyle_verified_user");
                        setCurrentUser(null);
                        setUserMenuOpen(false);
                        window.dispatchEvent(new CustomEvent("lifestyle_auth_changed"));
                      } catch {}
                    }}
                  >
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className={styles.accountBtn}
              onClick={() => setIsAuthOpen(true)}
              aria-label="Member Sign In"
              title="Member Sign In"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}

          {/* Mobile Menu Toggle Hamburger */}
          <button
            type="button"
            className={styles.mobileToggle}
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.mobileBackdrop} onClick={() => setMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileMenuTop}>
              <div className={styles.brandLockup}>
                <Image
                  src="/aura/aura-gold-logo-transparent.png"
                  alt="Aura Logo"
                  width={26}
                  height={26}
                  className={styles.auraLogoImg}
                />
                <div className={styles.brandNameWrap}>
                  <span className={styles.brandName}>AURA</span>
                  <span className={styles.brandDescriptor}>BY LIFESTYLE</span>
                </div>
              </div>
              <button
                type="button"
                className={styles.mobileCloseBtn}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className={styles.mobileLinkList}>
              {MOBILE_LINKS.map((item, idx) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.mobileDrawerLink}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span>{item.label}</span>
                  <span className={styles.mobileDrawerIndex}>0{idx + 1}</span>
                </Link>
              ))}
            </div>

            <div className={styles.mobileDrawerActions}>
              <button
                type="button"
                className={styles.mobileEnquireFullBtn}
                onClick={() => {
                  setMenuOpen(false);
                  setIsEnquiryOpen(true);
                }}
              >
                Enquire Residences →
              </button>

              {!currentUser && (
                <button
                  type="button"
                  style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.2)",
                    color: "#F8F6F3",
                    padding: "11px",
                    borderRadius: "9999px",
                    fontFamily: "var(--font-sans)",
                    fontSize: "11px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                >
                  Member Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Auth OTP & Enquiry Modals */}
      <AuthOtpModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
        }}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
      />
    </>
  );
}
