"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import styles from "./SiteNav.module.css";
import AuthOtpModal from "@/components/AuthOtpModal";
import EnquiryModal from "@/components/EnquiryModal";
import { VerifiedUser } from "@/lib/types/auth";

const LIFESTYLE_MENU_ITEMS = [
  { label: "Overview", href: "/projects/lifestyle-homes#hero-section" },
  { label: "Floor Plans", href: "/projects/lifestyle-homes#unit-plans" },
  { label: "Amenities", href: "/projects/lifestyle-homes#amenities-lifestyle-section" },
  { label: "Architecture", href: "/projects/lifestyle-homes#explore-site-section" },
  { label: "All Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/projects/lifestyle-homes#about-lifestyle-section" },
];

const DEFAULT_MENU_ITEMS = [
  { label: "Overview", href: "/#hero-section" },
  { label: "Floor Plans", href: "/#floor-plans" },
  { label: "Amenities", href: "/#properties-section" },
  { label: "Architecture", href: "/#explore-site-section" },
  { label: "All Projects", href: "/projects" },
  { label: "Blogs", href: "/blogs" },
  { label: "About", href: "/about" },
];

// Track whether the visitor dismissed the login prompt during the current browser page load.
// On every page refresh (F5 / Cmd+R) or new platform visit, this in-memory variable resets to false.
let hasDismissedLoginThisLoad = false;

/** Luxury Dark Glassmorphism Nav with Smooth Scroll Interception, WhatsApp OTP Auth & Short CRM Enquiry */
export default function SiteNav({ activeHref }: { activeHref?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<VerifiedUser | null>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  const pathname = usePathname();
  const router = useRouter();

  const isLifestylePage =
    pathname === "/projects/lifestyle-homes" ||
    pathname === "/projects/lifestyle" ||
    activeHref === "/projects/lifestyle-homes";

  const menuItems = isLifestylePage ? LIFESTYLE_MENU_ITEMS : DEFAULT_MENU_ITEMS;

  // Listen to verified user session & auto-prompt login modal on platform visit or page refresh
  useEffect(() => {
    let promptTimer: NodeJS.Timeout | null = null;

    const checkAuth = () => {
      try {
        const saved = localStorage.getItem("lifestyle_verified_user");
        if (saved) {
          setCurrentUser(JSON.parse(saved));
        } else {
          setCurrentUser(null);
          // If unauthenticated and not dismissed yet in this load, pop up the login modal
          if (!hasDismissedLoginThisLoad) {
            promptTimer = setTimeout(() => {
              setIsAuthOpen(true);
            }, 500);
          }
        }
      } catch {
        if (!hasDismissedLoginThisLoad) {
          promptTimer = setTimeout(() => {
            setIsAuthOpen(true);
          }, 500);
        }
      }
    };

    checkAuth();
    window.addEventListener("lifestyle_auth_changed", checkAuth);

    const handleOpenEnquiry = () => {
      setIsEnquiryOpen(true);
    };
    window.addEventListener("lifestyle_open_enquiry", handleOpenEnquiry);

    return () => {
      if (promptTimer) clearTimeout(promptTimer);
      window.removeEventListener("lifestyle_auth_changed", checkAuth);
      window.removeEventListener("lifestyle_open_enquiry", handleOpenEnquiry);
    };
  }, []);

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
        setMenuOpen(false);
      }
    } else {
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className={styles.nav}>
        <Link
          href={isLifestylePage ? "/projects/lifestyle-homes" : "/"}
          className={styles.logo}
          aria-label={isLifestylePage ? "Lifestyle Homes — Home" : "Aura & Lifestyle — Home"}
        >
          {isLifestylePage ? (
            <img
              src="/lifestyle-homes-logo.png"
              alt="Lifestyle Homes"
              className={styles.lifestyleLogoImg}
            />
          ) : (
            <>
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
            </>
          )}
        </Link>

        <div className={styles.menuCapsule}>
          {menuItems.map((item, idx) => {
            const isActive =
              (isLifestylePage && item.label === "Overview" && (pathname === "/projects/lifestyle-homes" || activeHref === "/projects/lifestyle-homes")) ||
              (!isLifestylePage && item.label === "Overview" && (pathname === "/" || activeHref === "/")) ||
              (item.href === "/blogs" && pathname === "/blogs") ||
              (item.href === "/projects" && pathname === "/projects") ||
              (item.href === "/about" && pathname === "/about");

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
          {currentUser ? (
            <>
              {/* Button 1: Enquire */}
              <button
                type="button"
                className={styles.btnContact}
                onClick={() => setIsEnquiryOpen(true)}
                aria-label="Open project enquiry form"
              >
                Enquire
              </button>

              {/* Button 2: Cool User Name Button with Interactive Profile Card */}
              <div className={styles.userMenuWrapper} ref={userMenuRef}>
                <button
                  type="button"
                  className={`${styles.coolUserBtn} ${userMenuOpen ? styles.coolUserBtnActive : ""}`}
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-expanded={userMenuOpen}
                  aria-label={`User menu for ${currentUser.name || "Member"}`}
                  title={currentUser.name ? `Logged in as ${currentUser.name}` : "Member Profile"}
                >
                  <span className={styles.coolAvatar}>
                    {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                  </span>
                  <span className={styles.coolUserName}>
                    {currentUser.name ? currentUser.name.trim().split(" ")[0] : "Member"}
                  </span>
                  <span className={styles.coolStatusDot} aria-hidden="true" />
                  <svg
                    className={`${styles.coolChevron} ${userMenuOpen ? styles.coolChevronOpen : ""}`}
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>

                {/* Cool Luxury User Dropdown Card */}
                {userMenuOpen && (
                  <div className={styles.userDropdownCard}>
                    <div className={styles.userDropdownHeader}>
                      <div className={styles.userDropdownAvatarLarge}>
                        {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
                      </div>
                      <div className={styles.userDropdownMeta}>
                        <div className={styles.userDropdownFullName}>
                          {currentUser.name || "Lifestyle Resident"}
                        </div>
                        {currentUser.phone && (
                          <div className={styles.userDropdownPhone}>
                            +91 {currentUser.phone.replace(/^(\+?91)/, "").replace(/(\d{5})(\d{5})/, "$1 $2")}
                          </div>
                        )}
                        <span className={styles.userDropdownBadge}>
                          ✦ Verified Member
                        </span>
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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                        <span>Submit Online Enquiry</span>
                      </button>

                      <Link
                        href="/projects"
                        className={styles.userDropdownItem}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        </svg>
                        <span>Explore All Projects</span>
                      </Link>

                      {currentUser.isAdmin && (
                        <Link
                          href="/admin"
                          className={styles.userDropdownItem}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="18" height="18" x="3" y="3" rx="2" />
                            <path d="M9 3v18" />
                            <path d="M14 9h7" />
                            <path d="M14 15h7" />
                          </svg>
                          <span>Admin Portal</span>
                        </Link>
                      )}

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
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                          <polyline points="16 17 21 12 16 7" />
                          <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Unauthenticated: Sign In + Enquire Now */}
              <button
                type="button"
                className={styles.btnSignIn}
                onClick={() => setIsAuthOpen(true)}
                title="Member Sign In via Mobile OTP"
              >
                Sign In
              </button>

              <button
                type="button"
                className={styles.btnContact}
                onClick={() => setIsEnquiryOpen(true)}
                aria-label="Open project enquiry form"
              >
                Enquire Now
              </button>
            </>
          )}

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

      {/* Mobile Drawer Menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {currentUser && (
            <div className={styles.mobileUserCard}>
              <div className={styles.coolAvatar}>
                {(currentUser.name?.trim().charAt(0) || "U").toUpperCase()}
              </div>
              <div className={styles.mobileUserMeta}>
                <span className={styles.mobileUserName}>{currentUser.name || "Member"}</span>
                <span className={styles.mobileUserBadge}>✓ Verified Resident</span>
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

          {menuItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
            >
              {item.label}
            </a>
          ))}

          {!currentUser && (
            <button
              type="button"
              className={styles.mobileSignInBtn}
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
            className={styles.mobileContactBtn}
            onClick={() => {
              setMenuOpen(false);
              setIsEnquiryOpen(true);
            }}
          >
            Enquire Now
          </button>
        </div>
      )}

      {/* Global WhatsApp OTP Modal */}
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

      {/* Global Short Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle={isLifestylePage ? "Lifestyle Home Spaces" : "Aura by Lifestyle"}
      />
    </>
  );
}
