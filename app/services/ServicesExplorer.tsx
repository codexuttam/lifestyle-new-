"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import ServiceIcon from "@/components/ServiceIcons";
import { SERVICE_CATEGORIES } from "@/data/services";
import type { ServiceCategory } from "@/data/services";
import type { ServiceRecord } from "@/lib/schemas/service";
import { whatsappHref, type SettingsRecord } from "@/lib/schemas/settings";
import styles from "./page.module.css";

type Filter = ServiceCategory | "All";

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={styles.checkIcon}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function ServicesExplorer({
  services,
  settings,
}: {
  settings: SettingsRecord;
  services: ServiceRecord[];
}) {
  const [filter, setFilter] = useState<Filter>("All");
  const cardsRef = useRef<HTMLDivElement | null>(null);

  const filters = useMemo<Filter[]>(
    () => [
      "All",
      ...SERVICE_CATEGORIES.filter((category) =>
        services.some((service) => service.category === category)
      ),
    ],
    [services]
  );

  const visible = useMemo(
    () =>
      filter === "All"
        ? services
        : services.filter((service) => service.category === filter),
    [filter, services]
  );

  useEffect(() => {
    const grid = cardsRef.current;
    if (!grid) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = Array.from(grid.children);
    if (!items.length) return;
    gsap.fromTo(
      items,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.48, stagger: 0.06, ease: "power3.out" }
    );
  }, [filter]);

  const countFor = (value: Filter) =>
    value === "All"
      ? services.length
      : services.filter((service) => service.category === value).length;

  return (
    <>
      <div className={styles.filters} role="tablist" aria-label="Service categories" data-reveal>
        {filters.map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={filter === value}
            className={`${styles.filter}${
              filter === value ? ` ${styles.filterActive}` : ""
            }`}
            onClick={() => setFilter(value)}
          >
            {value}
            <span className={styles.filterCount}>{countFor(value)}</span>
          </button>
        ))}
      </div>

      <p className={styles.resultCount} aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? "service" : "services"}
        {filter === "All" ? "" : ` in ${filter}`}
      </p>

      <div className={styles.cards} ref={cardsRef}>
        {visible.map((service) => (
          <article className={styles.card} key={service.id}>
            <div className={styles.cardTop}>
              <div className={styles.iconBadge}>
                <ServiceIcon name={service.icon} />
              </div>
              <span className={styles.categoryChip}>{service.category}</span>
            </div>

            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>{service.title}</h2>
              <p className={styles.cardText}>{service.text}</p>
            </div>

            <ul className={styles.includes}>
              {service.includes.map((item) => (
                <li className={styles.includeItem} key={item}>
                  <CheckIcon />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className={styles.metaRow}>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>Starting at</span>
                <span className={styles.metaValue}>{service.startingAt}</span>
              </div>
              <div className={styles.metaBlock}>
                <span className={styles.metaLabel}>Typical timeline</span>
                <span className={styles.metaValue}>{service.timeline}</span>
              </div>
            </div>

            <a href={whatsappHref(settings)} className={`${styles.quoteBtn} roll-button`}>
              <span className="roll-text" data-text="Get a Quote →">
                Get a Quote →
              </span>
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
