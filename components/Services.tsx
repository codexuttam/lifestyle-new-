"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceIcon from "./ServiceIcons";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ServiceRecord } from "@/lib/schemas/service";
import styles from "./Services.module.css";

/**
 * Individual Dynamic 3D Service Card
 * Features real-time mouse-tracking perspective tilt, radial spotlight glow,
 * and multi-layered depth parallax.
 */
function DynamicServiceCard({
  service,
  index,
}: {
  service: ServiceRecord;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate subtle 3D tilt angles (-10deg to +10deg)
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
      {/* Interactive Cursor Spotlight Glow */}
      <div className={styles.cardGlow} aria-hidden="true" />
      <div className={styles.cardBorderHighlight} aria-hidden="true" />

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

      <div className={styles.cardFooter}>
        <span className={styles.learnMore}>
          <span>Explore Service</span>
          <i className="fa-solid fa-arrow-right" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}

const SERVICE_DIRECTIONS = [
  { x: -140, y: 0 }, // 1. New Home Construction slides from left
  { x: 140, y: 0 },  // 2. Turnkey Handover slides from right
  { x: 0, y: 140 },  // 3. Warranty & Maintenance slides from bottom
  { x: 0, y: -140 }, // 4. Design Consulting slides from top
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
      // Each card dynamically slides in from its own direction as the grid enters view
      gsap.utils.toArray<HTMLElement>(`.${styles.card}`).forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: SERVICE_DIRECTIONS[i]?.x ?? 0,
          y: SERVICE_DIRECTIONS[i]?.y ?? 0,
          duration: 0.9,
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
        {services.map((service, index) => (
          <DynamicServiceCard
            key={service.id}
            service={service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}
