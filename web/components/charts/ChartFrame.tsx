"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Reveal from "@/components/Reveal";

/** A consistent figure wrapper: bordered panel, fixed aspect, caption. */
export default function ChartFrame({
  caption,
  height = 300,
  children,
}: {
  caption?: string;
  height?: number;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") { setShow(true); return; }
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) { setShow(true); obs.disconnect(); }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <figure className="my-6 not-prose">
      <Reveal threshold={0.15} delayMs={0}>
        <div
          ref={ref}
          className="rounded-lg border border-white/10 bg-[#0f131c] p-3"
          style={{ height }}
          // The chart draws to an opaque <canvas>; expose the caption as the
          // accessible name so screen readers announce what it shows instead of
          // an unlabeled graphic.
          role={caption ? "img" : undefined}
          aria-label={caption || undefined}
        >
          {show ? (
            <div className="h-full" aria-hidden={caption ? true : undefined}>
              {children}
            </div>
          ) : null}
        </div>
      </Reveal>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-gray-500">
          <Reveal delayMs={150} as="span" className="block">
            {caption} <span className="opacity-70">· illustrative</span>
          </Reveal>
        </figcaption>
      )}
    </figure>
  );
}
