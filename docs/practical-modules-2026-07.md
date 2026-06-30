# Practical Modules — Strategy Learning Paths → Real Practice

*Synthesis of 7 per-cluster deep-research passes (2026-07) + build plan.*
*Goal: each of the 13 strategy paths (`web/lib/strategies.ts`) ends in a hands-on module that takes REAL data, lets the learner practice the strategy, and bridges responsibly toward real investing.*

---

## 0. The headline finding

13 strategies do **not** need 13 data pipelines or 13 bespoke labs. Their data needs
collapse onto **5 shared data layers**, and their exercises collapse onto **~6 reusable
interactive labs**. Build the backbone once; each strategy is a thin front-end + copy.

A second finding runs through every brief: **almost every "live" market-data source is
either flaky or license-restricted** for a public site. So the safe, cheap, and
pedagogically-fine pattern is:

> **Build-time ingestion → pre-baked static JSON shipped with `web/` → client-side compute.**
> Live per-user fetching is the exception, used only where unavoidable (current price for a
> ticker widget) and then via a thin **cached** backend endpoint over a curated allowlist.

This matches the site's existing "· illustrative" `ChartFrame` framing and the no-new-deps
motion-system constraint.

---

## 1. The shared DATA backbone (build once)

| # | Layer | What | Best source (free, redistribution-aware) | Used by |
|---|---|---|---|---|
| **D1** | **Asset-class long-run returns** | Annual total returns by asset class (US stk, intl stk, 10y Treasury, T-bill/cash, Baa, gold, REIT, commodities) + CPI, 1928→now | **Damodaran `histretSP.xls`** (1928+, updated Jan 2026), **Shiller `ie_data.xls`** (monthly 1871+), **Ken French** (intl/factor). Pre-bake to `web/lib/data/asset-returns.json` | index-passive, lifecycle, diversified, factor-quant, real-assets |
| **D2** | **Daily adjusted OHLCV + dividends** | Split/div-adjusted daily prices for a curated ETF + large-cap **allowlist** | yfinance **at build time** (Apache wrapper; Yahoo ToS personal-use → don't serve raw live). Pre-bake to static JSON. *Stooq now PoW/API-gated; Tiingo "internal-use-only"* | value, dividend, growth (timing), factor-quant (ETF), real-assets (REIT), trend-momentum, active-trading, options-income (underlying) |
| **D3** | **FRED macro series** | Rates, yield curve (`T10Y3M`,`DGS10`,`DGS3MO`), CPI, `UNRATE`, `FEDFUNDS`, `M2SL`, `USREC`, `CFNAI`/`INDPRO` (free PMI proxies), `DTWEXBGS`/`DCOILWTICO`/gold | **FRED API** (free key, 120 req/min). Pre-bake; show required notice; **never train models on it** | global-macro (heavy), diversified (rf/bonds), real-assets (rates/CPI overlay), options-income (`DGS3MO` rf) |
| **D4** | **Company fundamentals** | Income stmt, balance sheet, cash-flow line items, shares, dividend history → FCF, EBIT, EV, ratios | **SEC EDGAR companyfacts** XBRL (free, public-domain, US-only; 10 req/s + real UA). FMP optional intl/DCF fallback | dividend, value, growth |
| **D5** | **Factor returns** | FF 5-factor + Momentum monthly long/short series, 1926/1963→now | **Ken French Data Library** (zipped CSV; `-99.99` missing, % units; reconstructed monthly → pin a dated snapshot) | factor-quant |

**Curated/static side-datasets** (small, hand-maintained, versioned with citations):
- **`analyst-estimates`** — forward EPS growth for the growth PEG (EDGAR lacks it; from FMP/AV).
- **`reit-ffo.json`** — FFO/AFFO for ~6 marquee REITs (FFO is non-GAAP, **not** in XBRL → curate).
- **`deals.json`** — a few real M&A deals (terms transcribed from 8-K/DEFM14A) + a deal that broke.
- **intraday episodes** — a handful of frozen intraday/daily setups (clean breakout, false breakout, stop-run) for the trade simulator (live intraday is history-capped + licensed).
- **option defaults** — per-ticker IV/dividend seeds; chains are **computed via Black-Scholes**, not fetched (every free real-chain source forbids public redistribution).

---

## 2. The shared COMPUTE backbone

| Engine | What | Where | Shared by |
|---|---|---|---|
| **C1 Portfolio backtester** | weights → rebalance → equity curve, CAGR, vol, Sharpe, maxDD, real-return, DCA/contributions, glide-path interpolation, sequence-of-returns | pure TS `web/lib/backtest.ts`, client-side | allocation cluster, factor-quant, real-assets, trend |
| **C2 Technical indicators + no-lookahead sim** | SMA/EMA, RSI, MACD, Bollinger, ADX, ATR; bar-by-bar trade engine (conservative intrabar stop-first), R-multiples, position sizing | pure TS `web/lib/ta.ts` | trend-momentum, active-trading |
| **C3 Fundamental math** | FCF, payout (earnings & FCF), coverage, 2-stage DCF, Greenblatt EY+ROC, PEG, ROIC, FCF-conversion | pure TS `web/lib/fundamentals.ts` | dividend, value, growth, real-assets (FFO payout) |
| **C4 Black-Scholes** | Merton (continuous-div) pricing + delta/theta, synthetic chain, covered-call/CSP/wheel payoff, annualized-return-on-premium | ~40-line pure TS `web/lib/options.ts` | options-income |
| **C5 Factor regression** | OLS of excess return on FF factors → alpha/betas/t-stats/R², rolling decay | **server-side Python** (statsmodels) OR simplified client OLS | factor-quant |
| **C6 Macro signals** | yield-curve spread, YoY, z-scores, Sahm rule, probit recession prob, growth×inflation quadrant | pure TS `web/lib/macro.ts` | global-macro |

---

## 3. The ~6 reusable LABS → which strategy uses which

There are not 13 labs. There are **6 lab components**; most strategies reuse one with
different copy/config.

| Lab | Component | Strategies it serves | Core exercise |
|---|---|---|---|
| **L1 Portfolio Backtester** | `PortfolioLab` (+ glide-path & cost-drag/DCA modes) | index-passive, lifecycle, diversified | build a mix → backtest vs benchmark; cost-drag; glide path; 60/40 vs All-Weather; sequence risk |
| **L2 Company Analyzer** | `CompanyLab` | dividend, value, growth, (real-assets REIT mode) | enter ticker → dividend-safety / DCF + Magic-Formula / GARP-quality scorecard |
| **L3 Macro Dashboard** | `MacroLab` | global-macro | read-the-cycle dashboard + recession gauge + regime quadrant |
| **L4 Chart/Trade Lab** | `TradeLab` | trend-momentum, active-trading | honest rules-based backtest; setup annotator + no-lookahead paper-trade with R-multiples |
| **L5 Options Lab** | `OptionsLab` | options-income | synthetic BS chain + covered-call/wheel payoff + BXM buy-write backtest |
| **L6 Factor & Event** | `FactorLab`, `DealLab` | factor-quant, event-driven | factor-tilt backtest + regression (decay/crowding); merger-arb spread calculator |

real-assets = L1 (sleeve sizing) + an L2 "REIT mode" (FFO ≠ net income reveal, rate overlay).
factor-quant = L1 (tilt backtest) + L6 regression.

---

## 4. Per-strategy practical module (the capstone exercise + its honesty hook)

1. **index-passive** → L1 cost-drag/DCA: watch a 1% fee erase decades of wealth; lump-sum vs DCA. *Hook: fees are the one variable you control.*
2. **lifecycle** → L1 glide-path + sequence-of-returns: same average return, crash-at-retirement vs not → very different outcome. *Hook: sequence risk; 2022 broke the bond ballast.*
3. **diversified** → L1 60/40 vs All-Weather vs 100% stocks: CAGR/vol/Sharpe/maxDD + rebalancing. *Hook: 2022 — stocks AND bonds fell together.*
4. **dividend-income** → L2 dividend-safety scorecard: yield, payout-on-earnings vs payout-on-**FCF**, growth streak. *Hook: high yield is often a warning (yield trap).*
5. **value** → L2 guided 2-stage DCF (sliders) + Magic-Formula rank. *Hook: terminal value dominates → the answer is mostly a guess; cheap can be a trap.*
6. **growth** → L2 PEG + quality/compounding scorecard. *Hook: PEG inherits analyst-estimate error; growth ≠ quality.*
7. **factor-quant** → L1 factor tilt (real ETFs) + L6 regression. *Hook: your alpha ≈ 0 and value had a lost decade (2010-20); decay/crowding/overfitting.*
8. **global-macro** → L3 cycle dashboard + recession gauge + quadrant. *Hook: macro timing is brutal; signals give false positives; express as small tilts, not leverage.*
9. **real-assets** → L2 REIT mode (FFO reveal) + rate overlay + L1 sleeve sizing. *Hook: 265% net-income payout looks doomed until you see FFO; 2022 rate-spike drawdown.*
10. **options-income** → L5 covered-call/wheel payoff + BXM backtest. *Hook: BXM 8.5% vs S&P 11.3% — capped upside; 2020 buy-write badly lagged the recovery.*
11. **trend-momentum** → L4 honest backtest (200-day SMA / 12-1 / Donchian). *Hook: whipsaw chop + momentum crashes are the price of the edge.*
12. **event-driven** → L6 merger-arb spread calculator on a real deal. *Hook: nickels in front of a steamroller — small upside, large break-downside.*
13. **active-trading** → L4 setup annotator + no-lookahead paper-trade. *Hook: ~90-97% of day traders lose; cost drag turns the edge negative.*

---

## 5. Chart-component gaps (small, isolated)

Reuse `LineChart`/`BarChart`/`ScatterChart`/`CandleChart` (`web/components/charts/`) as-is for
~90%. New work:
- **`xZones`** on `LineChart` — vertical time-axis shading for NBER recession bands (`USREC`). (existing `zones` is horizontal value-bands only).
- **`StackedAreaChart`** — glide-path allocation-over-time (Chart.js `Filler` already registered → new component, no new dep).
- **`DrawdownChart`** — a `LineChart` filled-to-origin, inverted (thin wrapper).
- **`PayoffChart`** *(optional polish)* — `LineChart` preset for option hockey-sticks (`levels` strike/breakeven, `zones` capped region). Load-bearing math is fine on plain `LineChart`.

---

## 6. Architecture: where compute lives

- **Default = client-side over pre-baked static JSON.** D1, D2, D5 and curated side-datasets
  ship as static files; C1/C2/C3/C4/C6 are pure TS in the browser. Zero runtime API
  dependency, no licensing exposure, instant, offline-friendly. Fits the existing static MDX site.
- **Thin cached backend endpoints (FastAPI `api/`, greenfield — no market code today) only for:**
  - **C5 factor regression** (statsmodels OLS + t-stats) — genuinely beyond comfortable client JS.
  - **Live current price / fundamentals lookup** for L2 (EDGAR companyfacts + delayed spot),
    behind a **24h+ cache** and a **curated US large-cap allowlist** (sidesteps EDGAR US-only
    scope + rate limits). Korea fundamentals are a known gap (DART/OpenDART later).
- **Data refresh** = a build-time ingestion script (`scripts/ingest-market-data.*`) run on a
  cadence, committing updated JSON — same spirit as the RAG ingest.

---

## 7. The mandatory honesty thread (every module)

Every brief independently converged on this: a practical module that makes investing look easy
would be irresponsible. Each lab must end with the same message, surfaced in-UI, linking the
existing caveat lessons (`value-traps`, yield-traps in `dividend-investing`,
`day-trading-reality-check`, `risk-management`, Lopez-de-Prado overfitting):

> Screens and models produce a **shortlist and a hypothesis, never a decision.** Past/backtested
> performance ≠ future. DCFs are guesses dominated by terminal value; PEG inherits analyst
> error; "cheap"/"high-yield" are often warnings; macro timing fails; ~90% of day traders lose;
> selling vol loses big in crashes. Educational, **not financial advice.**

Plus required source notices (FRED: *"not endorsed or certified by the Federal Reserve Bank of
St. Louis"*; FRED data must never be used to train/fine-tune a model — fine for charts/RAG display).

---

## 8. Suggested build order (phased)

**Phase 0 — Backbone + pilot (de-risk before fan-out)**
- Ingestion script + D1 (`asset-returns.json`) + D2 (curated ETF allowlist).
- C1 backtest engine (`backtest.ts`) + `StackedAreaChart`/`DrawdownChart`.
- `practical` step slot in `strategies.ts` + render in `strategies/[id]/page.tsx`.
- **Pilot lab L1** wired into **diversified** (the flagship; exercises the whole engine).
- Get pilot approved before fanning out (mirrors the original content-pipeline discipline).

**Phase 1 — L1 family** → index-passive, lifecycle, diversified (+ real-assets sleeve sizing).

**Phase 2 — L2 Company Analyzer** → D4 (EDGAR) + thin backend lookup + C3; dividend, value, growth, real-assets REIT mode (+ `reit-ffo.json`).

**Phase 3 — L4 Chart/Trade Lab** → C2 + intraday episodes; trend-momentum, active-trading.

**Phase 4 — L3 Macro Dashboard** → D3 (FRED) + C6 + `xZones`; global-macro.

**Phase 5 — L5 Options + L6 Factor/Event** → C4/C5 + Ken French + `deals.json` + BXM CSV; options-income, factor-quant, event-driven.

**Phase 6 — i18n (KO) + RAG re-ingest** of any new explainer copy, + disclaimers/source-notice audit.

Each phase: build the shared piece once, then add thin per-strategy front-ends + bilingual copy
held to the same research→write→review bar as existing lessons.

---

## 9. Open decisions for the user (see chat)
1. **Architecture**: pure client + pre-baked static (simplest, recommended) vs add the thin
   FastAPI data layer (needed for live ticker lookup + factor regression).
2. **Scope of v1**: all 6 labs, or start with the L1 allocation family (highest learner value,
   lowest data risk, serves 5 strategies) and expand?
3. **Live ticker lookup vs curated examples** for the Company Analyzer (L2): live EDGAR over an
   allowlist, or ship curated example companies first?
