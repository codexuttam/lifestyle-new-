"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import EnquiryModal from "@/components/EnquiryModal";
import styles from "./VslSection.module.css";

/** Fraction of the video (30%) after which the enquiry form appears automatically. */
const AUTO_POPUP_AT = 0.3;

interface VslSectionProps {
  id?: string;
  project: string;
  preference?: string;
  source?: string;
  videoSrc: string;
  poster?: string;
  eyebrow?: string;
  headline: string;
  intro: string;
  points: string[];
  primaryCta?: string;
  secondaryCta?: string;
}

export default function VslSection({
  id = "vsl",
  project = "Lifestyle Home Spaces",
  preference = "Ready Possession 2 & 3 BHK",
  source,
  videoSrc,
  poster,
  eyebrow = "",
  headline,
  intro,
  points,
  primaryCta = "Schedule Site Visit →",
  secondaryCta = "Request Floor Kit",
}: VslSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const autoTriggeredRef = useRef(false);
  const resumeOnCloseRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [activePreference, setActivePreference] = useState(preference);

  const autoOpen = useCallback(() => {
    if (autoTriggeredRef.current) return;
    autoTriggeredRef.current = true;
    const video = videoRef.current;
    if (video && !video.paused && !video.ended) {
      video.pause();
      setIsPlaying(false);
      resumeOnCloseRef.current = true;
    }
    setActivePreference(preference);
    setIsEnquiryOpen(true);
  }, [preference]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => setHasError(true);

    const onTimeUpdate = () => {
      if (!video.duration || !isFinite(video.duration)) return;
      if (video.currentTime < 1) {
        autoTriggeredRef.current = false;
      }
      if (video.currentTime / video.duration >= AUTO_POPUP_AT) {
        autoOpen();
      }
    };

    const onEnded = () => {
      setIsPlaying(false);
      autoOpen();
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("error", onError);
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("error", onError);
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [autoOpen]);

  // Autoplay video muted smoothly when user scrolls into section
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.muted = true;
            setIsMuted(true);
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise.then(() => setIsPlaying(true)).catch(() => {
                setIsPlaying(false);
              });
            }
          } else {
            if (!video.paused && !video.ended) {
              video.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

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

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const openFromCta = (pref: string) => {
    resumeOnCloseRef.current = false;
    videoRef.current?.pause();
    setIsPlaying(false);
    setActivePreference(pref);
    setIsEnquiryOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsEnquiryOpen(false);
    if (resumeOnCloseRef.current) {
      resumeOnCloseRef.current = false;
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.inner}>
        {/* Video Player Column with Obvious Play Control & Graceful Fallback */}
        <div className={styles.videoCol} data-reveal>
          <div className={styles.videoFrame} onClick={!hasError ? togglePlay : undefined}>
            {!hasError ? (
              <>
                <video
                  ref={videoRef}
                  className={styles.video}
                  src={videoSrc}
                  poster={poster}
                  playsInline
                  muted={isMuted}
                  preload="metadata"
                >
                  Your browser does not support HTML5 video.
                </video>

                {/* Obvious Play / Pause Overlay */}
                <div
                  className={`${styles.playOverlay} ${!isPlaying ? styles.playOverlayVisible : ""}`}
                  aria-label={isPlaying ? "Pause video walkthrough" : "Play video walkthrough"}
                >
                  <button type="button" className={styles.playCircle} onClick={togglePlay}>
                    <span className={styles.playIcon} aria-hidden="true">
                      {isPlaying ? "❚❚" : "▶"}
                    </span>
                  </button>
                  <span className={styles.playLabel}>
                    {isPlaying ? "Tap to Pause" : "Play Architectural Walkthrough"}
                  </span>
                </div>

                {/* Audio Mute/Unmute Badge Button */}
                <button
                  type="button"
                  className={styles.audioToggleBtn}
                  onClick={toggleMute}
                  aria-label={isMuted ? "Unmute video audio" : "Mute video audio"}
                >
                  {isMuted ? "🔇 Muted" : "🔊 Sound On"}
                </button>
              </>
            ) : (
              /* Graceful Fallback if playback unavailable */
              <div className={styles.fallbackBox}>
                {poster && (
                  <img
                    src={poster}
                    alt={`${project} preview`}
                    className={styles.fallbackImg}
                  />
                )}
                <div className={styles.fallbackOverlay}>
                  <p className={styles.fallbackText}>
                    Direct video stream momentarily unavailable on this connection.
                  </p>
                  <button
                    type="button"
                    className={styles.fallbackBtn}
                    onClick={() => openFromCta("WhatsApp Video Request")}
                  >
                    Receive Official Video on WhatsApp →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Narrative & Specifications Column */}
        <div className={styles.copyCol} data-reveal>
          {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
          <h2 id={`${id}-title`} className={styles.headline}>
            {headline}
          </h2>
          <p className={styles.intro}>{intro}</p>

          <ul className={styles.points}>
            {points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <div className={styles.ctaRow}>
            <button
              type="button"
              className={`${styles.primaryCta} roll-button`}
              onClick={() => openFromCta(preference)}
            >
              <span className="roll-text" data-text={primaryCta}>
                {primaryCta}
              </span>
            </button>

            {secondaryCta && (
              <button
                type="button"
                className={styles.secondaryCta}
                onClick={() => openFromCta(secondaryCta)}
              >
                <span>{secondaryCta}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Official CRM Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleClose}
        projectTitle={project}
        defaultPreference={activePreference}
        source={source || `VSL Section (${project})`}
      />
    </section>
  );
}
