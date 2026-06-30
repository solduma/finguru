// Technical-analysis indicators + a no-lookahead backtest engine for the
// TradeLab (L4: trend-momentum, active-trading). Pure TS, runs client-side over
// the pre-baked daily OHLCV in lib/data/prices/. The backtest decides each day's
// position from data available UP TO that day, then applies the NEXT day's
// return — the single most important honesty rule in any backtest.

export interface Candle {
  t: string;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : null);
  }
  return out;
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = [];
  const k = 2 / (period + 1);
  let prev: number | null = null;
  for (let i = 0; i < values.length; i++) {
    if (prev == null) {
      // seed with SMA once we have `period` points
      if (i >= period - 1) {
        let s = 0;
        for (let j = i - period + 1; j <= i; j++) s += values[j];
        prev = s / period;
      }
      out.push(prev);
    } else {
      prev = values[i] * k + prev * (1 - k);
      out.push(prev);
    }
  }
  return out;
}

export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = [null];
  let avgGain = 0;
  let avgLoss = 0;
  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1];
    const gain = Math.max(change, 0);
    const loss = Math.max(-change, 0);
    if (i <= period) {
      avgGain += gain;
      avgLoss += loss;
      if (i === period) {
        avgGain /= period;
        avgLoss /= period;
        out.push(100 - 100 / (1 + avgGain / (avgLoss || 1e-9)));
      } else {
        out.push(null);
      }
    } else {
      avgGain = (avgGain * (period - 1) + gain) / period;
      avgLoss = (avgLoss * (period - 1) + loss) / period;
      out.push(100 - 100 / (1 + avgGain / (avgLoss || 1e-9)));
    }
  }
  return out;
}

/** Average True Range (Wilder) — volatility, for stop distance & sizing. */
export function atr(candles: Candle[], period = 14): (number | null)[] {
  const tr: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    if (i === 0) {
      tr.push(candles[i].h - candles[i].l);
      continue;
    }
    const prevC = candles[i - 1].c;
    tr.push(
      Math.max(
        candles[i].h - candles[i].l,
        Math.abs(candles[i].h - prevC),
        Math.abs(candles[i].l - prevC),
      ),
    );
  }
  // Wilder smoothing
  const out: (number | null)[] = [];
  let prev: number | null = null;
  for (let i = 0; i < tr.length; i++) {
    if (i < period - 1) {
      out.push(null);
    } else if (prev == null) {
      let s = 0;
      for (let j = i - period + 1; j <= i; j++) s += tr[j];
      prev = s / period;
      out.push(prev);
    } else {
      prev = (prev * (period - 1) + tr[i]) / period;
      out.push(prev);
    }
  }
  return out;
}

// ---- Trend-system backtest (no lookahead) ----

export type TrendSystem = "sma200" | "mom12" | "donchian";

export interface TrendResult {
  dates: string[];
  equity: number[]; // strategy equity, starting at 1
  buyHold: number[]; // benchmark equity, starting at 1
  drawdown: number[]; // strategy drawdown (≤0)
  inMarket: boolean[]; // position each day (for shading)
  cagr: number;
  buyHoldCagr: number;
  maxDrawdown: number;
  buyHoldMaxDrawdown: number;
  exposure: number; // fraction of days in-market
  trades: number;
}

/**
 * Decide today's position from data up to today; earn tomorrow's return. Three
 * honest, simple, fixed rule-sets (no tunable knobs that invite overfitting):
 *  - sma200: long when close > 200-day SMA, else cash
 *  - mom12: monthly 12-1 momentum (long if trailing 12m return, skipping the
 *    last ~21 days, is positive)
 *  - donchian: long on a 50-day high breakout, exit on a 50-day low
 */
export function backtestTrend(
  candles: Candle[],
  system: TrendSystem,
): TrendResult {
  const close = candles.map((c) => c.c);
  const n = candles.length;
  const sma200 = sma(close, 200);

  const signal: boolean[] = new Array(n).fill(false);
  if (system === "sma200") {
    for (let i = 0; i < n; i++) signal[i] = sma200[i] != null && close[i] > (sma200[i] as number);
  } else if (system === "mom12") {
    const LB = 252;
    const SKIP = 21;
    for (let i = 0; i < n; i++) {
      if (i >= LB) {
        const past = close[i - LB];
        const recent = close[i - SKIP];
        signal[i] = past > 0 && recent / past - 1 > 0;
      }
    }
  } else {
    // donchian 50/50
    const P = 50;
    let inPos = false;
    for (let i = 0; i < n; i++) {
      if (i < P) {
        signal[i] = false;
        continue;
      }
      let hi = -Infinity;
      let lo = Infinity;
      for (let j = i - P; j < i; j++) {
        hi = Math.max(hi, candles[j].h);
        lo = Math.min(lo, candles[j].l);
      }
      if (!inPos && candles[i].c > hi) inPos = true;
      else if (inPos && candles[i].c < lo) inPos = false;
      signal[i] = inPos;
    }
  }

  const dates: string[] = [];
  const equity: number[] = [];
  const buyHold: number[] = [];
  const drawdown: number[] = [];
  const inMarket: boolean[] = [];
  let eq = 1;
  let bh = 1;
  let peak = 1;
  let bhPeak = 1;
  let maxDd = 0;
  let bhMaxDd = 0;
  let daysIn = 0;
  let trades = 0;

  // Start once the slowest indicator is warm.
  const startIdx = system === "mom12" ? 252 : system === "donchian" ? 50 : 200;
  for (let i = startIdx; i < n - 1; i++) {
    const ret = close[i + 1] / close[i] - 1; // tomorrow's return
    const pos = signal[i]; // decided with today's info
    if (i > startIdx && signal[i] !== signal[i - 1]) trades++;
    if (pos) {
      eq *= 1 + ret;
      daysIn++;
    }
    bh *= 1 + ret;
    peak = Math.max(peak, eq);
    bhPeak = Math.max(bhPeak, bh);
    maxDd = Math.min(maxDd, eq / peak - 1);
    bhMaxDd = Math.min(bhMaxDd, bh / bhPeak - 1);
    dates.push(candles[i + 1].t);
    equity.push(eq);
    buyHold.push(bh);
    drawdown.push(eq / peak - 1);
    inMarket.push(pos);
  }

  const years = dates.length / 252;
  return {
    dates,
    equity,
    buyHold,
    drawdown,
    inMarket,
    cagr: years > 0 ? Math.pow(eq, 1 / years) - 1 : 0,
    buyHoldCagr: years > 0 ? Math.pow(bh, 1 / years) - 1 : 0,
    maxDrawdown: maxDd,
    buyHoldMaxDrawdown: bhMaxDd,
    exposure: dates.length ? daysIn / dates.length : 0,
    trades,
  };
}

// ---- ATR-based position sizing / R-multiples (active-trading) ----

export interface TradePlan {
  entry: number;
  stop: number;
  target: number;
  /** Shares to risk a fixed fraction of equity given the stop distance. */
  shares: number;
  riskPerShare: number;
  rMultipleToTarget: number;
}

/** Plan a long trade: ATR-based stop, fixed-fractional sizing, R:R target. */
export function planTrade(opts: {
  entry: number;
  atr: number;
  equity: number;
  riskPct: number; // fraction of equity to risk (e.g. 0.01)
  atrStopMult?: number; // stop = entry − mult×ATR (default 2)
  rrTarget?: number; // target at this R multiple (default 2)
}): TradePlan {
  const atrStopMult = opts.atrStopMult ?? 2;
  const rrTarget = opts.rrTarget ?? 2;
  const stop = opts.entry - atrStopMult * opts.atr;
  const riskPerShare = opts.entry - stop;
  const target = opts.entry + rrTarget * riskPerShare;
  const shares = riskPerShare > 0 ? (opts.equity * opts.riskPct) / riskPerShare : 0;
  return {
    entry: opts.entry,
    stop,
    target,
    shares,
    riskPerShare,
    rMultipleToTarget: rrTarget,
  };
}

/**
 * Resolve a planned trade forward, bar by bar, with NO lookahead and the
 * conservative intrabar rule: if a single day's range spans both stop and
 * target, assume the STOP hit first (never flatter the trader). Returns the
 * realized R multiple and the exit.
 */
export function resolveTrade(
  candlesAfterEntry: Candle[],
  plan: TradePlan,
): { exitDate: string | null; exitPrice: number; rMultiple: number; hitStop: boolean } {
  for (const c of candlesAfterEntry) {
    const hitStop = c.l <= plan.stop;
    const hitTarget = c.h >= plan.target;
    if (hitStop) {
      return { exitDate: c.t, exitPrice: plan.stop, rMultiple: -1, hitStop: true };
    }
    if (hitTarget) {
      return {
        exitDate: c.t,
        exitPrice: plan.target,
        rMultiple: plan.rMultipleToTarget,
        hitStop: false,
      };
    }
  }
  // Never hit either — mark to the last close.
  const lastC = candlesAfterEntry[candlesAfterEntry.length - 1];
  if (!lastC) return { exitDate: null, exitPrice: plan.entry, rMultiple: 0, hitStop: false };
  return {
    exitDate: lastC.t,
    exitPrice: lastC.c,
    rMultiple: (lastC.c - plan.entry) / plan.riskPerShare,
    hitStop: false,
  };
}
