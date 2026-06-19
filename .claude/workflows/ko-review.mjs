export const meta = {
  name: 'finguru-ko-review',
  description: 'Native-finance-editor line-by-line review + fix of all 32 Korean lessons against the English source',
  phases: [
    { title: 'Review+Fix', detail: 'one editor agent per lesson: compare EN vs KO, rewrite to fix' },
  ],
}

const EN_ROOT = '/Users/iljoyoo/workspace/finguru/web/content'
const KO_ROOT = '/Users/iljoyoo/workspace/finguru/web/content/ko'

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
You are a NATIVE KOREAN financial editor and a technical-analysis expert. You are doing a rigorous,
line-by-line editorial QA of a Korean translation of one study-guide lesson, against its English source.
Your standard is "publishable Korean finance writing" — accurate, natural, and using the terminology a Korean
trader/analyst would actually use.

You are given two absolute paths: the ENGLISH source and the KOREAN translation. Read BOTH in full. Then go
section by section, sentence by sentence, and FIX the Korean. Return the corrected full Korean .mdx.

WHAT TO CHECK AND FIX (exhaustive):
1. MISTRANSLATIONS / meaning errors — anywhere the Korean says something different from, or weaker than, the
   English. Fix to match the English meaning precisely. Finance nuance matters (e.g. "overbought" =
   "과매수", "oversold" = "과매도", "retracement" = "되돌림", "breakout" = "돌파", "trend" = "추세",
   "support/resistance" = "지지/저항", "moving average" = "이동평균(선)", "order block" = "오더블록",
   "liquidity" = "유동성", "divergence" = "다이버전스/괴리").
2. TERMINOLOGY consistency — use standard Korean financial terms; on first prominent use of a key term give
   Korean with English in parentheses, e.g. 상대강도지수(RSI). Don't flip between synonyms within a lesson.
3. UNTRANSLATED LEFTOVERS — English prose still sitting in the Korean body (translate it). EXCEPTION: proper
   nouns, book titles, ticker symbols, source titles/URLs, indicator acronyms (RSI/MACD/ADX/BOS/CHoCH), and
   short chart-annotation abbreviations (HH/HL) may stay in English.
4. NUMBER / FORMULA INTEGRITY — every number, percentage, date, formula, and ticker must match the English
   EXACTLY. Inside fenced code blocks, only translate comments/labels; keep code, math, variables, numbers.
5. NATURALNESS / tone — fix awkward machine-translation phrasing, particle errors, and unnatural word order so
   it reads like it was written by a Korean finance writer, while keeping the beginner-friendly, plain tone.
6. CALLOUTS and CHART captions/labels — review the Korean text inside <Callout>…</Callout> and the "caption"
   and any "label"/"text" string props of <LineChart>/<CandleChart>. Fix translation issues there too.
7. SOURCES section — the one-line source descriptions should be natural Korean; keep URLs and source titles.

ABSOLUTE STRUCTURAL RULES (do not break the page):
- Keep the YAML frontmatter keys and structure. slug, kind, level, order, prereqs, tags MUST remain identical
  to the English source's values (do NOT translate or alter them). title, summary, contribution, era stay
  translated to Korean (fix them if wrong).
- Keep every <Callout type="...">, <LineChart .../>, <CandleChart .../> tag and ALL their numeric/array/hex/
  prop values EXACTLY. Only edit human-readable Korean text (caption/label/text strings, callout bodies).
- Do NOT add, remove, or reorder charts, callouts, headings, list items, or table rows. The structure must
  match the English source 1:1; only the Korean wording changes.
- Output ONLY the corrected .mdx, starting with the --- frontmatter line. No code-fence wrapper, no preamble.
`

const SCHEMA = {
  type: 'object',
  additionalProperties: false,
  required: ['fixed_ko_mdx', 'corrections', 'quality_before'],
  properties: {
    fixed_ko_mdx: { type: 'string', description: 'The full corrected Korean .mdx, starting with --- frontmatter. No fences.' },
    corrections: {
      type: 'array',
      items: { type: 'string' },
      description: 'Notable fixes made (terminology, mistranslation, untranslated text, etc.). Empty if the translation was already correct.',
    },
    quality_before: {
      type: 'integer',
      description: 'Your 1-5 rating of the ORIGINAL Korean translation quality before your fixes (5 = publishable as-is, 1 = poor).',
    },
  },
}

const results = await pipeline(
  LESSONS,
  (rel) =>
    agent(
      `${SPEC}\n\n---\nENGLISH source path: ${EN_ROOT}/${rel}\nKOREAN translation path: ${KO_ROOT}/${rel}\n\nRead both, then return the corrected Korean .mdx with your editorial fixes applied.`,
      { label: `koqa:${rel}`, phase: 'Review+Fix', agentType: 'general-purpose', schema: SCHEMA },
    ).then((r) => ({ rel, result: r })),
)

const files = results.filter(Boolean).map(({ rel, result }) => {
  let mdx = (result.fixed_ko_mdx || '').trim()
  if (mdx.startsWith('```')) {
    mdx = mdx.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim()
  }
  // Defensive: strip any leaked harness tags at the tail.
  mdx = mdx.split(/\n?\s*<\/(?:fixed_ko_mdx|ko_mdx|invoke)>/)[0].trim()
  return {
    path: `web/content/ko/${rel}`,
    rel,
    quality_before: result.quality_before,
    corrections: result.corrections || [],
    content: mdx,
  }
})

const avg = files.reduce((s, f) => s + (f.quality_before || 0), 0) / (files.length || 1)
log(`Reviewed ${files.length}/${LESSONS.length} KO lessons. Avg pre-fix quality: ${avg.toFixed(2)}/5.`)
return files
