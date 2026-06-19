export const meta = {
  name: 'finguru-ko-translate',
  description: 'Translate all 32 English MDX lessons into Korean, preserving frontmatter/JSX/chart structure',
  phases: [
    { title: 'Translate', detail: 'one agent per lesson: EN MDX -> KO MDX' },
  ],
}

const ROOT = '/Users/iljoyoo/workspace/finguru/web/content'

const LESSONS = [
  'gurus/alan-farley.mdx', 'gurus/charles-dow.mdx', 'gurus/jesse-livermore.mdx',
  'gurus/john-bollinger.mdx', 'gurus/larry-williams.mdx', 'gurus/linda-raschke.mdx',
  'gurus/mark-minervini.mdx', 'gurus/martin-pring.mdx', 'gurus/michael-huddleston.mdx',
  'gurus/ralph-elliott.mdx', 'gurus/richard-wyckoff.mdx', 'gurus/stan-weinstein.mdx',
  'gurus/steve-nison.mdx', 'gurus/thomas-demark.mdx', 'gurus/wd-gann.mdx',
  'gurus/welles-wilder.mdx', 'gurus/william-jiler.mdx', 'gurus/william-oneil.mdx',
  'indicators/adx-atr.mdx', 'indicators/bollinger-bands.mdx', 'indicators/candlestick-patterns.mdx',
  'indicators/elliott-wave.mdx', 'indicators/fibonacci-retracements.mdx', 'indicators/ichimoku-cloud.mdx',
  'indicators/macd.mdx', 'indicators/moving-averages.mdx', 'indicators/risk-management.mdx',
  'indicators/rsi.mdx', 'indicators/stochastic-oscillator.mdx', 'indicators/support-resistance-patterns.mdx',
  'indicators/trading-psychology.mdx', 'indicators/volume-obv.mdx',
]

const SPEC = `
You are translating ONE lesson of a technical-analysis study guide from English into KOREAN (한국어).
The audience is a Korean-speaking beginner who wants to become a professional technical trader. Produce a
natural, fluent, professional Korean translation — NOT a stiff literal one. This is finance education, so use
standard Korean financial/trading terminology.

You will be given the absolute path to the English .mdx file. Read it with your Read tool, then return the
FULL translated Korean .mdx file as a single string.

ABSOLUTE RULES — follow exactly or the page breaks:

1. FRONTMATTER (the top block between --- and ---):
   - Keep ALL keys and the structure exactly. Keep these values UNCHANGED (do NOT translate):
     slug, kind, level, order, prereqs (the slug list), tags.
   - TRANSLATE these values into Korean: title, summary, contribution, era (era: translate words like
     "contemporary" -> "현대"; keep year numbers/ranges as-is, e.g. "1851–1902").
   - Keep YAML valid: wrap translated string values in double quotes; escape any internal double quotes.

2. JSX COMPONENTS — the body contains <Callout>, <LineChart>, <CandleChart> components:
   - <Callout type="key|note|warning"> ... </Callout>: keep the tag and the type attribute EXACTLY; translate
     only the human-readable text INSIDE.
   - <LineChart .../> and <CandleChart .../>: these are self-closing JSX with props like series/data/points/
     levels/zones/trendlines/candles/caption/height/yMin/yMax/color/label/text.
     * Keep ALL numbers, arrays, hex colors, prop names, and structure EXACTLY unchanged.
     * TRANSLATE ONLY the human-readable string values of: "caption", and any "label"/"text" fields
       (e.g. label: "overbought" -> label: "과매수", text: "HH" can stay as "HH" since it's a chart annotation
       abbreviation — translate only if it's a real word/phrase, keep short technical abbreviations like HH/HL/
       BOS/CHoCH/OB/FVG as-is).
     * Do NOT add, remove, or reorder props. Do NOT change numeric data.

3. MARKDOWN: preserve all structure — headings (#/##/###), lists, tables, bold/italic, blockquotes, and
   fenced code blocks. Translate prose and table cell text. Inside fenced code blocks (\`\`\` ... \`\`\`),
   translate ONLY comments / human-readable labels; keep code, formulas, variable names, and numbers exact.

4. Keep the "### Sources" / "## Sources" heading translated (e.g. "### 출처"), but keep all URLs and the
   linked source titles intact (you may keep English source titles; translate the one-line descriptions).

5. Math, formulas, ticker symbols, indicator names in formulas, percentages, dates, and numbers: keep exact.
   Standard indicator names: you may give the Korean term with the English in parentheses on first prominent
   use where natural (e.g. "상대강도지수(RSI)"), but keep it readable.

6. Do NOT wrap your output in code fences. Do NOT add a preamble or notes. Output ONLY the .mdx file content,
   starting with the --- frontmatter line.
`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['ko_mdx', 'notes'],
  properties: {
    ko_mdx: { type: 'string', description: 'The full translated Korean .mdx file content, starting with the --- frontmatter.' },
    notes: { type: 'string', description: 'One line on anything notable (e.g. terms left in English).' },
  },
}

const results = await pipeline(
  LESSONS,
  (rel) =>
    agent(
      `${SPEC}\n\n---\nTRANSLATE THIS FILE TO KOREAN.\nAbsolute path: ${ROOT}/${rel}\n\nRead it, then return the full Korean .mdx.`,
      { label: `ko:${rel}`, phase: 'Translate', agentType: 'general-purpose', schema: SCHEMA },
    ).then((r) => ({ rel, result: r })),
)

const files = results.filter(Boolean).map(({ rel, result }) => {
  let mdx = (result.ko_mdx || '').trim()
  if (mdx.startsWith('```')) {
    mdx = mdx.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim()
  }
  return { path: `web/content/ko/${rel}`, rel, notes: result.notes || '', content: mdx }
})

log(`Translated ${files.length}/${LESSONS.length} lessons to Korean.`)
return files
