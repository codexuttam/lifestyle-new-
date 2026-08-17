"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Services.module.css";

const ICON_PROPS = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

function HouseIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
      <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" />
      <path d="m21 2-9.6 9.6" />
      <circle cx="7.5" cy="15.5" r="5.5" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

/** `from` is the offset each card animates in from as it enters view. */
const SERVICES: {
  title: string;
  text: string;
  icon: ReactNode;
  from: { x?: number; y?: number };
}[] = [
  {
    title: "New Home Construction",
    text: "Build from bare plot to finished home with one accountable team — architectural drawings, RCC structure, and finishing delivered on a fixed-price contract.",
    icon: <HouseIcon />,
    from: { x: -140 },
  },
  {
    title: "Turnkey Handover",
    text: "Municipal approvals, utilities, snagging and final walkthrough all handled by us, so the only thing you do on possession day is collect the keys.",
    icon: <KeyIcon />,
    from: { x: 140 },
  },
  {
    title: "Warranty & Maintenance",
    text: "A 30-month structural warranty on every build, with maintenance support that keeps your home sound long after the site team has left.",
    icon: <ShieldCheckIcon />,
    from: { y: 140 },
  },
  {
    title: "Design Consulting",
    text: "Expert guidance on layout, orientation, Vastu and budget — backed by material insight and strategies tailored to how you plan to live.",
    icon: <UsersIcon />,
    from: { y: -140 },
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Each card slides in from its own direction as the grid enters view.
      gsap.utils.toArray<HTMLElement>(`.${styles.card}`).forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          x: SERVICES[i]?.from.x ?? 0,
          y: SERVICES[i]?.from.y ?? 0,
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
          <h2 className={styles.heading}>What Services We Provide?</h2>
        </div>
        <div className={styles.introWrapper}>
          <p className={styles.intro}>
            At <span className={styles.introStrong}>The Premium Construction</span>,
            our services cover every stage — design, approvals, construction and
            handover — with transparent pricing, a dedicated site manager, and
            solutions tailored to how you want to live.
          </p>
        </div>
      </div>

      <div className={styles.grid}>
        {SERVICES.map((service) => (
          <div className={styles.card} key={service.title}>
            <div className={styles.cardTop}>
              <div className={styles.iconBadge}>{service.icon}</div>
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
