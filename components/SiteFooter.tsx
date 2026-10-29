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
  { label: "All Developments", href: "/projects" },
  { label: "Capabilities & Care", href: "/services" },
  { label: "About Lifestyle", href: "/about" },
  { label: "Real Estate Insights", href: "/blogs" },
  { label: "Contact Advisory Desk", href: "/contact" },
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
                width={58}
                height={58}
                className={styles.logoImg}
              />
              <div className={styles.logoText}>
                <span className={styles.logoTitle}>AURA</span>
                <span className={styles.logoSub}>BY LIFESTYLE HOME SPACES</span>
              </div>
            </Link>

            <p className={styles.addressBlock}>{settings.address}</p>

            <div className={styles.contactInfo}>
              <a href={telHref(settings)} className={styles.emailLink}>
                +91 7498256708
              </a>
              <a href={mailtoHref(settings)} className={styles.emailSub}>
                {settings.email}
              </a>
              <span className={styles.reraLine}>
                MahaRERA Reg. No. {settings.reraNumber} · maharera.maharashtra.gov.in
              </span>
            </div>

            <button
              type="button"
              className={`${styles.enquireBtn} roll-button`}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("lifestyle_open_enquiry"));
              }}
            >
              <span className="roll-text" data-text="Open Online Enquiry →">
                Open Online Enquiry →
              </span>
            </button>
          </div>

          <div className={styles.col}>
            <div className={styles.colLabel}>
              <span className={styles.colDot} aria-hidden="true" />
              <span className={styles.colLabelText}>Developments &amp; Pages</span>
            </div>
            <div className={styles.linkList}>
              {NAV_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className={styles.bigLink}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.col}>
            <div className={styles.colLabel}>
              <span className={styles.colDot} aria-hidden="true" />
              <span className={styles.colLabelText}>Direct Channels &amp; Social</span>
            </div>
            <div className={styles.linkList}>
              <a
                href={whatsappHref(settings)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.waLink}
              >
                WhatsApp Concierge ↗
              </a>
              {SOCIAL_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.bigLink}
                >
                  {link.label} ↗
                </a>
              ))}
              <Link href="/privacy" className={styles.bigLink}>
                Privacy &amp; MahaRERA Disclaimer
              </Link>
            </div>
          </div>
        </div>

        <div className={styles.newsletterRow}>
          <div className={styles.newsletterText}>
            <span className={styles.kitEyebrow}>BROCHURE &amp; FLOOR PLATE KIT</span>
            <p className={styles.newsletterCopy}>
              Receive official Aura &amp; Lifestyle Home Spaces cut-section drawings directly in your inbox.
            </p>
          </div>

          {subscribed ? (
            <p className={styles.formNote} role="status">
              ✓ Request noted — our advisory desk will share the official brochure kit shortly.
            </p>
          ) : (
            <form className={styles.form} onSubmit={onSubmit}>
              <div className={styles.inputBox}>
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  aria-label="Email address"
                  className={styles.input}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <button type="submit" className={`${styles.subscribeBtn} roll-button`}>
                <span className="roll-text" data-text="Request Kit">
                  Request Kit
                </span>
              </button>
            </form>
          )}
        </div>

        <div className={styles.brandingPanel}>
          <div className={`${styles.corner} ${styles.cornerTl}`} />
          <div className={`${styles.corner} ${styles.cornerTr}`} />
          <div className={`${styles.corner} ${styles.cornerBl}`} />
          <div className={`${styles.corner} ${styles.cornerBr}`} />
          <img
            src="/aura/aura-hero-clean-4k.jpg"
            alt="Aura 15-Storey Tower Landmark"
            className={styles.brandingBgImage}
            loading="lazy"
          />
          <div className={styles.brandingOverlay} />
          <p className={styles.giantTitle} aria-hidden="true">
            AURA BY LIFESTYLE
          </p>
        </div>

        <div className={styles.bottomBar}>
          <span className={styles.bottomItem}>{settings.copyright}</span>
          <span className={styles.bottomItem}>Congress Nagar, Camp &amp; DPS Road, Amravati</span>
        </div>
      </div>
    </footer>
  );
}
