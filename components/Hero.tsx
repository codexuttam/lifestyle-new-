"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import styles from "./Hero.module.css";

export default function Hero({ content: _content }: { content: HomeRecord["hero"] }) {
  const heroRef = useRef<HTMLElement>(null);
  const videoFrameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure immediate video playback & offscreen auto-pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});

    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.08 }
    );
    observer.observe(video);

    return () => observer.disconnect();
  }, []);

  // Kinetic masked entrance + Virtuaze 3D clip-path scroll-morph
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      if (!reduced) {
        gsap.fromTo(
          "[data-hero-line]",
          { yPercent: 108, opacity: 0.2 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.1,
            ease: "power4.out",
            clearProps: "transform,opacity",
          }
        );

        gsap.fromTo(
          "[data-hero-fade]",
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            delay: 0.15,
            ease: "power3.out",
            clearProps: "transform,opacity",
          }
        );

        gsap.fromTo(
          "[data-hero-rule]",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.1,
            ease: "power3.inOut",
            delay: 0.18,
            clearProps: "transform",
          }
        );

        if (videoFrameRef.current && videoRef.current) {
          gsap.to(videoFrameRef.current, {
            clipPath: "inset(3.2% 2.8% 4.2% 2.8% round 28px)",
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });

          gsap.to(videoRef.current, {
            scale: 1.14,
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        }
      }
    }, heroRef);

    return () => ctx.revert();
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
      {/* Full-Screen Scroll-Morphing 3D Video Frame (Watermark-Free Clip) */}
      <div className={styles.videoContainer} ref={videoFrameRef}>
        <video
          ref={videoRef}
          src="/videos/aura-showcase-clip.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster="/aura/aura-hero-clean-4k.jpg"
          className={styles.heroVideo}
          aria-hidden="true"
        />
        <div className={styles.heroOverlay} />
      </div>

      <div className={styles.inner}>
        {/* Bottom Monumental Kinetic Display & Enquiry Actions */}
        <div className={styles.bottomDeck}>
          <div className={styles.headlineWrap}>
            <span className={styles.superTitle} data-hero-fade>
              AURA BY LIFESTYLE · THE ART OF BETTER LIVING
            </span>
            <h1 className={styles.headline}>
              <span className={styles.lineMask}>
                <span className={styles.lineInner} data-hero-line>
                  A HOME.
                </span>
              </span>
              <span className={styles.lineMask}>
                <span className={styles.lineInner} data-hero-line>
                  A FEELING.
                </span>
              </span>
              <span className={styles.lineMask}>
                <span className={`${styles.lineInner} ${styles.headlineAccent}`} data-hero-line>
                  AN AURA.
                </span>
              </span>
            </h1>
            <p className={styles.supportingText} data-hero-fade>
              Discover thoughtfully designed spaces where modern architecture meets the art of comfortable living.
            </p>
          </div>

          <div className={styles.divider} data-hero-rule />

          <div className={styles.footerBar} data-hero-fade>
            <div className={styles.specList}>
              <div className={styles.specItem}>
                <span className={styles.specKey}>Configurations</span>
                <span className={styles.specVal}>2 &amp; 3 BHK Luxury Suites</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specKey}>Crown Level 15</span>
                <span className={styles.specVal}>Sky Pool &amp; Sports Turf</span>
              </div>
              <div className={styles.specItem}>
                <span className={styles.specKey}>MahaRERA Registered</span>
                <span className={styles.specVal}>P5030002502915</span>
              </div>
            </div>

            <div className={styles.btnGroup}>
              <a href="#about-aura" className={`${styles.btnExplore} roll-button`}>
                <span className="roll-text" data-text="Discover Aura ↓">
                  Discover Aura ↓
                </span>
              </a>
              <button
                type="button"
                onClick={handleOpenEnquiry}
                className={`${styles.btnSchedule} roll-button`}
              >
                <span className="roll-text" data-text="Enquire Now →">
                  Enquire Now →
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
