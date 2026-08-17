"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ExploreSection.module.css";

const HEADLINE =
  "Building Exceptional Residential Communities Designed To Elevate Everyday Living And Create Lasting Value For Generations.";

const PROJECT = {
  label: "Project 01",
  title: "Casa Meridian, Gurugram",
  sublabel: "Interior Finishing",
  /** Completion the progress bar and counter climb to. */
  progress: 85,
};

function SofaIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" />
      <path d="M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z" />
      <path d="M4 18v2" />
      <path d="M20 18v2" />
      <path d="M12 4v9" />
    </svg>
  );
}

export default function ExploreSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      if (barRef.current) barRef.current.style.width = `${PROJECT.progress}%`;
      if (percentRef.current) percentRef.current.textContent = `${PROJECT.progress}%`;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Words brighten one after another as the headline crosses the viewport.
      const words = headingRef.current?.querySelectorAll(`.${styles.word}`);
      if (words?.length) {
        gsap.to(words, {
          opacity: 1,
          ease: "none",
          stagger: 1,
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            end: "bottom 45%",
            scrub: 0.5,
          },
        });
      }

      // The panel settles into place, and the card's meter fills alongside it.
      gsap.fromTo(
        panelRef.current,
        { y: 60, scale: 0.95, opacity: 0.9 },
        {
          y: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: panelRef.current,
            start: "top 90%",
            end: "top 40%",
            scrub: 0.5,
          },
        }
      );

      const meter = { value: 0 };
      gsap.to(meter, {
        value: PROJECT.progress,
        ease: "none",
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 80%",
          end: "center 55%",
          scrub: 0.5,
        },
        onUpdate: () => {
          const rounded = Math.round(meter.value);
          if (barRef.current) barRef.current.style.width = `${meter.value}%`;
          if (percentRef.current) percentRef.current.textContent = `${rounded}%`;
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.explore} id="explore-site-section" ref={sectionRef}>
      <div className={styles.tag}>
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.tagText}>Explore more</span>
      </div>

      <div className={styles.headingContainer}>
        <h2 className={styles.heading} ref={headingRef}>
          {HEADLINE.split(" ").map((word, i) => (
            <span className={styles.word} key={`${word}-${i}`}>
              {word}
            </span>
          ))}
        </h2>
      </div>

      <div className={styles.mediaPanel} ref={panelRef}>
        <video
          autoPlay
          loop
          muted
          playsInline
          className={styles.video}
          aria-hidden="true"
        >
          <source
            src="https://cdn.jiro.build/Real%20Estate%20-%20Ospey/video/Explore%20Video.mp4"
            type="video/mp4"
          />
        </video>

        <div className={styles.cardWrapper}>
          <div className={styles.card}>
            <div className={styles.cardTopRow}>
              <div className={styles.iconWrapper}>
                <SofaIcon />
              </div>
              <div className={styles.cardInfo}>
                <span className={styles.cardLabel}>{PROJECT.label}</span>
                <span className={styles.cardTitle}>{PROJECT.title}</span>
              </div>
            </div>

            <div className={styles.cardMiddleRow}>
              <span className={styles.cardPercentage} ref={percentRef}>
                0%
              </span>
            </div>

            <div className={styles.sliderWrapper}>
              <div className={styles.sliderTrack}>
                <div className={styles.sliderFill} ref={barRef} />
              </div>
            </div>

            <div className={styles.cardBottomRow}>
              <span className={styles.cardSublabel}>{PROJECT.sublabel}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
