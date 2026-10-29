"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import AnimatedCounter from "@/components/AnimatedCounter";
import styles from "./About.module.css";

const SPOTLIGHT_SPECS = [
  { key: "Designed For", value: "Discerning 2 & 3 BHK Families" },
  { key: "Prime Address", value: "Congress Nagar Road, Camp" },
  { key: "Developed By", value: "Lifestyle Home Spaces" },
  { key: "Vertical Scale", value: "15 Storeys + Crown Sky Deck" },
];

export default function About({ content }: { content: HomeRecord["about"] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.from("[data-about-reveal]", {
        y: 36,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.about} id="about-us-section" ref={sectionRef}>
      <div className={styles.container}>
        {/* Monumental Architectural Spotlight Intro */}
        <div className={styles.topIntro} data-about-reveal>
          <span className={styles.eyebrowTag}>ARCHITECTURAL SPOTLIGHT</span>
          <h2 className={styles.monumentTitle}>
            <span>LIFE BEYOND</span>
            <span className={styles.monumentOutline}>IMAGINATION</span>
          </h2>
          <p className={styles.statement}>{content.statement}</p>
        </div>

        {/* 4-Column Specification Strip */}
        <div className={styles.specBar} data-about-reveal>
          {SPOTLIGHT_SPECS.map((item) => (
            <div className={styles.specCol} key={item.key}>
              <span className={styles.specKey}>{item.key}</span>
              <span className={styles.specVal}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Framed Architectural Showcase Elevation */}
        <div className={styles.elevationFrame} data-about-reveal>
          <img
            src="/aura/aura-hero-clean-4k.jpg"
            alt="Aura by Lifestyle 15-Storey Architectural Elevation in Congress Nagar, Camp"
            className={styles.elevationImg}
            loading="lazy"
          />
          <div className={styles.elevationScrim} />
          <div className={styles.elevationOverlay}>
            <div className={styles.elevationMeta}>
              <span className={styles.elevationBadge}>AURA BY LIFESTYLE · CAMP</span>
              <h3 className={styles.elevationCaption}>
                A 15-Storey Vertical Sanctuary Rising Over Amravati&apos;s Greenest Neighbourhood
              </h3>
            </div>
            <Link href="/about" className={`${styles.btnMore} roll-button`}>
              <span className="roll-text" data-text={`${content.ctaLabel} →`}>
                {content.ctaLabel} →
              </span>
            </Link>
          </div>
        </div>

        {/* Three Factual Benchmark Cards */}
        <div className={styles.grid}>
          {content.cards.map((card, index) => (
            <div className={styles.card} key={card.label} data-about-reveal>
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>(0{index + 1})</span>
                <span className={styles.cardLabel}>{card.label}</span>
              </div>

              <div className={styles.cardMediaRow}>
                <div className={styles.thumbFrame}>
                  <img
                    src={card.img}
                    alt={card.alt}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardStat}>
                  <AnimatedCounter
                    target={card.target}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    className={styles.cardNumber}
                    unitClassName={styles.cardUnit}
                  />
                </div>
              </div>

              <div className={styles.divider} />
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
