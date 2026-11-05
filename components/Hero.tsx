"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./Hero.module.css";
import EnquiryModal from "@/components/EnquiryModal";
import AuthOtpModal from "@/components/AuthOtpModal";
import type { HomeRecord } from "@/lib/schemas/home";

export default function Hero({ content }: { content?: HomeRecord["hero"] }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Respect user's motion preferences & skip heavy transforms on mobile
    if (typeof window === "undefined") return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth <= 768;
    if (prefersReducedMotion || isMobile) return;

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (heroRef.current && imageWrapRef.current) {
            const rect = heroRef.current.getBoundingClientRect();
            const scrollProgress = Math.max(0, -rect.top) / (rect.height || 1);
            if (scrollProgress <= 1.2) {
              // Gentle camera-like push & subtle vertical parallax
              const translateY = scrollProgress * 50; // subtle 50px drift
              const scale = 1.02 + scrollProgress * 0.04; // subtle 1.02 to 1.06 scale
              imageWrapRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToNextSection = () => {
    const target = document.getElementById("about") || document.getElementById("tower-features");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero} id="hero-section" ref={heroRef} aria-label="Aura Hero">
      {/* Visual Anchor: Tower Render with Camera Scroll Motion */}
      <div className={styles.mediaWrap} ref={imageWrapRef}>
        <Image
          src="/aura/exterior-elevation-day-hd.jpg"
          alt="Aura 15-Storey Daytime Architectural Landmark, Camp Amravati"
          fill
          priority
          sizes="100vw"
          className={styles.mediaImage}
        />
        {/* Cinematic Scrims: Multi-layer gradient ensuring headline readability and seamless blend into next section */}
        <div className={styles.mediaOverlay} />
        <div className={styles.bottomBlend} />
      </div>

      {/* Hero Content Grid: High-contrast legible typography & accessible CTA */}
      <div className={styles.contentGrid}>
        {/* Left: Signature Editorial Headline */}
        <div className={styles.headlineWrap}>
          <span className={styles.eyebrowTag}>FLAGSHIP RESIDENTIAL LANDMARK</span>
          <h1 className={styles.headlineLine}>MATERIAL.</h1>
          <h2 className={styles.headlineLine}>
            <span className={styles.swashInitial}>M</span>EANING.
          </h2>
          <h2 className={styles.headlineLine}>AURA.</h2>
        </div>

        {/* Right: Project Narrative, Verified Specifications & Primary CTAs */}
        <div className={styles.narrativeCol}>
          <p className={styles.description}>
            Amravati&apos;s premier 15-storey architectural highrise featuring expansive 2 &amp; 3 BHK luxury residences, zero shared walls, and Level 15 rooftop infinity sky leisure deck.
          </p>

          <div className={styles.heroActions}>
            <button
              type="button"
              className={styles.ctaPrimary}
              onClick={() => {
                setIsAuthOpen(true);
                if (typeof window !== "undefined") {
                  window.dispatchEvent(new CustomEvent("lifestyle_open_auth"));
                }
              }}
              aria-label="Sign in to get in touch with sales desk"
            >
              <span>GET IN TOUCH</span>
              <span className={styles.arrow} aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className={styles.ctaSecondary}
              onClick={scrollToNextSection}
              aria-label="Explore residences and tower features"
            >
              <span>EXPLORE RESIDENCES</span>
              <span className={styles.downArrow} aria-hidden="true">↓</span>
            </button>
          </div>
        </div>
      </div>

      {/* Member Sign-In / Get in Touch Modal */}
      <AuthOtpModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Official Project Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        projectTitle="Aura by Lifestyle"
        defaultPreference="Get Brochure on WhatsApp"
        source="Hero Section (Aura)"
      />
    </section>
  );
}
