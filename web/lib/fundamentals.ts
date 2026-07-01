// Client-side fundamentals math for the Company Analyzer (L2). Consumes the
// normalized payload from the backend (/market-data/fundamentals → SEC EDGAR for
// US, OpenDART for KR) and computes the scorecards each strategy module needs:
//   - dividend safety (yield, payout on earnings & on FCF, growth streak)
//   - value: 2-stage DCF + margin of safety, Greenblatt earnings yield + ROC
//   - growth/GARP: PEG, ROE, margins, FCF conversion
// Every figure is a teaching hypothesis, never a recommendation — see the
// honesty thread in CompanyLab.

export interface AnnualPoint {
  year: number;
  value: number;
}

export interface Fundamentals {
  ticker: string;
  market: "us" | "kr";
  name: string;
  currency: string;
  revenue: AnnualPoint[];
  netIncome: AnnualPoint[];
  operatingIncome: AnnualPoint[];
  eps: AnnualPoint[];
  dividendsPerShare: AnnualPoint[];
  operatingCashFlow: AnnualPoint[];
  capex: AnnualPoint[];
  dividendsPaid: AnnualPoint[];
  totalAssets: number | null;
  totalLiabilities: number | null;
  totalEquity: number | null;
  cash: number | null;
  totalDebt: number | null;
  sharesOutstanding: number | null;
  forwardEpsGrowth: number | null;
  sources: { label: string; url: string }[];
}

const last = (s: AnnualPoint[]): number | null =>
  s.length ? s[s.length - 1].value : null;

/** Free cash flow series = operating cash flow − capex, by matching year. */
export function fcfSeries(f: Fundamentals): AnnualPoint[] {
  const capexByYear = new Map(f.capex.map((p) => [p.year, p.value]));
  return f.operatingCashFlow
    .filter((p) => capexByYear.has(p.year))
    .map((p) => ({ year: p.year, value: p.value - (capexByYear.get(p.year) ?? 0) }));
}

// ---- Dividend safety ----

export interface DividendScore {
  latestDps: number | null;
  payoutOnEarnings: number | null; // dividends ÷ net income
  payoutOnFcf: number | null; // dividends ÷ FCF
  growthStreak: number; // consecutive years DPS rose
  cut: boolean; // DPS ever fell in the series
}

export function dividendSafety(f: Fundamentals): DividendScore {
  const dps = f.dividendsPerShare;
  const paid = last(f.dividendsPaid);
  const ni = last(f.netIncome);
  const fcf = last(fcfSeries(f));

  let streak = 0;
  let cut = false;
  for (let i = 1; i < dps.length; i++) {
    if (dps[i].value > dps[i - 1].value) streak++;
    else if (dps[i].value < dps[i - 1].value) {
      cut = true;
      streak = 0;
    }
  }
  return {
    latestDps: last(dps),
    payoutOnEarnings: paid != null && ni && ni > 0 ? paid / ni : null,
    payoutOnFcf: paid != null && fcf && fcf > 0 ? paid / fcf : null,
    growthStreak: streak,
    cut,
  };
}

// ---- Value: 2-stage DCF ----

export interface DcfInputs {
  growth: number; // explicit-period annual FCF growth (decimal)
  terminalGrowth: number; // perpetual growth after the explicit period
  discountRate: number; // WACC / required return
  years?: number; // explicit period length, default 5
}

export interface DcfResult {
  baseFcf: number | null;
  enterpriseValue: number | null;
  equityValue: number | null;
  intrinsicPerShare: number | null;
  /** Share of value coming from the terminal value (the Damodaran warning). */
  terminalShare: number | null;
}

export function twoStageDcf(f: Fundamentals, i: DcfInputs): DcfResult {
  const baseFcf = last(fcfSeries(f));
  const shares = f.sharesOutstanding;
  const { growth, terminalGrowth, discountRate } = i;
  const years = i.years ?? 5;
  if (baseFcf == null || baseFcf <= 0 || !shares || discountRate <= terminalGrowth) {
    return {
      baseFcf,
      enterpriseValue: null,
      equityValue: null,
      intrinsicPerShare: null,
      terminalShare: null,
    };
  }
  let pvExplicit = 0;
  let fcf = baseFcf;
  for (let t = 1; t <= years; t++) {
    fcf *= 1 + growth;
    pvExplicit += fcf / Math.pow(1 + discountRate, t);
  }
  const terminalValue =
    (fcf * (1 + terminalGrowth)) / (discountRate - terminalGrowth);
  const pvTerminal = terminalValue / Math.pow(1 + discountRate, years);
  const enterpriseValue = pvExplicit + pvTerminal;
  const netDebt = (f.totalDebt ?? 0) - (f.cash ?? 0);
  const equityValue = enterpriseValue - netDebt;
  return {
    baseFcf,
    enterpriseValue,
    equityValue,
    intrinsicPerShare: equityValue / shares,
    terminalShare: pvTerminal / enterpriseValue,
  };
}

export function marginOfSafety(intrinsic: number, price: number): number {
  return (intrinsic - price) / intrinsic;
}

// ---- Greenblatt Magic Formula (the two metrics) ----

export interface MagicFormula {
  earningsYield: number | null; // EBIT / EV
  returnOnCapital: number | null; // EBIT / (net working capital + net fixed assets), approx
}

/** Approximate Greenblatt metrics from the available normalized fields.
 *  EV = market cap + debt − cash; ROC proxied by EBIT / (assets − liabilities)
 *  when working-capital detail isn't available. Teaching-grade, not exact. */
export function magicFormula(f: Fundamentals, price: number): MagicFormula {
  const ebit = last(f.operatingIncome);
  const shares = f.sharesOutstanding;
  if (ebit == null || !shares) {
    return { earningsYield: null, returnOnCapital: null };
  }
  const marketCap = price * shares;
  const ev = marketCap + (f.totalDebt ?? 0) - (f.cash ?? 0);
  const investedCapital =
    f.totalAssets != null && f.totalLiabilities != null
      ? f.totalAssets - f.totalLiabilities
      : f.totalEquity;
  return {
    earningsYield: ev > 0 ? ebit / ev : null,
    returnOnCapital:
      investedCapital && investedCapital > 0 ? ebit / investedCapital : null,
  };
}

// ---- Growth / GARP ----

export interface GarpScore {
  pe: number | null;
  /** P/E ÷ growth%. Uses forward analyst growth when available, else trailing. */
  peg: number | null;
  /** The growth rate (decimal) that fed the PEG. */
  growth: number | null;
  /** Which growth basis produced the PEG — for honest labeling in the UI. */
  growthBasis: "forward" | "historical" | null;
  epsCagr: number | null; // trailing EPS CAGR over the series
  roe: number | null;
  netMargin: number | null;
  fcfConversion: number | null; // FCF ÷ net income
}

function cagr(series: AnnualPoint[]): number | null {
  const pts = series.filter((p) => p.value > 0);
  if (pts.length < 2) return null;
  const first = pts[0].value;
  const lastV = pts[pts.length - 1].value;
  const n = pts[pts.length - 1].year - pts[0].year;
  if (n <= 0 || first <= 0) return null;
  return Math.pow(lastV / first, 1 / n) - 1;
}

export function garp(f: Fundamentals, price: number): GarpScore {
  const eps = last(f.eps);
  const ni = last(f.netIncome);
  const rev = last(f.revenue);
  const fcf = last(fcfSeries(f));
  const epsCagr = cagr(f.eps);
  const pe = eps && eps > 0 ? price / eps : null;

  // Prefer analyst forward EPS growth (US via FMP); fall back to trailing EPS
  // CAGR (used for KR, which has no free consensus feed). Label which we used —
  // a forward PEG and a backward-looking PEG are not the same claim.
  let growth: number | null = null;
  let growthBasis: "forward" | "historical" | null = null;
  if (f.forwardEpsGrowth != null && f.forwardEpsGrowth > 0) {
    growth = f.forwardEpsGrowth;
    growthBasis = "forward";
  } else if (epsCagr != null && epsCagr > 0) {
    growth = epsCagr;
    growthBasis = "historical";
  }
  const peg =
    pe != null && growth != null && growth > 0 ? pe / (growth * 100) : null;

  return {
    pe,
    peg,
    growth,
    growthBasis,
    epsCagr,
    roe: ni != null && f.totalEquity && f.totalEquity > 0 ? ni / f.totalEquity : null,
    netMargin: ni != null && rev && rev > 0 ? ni / rev : null,
    fcfConversion: fcf != null && ni && ni > 0 ? fcf / ni : null,
  };
}
