"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./LifestyleSpecsShowcase.module.css";

export interface SpecItem {
  icon: string;
  title: string;
  desc: string;
}

function DynamicSpecCard({ spec, index }: { spec: SpecItem; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Smooth dynamic 3D tilt angles (-10deg to +10deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
    card.style.setProperty("--rotate-x", `${rotateX.toFixed(2)}deg`);
    card.style.setProperty("--rotate-y", `${rotateY.toFixed(2)}deg`);
    card.style.setProperty("--card-scale", "1.025");
    card.style.setProperty("--glow-opacity", "1");
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--rotate-x", "0deg");
    card.style.setProperty("--rotate-y", "0deg");
    card.style.setProperty("--card-scale", "1");
    card.style.setProperty("--glow-opacity", "0");
  };

  return (
    <div
      ref={cardRef}
      className={styles.card}
      data-card-index={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive Cursor Spotlight Glow (matches Aura service cards) */}
      <div className={styles.cardGlow} aria-hidden="true" />
      <div className={styles.cardBorderHighlight} aria-hidden="true" />

      <div className={styles.specIconBox}>
        <i className={spec.icon} aria-hidden="true" />
      </div>

      <div className={styles.cardContent}>
        <h3 className={styles.specTitle}>{spec.title}</h3>
        <p className={styles.specDesc}>{spec.desc}</p>
      </div>
    </div>
  );
}

// Directional slide-in entrance patterns for the 3x3/3x4 grid
const DIRECTIONS = [
  { x: -60, y: 0 },
  { x: 0, y: 60 },
  { x: 60, y: 0 },
  { x: -60, y: 0 },
  { x: 0, y: 60 },
  { x: 60, y: 0 },
  { x: -60, y: 0 },
  { x: 0, y: 60 },
  { x: 60, y: 0 },
  { x: -60, y: 0 },
  { x: 0, y: 60 },
  { x: 60, y: 0 },
];

export default function LifestyleSpecsShowcase({ specs }: { specs: SpecItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(`.${styles.card}`).forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: DIRECTIONS[i % DIRECTIONS.length]?.x ?? 0,
          y: DIRECTIONS[i % DIRECTIONS.length]?.y ?? 40,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            once: true,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.specsGrid} ref={containerRef}>
      {specs.map((spec, idx) => (
        <DynamicSpecCard key={idx} spec={spec} index={idx} />
      ))}
    </div>
  );
}
