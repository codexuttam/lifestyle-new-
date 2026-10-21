"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  unitClassName?: string;
}

export default function AnimatedCounter({
  target,
  duration = 1600,
  prefix = "",
  suffix = "",
  className = "",
  unitClassName = "",
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    // Immediately trigger if IntersectionObserver is unsupported
    if (typeof IntersectionObserver === "undefined") {
      setCount(target);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          let startTime: number | null = null;

          const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Smooth easeOutExpo
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = Math.round(easeProgress * target);
            setCount(currentVal);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCount(target);
            }
          };

          requestAnimationFrame(animate);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, hasStarted]);

  return (
    <span ref={elementRef} className={className}>
      {prefix && <span>{prefix}</span>}
      <span>{hasStarted ? count : target}</span>
      {suffix && <span className={unitClassName}>{suffix}</span>}
    </span>
  );
}
