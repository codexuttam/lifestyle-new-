"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceIcon from "./ServiceIcons";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ServiceRecord } from "@/lib/schemas/service";
import styles from "./Services.module.css";

const ARCHITECTURAL_PILLARS = [
  {
    index: "01",
    title: "ZERO SHARED WALLS & 360° CROSS-VENTILATION",
    body: "Every 2 & 3 BHK suite at Aura is planned around open daylight corridors with private sit-out balconies, acoustic separation between residences, and 100% Vastu alignment.",
  },
  {
    index: "02",
    title: "ELEVATED SKY LEISURE ABOVE STREET CONGESTION",
    body: "Instead of crowding ground setbacks, Level 15 crowns the tower with a rooftop lap pool, kids splash zone, multi-sports turf, jogging loop, and panoramic horizon decks.",
  },
  {
    index: "03",
    title: "BENCHMARK SPECIFICATIONS & ACCOUNTABLE DELIVERY",
    body: "800×1600 mm vitrified slabs, concealed Jaquar fittings, 3-track powder-coated windows, seismic-grade RCC framing, and 4 high-speed elevators backed by generator power.",
  },
];

export default function Services({
  services,
  content,
}: {
  services: ServiceRecord[];
  content: HomeRecord["services"];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const colRuleRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      if (colRuleRef.current) {
        gsap.fromTo(
          colRuleRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 70%",
              end: "bottom 60%",
              scrub: 0.4,
            },
          }
        );
      }

      gsap.from("[data-pillar-item]", {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.pillarsCol}`,
          start: "top 82%",
          once: true,
        },
      });

      gsap.from("[data-service-card]", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.grid}`,
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.services} id="services-section" ref={sectionRef}>
      {/* Virtuaze-Style 3D Perspective Architectural Floor Grid */}
      <div className={styles.perspectiveStage} aria-hidden="true">
        <div className={styles.gridFloor} />
        <div className={styles.horizonGlow} />
      </div>

      <div className={styles.container}>
        {/* Editorial Sticky Left + Scroll-Revealed Right Value Narrative */}
        <div className={styles.editorialSplit}>
          <div className={styles.stickyCol}>
            <h2 className={styles.heading}>{content.heading}</h2>
            <p className={styles.intro}>{content.intro}</p>
            <Link href="/services" className={`${styles.viewAll} roll-button`}>
              <span className="roll-text" data-text={`${content.ctaLabel} →`}>
                {content.ctaLabel} →
              </span>
            </Link>
            <span className={styles.verticalProgressRule} ref={colRuleRef} aria-hidden="true" />
          </div>

          <div className={styles.pillarsCol}>
            {ARCHITECTURAL_PILLARS.map((pillar) => (
              <article className={styles.pillarBlock} key={pillar.index} data-pillar-item>
                <span className={styles.pillarIndex}>({pillar.index})</span>
                <div className={styles.pillarContent}>
                  <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                  <p className={styles.pillarBody}>{pillar.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* 4 Core Engineering & Turnkey Capabilities */}
        <div className={styles.grid}>
          {services.map((service, index) => (
            <Link
              href="/services"
              key={service.id}
              className={styles.card}
              data-service-card
            >
              <div className={styles.cardTop}>
                <div className={styles.iconBadge}>
                  <ServiceIcon name={service.icon} />
                </div>
                <span className={styles.categoryChip}>
                  0{index + 1} · {service.category}
                </span>
              </div>

              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardText}>{service.text}</p>
              </div>

              <div className={styles.cardFooter}>
                <span className={styles.timelineMeta}>Timeline · {service.timeline}</span>
                <span className={styles.learnMore} aria-hidden="true">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
