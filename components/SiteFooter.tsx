"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import styles from "./SiteFooter.module.css";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "#about-us-section" },
  { label: "Properties", href: "#properties-section" },
  { label: "Review", href: "#testimonial-section" },
  { label: "FAQ", href: "#faq-section" },
  { label: "Paint Visualizer", href: "/paint-visualizer" },
];

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Linkedin", href: "https://linkedin.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // No mailing-list backend is wired up yet, so this just acknowledges locally.
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className={styles.footer} id="footer-section">
      <video
        src="https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Header%20Bg%20Video%20Final.mp4"
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
        aria-hidden="true"
      />
      <div className={styles.videoOverlay} />

      <div className={styles.container}>
        <div className={styles.topGrid}>
          <div className={styles.col}>
            <Link href="/" className={styles.logo} aria-label="The Premium Construction — home">
              <img
                src="/logo/logo-transparent.png"
                alt="The Premium Construction"
                width={104}
                height={104}
                className={styles.logoImg}
              />
            </Link>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Get in touch with us</span>
              <a
                href="mailto:hello@thepremiumconstruction.in"
                className={styles.emailLink}
              >
                hello@thepremiumconstruction.in
              </a>
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.colLabel}>
              <span className={styles.colDot} aria-hidden="true" />
              <span className={styles.colLabelText}>Navigation</span>
            </div>
            <div className={styles.linkList}>
              {NAV_LINKS.map((link) =>
                link.href.includes("#") ? (
                  <a key={link.label} href={link.href} className={styles.bigLink}>
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={styles.bigLink}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.colLabel}>
              <span className={styles.colDot} aria-hidden="true" />
              <span className={styles.colLabelText}>Social</span>
            </div>
            <div className={styles.linkList}>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bigLink}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.newsletterRow}>
          <div className={styles.newsletterText}>
            <div className={styles.colLabel}>
              <span className={styles.colDot} aria-hidden="true" />
              <span className={styles.colLabelText}>Newsletter</span>
            </div>
            <p className={styles.newsletterCopy}>
              Get updates on new builds and construction insights.
            </p>
          </div>

          {subscribed ? (
            <p className={styles.formNote} role="status">
              Thanks — we will be in touch at the address you gave us.
            </p>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  aria-label="Email address"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.subscribeBtn}>
                Subscribe
              </button>
            </form>
          )}
        </div>

        <div className={styles.brandingPanel}>
          <div className={`${styles.corner} ${styles.cornerTl}`} />
          <div className={`${styles.corner} ${styles.cornerTr}`} />
          <div className={`${styles.corner} ${styles.cornerBl}`} />
          <div className={`${styles.corner} ${styles.cornerBr}`} />
          <p className={styles.giantTitle} aria-hidden="true">
            Premium
          </p>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.bottomItem}>
            © 2026 The Premium Construction Pvt. Ltd. All rights reserved.
          </span>
          <a href="#privacy" className={styles.bottomItem}>
            Privacy Policy
          </a>
          <span className={styles.bottomItem}>
            412, Suncity Business Tower, Gurugram
          </span>
        </div>
      </div>
    </footer>
  );
}
