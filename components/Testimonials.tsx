"use client";

import { useEffect, useRef, useState } from "react";
import type { TestimonialRecord } from "@/lib/schemas/testimonial";
import styles from "./Testimonials.module.css";

const PROJECT_CLIPS = [
  {
    id: "aura-walkthrough",
    label: "Aura 15-Storey Tower",
    location: "Congress Nagar, Camp",
    src: "/videos/aura-building-clip-1.mp4",
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
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Pause clip automatically when scrolled offscreen
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !("IntersectionObserver" in window)) return;

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

  return (
    <section className={styles.section} id="testimonial-section">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>{badge || "RESIDENT STORIES & FILMS"}</span>
          <h2 className={styles.heading}>
            REAL WALKTHROUGHS &amp; <span>AMRAVATI FAMILY VOICES</span>
          </h2>
        </div>

        {/* Split Dual-Card Layout: Dark Film Card + Warm Ivory Editorial Quote Card */}
        <div className={styles.splitGrid}>
          {/* Left: Real Project Clips with Play/Pause & Sound Controls */}
          <div className={styles.videoCard}>
            <video
              ref={videoRef}
              key={clip.src}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="metadata"
              poster={clip.poster}
              className={styles.videoEl}
              onClick={togglePlay}
            >
              <source src={clip.src} type="video/mp4" />
            </video>
            <div className={styles.videoScrim} />

            {/* Top Controls: Clip Tag + Floating Sound Pill */}
            <div className={styles.videoTopBar}>
              <span className={styles.clipBadge}>
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
                      0{idx + 1}
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
          <div className={styles.quoteCard}>
            <div className={styles.quoteCardTop}>
              <span className={styles.quoteMark} aria-hidden="true">“</span>
              <span className={styles.quoteCounter}>
                0{activeQuote + 1} / 0{testimonials.length}
              </span>
            </div>

            <blockquote className={styles.quoteText} key={current.id}>
              {current.quote.replace(/^[“"]|[”"]$/g, "")}
            </blockquote>

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
