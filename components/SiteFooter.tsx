"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import {
  mailtoHref,
  telHref,
  whatsappHref,
  type SettingsRecord,
} from "@/lib/schemas/settings";
import styles from "./SiteFooter.module.css";

const NAV_LINKS = [
  { label: "Aura by Lifestyle (Flagship)", href: "/" },
  { label: "Lifestyle Home Spaces (DPS Rd)", href: "/projects/lifestyle-homes" },
  { label: "All Projects", href: "/projects" },
  { label: "About Lifestyle", href: "/about" },
  { label: "Amenities & Specs", href: "/services" },
  { label: "Review", href: "#testimonial-section" },
  { label: "Aura FAQ", href: "#faq-section" },
  { label: "Contact Site Office", href: "/contact" },
];

export default function SiteFooter({ settings }: { settings: SettingsRecord }) {
  const SOCIAL_LINKS = settings.social;
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className={styles.footer} id="footer-section">
      <div className={styles.container}>
        <div className={styles.topGrid}>
          <div className={styles.col}>
            <Link href="/" className={styles.logo} aria-label="Aura by Lifestyle — home">
              <img
                src="/aura/aura-logo-official.png"
                alt="Aura by Lifestyle"
                width={78}
                height={78}
                className={styles.logoImg}
              />
            </Link>
            <div className={styles.contactInfo}>
              <span className={styles.contactLabel}>Site & Booking Enquiries</span>
              <a href={telHref(settings)} className={styles.emailLink} style={{ color: "#d4af37", fontWeight: 600 }}>
                📞 +91 9730768982 / 777-0000-750
              </a>
              <a href={mailtoHref(settings)} className={styles.emailLink} style={{ marginTop: "4px" }}>
                {settings.email}
              </a>
              <div style={{ marginTop: "10px", fontSize: "12px", color: "#d4af37" }}>
                MahaRERA: P5030002502915
              </div>
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.colLabel}>
              <span className={styles.colDot} aria-hidden="true" />
              <span className={styles.colLabelText}>Projects & Navigation</span>
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
              <span className={styles.colLabelText}>Connect & Direct Help</span>
            </div>
            <div className={styles.linkList}>
              <a
                href={whatsappHref(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bigLink}
                style={{ color: "#25D366" }}
              >
                Chat on WhatsApp
              </a>
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
              <span className={styles.colLabelText}>Brochure & Pricing Request</span>
            </div>
            <p className={styles.newsletterCopy}>
              Get official cut sections, unit availability, and pricing sheets directly in your inbox.
            </p>
          </div>

          {subscribed ? (
            <p className={styles.formNote} role="status">
              Thank you — our sales executive will share the brochure & pricing kit shortly.
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
                Request Kit
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
            AURA
          </p>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.bottomItem}>
            {settings.copyright}
          </span>
          <a href="#privacy" className={styles.bottomItem}>
            Privacy & Disclaimer
          </a>
          <span className={styles.bottomItem}>{settings.address}</span>
        </div>
      </div>
    </footer>
  );
}
