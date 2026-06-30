// Adversarial assessment harness for the Find-My-Strategy quiz.
// Runs the REAL scorer (lib/quiz.ts) against (a) expert-labeled personas and
// (b) an exhaustive sweep of all answer combinations to surface pathologies.
import { QUESTIONS, scoreQuiz, ALL_STRATEGY_IDS, type StrategyId } from "../lib/quiz.ts";

type Ans = Record<string, string>;

// ---- Persona suite: each is a plausible real user with an advisor-expected
// outcome. `expect` = strategies a competent advisor would consider correct;
// `forbid` = outcomes that would be a clear mis-recommendation (a safety fail).
interface Persona {
  name: string;
  a: Ans;
  expect: StrategyId[];     // primary should be one of these
  forbid?: StrategyId[];    // primary must NOT be one of these
  note: string;
}

// Answer keys are q1..q10 -> option id (a/b/c/d).
const P: Persona[] = [
  {
    name: "Retiree, capital preservation, needs income",
    a: { q1: "d", q2: "a", q3: "a", q4: "b", q5: "a", q6: "a", q7: "b", q8: "a", q9: "a", q10: "a", q11: "d", q12: "c" },
    expect: ["index-passive","lifecycle","diversified","dividend-income"],
    forbid: ["active-trading", "trend-momentum", "active-trading", "global-macro"],
    note: "Long horizon, low risk, wants income, hands-off.",
  },
  {
    name: "Total beginner, set-and-forget retirement",
    a: { q1: "d", q2: "a", q3: "b", q4: "b", q5: "c", q6: "a", q7: "a", q8: "a", q9: "a", q10: "a", q11: "c", q12: "c" },
    expect: ["index-passive","lifecycle","diversified"],
    forbid: ["active-trading", "active-trading", "trend-momentum", "value", "global-macro"],
    note: "Brand new, hands-off, broad market returns.",
  },
  {
    name: "Reckless newbie wanting to day-trade (should be GATED)",
    a: { q1: "a", q2: "d", q3: "d", q4: "c", q5: "d", q6: "c", q7: "a", q8: "d", q9: "d", q10: "b" },
    expect: ["index-passive", "active-trading", "trend-momentum"],
    forbid: ["active-trading"],
    note: "Wants fast trading but inexperienced + no capacity confirm => must NOT get day-trading.",
  },
  {
    name: "Qualified active day trader",
    a: { q1: "a", q2: "d", q3: "d", q4: "c", q5: "d", q6: "c", q7: "d", q8: "d", q9: "d", q10: "c", q11: "d", q12: "d" },
    expect: ["active-trading", "active-trading", "trend-momentum"],
    note: "High risk+time+experience, capacity confirmed => day-trading allowed.",
  },
  {
    name: "Classic value investor",
    a: { q1: "c", q2: "b", q3: "c", q4: "b", q5: "b", q6: "a", q7: "c", q8: "c", q9: "b", q10: "b", q11: "c", q12: "c" },
    expect: ["value", "growth"],
    forbid: ["active-trading", "index-passive"],
    note: "Mid horizon, business-judgment thinker, patient, picks own stocks.",
  },
  {
    name: "Quant/systematic thinker",
    a: { q1: "c", q2: "b", q3: "c", q4: "a", q5: "b", q6: "b", q7: "c", q8: "b", q9: "c", q10: "b", q11: "d", q12: "c" },
    expect: ["factor-quant", "value", "growth"],
    forbid: ["active-trading"],
    note: "Data/rules/backtests, occasional tweaks, automated.",
  },
  {
    name: "Macro thinker",
    a: { q1: "c", q2: "c", q3: "c", q4: "d", q5: "d", q6: "b", q7: "c", q8: "c", q9: "c", q10: "c", q11: "d", q12: "d" },
    expect: ["global-macro", "event-driven", "trend-momentum"],
    note: "Follows economy/rates/world events, weekly effort, experienced, capacity OK.",
  },
  {
    name: "Dividend/income seeker, moderate",
    a: { q1: "d", q2: "b", q3: "b", q4: "b", q5: "a", q6: "a", q7: "b", q8: "c", q9: "b", q10: "a", q11: "c", q12: "c" },
    expect: ["dividend-income", "index-passive"],
    forbid: ["active-trading", "trend-momentum"],
    note: "Long horizon, wants income now, low-mod risk.",
  },
  {
    name: "Growth investor, long horizon, higher risk tolerance",
    a: { q1: "d", q2: "b", q3: "c", q4: "b", q5: "b", q6: "a", q7: "c", q8: "c", q9: "b", q10: "b", q11: "d", q12: "c" },
    expect: ["growth", "value", "index-passive"],
    forbid: ["active-trading"],
    note: "Long horizon, reinvest everything, holds drawdowns, picks stocks.",
  },
  {
    name: "Swing trader, experienced, weekly",
    a: { q1: "b", q2: "c", q3: "d", q4: "c", q5: "d", q6: "c", q7: "d", q8: "d", q9: "c", q10: "c", q11: "d", q12: "d" },
    expect: ["active-trading", "trend-momentum", "active-trading"],
    forbid: ["index-passive"],
    note: "Months horizon, charts, weekly effort, experienced, decisive.",
  },
  {
    name: "Event-driven / special situations",
    a: { q1: "b", q2: "c", q3: "c", q4: "d", q5: "d", q6: "b", q7: "c", q8: "c", q9: "b", q10: "b", q11: "d", q12: "c" },
    expect: ["event-driven", "global-macro", "value"],
    forbid: ["active-trading"],
    note: "Catalyst-oriented, weekly effort, experienced.",
  },
  {
    name: "Contradictory: wants safety AND big active gains",
    a: { q1: "d", q2: "a", q3: "a", q4: "c", q5: "d", q6: "c", q7: "a", q8: "d", q9: "d", q10: "a", q11: "b", q12: "b" },
    expect: ["index-passive","lifecycle","diversified","dividend-income"],
    forbid: ["active-trading", "trend-momentum"],
    note: "Conflicting signals + low capacity => safety should win.",
  },
];

function run() {
  let pass = 0;
  const fails: string[] = [];
  for (const p of P) {
    const r = scoreQuiz(p.a);
    const okExpect = p.expect.includes(r.primary);
    const okForbid = !p.forbid || !p.forbid.includes(r.primary);
    const ok = okExpect && okForbid;
    if (ok) pass++;
    else {
      fails.push(
        `FAIL: ${p.name}\n   got primary=${r.primary} (gated=${r.dayTradingGated}, floored=${r.flooredToPassive})\n   expected one of [${p.expect.join(", ")}]${p.forbid ? `, forbidden [${p.forbid.join(", ")}]` : ""}\n   top scores: ${topN(r.scores, 4)}`,
      );
    }
  }
  console.log(`\n=== PERSONA SUITE: ${pass}/${P.length} passed ===`);
  for (const f of fails) console.log(f);
  return { pass, total: P.length, fails };
}

function topN(scores: Record<StrategyId, number>, n: number): string {
  return [...ALL_STRATEGY_IDS]
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, n)
    .map((s) => `${s}:${scores[s].toFixed(1)}`)
    .join(", ");
}

// ---- Exhaustive sweep: all answer combinations (q6 has 3 options, q10 has 3).
function* allCombos(): Generator<Ans> {
  const opts = QUESTIONS.map((q) => q.options.map((o) => o.id));
  const idx = new Array(QUESTIONS.length).fill(0);
  while (true) {
    const a: Ans = {};
    for (let i = 0; i < QUESTIONS.length; i++) a[QUESTIONS[i].id] = opts[i][idx[i]];
    yield a;
    let k = QUESTIONS.length - 1;
    while (k >= 0) {
      idx[k]++;
      if (idx[k] < opts[k].length) break;
      idx[k] = 0; k--;
    }
    if (k < 0) break;
  }
}

function sweep() {
  const dist: Record<string, number> = {};
  let total = 0;
  let dayCount = 0, gatedCount = 0, flooredCount = 0;
  let dayWithoutCapacity = 0; // CRITICAL: day-trading recommended without capacityConfirm
  const reachable = new Set<string>();
  for (const a of allCombos()) {
    const r = scoreQuiz(a);
    total++;
    dist[r.primary] = (dist[r.primary] ?? 0) + 1;
    reachable.add(r.primary);
    if (r.primary === "active-trading") {
      dayCount++;
      // Capacity now comes from q11/q12. A day-trading rec requires real capacity:
      // q11 must be c/d (has cushion) and q12 must be c/d (modest/small slice).
      const capOk = (a.q11 === "c" || a.q11 === "d") && (a.q12 === "c" || a.q12 === "d");
      if (!capOk) dayWithoutCapacity++;
    }
    if (r.dayTradingGated) gatedCount++;
    if (r.flooredToPassive) flooredCount++;
  }
  console.log(`\n=== EXHAUSTIVE SWEEP: ${total.toLocaleString()} combinations ===`);
  console.log("Primary distribution (share of all answer paths):");
  for (const s of ALL_STRATEGY_IDS) {
    const c = dist[s] ?? 0;
    console.log(`  ${s.padEnd(16)} ${((c / total) * 100).toFixed(2)}%  (${c})`);
  }
  const unreachable = ALL_STRATEGY_IDS.filter((s) => !reachable.has(s));
  console.log(`\nUnreachable strategies (never the primary for ANY answer set): ${unreachable.length ? unreachable.join(", ") : "none"}`);
  console.log(`Day-trading recommended without capacity confirm (SAFETY BUG if >0): ${dayWithoutCapacity}`);
  console.log(`Floored-to-passive paths: ${((flooredCount / total) * 100).toFixed(1)}%`);
  return { total, dist, unreachable, dayWithoutCapacity, flooredShare: flooredCount / total };
}

const personas = run();
const swept = sweep();

console.log("\n=== HEADLINE ===");
console.log(`Persona accuracy: ${personas.pass}/${personas.total}`);
console.log(`Unreachable strategies: ${swept.unreachable.length}`);
console.log(`Day-trading-without-capacity leaks: ${swept.dayWithoutCapacity}`);

// --- Capacity-floor verification: fragile users must NEVER get an active strategy ---
function fragileFloor() {
  let fragileCount = 0, fragileActive = 0;
  const ACTIVE = ["value","growth","factor-quant","global-macro","trend-momentum","event-driven","active-trading","active-trading"];
  for (const a of allCombos()) {
    // fragile triggers: q11=a/b (debt/no-fund) OR q12=a (almost all savings)
    const isFragile = a.q11 === "a" || a.q11 === "b" || a.q12 === "a";
    if (!isFragile) continue;
    fragileCount++;
    const r = scoreQuiz(a);
    if (ACTIVE.includes(r.primary)) fragileActive++;
  }
  console.log(`\n=== CAPACITY FLOOR ===`);
  console.log(`fragile answer paths: ${fragileCount.toLocaleString()}`);
  console.log(`  of those, recommended an ACTIVE strategy (SHOULD BE 0): ${fragileActive}`);
}
fragileFloor();
