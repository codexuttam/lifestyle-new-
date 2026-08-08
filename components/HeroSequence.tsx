"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TOTAL_FRAMES = 213;
const SCROLL_DISTANCE = 4000;

const STAGES = [
  {
    id: "stage-1",
    title: (
      <>
        Every Legacy
        <br />
        Starts With Land
      </>
    ),
    body: "From bare earth to built dreams — we transform empty plots into architectural masterpieces, one vision at a time.",
    cta: "See Our Projects",
  },
  {
    id: "stage-2",
    title: (
      <>
        A Strong Base
        <br />
        For The Future
      </>
    ),
    body: "Laying an unshakable foundation. Every column and beam is engineered with precision to ensure your home stands the test of time.",
    cta: "Our Build Process",
  },
  {
    id: "stage-3",
    title: (
      <>
        Modern Design,
        <br />
        Flawlessly Executed
      </>
    ),
    body: "As the walls go up, the vision becomes reality. We bring contemporary, modern design to life with meticulous attention to detail.",
    cta: "Explore Our Work",
  },
  {
    id: "stage-4",
    title: (
      <>
        Your Dream Home,
        <br />
        Delivered.
      </>
    ),
    body: "This is what we build for. A home that reflects your life, your taste, and your ambition — crafted to perfection.",
    cta: "Book a Consultation",
  },
];

export default function HeroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const frames: HTMLImageElement[] = [];
    let currentFrameIndex = 0;
    let imagesLoaded = 0;

    function renderFrame(index: number) {
      if (!canvas || !ctx) return;
      const img = frames[index];
      if (img && img.complete && img.naturalWidth > 0) {
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
          drawWidth = canvas.width;
          drawHeight = canvas.width / imgRatio;
          offsetX = 0;
          offsetY = (canvas.height - drawHeight) / 2;
        } else {
          drawHeight = canvas.height;
          drawWidth = canvas.height * imgRatio;
          offsetX = (canvas.width - drawWidth) / 2;
          offsetY = 0;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      }
    }

    function resizeCanvas() {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      renderFrame(currentFrameIndex);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumber = i.toString().padStart(3, "0");
      img.src = `/frames/ezgif-frame-${frameNumber}.jpg`;
      img.onload = () => {
        imagesLoaded++;
        if (imagesLoaded === 1) resizeCanvas();
      };
      img.onerror = () => {
        console.warn(`Frame ${frameNumber} failed to load.`);
      };
      frames.push(img);
    }

    const gsapCtx = gsap.context(() => {
      gsap.set("#stage-1", { opacity: 1, y: 0 });

      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: `+=${SCROLL_DISTANCE}`,
          pin: true,
          scrub: 0.5,
          onUpdate: (self) => {
            currentFrameIndex = Math.min(
              TOTAL_FRAMES - 1,
              Math.floor(self.progress * TOTAL_FRAMES)
            );
            requestAnimationFrame(() => renderFrame(currentFrameIndex));

            if (progressBarRef.current) {
              progressBarRef.current.style.width = `${self.progress * 100}%`;
            }

            if (scrollIndicatorRef.current) {
              scrollIndicatorRef.current.style.opacity = String(
                self.progress > 0.1 ? 0 : 1 - self.progress * 10
              );
            }

            const stages = STAGES.map((s) => document.getElementById(s.id));
            stages[0]?.classList.toggle("active", self.progress < 0.25);
            stages[1]?.classList.toggle(
              "active",
              self.progress >= 0.25 && self.progress < 0.5
            );
            stages[2]?.classList.toggle(
              "active",
              self.progress >= 0.5 && self.progress < 0.75
            );
            stages[3]?.classList.toggle("active", self.progress >= 0.75);
          },
        },
      });

      masterTl.to(
        "#stage-1",
        { opacity: 0, y: -50, duration: 0.05, ease: "power2.inOut" },
        0.2
      );

      masterTl
        .fromTo(
          "#stage-2",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
          0.25
        )
        .to("#stage-2", { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" }, 0.45);

      masterTl
        .fromTo(
          "#stage-3",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
          0.5
        )
        .to("#stage-3", { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" }, 0.7);

      masterTl
        .fromTo(
          "#stage-4",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.05, ease: "power2.out" },
          0.75
        )
        .to("#stage-4", { opacity: 0, y: -50, duration: 0.05, ease: "power2.in" }, 0.95);

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gsapCtx.revert();
    };
  }, []);

  return (
    <>
      <div id="progress-bar" ref={progressBarRef} />

      <div className="scroll-indicator" id="scroll-indicator" ref={scrollIndicatorRef}>
        <div className="mouse" />
        <div className="arrow" />
      </div>

      <div id="main-container" ref={containerRef}>
        <canvas id="frame-canvas" ref={canvasRef} />
        <div className="gradient-overlay" />

        {STAGES.map((stage) => (
          <div className="text-stage" id={stage.id} key={stage.id}>
            <h3 className="small-caps">BUILD CONSTRUCTIONS</h3>
            <h1 className="hero-text">{stage.title}</h1>
            <p className="body-text">{stage.body}</p>
            <button className="cta-button outline">{stage.cta}</button>
          </div>
        ))}
      </div>
    </>
  );
}
