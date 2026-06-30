export const meta = {
  name: 'strategy-lessons',
  description: 'Write 17 new bilingual finguru lessons (research→write→review to 5/5) for the strategy learning paths',
  phases: [
    { title: 'Write+Review (EN)', detail: 'per-lesson research→write→adversarial review loop to 5/5' },
    { title: 'Translate (KO)', detail: 'translate each finalized EN lesson to Korean' },
  ],
}

// The 17 Tier-A lessons. kind drives the target dir (guru→content/gurus,
// indicator→content/indicators). order slots into the project's bands.
const LESSONS = [
  // New gurus
  { slug: 'bogle-cost-matters', kind: 'guru', school: 'quant', strategy: 'academic-foundations', order: 314,
    title: 'John Bogle — The Relentless Rules of Humble Arithmetic',
    brief: 'Founder of Vanguard and the first retail index fund (1976). The doctrine that low cost is the most reliable predictor of net return ("cost matters hypothesis"); the tyranny of compounding costs; "don\'t look for the needle, buy the haystack"; the rise of indexing. Era b.1929–d.2019. Contribution: "The Index Fund & Cost Matters". Cite Bogle, Little Book of Common Sense Investing; Common Sense on Mutual Funds.' },
  { slug: 'geraldine-weiss', kind: 'guru', school: 'fundamental', strategy: 'growth-quality-valuation', order: 214,
    title: 'Geraldine Weiss — Dividend Yield Theory',
    brief: 'The "Grande Dame of Dividends"; Investment Quality Trends newsletter (1966); Dividends Don\'t Lie. Dividend-yield theory: a blue chip\'s historical high/low yield band brackets its under/overvaluation; 7-criterion blue-chip quality screen; dividends as the honest signal management can\'t fake. A pioneering woman in a male field (published as "G. Weiss"). Era b.1926–d.2022. Contribution: "Dividend Yield Theory".' },
  { slug: 't-rowe-price', kind: 'guru', school: 'fundamental', strategy: 'growth-quality-valuation', order: 215,
    title: 'T. Rowe Price — The Growth Stock Theory',
    brief: 'The "father of growth investing". Growth-stock theory: find companies in the "fertile field" of a long earnings growth runway and hold through the life cycle (growth → maturity → decline); buy early, sell when growth fades. Founded T. Rowe Price (1937), Growth Stock Fund, New Horizons Fund. Era b.1898–d.1983. Contribution: "Growth Stock Theory".' },
  { slug: 'turtle-traders', kind: 'guru', school: 'quant', strategy: 'systematic-practitioners', order: 315,
    title: 'The Turtle Traders & Managed-Futures Trend Following',
    brief: 'Richard Dennis & William Eckhardt\'s 1983 experiment to prove trading can be taught. Rules-based system: Donchian-channel breakout entries (20/55-day), ATR ("N") volatility-based position sizing, pyramiding into winners, systematic exits. The managed-futures/CTA tradition (Jerry Parker etc.). Honest note: the published edge decayed after it became public. This is a CONCEPT-style guru lesson about a school of traders, not one person. Contribution: "Systematic Trend Following". Cite Curtis Faith, Way of the Turtle; Michael Covel, The Complete TurtleTrader.' },
  // New concept lessons (indicators)
  { slug: 'index-funds-etfs', kind: 'indicator', school: 'quant', order: 114,
    title: 'Index Funds & ETFs — Owning the Whole Market',
    brief: 'What an index is (cap-weighted vs equal-weighted); index mutual fund vs ETF (intraday trading, tax efficiency, creation/redemption in one sentence); total-market vs S&P 500 vs sector; full vs sampled replication and tracking error; expense ratios and why they compound; how to actually buy one. Beginner level.' },
  { slug: 'asset-allocation', kind: 'indicator', school: 'quant', order: 115,
    title: 'Asset Allocation & the Three-Fund Portfolio',
    brief: 'The stock/bond/cash mix as the dominant driver of long-run outcomes; the three-fund portfolio (total US + total international + total bond); age/horizon-based allocation rules of thumb and their limits; rebalancing (calendar vs threshold) and why it enforces buy-low/sell-high; home bias. Beginner-intermediate. Distinguish from risk-parity (leveraged, advanced).' },
  { slug: 'dollar-cost-averaging', kind: 'indicator', school: 'quant', order: 116,
    title: 'Dollar-Cost Averaging — Steady Hands, Honest Math',
    brief: 'Investing a fixed amount on a schedule; how it lowers average cost in volatile markets and removes timing emotion; the HONEST evidence that lump-sum investing beats DCA ~2/3 of the time because markets rise more often than they fall (Vanguard research) — so DCA\'s real value is behavioral risk-smoothing, not higher expected return; automatic investing. Beginner.' },
  { slug: 'dividend-investing', kind: 'indicator', school: 'fundamental', order: 117,
    title: 'Dividend & Income Investing — Yield, Coverage & Compounding',
    brief: 'Dividend yield, payout ratio, dividend coverage; the math of DRIP/compounding; dividend aristocrats (25 consecutive years of increases) and kings; yield traps (a high yield signaling distress, not value); total-return vs pure-income thinking; REIT distributions and qualified-dividend tax basics. Beginner-intermediate. Keep practical (do NOT re-derive the dividend discount model — that lives in john-burr-williams).' },
  { slug: 'value-traps', kind: 'indicator', school: 'fundamental', order: 118,
    title: 'Value Traps — When Cheap Is a Warning, Not a Bargain',
    brief: 'Why a low P/E or P/B can signal secular decline, an eroding moat, peak/cyclical earnings, melting cash, or governance risk rather than a bargain; a checklist to distinguish a genuine discount from a deteriorating business; the contrarian\'s discipline of not catching a falling knife; classic examples (declining retailers, value-trap sectors). Intermediate.' },
  { slug: 'peg-ratio-garp', kind: 'indicator', school: 'fundamental', order: 119,
    title: 'PEG Ratio & Growth at a Reasonable Price (GARP)',
    brief: 'Defining the PEG ratio (P/E ÷ earnings growth rate) and how to read it (~1 as a rough fair-value heuristic, and its limits); the GARP framework blending value discipline with growth; Peter Lynch\'s use of PEG; the "growth at any price" failure mode and the dot-com lesson when high multiples collapse on any disappointment. Intermediate.' },
  { slug: 'smart-beta-and-factor-etfs', kind: 'indicator', school: 'quant', order: 120,
    title: 'Smart Beta & Factor ETFs — Factor Investing for the Rest of Us',
    brief: 'How single-factor and multi-factor index ETFs (value, momentum, quality, size, min-volatility) package factor premia long-only and cheaply; smart beta vs cap-weighting vs active; tracking error and the temptation (and danger) of factor timing; fee and turnover trade-offs vs long/short hedge-fund factor strategies. Intermediate. The retail "how to implement" rung for the factor path.' },
  { slug: 'the-business-cycle', kind: 'indicator', school: 'macro', order: 121,
    title: 'The Business & Credit Cycle 101',
    brief: 'The four phases (expansion → peak → contraction → trough); "your spending is my income" and how credit amplifies the cycle; the NBER definition of recession; short-term vs long-term debt cycles (Dalio framing, lightly); why cycles are not fixed-length. Beginner on-ramp before Dalio. Macro school.' },
  { slug: 'macro-indicators', kind: 'indicator', school: 'macro', order: 122,
    title: 'Reading the Economy — Leading, Coincident & Lagging Indicators',
    brief: 'The indicator dashboard: leading (yield curve / inversion, ISM new orders, building permits, jobless claims, stock market), coincident (nonfarm payrolls, industrial production), lagging (CPI/inflation, unemployment rate); what each signals and its lag; the Conference Board LEI; how a macro trader builds a read. Beginner-intermediate. Macro school.' },
  { slug: 'central-banks-monetary-policy', kind: 'indicator', school: 'macro', order: 123,
    title: 'Central Banks & Policy Regimes',
    brief: 'The policy rate and the transmission mechanism (rates → credit → spending → inflation/employment); the dual mandate and inflation targeting; forward guidance; QE/QT and the balance sheet; the difference between monetary and fiscal policy; why policy regime is the core driver of currency and rate trades. Intermediate. Macro school.' },
  { slug: 'merger-arbitrage', kind: 'indicator', school: 'fundamental', order: 124,
    title: 'Merger Arbitrage — Betting on the Deal Closing',
    brief: 'The arb spread as a market-implied probability of completion; cash deals (buy target below offer price, earn the spread on close) vs stock deals (long target / short acquirer at the exchange ratio); deal-break risks (antitrust, financing, shareholder vote, MAC clauses) and that breaks are rare but brutal; converting a spread to an annualized return; the risk-arbitrage lineage (Graham → Buffett "workouts"). Intermediate-advanced.' },
  { slug: 'swing-trading-playbook', kind: 'indicator', school: 'technical', order: 125,
    title: 'The Swing Trading Playbook — Entries, Stops & Targets',
    brief: 'A capstone synthesis: the repeatable workflow a swing trader runs on every trade — scan → regime check (trend filter) → setup selection → entry trigger (candlestick/break) → stop placement (below structure / ATR) → target & scale-out → trade management over days/weeks. Include 2 fully worked end-to-end examples combining a trend filter + support/resistance + candlestick trigger + ATR stop + R-multiple sizing. Intermediate. Technical school. Assembles tools taught elsewhere; do not re-teach each indicator from scratch.' },
  { slug: 'day-trading-reality-check', kind: 'indicator', school: 'technical', order: 126,
    title: 'Day Trading Reality Check — The Odds, The Costs, Why Most Lose',
    brief: 'An honest, evidence-first lesson and the mandatory FIRST step of the day-trading path. The academic evidence (Barber, Lee, Liu & Odean Taiwan studies; Chague, De-Losso & Giovannetti 2019 Brazil: 97% of those persisting >300 days lost money, ~1.1% beat minimum wage; commonly cited ~90% lose / ~1% durably profitable); the cost drag (commissions, bid/ask spread, slippage); leverage danger (Reg-T 2:1, broker 4:1 intraday); the FINRA Pattern Day Trader $25k minimum; the time/effort/tax reality; survivorship bias in trading-guru marketing. Framing: this is a study guide, NOT trading advice. Beginner level but sobering.' },
]

const FENCE = '```'

function frontmatterSpec(l) {
  const fields = [
    `title: ${JSON.stringify(l.title)}`,
    `slug: ${JSON.stringify(l.slug)}`,
    `kind: ${JSON.stringify(l.kind)}`,
    `school: ${JSON.stringify(l.school)}`,
  ]
  if (l.strategy) fields.push(`strategy: ${JSON.stringify(l.strategy)}`)
  fields.push(`level: "<beginner|intermediate|advanced>"`)
  fields.push(`order: ${l.order}`)
  fields.push(`summary: "<one or two sentence hook>"`)
  if (l.kind === 'guru') {
    fields.push(`era: "<e.g. b. 1929 – d. 2019>"`)
    fields.push(`contribution: "<short tagline>"`)
  }
  fields.push(`tags: ["...", "..."]`)
  fields.push(`prereqs: ["charles-dow"]`)
  return fields.join('\n')
}

const STYLE = `
## House style (match the existing 58 finguru lessons exactly)
- Audience: a total beginner who must still come away with a professional-depth understanding. Plain language; define every term in-line the first time (e.g. "the payout ratio — the share of profit paid out as dividends").
- Structure: start with a short hook section (e.g. "## Why this matters" or "## The one-sentence version"), then "## Who he was" for gurus, then concept sections with ## / ### headings. End with a "## Key takeaways" bulleted list.
- Length: ~1,400–2,200 words of body.
- Use MDX components that are registered in the site (use them, do not invent others):
  - <Callout type="key|note|warning"> ...markdown... </Callout>  (blank lines inside, as shown)
  - <BarChart labels={[...]} series={[{label:"...", data:[...]}]} caption="..." yLabel="..." />
  - <LineChart ... /> and <CandleChart ... /> for price/time series
  - <ScatterChart caption="..." xLabel="..." yLabel="..." series={[{label, line:true, color:"#38bdf8", data:[{x,y},...]}]} /> for risk/return
  - <ConceptDiagram caption="..." chart={\`flowchart LR ... \`} /> for loops/pipelines/decision trees (Mermaid)
  - <GlossaryTerm> for key terms if helpful
- Include AT LEAST 2 illustrative visuals (charts or a ConceptDiagram) appropriate to the topic, each with an honest "illustrative, not a forecast" style caption where numbers are involved.
- CRITICAL MDX gotcha: a bare "<" before a digit or operator in prose breaks the build (parsed as JSX). Always write "&lt;" or wrap in backticks (e.g. \`P/E < 15\` must be \`P/E &lt; 15\` or in a code span).
- Accuracy: this is educational content, never financial advice. Be honest about failure modes and evidence. No invented statistics — if you cite a number, it must be real and attributable; otherwise keep it qualitative or label it clearly illustrative.
- Output ONLY the lesson file content: the YAML frontmatter (--- ... ---) followed by the MDX body. No preamble, no closing commentary, and ABSOLUTELY no stray closing tags like </content> or </invoke> anywhere.
`

phase('Write+Review (EN)')

const written = await pipeline(
  LESSONS,
  // Stage 1: research the subject.
  (l) => agent(
    `You are a finance researcher gathering material for a beginner-facing lesson titled "${l.title}".\n\nTopic brief: ${l.brief}\n\nUse WebSearch/WebFetch to gather accurate, citable facts: key dates, the core ideas, the canonical sources, real (attributable) numbers, and the honest failure modes / criticisms. Return a dense, organized research brief (bullet points, ~400-700 words) that a writer can turn into the lesson. Flag anything commonly misquoted. Do NOT write the lesson itself.`,
    { label: `research:${l.slug}`, phase: 'Write+Review (EN)' },
  ),
  // Stage 2..N: write → review → revise loop until 5/5 (max 4 rounds).
  async (research, l) => {
    let draft = await agent(
      `Write the complete finguru lesson "${l.title}" as an MDX file.\n\nResearch brief to ground it:\n${research}\n\nFrontmatter — emit EXACTLY these keys (fill the <...> placeholders, keep slug/kind/school/strategy/order verbatim):\n---\n${frontmatterSpec(l)}\n---\n${STYLE}`,
      { label: `write:${l.slug}`, phase: 'Write+Review (EN)' },
    )
    let lastReview = null
    for (let round = 0; round < 4; round++) {
      const review = await agent(
        `You are an adversarial reviewer for a beginner→pro investing study site. Grade this lesson on three axes, each 1-5: (1) completeness/accuracy, (2) beginner-readability, (3) graphical aids (>=2 appropriate, correctly-used registered components: Callout/BarChart/LineChart/CandleChart/ScatterChart/ConceptDiagram). Also CHECK: valid YAML frontmatter with all required keys; no bare "<" before digits/operators in prose (must be &lt; or backticked); no stray </content> or </invoke> tags; ~1400-2200 words.\n\nReturn JSON: {"scores":{"completeness":N,"readability":N,"graphics":N},"pass":bool (true only if ALL three are 5),"fixes":["specific actionable fix", ...]}.\n\nLESSON:\n${draft}`,
        { label: `review:${l.slug}:r${round}`, phase: 'Write+Review (EN)', schema: {
          type: 'object', additionalProperties: false,
          properties: {
            scores: { type: 'object', additionalProperties: false, properties: {
              completeness: { type: 'integer' }, readability: { type: 'integer' }, graphics: { type: 'integer' } },
              required: ['completeness','readability','graphics'] },
            pass: { type: 'boolean' },
            fixes: { type: 'array', items: { type: 'string' } },
          },
          required: ['scores','pass','fixes'],
        } },
      )
      lastReview = review
      if (review.pass) break
      draft = await agent(
        `Revise this finguru lesson to fix EVERY issue below, while keeping everything that already works. Return the COMPLETE corrected MDX file only (frontmatter + body), no commentary, no stray closing tags.\n\nFixes required:\n${(review.fixes || []).map((f) => `- ${f}`).join('\n')}\n${STYLE}\n\nCURRENT LESSON:\n${draft}`,
        { label: `revise:${l.slug}:r${round}`, phase: 'Write+Review (EN)' },
      )
    }
    return { slug: l.slug, kind: l.kind, title: l.title, content: draft, review: lastReview }
  },
)

const ok = written.filter(Boolean)
log(`EN: ${ok.length}/${LESSONS.length} lessons drafted`)

// Stage: translate each to Korean.
phase('Translate (KO)')
const translated = await parallel(
  ok.map((d) => () =>
    agent(
      `Translate this finguru lesson into natural, fluent Korean for a beginner investing audience. RULES: translate prose, headings, Callout text, and chart "caption"/"label"/axis-label STRINGS only. Keep the YAML frontmatter keys and their values (title may be translated, but slug/kind/school/strategy/order/tags/prereqs VERBATIM), all MDX component tags, props structure, numbers, Mermaid chart={...} structure (translate only human-readable node labels), and code/backtick spans UNCHANGED. Preserve "&lt;" escapes. Output ONLY the translated MDX file (frontmatter + body), no preamble, no stray </content> or </invoke> tags.\n\nLESSON:\n${d.content}`,
      { label: `translate:${d.slug}`, phase: 'Translate (KO)' },
    ).then((ko) => ({ ...d, ko })),
  ),
)

return {
  lessons: translated.filter(Boolean).map((d) => ({
    slug: d.slug, kind: d.kind, title: d.title,
    en: d.content, ko: d.ko,
    scores: d.review?.scores ?? null, pass: d.review?.pass ?? false,
  })),
}
