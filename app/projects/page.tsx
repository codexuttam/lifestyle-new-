import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import SiteFooter from "@/components/SiteFooter";
import { getProjects } from "@/lib/content/projects";
import ProjectsExplorer from "./ProjectsExplorer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Projects | The Premium Construction",
  description:
    "Browse every home, villa, office and renovation we have delivered across Delhi NCR — filter by category to find work closest to your own plot.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects | The Premium Construction",
    description:
      "Every residential, commercial, interior and renovation project we have delivered across Delhi NCR.",
    type: "website",
  },
};

export default async function ProjectsPage() {
  const [projects, settings] = await Promise.all([getProjects(), getSettings()]);

  return (
    <>
      <SiteNav activeHref="/projects" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span className={styles.badgeText}>Projects</span>
            </div>
            <h1 className={styles.title}>Everything We Have Built</h1>
            <p className={styles.intro}>
              Homes, villas, offices, interiors and full renovations — every
              project below was handled turnkey by one team, from the first site
              visit to handover. Filter by category to see the work closest to
              what you have in mind.
            </p>
          </header>

          <ProjectsExplorer projects={projects} settings={settings} />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
