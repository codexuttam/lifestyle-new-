"use client";

import { useState } from "react";
import type { TestimonialRecord } from "@/lib/schemas/testimonial";
import styles from "./Testimonials.module.css";


export default function Testimonials({
  testimonials,
  badge,
}: {
  testimonials: TestimonialRecord[];
  badge: string;
}) {
  const [active, setActive] = useState(0);

  if (testimonials.length === 0) return null;

  // Three passes of the list so the marquee can loop on a one-third shift.
  const track = [...testimonials, ...testimonials, ...testimonials];
  const current = testimonials[active % testimonials.length];

  return (
    <section className={styles.section} id="testimonial-section">
      <div className={styles.container}>
        <div className={styles.quoteBox}>
          <div className={styles.quoteInner}>
            <h2 className={styles.quoteText} key={active}>
              {current.quote}
            </h2>
          </div>
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={`${styles.fade} ${styles.fadeLeft}`} />
          <div className={`${styles.fade} ${styles.fadeRight}`} />
          <div className={styles.marqueeMask}>
            <div className={styles.track}>
              {track.map((person, i) => {
                const personIndex = i % testimonials.length;
                const isActive = personIndex === active;
                return (
                  <button
                    type="button"
                    key={`${person.name}-${i}`}
                    className={`${styles.item}${isActive ? ` ${styles.itemActive}` : ""}`}
                    onClick={() => setActive(personIndex)}
                    aria-pressed={isActive}
                    aria-label={`Read the review from ${person.name}`}
                  >
                    <div className={styles.avatarBox}>
                      <img
                        src={person.avatar}
                        alt=""
                        className={styles.avatar}
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className={styles.infoBlock}>
                      <span className={styles.personName}>{person.name}</span>
                      <span className={styles.personRole}>{person.role}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
