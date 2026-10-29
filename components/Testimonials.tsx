"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { TestimonialRecord } from "@/lib/schemas/testimonial";
import styles from "./Testimonials.module.css";

const PROJECT_CLIPS = [
  {
    id: "aura-walkthrough",
    label: "Aura 15-Storey Tower",
    location: "Congress Nagar, Camp",
    src: "/videos/aura-showcase-clip.mp4",
    poster: "/aura/aura-hero-clean-4k.jpg",
  },
  {
    id: "lifestyle-vsl",
    label: "Lifestyle Walkthrough Film",
    location: "DPS Road & Camp Portfolio",
    src: "/videos/lifestyle-vsl.mp4",
    poster: "/assets/projects/lifestyle-homes/gallery/lifestyle-elevation-day.jpg",
  },
  {
    id: "dps-delivered",
    label: "Delivered Residences Clip",
    location: "DPS Road, Parvati Nagar",
    src: "/videos/lifestyle-showcase-clip.mp4",
    poster: "/assets/projects/lifestyle-homes/gallery/lifestyle-shops-commercial.jpg",
  },
];

export default function Testimonials({
  testimonials,
  badge,
}: {
  testimonials: TestimonialRecord[];
  badge: string;
}) {
  const [activeQuote, setActiveQuote] = useState(0);
  const [activeClip, setActiveClip] = useState(0);
  const [clipProgress, setClipProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const quoteBodyRef = useRef<HTMLDivElement>(null);

  // GSAP scroll-reveal entrance for the dual cards
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-testimonial-card]",
        { opacity: 0, y: 42, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.14,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animate quote body smoothly when switching reviews
  useEffect(() => {
    if (!quoteBodyRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      quoteBodyRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }
    );
  }, [activeQuote]);

  // Pause clip automatically when scrolled offscreen
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;
    setClipProgress(0);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video
            .play()
            .then(() => setIsPlaying(true))
            .catch(() => setIsPlaying(false));
        } else {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [activeClip]);

  if (testimonials.length === 0) return null;

  const current = testimonials[activeQuote % testimonials.length];
  const clip = PROJECT_CLIPS[activeClip];

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && video.paused) {
      video.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setClipProgress(Math.min(100, (video.currentTime / video.duration) * 100));
  };

  return (
    <section className={styles.section} id="testimonial-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.heading}>
            REAL WALKTHROUGHS &amp; <span>AMRAVATI FAMILY VOICES</span>
          </h2>
        </div>

        {/* Split Dual-Card Layout: Dark Film Card + Warm Ivory Editorial Quote Card */}
        <div className={styles.splitGrid}>
          {/* Left: Real Project Clips with Story Progress, Play/Pause & Sound Controls */}
          <div className={styles.videoCard} data-testimonial-card>
            <video
              ref={videoRef}
              key={clip.src}
              src={clip.src}
              autoPlay
              muted={isMuted}
              playsInline
              preload="metadata"
              poster={clip.poster}
              className={styles.videoEl}
              onClick={togglePlay}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setActiveClip((prev) => (prev + 1) % PROJECT_CLIPS.length)}
            />
            <div className={styles.videoScrim} />

            {/* Top Wrapper: Story Progress Bars + Clip Tag + Sound Pill */}
            <div className={styles.videoTopCluster}>
              <div className={styles.storyBars} aria-hidden="true">
                {PROJECT_CLIPS.map((c, idx) => {
                  const widthPct =
                    idx < activeClip ? 100 : idx === activeClip ? clipProgress : 0;
                  return (
                    <span key={c.id} className={styles.storyBarTrack}>
                      <span
                        className={styles.storyBarFill}
                        style={{ width: `${widthPct}%` }}
                      />
                    </span>
                  );
                })}
              </div>

              <div className={styles.videoTopBar}>
                <span className={styles.clipBadge}>
                  <span className={styles.liveDot} aria-hidden="true" />
                  0{activeClip + 1} · {clip.label}
                </span>

                <button
                  type="button"
                  className={styles.soundPill}
                  onClick={toggleMute}
                  aria-pressed={!isMuted}
                  aria-label={isMuted ? "Unmute project video" : "Mute project video"}
                >
                  {isMuted ? "🔇 Tap for sound" : "🔊 Sound on"}
                </button>
              </div>
            </div>

            {/* Bottom Controls: Play/Pause + Clip Switcher Dots */}
            <div className={styles.videoBottomBar}>
              <div className={styles.clipCaption}>
                <span className={styles.clipLoc}>{clip.location}</span>
                <div className={styles.clipTabs} role="tablist" aria-label="Choose project clip">
                  {PROJECT_CLIPS.map((c, idx) => (
                    <button
                      key={c.id}
                      type="button"
                      role="tab"
                      aria-selected={idx === activeClip}
                      className={`${styles.clipDotBtn}${idx === activeClip ? ` ${styles.clipDotActive}` : ""}`}
                      onClick={() => setActiveClip(idx)}
                    >
                      0{idx + 1} · {c.label.split(" ")[0]}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className={styles.playBtn}
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                {isPlaying ? "❚❚" : "▶"}
              </button>
            </div>
          </div>

          {/* Right: Warm Ivory Editorial Quote Card */}
          <div className={styles.quoteCard} data-testimonial-card>
            <div className={styles.quoteCardTop}>
              <div className={styles.trustCluster}>
                <div className={styles.stackedAvatars} aria-hidden="true">
                  {testimonials.slice(0, 4).map((person) => (
                    <img
                      key={person.id}
                      src={person.avatar}
                      alt=""
                      className={styles.stackedAvatarImg}
                      loading="lazy"
                    />
                  ))}
                </div>
                <div className={styles.ratingMeta}>
                  <span className={styles.stars} aria-label="5 out of 5 stars">
                    ★★★★★
                  </span>
                  <span className={styles.verifiedTag}>Verified Amravati Homeowners</span>
                </div>
              </div>

              <span className={styles.quoteCounter}>
                0{activeQuote + 1} / 0{testimonials.length}
              </span>
            </div>

            <div ref={quoteBodyRef} className={styles.quoteBodyWrap}>
              <span className={styles.quoteMark} aria-hidden="true">“</span>
              <blockquote className={styles.quoteText}>
                {current.quote.replace(/^[“"]|[”"]$/g, "")}
              </blockquote>
            </div>

            <div className={styles.authorBlock}>
              <div className={styles.authorIdentity}>
                <img
                  src={current.avatar}
                  alt={current.name}
                  className={styles.authorAvatar}
                  loading="lazy"
                />
                <div>
                  <div className={styles.authorName}>{current.name}</div>
                  <div className={styles.authorRole}>{current.role}</div>
                </div>
              </div>

              <div className={styles.quoteNav}>
                <button
                  type="button"
                  className={styles.quoteArrow}
                  aria-label="Previous testimonial"
                  onClick={() =>
                    setActiveQuote((prev) => (prev - 1 + testimonials.length) % testimonials.length)
                  }
                >
                  ←
                </button>
                <button
                  type="button"
                  className={styles.quoteArrow}
                  aria-label="Next testimonial"
                  onClick={() =>
                    setActiveQuote((prev) => (prev + 1) % testimonials.length)
                  }
                >
                  →
                </button>
              </div>
            </div>

            {/* Avatar Selector Strip */}
            <div className={styles.avatarStrip} role="tablist" aria-label="Select resident review">
              {testimonials.map((person, idx) => {
                const isSelected = idx === activeQuote;
                return (
                  <button
                    key={person.id}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`${styles.avatarPill}${isSelected ? ` ${styles.avatarPillActive}` : ""}`}
                    onClick={() => setActiveQuote(idx)}
                  >
                    <img src={person.avatar} alt="" className={styles.avatarThumb} loading="lazy" />
                    <span className={styles.avatarFirstName}>{person.name.split(" ")[0]}</span>
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
