"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import AnimatedCounter from "@/components/AnimatedCounter";
import styles from "./About.module.css";

const SPOTLIGHT_SPECS = [
  { key: "Designed For", value: "Discerning 2 & 3 BHK Families" },
  { key: "Prime Address", value: "Congress Nagar Road, Camp" },
  { key: "Developed By", value: "Lifestyle Home Spaces" },
  { key: "Vertical Scale", value: "15 Storeys + Crown Sky Deck" },
];

export default function About({ content }: { content: HomeRecord["about"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stageMode, setStageMode] = useState<"video" | "render">("video");

  useEffect(() => {
    const video = videoRef.current;
    if (!video || stageMode !== "video") return;
    video.muted = true;
    video.play().catch(() => {});

    if (!("IntersectionObserver" in window)) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.15 }
    );
    obs.observe(video);
    return () => obs.disconnect();
  }, [stageMode]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Split monumental words converge horizontally on scroll
      gsap.fromTo(
        "[data-monument-left]",
        { xPercent: -8, opacity: 0.35 },
        {
          xPercent: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        "[data-monument-right]",
        { xPercent: 8, opacity: 0.35 },
        {
          xPercent: 0,
          opacity: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.6,
          },
        }
      );

      // Centerpiece architectural frame expands into full width as user scrolls
      if (frameRef.current) {
        gsap.fromTo(
          frameRef.current,
          { scale: 0.88, y: 48 },
          {
            scale: 1,
            y: 0,
            ease: "power2.out",
            scrollTrigger: {
              trigger: frameRef.current,
              start: "top 88%",
              end: "top 35%",
              scrub: 0.55,
            },
          }
        );
      }

      gsap.from("[data-about-card]", {
        y: 44,
        opacity: 0,
        duration: 0.85,
        stagger: 0.14,
        ease: "power3.out",
        scrollTrigger: {
          trigger: `.${styles.grid}`,
          start: "top 84%",
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -4;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 4;
    el.style.setProperty("--mx", `${x}px`);
    el.style.setProperty("--my", `${y}px`);
    el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    el.style.setProperty("--gop", "1");
  };

  const resetCardPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--gop", "0");
  };

  return (
    <section className={styles.about} id="about-us-section" ref={sectionRef}>
      <div className={styles.container}>
        {/* Monumental Architectural Spotlight Intro */}
        <div className={styles.topIntro}>
          <h2 className={styles.monumentTitle}>
            <span data-monument-left>LIFE BEYOND</span>
            <span className={styles.monumentOutline} data-monument-right>
              IMAGINATION
            </span>
          </h2>
          <p className={styles.statement}>{content.statement}</p>
        </div>

        {/* 4-Column Specification Strip */}
        <div className={styles.specBar}>
          {SPOTLIGHT_SPECS.map((item) => (
            <div className={styles.specCol} key={item.key}>
              <span className={styles.specKey}>{item.key}</span>
              <span className={styles.specVal}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Scroll-Expanding Architectural Showcase Stage (Live Film + 4K Render) */}
        <div className={styles.elevationFrame} ref={frameRef}>
          {stageMode === "video" ? (
            <video
              ref={videoRef}
              src="/videos/aura-showcase-clip.mp4"
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster="/aura/aura-hero-clean-4k.jpg"
              className={styles.elevationImg}
              aria-hidden="true"
            />
          ) : (
            <img
              src="/aura/aura-hero-clean-4k.jpg"
              alt="Aura by Lifestyle 15-Storey Architectural Elevation in Congress Nagar, Camp"
              className={styles.elevationImg}
            />
          )}
          <div className={styles.elevationScrim} />

          {/* Top-right Mode Switcher */}
          <div className={styles.stageModeBar}>
            <button
              type="button"
              className={`${styles.modeBtn}${stageMode === "video" ? ` ${styles.modeBtnActive}` : ""}`}
              onClick={() => setStageMode("video")}
            >
              ▶ Live Architectural Film
            </button>
            <button
              type="button"
              className={`${styles.modeBtn}${stageMode === "render" ? ` ${styles.modeBtnActive}` : ""}`}
              onClick={() => setStageMode("render")}
            >
              ✦ 4K Daylight Elevation
            </button>
          </div>

          <div className={styles.elevationOverlay}>
            <div className={styles.elevationMeta}>
              <h3 className={styles.elevationCaption}>
                A 15-Storey Vertical Sanctuary Rising Over Amravati&apos;s Greenest Neighbourhood
              </h3>
            </div>
            <Link href="/about" className={`${styles.btnMore} roll-button`}>
              <span className="roll-text" data-text={`${content.ctaLabel} →`}>
                {content.ctaLabel} →
              </span>
            </Link>
          </div>
        </div>

        {/* Three 3D Spotlight Benchmark Cards */}
        <div className={styles.grid}>
          {content.cards.map((card, index) => (
            <div
              className={styles.card}
              key={card.label}
              data-about-reveal
              data-about-card
              onMouseMove={handleCardPointer}
              onMouseLeave={resetCardPointer}
            >
              <div className={styles.cardSpotlight} aria-hidden="true" />
              <div className={styles.cardHeader}>
                <span className={styles.cardIndex}>(0{index + 1})</span>
                <span className={styles.cardLabel}>{card.label}</span>
              </div>

              <div className={styles.cardMediaRow}>
                <div className={styles.thumbFrame}>
                  <img
                    src={card.img}
                    alt={card.alt}
                    className={styles.cardImage}
                    loading="lazy"
                  />
                </div>
                <div className={styles.cardStat}>
                  <AnimatedCounter
                    target={card.target}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    className={styles.cardNumber}
                    unitClassName={styles.cardUnit}
                  />
                </div>
              </div>

              <div className={styles.divider} />
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
