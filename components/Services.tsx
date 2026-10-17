"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceIcon from "./ServiceIcons";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ServiceRecord } from "@/lib/schemas/service";
import styles from "./Services.module.css";

/** Offset each card animates in from as it enters view, by position. */
const CARD_FROM: { x?: number; y?: number }[] = [
  { y: 30 },
  { y: 40 },
  { y: 50 },
  { y: 60 },
];

export default function Services({
  services,
  content,
}: {
  services: ServiceRecord[];
  content: HomeRecord["services"];
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Each card slides in smoothly as the grid enters view.
      gsap.utils.toArray<HTMLElement>(`.${styles.card}`).forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: CARD_FROM[i]?.y ?? 30,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            once: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.services} id="services-section" ref={sectionRef}>
      <div className={styles.headerRow}>
        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>{content.heading}</h2>
        </div>
        <div className={styles.introWrapper}>
          <p className={styles.intro}>
            At{" "}
            <span className={styles.introStrong}>Aura by Lifestyle</span>,{" "}
            {content.intro}
          </p>
        </div>
      </div>

      <div className={styles.ctaRow}>
        <Link href="/services" className={styles.viewAll}>
          {content.ctaLabel}
        </Link>
      </div>

      <div className={styles.grid}>
        {services.map((service) => (
          <div className={styles.card} key={service.id}>
            <div className={styles.cardTop}>
              <div className={styles.iconBadge}>
                <ServiceIcon name={service.icon} />
              </div>
              <span className={styles.categoryChip}>{service.category}</span>
            </div>
            <div className={styles.cardBody}>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardText}>{service.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
