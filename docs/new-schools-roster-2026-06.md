# New Investment Schools — Guru Roster & Implementation Status

The site's first 18 gurus all teach **technical analysis**. This document opens
three new schools — **Fundamentalists**, **Quants**, and **Macroists** — with a
research-curated roster for each. Checkboxes track lesson-build status; check one
off when its `.mdx` lesson (EN + KO) ships under `web/content/gurus/`.

Researched June 2026 via fan-out deep-research subagents (one school each).
Per-entry: signature idea a student would actually learn, a primary source, and
cross-school overlap flags. Sourcing leaned on Wikipedia-family + primary texts
(several premium finance domains were gated); **verify load-bearing figures
(AUM, returns, dates, ISBNs) against a second source before publishing.**

Legend: `[ ]` not started · core = non-negotiable for the curriculum spine ·
opt = optional/cuttable if trimming.

---

## School 1 — The Fundamentalists

Value, growth, quality, GARP, intrinsic-value/DCF, business-owner thinking.
Shared antagonist: the Efficient Market Hypothesis. Curriculum spine:
Williams (theory) → Graham & Dodd (discipline + Mr. Market) → Fisher
(qualitative/growth) → Buffett & Munger (synthesis: quality at a fair price).

### A. Foundational canon
- [x] **John Burr Williams** *(core)* — economist who gave intrinsic value its math: the "rule of present worth," root of the dividend discount model and DCF. *The Theory of Investment Value* (1938). Overlap: DCF is shared bedrock with quant/mainstream finance.
- [x] **Benjamin Graham** *(core)* — father of value investing: estimate intrinsic value, buy with a **margin of safety**, treat **"Mr. Market"** as an emotional counterparty. *Security Analysis* (1934); *The Intelligent Investor* (1949). Overlap: his screens prefigure the quant value factor.
- [x] **David Dodd** *(opt — can merge into Graham)* — Graham's co-author who systematized the rigorous, teachable "Graham & Dodd" framework. *Security Analysis* (1934). Note: do NOT attribute *Interpretation of Financial Statements* to him (that was Graham + Meredith, 1937).
- [x] **Philip Fisher** *(core)* — father of qualitative **growth investing**: buy a few outstanding companies and hold; research via **"scuttlebutt"** and his "Fifteen Points." *Common Stocks and Uncommon Profits* (1958).
- [x] **Warren Buffett** *(core)* — the definitive practitioner: evolved from deep value to "a wonderful company at a fair price" with durable **economic moats**. Berkshire shareholder letters (1977–present); *The Essays of Warren Buffett*.
- [x] **Charlie Munger** *(core)* — Buffett's partner: a **"latticework of mental models,"** inversion, quality over cheapness. *Poor Charlie's Almanack* (2005).

### B. Modern value & special situations
- [x] **Joel Greenblatt** *(core)* — the **"Magic Formula"** (earnings yield + return on capital) and special situations/spinoffs. *You Can Be a Stock Market Genius* (1997); *The Little Book That Beats the Market* (2005). Overlap: cleanest bridge to systematic/factor (quant) investing.
- [x] **Seth Klarman** *(core)* — margin of safety to capital-preservation extremes: risk ≠ volatility, hold cash rather than overpay. *Margin of Safety* (1991).
- [x] **Howard Marks** *(core)* — **second-level thinking**, market cycles as a pendulum, risk = probability of permanent loss. *The Most Important Thing* (2011); Oaktree memos. Overlap: straddles the macro/credit-cycle school — teach on cycles & risk, not stock selection.
- [x] **Mohnish Pabrai** *(opt)* — concentrated value openly **"cloned"** from Buffett; low-risk/high-uncertainty asymmetric bets ("Dhandho"). *The Dhandho Investor* (2007, Wiley).

### C. Growth, quality, GARP & valuation toolkit
- [x] **Peter Lynch** *(core)* — **GARP** disciplined by the **PEG ratio**; "invest in what you know," hunt ten-baggers. *One Up on Wall Street* (1989); *Beating the Street* (1993).
- [x] **Aswath Damodaran** *(core)* — "Dean of Valuation": intrinsic valuation via DCF + **"narrative and numbers."** *Investment Valuation*; *The Little Book of Valuation* (2011); *Narrative and Numbers* (2017). Overlap: publishes the equity risk premiums/betas quants use.
- [x] **Terry Smith** *(opt)* — modern **quality investing**: "buy good companies, don't overpay, do nothing" (high ROCE, moats, free cash flow). *Investing for Growth* (2020). Overlap: maps to the quant quality factor.
- [x] **Pat Dorsey** *(opt)* — turned "moat" into a teachable taxonomy (four sources of moats). *The Five Rules for Successful Stock Investing* (2003); *The Little Book That Builds Wealth* (2008).

---

## School 2 — The Quants

Systematic/rules-based, factor investing, statistical arbitrage, algorithmic/HFT,
risk parity, ML-driven. Arc: theory → practice → factors & risk → modern ML.

### I. Academic foundations
- [x] **Harry Markowitz** *(core)* — Modern Portfolio Theory: mean-variance optimization, the **efficient frontier**, diversification math (Nobel 1990). "Portfolio Selection," *Journal of Finance* (1952).
- [x] **William F. Sharpe** *(core)* — **CAPM** (return = risk-free + beta × market premium) and the **Sharpe ratio** (Nobel 1990). *Journal of Finance* (1964).
- [x] **Eugene Fama & Kenneth French** *(core — taught as one unit)* — the **Efficient Market Hypothesis** plus the **3-factor and 5-factor** models (market, size, value, profitability, investment); French's public Data Library. *JFE* (1993); five-factor (2015). Overlap: value/size factors anchor the fundamental school too.
- [x] **Black, Scholes & Merton** *(core — one unit)* — the **Black–Scholes–Merton** option-pricing model: dynamic delta-hedging / risk-neutral pricing makes volatility the traded quantity (Nobel 1997). *J. Political Economy* (1973).

### II. Legendary practitioners
- [x] **Edward O. Thorp** *(core)* — "math beats the market": edge + hedge + **Kelly criterion** bet-sizing; card counting → convertible arbitrage. *Beat the Dealer* (1962); *A Man for All Markets* (2017).
- [x] **Jim Simons** *(core)* — Renaissance / **Medallion** (~39% net/yr, 1988–2018); model-first, scientists-over-financiers; ML signal discovery (with Mercer & Brown). Case study via Zuckerman, *The Man Who Solved the Market* (2019).
- [x] **David E. Shaw** *(opt)* — industrial-scale **statistical arbitrage**; the CS-to-finance bridge. No book; firm history.
- [x] **Cliff Asness** *(core)* — AQR; live **factor investing** (value, momentum, quality, carry). "Value and Momentum Everywhere," *Journal of Finance* (2013). Overlap: value-factor work touches the fundamental school.

### III. Factor & risk angles
- [x] **Jegadeesh & Titman + Mark Carhart** *(core — one unit)* — the **momentum factor** and Carhart's four-factor model. *Journal of Finance* (1993); Carhart (1997).
- [x] **Richard Grinold & Ronald Kahn** *(opt — one unit)* — the **Fundamental Law of Active Management** (IR ≈ IC × √BR): a little skill applied broadly beats a lot applied narrowly. *Active Portfolio Management* (1995).
- [x] **Edward Qian & Ray Dalio** *(core — one unit)* — **risk parity**: allocate by risk contribution, not capital; Dalio's All Weather (1996). Qian, PanAgora (2005). **Overlap (flag):** Dalio is primarily a *macro* guru — include here only for systematic risk parity; don't double-count.
- [x] **Andrew W. Lo** *(opt)* — the **Adaptive Markets Hypothesis**: efficiency is dynamic; factor premia decay and revive. *Adaptive Markets* (2017).

### IV. Modern: ML, microstructure & model risk
- [x] **Marcos López de Prado** *(core)* — **ML for asset management**: triple-barrier labeling, meta-labeling, overfitting discipline (Deflated Sharpe), Hierarchical Risk Parity. *Advances in Financial Machine Learning* (2018).
- [x] **Emanuel Derman** *(opt)* — the conscience of quant: real models (Black-Derman-Toy, local vol) + **models-as-metaphors** humility. *My Life as a Quant* (2004); *Models.Behaving.Badly* (2011).

> **Optional modules** (add if expanding): microstructure/HFT unit — *Kyle's lambda* + *Almgren-Chriss optimal execution*; *Robert Litterman* (Black–Litterman); *David Harding* (Winton, systematic trend-following); *Nassim Taleb* (tail-risk philosophy). Omit Ken Griffin/Citadel from the core (platform builder, not a quant researcher).

---

## School 3 — The Macroists

Top-down: currencies, rates, commodities, central-bank & policy regimes,
business cycles, reflexivity. Spans legends → moderns → framework economists.

### A. The legendary traders
- [x] **George Soros** *(core)* — **reflexivity**: prices and fundamentals feed back into boom/bust; "broke the Bank of England" (1992). *The Alchemy of Finance* (1987).
- [x] **Stanley Druckenmiller** *(core)* — top-down macro with **conviction-based asymmetric sizing** ("It takes courage to be a pig"); executed the 1992 sterling trade. Schwager, *The New Market Wizards* (1992).
- [x] **Paul Tudor Jones II** *(core)* — discretionary macro on technicals + momentum with **asymmetric ~5:1 reward-to-risk**; called Black Monday 1987. Documentary *Trader*; Schwager's *Market Wizards* (1989).
- [x] **Bruce Kovner** *(opt)* — **risk-first macro**: size to survive being wrong, define the exit before entering. Schwager's *Market Wizards* (1989).
- [x] **Jim Rogers** *(core)* — qualitative global macro with a **commodities** tilt, built from on-the-ground research; most beginner-accessible writer. *Investment Biker* (1994); *Hot Commodities* (2004).
- [x] **Michael Steinhardt** *(opt — swappable with Louis Bacon)* — **"variant perception"**: position on a well-researched view that differs from consensus. *No Bull* (2001).

### B. Modern practitioners & educators
- [x] **Ray Dalio** *(core)* — the economy as a **"machine"** driven by debt cycles; risk parity / All Weather. Free video *How the Economic Machine Works*; *Principles* (2017). **Overlap (flag):** bridge to the quant/systematic school.
- [x] **Kyle Bass** *(opt)* — **convex asymmetric "tail-risk" construction** (subprime CDS, 2007); built-in cautionary lesson (later China/Japan theses underperformed). Michael Lewis, *Boomerang* (2011).
- [x] **Hugh Hendry** *(opt)* — contrarian, narrative-driven macro and the discipline of communicating a thesis against the crowd. *Acid Capitalist* podcast.
- [x] **Raoul Pal** *(opt)* — liquidity-cycle/structural-thematic macro delivered as **macro education**; Global Macro Investor, Real Vision. *(Note: frame Grant Williams as host/contributor, not co-founder.)*

### C. Framework economists (the intellectual spine)
- [x] **John Maynard Keynes** *(core)* — **"animal spirits,"** the **"beauty contest,"** and his own arc from macro timing (nearly wiped out twice) to concentrated value. *The General Theory* (1936), Ch. 12. *(Flag: the "market can stay irrational…" quote is apocryphal — not Keynes.)*
- [x] **Hyman Minsky** *(core)* — the **Financial Instability Hypothesis**: "stability breeds instability" (hedge → speculative → Ponzi finance). *Stabilizing an Unstable Economy* (1986). ("Minsky moment" coined by McCulley, 1998.)

> **Honorable mentions** (optional guides): Louis Bacon (Moore Capital); Alan Howard / Chris Rokos (modern rates wing); Irving Fisher (debt-deflation); Charles Kindleberger (*Manias, Panics, and Crashes*); Friedrich Hayek (Austrian cycle); Robert Shiller (CAPE, *Irrational Exuberance*); Nassim Taleb (antifragility, anti-forecasting); Mohamed El-Erian ("New Normal"); Lyn Alden (*Broken Money*, 2023).

---

## Cross-school overlap map (resolve before authoring)

- **DCF / present value** — Williams & Damodaran (fundamental) ↔ all quant/mainstream finance.
- **Value & size factors** — Fama-French & Asness (quant) ↔ Graham lineage (fundamental).
- **Quality factor** — Smith & Dorsey (fundamental) ↔ AQR "Quality Minus Junk" (quant).
- **Ray Dalio** — appears in both **quant** (risk parity) and **macro** (debt machine). Pick a primary home (recommend macro) and cross-link.
- **Howard Marks** — value DNA but a credit-cycle/macro lens. Recommend fundamental home, cross-link to macro.
- **Nassim Taleb / Andrew Lo** — risk philosophy spanning quant & macro.

## Suggested first-wave build order (if piloting)

1. **Graham** (fundamental anchor) · **Markowitz** (quant anchor) · **Soros** (macro anchor) — one clean pilot per school.
2. Then fan out the rest per the de-risk-then-parallelize pattern used for the TA gurus.
