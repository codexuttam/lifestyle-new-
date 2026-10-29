"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./BuyingJourney.module.css";

const JOURNEY_STEPS = [
  {
    index: "01",
    phase: "ORIENTATION & SELECTION",
    title: "Floor Plate & Vastu Consultation",
    description:
      "Review isometric 2 BHK and 3 BHK cut-sections, sunlight orientation, floor elevation views, and room-by-room dimensions with our senior advisory desk.",
    detail: "Brochure Plates · Congress Nagar Site Office",
  },
  {
    index: "02",
    phase: "EXPERIENCE THE QUALITY",
    title: "Private Camp Site & Delivered DPS Road Tour",
    description:
      "Visit the Aura site on Congress Nagar Road and inspect our already-delivered Lifestyle Home Spaces landmark on DPS Road to verify RCC finish, elevators, and fittings firsthand.",
    detail: "Chauffeured / Scheduled Family Walkthrough",
  },
  {
    index: "03",
    phase: "TRANSPARENT DOCUMENTATION",
    title: "MahaRERA Agreement & Bank Loan Assistance",
    description:
      "Every sanction, title paper, and schedule is publicly verifiable under MahaRERA P5030002502915, supported by smooth home-loan processing with leading nationalized and private banks.",
    detail: "Zero Hidden Charges · Official MahaRERA Compliance",
  },
  {
    index: "04",
    phase: "TURNKEY POSSESSION",
    title: "Milestone Updates, Snag Check & Handover",
    description:
      "Receive structured engineering updates through slab, brickwork, and finishing stages, culminating in a thorough pre-handover snag inspection and 30-month structural warranty.",
    detail: "Accountable In-House Engineering Team",
  },
];

export default function BuyingJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-journey-step]");
      items.forEach((el, idx) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 48%",
          onEnter: () => setActiveStep(idx),
          onEnterBack: () => setActiveStep(idx),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="journey-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.leftIntro}>
          <div className={styles.eyebrowRow}>
            <span className={styles.rule} aria-hidden="true" />
            <span className={styles.eyebrow}>OWNERSHIP TIMELINE</span>
          </div>
          <h2 className={styles.heading}>
            A CLEAR, ACCOUNTABLE PATH <span>FROM FIRST VISIT TO KEYS</span>
          </h2>
          <p className={styles.lead}>
            Purchasing a family residence should feel calm, verifiable, and unhurried. Every stage at Lifestyle Home Spaces is backed by delivered proof in Amravati.
          </p>
          <button
            type="button"
            className={`${styles.ctaBtn} roll-button`}
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("lifestyle_open_enquiry", {
                  detail: { project: "Aura by Lifestyle", source: "Ownership Journey Section" },
                })
              )
            }
          >
            <span className="roll-text" data-text="Begin With A Site Visit →">
              Begin With A Site Visit →
            </span>
          </button>
        </div>

        <div className={styles.timelineCol}>
          {JOURNEY_STEPS.map((step, idx) => {
            const isActive = idx === activeStep;
            return (
              <article
                key={step.index}
                data-journey-step
                className={`${styles.stepCard}${isActive ? ` ${styles.stepCardActive}` : ""}`}
                onClick={() => setActiveStep(idx)}
              >
                <div className={styles.railMarker} aria-hidden="true">
                  <span className={styles.diamond}>✦</span>
                </div>

                <div className={styles.stepHeader}>
                  <span className={styles.stepNum}>{step.index}</span>
                  <span className={styles.stepPhase}>{step.phase}</span>
                </div>

                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.description}</p>
                <span className={styles.stepDetail}>{step.detail}</span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

