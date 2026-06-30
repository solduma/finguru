"use client";

import { useEffect, useRef, useState } from "react";

function motionEase(t: number): number {
  // cubic-bezier(0.16, 1, 0.3, 1) — matches --motion-ease in globals.css.
  const x1 = 0.16, y1 = 1, x2 = 0.3, y2 = 1;
  // Solve for the bezier parameter u where x(u) = t via a few Newton/bisection steps.
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sampleX = (u: number) => ((ax * u + bx) * u + cx) * u;
  const sampleY = (u: number) => ((ay * u + by) * u + cy) * u;
  const sampleDX = (u: number) => (3 * ax * u + 2 * bx) * u + cx;
  let u = t;
  for (let i = 0; i < 5; i++) {
    const x = sampleX(u) - t;
    const d = sampleDX(u);
    if (Math.abs(x) < 1e-5) break;
    if (Math.abs(d) < 1e-6) break;
    u -= x / d;
  }
  u = Math.min(1, Math.max(0, u));
  return sampleY(u);
}

type CountUpProps = {
  value: number;
  durationMs?: number;
  className?: string;
  /** Static text rendered before/after the animated number. Serializable so
   *  Server Components can pass them across the RSC boundary (functions can't). */
  prefix?: string;
  suffix?: string;
  startOnView?: boolean;
};

export default function CountUp({
  value,
  durationMs = 1200,
  className,
  prefix = "",
  suffix = "",
  startOnView = true,
}: CountUpProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }

    let rafId = 0;

    const runAnimation = () => {
      const start = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = motionEase(t);
        setDisplay(Math.round(value * eased));
        if (t < 1) {
          rafId = requestAnimationFrame(frame);
        } else {
          setDisplay(value);
        }
      };
      rafId = requestAnimationFrame(frame);
    };

    let observer: IntersectionObserver | undefined;

    if (!startOnView || typeof IntersectionObserver === "undefined") {
      runAnimation();
    } else {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer?.disconnect();
            runAnimation();
          }
        },
        { threshold: 0.3 }
      );
      if (ref.current) {
        observer.observe(ref.current);
      }
    }

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
    };
  }, [value, durationMs, startOnView]);

  return (
    <span
      ref={ref}
      className={className}
      style={{ position: "relative", display: "inline-block" }}
    >
      <span aria-hidden="true" style={{ visibility: "hidden" }}>
        {prefix}{value}{suffix}
      </span>
      <span aria-live="polite" aria-atomic="true" style={{ position: "absolute", left: 0, top: 0 }}>
        {prefix}{display}{suffix}
      </span>
    </span>
  );
}
