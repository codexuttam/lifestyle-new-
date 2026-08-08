import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { PaintVisualizer } from "@/features/paint-visualizer";

export const metadata: Metadata = {
  title: "Paint Visualizer | BUILD CONSTRUCTIONS",
  description:
    "See how any paint colour will look on your walls before you buy. Try 30 curated shades on a real room or your own photo, then copy the exact HEX, RGB, and HSL codes.",
  alternates: { canonical: "/paint-visualizer" },
  openGraph: {
    title: "Paint Visualizer | BUILD CONSTRUCTIONS",
    description:
      "Try paint colours on a real room and copy the exact colour codes.",
    type: "website",
  },
};

export default function PaintVisualizerPage() {
  return (
    <>
      <Navbar />
      <main className="section" style={{ paddingTop: 140 }}>
        <div className="container">
          <div className="section-header">
            <h1 className="small-caps">Paint Visualizer</h1>
            <h2 className="hero-text">See The Colour Before You Buy It</h2>
            <p className="body-text">
              Click any wall to paint it. Try a shade on one of our finished
              rooms or upload a photo of your own — everything runs in your
              browser, and your photo never leaves your device. When you find
              the one, copy the exact colour code and send it to your painter.
            </p>
          </div>

          <PaintVisualizer />
        </div>
      </main>
    </>
  );
}
