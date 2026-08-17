"use client";

import { useState } from "react";
import styles from "./Properties.module.css";

const PROPERTIES = [
  {
    id: "casa-meridian",
    title: "Casa Meridian",
    category: "Residential",
    price: "₹2.8 Cr",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2001.mp4",
  },
  {
    id: "ivory-residence",
    title: "The Ivory Residence",
    category: "Residential",
    price: "₹4.2 Cr",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2002.mp4",
  },
  {
    id: "arken-house",
    title: "Arken House",
    category: "Residential",
    price: "₹1.95 Cr",
    video: "https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Video%2003.mp4",
  },
];

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function Properties() {
  const [index, setIndex] = useState(0);

  const total = PROPERTIES.length;
  const feature = PROPERTIES[index];
  const secondary = [
    PROPERTIES[(index + 1) % total],
    PROPERTIES[(index + 2) % total],
  ];

  const step = (delta: number) =>
    setIndex((current) => (current + delta + total) % total);

  return (
    <section className={styles.properties} id="properties-section">
      <div className={styles.grid}>
        <div className={styles.tag}>
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.tagText}>Properties</span>
        </div>

        <div className={styles.headingWrapper}>
          <h2 className={styles.heading}>
            Explore signature homes built across Delhi NCR, each one designed
            around the way its owners actually live.
          </h2>
        </div>

        <div className={styles.largeWrapper}>
          <div className={styles.largeCard}>
            <video
              key={feature.id}
              src={feature.video}
              loop
              muted
              playsInline
              autoPlay
              preload="auto"
              className={styles.media}
              aria-label={`${feature.title} walkthrough`}
            />
            <div className={styles.largeScrim} />
            <div className={styles.pills}>
              <span className={styles.pill}>{feature.category}</span>
              <span className={styles.pill}>{feature.price}</span>
            </div>
            <div className={styles.largeTitleRow}>
              <h3 className={styles.largeTitle}>{feature.title}</h3>
            </div>
          </div>
        </div>

        <div className={styles.smallColumn}>
          <div className={styles.smallRow}>
            {secondary.map((property) => (
              <div className={styles.smallCard} key={property.id}>
                <video
                  key={property.id}
                  src={property.video}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className={styles.media}
                  aria-label={`${property.title} walkthrough`}
                />
                <div className={styles.smallScrim} />
                <div className={styles.smallTitleRow}>
                  <h3 className={styles.smallTitle}>{property.title}</h3>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.bottomRow}>
            <p className={styles.desc}>
              Every home here was built turnkey — design, approvals, structure
              and finishing handled end to end by one team.
            </p>
            <div className={styles.navButtons}>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navPrev}`}
                aria-label="Previous property"
                onClick={() => step(-1)}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                className={`${styles.navBtn} ${styles.navNext}`}
                aria-label="Next property"
                onClick={() => step(1)}
              >
                <ChevronRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
