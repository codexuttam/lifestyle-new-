import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import RevealAnimations from "@/components/RevealAnimations";
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
  const [projects, settings] = await Promise.all([
    getProjects(),
    getSettings(),
  ]);

  return (
    <>
      <RevealAnimations />
      <SiteNav activeHref="/projects" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header} data-reveal>
            <h1 className={styles.title}>
              SIGNATURE DEVELOPMENTS &amp; <span>COMMERCIAL ARCADES</span>
            </h1>
            <p className={styles.intro}>
              From our 15-storey skyline tower Aura by Lifestyle in Congress Nagar to 100% delivered ready-to-move Lifestyle Home Spaces on DPS Road—discover architectural residences and road-facing commercial showrooms.
            </p>
          </header>

          <ProjectsExplorer projects={projects} settings={settings} />
        </div>
      </main>

      <SiteFooter settings={settings} />
    </>
  );
}
