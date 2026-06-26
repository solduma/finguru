# Strategy-Centric Learning Paths — Research Synthesis & Build Spec (2026-06)

Source: 4 deep-research passes (Phase 1 taxonomy WF `wf_6aa63917-a3c`, adversarially
verified; Phases 2–4 = 11 parallel curation/quiz agents). Drives the "Learning Path"
revamp: a **Strategy** layer above the existing 4 schools, each strategy = one ordered,
cross-school learning path, plus a "Find My Strategy" quiz.

## The 10 strategies (ranked by suitability as a beginner's *starting identity*)

CFA Institute frames active equity by approach (fundamental/discretionary vs.
quant/systematic) × four strategy types (bottom-up → value/growth, factor-based,
top-down, activist), crossed with the active/passive axis. Evidence: Index/Passive is
the highest-suitability default (Sharpe 1991 "Arithmetic of Active Management";
Fama-French 2010; SPIVA long-horizon underperformance 80–92%). Day Trading is the
lowest-suitability, highest-risk identity (Chague et al. 2019: ~1% of persistent
Brazilian day traders beat minimum wage; ~90% lose) and MUST be framed with risk
warnings and gated in the quiz.

| # | Strategy | id | Primary school(s) | Risk |
|---|----------|-----|-------------------|------|
| 1 | Index / Passive | `index-passive` | quant (+ its own) | low |
| 2 | Dividend / Income | `dividend-income` | fundamental | low |
| 3 | Value | `value` | fundamental | med-low |
| 4 | Growth | `growth` | fundamental→technical | med |
| 5 | Factor / Quant | `factor-quant` | quant | med |
| 6 | Global Macro | `global-macro` | macro | med-high |
| 7 | Trend Following / Momentum | `trend-momentum` | technical + quant | med-high |
| 8 | Event-Driven / Special Situations | `event-driven` | fundamental | med-high |
| 9 | Swing Trading | `swing-trading` | technical | high |
| 10 | Day Trading | `day-trading` | technical | very high (gated) |

Risk order (low→high), used as the quiz tie-break and the "passive floor":
`index-passive < dividend-income < value < factor-quant < growth < event-driven < global-macro < swing-trading < trend-momentum < day-trading`.

## Ordered learning paths (●=existing lesson, ✚=NEW lesson required)

**1. Index / Passive** — ● william-sharpe · ✚ bogle-cost-matters · ● fama-french ·
✚ index-funds-etfs · ● harry-markowitz · ✚ asset-allocation · ✚ dollar-cost-averaging ·
● trading-psychology · ● warren-buffett · ● risk-management

**2. Dividend / Income** — ● charles-dow · ● benjamin-graham · ● john-burr-williams ·
✚ dividend-investing · ✚ geraldine-weiss · ● peter-lynch · ● terry-smith · ● pat-dorsey ·
● risk-management

**3. Value** — ● john-burr-williams · ● benjamin-graham · ● david-dodd · ● warren-buffett ·
● charlie-munger · ● pat-dorsey · ● peter-lynch · ✚ value-traps · ● joel-greenblatt ·
● aswath-damodaran · ● terry-smith · ● seth-klarman · ● howard-marks · ● mohnish-pabrai
(· ● fama-french optional)

**4. Growth** — ● peter-lynch · ● philip-fisher · ✚ t-rowe-price · ● terry-smith ·
✚ peg-ratio-garp · ● joel-greenblatt · ● warren-buffett · ● william-oneil ·
● stan-weinstein · ● mark-minervini · ● risk-management

**5. Factor / Quant** — ● william-sharpe · ● harry-markowitz · ● fama-french ·
● jegadeesh-titman-carhart · ● joel-greenblatt · ● cliff-asness · ● risk-parity ·
● grinold-kahn · ● andrew-lo · ● lopez-de-prado · ✚ smart-beta-and-factor-etfs
(· factor-zoo lesson optional / foldable into lopez-de-prado)

**6. Global Macro** — ✚ the-business-cycle · ✚ macro-indicators ·
✚ central-banks-monetary-policy · ● ray-dalio · ● john-maynard-keynes · ● hyman-minsky ·
● risk-parity · ● george-soros · ● stanley-druckenmiller · ● paul-tudor-jones ·
● bruce-kovner · ● michael-steinhardt · ● jim-rogers · ● kyle-bass · ● hugh-hendry · ● raoul-pal

**7. Trend Following / Momentum** — ● charles-dow · ● moving-averages · ● jesse-livermore ·
● support-resistance-patterns · ● volume-obv · ● stan-weinstein · ● adx-atr · ● martin-pring ·
● william-oneil · ● mark-minervini · ✚ turtle-traders · ● jegadeesh-titman-carhart ·
● cliff-asness · ● risk-management · ● trading-psychology (✚ nicolas-darvas optional)

**8. Event-Driven / Special Situations** — ● benjamin-graham · ● warren-buffett ·
● joel-greenblatt · ● seth-klarman · ● howard-marks · ● mohnish-pabrai · ✚ merger-arbitrage
(✚ shareholder-activism optional). NOTE: thinnest corpus; lives under fundamental
`value-special-situations`, not a standalone school.

**9. Swing Trading** — ● charles-dow · ● support-resistance-patterns · ● candlestick-patterns ·
● steve-nison · ● volume-obv · ● moving-averages · ● rsi · ● macd · ● bollinger-bands ·
● john-bollinger · ● adx-atr · ● welles-wilder · ● richard-wyckoff · ● william-jiler ·
● linda-raschke · ● alan-farley · ● larry-williams · ● thomas-demark · ✚ swing-trading-playbook ·
● risk-management · ● trading-psychology

**10. Day Trading** — ✚ day-trading-reality-check (FIRST, mandatory) · ● trading-psychology ·
● risk-management · ● support-resistance-patterns · ● volume-obv · ● candlestick-patterns ·
● charles-dow · ● jesse-livermore · ● richard-wyckoff · ● larry-williams · ● linda-raschke ·
● alan-farley · ● thomas-demark · ● michael-huddleston (✚ order-flow-vwap-intraday optional)

## New lessons required

### Tier A — essential (build this round) — 17 lessons (×2 locales = 34 files)
| slug | title | kind | school | for |
|------|-------|------|--------|-----|
| `bogle-cost-matters` | John Bogle — The Relentless Rules of Humble Arithmetic | guru | quant | Index |
| `index-funds-etfs` | Index Funds & ETFs — Owning the Whole Market | indicator | quant | Index |
| `asset-allocation` | Asset Allocation & the Three-Fund Portfolio | indicator | quant | Index |
| `dollar-cost-averaging` | Dollar-Cost Averaging — Steady Hands, Honest Math | indicator | quant | Index |
| `dividend-investing` | Dividend & Income Investing: Yield, Coverage, Compounding | indicator | fundamental | Dividend |
| `geraldine-weiss` | Geraldine Weiss — Dividend Yield Theory | guru | fundamental | Dividend |
| `value-traps` | Value Traps — When Cheap Is a Warning, Not a Bargain | indicator | fundamental | Value |
| `t-rowe-price` | T. Rowe Price — The Growth Stock Theory | guru | fundamental | Growth |
| `peg-ratio-garp` | PEG Ratio & Growth at a Reasonable Price | indicator | fundamental | Growth |
| `smart-beta-and-factor-etfs` | Smart Beta & Factor ETFs | indicator | quant | Factor |
| `the-business-cycle` | The Business & Credit Cycle 101 | indicator | macro | Macro |
| `macro-indicators` | Reading the Economy: Leading, Coincident & Lagging Indicators | indicator | macro | Macro |
| `central-banks-monetary-policy` | Central Banks & Policy Regimes | indicator | macro | Macro |
| `turtle-traders` | The Turtle Traders & Managed-Futures Trend Following | guru | quant | Trend |
| `merger-arbitrage` | Merger Arbitrage — Betting on the Deal Closing | indicator | fundamental | Event-Driven |
| `swing-trading-playbook` | The Swing Trading Playbook: Entries, Stops & Targets | indicator | technical | Swing |
| `day-trading-reality-check` | Day Trading Reality Check — the odds, costs, why most lose | indicator | technical | Day |

New gurus: bogle-cost-matters, geraldine-weiss, t-rowe-price, turtle-traders (4).
New concept lessons: 13. (kind=guru → content/gurus/, kind=indicator → content/indicators/.)

### Tier B — optional enrichment (defer)
burton-malkiel/charles-ellis, factor-zoo-and-replication-crisis, nicolas-darvas,
time-series-momentum, shareholder-activism, order-flow-vwap-intraday.

## "Find My Strategy" quiz

8 scoring dimensions: **H** horizon · **E** effort · **R** risk tolerance ·
**A** analytical style (Systems/Business/Charts/Macro) · **I** income-vs-growth ·
**T** temperament/tempo · **X** experience · **C** control/DIY. 10 questions; each option
adds points to dimensions AND directly to strategies. Grounded in Grable & Lytton Risk
Tolerance Scale, Vanguard 5-factor questionnaire, behavioral-finance loss aversion.

Scoring: sum strategy points → guardrails (Day Trading HARD-gated: only eligible if
risk+effort+experience+explicit-capacity all high, else score=0; Swing/Trend soft-gated
×0.5 for inexperienced low-effort users; income override; long-horizon+low-risk → boost
Index/Dividend) → rank → tie-break toward lower risk → **Index/Passive floor** (if scores
flat or an inexperienced user lands on an active strategy, Index becomes primary).
Result: primary + 2 runners-up + one-line personalized "why" + path link + risk caveats
(strong, prominent for Day Trading). Full question set & point values in the Phase-4
agent output (reproduced in build code as `lib/quiz.ts`).

## IA decision (folding strategies into the Schools area)

Strategies are **cross-cutting** (Value spans fundamental canon + special-situations;
Trend spans technical + quant), so they are NOT the same as the existing 20
school→sub-strategy groupings. Resolution: add a new `STRATEGIES` data structure
(`lib/strategies.ts`) holding each strategy's metadata + explicit ordered slug list.
Surface strategies as the primary entry of the learning area; keep "browse by school"
as a secondary view. `/path` (today a flat list) becomes the **Find My Strategy** quiz.
