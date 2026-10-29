"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import EnquiryModal from "@/components/EnquiryModal";
import styles from "./VslSection.module.css";

/** Fraction of the video (30%) after which the enquiry form appears automatically. */
const AUTO_POPUP_AT = 0.3;

interface VslSectionProps {
  /** Unique id for the section (also used as the anchor). */
  id?: string;
  project: string;
  preference?: string;
  /** Recorded in the CRM, e.g. "VSL Popup (Lifestyle Home Spaces)". */
  source?: string;
  /** Video file or URL. */
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
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [activePreference, setActivePreference] = useState(preference);

  const autoOpen = useCallback(() => {
    if (autoTriggeredRef.current) return;
    autoTriggeredRef.current = true;
    const video = videoRef.current;
    if (video && !video.paused && !video.ended) {
      video.pause();
      resumeOnCloseRef.current = true;
    }
    setActivePreference(preference);
    setIsEnquiryOpen(true);
  }, [preference]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      if (!video.duration || !isFinite(video.duration)) return;
      if (video.currentTime < 1) {
        autoTriggeredRef.current = false;
      }
      if (video.currentTime / video.duration >= AUTO_POPUP_AT) {
        autoOpen();
      }
    };

    const onEnded = () => autoOpen();

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("ended", onEnded);
    };
  }, [autoOpen]);

  const openFromCta = (pref: string) => {
    resumeOnCloseRef.current = false;
    videoRef.current?.pause();
    setActivePreference(pref);
    setIsEnquiryOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsEnquiryOpen(false);
    if (resumeOnCloseRef.current) {
      resumeOnCloseRef.current = false;
      videoRef.current?.play().catch(() => {});
    }
  }, []);

  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={styles.inner}>
        <div className={styles.videoCol} data-reveal>
          <div className={styles.videoFrame}>
            <video
              ref={videoRef}
              className={styles.video}
              src={videoSrc}
              poster={poster}
              controls
              playsInline
              preload="metadata"
            >
              Your browser does not support HTML5 video.
            </video>
          </div>
        </div>

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
            <button
              type="button"
              className={`${styles.secondaryCta} roll-button`}
              onClick={() => openFromCta("Floor Plans & Pricing Details")}
            >
              <span className="roll-text" data-text={secondaryCta}>
                {secondaryCta}
              </span>
            </button>
            <Link
              href="/contact"
              className={`${styles.contactLinkCta} roll-button`}
            >
              <span className="roll-text" data-text="Contact Sales Desk →">
                Contact Sales Desk →
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Official Lifestyle VIP CRM Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={handleClose}
        projectTitle={project}
        defaultPreference={activePreference}
        source={source || `VSL Popup (${project})`}
      />
    </section>
  );
}
