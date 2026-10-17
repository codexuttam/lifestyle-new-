import type { Metadata } from "next";

import SiteFooter from "@/components/SiteFooter";
import SiteNav from "@/components/SiteNav";
import ContactForm from "@/components/ContactForm";
import { getPages } from "@/lib/content/pages";
import { getSettings } from "@/lib/content/settings";
import { mailtoHref, telHref, whatsappHref } from "@/lib/schemas/settings";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { contact } = await getPages();
  return {
    title: contact.metaTitle,
    description: contact.metaDescription,
    alternates: { canonical: "/contact" },
  };
}
export default async function ContactPage() {
  const [settings, pages] = await Promise.all([getSettings(), getPages()]);
  const copy = pages.contact;

  return (
    <>
      <SiteNav activeHref="/contact" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
          </header>

          <div className={styles.layout}>
            <div className={styles.formPanel}>
              <ContactForm />
            </div>

            <aside className={styles.details}>
              <h2 className={styles.detailsTitle}>{copy.sidebarTitle}</h2>

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
