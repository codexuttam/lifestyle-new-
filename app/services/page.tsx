import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import SiteFooter from "@/components/SiteFooter";
import { getPages } from "@/lib/content/pages";
import { getServices } from "@/lib/content/services";
import ServicesExplorer from "./ServicesExplorer";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { services } = await getPages();
  return {
    title: services.metaTitle,
    description: services.metaDescription,
    alternates: { canonical: "/services" },
    openGraph: {
      title: services.metaTitle,
      description: services.metaDescription,
      type: "website",
    },
  };
}
export default async function ServicesPage() {
  const [services, settings, pages] = await Promise.all([
    getServices(),
    getSettings(),
    getPages(),
  ]);
  const copy = pages.services;

  return (
    <>
      <SiteNav activeHref="/services" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
          </header>

          <ServicesExplorer services={services} settings={settings} />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
