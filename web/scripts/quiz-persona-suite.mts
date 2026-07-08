// Comprehensive persona suite — 4+ realistic archetypes per strategy (52 total).
// Each persona is a human archetype; `expect` is the strategy a sensible advisor
// would route them to (derived from the archetype, NOT reverse-engineered from the
// scorer). Reports exact-primary pass rate + where each miss actually landed.
import { scoreQuiz, type StrategyId } from "../lib/quiz.ts";
type Ans = Record<string, string>;
interface P { name: string; a: Ans; expect: StrategyId; }

// index/lifecycle/diversified are near-interchangeable low-cost passive cores —
// routing a passive-core persona to a different core is acceptable (not a real
// mis-serve). A soft pass allows any of these when the expected pick is one too.
const PASSIVE_CORE: StrategyId[] = ["index-passive", "lifecycle", "diversified"];
const softOk = (expect: StrategyId, got: StrategyId) =>
  expect === got || (PASSIVE_CORE.includes(expect) && PASSIVE_CORE.includes(got));

// q1 horizon | q2 time | q3 -30%react | q4 thinking | q5 want | q6 temperament
// q7 experience | q8 handson | q9 +25%jump | q10 -50%feel | q11 finances | q12 %savings
const PERSONAS: P[] = [
  // ---------------- index-passive ----------------
  // The index-passive identity is a DELIBERATE low-cost broad-market indexer who
  // reviews occasionally (q8=b) — distinct from lifecycle's fully-automated
  // target-date (q8=a). All want "broad reliable returns" (q5=c) and don't react
  // to noise (q9=a).
  { name: "index: deliberate broad-market indexer", expect: "index-passive",
    a: {q1:"d",q2:"b",q3:"b",q4:"b",q5:"c",q6:"a",q7:"b",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "index: busy pro, broad market", expect: "index-passive",
    a: {q1:"d",q2:"b",q3:"b",q4:"b",q5:"c",q6:"a",q7:"b",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "index: active-skeptic moderate", expect: "index-passive",
    a: {q1:"c",q2:"b",q3:"b",q4:"b",q5:"c",q6:"a",q7:"b",q8:"b",q9:"a",q10:"a",q11:"d",q12:"c"} },
  { name: "index: young low-cost indexer", expect: "index-passive",
    a: {q1:"d",q2:"b",q3:"c",q4:"b",q5:"c",q6:"a",q7:"b",q8:"b",q9:"a",q10:"b",q11:"c",q12:"d"} },

  // ---------------- lifecycle ----------------
  { name: "lifecycle: target-date retirement", expect: "lifecycle",
    a: {q1:"d",q2:"a",q3:"b",q4:"b",q5:"b",q6:"a",q7:"a",q8:"a",q9:"a",q10:"b",q11:"c",q12:"d"} },
  { name: "lifecycle: hands-off growth", expect: "lifecycle",
    a: {q1:"d",q2:"a",q3:"c",q4:"b",q5:"b",q6:"a",q7:"b",q8:"a",q9:"b",q10:"b",q11:"d",q12:"c"} },
  { name: "lifecycle: new grad autopilot", expect: "lifecycle",
    a: {q1:"d",q2:"a",q3:"b",q4:"b",q5:"b",q6:"a",q7:"a",q8:"a",q9:"a",q10:"a",q11:"c",q12:"d"} },
  { name: "lifecycle: automate everything mid-career", expect: "lifecycle",
    a: {q1:"d",q2:"a",q3:"b",q4:"a",q5:"b",q6:"a",q7:"b",q8:"a",q9:"a",q10:"b",q11:"d",q12:"c"} },

  // ---------------- diversified / all-weather ----------------
  // The distinguishing want is a balanced all-weather mix (q5=e), vs index's
  // "broad market returns" (q5=c). Otherwise these are moderate, low-effort cores.
  { name: "diversified: fence-sitter moderate", expect: "diversified",
    a: {q1:"c",q2:"b",q3:"b",q4:"b",q5:"e",q6:"a",q7:"b",q8:"b",q9:"b",q10:"b",q11:"c",q12:"c"} },
  { name: "diversified: short-horizon low-risk", expect: "diversified",
    a: {q1:"b",q2:"a",q3:"a",q4:"a",q5:"e",q6:"a",q7:"b",q8:"a",q9:"a",q10:"a",q11:"c",q12:"b"} },
  { name: "diversified: wants balance, few tweaks", expect: "diversified",
    a: {q1:"c",q2:"b",q3:"b",q4:"a",q5:"e",q6:"a",q7:"b",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "diversified: cautious all-weather", expect: "diversified",
    a: {q1:"c",q2:"a",q3:"b",q4:"d",q5:"e",q6:"a",q7:"b",q8:"b",q9:"a",q10:"a",q11:"c",q12:"c"} },

  // ---------------- dividend-income ----------------
  { name: "dividend: retiree living off portfolio", expect: "dividend-income",
    a: {q1:"c",q2:"b",q3:"b",q4:"b",q5:"a",q6:"a",q7:"c",q8:"c",q9:"a",q10:"a",q11:"d",q12:"c"} },
  { name: "dividend: income-focused mid-career", expect: "dividend-income",
    a: {q1:"c",q2:"b",q3:"b",q4:"b",q5:"a",q6:"a",q7:"b",q8:"c",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "dividend: FIRE cashflow seeker", expect: "dividend-income",
    a: {q1:"d",q2:"b",q3:"b",q4:"b",q5:"a",q6:"a",q7:"c",q8:"c",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "dividend: conservative income, patient", expect: "dividend-income",
    a: {q1:"c",q2:"a",q3:"a",q4:"b",q5:"a",q6:"a",q7:"b",q8:"c",q9:"a",q10:"a",q11:"d",q12:"c"} },

  // ---------------- value ----------------
  { name: "value: Buffett-style patient", expect: "value",
    a: {q1:"c",q2:"b",q3:"c",q4:"b",q5:"b",q6:"a",q7:"c",q8:"c",q9:"b",q10:"b",q11:"d",q12:"c"} },
  { name: "value: deep-value contrarian", expect: "value",
    a: {q1:"d",q2:"b",q3:"c",q4:"b",q5:"b",q6:"a",q7:"c",q8:"c",q9:"b",q10:"c",q11:"d",q12:"c"} },
  { name: "value: quality-at-fair-price", expect: "value",
    a: {q1:"c",q2:"c",q3:"c",q4:"b",q5:"b",q6:"a",q7:"c",q8:"c",q9:"b",q10:"b",q11:"d",q12:"d"} },
  { name: "value: newer but studies businesses", expect: "value",
    a: {q1:"c",q2:"b",q3:"c",q4:"b",q5:"b",q6:"a",q7:"b",q8:"c",q9:"b",q10:"b",q11:"c",q12:"c"} },

  // ---------------- growth ----------------
  { name: "growth: tech long-term believer", expect: "growth",
    a: {q1:"d",q2:"b",q3:"c",q4:"b",q5:"b",q6:"b",q7:"c",q8:"c",q9:"b",q10:"c",q11:"d",q12:"c"} },
  { name: "growth: reinvest-everything young", expect: "growth",
    a: {q1:"d",q2:"c",q3:"c",q4:"b",q5:"b",q6:"b",q7:"c",q8:"c",q9:"b",q10:"c",q11:"d",q12:"d"} },
  { name: "growth: high-conviction stock picker", expect: "growth",
    a: {q1:"d",q2:"b",q3:"c",q4:"b",q5:"b",q6:"b",q7:"c",q8:"c",q9:"c",q10:"c",q11:"d",q12:"c"} },
  { name: "growth: aggressive accumulator", expect: "growth",
    a: {q1:"d",q2:"b",q3:"c",q4:"b",q5:"b",q6:"b",q7:"d",q8:"c",q9:"b",q10:"b",q11:"d",q12:"d"} },

  // ---------------- factor-quant ----------------
  { name: "quant: data/rules systematic", expect: "factor-quant",
    a: {q1:"c",q2:"b",q3:"c",q4:"a",q5:"b",q6:"b",q7:"c",q8:"b",q9:"c",q10:"b",q11:"d",q12:"c"} },
  { name: "quant: backtest-driven engineer", expect: "factor-quant",
    a: {q1:"c",q2:"b",q3:"b",q4:"a",q5:"c",q6:"a",q7:"c",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "quant: rules-based mostly-automated", expect: "factor-quant",
    a: {q1:"c",q2:"b",q3:"c",q4:"a",q5:"b",q6:"a",q7:"c",q8:"b",q9:"b",q10:"b",q11:"d",q12:"d"} },
  { name: "quant: systematic factor tilts", expect: "factor-quant",
    a: {q1:"d",q2:"b",q3:"c",q4:"a",q5:"b",q6:"b",q7:"c",q8:"b",q9:"c",q10:"b",q11:"d",q12:"c"} },

  // ---------------- global-macro ----------------
  { name: "macro: rates & world events", expect: "global-macro",
    a: {q1:"c",q2:"c",q3:"c",q4:"d",q5:"b",q6:"b",q7:"c",q8:"c",q9:"c",q10:"c",q11:"d",q12:"d"} },
  { name: "macro: top-down themes trader", expect: "global-macro",
    a: {q1:"c",q2:"c",q3:"d",q4:"d",q5:"d",q6:"b",q7:"d",q8:"c",q9:"c",q10:"c",q11:"d",q12:"d"} },
  { name: "macro: economy-follower experienced", expect: "global-macro",
    a: {q1:"c",q2:"c",q3:"c",q4:"d",q5:"b",q6:"b",q7:"c",q8:"c",q9:"b",q10:"c",q11:"d",q12:"c"} },
  { name: "macro: cross-asset discretionary", expect: "global-macro",
    a: {q1:"c",q2:"c",q3:"c",q4:"d",q5:"c",q6:"b",q7:"c",q8:"c",q9:"c",q10:"c",q11:"d",q12:"d"} },

  // ---------------- trend-momentum ----------------
  { name: "trend: ride-the-trend follower", expect: "trend-momentum",
    a: {q1:"b",q2:"c",q3:"d",q4:"a",q5:"d",q6:"c",q7:"c",q8:"d",q9:"c",q10:"c",q11:"d",q12:"d"} },
  { name: "trend: momentum systematic", expect: "trend-momentum",
    a: {q1:"c",q2:"c",q3:"d",q4:"a",q5:"d",q6:"b",q7:"c",q8:"d",q9:"c",q10:"c",q11:"d",q12:"d"} },
  { name: "trend: breakout swing trader", expect: "trend-momentum",
    a: {q1:"b",q2:"c",q3:"c",q4:"c",q5:"d",q6:"c",q7:"c",q8:"c",q9:"c",q10:"c",q11:"d",q12:"d"} },
  { name: "trend: cut-losers-ride-winners", expect: "trend-momentum",
    a: {q1:"c",q2:"c",q3:"d",q4:"c",q5:"d",q6:"c",q7:"c",q8:"c",q9:"c",q10:"c",q11:"d",q12:"d"} },

  // ---------------- event-driven ----------------
  { name: "event: catalyst/merger-arb", expect: "event-driven",
    a: {q1:"c",q2:"c",q3:"c",q4:"d",q5:"b",q6:"b",q7:"c",q8:"c",q9:"b",q10:"b",q11:"d",q12:"c"} },
  { name: "event: special-situations engaged", expect: "event-driven",
    a: {q1:"b",q2:"c",q3:"c",q4:"b",q5:"b",q6:"b",q7:"c",q8:"c",q9:"b",q10:"b",q11:"d",q12:"c"} },
  { name: "event: plan-driven catalyst hunter", expect: "event-driven",
    a: {q1:"c",q2:"c",q3:"c",q4:"a",q5:"b",q6:"b",q7:"c",q8:"c",q9:"c",q10:"b",q11:"d",q12:"c"} },
  { name: "event: earnings/spinoff player", expect: "event-driven",
    a: {q1:"b",q2:"c",q3:"c",q4:"d",q5:"b",q6:"b",q7:"c",q8:"c",q9:"c",q10:"b",q11:"d",q12:"c"} },

  // ---------------- real-assets ----------------
  { name: "real: REIT income seeker", expect: "real-assets",
    a: {q1:"c",q2:"b",q3:"b",q4:"d",q5:"a",q6:"a",q7:"c",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "real: property/infra macro-aware", expect: "real-assets",
    a: {q1:"c",q2:"b",q3:"c",q4:"d",q5:"a",q6:"a",q7:"c",q8:"c",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "real: inflation-hedge patient", expect: "real-assets",
    a: {q1:"d",q2:"b",q3:"c",q4:"d",q5:"a",q6:"a",q7:"c",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },
  { name: "real: tangible-asset income", expect: "real-assets",
    a: {q1:"c",q2:"a",q3:"b",q4:"d",q5:"a",q6:"a",q7:"b",q8:"b",q9:"a",q10:"b",q11:"d",q12:"c"} },

  // ---------------- options-income ----------------
  { name: "options: covered-call income", expect: "options-income",
    a: {q1:"c",q2:"c",q3:"c",q4:"a",q5:"a",q6:"b",q7:"c",q8:"c",q9:"d",q10:"b",q11:"d",q12:"c"} },
  { name: "options: premium seller weekly", expect: "options-income",
    a: {q1:"c",q2:"c",q3:"b",q4:"b",q5:"a",q6:"b",q7:"c",q8:"c",q9:"d",q10:"b",q11:"d",q12:"c"} },
  { name: "options: wheel-strategy income", expect: "options-income",
    a: {q1:"c",q2:"c",q3:"c",q4:"a",q5:"a",q6:"b",q7:"c",q8:"c",q9:"c",q10:"b",q11:"d",q12:"c"} },
  { name: "options: cash-secured puts", expect: "options-income",
    a: {q1:"c",q2:"c",q3:"c",q4:"b",q5:"a",q6:"b",q7:"c",q8:"c",q9:"d",q10:"b",q11:"d",q12:"d"} },

  // ---------------- active-trading (day trading — gate must pass) ----------------
  { name: "active: full-time day trader", expect: "active-trading",
    a: {q1:"a",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"d",q10:"c",q11:"d",q12:"d"} },
  { name: "active: intraday scalper", expect: "active-trading",
    a: {q1:"a",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"c",q10:"c",q11:"d",q12:"d"} },
  { name: "active: pattern-trading pro", expect: "active-trading",
    a: {q1:"a",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"d",q10:"c",q11:"d",q12:"c"} },
  { name: "active: leveraged short-term", expect: "active-trading",
    a: {q1:"b",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"d",q10:"c",q11:"d",q12:"d"} },
];

let pass = 0;
const missByStrat: Record<string, number> = {};
let softPass = 0;
const lines: string[] = [];
for (const p of PERSONAS) {
  const r = scoreQuiz(p.a);
  const ok = r.primary === p.expect;
  const soft = softOk(p.expect, r.primary);
  if (ok) pass++;
  if (soft) softPass++;
  else missByStrat[p.expect] = (missByStrat[p.expect] || 0) + 1;
  const rank = r.ranked.findIndex((x) => x.id === p.expect) + 1;
  const top3 = r.ranked.slice(0, 3).map((x) => `${x.id}:${x.suitability}`).join(" ");
  const tag = ok ? "[OK]  " : soft ? "[~ok] " : "[MISS]";
  lines.push(`${tag} ${p.name.padEnd(42)} expect=${p.expect.padEnd(15)} got=${r.primary.padEnd(15)} (exp@#${rank})  ${soft ? "" : "top3: " + top3}`);
}
console.log(lines.join("\n"));
console.log(`\n=== ${pass}/${PERSONAS.length} exact-primary (${(pass/PERSONAS.length*100).toFixed(0)}%) | ${softPass}/${PERSONAS.length} soft-pass, passive-core interchangeable (${(softPass/PERSONAS.length*100).toFixed(0)}%) ===`);
const missStrats = Object.entries(missByStrat).sort((a,b)=>b[1]-a[1]);
if (missStrats.length) {
  console.log("real misses by expected strategy (excl. passive-core swaps):");
  for (const [s,c] of missStrats) console.log(`  ${s}: ${c}/4`);
}
