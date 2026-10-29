import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import RevealAnimations from "@/components/RevealAnimations";
import { getPages } from "@/lib/content/pages";
import { getSettings } from "@/lib/content/settings";
import SiteFooter from "@/components/SiteFooter";
import { PaintVisualizer } from "@/features/paint-visualizer";
import styles from "./page.module.css";

export async function generateMetadata(): Promise<Metadata> {
  const { paintVisualizer } = await getPages();
  return {
    title: paintVisualizer.metaTitle,
    description: paintVisualizer.metaDescription,
    alternates: { canonical: "/paint-visualizer" },
    openGraph: {
      title: paintVisualizer.metaTitle,
      description: paintVisualizer.metaDescription,
      type: "website",
    },
  };
}

export default async function PaintVisualizerPage() {
  const [settings, pages] = await Promise.all([getSettings(), getPages()]);
  const copy = pages.paintVisualizer;

  return (
    <>
      <SiteNav activeHref="/paint-visualizer" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header} data-reveal>
            <h1 className={styles.title}>{copy.title}</h1>
            <p className={styles.intro}>{copy.intro}</p>
          </header>

          <div data-reveal>
            <PaintVisualizer />
          </div>
        </div>
      </main>

      <SiteFooter settings={settings} />
      <RevealAnimations />
    </>
  );
}
