// CoverArt — a bespoke per-topic cover illustration for content cards.
//
// Each of the 103 topics (gurus, indicators, schools, strategies) has its own
// hand-conceived SVG under /public/covers/<kind>/<slug>.svg, drawn in one shared
// house style (flat geometric editorial illustration, single hue per topic, no
// text). This component just renders that file. The helper exports below
// (HUE/schoolHue/riskHue/coverInitials) remain for callers that still derive a
// hue/initials, and as the basis of the inline FALLBACK used if a file is ever
// missing.

import { coverExists } from "./coverManifest";
import { photoExists } from "./photoManifest";

type CoverKind = "guru" | "indicator" | "school" | "strategy";

type CoverArtProps = {
  /** Which content type — selects the /covers/<kind>/ folder. */
  kind: CoverKind;
  /** Topic slug — selects the <slug>.svg file. */
  slug: string;
  /** Hue 0–360 — only used by the inline fallback when no file exists. */
  hue: number;
  /** Short initials/acronym — only used by the inline fallback. */
  initials?: string;
  className?: string;
};

// Category base hues — the "recolor" axis. Callers pass one of these (or a
// metadata-derived hue, e.g. a guru's school or a path's risk).
export const HUE = {
  guru: 200, // sky/blue
  indicator: 160, // teal/green — reads as "chart"
  school: 35, // amber
  path: 168, // brand teal
} as const;

// Per-school hue — shared so guru cards, the schools index, and detail heroes
// all color a school the same way. Falls back to the guru base hue.
export const SCHOOL_HUE: Record<string, number> = {
  technical: HUE.indicator, // teal
  fundamental: HUE.school, // amber
  quant: 270, // violet
  macro: HUE.guru, // sky
};

export function schoolHue(school?: string): number {
  return (school && SCHOOL_HUE[school]) || HUE.guru;
}

/** Risk (1=low → 10=very high) → cover hue: calm teal at low risk, shifting
 * through amber to red as risk climbs. Used by strategy/path covers. */
export function riskHue(riskRank: number): number {
  const t = Math.min(1, Math.max(0, (riskRank - 1) / 9));
  return Math.round(160 * (1 - t));
}

/** Initials/acronym for a content title. Keeps an existing all-caps acronym
 * (RSI, MACD) intact; otherwise takes first letters of the leading words. */
export function coverInitials(title: string, max = 3): string {
  const name = title.split("—")[0].trim();
  const parts = name.replace(/[/]/g, " ").split(/\s+/).filter(Boolean);
  if (parts.length === 1 && parts[0] === parts[0].toUpperCase()) {
    return parts[0].slice(0, 4);
  }
  const letters = parts
    .map((p) => p[0])
    .join("")
    .slice(0, max);
  return letters.toUpperCase() || "?";
}

// FNV-1a string hash → uint32. Deterministic across server/client.
function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// mulberry32 PRNG — seeded, deterministic, returns [0,1).
function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 320;
const H = 120;
const PAD = 14;

export default function CoverArt({
  kind,
  slug,
  hue,
  initials,
  className,
}: CoverArtProps) {
  // Highest priority: a real photo/image sourced from the web (downloaded to
  // /public/photos/<kind>/<slug>.*). Real images are visually heterogeneous —
  // B&W engravings next to modern color headshots — so we impose ONE consistent
  // "art style" at render time: grayscale + a topic-hue duotone wash + a dark
  // vignette, all in a fixed frame. That uniform treatment is what makes the set
  // cohere despite the source images being all over the place.
  if (photoExists(kind, slug)) {
    return <PhotoCover kind={kind} slug={slug} hue={hue} className={className} />;
  }
  // Next: the bespoke per-topic illustration (static SVG in /public/covers).
  if (coverExists(kind, slug)) {
    return (
      <img
        src={`/covers/${kind}/${slug}.svg`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={`${className ?? ""} object-contain`}
      />
    );
  }
  // Last resort for a topic with neither: the original inline generated motif.
  return <FallbackArt seed={slug} hue={hue} initials={initials} className={className} />;
}

// The shared photo "art style": one duotone treatment applied identically to
// every sourced image so the set reads as a single designed collection.
function PhotoCover({
  kind,
  slug,
  hue,
  className,
}: {
  kind: CoverKind;
  slug: string;
  hue: number;
  className?: string;
}) {
  const ext = photoExists(kind, slug); // returns the file extension, e.g. "jpg"
  return (
    <span
      aria-hidden="true"
      className={`relative block overflow-hidden ${className ?? ""}`}
      style={{ backgroundColor: `hsl(${hue}, 45%, 10%)` }}
    >
      {/* The photo: grayscaled + slightly brightened, cropped to the frame with
          the face/subject biased toward the top. */}
      <img
        src={`/photos/${kind}/${slug}.${ext}`}
        alt=""
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover opacity-90"
        style={{
          objectPosition: "center 25%",
          filter: "grayscale(1) contrast(1.04) brightness(1.08)",
        }}
      />
      {/* Hue duotone wash, kept light so the photo's detail/faces survive: a
          multiply layer tints midtones toward the topic hue; a soft-light layer
          lifts highlights in the same hue. */}
      <span
        className="absolute inset-0 mix-blend-multiply"
        style={{ backgroundColor: `hsl(${hue}, 40%, 55%)` }}
      />
      <span
        className="absolute inset-0 mix-blend-soft-light"
        style={{ backgroundColor: `hsl(${hue}, 65%, 58%)` }}
      />
      {/* Bottom vignette so card text below always has a dark anchor. */}
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, transparent 45%, hsl(${hue}, 45%, 8%) 100%)`,
        }}
      />
    </span>
  );
}

function FallbackArt({
  seed,
  hue,
  initials,
  className,
}: {
  seed: string;
  hue: number;
  initials?: string;
  className?: string;
}) {
  const rng = mulberry32(hashStr(seed));
  // Tiny per-item hue jitter so two items in the same family aren't identical,
  // without leaving the category's color range.
  const h = (hue + Math.round((rng() - 0.5) * 24) + 360) % 360;
  const gradId = `cover-${seed.replace(/[^a-z0-9]/gi, "")}-${hue}`;

  // Seeded random walk for the "close" line, then candlesticks around it.
  const n = 9;
  const slot = (W - PAD * 2) / n;
  const top = PAD;
  const bottom = H - PAD;
  const span = bottom - top;

  let level = 0.5;
  const closes: number[] = [];
  for (let i = 0; i < n; i++) {
    level += (rng() - 0.5) * 0.4;
    level = Math.max(0.1, Math.min(0.9, level));
    closes.push(level);
  }

  const yOf = (v: number) => bottom - v * span;
  const xOf = (i: number) => PAD + slot * i + slot / 2;

  const candles = closes.map((c, i) => {
    const prev = i === 0 ? c : closes[i - 1];
    const up = c >= prev;
    const o = yOf(prev);
    const cl = yOf(c);
    const wick = slot * 0.45;
    const bodyTop = Math.min(o, cl);
    const bodyH = Math.max(2, Math.abs(o - cl));
    const high = Math.min(bodyTop, bottom) - rng() * 8 - 2;
    const low = Math.max(bodyTop + bodyH, top) + rng() * 8 + 2;
    return { x: xOf(i), up, bodyTop, bodyH, wick, high, low };
  });

  const linePts = closes.map((c, i) => `${xOf(i)},${yOf(c)}`).join(" ");

  const upColor = `hsl(${h}, 70%, 58%)`;
  const downColor = `hsl(${h}, 28%, 42%)`;
  const lineColor = `hsl(${h}, 80%, 70%)`;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={className}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={`hsl(${h}, 55%, 16%)`} />
          <stop offset="100%" stopColor={`hsl(${(h + 24) % 360}, 45%, 9%)`} />
        </linearGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${gradId})`} />

      {/* faint baseline grid */}
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={PAD}
          x2={W - PAD}
          y1={top + g * span}
          y2={top + g * span}
          stroke="white"
          strokeOpacity="0.05"
          strokeWidth="1"
        />
      ))}

      {/* candlesticks */}
      {candles.map((c, i) => (
        <g key={i} stroke={c.up ? upColor : downColor}>
          <line x1={c.x} x2={c.x} y1={c.high} y2={c.low} strokeWidth="1.5" />
          <rect
            x={c.x - c.wick / 2}
            y={c.bodyTop}
            width={c.wick}
            height={c.bodyH}
            fill={c.up ? upColor : downColor}
            stroke="none"
          />
        </g>
      ))}

      {/* close-price line */}
      <polyline
        points={linePts}
        fill="none"
        stroke={lineColor}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* initials watermark */}
      {initials && (
        <text
          x={W - PAD}
          y={H - PAD}
          textAnchor="end"
          fontSize="34"
          fontWeight="800"
          fill="white"
          fillOpacity="0.12"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {initials}
        </text>
      )}
    </svg>
  );
}
