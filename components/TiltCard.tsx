"use client";

import { useRef } from "react";

const MAX_TILT = 8; // degrees

export default function TiltCard({ children }: { children: React.ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    card.style.transition = "transform 0.1s ease-out";
    card.style.transform = `rotateX(${(-y * MAX_TILT).toFixed(2)}deg) rotateY(${(
      x * MAX_TILT
    ).toFixed(2)}deg)`;
    card.style.setProperty("--glare-x", `${((x + 0.5) * 100).toFixed(1)}%`);
    card.style.setProperty("--glare-y", `${((y + 0.5) * 100).toFixed(1)}%`);
    card.style.setProperty("--glare-opacity", "1");
  };

  const handleLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transition = "transform 0.5s ease";
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
    card.style.setProperty("--glare-opacity", "0");
  };

  return (
    <div className="tilt-wrap" onMouseMove={handleMove} onMouseLeave={handleLeave}>
      <div className="project-card" ref={cardRef}>
        {children}
        <div className="tilt-glare" />
      </div>
    </div>
  );
}
