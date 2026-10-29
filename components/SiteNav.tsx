"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./SiteNav.module.css";
import AuthOtpModal from "@/components/AuthOtpModal";
import EnquiryModal from "@/components/EnquiryModal";
import { VerifiedUser } from "@/lib/types/auth";

const LIFESTYLE_DESKTOP_LINKS = [
  { label: "Floor Plans", href: "/projects/lifestyle-homes#unit-plans" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
];

const DEFAULT_DESKTOP_LINKS = [
  { label: "Floor Plans", href: "/#floor-plans" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
];

const LIFESTYLE_MOBILE_LINKS = [
  { label: "Overview", href: "/projects/lifestyle-homes#hero-section" },
  { label: "Floor Plans", href: "/projects/lifestyle-homes#unit-plans" },
  { label: "Showrooms", href: "/projects/lifestyle-homes#commercial-shops" },
  { label: "Specifications", href: "/projects/lifestyle-homes#specifications" },
  { label: "All Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
];

const DEFAULT_MOBILE_LINKS = [
  { label: "Overview", href: "/#hero-section" },
  { label: "Explore", href: "/#explore-site-section" },
  { label: "Floor Plans", href: "/#floor-plans" },
  { label: "Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
];

let hasDismissedLoginThisLoad = false;

export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<VerifiedUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();

  const isLifestylePage =
    pathname === "/projects/lifestyle-homes" ||
    pathname === "/projects/lifestyle" ||
    activeHref === "/projects/lifestyle-homes";

  const desktopLinks = isLifestylePage ? LIFESTYLE_DESKTOP_LINKS : DEFAULT_DESKTOP_LINKS;
  const mobileLinks = isLifestylePage ? LIFESTYLE_MOBILE_LINKS : DEFAULT_MOBILE_LINKS;

  // Sync scroll state and saved theme
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    try {
      const savedTheme = localStorage.getItem("aura_surface_theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    } catch {}

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("aura_surface_theme", next);
    } catch {}
  };

  // Close user dropdown or mobile menu on Escape / outside click
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

  // Smooth scroll on cross-page and in-page navigation
  useEffect(() => {
    const handleHashScroll = () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash;
        [100, 350, 700].forEach((delay) => {
          setTimeout(() => {
            const target = document.querySelector(hash);
            if (target) {
              const top = target.getBoundingClientRect().top + window.pageYOffset - 88;
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
        const top = target.getBoundingClientRect().top + window.pageYOffset - 88;
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
          const top = target.getBoundingClientRect().top + window.pageYOffset - 88;
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
      <header
        className={`${styles.nav}${scrolled ? ` ${styles.navScrolled}` : ""}${
          theme === "light" && scrolled ? ` ${styles.navLight}` : ""
        }`}
      >
        {/* Primary Navigation Links */}
        <nav className={styles.leftLinks} aria-label="Primary sections">
          {desktopLinks.map((item) => {
            const isExact = pathname === item.href || activeHref === item.href;
            const isRouteMatch =
              item.href.startsWith("/") &&
              !item.href.includes("#") &&
              pathname.startsWith(item.href);
            const isActive = isExact || isRouteMatch;

            return (
              <Link
                key={item.label}
                href={item.href}
                className={`${styles.navLink} roll-button${isActive ? ` ${styles.navLinkActive}` : ""}`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <span className="roll-text" data-text={item.label}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Centered Compact Brand Lockup */}
        <Link
          href={isLifestylePage ? "/projects/lifestyle-homes" : "/"}
          className={styles.logo}
          aria-label={isLifestylePage ? "Lifestyle Home Spaces — Home" : "Aura by Lifestyle — Home"}
        >
          {isLifestylePage ? (
            <img
              src="/lifestyle-homes-logo.png"
              alt="Lifestyle Home Spaces"
              className={styles.lifestyleLogoImg}
            />
          ) : (
            <>
              <img
                src="/aura/aura-logo-official.png"
                alt="Aura by Lifestyle emblem"
                width={34}
                height={34}
                className={styles.logoImg}
              />
              <span className={styles.logoName}>AURA</span>
            </>
          )}
        </Link>

        {/* Right Action Cluster: Identical-Style Sign In & Enquire Pills */}
        <div className={styles.navActions}>
          {currentUser ? (
            <div className={styles.userMenuWrapper} ref={userMenuRef}>
              <button
                type="button"
                className={`${styles.coolUserBtn} ${userMenuOpen ? styles.coolUserBtnActive : ""}`}
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-label={`Member profile for ${currentUser.name || "Member"}`}
              >
                <span className={styles.coolAvatar}>
                  {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                </span>
                <span className={styles.coolUserName}>
                  {currentUser.name ? currentUser.name.trim().split(" ")[0] : "Member"}
                </span>
                <span className={styles.coolStatusDot} aria-hidden="true" />
              </button>

              {userMenuOpen && (
                <div className={styles.userDropdownCard}>
                  <div className={styles.userDropdownHeader}>
                    <div className={styles.userDropdownAvatarLarge}>
                      {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                    </div>
                    <div className={styles.userDropdownMeta}>
                      <div className={styles.userDropdownFullName}>
                        {currentUser.name || "Lifestyle Member"}
                      </div>
                      {currentUser.phone && (
                        <div className={styles.userDropdownPhone}>
                          +91 {currentUser.phone.replace(/^(\+?91)/, "").replace(/(\d{5})(\d{5})/, "$1 $2")}
                        </div>
                      )}
                      <span className={styles.userDropdownBadge}>✦ Verified Member</span>
                    </div>
                  </div>

                  <div className={styles.userDropdownDivider} />

                  <div className={styles.userDropdownActions}>
                    <button
                      type="button"
                      className={styles.userDropdownItem}
                      onClick={() => {
                        setUserMenuOpen(false);
                        setIsEnquiryOpen(true);
                      }}
                    >
                      <span>Schedule Private Visit</span>
                    </button>
                    <Link
                      href="/projects"
                      className={styles.userDropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span>All Developments</span>
                    </Link>
                    <Link
                      href="/about"
                      className={styles.userDropdownItem}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <span>About Lifestyle</span>
                    </Link>
                    <button
                      type="button"
                      className={`${styles.userDropdownItem} ${styles.userDropdownSignOut}`}
                      onClick={() => {
                        try {
                          localStorage.removeItem("lifestyle_verified_user");
                          hasDismissedLoginThisLoad = false;
                          setCurrentUser(null);
                          setUserMenuOpen(false);
                          window.dispatchEvent(new CustomEvent("lifestyle_auth_changed"));
                        } catch {}
                      }}
                    >
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              className={`${styles.btnAction} roll-button`}
              onClick={() => setIsAuthOpen(true)}
            >
              <span className="roll-text" data-text="Sign In">
                Sign In
              </span>
            </button>
          )}

          <button
            type="button"
            className={`${styles.btnAction} roll-button`}
            onClick={() => setIsEnquiryOpen(true)}
            aria-label="Open project enquiry form"
          >
            <span className="roll-text" data-text="Enquire">
              Enquire
            </span>
          </button>

          <button
            type="button"
            className={styles.mobileToggle}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="4" y1="8" x2="20" y2="8" />
                <line x1="4" y1="16" x2="20" y2="16" />
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div className={styles.mobileBackdrop} onClick={() => setMenuOpen(false)}>
          <div
            className={styles.mobileMenu}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Mobile Navigation"
          >
            <div className={styles.mobileMenuTop}>
              <span className={styles.mobileEyebrow}>NAVIGATION · AMRAVATI</span>
              <button
                type="button"
                className={styles.mobileThemeBtn}
                onClick={toggleTheme}
              >
                {theme === "dark" ? "☀ Ivory Mode" : "☾ Dark Mode"}
              </button>
            </div>

            {currentUser && (
              <div className={styles.mobileUserCard}>
                <div className={styles.coolAvatar}>
                  {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                </div>
                <div className={styles.mobileUserMeta}>
                  <span className={styles.mobileUserName}>{currentUser.name || "Member"}</span>
                  <span className={styles.mobileUserBadge}>✦ Verified Member</span>
                </div>
                <button
                  type="button"
                  className={styles.mobileSignOutBtn}
                  onClick={() => {
                    try {
                      localStorage.removeItem("lifestyle_verified_user");
                      hasDismissedLoginThisLoad = false;
                      setCurrentUser(null);
                      setMenuOpen(false);
                      window.dispatchEvent(new CustomEvent("lifestyle_auth_changed"));
                    } catch {}
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}

            <div className={styles.mobileLinkList}>
              {mobileLinks.map((item, idx) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={styles.mobileLink}
                  onClick={(e) => handleNavClick(e, item.href)}
                >
                  <span className={styles.mobileLinkIndex}>0{idx + 1}</span>
                  <span>{item.label}</span>
                  <span className={styles.mobileLinkArrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </div>

            <div className={styles.mobileDrawerActions}>
              {!currentUser && (
                <button
                  type="button"
                  className={styles.mobileActionBtn}
                  onClick={() => {
                    setMenuOpen(false);
                    setIsAuthOpen(true);
                  }}
                >
                  Sign In
                </button>
              )}

              <button
                type="button"
                className={styles.mobileActionBtn}
                onClick={() => {
                  setMenuOpen(false);
                  setIsEnquiryOpen(true);
                }}
              >
                Enquire →
              </button>
            </div>
          </div>
        </div>
      )}

      <AuthOtpModal
        isOpen={isAuthOpen}
        onClose={() => {
          hasDismissedLoginThisLoad = true;
          setIsAuthOpen(false);
        }}
        onSuccess={(user) => {
          hasDismissedLoginThisLoad = true;
          setCurrentUser(user);
        }}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle={isLifestylePage ? "Lifestyle Home Spaces" : "Aura by Lifestyle"}
      />
    </>
  );
}
