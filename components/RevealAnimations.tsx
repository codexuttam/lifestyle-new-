"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function RevealAnimations() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
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
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
          });
        }

        if (cards.length > 0) {
          tl.from(
            cards,
            {
              y: 60,
              opacity: 0,
              duration: 1,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=0.6"
          );
        }

        // 3D fold: timeline steps stand upright like dominoes
        if (foldSteps.length > 0) {
          tl.from(
            foldSteps,
            {
              rotationX: -90,
              transformOrigin: "center bottom",
              y: 40,
              opacity: 0,
              duration: 0.9,
              stagger: 0.15,
              ease: "power3.out",
            },
            "-=0.6"
          );
        }
      });

      document.querySelectorAll(".counter").forEach((counter) => {
        ScrollTrigger.create({
          trigger: counter,
          start: "top 85%",
          once: true,
          onEnter: () => {
            const target = Number(counter.getAttribute("data-target") ?? 0);
            gsap.to(counter, {
              innerHTML: target,
              duration: 2,
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
  }, []);

  return null;
}
