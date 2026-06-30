"use client";

import { useEffect, useRef, useState, type ElementType, type ReactNode, type CSSProperties } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  delayMs?: number;
  index?: number;
  once?: boolean;
  threshold?: number;
  style?: CSSProperties;
};

export default function Reveal({
  children,
  className,
  as = "div",
  delayMs,
  index,
  once = true,
  threshold = 0.15,
  style,
}: RevealProps) {
  const [revealed, setRevealed] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const delay = delayMs ?? (index !== undefined ? index * 70 : 0);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setRevealed(true);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }

    // A tall element (e.g. a full lesson body) can never expose `threshold`
    // (0.15) of its area at once on a short viewport — its max intersection
    // ratio is viewportHeight/elementHeight. On mobile that capped ratio stays
    // below 0.15, so the observer never fires and the content stays hidden
    // (opacity:0). When the element is taller than the viewport, fall back to a
    // 0 threshold so any sliver of visibility reveals it.
    const viewportH =
      window.innerHeight || document.documentElement.clientHeight;
    const effectiveThreshold =
      ref.current && ref.current.offsetHeight > viewportH ? 0 : threshold;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { threshold: effectiveThreshold }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [once, threshold]);

  const Tag = as as ElementType;

  return (
    <Tag
      ref={ref}
      className={className}
      data-reveal=""
      data-revealed={revealed ? "true" : "false"}
      suppressHydrationWarning
      style={{ ...style, ["--reveal-delay"]: `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
