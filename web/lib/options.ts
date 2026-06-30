// Black-Scholes (Merton, continuous dividend) pricing + greeks, a synthetic
// option chain, and covered-call / cash-secured-put / wheel payoff math for the
// OptionsLab (L5: options-income). Pure TS, ~no deps. We deliberately price a
// SYNTHETIC chain from the underlying + an IV assumption rather than fetching
// real chains — every free real-chain source forbids public redistribution, and
// a synthetic chain is better for teaching (you can see how each input drives
// each greek). European BS ignores American early-exercise; we note that in copy.

/** Standard normal CDF (Abramowitz–Stegun 7.1.26). */
function normCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  // Tail probability P(Z > |x|).
  const tail =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  // CDF: for x ≥ 0 it's 1 − tail; for x < 0 it's the tail itself (symmetry).
  return x >= 0 ? 1 - tail : tail;
}

export interface BsInputs {
  spot: number;
  strike: number;
  /** Time to expiry in years. */
  t: number;
  /** Risk-free rate (decimal). */
  r: number;
  /** Implied volatility (decimal). */
  iv: number;
  /** Continuous dividend yield (decimal). */
  q?: number;
}

export interface OptionQuote {
  call: number;
  put: number;
  callDelta: number;
  putDelta: number;
  /** Per-day theta of the call (negative = decay). */
  callThetaPerDay: number;
}

export function blackScholes(i: BsInputs): OptionQuote {
  const q = i.q ?? 0;
  const { spot: S, strike: K, t, r, iv } = i;
  if (t <= 0 || iv <= 0) {
    const intrinsicC = Math.max(0, S - K);
    const intrinsicP = Math.max(0, K - S);
    return { call: intrinsicC, put: intrinsicP, callDelta: S > K ? 1 : 0, putDelta: S < K ? -1 : 0, callThetaPerDay: 0 };
  }
  const sqrtT = Math.sqrt(t);
  const d1 = (Math.log(S / K) + (r - q + (iv * iv) / 2) * t) / (iv * sqrtT);
  const d2 = d1 - iv * sqrtT;
  const eqt = Math.exp(-q * t);
  const ert = Math.exp(-r * t);
  const call = S * eqt * normCdf(d1) - K * ert * normCdf(d2);
  const put = K * ert * normCdf(-d2) - S * eqt * normCdf(-d1);
  const pdfD1 = 0.3989423 * Math.exp(-d1 * d1 / 2);
  // Theta (call), per year → per day.
  const thetaYr =
    -(S * eqt * pdfD1 * iv) / (2 * sqrtT) -
    r * K * ert * normCdf(d2) +
    q * S * eqt * normCdf(d1);
  return {
    call,
    put,
    callDelta: eqt * normCdf(d1),
    putDelta: -eqt * normCdf(-d1),
    callThetaPerDay: thetaYr / 365,
  };
}

export interface ChainRow {
  strike: number;
  moneyness: number; // strike / spot
  quote: OptionQuote;
}

/** A synthetic strike ladder around spot (±pct steps). */
export function syntheticChain(
  base: Omit<BsInputs, "strike">,
  steps = [-0.1, -0.05, -0.025, 0, 0.025, 0.05, 0.1],
): ChainRow[] {
  return steps.map((m) => {
    const strike = +(base.spot * (1 + m)).toFixed(2);
    return {
      strike,
      moneyness: 1 + m,
      quote: blackScholes({ ...base, strike }),
    };
  });
}

// ---- Covered call / cash-secured put payoffs ----

export interface CoveredCall {
  cost: number; // your share cost basis (≈ spot at entry)
  strike: number;
  premium: number; // call premium received
  breakeven: number;
  maxProfit: number; // if called away
  maxProfitPct: number;
  annualizedReturnOnPremium: number; // premium/cost annualized to expiry
}

export function coveredCall(
  spot: number,
  strike: number,
  premium: number,
  daysToExpiry: number,
): CoveredCall {
  const maxProfit = premium + (strike - spot);
  return {
    cost: spot,
    strike,
    premium,
    breakeven: spot - premium,
    maxProfit,
    maxProfitPct: maxProfit / spot,
    annualizedReturnOnPremium:
      daysToExpiry > 0 ? (premium / spot) * (365 / daysToExpiry) : 0,
  };
}

/** Payoff of stock-only vs covered-call at expiry, across a price range. */
export function coveredCallPayoff(
  cc: CoveredCall,
  priceRange: number[],
): { prices: number[]; stock: number[]; covered: number[] } {
  const stock = priceRange.map((p) => p - cc.cost);
  const covered = priceRange.map((p) => {
    const capped = Math.min(p, cc.strike); // upside capped at strike
    return capped - cc.cost + cc.premium;
  });
  return { prices: priceRange, stock, covered };
}
