"use client";

import { useState } from "react";
import styles from "./Testimonials.module.css";

const PEOPLE = [
  {
    name: "Rajesh & Priya Malhotra",
    role: "Casa Meridian",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&h=250&q=80",
    quote:
      "“The Premium Construction delivered our dream home exactly on time and within budget. The quality of the RCC structure and finishing is exceptional. Couldn't have asked for a better team.”",
  },
  {
    name: "Amit Sharma",
    role: "Noida Sector 50",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&h=250&q=80",
    quote:
      "“From the first site visit to the final handover, every step was transparent and professional. Our 4BHK turned out better than we imagined.”",
  },
  {
    name: "Sanjay Verma",
    role: "The Ivory Residence",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&h=250&q=80",
    quote:
      "“The dedicated site manager kept us updated daily. We were in Dubai during construction and had zero stress. Truly turnkey.”",
  },
  {
    name: "Neha & Rohit Kapoor",
    role: "DLF Phase 2, Delhi",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&h=250&q=80",
    quote:
      "“Excellent material quality, no hidden costs, and a beautiful finish. The Premium Construction has set a new benchmark in Delhi NCR construction.”",
  },
  {
    name: "Vikram Nair",
    role: "Sector 43, Gurugram",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&h=250&q=80",
    quote:
      "“We compared 6 contractors before choosing The Premium Construction. Best decision we made. The 30-month warranty gave us complete peace of mind.”",
  },
];

/** Three passes of the list so the marquee can loop on a one-third shift. */
const TRACK = [...PEOPLE, ...PEOPLE, ...PEOPLE];

export default function Testimonials() {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section} id="testimonial-section">
      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} aria-hidden="true" />
          <span className={styles.badgeText}>Testimonial</span>
        </div>

        <div className={styles.quoteBox}>
          <div className={styles.quoteInner}>
            <h2 className={styles.quoteText} key={active}>
              {PEOPLE[active].quote}
            </h2>
          </div>
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={`${styles.fade} ${styles.fadeLeft}`} />
          <div className={`${styles.fade} ${styles.fadeRight}`} />
          <div className={styles.marqueeMask}>
            <div className={styles.track}>
              {TRACK.map((person, i) => {
                const personIndex = i % PEOPLE.length;
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
