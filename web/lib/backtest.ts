// Pure-TS portfolio backtest engine for the practical modules (L1 PortfolioLab,
// and later real-assets sleeve sizing / factor tilts). Runs entirely client-side
// over the static annual asset-class return dataset (lib/data/asset-returns.json),
// so there is no runtime data dependency.
//
// Annual granularity (the long-run dataset is annual). A portfolio is a set of
// target weights across asset classes; each year every sleeve grows by its return,
// then — if rebalancing — weights are reset to target at year end. Supports an
// optional periodic contribution stream (DCA) and a time-varying weight schedule
// (glide path) for the lifecycle module.

import assetReturns from "./data/asset-returns.json";

export type AssetKey =
  | "usStocks"
  | "usSmallCap"
  | "tBill"
  | "tBond"
  | "baaCorp"
  | "realEstate"
  | "gold";

export interface YearRow {
  year: number;
  returns: Partial<Record<AssetKey, number>>;
  inflation?: number;
}

const ROWS = (assetReturns as { data: YearRow[] }).data;

export const FIRST_YEAR = ROWS[0]?.year ?? 1928;
export const LAST_YEAR = ROWS[ROWS.length - 1]?.year ?? FIRST_YEAR;

/** Target allocation: asset → weight. Weights should sum to ~1 (we normalize). */
export type Weights = Partial<Record<AssetKey, number>>;

export interface BacktestOptions {
  weights: Weights;
  /** Inclusive start year (default: dataset start). */
  startYear?: number;
  /** Inclusive end year (default: dataset end). */
  endYear?: number;
  /** Reset to target weights at each year end. Default true. */
  rebalance?: boolean;
  /** Starting capital. Default 10000. */
  initial?: number;
  /** Contribution added at the START of each year (DCA). Default 0. */
  annualContribution?: number;
  /**
   * Annual fee / expense ratio (decimal, e.g. 0.01 = 1%), deducted from the
   * portfolio each year. Models the cost drag of a fund's expense ratio.
   */
  fee?: number;
  /**
   * Optional glide path: per-year weight overrides keyed by year. A year not in
   * the map uses `weights`. Lets the lifecycle module shift stock/bond mix over time.
   */
  schedule?: Record<number, Weights>;
}

export interface BacktestResult {
  years: number[];
  /** Portfolio value at each year end (nominal). */
  equity: number[];
  /** Inflation-adjusted (real) equity curve, base = start year. */
  realEquity: number[];
  /** Per-year portfolio total return (decimal). */
  returns: number[];
  /** Drawdown at each year end (≤ 0), from the running nominal peak. */
  drawdown: number[];
  /** Total dollars contributed (initial + DCA). */
  invested: number;
  cagr: number;
  /** Annualized standard deviation of yearly returns. */
  volatility: number;
  /** (CAGR − avg T-Bill) / volatility, a simple annual Sharpe. */
  sharpe: number;
  maxDrawdown: number;
  finalValue: number;
  /** Real (inflation-adjusted) CAGR. */
  realCagr: number;
}

function normalize(w: Weights): Weights {
  const total = Object.values(w).reduce((s, v) => s + (v ?? 0), 0);
  if (!total) return w;
  const out: Weights = {};
  for (const [k, v] of Object.entries(w)) out[k as AssetKey] = (v ?? 0) / total;
  return out;
}

/** Weighted portfolio return for one year, ignoring assets with no data that year. */
function yearReturn(row: YearRow, weights: Weights): number {
  let r = 0;
  let covered = 0;
  for (const [k, w] of Object.entries(weights)) {
    const ret = row.returns[k as AssetKey];
    if (ret == null || !w) continue;
    r += w * ret;
    covered += w;
  }
  // If some weight had no data that year, scale up so the covered sleeves still
  // represent the full portfolio (avoids silently parking weight in 0% cash).
  return covered > 0 ? r / covered : 0;
}

function std(xs: number[]): number {
  if (xs.length < 2) return 0;
  const mean = xs.reduce((s, v) => s + v, 0) / xs.length;
  const variance =
    xs.reduce((s, v) => s + (v - mean) ** 2, 0) / (xs.length - 1);
  return Math.sqrt(variance);
}

export function backtest(opts: BacktestOptions): BacktestResult {
  const startYear = opts.startYear ?? FIRST_YEAR;
  const endYear = opts.endYear ?? LAST_YEAR;
  const rebalance = opts.rebalance ?? true;
  const initial = opts.initial ?? 10000;
  const contribution = opts.annualContribution ?? 0;
  const fee = opts.fee ?? 0;
  const baseWeights = normalize(opts.weights);

  const window = ROWS.filter((r) => r.year >= startYear && r.year <= endYear);

  const years: number[] = [];
  const equity: number[] = [];
  const realEquity: number[] = [];
  const returns: number[] = [];
  const drawdown: number[] = [];

  // Track per-sleeve dollar balances so a no-rebalance run lets winners drift.
  let sleeves: Weights = {};
  let value = 0;
  let invested = 0;
  let peak = 0;
  let cumInflation = 1; // cumulative price level, base = start

  window.forEach((row, i) => {
    const target = normalize(opts.schedule?.[row.year] ?? baseWeights);
    const contrib = i === 0 ? initial + contribution : contribution;
    invested += contrib;

    // Add contribution. On a rebalance run (or the first year) we set sleeves to
    // target; otherwise the new cash is split by target but existing sleeves drift.
    if (rebalance || i === 0) {
      value += contrib;
      sleeves = {};
      for (const [k, w] of Object.entries(target)) sleeves[k as AssetKey] = value * (w ?? 0);
    } else {
      for (const [k, w] of Object.entries(target))
        sleeves[k as AssetKey] = (sleeves[k as AssetKey] ?? 0) + contrib * (w ?? 0);
      value += contrib;
    }

    // Grow each sleeve by its asset's return this year, net of the annual fee.
    const before = value;
    let after = 0;
    for (const [k, bal] of Object.entries(sleeves)) {
      const ret = (row.returns[k as AssetKey] ?? 0) - fee;
      const grown = (bal ?? 0) * (1 + ret);
      sleeves[k as AssetKey] = grown;
      after += grown;
    }
    value = after;

    const yr = before > 0 ? value / before - 1 : 0;
    returns.push(yr);
    if (row.inflation != null) cumInflation *= 1 + row.inflation;

    peak = Math.max(peak, value);
    years.push(row.year);
    equity.push(value);
    realEquity.push(value / cumInflation);
    drawdown.push(peak > 0 ? value / peak - 1 : 0);
  });

  const n = window.length;
  const avgTBill =
    window.reduce((s, r) => s + (r.returns.tBill ?? 0), 0) / (n || 1);
  const cagr = computeCagr(initial, value, invested, n, returns);
  const volatility = std(returns);
  const sharpe = volatility > 0 ? (cagr - avgTBill) / volatility : 0;
  const maxDrawdown = drawdown.length ? Math.min(...drawdown) : 0;
  const realCagr =
    cumInflation > 0 ? (1 + cagr) / Math.pow(cumInflation, 1 / (n || 1)) - 1 : cagr;

  return {
    years,
    equity,
    realEquity,
    returns,
    drawdown,
    invested,
    cagr,
    volatility,
    sharpe,
    maxDrawdown,
    finalValue: value,
    realCagr,
  };
}

// CAGR. With contributions the geometric "end/start" shortcut is wrong, so when
// DCA is on we report the money-weighted-equivalent growth of the return series
// (geometric mean of yearly returns); without contributions it's the standard
// (end/initial)^(1/n) − 1.
function computeCagr(
  initial: number,
  finalValue: number,
  invested: number,
  n: number,
  returns: number[],
): number {
  if (n <= 0) return 0;
  if (invested > initial + 1e-6) {
    const growth = returns.reduce((p, r) => p * (1 + r), 1);
    return Math.pow(growth, 1 / n) - 1;
  }
  if (initial <= 0) return 0;
  return Math.pow(finalValue / initial, 1 / n) - 1;
}

/** Available data window, for UI range pickers. */
export function dataRange(): { first: number; last: number } {
  return { first: FIRST_YEAR, last: LAST_YEAR };
}

export interface GlidePoint {
  year: number;
  usStocks: number;
  tBond: number;
  tBill: number;
}

/**
 * A target-date glide path: stock-heavy early, de-risking toward `targetYear`,
 * then holding a conservative landing mix. Linearly interpolates the equity
 * share from `startStock` down to `endStock` over the accumulation window, with
 * the remainder split bonds-then-cash. Returns both a per-year weights schedule
 * (for backtest's `schedule`) and the points (for the StackedAreaChart).
 */
export function glidePath(opts: {
  startYear: number;
  targetYear: number;
  endYear?: number;
  startStock?: number;
  endStock?: number;
}): { schedule: Record<number, Weights>; points: GlidePoint[] } {
  const startYear = opts.startYear;
  const targetYear = opts.targetYear;
  const endYear = opts.endYear ?? LAST_YEAR;
  const startStock = opts.startStock ?? 0.9;
  const endStock = opts.endStock ?? 0.3;

  const schedule: Record<number, Weights> = {};
  const points: GlidePoint[] = [];
  for (let y = startYear; y <= endYear; y++) {
    const t =
      targetYear > startYear
        ? Math.min(1, Math.max(0, (y - startYear) / (targetYear - startYear)))
        : 1;
    const stock = startStock + (endStock - startStock) * t;
    // Past the target date, keep the landing mix. Bonds take ~⅔ of the
    // non-equity sleeve, cash the rest — a simple, legible split.
    const rest = 1 - stock;
    const bond = rest * 0.65;
    const cash = rest * 0.35;
    schedule[y] = { usStocks: stock, tBond: bond, tBill: cash };
    points.push({ year: y, usStocks: stock, tBond: bond, tBill: cash });
  }
  return { schedule, points };
}

/**
 * Sequence-of-returns demo: the SAME multiset of yearly returns, run in the
 * historical order vs. reversed, on a portfolio being DRAWN DOWN. Identical
 * average return, very different outcome when a crash lands early in retirement.
 * Returns two equity curves for side-by-side display.
 */
export function sequenceRiskDemo(opts: {
  weights: Weights;
  startYear: number;
  endYear: number;
  initial?: number;
  /** Fraction of the starting balance withdrawn each year. Default 0.05. */
  withdrawalRate?: number;
}): { years: number[]; normal: number[]; reversed: number[] } {
  const initial = opts.initial ?? 100000;
  const rate = opts.withdrawalRate ?? 0.05;
  const w = normalize(opts.weights);
  const window = ROWS.filter(
    (r) => r.year >= opts.startYear && r.year <= opts.endYear,
  );
  const rets = window.map((r) => yearReturn(r, w));
  const withdrawal = initial * rate; // fixed real-dollar withdrawal

  const run = (series: number[]): number[] => {
    const curve: number[] = [];
    let v = initial;
    for (const r of series) {
      v = v * (1 + r) - withdrawal;
      curve.push(Math.max(0, v));
    }
    return curve;
  };

  return {
    years: window.map((r) => r.year),
    normal: run(rets),
    reversed: run([...rets].reverse()),
  };
}
