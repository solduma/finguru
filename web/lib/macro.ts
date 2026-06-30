// Macro-cycle computations for the MacroLab (L3: global-macro), over the
// pre-baked monthly FRED series in lib/data/macro.json. Pure TS, client-side.
// Everything here is transparent and inspectable on purpose — macro signals are
// notoriously noisy, so the lab shows HOW each reading is derived, never a
// black-box call.

import macroData from "./data/macro.json";

export interface MacroRow {
  month: string;
  yieldCurve?: number;
  unemployment?: number;
  cpi?: number;
  fedFunds?: number;
  m2?: number;
  recession?: number;
  dgs10?: number;
}

const ROWS = (macroData as { data: MacroRow[] }).data;
export const FRED_NOTICE = (macroData as { _meta: { fredNotice: string } })._meta.fredNotice;

export function rows(): MacroRow[] {
  return ROWS;
}

/** Year-over-year % change of a level series (e.g. CPI, M2), as decimal. */
export function yoy(field: "cpi" | "m2"): (number | null)[] {
  return ROWS.map((r, i) => {
    const prev = ROWS[i - 12];
    const cur = r[field];
    if (i < 12 || cur == null || prev?.[field] == null || prev[field] === 0) return null;
    return cur / (prev[field] as number) - 1;
  });
}

/** Contiguous recession spans as month-index ranges, for chart shading. */
export function recessionSpans(): { start: number; end: number }[] {
  const spans: { start: number; end: number }[] = [];
  let start = -1;
  ROWS.forEach((r, i) => {
    if (r.recession === 1 && start === -1) start = i;
    else if (r.recession !== 1 && start !== -1) {
      spans.push({ start, end: i - 1 });
      start = -1;
    }
  });
  if (start !== -1) spans.push({ start, end: ROWS.length - 1 });
  return spans;
}

/**
 * Sahm rule: 3-month-avg unemployment minus its trailing-12-month low. A reading
 * ≥ 0.50pp has historically marked recession onset. Returns the latest value.
 */
export function sahm(): { value: number | null; triggered: boolean } {
  const u = ROWS.map((r) => r.unemployment).filter((x): x is number => x != null);
  if (u.length < 15) return { value: null, triggered: false };
  const ma3 = (i: number) => (u[i] + u[i - 1] + u[i - 2]) / 3;
  const i = u.length - 1;
  const current = ma3(i);
  let low = Infinity;
  for (let j = i - 12; j <= i; j++) if (j >= 2) low = Math.min(low, ma3(j));
  const value = current - low;
  return { value, triggered: value >= 0.5 };
}

/**
 * A transparent 0–100 recession-risk gauge: average of three inspectable
 * sub-signals — yield-curve sign, the curve-probit-style level, and the Sahm
 * rule. Linear and explainable, NOT a forecast model.
 */
export function recessionGauge(): { score: number; parts: { label: string; value: number }[] } {
  const latestCurve = [...ROWS].reverse().find((r) => r.yieldCurve != null)?.yieldCurve ?? 0;
  const s = sahm();

  // Curve sign: inverted → 100, +1.5pp or steeper → 0, linear between.
  const curveSignal = Math.max(0, Math.min(1, (1.5 - latestCurve) / 1.5)) * 100;
  // Inversion bonus: a clearly inverted curve is a strong standalone signal.
  const invertedSignal = latestCurve < 0 ? 100 : curveSignal;
  // Sahm: scaled to its 0.5 trigger.
  const sahmSignal = s.value != null ? Math.max(0, Math.min(1, s.value / 0.5)) * 100 : 0;

  const parts = [
    { label: "Yield curve", value: Math.round(curveSignal) },
    { label: "Curve inversion", value: Math.round(invertedSignal) },
    { label: "Sahm rule", value: Math.round(sahmSignal) },
  ];
  const score = Math.round(parts.reduce((a, p) => a + p.value, 0) / parts.length);
  return { score, parts };
}

export type Quadrant =
  | "goldilocks" // growth↑ inflation↓
  | "reflation" // growth↑ inflation↑
  | "stagflation" // growth↓ inflation↑
  | "deflation"; // growth↓ inflation↓

/**
 * Current growth×inflation regime, using realized momentum as a transparent
 * proxy: growth rising = unemployment falling over 6m; inflation rising = YoY
 * CPI higher than 6m ago. (The canonical Bridgewater framing is vs. market
 * expectations, which is harder to measure — we say so in the lab.)
 */
export function currentRegime(): {
  quadrant: Quadrant;
  growthRising: boolean;
  inflationRising: boolean;
} {
  const cpiYoY = yoy("cpi");
  // Compare the latest defined reading to the one ~6 months before it. Trailing
  // rows can be null (CPI/unemployment lag the daily yield-curve series), so we
  // anchor on the last non-null index rather than the array end.
  const lastDefined = (arr: (number | null | undefined)[]): number => {
    for (let k = arr.length - 1; k >= 0; k--) if (arr[k] != null) return k;
    return -1;
  };
  const unemp = ROWS.map((r) => r.unemployment ?? null);
  const trend = (arr: (number | null)[], rising: (now: number, past: number) => boolean) => {
    const i = lastDefined(arr);
    if (i < 6) return false;
    const past = arr[i - 6] ?? arr[i - 7] ?? null;
    return past != null ? rising(arr[i] as number, past) : false;
  };
  // unemployment falling = growth rising
  const growthRising = trend(unemp, (now, past) => now < past);
  const inflationRising = trend(cpiYoY, (now, past) => now > past);
  const quadrant: Quadrant = growthRising
    ? inflationRising
      ? "reflation"
      : "goldilocks"
    : inflationRising
      ? "stagflation"
      : "deflation";
  return { quadrant, growthRising, inflationRising };
}

/** Latest non-null value of a field, with its month. */
export function latest(field: keyof MacroRow): { month: string; value: number } | null {
  for (let i = ROWS.length - 1; i >= 0; i--) {
    const v = ROWS[i][field];
    if (v != null && typeof v === "number") return { month: ROWS[i].month, value: v };
  }
  return null;
}
