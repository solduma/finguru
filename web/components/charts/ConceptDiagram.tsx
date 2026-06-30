"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Reveal from "@/components/Reveal";

// Monotonic counter so every mermaid.render() call gets a globally unique id,
// even across React StrictMode's double-mount and re-renders of the same
// diagram. A reused id makes mermaid's temporary measurement node collide,
// which on a narrow (mobile) layout intermittently yields an EMPTY render.
let mermaidSeq = 0;

export interface ConceptDiagramProps {
  /** A Mermaid definition (flowchart, sequenceDiagram, etc.) as a string. */
  chart: string;
  caption?: string;
  height?: number;
}

// Floor for *interactive* zoom-out (buttons / pinch). The initial fit may go
// below this for a very wide flowchart so the whole thing is visible at once.
const MIN_SCALE = 0.2;
const MAX_SCALE = 6;

/**
 * Renders a Mermaid diagram for conceptual (non-price) ideas the
 * fundamental/quant/macro lessons lean on — feedback loops (Soros's
 * reflexivity), process pipelines (a quant signal → backtest → sizing flow),
 * cause-and-effect chains (Dalio's economic machine, Minsky's progression).
 *
 * Text-based by design: it diffs cleanly in git, the content workflow can
 * author it like chart props, and the RAG chunker strips the definition so
 * Mermaid syntax never pollutes the embedding text (see api/app/rag/chunk.py).
 *
 * The diagram lives inside a pan/zoom viewport: a wide flowchart shrunk to a
 * phone's width renders its labels too small to read, so instead we render the
 * SVG at a legible size and let the reader drag to pan and pinch / wheel /
 * buttons to zoom. Initial zoom fits the diagram to the viewport width.
 */
export default function ConceptDiagram({
  chart,
  caption,
  height = 340,
}: ConceptDiagramProps) {
  // A *state-backed* host node, not a plain useRef. The host div mounts only
  // after we know we want to render; a useRef would still be null when the
  // render effect first runs and the effect would never re-fire. Driving the
  // host through state makes the effect run the moment the node attaches.
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  // Intrinsic (unscaled) size of the rendered SVG, in CSS px.
  const natural = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  // Current transform. Kept in a ref (for gesture math) and mirrored to the DOM
  // imperatively so high-frequency pan/zoom never thrashes React re-renders.
  const view = useRef({ scale: 1, tx: 0, ty: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

  const applyTransform = useCallback(() => {
    const el = contentRef.current;
    if (!el) return;
    const { scale, tx, ty } = view.current;
    el.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }, []);

  // Center the diagram in the viewport at a given scale.
  const center = useCallback(
    (scale: number, alignLeft = false) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const { w, h } = natural.current;
      view.current = {
        scale,
        // Left-align (with a small inset) when the content is wider than the
        // viewport at this scale, so the reader starts at the beginning of the
        // flow instead of its middle; otherwise center horizontally.
        tx: alignLeft ? 12 : (vp.clientWidth - w * scale) / 2,
        ty: (vp.clientHeight - h * scale) / 2,
      };
      applyTransform();
    },
    [applyTransform],
  );

  const fit = useCallback(() => {
    const vp = viewportRef.current;
    const { w, h } = natural.current;
    if (!vp || !w || !h) return;
    // The scale that would show the WHOLE diagram (tighter of width/height).
    const fitScale = Math.min(vp.clientWidth / w, vp.clientHeight / h) * 0.95;
    // A wide "flowchart LR" fit to width can render its labels unreadably small.
    // Below this threshold we instead start at a legible scale (filling the
    // viewport height) and left-align, letting the reader drag to follow the
    // flow. ~10px label height is roughly the legibility floor on a phone.
    const READABLE = 0.5;
    if (fitScale < READABLE) {
      const tall = Math.min(1, (vp.clientHeight / h) * 0.9);
      center(Math.max(fitScale, Math.min(tall, READABLE)), true);
    } else {
      center(Math.min(1, fitScale)); // small diagram: show it all, centered
    }
  }, [center]);

  const zoomBy = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      const rect = vp.getBoundingClientRect();
      // Default the zoom focus to the viewport center.
      const fx = cx ?? rect.width / 2;
      const fy = cy ?? rect.height / 2;
      const cur = view.current;
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, cur.scale * factor));
      const ratio = next / cur.scale;
      // Keep the focal point stationary while scaling around it.
      view.current = {
        scale: next,
        tx: fx - (fx - cur.tx) * ratio,
        ty: fy - (fy - cur.ty) * ratio,
      };
      applyTransform();
    },
    [applyTransform],
  );

  // ---- Render the Mermaid SVG ------------------------------------------------
  useEffect(() => {
    if (!host) return;
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "#0f131c",
            primaryColor: "#0f131c",
            primaryTextColor: "#e6e9ef",
            primaryBorderColor: "#2dd4bf",
            lineColor: "#7c8499",
            fontSize: "16px",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          },
        });
        // Fresh id per render attempt — never reuse one (see mermaidSeq note).
        const renderId = "mmd" + (mermaidSeq++).toString(36);
        const { svg } = await mermaid.render(renderId, chart.trim());
        if (cancelled) return;
        host.innerHTML = svg;
        const svgEl = host.querySelector("svg");
        if (svgEl) {
          // Render at the diagram's intrinsic size; the pan/zoom transform on
          // the wrapper — not the SVG box — handles fitting. Read the intrinsic
          // size from the viewBox (robust even when width is "100%").
          const vb = svgEl.viewBox?.baseVal;
          const w = vb && vb.width ? vb.width : svgEl.getBoundingClientRect().width;
          const h = vb && vb.height ? vb.height : svgEl.getBoundingClientRect().height;
          natural.current = { w, h };
          svgEl.removeAttribute("style");
          svgEl.setAttribute("width", String(w));
          svgEl.setAttribute("height", String(h));
          svgEl.style.maxWidth = "none";
          svgEl.style.display = "block";

          if (
            !(
              typeof window !== "undefined" &&
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            )
          ) {
            svgEl
              .querySelectorAll("path, line, polyline")
              .forEach((el) => el.setAttribute("pathLength", "1"));
            svgEl.classList.add("concept-diagram-draw");
          }
          setReady(true);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, host]);

  // Fit once the SVG is in and whenever the viewport resizes.
  useEffect(() => {
    if (!ready) return;
    fit();
    const vp = viewportRef.current;
    if (!vp || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => fit());
    ro.observe(vp);
    return () => ro.disconnect();
  }, [ready, fit]);

  // ---- Pointer pan + pinch zoom ---------------------------------------------
  useEffect(() => {
    const vp = viewportRef.current;
    if (!vp || !ready) return;

    const pointers = new Map<number, { x: number; y: number }>();
    let pinchPrev = 0;

    const onDown = (e: PointerEvent) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      vp.setPointerCapture(e.pointerId);
      if (pointers.size === 2) {
        const pts = [...pointers.values()];
        pinchPrev = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      }
    };
    const onMove = (e: PointerEvent) => {
      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const cur = { x: e.clientX, y: e.clientY };
      pointers.set(e.pointerId, cur);

      if (pointers.size === 2) {
        // Pinch: zoom around the midpoint of the two fingers.
        const pts = [...pointers.values()];
        const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
        if (pinchPrev > 0) {
          const rect = vp.getBoundingClientRect();
          const midX = (pts[0].x + pts[1].x) / 2 - rect.left;
          const midY = (pts[0].y + pts[1].y) / 2 - rect.top;
          zoomBy(dist / pinchPrev, midX, midY);
        }
        pinchPrev = dist;
        e.preventDefault();
        return;
      }

      // Single-pointer drag: pan.
      view.current.tx += cur.x - prev.x;
      view.current.ty += cur.y - prev.y;
      applyTransform();
      e.preventDefault();
    };
    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size < 2) pinchPrev = 0;
      if (vp.hasPointerCapture(e.pointerId)) vp.releasePointerCapture(e.pointerId);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = vp.getBoundingClientRect();
      zoomBy(
        e.deltaY < 0 ? 1.12 : 1 / 1.12,
        e.clientX - rect.left,
        e.clientY - rect.top,
      );
    };

    vp.addEventListener("pointerdown", onDown);
    vp.addEventListener("pointermove", onMove);
    vp.addEventListener("pointerup", onUp);
    vp.addEventListener("pointercancel", onUp);
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      vp.removeEventListener("pointerdown", onDown);
      vp.removeEventListener("pointermove", onMove);
      vp.removeEventListener("pointerup", onUp);
      vp.removeEventListener("pointercancel", onUp);
      vp.removeEventListener("wheel", onWheel);
    };
  }, [ready, applyTransform, zoomBy]);

  const btn =
    "flex h-8 w-8 items-center justify-center rounded-md border border-white/15 " +
    "bg-black/40 text-gray-200 backdrop-blur transition hover:border-teal-400/60 " +
    "hover:text-teal-300 select-none text-lg leading-none";

  return (
    <figure className="my-6 not-prose">
      <Reveal threshold={0.15} delayMs={0}>
        <div
          className="relative overflow-hidden rounded-lg border border-white/10 bg-[#0f131c]"
          style={{ height }}
        >
          {error ? (
            <div className="flex h-full items-center justify-center p-3 text-center text-xs text-red-400">
              Diagram failed to render: {error}
            </div>
          ) : (
            <>
              <div
                ref={viewportRef}
                className="h-full w-full touch-none cursor-grab active:cursor-grabbing"
                style={{ touchAction: "none" }}
              >
                <div
                  ref={contentRef}
                  style={{ transformOrigin: "0 0", willChange: "transform" }}
                >
                  {/* mermaid SVG is injected here */}
                  <div ref={setHost} />
                </div>
              </div>

              {/* Zoom controls */}
              {ready && (
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label="확대"
                    className={btn}
                    onClick={() => zoomBy(1.3)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    aria-label="축소"
                    className={btn}
                    onClick={() => zoomBy(1 / 1.3)}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    aria-label="원래대로"
                    className={btn + " text-xs"}
                    onClick={fit}
                  >
                    ⤢
                  </button>
                </div>
              )}
            </>
          )}
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
