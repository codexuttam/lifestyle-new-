"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

export default function Hero({ content }: { content: HomeRecord["hero"] }) {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause hero video when offscreen & run restrained entrance reveal
  useEffect(() => {
    const video = videoRef.current;
    let observer: IntersectionObserver | null = null;

    if (video && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(video);
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => observer?.disconnect();
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-hero-reveal]",
        { y: 20, opacity: 0.01 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          clearProps: "transform,opacity",
        }
      );
      gsap.fromTo(
        "[data-hero-rule]",
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.9,
          ease: "power3.inOut",
          clearProps: "transform",
        }
      );
    }, heroRef);

    return () => {
      observer?.disconnect();
      ctx.revert();
    };
  }, []);

  const handleOpenEnquiry = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lifestyle_open_enquiry", {
          detail: {
            project: "Aura by Lifestyle",
            source: "Hero Section (Aura)",
          },
        })
      );
    }
  };

  return (
    <section className={styles.hero} id="hero-section" ref={heroRef}>
      {/* Full-Screen Architectural Film & Elevation Poster */}
      <div className={styles.videoContainer}>
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/aura/aura-hero-clean-4k.jpg"
          className={styles.heroVideo}
          aria-hidden="true"
        >
          <source src="/videos/aura-showcase-clip.mp4" type="video/mp4" />
        </video>
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.inner}>
        {/* Top Architectural Metadata Row */}
        <div className={styles.topRow} data-hero-reveal>
          <div className={styles.eyebrowGroup}>
            <span className={styles.goldRule} aria-hidden="true" />
            <span className={styles.eyebrow}>CONGRESS NAGAR · CAMP, AMRAVATI</span>
          </div>

          <p className={styles.asideCopy}>
            {content.description}
          </p>
        </div>

        {/* Bottom Monumental Display & Enquiry Actions */}
        <div className={styles.bottomDeck}>
          <div className={styles.headlineWrap} data-hero-reveal>
            <span className={styles.superTitle}>15-STOREY FLAGSHIP LANDMARK BY LIFESTYLE HOME SPACES</span>
            <h1 className={styles.headline}>
              AURA BY LIFESTYLE
              <span className={styles.headlineAccent}>SKYLINE RESIDENCES &amp; ROOFTOP OASIS</span>
            </h1>
          </div>

          <div className={styles.divider} data-hero-rule />

          <div className={styles.footerBar} data-hero-reveal>
            <div className={styles.specList}>
              <div className={styles.specItem}>
                <span className={styles.specKey}>Configurations</span>
                <span className={styles.specVal}>2 &amp; 3 BHK Luxury Suites</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specKey}>Crown Level 15</span>
                <span className={styles.specVal}>Sky Pool &amp; Multi-Sports Turf</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specKey}>MahaRERA Registered</span>
                <span className={styles.specVal}>P5030002502915</span>
              </div>
            </div>

            <div className={styles.btnGroup}>
              <a href="#explore-site-section" className={`${styles.btnExplore} roll-button`}>
                <span className="roll-text" data-text="Explore The Tower ↓">
                  Explore The Tower ↓
                </span>
              </a>
              <button
                type="button"
                onClick={handleOpenEnquiry}
                className={`${styles.btnSchedule} roll-button`}
              >
                <span className="roll-text" data-text="Schedule Private Preview →">
                  Schedule Private Preview →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
