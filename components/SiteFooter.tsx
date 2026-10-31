import Link from "next/link";
import styles from "./SiteFooter.module.css";
import type { SettingsRecord } from "@/lib/schemas/settings";

export default function SiteFooter({ settings }: { settings?: SettingsRecord }) {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.grid}>
        {/* Left: Brand Identity */}
        <div className={styles.brandCol}>
          <h3 className={styles.brandTitle}>AURA</h3>
          <p className={styles.brandSub}>
            BY LIFESTYLE · Amravati
            <br />
            A project by Lifestyle.
          </p>
          <div className={styles.copyright}>
            MahaRERA: P5030002502915
            <br />
            © {new Date().getFullYear()} Aura by Lifestyle. All rights reserved.
          </div>
        </div>

        {/* Col 1: Menu */}
        <div className={styles.navCol}>
          <span className={styles.colHeader}>MENU</span>
          <Link href="/#about" className={styles.footerLink}>
            ABOUT US
          </Link>
          <Link href="/#portfolio" className={styles.footerLink}>
            PORTFOLIO
          </Link>
          <Link href="/#services" className={styles.footerLink}>
            SERVICES
          </Link>
          <Link href="/projects/lifestyle-homes" className={styles.footerLink}>
            LIFESTYLE HOMES
          </Link>
          <Link href="/blogs" className={styles.footerLink}>
            JOURNAL
          </Link>
        </div>

        {/* Col 2: Follow Us */}
        <div className={styles.navCol}>
          <span className={styles.colHeader}>FOLLOW US</span>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            INSTAGRAM
          </a>
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            FACEBOOK
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            LINKEDIN
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.footerLink}
          >
            YOUTUBE
          </a>
        </div>

        {/* Col 3: Contact */}
        <div className={styles.navCol}>
          <span className={styles.colHeader}>CONTACT</span>
          <div className={styles.contactText}>
            Congress Nagar Road, Camp,
            <br />
            Amravati, Maharashtra 444602
          </div>
          <a href="mailto:sales@lifestylehomespaces.com" className={styles.contactLink}>
            sales@lifestylehomespaces.com
          </a>
          <a href="tel:+917498256708" className={styles.contactLink}>
            +91 74982 56708
          </a>
        </div>
      </div>

      {/* Faint Repeating Watermark Behind Footer */}
      <div className={styles.watermarkRow} aria-hidden="true">
        GET IN TOUCH · GET IN TOUCH · GET IN TOUCH
      </div>
    </footer>
  );
}
