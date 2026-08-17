import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { PaintVisualizer } from "@/features/paint-visualizer";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Paint Visualizer | The Premium Construction",
  description:
    "See how any paint colour will look on your walls before you buy. Try 30 curated shades on a blank room or your own photo, then copy the exact HEX, RGB, and HSL codes.",
  alternates: { canonical: "/paint-visualizer" },
  openGraph: {
    title: "Paint Visualizer | The Premium Construction",
    description:
      "Try paint colours on a blank room and copy the exact colour codes.",
    type: "website",
  },
};

export default function PaintVisualizerPage() {
  return (
    <>
      <SiteNav activeHref="/paint-visualizer" />

      <main className={styles.page}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} aria-hidden="true" />
              <span className={styles.badgeText}>Paint Visualizer</span>
            </div>
            <h1 className={styles.title}>See The Colour Before You Buy It</h1>
            <p className={styles.intro}>
              Start with a bare white room — pick a wall or the ceiling, pick a
              colour, and it fills instantly. Prefer something real? Upload a
              photo of your own — everything runs in your browser, and your
              photo never leaves your device. When you find the one, copy the
              exact colour code and send it to your painter.
            </p>
          </header>

          <PaintVisualizer />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
