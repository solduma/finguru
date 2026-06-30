import { QUESTIONS, scoreQuiz, ALL_STRATEGY_IDS, type StrategyId } from "../lib/quiz.ts";
type Ans = Record<string, string>;

function* allCombos(): Generator<Ans> {
  const opts = QUESTIONS.map((q) => q.options.map((o) => o.id));
  const idx = new Array(QUESTIONS.length).fill(0);
  while (true) {
    const a: Ans = {};
    for (let i = 0; i < QUESTIONS.length; i++) a[QUESTIONS[i].id] = opts[i][idx[i]];
    yield a;
    let k = QUESTIONS.length - 1;
    while (k >= 0) { idx[k]++; if (idx[k] < opts[k].length) break; idx[k] = 0; k--; }
    if (k < 0) break;
  }
}

// (1) ROBUSTNESS: for a sample of answer sets, flip each single answer and see
// how often the PRIMARY changes. Too brittle (every flip changes it) = noisy;
// too stable (no flip ever changes it) = unresponsive. Healthy ~ moderate.
function robustness() {
  const opts = QUESTIONS.map((q) => q.options.map((o) => o.id));
  let samples = 0, flips = 0, changed = 0;
  let i = 0;
  for (const a of allCombos()) {
    if ((i++ % 37) !== 0) continue; // sample ~1/37
    samples++;
    const base = scoreQuiz(a).primary;
    for (let qi = 0; qi < QUESTIONS.length; qi++) {
      for (const o of opts[qi]) {
        if (o === a[QUESTIONS[qi].id]) continue;
        flips++;
        const a2 = { ...a, [QUESTIONS[qi].id]: o };
        if (scoreQuiz(a2).primary !== base) changed++;
      }
    }
  }
  console.log(`\n=== ROBUSTNESS (single-answer flips) ===`);
  console.log(`samples=${samples}, flips=${flips}, primary-changed=${((changed/flips)*100).toFixed(1)}% of single flips`);
}

// (2) DECISIVENESS: when NOT floored, how far ahead is the winner over runner-up?
// A good quiz produces a clear winner most of the time.
function decisiveness() {
  let total=0, floored=0; const gaps:number[]=[];
  for (const a of allCombos()) {
    const r = scoreQuiz(a); total++;
    if (r.flooredToPassive) { floored++; continue; }
    const ranked=[...ALL_STRATEGY_IDS].sort((x,y)=>r.scores[y]-r.scores[x]);
    gaps.push(r.scores[ranked[0]]-r.scores[ranked[1]]);
  }
  gaps.sort((a,b)=>a-b);
  const med=gaps[Math.floor(gaps.length/2)];
  const ties=gaps.filter(g=>g<0.5).length;
  console.log(`\n=== DECISIVENESS ===`);
  console.log(`non-floored winner→runnerup gap: median=${med.toFixed(1)}, near-ties(<0.5)=${((ties/gaps.length)*100).toFixed(1)}%`);
}

// (3) DAY-TRADING for QUALIFIED users: among the answer sets where the user
// confirms capacity (q10=c) AND maxes risk/effort/experience, is day-trading
// actually reachable and reasonably represented? (Gate shouldn't be a brick wall.)
function qualifiedDayTrading() {
  let qualified=0, gotDay=0;
  for (const a of allCombos()) {
    // qualified profile: q10=c (capacity), q2=d (daily effort), q7=d (active), q3=d (vol=opportunity)
    if (a.q10!=="c"||a.q2!=="d"||a.q7!=="d") continue;
    qualified++;
    if (scoreQuiz(a).primary==="day-trading") gotDay++;
  }
  console.log(`\n=== QUALIFIED DAY-TRADING REACHABILITY ===`);
  console.log(`qualified profiles (capacity+daily+active): ${qualified}, recommended day-trading: ${gotDay} (${((gotDay/qualified)*100).toFixed(1)}%)`);
}

// (4) MONOTONIC RISK SANITY: the lowest-risk answer to EVERY question should
// never yield a high-risk primary; the highest-risk-everything should never
// yield index-passive (unless gated).
function extremes() {
  const lowRisk: Ans = { q1:"d",q2:"a",q3:"a",q4:"b",q5:"c",q6:"a",q7:"a",q8:"a",q9:"a",q10:"a",q11:"c",q12:"c" };
  const highRisk: Ans = { q1:"a",q2:"d",q3:"d",q4:"c",q5:"d",q6:"c",q7:"d",q8:"d",q9:"d",q10:"c",q11:"d",q12:"d" };
  const lr = scoreQuiz(lowRisk), hr = scoreQuiz(highRisk);
  console.log(`\n=== EXTREMES ===`);
  console.log(`all-conservative -> ${lr.primary} (expect index-passive/dividend)`);
  console.log(`all-aggressive+capacity -> ${hr.primary} (expect day-trading/swing/trend)`);
}

robustness(); decisiveness(); qualifiedDayTrading(); extremes();
