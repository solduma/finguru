export const meta = {
  name: 'finguru-charts',
  description: 'Add 1-3 illustrative Chart.js charts to each of 29 TA lessons by inserting MDX chart components',
  phases: [
    { title: 'Add charts', detail: 'one agent per lesson: read it, insert the best 1-3 charts' },
  ],
}

const LESSONS = [
  'gurus/alan-farley.mdx', 'gurus/jesse-livermore.mdx', 'gurus/john-bollinger.mdx',
  'gurus/larry-williams.mdx', 'gurus/linda-raschke.mdx', 'gurus/mark-minervini.mdx',
  'gurus/martin-pring.mdx', 'gurus/ralph-elliott.mdx', 'gurus/richard-wyckoff.mdx',
  'gurus/stan-weinstein.mdx', 'gurus/steve-nison.mdx', 'gurus/thomas-demark.mdx',
  'gurus/wd-gann.mdx', 'gurus/welles-wilder.mdx', 'gurus/william-jiler.mdx',
  'gurus/william-oneil.mdx', 'indicators/adx-atr.mdx', 'indicators/bollinger-bands.mdx',
  'indicators/candlestick-patterns.mdx', 'indicators/elliott-wave.mdx',
  'indicators/fibonacci-retracements.mdx', 'indicators/ichimoku-cloud.mdx',
  'indicators/macd.mdx', 'indicators/moving-averages.mdx', 'indicators/risk-management.mdx',
  'indicators/stochastic-oscillator.mdx', 'indicators/support-resistance-patterns.mdx',
  'indicators/trading-psychology.mdx', 'indicators/volume-obv.mdx',
]

const ROOT = '/Users/iljoyoo/workspace/finguru/web/content'

const SPEC = `
You are adding VISUAL CHARTS to one lesson of a technical-analysis study guide. The site renders MDX and has two
custom chart components already registered and available (do NOT import them; just use the JSX tags). They take
CLEARLY ILLUSTRATIVE / stylized data (no real market data). Your job: pick the 1-3 places in THIS lesson where a
simple chart most aids understanding, and insert chart components there with hand-crafted illustrative data that
matches what the surrounding prose describes.

COMPONENT API — use ONLY these two components and ONLY these props:

<LineChart
  caption="string — what the chart shows; ' · illustrative' is auto-appended"
  height={number}            // optional, default 300; oscillators ~220
  yMin={number} yMax={number} // optional axis bounds (use 0..100 for RSI/stochastics-style panels)
  series={[                   // 1+ lines. data is an array of numbers (use null for gaps).
    { label: "Price", data: [..], color: "#e6e9ef", dashed: false, fill: false, width: 2 }
  ]}
  points={[ { x: 3, y: 34, text: "HH", color: "#22c55e" } ]}   // labeled markers; x is the 0-based index into data
  levels={[ { y: 70, label: "overbought", color: "#f59e0b" } ]} // horizontal threshold lines with a label
  zones={[ { yMin: 70, yMax: 100, color: "rgba(239,68,68,0.12)", label: "overbought" } ]} // shaded horizontal bands
  trendlines={[ { x1: 1, y1: 23, x2: 6, y2: 36, color: "#a78bfa", label: "support", dashed: true } ]} // diagonal line from (x1,y1) to (x2,y2); x is the index
/>

<CandleChart
  caption="string"
  height={number}            // optional, default 300
  candles={[ { o: 10, h: 13, l: 9, c: 12 } ]}   // OHLC per bar
  points={[ { x: 3, y: 15.5, text: "engulfing", color: "#22c55e" } ]}
  levels={[ { y: 32, label: "support" } ]}
/>

COLOR CONVENTIONS: up/bullish #22c55e, down/bearish #ef4444, neutral price #e6e9ef, accent #2dd4bf,
secondary line #38bdf8, threshold #f59e0b, structure/trendline #a78bfa.
Shaded zone colors should be translucent rgba, e.g. "rgba(239,68,68,0.12)" (bad/overbought),
"rgba(34,197,94,0.12)" (good/oversold).

CHART IDEAS BY TOPIC (use judgement; match the lesson's own examples):
- moving averages: price + fast/slow MA lines; a golden cross (two MAs crossing) with a labeled point.
- MACD/oscillators (RSI, stochastics, %R, ADX): a 0-100 (or signed) panel with threshold zones/levels.
- Bollinger Bands / Ichimoku: price line plus upper/lower band lines (use dashed); a "squeeze" where bands narrow.
- candlesticks / Nison: CandleChart showing the named pattern (engulfing, hammer, star) with a labeled point.
- Wyckoff: a trading-range schematic (accumulation) with labeled points (SC, AR, ST, Spring, LPS).
- Elliott / Gann: a 5-3 wave structure with points labeled 1,2,3,4,5,A,B,C; or an impulse with a trendline.
- chart patterns / support-resistance: price forming head & shoulders or double top with labeled points + a neckline level.
- Weinstein stages / Minervini VCP / O'Neil bases: a base then breakout, with stage/contraction labels.
- volume/OBV: a price line + labeled divergence points.
- risk management / psychology: a chart only if it genuinely helps (e.g. equity drawdown curve, R-multiple) — otherwise add ONE simple illustrative chart or none. Quality over forcing it.

HARD RULES:
- Insert charts INLINE at the most relevant spot, right AFTER the paragraph that explains the concept the chart shows.
- Put a BLANK LINE before and after each component tag.
- Change NOTHING else in the file: keep the YAML frontmatter, all prose, callouts, sources EXACTLY as-is.
- Numeric data must be plausible and self-consistent with the prose (e.g. if text says "RSI hits 75", the data should reach ~75).
- x values in points/trendlines are 0-BASED INDICES into the data array, not the axis labels.
- Do NOT wrap the file in code fences. Do NOT add import statements. Do NOT invent other components or props.
- Aim for 2 charts typically (1 if the topic is abstract, 3 max if rich).
`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['updated_mdx', 'charts_added', 'notes'],
  properties: {
    updated_mdx: { type: 'string', description: 'The COMPLETE updated lesson file (frontmatter + body) with chart components inserted. Unchanged except for the inserted charts.' },
    charts_added: { type: 'integer', description: 'How many chart components you inserted.' },
    notes: { type: 'string', description: 'One line on what charts you added and where.' },
  },
}

const results = await pipeline(
  LESSONS,
  (rel) =>
    agent(
      `${SPEC}\n\n---\nTHE LESSON FILE IS AT THIS ABSOLUTE PATH:\n${ROOT}/${rel}\n\nRead it with your Read tool, decide where charts best aid understanding, and return the COMPLETE updated file content with chart components inserted inline. Make sure your illustrative data matches the prose around each chart.`,
      { label: `chart:${rel}`, phase: 'Add charts', agentType: 'general-purpose', schema: SCHEMA },
    ).then((r) => ({ rel, result: r })),
)

const files = results.filter(Boolean).map(({ rel, result }) => {
  let mdx = (result.updated_mdx || '').trim()
  // Defensive: strip an accidental code-fence wrapper.
  if (mdx.startsWith('```')) {
    mdx = mdx.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim()
  }
  return { path: `web/content/${rel}`, rel, charts: result.charts_added || 0, notes: result.notes || '', content: mdx }
})

log(`Updated ${files.length}/${LESSONS.length} lessons with charts.`)
return files
