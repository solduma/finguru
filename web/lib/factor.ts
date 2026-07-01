// Fama-French 3-factor regression for the FactorLab. Regresses a factor ETF's
// monthly EXCESS return (over the risk-free rate) on Mkt-RF / SMB / HML via
// ordinary least squares, yielding alpha (monthly + annualized), the factor
// betas, and R². The teaching point: a single-factor ETF's return is mostly
// EXPLAINED by its factor loadings — alpha is typically ~0 — so you're buying
// exposure, not manager skill.

import ffData from "./data/ff-factors.json";
import type { Candle } from "./ta";

interface FfRow {
  month: string;
  mktRf: number;
  smb: number;
  hml: number;
  rf: number;
}
const FF = (ffData as { data: FfRow[] }).data;
const FF_BY_MONTH = new Map(FF.map((r) => [r.month, r]));

export interface FactorRegression {
  alphaMonthly: number;
  alphaAnnual: number;
  betaMkt: number;
  betaSmb: number;
  betaHml: number;
  rSquared: number;
  months: number;
}

/** Month-end close per YYYY-MM from a daily candle series. */
function monthlyCloses(candles: Candle[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const c of candles) m.set(c.t.slice(0, 7), c.c); // last write per month wins
  return m;
}

/** Solve a small linear system (Gaussian elimination) for OLS normal equations. */
function solve(A: number[][], b: number[]): number[] | null {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    // partial pivot
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-12) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let k = col; k <= n; k++) M[r][k] -= f * M[col][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

/**
 * Regress the ETF's monthly excess return on [1, Mkt-RF, SMB, HML].
 * y_t = α + β_mkt·MktRF_t + β_smb·SMB_t + β_hml·HML_t + ε_t
 */
export function factorRegression(candles: Candle[]): FactorRegression | null {
  const closes = monthlyCloses(candles);
  const months = [...closes.keys()].sort();

  const Y: number[] = [];
  const X: number[][] = []; // rows of [1, mktRf, smb, hml]
  for (let i = 1; i < months.length; i++) {
    const prev = closes.get(months[i - 1]);
    const cur = closes.get(months[i]);
    const ff = FF_BY_MONTH.get(months[i]);
    if (prev == null || cur == null || !ff || prev <= 0) continue;
    const ret = cur / prev - 1;
    Y.push(ret - ff.rf); // excess return
    X.push([1, ff.mktRf, ff.smb, ff.hml]);
  }
  const n = Y.length;
  if (n < 24) return null;

  // Normal equations: (XᵀX) b = Xᵀy
  const k = 4;
  const XtX = Array.from({ length: k }, () => new Array(k).fill(0));
  const Xty = new Array(k).fill(0);
  for (let t = 0; t < n; t++) {
    for (let a = 0; a < k; a++) {
      Xty[a] += X[t][a] * Y[t];
      for (let b = 0; b < k; b++) XtX[a][b] += X[t][a] * X[t][b];
    }
  }
  const coef = solve(XtX, Xty);
  if (!coef) return null;
  const [alpha, betaMkt, betaSmb, betaHml] = coef;

  // R²
  const yMean = Y.reduce((s, v) => s + v, 0) / n;
  let ssTot = 0;
  let ssRes = 0;
  for (let t = 0; t < n; t++) {
    const pred = alpha + betaMkt * X[t][1] + betaSmb * X[t][2] + betaHml * X[t][3];
    ssRes += (Y[t] - pred) ** 2;
    ssTot += (Y[t] - yMean) ** 2;
  }
  return {
    alphaMonthly: alpha,
    alphaAnnual: Math.pow(1 + alpha, 12) - 1,
    betaMkt,
    betaSmb,
    betaHml,
    rSquared: ssTot > 0 ? 1 - ssRes / ssTot : 0,
    months: n,
  };
}
