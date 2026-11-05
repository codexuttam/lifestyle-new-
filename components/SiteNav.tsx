"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./SiteNav.module.css";
import AuthOtpModal from "@/components/AuthOtpModal";
import EnquiryModal from "@/components/EnquiryModal";
import MobileConciergeBar from "@/components/MobileConciergeBar";
import { VerifiedUser } from "@/lib/types/auth";

interface NavLinkItem {
  label: string;
  href: string;
}

const AURA_DESKTOP_LINKS: NavLinkItem[] = [
  { label: "ABOUT US", href: "/#about" },
  { label: "THE TOWER", href: "/#tower-features" },
  { label: "FLOOR PLANS", href: "/#floor-plans" },
  { label: "LIFESTYLE HOMES", href: "/projects/lifestyle-homes" },
  { label: "JOURNAL", href: "/blogs" },
];

const LIFESTYLE_DESKTOP_LINKS: NavLinkItem[] = [
  { label: "OVERVIEW", href: "/projects/lifestyle-homes#hero-section" },
  { label: "RESIDENCES", href: "/projects/lifestyle-homes#residences" },
  { label: "SHOWROOMS", href: "/projects/lifestyle-homes#commercial" },
  { label: "AURA (FLAGSHIP)", href: "/" },
  { label: "JOURNAL", href: "/blogs" },
];

const AURA_MOBILE_LINKS: NavLinkItem[] = [
  { label: "Overview", href: "/#hero-section" },
  { label: "About Aura", href: "/#about" },
  { label: "15-Storey Tower", href: "/#tower-features" },
  { label: "Floor Plans", href: "/#floor-plans" },
  { label: "Lifestyle Home Spaces", href: "/projects/lifestyle-homes" },
  { label: "Journal & Updates", href: "/blogs" },
];

const LIFESTYLE_MOBILE_LINKS: NavLinkItem[] = [
  { label: "Overview", href: "/projects/lifestyle-homes#hero-section" },
  { label: "Residential Suites", href: "/projects/lifestyle-homes#residences" },
  { label: "Commercial Showrooms", href: "/projects/lifestyle-homes#commercial" },
  { label: "Aura Flagship", href: "/" },
  { label: "Journal & Updates", href: "/blogs" },
];

export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquiryOverride, setEnquiryOverride] = useState<{
    project?: string;
    preference?: string;
    source?: string;
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<VerifiedUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const hasConvertedRef = useRef(false);
  const tenSecTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();

  const isLifestylePage =
    pathname === "/projects/lifestyle-homes" ||
    pathname === "/projects/lifestyle" ||
    activeHref === "/projects/lifestyle-homes";

  const desktopLinks = isLifestylePage ? LIFESTYLE_DESKTOP_LINKS : AURA_DESKTOP_LINKS;
  const mobileLinks = isLifestylePage ? LIFESTYLE_MOBILE_LINKS : AURA_MOBILE_LINKS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Listen to verified user session & custom modal trigger events
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

    const handleOpenEnquiry = (e?: Event) => {
      const custom = e as CustomEvent<{ project?: string; preference?: string; source?: string }>;
      if (custom?.detail) {
        setEnquiryOverride(custom.detail);
      }
      setIsEnquiryOpen(true);
    };
    window.addEventListener("lifestyle_open_enquiry", handleOpenEnquiry);

    const handleOpenAuth = () => setIsAuthOpen(true);
    window.addEventListener("lifestyle_open_auth", handleOpenAuth);

    return () => {
      window.removeEventListener("lifestyle_auth_changed", checkAuth);
      window.removeEventListener("lifestyle_open_enquiry", handleOpenEnquiry);
      window.removeEventListener("lifestyle_open_auth", handleOpenAuth);
    };
  }, []);

  // Desktop exit-intent trigger: offers 4K VIP floor kit before visitor leaves
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 15) {
        try {
          const isVerified = Boolean(localStorage.getItem("lifestyle_verified_user"));
          const isSubmitted = Boolean(localStorage.getItem("lifestyle_lead_submitted"));
          const exitTriggered = sessionStorage.getItem("lifestyle_exit_intent_shown");

          if (!isVerified && !isSubmitted && !exitTriggered && !hasConvertedRef.current) {
            sessionStorage.setItem("lifestyle_exit_intent_shown", "1");
            setEnquiryOverride({
              project: isLifestylePage ? "Lifestyle Home Spaces" : "Aura by Lifestyle",
              preference: "Exit Intent - VIP 4K Floor Kit & Pricing Sheet",
              source: "Desktop Exit Intent Modal",
            });
            setIsEnquiryOpen(true);
          }
        } catch {}
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isLifestylePage]);

  // Auto-render contact form on site entry (Aura & Lifestyle pages)
  // When rejected/closed, if user stays on site for 10s, auto-render sign-in form
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTargetPage =
      pathname === "/" ||
      pathname === "/projects/lifestyle-homes" ||
      pathname === "/projects/lifestyle" ||
      !pathname;

    if (!isTargetPage) return;

    try {
      const isVerified = Boolean(localStorage.getItem("lifestyle_verified_user"));
      if (isVerified) return;

      const pageKey = pathname?.includes("lifestyle") ? "lifestyle" : "aura";
      const sessionSeenKey = `lifestyle_auto_enquiry_shown_${pageKey}`;
      if (sessionStorage.getItem(sessionSeenKey)) return;

      const initialTimer = setTimeout(() => {
        setIsEnquiryOpen(true);
        try {
          sessionStorage.setItem(sessionSeenKey, "1");
        } catch {}
      }, 1000);

      return () => clearTimeout(initialTimer);
    } catch {}
  }, [pathname]);

  // Clean up 10s timer on unmount
  useEffect(() => {
    return () => {
      if (tenSecTimerRef.current) {
        clearTimeout(tenSecTimerRef.current);
      }
    };
  }, []);

  const handleEnquirySubmitted = () => {
    hasConvertedRef.current = true;
    if (tenSecTimerRef.current) {
      clearTimeout(tenSecTimerRef.current);
      tenSecTimerRef.current = null;
    }
  };

  const handleCloseEnquiry = () => {
    setIsEnquiryOpen(false);

    try {
      const isVerified = Boolean(localStorage.getItem("lifestyle_verified_user"));
      const isSubmitted = Boolean(localStorage.getItem("lifestyle_lead_submitted"));

      if (!isVerified && !isSubmitted && !hasConvertedRef.current) {
        if (tenSecTimerRef.current) {
          clearTimeout(tenSecTimerRef.current);
        }
        // User rejected/closed contact form: wait 10s while staying on site, then show sign-in form
        tenSecTimerRef.current = setTimeout(() => {
          const currentVerified = Boolean(localStorage.getItem("lifestyle_verified_user"));
          const currentSubmitted = Boolean(localStorage.getItem("lifestyle_lead_submitted"));
          if (!currentVerified && !currentSubmitted && !hasConvertedRef.current) {
            setIsAuthOpen(true);
          }
        }, 10000);
      }
    } catch {}
  };

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
      const normPath = (pathname || "").replace(/\/$/, "") || "/";
      const normTarget = (pagePath || "").replace(/\/$/, "") || "/";
      const isCurrentPage = normPath === normTarget;

      if (isCurrentPage && hash) {
        e.preventDefault();
        const target =
          document.querySelector(`#${hash}`) ||
          (hash === "residences" ? document.querySelector("#unit-plans, #explore-site-section, #explore-lifestyle-section") : null) ||
          (hash === "commercial" || hash === "showrooms" ? document.querySelector("#commercial-shops, #commercial, #showrooms") : null);

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
        {/* Left: Dedicated Brand Logo — Only Aura on Aura page, Only Lifestyle on Lifestyle page */}
        {isLifestylePage ? (
          <Link
            href="/projects/lifestyle-homes"
            className={styles.brandLockup}
            aria-label="Lifestyle Home Spaces"
          >
            <Image
              src="/assets/brand/lifestyle-logo.png"
              alt="Lifestyle Logo"
              width={28}
              height={28}
              className={styles.lifestyleLogoOnly}
              priority
            />
            <div className={styles.brandNameWrap}>
              <span className={styles.brandName}>LIFESTYLE</span>
              <span className={styles.brandDescriptor}>HOME SPACES</span>
            </div>
          </Link>
        ) : (
          <Link
            href="/"
            className={styles.brandLockup}
            aria-label="Aura by Lifestyle"
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
              width={32}
              height={32}
              className={styles.auraLogoImg}
              priority
            />
            <div className={styles.brandNameWrap}>
              <span className={styles.brandName}>AURA</span>
              <span className={styles.brandDescriptor}>BY LIFESTYLE</span>
            </div>
          </Link>
        )}

        {/* Center: Minimal Section Links */}
        <nav className={styles.centerLinks} aria-label="Primary sections">
          {desktopLinks.map((item) => {
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
          <div className={styles.contactWrapper} ref={userMenuRef}>
            <button
              type="button"
              className={styles.contactLink}
              onClick={() => {
                if (currentUser) {
                  setUserMenuOpen((prev) => !prev);
                } else {
                  setEnquiryOverride({
                    preference: "Get Brochure on WhatsApp",
                    source: "Header Contact Button",
                  });
                  setIsEnquiryOpen(true);
                }
              }}
              aria-label="Contact Studio & Sales Desk"
            >
              CONTACT
            </button>

            {currentUser && userMenuOpen && (
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

          <button
            type="button"
            className={styles.enquireBtn}
            onClick={() => {
              setEnquiryOverride({
                preference: "Get Brochure on WhatsApp",
                source: "Header Enquire Button",
              });
              setIsEnquiryOpen(true);
            }}
            aria-label="Get Brochure on WhatsApp"
          >
            ENQUIRE
          </button>

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
                {isLifestylePage ? (
                  <>
                    <Image
                      src="/assets/brand/lifestyle-logo.png"
                      alt="Lifestyle Logo"
                      width={24}
                      height={24}
                      className={styles.lifestyleLogoOnly}
                    />
                    <div className={styles.brandNameWrap}>
                      <span className={styles.brandName}>LIFESTYLE</span>
                      <span className={styles.brandDescriptor}>HOME SPACES</span>
                    </div>
                  </>
                ) : (
                  <>
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
                  </>
                )}
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
              {mobileLinks.map((item, idx) => (
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
                  setEnquiryOverride({
                    preference: "Get Brochure on WhatsApp",
                    source: "Mobile Drawer Enquire Button",
                  });
                  setIsEnquiryOpen(true);
                }}
              >
                Get Brochure on WhatsApp →
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
          hasConvertedRef.current = true;
          if (tenSecTimerRef.current) {
            clearTimeout(tenSecTimerRef.current);
            tenSecTimerRef.current = null;
          }
        }}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleCloseEnquiry}
        onSubmitted={handleEnquirySubmitted}
        projectTitle={enquiryOverride?.project || (isLifestylePage ? "Lifestyle Home Spaces" : "Aura by Lifestyle")}
        defaultPreference={enquiryOverride?.preference || "Get Brochure on WhatsApp"}
        source={enquiryOverride?.source || (isLifestylePage ? "Lifestyle Homes Page Form" : "Aura Page Form")}
      />

      {/* Floating Sticky Mobile Concierge Bar */}
      <MobileConciergeBar />
    </>
  );
}
