import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import { getSettings } from "@/lib/content/settings";
import SiteFooter from "@/components/SiteFooter";
import { getPages } from "@/lib/content/pages";
import { getProjects } from "@/lib/content/projects";
import ProjectsExplorer from "./ProjectsExplorer";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { projects } = await getPages();
  return {
    title: projects.metaTitle,
    description: projects.metaDescription,
    alternates: { canonical: "/projects" },
    openGraph: {
      title: projects.metaTitle,
      description: projects.metaDescription,
      type: "website",
    },
  };
}
export default async function ProjectsPage() {
  const [projects, settings, pages] = await Promise.all([
    getProjects(),
    getSettings(),
    getPages(),
  ]);
  const copy = pages.projects;

  return (
    <>
      <SiteNav activeHref="/projects" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
          </header>

          <ProjectsExplorer projects={projects} settings={settings} />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
