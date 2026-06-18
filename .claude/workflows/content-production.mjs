export const meta = {
  name: 'finguru-content',
  description: 'Deep-research + write 29 technical-analysis lessons (gurus + indicators) as MDX bodies, then fact-check each',
  phases: [
    { title: 'Research + Draft', detail: 'one agent per lesson: web research + write the MDX body' },
    { title: 'Verify + Finalize', detail: 'adversarial fact-check + polish each draft' },
  ],
}

// ---- The lesson catalogue (metadata is authored here; agents write only the body) ----
// kind: guru | indicator. order drives the learning-path sequence.
const LESSONS = [
  // ---------- Gurus (Charles Dow = order 1, already written) ----------
  { kind: 'guru', slug: 'jesse-livermore', order: 2, level: 'beginner', era: '1877–1940', contribution: 'Tape reading & trend trading', title: 'Jesse Livermore — The Boy Plunger', prereqs: ['charles-dow'],
    topic: 'Jesse Livermore: bucket-shop origins, tape reading, pivotal points, trading on the trend, his huge 1907 and 1929 short-selling fortunes, the rules from "Reminiscences of a Stock Operator" (Edwin Lefevre) and "How to Trade in Stocks" (1940), money management, sitting tight, the dangers of overtrading, his tragic personal arc.' },
  { kind: 'guru', slug: 'richard-wyckoff', order: 3, level: 'intermediate', era: '1873–1934', contribution: 'Wyckoff Method / smart money', title: 'Richard Wyckoff — Reading the Composite Operator', prereqs: ['charles-dow'],
    topic: 'Richard Wyckoff: the Wyckoff Method, the Composite Man concept, the three laws (supply & demand; cause & effect; effort vs. result), accumulation and distribution schematics with their phases (PS, SC, AR, ST, spring, sign of strength, LPS / UTAD), point-and-figure cause counting, trading ranges, the Wyckoff price cycle.' },
  { kind: 'guru', slug: 'ralph-elliott', order: 4, level: 'advanced', era: '1871–1948', contribution: 'Elliott Wave Theory', title: 'Ralph Nelson Elliott — The Wave Principle', prereqs: ['charles-dow'],
    topic: 'R.N. Elliott: the Wave Principle, 5-wave impulse + 3-wave (ABC) correction, fractal/self-similar degrees, the three core rules (wave 2 never retraces 100% of 1; wave 3 never shortest; wave 4 does not overlap wave 1), Fibonacci relationships, corrective patterns (zigzag, flat, triangle), how it built on Dow, the subjectivity criticism.' },
  { kind: 'guru', slug: 'wd-gann', order: 5, level: 'advanced', era: '1878–1955', contribution: 'Gann angles & time/price', title: 'W.D. Gann — Geometry, Time, and Price', prereqs: ['charles-dow'],
    topic: 'W.D. Gann: Gann angles (esp. the 1x1 / 45-degree line), the Square of Nine, time cycles, price-time squaring, the Gann fan, his more esoteric/astrological side, what is empirically defensible vs. mystical, how modern charting packages implement Gann tools, strong skepticism and honest caveats about unverifiable legend.' },
  { kind: 'guru', slug: 'william-jiler', order: 6, level: 'beginner', era: '20th century', contribution: 'Classical chart patterns', title: 'William Jiler — Classical Chart Patterns', prereqs: ['charles-dow'],
    topic: 'William L. Jiler: author of "How Charts Can Help You in the Stock Market" (1962), founder of Trendline; popularized classical chart patterns for everyday investors — head and shoulders, double tops/bottoms, triangles, flags, the "rounding/saucer" bottom, support/resistance and trendlines; his practical, accessible approach.' },
  { kind: 'guru', slug: 'welles-wilder', order: 7, level: 'intermediate', era: '1935–2021', contribution: 'RSI, ATR, ADX, Parabolic SAR', title: 'J. Welles Wilder — The Indicator Engineer', prereqs: ['charles-dow', 'rsi'],
    topic: 'J. Welles Wilder Jr.: mechanical engineer turned analyst; 1978 "New Concepts in Technical Trading Systems" introduced RSI, ATR, ADX/DMI, Parabolic SAR, and the Wilder smoothing technique. His systematic, calculation-driven approach. Cross-reference the RSI lesson. Later turned to the Delta Phenomenon (note skepticism).' },
  { kind: 'guru', slug: 'martin-pring', order: 8, level: 'intermediate', era: 'b. 1940s', contribution: 'Momentum & intermarket analysis', title: 'Martin Pring — Momentum and the Bigger Picture', prereqs: ['charles-dow'],
    topic: 'Martin Pring: author of "Technical Analysis Explained"; the KST (Know Sure Thing) oscillator, momentum interpretation, the six business-cycle stages and intermarket rotation (bonds, stocks, commodities), special-K, his role as an educator who systematized momentum and the market-cycle model.' },
  { kind: 'guru', slug: 'john-bollinger', order: 9, level: 'intermediate', era: 'b. 1950', contribution: 'Bollinger Bands', title: 'John Bollinger — Trading the Volatility Envelope', prereqs: ['charles-dow'],
    topic: 'John Bollinger: invented Bollinger Bands (1980s); the bands = 20-period SMA ± 2 standard deviations; the Squeeze, %b and BandWidth, the rule that bands measure relative high/low, walking the bands, his 22 rules, why he insists bands are not a standalone signal. Cross-reference the Bollinger Bands indicator lesson.' },
  { kind: 'guru', slug: 'steve-nison', order: 10, level: 'beginner', era: 'b. 1950s', contribution: 'Candlestick charting (West)', title: 'Steve Nison — Bringing Candlesticks West', prereqs: ['charles-dow'],
    topic: 'Steve Nison: introduced Japanese candlestick charting to the Western world via "Japanese Candlestick Charting Techniques" (1991); history (Homma, rice trading), candle anatomy (body, wicks), key single/multi-candle patterns (doji, hammer, engulfing, morning/evening star), the principle that candles show market psychology and work best with confirmation. Cross-reference the candlestick lesson.' },
  { kind: 'guru', slug: 'thomas-demark', order: 11, level: 'advanced', era: 'b. 1947', contribution: 'DeMark indicators / TD Sequential', title: 'Thomas DeMark — Mechanical Exhaustion Signals', prereqs: ['charles-dow'],
    topic: 'Tom DeMark: TD Sequential (Setup of 9 + Countdown of 13), TD Combo, the idea of mechanical, objective exhaustion signals to time reversals; TD lines, his work for major institutions/hedge funds; the appeal of removing subjectivity and the complexity caveat.' },
  { kind: 'guru', slug: 'stan-weinstein', order: 12, level: 'intermediate', era: '20th century', contribution: 'Stage analysis', title: 'Stan Weinstein — The Four Stages', prereqs: ['charles-dow'],
    topic: 'Stan Weinstein: "Secrets for Profiting in Bull and Bear Markets" (1988); the four-stage cycle (Stage 1 basing, Stage 2 advancing, Stage 3 topping, Stage 4 declining) defined relative to the 30-week moving average, buying breakouts from Stage 1 into Stage 2 with volume, using relative strength, the mansfield relative strength.' },
  { kind: 'guru', slug: 'william-oneil', order: 13, level: 'intermediate', era: '1933–2023', contribution: 'CAN SLIM', title: "William O'Neil — CAN SLIM and the Growth Leader", prereqs: ['charles-dow', 'stan-weinstein'],
    topic: "William O'Neil: founder of Investor's Business Daily; the CAN SLIM system (the seven letters spelled out), blending fundamentals + technicals, base patterns (cup-with-handle, flat base, double bottom), pivot/buy points, the 7-8% stop-loss rule, following market leaders and the general market trend (follow-through days)." },
  { kind: 'guru', slug: 'larry-williams', order: 14, level: 'intermediate', era: 'b. 1942', contribution: '%R & short-term timing', title: 'Larry Williams — Short-Term Timing', prereqs: ['charles-dow'],
    topic: 'Larry R. Williams: Williams %R oscillator, the 1987 World Cup Trading Championship (turned $10k into >$1M), short-term futures trading, volatility breakout, commercials/COT (commitments of traders) sentiment, his market-timing and seasonal work; honest note on the difficulty of replicating his contest result.' },
  { kind: 'guru', slug: 'linda-raschke', order: 15, level: 'advanced', era: 'b. 1959', contribution: 'Swing trading setups', title: 'Linda Raschke — Professional Swing Setups', prereqs: ['charles-dow'],
    topic: 'Linda Bradford Raschke: co-author of "Street Smarts" (with Larry Connors); specific mechanical setups (Holy Grail with ADX + 20 EMA, Turtle Soup, 80-20s, anti), momentum and mean-reversion, professional discipline and process, market internals, her career as a market maker and fund manager.' },
  { kind: 'guru', slug: 'alan-farley', order: 16, level: 'advanced', era: 'contemporary', contribution: 'The Master Swing Trader', title: 'Alan Farley — Pattern Cycles and Convergence', prereqs: ['charles-dow'],
    topic: 'Alan S. Farley: "The Master Swing Trader"; the concept of Pattern Cycles, convergence-divergence of multiple time frames, the 7-bells setups, swing trading at support/resistance, combining price patterns with crowd psychology, the Adam Theory critique; emphasis on reward:risk and timing entries.' },
  { kind: 'guru', slug: 'mark-minervini', order: 17, level: 'advanced', era: 'b. 1965', contribution: 'SEPA & VCP', title: 'Mark Minervini — SEPA and the Volatility Contraction Pattern', prereqs: ['charles-dow', 'william-oneil', 'stan-weinstein'],
    topic: 'Mark Minervini: U.S. Investing Championship winner; SEPA (Specific Entry Point Analysis), the Volatility Contraction Pattern (VCP) and its contractions/footprints, Trend Template (the moving-average criteria for a Stage 2 uptrend), buying in the right market environment, tight risk control, his lineage from O\'Neil and Weinstein.' },

  // ---------- Indicators & concepts (RSI = order 101, already written) ----------
  { kind: 'indicator', slug: 'moving-averages', order: 100, level: 'beginner', title: 'Moving Averages (SMA & EMA)', prereqs: ['charles-dow'],
    topic: 'Moving averages: the simple moving average (SMA) and exponential moving average (EMA), how each is calculated (with the EMA smoothing multiplier 2/(N+1)), why MAs smooth noise to reveal trend, common periods (20/50/200), using MAs as dynamic support/resistance, the golden cross and death cross, MA crossover systems, lag as the fundamental tradeoff, and combining MAs with other tools.' },
  { kind: 'indicator', slug: 'macd', order: 102, level: 'beginner', title: 'MACD (Moving Average Convergence Divergence)', prereqs: ['moving-averages'],
    topic: 'MACD by Gerald Appel: MACD line = 12 EMA − 26 EMA, signal line = 9 EMA of MACD, the histogram; reading crossovers, centerline (zero) crosses, divergence; default 12/26/9 settings and adjustments; that MACD is an unbounded momentum+trend hybrid; pitfalls (whipsaws in ranges, lag); combining with trend.' },
  { kind: 'indicator', slug: 'stochastic-oscillator', order: 103, level: 'intermediate', title: 'Stochastic Oscillator', prereqs: ['rsi'],
    topic: 'Stochastic Oscillator by George Lane: %K and %D formulas, the idea that closing prices cluster near highs in uptrends, fast vs slow vs full stochastics, overbought (80) / oversold (20), crossovers and divergence, the difference from RSI, behavior in trends vs ranges, combining with trend filters.' },
  { kind: 'indicator', slug: 'bollinger-bands', order: 104, level: 'intermediate', title: 'Bollinger Bands', prereqs: ['moving-averages'],
    topic: 'Bollinger Bands by John Bollinger: middle band = 20 SMA, upper/lower = ±2 standard deviations; bands as a relative volatility envelope; the Squeeze (low volatility precedes expansion), %b and BandWidth, walking the bands in strong trends, the W-bottom and M-top, why touching a band is not itself a signal, Bollinger\'s own rules.' },
  { kind: 'indicator', slug: 'adx-atr', order: 105, level: 'intermediate', title: 'ADX, DMI & ATR — Trend Strength and Volatility', prereqs: ['welles-wilder'],
    topic: "Wilder's Directional Movement system: +DI and −DI, the ADX line measuring TREND STRENGTH (not direction), ADX thresholds (e.g. >25 trending, <20 ranging); and ATR (Average True Range) for measuring volatility and sizing stops; true range definition; using ADX to decide whether to apply trend-following or mean-reversion logic." },
  { kind: 'indicator', slug: 'ichimoku-cloud', order: 106, level: 'intermediate', title: 'Ichimoku Kinko Hyo (The Cloud)', prereqs: ['moving-averages'],
    topic: 'Ichimoku Kinko Hyo by Goichi Hosoda: the five lines (Tenkan-sen, Kijun-sen, Senkou Span A & B forming the Kumo/cloud, Chikou Span), default 9/26/52 settings, reading the cloud as dynamic support/resistance and trend, the TK cross, price vs cloud, the all-in-one nature, and the learning-curve caveat.' },
  { kind: 'indicator', slug: 'fibonacci-retracements', order: 107, level: 'intermediate', title: 'Fibonacci Retracements & Extensions', prereqs: ['charles-dow'],
    topic: 'Fibonacci tools: the sequence and golden ratio, the key retracement levels (23.6, 38.2, 50, 61.8, 78.6%) and extensions (127.2, 161.8%), how to draw them on a swing, confluence with support/resistance, self-fulfilling nature, the honest critique that 50% is not Fibonacci, and using them as zones not precise lines.' },
  { kind: 'indicator', slug: 'elliott-wave', order: 108, level: 'advanced', title: 'Elliott Wave — Practical Application', prereqs: ['ralph-elliott', 'fibonacci-retracements'],
    topic: 'Applying Elliott Wave in practice: identifying the 5-3 structure on real charts, wave personalities, the three inviolable rules and key guidelines (alternation, channeling), Fibonacci wave relationships, motive vs corrective, common patterns (impulse, diagonal, zigzag, flat, triangle), the problem of subjectivity / multiple counts, and practical risk-defined entries. Builds on the Ralph Elliott guru lesson.' },
  { kind: 'indicator', slug: 'candlestick-patterns', order: 109, level: 'beginner', title: 'Candlestick Patterns', prereqs: ['steve-nison'],
    topic: 'Candlestick patterns: candle anatomy (open/high/low/close, body, wicks/shadows), major single patterns (doji, hammer, hanging man, shooting star, marubozu), two-candle (bullish/bearish engulfing, harami, piercing/dark cloud), three-candle (morning/evening star, three soldiers/crows); the principle that patterns reflect psychology and require trend context + confirmation; pitfalls of trading them in isolation.' },
  { kind: 'indicator', slug: 'volume-obv', order: 110, level: 'beginner', title: 'Volume and On-Balance Volume (OBV)', prereqs: ['charles-dow'],
    topic: 'Volume analysis: volume as confirmation of price moves (the Dow principle), volume spikes, climax volume, volume preceding price; On-Balance Volume (Joe Granville) cumulative formula and divergence; volume-by-price; the idea that volume measures conviction/participation; accumulation/distribution concepts; pitfalls.' },
  { kind: 'indicator', slug: 'support-resistance-patterns', order: 111, level: 'beginner', title: 'Support, Resistance & Chart Patterns', prereqs: ['charles-dow'],
    topic: 'Support and resistance: definition, why levels form (memory, psychology, round numbers), role reversal (support becomes resistance), trendlines and channels; classic chart patterns (head & shoulders, double/triple tops & bottoms, triangles, flags, pennants, rectangles, cup & handle), measured-move targets, the role of volume in breakouts, false breakouts.' },
  { kind: 'indicator', slug: 'risk-management', order: 112, level: 'beginner', title: 'Risk Management & Position Sizing', prereqs: ['charles-dow'],
    topic: 'Risk management: why it matters more than entries, the 1-2% rule per trade, position sizing from stop distance (risk per share), stop-loss placement (technical vs fixed), reward-to-risk ratios, expectancy and win-rate math, the mathematics of drawdown and recovery, the asymmetry of losses, diversification and correlation, avoiding ruin. Make this concrete with numeric examples.' },
  { kind: 'indicator', slug: 'trading-psychology', order: 113, level: 'beginner', title: 'Trading Psychology & Discipline', prereqs: ['charles-dow'],
    topic: 'Trading psychology: fear and greed, loss aversion and other cognitive biases (confirmation, recency, anchoring, sunk cost, disposition effect), discipline and process over prediction, the role of a trading plan and journal, FOMO and revenge trading, emotional regulation, the link from Livermore and Lefevre to modern behavioral finance, and practical habits.' },
]

// ---- Shared authoring guidance: the approved pilot template ----
const TEMPLATE = `
You are writing one lesson for "FinGuru", a beginner-to-professional technical-analysis study guide.
The audience is a motivated beginner; the goal is to make them genuinely competent. Be clear and plain,
define every piece of jargon the first time it appears, use concrete examples, and be intellectually honest
about weaknesses and controversies.

OUTPUT FORMAT — return ONLY the lesson BODY as GitHub-flavored Markdown. Critically:
- DO NOT include YAML frontmatter (no leading "---" block). The title/metadata are added separately.
- DO NOT wrap your output in code fences.
- Start with a short, engaging intro section (1-3 short paragraphs or a "## The one-sentence version"-style hook).

STRUCTURE (adapt headings to the topic, but cover all of this):
- An intro hook explaining why this matters.
- For a GURU lesson: who they were (life/era, with verified facts), their core theory/method explained in
  digestible exemplified pieces, a worked example, modern implementation & legacy, honest criticisms,
  common pitfalls/misconceptions, how to apply it today, and further reading.
- For an INDICATOR/CONCEPT lesson: the intuition, the precise math/definition (show formulas in fenced code
  blocks and walk a small numeric example where relevant), how to read it, settings, strengths & common
  beginner mistakes, how to combine it with other tools, practice suggestions, and further reading.
- End with a "### Sources" section: a numbered list of 5-10 REAL source URLs you actually consulted, each
  with a one-line note on what it supports.

FORMATTING RULES:
- Length: roughly 1400-2200 words.
- You MAY use GFM tables and fenced code blocks (for formulas/calcs).
- For highlighted callouts, use ONLY this custom component (these three types exist, nothing else):
  <Callout type="key"> ... </Callout>   (a key idea)
  <Callout type="note"> ... </Callout>  (a clarifying note)
  <Callout type="warning"> ... </Callout> (a pitfall / caution)
  Put a blank line between the <Callout ...> tag and its markdown content. Do NOT invent other JSX components.
- Use markdown links [text](url) for citations.
- Stylized/illustrative numeric examples are fine but must be LABELED as illustrative.
- Be accurate with dates, names, and formulas. If a fact is disputed or you are unsure, say so in-text rather
  than inventing precision. Do real web research; do not rely on memory for specific claims.
`

const DRAFT_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['body', 'sources'],
  properties: {
    body: { type: 'string', description: 'The full lesson body in Markdown/MDX (no frontmatter, no code-fence wrapper).' },
    sources: { type: 'array', items: { type: 'string' }, description: 'URLs actually consulted.' },
  },
}

const FINAL_SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['final_body', 'corrections'],
  properties: {
    final_body: { type: 'string', description: 'The fact-checked, polished final lesson body (Markdown/MDX, no frontmatter, no fence wrapper).' },
    corrections: { type: 'array', items: { type: 'string' }, description: 'Notable factual corrections or improvements made (empty if none).' },
  },
}

// ---- Run the pipeline: research+draft -> verify+finalize, per lesson ----
const results = await pipeline(
  LESSONS,
  // Stage 1: research + draft
  (l) =>
    agent(
      `${TEMPLATE}\n\n---\nWRITE THIS LESSON.\nKind: ${l.kind}\nTitle: ${l.title}\nLearning level: ${l.level}\n\nSubject matter to cover (research these thoroughly with web search; this is guidance, not a script):\n${l.topic}\n\nResearch with web search/fetch from authoritative sources, then write the body following the template exactly.`,
      { label: `draft:${l.slug}`, phase: 'Research + Draft', agentType: 'general-purpose', schema: DRAFT_SCHEMA },
    ).then((r) => ({ lesson: l, draft: r })),
  // Stage 2: adversarial fact-check + polish
  (prev) => {
    if (!prev || !prev.draft) return null
    const { lesson, draft } = prev
    return agent(
      `You are an expert technical-analysis editor and fact-checker. Below is a DRAFT lesson body for "${lesson.title}" (a ${lesson.kind} lesson).\n\nYour job: verify the factual claims (dates, names, formulas, attributions) using web search, fix any errors or vagueness, tighten the prose, and ensure it follows the formatting rules (only <Callout type="key|note|warning"> components; a numbered "### Sources" section with real URLs; no YAML frontmatter; not wrapped in code fences; ~1400-2200 words). Be especially careful with any mathematical formulas and historical dates. Preserve the structure and the approved template.\n\nReturn the corrected, polished final body and a list of notable corrections you made.\n\n--- DRAFT BODY ---\n${draft.body}\n\n--- SOURCES THE DRAFTER CITED ---\n${(draft.sources || []).join('\\n')}`,
      { label: `verify:${lesson.slug}`, phase: 'Verify + Finalize', agentType: 'general-purpose', schema: FINAL_SCHEMA },
    ).then((r) => ({ lesson, final: r }))
  },
)

// ---- Assemble full MDX (frontmatter built deterministically in JS) ----
function stripBody(s) {
  let body = (s || '').trim()
  // Defensively strip an accidental ```...``` wrapper.
  if (body.startsWith('```')) {
    body = body.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim()
  }
  // Defensively strip accidental leading YAML frontmatter.
  if (body.startsWith('---')) {
    const end = body.indexOf('\n---', 3)
    if (end !== -1) body = body.slice(body.indexOf('\n', end + 1) + 1).trim()
  }
  return body
}

function esc(s) {
  return String(s).replace(/"/g, '\\"')
}

function frontmatter(l, summary) {
  const lines = ['---']
  lines.push(`title: "${esc(l.title)}"`)
  lines.push(`slug: "${l.slug}"`)
  lines.push(`kind: "${l.kind}"`)
  lines.push(`level: "${l.level}"`)
  lines.push(`order: ${l.order}`)
  lines.push(`summary: "${esc(summary)}"`)
  if (l.era) lines.push(`era: "${esc(l.era)}"`)
  if (l.contribution) lines.push(`contribution: "${esc(l.contribution)}"`)
  if (l.prereqs && l.prereqs.length) {
    lines.push(`prereqs: [${l.prereqs.map((p) => `"${p}"`).join(', ')}]`)
  }
  lines.push('---')
  return lines.join('\n')
}

// Build a one-line summary from the first sentence of the body if needed.
function deriveSummary(l, body) {
  // Prefer a concise hand-style summary: first meaningful sentence under ~180 chars.
  const text = body.replace(/<[^>]+>/g, ' ').replace(/[#*`>|]/g, ' ')
  const m = text.match(/[A-Z][^.!?]{30,180}[.!?]/)
  if (m) return m[0].replace(/\s+/g, ' ').trim()
  return `${l.title}: a practical, beginner-friendly lesson.`
}

const files = results.filter(Boolean).map(({ lesson, final }) => {
  const body = stripBody(final.final_body)
  const summary = deriveSummary(lesson, body)
  const dir = lesson.kind === 'guru' ? 'gurus' : 'indicators'
  const path = `web/content/${dir}/${lesson.slug}.mdx`
  const content = `${frontmatter(lesson, summary)}\n\n${body}\n`
  return { path, slug: lesson.slug, kind: lesson.kind, corrections: final.corrections || [], content }
})

log(`Produced ${files.length}/${LESSONS.length} lesson files.`)

return files
