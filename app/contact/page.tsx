import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/content/settings";
import { mailtoHref, telHref, whatsappHref } from "@/lib/schemas/settings";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Contact Us | The Premium Construction",
  description:
    "Book a free site visit. Tell us your plot location and size and we will come back with a feasibility read and an honest cost range across Delhi NCR.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <>
      <SiteNav activeHref="/contact" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span className={styles.badgeText}>Contact us</span>
            </div>
            <h1 className={styles.title}>Book A Free Site Visit</h1>
            <p className={styles.intro}>
              Tell us where the plot is and roughly what you have in mind. We
              will visit, study orientation and soil, and come back with a
              feasibility read and an honest cost range — before you commit to
              anything.
            </p>
          </header>

          <div className={styles.layout}>
            <div className={styles.formPanel}>
              <ContactForm />
            </div>

            <aside className={styles.details}>
              <h2 className={styles.detailsTitle}>Prefer to talk?</h2>

              <a className={styles.detailRow} href={whatsappHref(settings)}>
                <span className={styles.detailLabel}>WhatsApp</span>
                <span className={styles.detailValue}>{settings.phone}</span>
              </a>

              <a className={styles.detailRow} href={telHref(settings)}>
                <span className={styles.detailLabel}>Call</span>
                <span className={styles.detailValue}>{settings.phone}</span>
              </a>

              <a className={styles.detailRow} href={mailtoHref(settings)}>
                <span className={styles.detailLabel}>Email</span>
                <span className={styles.detailValue}>{settings.email}</span>
              </a>

              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Office</span>
                <span className={styles.detailValue}>{settings.address}</span>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
