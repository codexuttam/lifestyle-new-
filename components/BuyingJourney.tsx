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
    blueprint: "floorplate" as const,
  },
  {
    index: "02",
    phase: "EXPERIENCE THE QUALITY",
    title: "Private Camp Site & Delivered DPS Road Tour",
    description:
      "Visit the Aura site on Congress Nagar Road and inspect our already-delivered Lifestyle Home Spaces landmark on DPS Road to verify RCC finish, elevators, and fittings firsthand.",
    detail: "Chauffeured / Scheduled Family Walkthrough",
    blueprint: "towers" as const,
  },
  {
    index: "03",
    phase: "TRANSPARENT DOCUMENTATION",
    title: "MahaRERA Agreement & Bank Loan Assistance",
    description:
      "Every sanction, title paper, and schedule is publicly verifiable under MahaRERA P5030002502915, supported by smooth home-loan processing with leading nationalized and private banks.",
    detail: "Zero Hidden Charges · Official MahaRERA Compliance",
    blueprint: "compliance" as const,
  },
  {
    index: "04",
    phase: "TURNKEY POSSESSION",
    title: "Milestone Updates, Snag Check & Handover",
    description:
      "Receive structured engineering updates through slab, brickwork, and finishing stages, culminating in a thorough pre-handover snag inspection and 30-month structural warranty.",
    detail: "Accountable In-House Engineering Team",
    blueprint: "handover" as const,
  },
];

function StepBlueprintSvg({
  kind,
  active,
}: {
  kind: (typeof JOURNEY_STEPS)[number]["blueprint"];
  active: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      className={`${styles.blueprintSvg}${active ? ` ${styles.blueprintSvgActive}` : ""}`}
      aria-hidden="true"
    >
      {kind === "floorplate" && (
        <>
          <rect x="10" y="10" width="44" height="44" rx="4" pathLength="1" />
          <path d="M10 30H54M32 10V54M32 42H54" pathLength="1" />
          <circle cx="21" cy="20" r="3" pathLength="1" />
        </>
      )}
      {kind === "towers" && (
        <>
          <path d="M14 54V16L28 10V54M36 54V22L50 18V54M8 54H56" pathLength="1" />
          <path d="M18 22H24M18 30H24M18 38H24M40 28H46M40 36H46" pathLength="1" />
        </>
      )}
      {kind === "compliance" && (
        <>
          <rect x="14" y="8" width="36" height="48" rx="4" pathLength="1" />
          <path d="M22 20H42M22 28H42M22 36H34" pathLength="1" />
          <path d="M34 45L39 50L48 39" pathLength="1" />
        </>
      )}
      {kind === "handover" && (
        <>
          <circle cx="24" cy="32" r="10" pathLength="1" />
          <path d="M34 32H54M46 32V40M52 32V38" pathLength="1" />
          <path d="M16 14L32 6L48 14" pathLength="1" />
        </>
      )}
    </svg>
  );
}

export default function BuyingJourney() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const railProgressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>("[data-journey-step]");

      items.forEach((el, idx) => {
        gsap.fromTo(
          el,
          { opacity: 0, x: 28 },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 86%",
              toggleActions: "play none none none",
            },
          }
        );

        ScrollTrigger.create({
          trigger: el,
          start: "top 62%",
          end: "bottom 48%",
          onEnter: () => setActiveStep(idx),
          onEnterBack: () => setActiveStep(idx),
        });
      });

      if (railProgressRef.current) {
        gsap.fromTo(
          railProgressRef.current,
          { scaleY: 0.08 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 65%",
              end: "bottom 55%",
              scrub: 0.4,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.section} id="journey-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.leftIntro}>
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
          <div className={styles.railProgressTrack} aria-hidden="true">
            <div ref={railProgressRef} className={styles.railProgressFill} />
          </div>

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
                  <span className={styles.connectorLine} />
                </div>

                <div className={styles.stepTopRow}>
                  <div>
                    <div className={styles.stepHeader}>
                      <span className={styles.stepNum}>{step.index}</span>
                      <span className={styles.stepPhase}>{step.phase}</span>
                    </div>
                    <h3 className={styles.stepTitle}>{step.title}</h3>
                  </div>

                  <div className={styles.blueprintBox}>
                    <StepBlueprintSvg kind={step.blueprint} active={isActive} />
                  </div>
                </div>

                <p className={styles.stepDesc}>{step.description}</p>
                <span className={styles.stepDetail}>
                  <span className={styles.detailDiamond} aria-hidden="true">✦</span>
                  {step.detail}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
