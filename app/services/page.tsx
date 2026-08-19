import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import SiteFooter from "@/components/SiteFooter";
import { getServices } from "@/lib/content/services";
import ServicesExplorer from "./ServicesExplorer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Services | The Premium Construction",
  description:
    "Construction, design, interiors, renovation and aftercare — every service we offer across Delhi NCR, with indicative pricing and timelines. Filter by category.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services | The Premium Construction",
    description:
      "Every construction, design, interiors, renovation and aftercare service we offer, with indicative pricing and timelines.",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([getServices(), getSettings()]);

  return (
    <>
      <SiteNav activeHref="/services" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span className={styles.badgeText}>Services</span>
            </div>
            <h1 className={styles.title}>Everything We Handle For You</h1>
            <p className={styles.intro}>
              From a bare plot to a finished home, and long after the keys are
              handed over — one team, transparent pricing, and a dedicated site
              manager on every job. Filter by category to find the work you need.
            </p>
          </header>

          <ServicesExplorer services={services} settings={settings} />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
