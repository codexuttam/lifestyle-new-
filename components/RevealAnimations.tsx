"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevealAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Legacy .reveal-section blocks
      gsap.utils.toArray<HTMLElement>(".reveal-section").forEach((section) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        });

        tl.to(section, { autoAlpha: 1, duration: 0.1 });

        const headers = section.querySelectorAll(
          ".section-header h2, .section-header p, .timeline-line"
        );
        const cards = section.querySelectorAll(
          ".tilt-wrap, .counter-box, .pricing-card, .masonry-item, .contact-card"
        );
        const foldSteps = section.querySelectorAll(".timeline-step");

        if (headers.length > 0) {
          tl.from(headers, {
            y: 36,
            opacity: 0,
            duration: 0.85,
            stagger: 0.14,
            ease: "power3.out",
          });
        }

        if (cards.length > 0) {
          tl.from(
            cards,
            {
              y: 44,
              opacity: 0,
              duration: 0.85,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.5"
          );
        }

        if (foldSteps.length > 0) {
          tl.from(
            foldSteps,
            {
              rotationX: -90,
              transformOrigin: "center bottom",
              y: 36,
              opacity: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: "power3.out",
            },
            "-=0.5"
          );
        }
      });

      // 2. Unified Architectural Scroll Reveals ([data-reveal])
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.from(el, {
          y: 28,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true,
          },
        });
      });

      // 3. Staggered Grid / List Reveals ([data-reveal-group])
      gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
        const items = Array.from(group.children) as HTMLElement[];
        if (!items.length) return;
        gsap.from(items, {
          y: 32,
          opacity: 0,
          duration: 0.78,
          stagger: 0.09,
          ease: "power3.out",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: group,
            start: "top 86%",
            once: true,
          },
        });
      });

      // 4. Scroll-Scrubbed Word Illumination ([data-word-reveal])
      gsap.utils.toArray<HTMLElement>("[data-word-reveal]").forEach((heading) => {
        const words = heading.querySelectorAll("[data-word]");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.24, y: 10 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 86%",
              end: "bottom 54%",
              scrub: 0.45,
            },
          }
        );
      });

      // 5. Cinematic Hero Masked Entrance & 3D Scroll-Morph ([data-hero-stage])
      gsap.utils.toArray<HTMLElement>("[data-hero-stage]").forEach((hero) => {
        const lines = hero.querySelectorAll("[data-hero-line]");
        const fades = hero.querySelectorAll("[data-hero-fade]");
        const rules = hero.querySelectorAll("[data-hero-rule]");
        const frame = hero.querySelector<HTMLElement>("[data-hero-frame]");
        const video = hero.querySelector<HTMLElement>("[data-hero-video]");

        if (lines.length) {
          gsap.fromTo(
            lines,
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
        }

        if (fades.length) {
          gsap.fromTo(
            fades,
            { y: 22, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              stagger: 0.08,
              delay: 0.14,
              ease: "power3.out",
              clearProps: "transform,opacity",
            }
          );
        }

        if (rules.length) {
          gsap.fromTo(
            rules,
            { scaleX: 0 },
            {
              scaleX: 1,
              duration: 1.05,
              ease: "power3.inOut",
              delay: 0.18,
              clearProps: "transform",
            }
          );
        }

        if (frame) {
          gsap.to(frame, {
            clipPath: "inset(3.2% 2.8% 4.2% 2.8% round 28px)",
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        }

        if (video) {
          gsap.to(video, {
            scale: 1.12,
            yPercent: 7,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          });
        }
      });

      // 6. Numeric Counters
      document.querySelectorAll(".counter").forEach((counter) => {
        ScrollTrigger.create({
          trigger: counter,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const target = Number(counter.getAttribute("data-target") ?? 0);
            gsap.to(counter, {
              innerHTML: target,
              duration: 1.8,
              ease: "power2.out",
              snap: { innerHTML: 1 },
              onUpdate: function (this: gsap.core.Tween) {
                const el = this.targets()[0] as HTMLElement;
                counter.innerHTML = String(Math.round(Number(el.innerHTML)));
              },
            });
          },
        });
      });

      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, [pathname]);

  return null;
}
