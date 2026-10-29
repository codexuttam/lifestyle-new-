"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { HomeRecord } from "@/lib/schemas/home";
import type { ProjectRecord } from "@/lib/schemas/project";
import styles from "./Properties.module.css";

function getProjectHref(id: string) {
  if (id === "lifestyle-homes") return "/projects/lifestyle-homes";
  if (id === "lifestyle-retail-galleria") return "/projects/lifestyle-homes#commercial-shops";
  if (id === "aura") return "#floor-plans";
  return "/projects";
}

function getDeckTransform(idx: number, activeIdx: number) {
  const diff = idx - activeIdx;
  if (diff === 0) {
    return {
      transform: "translate3d(0px, 0px, 0px) rotateZ(0deg) scale(1)",
      opacity: 1,
      zIndex: 30,
      filter: "brightness(1)",
    };
  }
  if (diff > 0) {
    const clamped = Math.min(diff, 2);
    return {
      transform: `translate3d(${clamped * 30}px, ${clamped * 15}px, ${-clamped * 50}px) rotateZ(${clamped * 2.8}deg) scale(${1 - clamped * 0.055})`,
      opacity: Math.max(0.32, 0.85 - diff * 0.22),
      zIndex: 30 - diff,
      filter: "brightness(0.6)",
    };
  }
  const abs = Math.min(Math.abs(diff), 2);
  return {
    transform: `translate3d(${-abs * 30}px, ${-abs * 12}px, ${-abs * 60}px) rotateZ(${-abs * 2.8}deg) scale(${1 - abs * 0.06})`,
    opacity: 0.36,
    zIndex: 20 - abs,
    filter: "brightness(0.48)",
  };
}

export default function Properties({
  projects,
  content,
}: {
  projects: ProjectRecord[];
  content: HomeRecord["properties"];
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const runwayRef = useRef<HTMLDivElement>(null);

  const total = projects.length;

  // Scroll-scrubbed word reveal on section heading
  useEffect(() => {
    if (total === 0) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const words = headingRef.current?.querySelectorAll(`.${styles.word}`);
      if (words?.length) {
        gsap.fromTo(
          words,
          { opacity: 0.28, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.09,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headingRef.current,
              start: "top 86%",
              end: "bottom 54%",
              scrub: 0.45,
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [total]);

  // Native CSS Sticky Scroll Progress across Portfolio Projects
  useEffect(() => {
    if (total <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    const updateFromScroll = () => {
      rafId = 0;
      if (window.innerWidth < 1024) return;
      const runway = runwayRef.current;
      if (!runway) return;

      const rect = runway.getBoundingClientRect();
      const stickyOffset = 88;
      const scrollable = rect.height - (window.innerHeight - stickyOffset);
      if (scrollable <= 0) return;

      const scrolled = stickyOffset - rect.top;
      const progress = Math.min(0.9999, Math.max(0, scrolled / scrollable));
      const idx = Math.floor(progress * total);
      setActiveIdx((prev) => (prev === idx ? prev : idx));
    };

    const onScroll = () => {
      if (!rafId) {
        rafId = window.requestAnimationFrame(updateFromScroll);
      }
    };

    updateFromScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [total]);

  if (total === 0) return null;

  const handleSelectProject = (idx: number) => {
    setActiveIdx(idx);
    const runway = runwayRef.current;
    if (runway && window.innerWidth >= 1024) {
      const stickyOffset = 88;
      const runwayTop = runway.getBoundingClientRect().top + window.scrollY;
      const scrollable = runway.offsetHeight - (window.innerHeight - stickyOffset);
      if (scrollable > 0) {
        const targetY =
          runwayTop - stickyOffset + ((idx + 0.35) / total) * scrollable;
        window.scrollTo({ top: targetY, behavior: "smooth" });
      }
    }
  };

  const feature = projects[activeIdx % total];
  const headingWords = content.heading.trim().split(/\s+/);

  return (
    <section className={styles.properties} id="properties-section" ref={sectionRef}>
      <div className={styles.container}>
        <div className={styles.topHeader}>
          <h2 className={styles.heading} ref={headingRef}>
            {headingWords.map((word, idx) => (
              <span key={`${word}-${idx}`}>
                <span className={styles.word}>{word}</span>
                {idx < headingWords.length - 1 ? " " : ""}
              </span>
            ))}
          </h2>
          <p className={styles.desc}>{content.description}</p>
        </div>

        {/* Desktop Sticky Scroll-Driven 3D Portfolio Runway */}
        <div className={styles.desktopRunway} ref={runwayRef}>
          <div className={styles.desktopSticky}>
            <div
              className={styles.selectorRail}
              style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
              role="tablist"
              aria-label="Select landmark project"
            >
              {projects.map((proj, idx) => {
                const isActive = idx === activeIdx % total;
                return (
                  <button
                    key={proj.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.railBtn}${isActive ? ` ${styles.railBtnActive}` : ""}`}
                    onClick={() => handleSelectProject(idx)}
                  >
                    <span className={styles.railIndex}>(0{idx + 1})</span>
                    <span className={styles.railLabel}>{proj.title}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.stageCard}>
              <div className={styles.stageCopy}>
                <div className={styles.stageMetaRow}>
                  <span className={styles.stageNumber}>(0{(activeIdx % total) + 1})</span>
                  <span className={styles.stageLocation}>
                    {feature.location} · {feature.status}
                  </span>
                </div>

                <h3 className={styles.stageTitle} key={feature.id}>
                  {feature.title}
                </h3>
                <p className={styles.stageSummary}>{feature.summary}</p>

                <div className={styles.metricsBar}>
                  <div className={styles.metricCell}>
                    <span className={styles.metricKey}>Typology</span>
                    <span className={styles.metricVal}>{feature.beds}</span>
                  </div>
                  <div className={styles.metricCell}>
                    <span className={styles.metricKey}>Area Range</span>
                    <span className={styles.metricVal}>{feature.area}</span>
                  </div>
                  <div className={styles.metricCell}>
                    <span className={styles.metricKey}>Pricing</span>
                    <span className={styles.metricVal}>{feature.price}</span>
                  </div>
                </div>

                <div className={styles.primaryActions}>
                  <Link
                    href={getProjectHref(feature.id)}
                    className={`${styles.btnPrimary} roll-button`}
                  >
                    <span className="roll-text" data-text="Explore Development →">
                      Explore Development →
                    </span>
                  </Link>
                  <Link href="/projects" className={styles.viewAllLink}>
                    {content.ctaLabel} →
                  </Link>
                </div>

                <div className={styles.bottomBar}>
                  <div className={styles.progressFooter}>
                    <div className={styles.progressTrack}>
                      <div
                        className={styles.progressFill}
                        style={{ width: `${(((activeIdx % total) + 1) / total) * 100}%` }}
                      />
                    </div>
                    <span className={styles.progressCount}>
                      0{(activeIdx % total) + 1} / 0{total}
                    </span>
                  </div>

                  <div className={styles.deckControls}>
                    <button
                      type="button"
                      className={styles.deckStepBtn}
                      onClick={() => handleSelectProject((activeIdx - 1 + total) % total)}
                      aria-label="Previous project"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      className={styles.deckStepBtn}
                      onClick={() => handleSelectProject((activeIdx + 1) % total)}
                      aria-label="Next project"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.deckStage}>
                {projects.map((proj, idx) => {
                  const isFront = idx === activeIdx % total;
                  const styleObj = getDeckTransform(idx, activeIdx % total);
                  return (
                    <div
                      key={proj.id}
                      className={`${styles.flyingCard}${isFront ? ` ${styles.flyingCardActive}` : ""}`}
                      style={styleObj}
                      onClick={() => handleSelectProject(idx)}
                      role="button"
                      tabIndex={0}
                      aria-label={`Focus (0${idx + 1}) ${proj.title}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectProject(idx);
                        }
                      }}
                    >
                      {proj.video && isFront ? (
                        <video
                          src={proj.video}
                          poster={proj.img}
                          autoPlay
                          loop
                          muted
                          playsInline
                          preload="metadata"
                          className={styles.flyingMedia}
                          aria-hidden="true"
                        />
                      ) : (
                        <img
                          src={proj.img}
                          alt={proj.title}
                          className={styles.flyingMedia}
                          loading="lazy"
                        />
                      )}
                      <div className={styles.flyingScrim} />
                      <div className={styles.flyingCardCaption}>
                        <div className={styles.flyingIndexRow}>
                          <span className={styles.flyingLine} />
                          <span>(0{idx + 1}) · {proj.category}</span>
                        </div>
                        <h4 className={styles.flyingTitle}>{proj.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Stack */}
        <div className={styles.mobileStack}>
          {projects.map((proj, idx) => (
            <article className={styles.mobileCard} key={proj.id}>
              <div className={styles.mobileImgWrap}>
                {proj.video ? (
                  <video
                    src={proj.video}
                    poster={proj.img}
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    className={styles.mobileImg}
                    aria-hidden="true"
                  />
                ) : (
                  <img
                    src={proj.img}
                    alt={proj.title}
                    className={styles.mobileImg}
                    loading="lazy"
                  />
                )}
              </div>
              <div className={styles.mobileBody}>
                <span className={styles.mobileIndex}>
                  (0{idx + 1}) · {proj.location}
                </span>
                <h3 className={styles.mobileTitle}>{proj.title}</h3>
                <p className={styles.mobileDesc}>{proj.summary}</p>
                <Link
                  href={getProjectHref(proj.id)}
                  className={`${styles.btnPrimary} roll-button`}
                >
                  <span className="roll-text" data-text="Explore Development →">
                    Explore Development →
                  </span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
