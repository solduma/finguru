// "Find My Strategy" quiz — scoring engine + question data.
//
// Design from the 2026-06 research (docs/strategy-learning-paths-2026-06.md),
// grounded in the Grable & Lytton Risk Tolerance Scale, Vanguard's 5-factor
// investor questionnaire, and behavioral-finance loss aversion. Each answer adds
// points BOTH to scoring dimensions (used for guardrails/tie-breaks) and directly
// to strategies (what wins). Pure functions only — no React, fully testable.

import type { Locale } from "./i18n";

export type StrategyId =
  | "index-passive"
  | "lifecycle"
  | "diversified"
  | "dividend-income"
  | "value"
  | "growth"
  | "factor-quant"
  | "global-macro"
  | "trend-momentum"
  | "event-driven"
  | "real-assets"
  | "options-income"
  | "active-trading";

// Scoring dimensions. H horizon, E effort, R risk TOLERANCE (emotional
// willingness), X experience, C risk CAPACITY (objective financial ability to
// absorb loss — emergency fund, debt, share of savings). Tolerance and capacity
// are deliberately SEPARATE axes: a user can be emotionally eager yet financially
// fragile, and capacity is the factor that actually prevents ruin, so it gates
// the active strategies independently. (A analytical style and I income/growth
// are captured via direct strategy points.)
export type Dim = "H" | "E" | "R" | "X" | "C";

export interface Option {
  id: string;
  label: Record<Locale, string>;
  dims?: Partial<Record<Dim, number>>;
  strategies?: Partial<Record<StrategyId, number>>;
  /** The explicit risk-capacity confirmation that (with C) gates day trading. */
  capacityConfirm?: boolean;
  /** Hard financial-fragility flag: no emergency fund, or high-interest debt.
   * Forces the "build your foundation first" floor regardless of other answers. */
  fragile?: boolean;
}

export interface Question {
  id: string;
  prompt: Record<Locale, string>;
  options: Option[];
}

// Max attainable per dimension across the quiz — for normalizing to 0–100.
// (Sum of the largest dim value offered by each question that scores it.)
// C (capacity) is summed across the two dedicated capacity questions (q11+q12).
// R (risk tolerance) is scored across TWO questions — q3 (max 95) and q10
// (max 90) — so its attainable max is 185, not 95. Using 95 would let Rn exceed
// 100% and trip the riskHigh gate on merely-moderate users. H/E/X each come from
// one question (max 95); C from two capacity questions (max 200).
const DIM_MAX: Record<Dim, number> = { H: 95, E: 95, R: 185, X: 95, C: 200 };

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: {
      en: "When do you expect to need most of this money back?",
      ko: "투자금의 대부분을 언제 다시 써야 할 것 같나요?",
    },
    options: [
      { id: "a", label: { en: "Within weeks — or even the same day", ko: "몇 주 안에 — 심지어 당일" }, dims: { H: 5 }, strategies: { "active-trading": 4 } },
      { id: "b", label: { en: "Months to a couple of years", ko: "몇 달에서 1~2년" }, dims: { H: 25 }, strategies: { "active-trading": 2, "trend-momentum": 2, "event-driven": 2 } },
      { id: "c", label: { en: "About 3–10 years", ko: "약 3~10년" }, dims: { H: 60 }, strategies: { value: 2, "factor-quant": 2, "global-macro": 2, "real-assets": 2, diversified: 1 } },
      { id: "d", label: { en: "10+ years (retirement, long-term wealth)", ko: "10년 이상 (은퇴, 장기 자산)" }, dims: { H: 95 }, strategies: { "index-passive": 3, lifecycle: 3, "dividend-income": 2, value: 2, diversified: 1, growth: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: {
      en: "Realistically, how much time will you spend on investing most weeks?",
      ko: "현실적으로, 대부분의 주에 투자에 시간을 얼마나 쓸 것 같나요?",
    },
    options: [
      { id: "a", label: { en: "Almost none — I'll set it up and rarely log in", ko: "거의 안 쓴다 — 설정해 두고 거의 안 들어간다" }, dims: { E: 5 }, strategies: { "index-passive": 3, lifecycle: 4, diversified: 2, "dividend-income": 1 } },
      { id: "b", label: { en: "A few hours a month", ko: "한 달에 몇 시간" }, dims: { E: 30 }, strategies: { "dividend-income": 2, value: 2, "factor-quant": 2, diversified: 2, "index-passive": 1, "options-income": 1 } },
      { id: "c", label: { en: "A few hours every week", ko: "매주 몇 시간" }, dims: { E: 60 }, strategies: { "trend-momentum": 2, "event-driven": 2, "options-income": 2, "active-trading": 2, "global-macro": 1 } },
      { id: "d", label: { en: "I already spend most days studying or trading markets", ko: "이미 대부분의 날을 시장 공부나 매매로 보낸다" }, dims: { E: 95 }, strategies: { "active-trading": 4 } },
    ],
  },
  {
    id: "q3",
    prompt: {
      en: "Your portfolio drops 30% in a few months. You…",
      ko: "포트폴리오가 몇 달 만에 30% 하락했습니다. 당신은…",
    },
    options: [
      { id: "a", label: { en: "Sell most of it — I can't sleep with losses like that", ko: "대부분 판다 — 그런 손실로는 잠을 못 잔다" }, dims: { R: 10 }, strategies: { "index-passive": 2 } },
      { id: "b", label: { en: "Feel uneasy but hold and wait", ko: "불안하지만 버티고 기다린다" }, dims: { R: 40 }, strategies: { "index-passive": 2, "dividend-income": 2, value: 1 } },
      { id: "c", label: { en: "Hold, and maybe buy more at lower prices", ko: "버티고, 더 싼 가격에 추가 매수할 수도" }, dims: { R: 70 }, strategies: { value: 3, growth: 1, "index-passive": 1 } },
      { id: "d", label: { en: "Stay calm and look for trades to make in the swings", ko: "침착하게, 그 변동 속에서 매매 기회를 찾는다" }, dims: { R: 95 }, strategies: { "active-trading": 4, "trend-momentum": 2 } },
    ],
  },
  {
    id: "q4",
    prompt: {
      en: "Which kind of thinking comes most naturally to you?",
      ko: "어떤 종류의 사고가 당신에게 가장 자연스럽나요?",
    },
    options: [
      { id: "a", label: { en: "Crunching data, rules, and back-tested systems", ko: "데이터·규칙·백테스트된 시스템 다루기" }, strategies: { "factor-quant": 4, "trend-momentum": 2 } },
      { id: "b", label: { en: "Judging whether a business is good and fairly priced", ko: "기업이 좋은지, 가격이 적정한지 판단하기" }, strategies: { value: 3, growth: 2, "dividend-income": 1 } },
      { id: "c", label: { en: "Reading price charts and spotting patterns", ko: "가격 차트를 읽고 패턴을 찾기" }, strategies: { "active-trading": 4, "trend-momentum": 2 } },
      { id: "d", label: { en: "Following the economy, rates, and world events", ko: "경제·금리·세계 정세를 따라가기" }, strategies: { "global-macro": 5, "real-assets": 3 } },
    ],
  },
  {
    id: "q5",
    prompt: {
      en: "What do you most want from this money?",
      ko: "투자금에서 가장 원하는 것은 무엇인가요?",
    },
    options: [
      { id: "a", label: { en: "Steady cash/income I can use now", ko: "지금 쓸 수 있는 꾸준한 현금/인컴" }, strategies: { "dividend-income": 4, "options-income": 2, "real-assets": 2, value: 1 } },
      { id: "b", label: { en: "Long-term growth; I'll reinvest everything", ko: "장기 성장; 전부 재투자하겠다" }, strategies: { growth: 3, value: 2, "index-passive": 2, lifecycle: 1, "factor-quant": 1 } },
      { id: "c", label: { en: "Broad, reliable market returns without surprises", ko: "놀랄 일 없는, 넓고 안정적인 시장 수익" }, strategies: { "index-passive": 4, lifecycle: 1, "dividend-income": 1 } },
      { id: "e", label: { en: "A balanced mix that holds up in any market", ko: "어떤 시장에서도 버티는 균형 잡힌 자산 배분" }, strategies: { diversified: 4, "real-assets": 1, "dividend-income": 1 } },
      { id: "d", label: { en: "Big gains from active trades, and I accept the risk", ko: "능동적 매매로 큰 수익, 위험은 감수" }, strategies: { "active-trading": 3, "trend-momentum": 2 } },
    ],
  },
  {
    id: "q6",
    prompt: {
      en: "Which describes your temperament best?",
      ko: "당신의 기질을 가장 잘 설명하는 것은?",
    },
    options: [
      { id: "a", label: { en: "Patient — happy to wait years for a thesis to play out", ko: "인내심 있음 — 논리가 실현되기까지 몇 년도 기다린다" }, strategies: { value: 4, "index-passive": 2, "real-assets": 2, diversified: 1, "dividend-income": 1 } },
      { id: "b", label: { en: "Steady but engaged — I like a catalyst or a plan", ko: "차분하지만 적극적 — 촉매나 계획을 좋아한다" }, strategies: { "event-driven": 4, "options-income": 1, "global-macro": 1 } },
      { id: "c", label: { en: "Decisive and quick — I act fast on new information", ko: "결단력 있고 빠름 — 새 정보에 신속히 행동한다" }, strategies: { "active-trading": 4, "trend-momentum": 1 } },
    ],
  },
  {
    id: "q7",
    prompt: {
      en: "How experienced are you with investing?",
      ko: "투자 경험이 어느 정도인가요?",
    },
    options: [
      { id: "a", label: { en: "Brand new — still learning the basics", ko: "완전 초보 — 아직 기초를 배우는 중" }, dims: { X: 5 }, strategies: { "index-passive": 4, lifecycle: 3, diversified: 1, "dividend-income": 1 } },
      { id: "b", label: { en: "Comfortable with funds and long-term investing", ko: "펀드와 장기 투자에 익숙함" }, dims: { X: 40 }, strategies: { "index-passive": 2, lifecycle: 1, diversified: 2, "dividend-income": 2, value: 2, growth: 1 } },
      { id: "c", label: { en: "I research individual stocks / use strategies", ko: "개별 종목을 분석하거나 전략을 쓴다" }, dims: { X: 70 }, strategies: { value: 2, growth: 1, "factor-quant": 2, "options-income": 2, "real-assets": 1, "event-driven": 1 } },
      { id: "d", label: { en: "I actively trade and understand orders, leverage, risk", ko: "능동적으로 매매하며 주문·레버리지·위험을 이해한다" }, dims: { X: 95 }, strategies: { "active-trading": 3, "trend-momentum": 2, "options-income": 1, "global-macro": 1 } },
    ],
  },
  {
    id: "q8",
    prompt: {
      en: "How hands-on do you want to be?",
      ko: "얼마나 직접 관여하고 싶나요?",
    },
    options: [
      { id: "a", label: { en: "Fully hands-off — automate it", ko: "완전히 손 떼기 — 자동화한다" }, strategies: { lifecycle: 5, "index-passive": 2, diversified: 1 } },
      { id: "b", label: { en: "Mostly automated, occasional tweaks", ko: "대부분 자동화, 가끔 조정" }, strategies: { "factor-quant": 3, "index-passive": 3, diversified: 1, "dividend-income": 1 } },
      { id: "c", label: { en: "I want to pick my own investments", ko: "내 투자는 내가 고르고 싶다" }, strategies: { value: 2, growth: 2, "options-income": 1 } },
      { id: "d", label: { en: "I want full control over every trade", ko: "모든 거래를 완전히 통제하고 싶다" }, strategies: { "active-trading": 4, "trend-momentum": 2 } },
    ],
  },
  {
    id: "q9",
    prompt: {
      en: "A stock you own jumps 25% in two weeks on no clear news. You…",
      ko: "보유 종목이 뚜렷한 뉴스 없이 2주 만에 25% 급등했습니다. 당신은…",
    },
    options: [
      { id: "a", label: { en: "Don't really track it day-to-day", ko: "사실 매일 들여다보지 않는다" }, strategies: { "index-passive": 3, lifecycle: 2, "dividend-income": 1 } },
      { id: "b", label: { en: "Hold based on the company's long-term value", ko: "기업의 장기 가치를 믿고 보유" }, strategies: { value: 3 } },
      { id: "c", label: { en: "Hold while the upward trend continues, exit if it breaks", ko: "상승 추세가 이어지는 동안 보유하고, 꺾이면 빠져나온다" }, strategies: { "trend-momentum": 4, "active-trading": 2 } },
      { id: "d", label: { en: "Look to take the quick profit", ko: "빠른 차익 실현을 노린다" }, strategies: { "active-trading": 3, "options-income": 1 } },
    ],
  },
  {
    id: "q10",
    prompt: {
      en: "If this money fell by half and stayed down for a year, how would you feel?",
      ko: "투자금이 절반으로 줄어 1년 동안 회복되지 않는다면, 어떤 기분일까요?",
    },
    options: [
      { id: "a", label: { en: "I couldn't accept that — I need this money to stay safe", ko: "받아들일 수 없다 — 투자금은 안전하게 지켜야 한다" }, dims: { R: 10 }, strategies: { "index-passive": 3, "dividend-income": 2 } },
      { id: "b", label: { en: "Stressful, but it wouldn't change my life plans", ko: "스트레스는 받겠지만, 인생 계획이 바뀌진 않는다" }, dims: { R: 50 }, strategies: { "factor-quant": 1, "event-driven": 1, "options-income": 1, growth: 1 } },
      // Highest risk tolerance is a SUPERSET of the moderate answer's drawdown-prone
      // picks (plus trend/macro): otherwise lowering tolerance b->c would paradoxically
      // RAISE growth/factor-quant/event-driven/options-income. Each stays at 1 point so
      // STRAT_MAX is unchanged — this only restores monotonicity along the risk axis.
      { id: "c", label: { en: "Fine — I'd treat it as a normal part of investing", ko: "괜찮다 — 투자의 정상적인 과정으로 여긴다" }, dims: { R: 90 }, strategies: { "factor-quant": 1, "event-driven": 1, "options-income": 1, growth: 1, "trend-momentum": 1, "global-macro": 1 } },
    ],
  },
  // --- Risk-CAPACITY questions (financial ability to absorb loss). These are
  // deliberately separate from tolerance (Q3/Q9/Q10) and single-barreled. They
  // drive the capacity floor that protects financially fragile users and, with
  // tolerance/effort/experience, gate the riskiest strategies. ---
  {
    id: "q11",
    prompt: {
      en: "Before investing this money, which is true of your finances?",
      ko: "투자하기 전에, 당신의 재정 상황에 해당하는 것은?",
    },
    options: [
      { id: "a", label: { en: "I have high-interest debt (e.g. credit cards) to pay off", ko: "갚아야 할 고금리 부채(예: 신용카드)가 있다" }, dims: { C: 0 }, fragile: true },
      { id: "b", label: { en: "No such debt, but no real emergency savings yet", ko: "그런 부채는 없지만, 비상금은 아직 거의 없다" }, dims: { C: 10 }, fragile: true },
      { id: "c", label: { en: "I have a few months of expenses saved as a cushion", ko: "몇 달치 생활비를 비상금으로 모아 두었다" }, dims: { C: 60 } },
      { id: "d", label: { en: "Solid emergency fund and stable income on top of it", ko: "탄탄한 비상금에 더해 안정적인 소득도 있다" }, dims: { C: 100 } },
    ],
  },
  {
    id: "q12",
    prompt: {
      en: "Roughly how much of your total savings is this money?",
      ko: "투자금은 당신의 전체 저축에서 대략 어느 정도인가요?",
    },
    options: [
      // Concentration risk, NOT financial fragility: putting most of one's savings
      // here still leaves C:0 (so the capacity gate/hardFloor engage), but it does
      // NOT trigger the "build your foundation first" warning — that's reserved for
      // genuine fragility (high-interest debt / no emergency fund), asked in q11.
      { id: "a", label: { en: "Almost all of it", ko: "거의 전부" }, dims: { C: 0 } },
      { id: "b", label: { en: "More than half", ko: "절반 이상" }, dims: { C: 25 } },
      { id: "c", label: { en: "A modest slice — most of my savings are elsewhere", ko: "일부일 뿐 — 저축 대부분은 다른 곳에 있다" }, dims: { C: 70 }, strategies: { "factor-quant": 1, "event-driven": 1, "options-income": 1 } },
      { id: "d", label: { en: "A small amount I'm comfortable putting at risk", ko: "위험에 둬도 괜찮은 적은 금액" }, dims: { C: 100 }, strategies: { "active-trading": 2, "trend-momentum": 1, "global-macro": 1 } },
    ],
  },
];

export const ALL_STRATEGY_IDS: StrategyId[] = [
  "index-passive", "lifecycle", "diversified", "dividend-income", "value",
  "growth", "factor-quant", "global-macro", "trend-momentum", "event-driven",
  "real-assets", "options-income", "active-trading",
];

// Risk order (low → high) for tie-breaks and the passive floor.
const RISK_ORDER: StrategyId[] = [
  "index-passive", "lifecycle", "diversified", "dividend-income", "value",
  "real-assets", "factor-quant", "growth", "event-driven", "options-income",
  "global-macro", "trend-momentum", "active-trading",
];
// Active = strategies that demand ongoing involvement / carry meaningful active
// risk, and so are subject to the experience + capacity floors. The low-effort
// homes (lifecycle, diversified) are NOT active — they're safe-core alongside
// index-passive/dividend-income. Real-assets is a moderate, mostly-passive tilt
// (REITs), so it is NOT gated as active.
const ACTIVE: StrategyId[] = [
  "value", "growth", "factor-quant", "global-macro", "trend-momentum",
  "event-driven", "options-income", "active-trading",
];

export interface QuizResult {
  primary: StrategyId;
  runnersUp: StrategyId[];
  /** True when the day-trading guardrail blocked an otherwise high score. */
  dayTradingGated: boolean;
  /** True when the Index/Passive floor overrode the raw winner. */
  flooredToPassive: boolean;
  /** True when the user is financially fragile (no emergency fund / high-interest
   * debt / nearly all savings at stake) — they should build a foundation before
   * an active strategy. The UI shows a "foundations first" note. */
  buildFoundationFirst: boolean;
  /** True when the primary pick is an active/advanced strategy but the user's
   * self-reported experience is still low. We no longer auto-divert such users to
   * a safe default — we keep their best-fit pick and surface a caution + suggestion
   * note (learn the basics, start small) instead. */
  experienceCaution: boolean;
  /** True when the user is financially fragile AND their best-fit pick is a
   * drawdown-prone strategy (any ACTIVE one, or real-assets). This is a profiling
   * tool, not investment advice — we honor the fit rather than force a passive
   * default, but the UI MUST carry an explicit, stronger risk disclosure. */
  fragileRiskyPrimary: boolean;
  /** True when the strategies actually shown (primary + the two runners-up) span
   * a very wide risk range — the honest sign of self-contradictory answers (e.g.
   * day-trading signals alongside "I want safe, hands-off returns"). We keep the
   * ranking as-is (it faithfully reflects what they said) but the UI surfaces a
   * note inviting them to revisit or aim for balance. */
  conflictingSignals: boolean;
  /** EVERY strategy in descending fit order, each with an ABSOLUTE 0–100
   * suitability score (its own fit against its attainable max — NOT renormalized
   * so the winner hits 100). The primary is ranked[0]; the UI shows the top few
   * by default and reveals the rest behind a "see all" toggle. */
  ranked: { id: StrategyId; suitability: number }[];
  scores: Record<StrategyId, number>;
}

// Maximum points each strategy can possibly earn across the quiz — the sum, per
// question, of the single largest amount that question awards to that strategy.
// Derived from QUESTIONS so it stays in sync. Used to score each strategy as a
// "fit ratio" (earned / attainable). Without this, broad strategies that appear
// in many options (value/growth/index) drown concentrated ones (global-macro,
// event-driven) that can only score on a few questions — making the latter
// literally unrecommendable. Ratio scoring puts every strategy on equal footing.
const STRAT_MAX: Record<StrategyId, number> = (() => {
  const max = Object.fromEntries(ALL_STRATEGY_IDS.map((s) => [s, 0])) as Record<StrategyId, number>;
  for (const q of QUESTIONS) {
    const best = Object.fromEntries(ALL_STRATEGY_IDS.map((s) => [s, 0])) as Record<StrategyId, number>;
    for (const opt of q.options) {
      if (!opt.strategies) continue;
      for (const [s, v] of Object.entries(opt.strategies)) {
        best[s as StrategyId] = Math.max(best[s as StrategyId], v!);
      }
    }
    for (const s of ALL_STRATEGY_IDS) max[s] += best[s];
  }
  return max;
})();

// DISPLAY-only gamma for the shown suitability %. <1 lifts mid/low fit ratios
// (which naturally cluster ~55 for a real best-fit) so the number reads as a
// confident match, while staying strictly monotonic (0→0, 100→100) so it never
// changes ranking or bar-length order. Internal logic uses the raw ratio, not this.
const DISPLAY_GAMMA = 0.55;

/** answers: map of questionId -> chosen optionId. Unanswered questions are ignored. */
export function scoreQuiz(answers: Record<string, string>): QuizResult {
  const raw = Object.fromEntries(
    ALL_STRATEGY_IDS.map((s) => [s, 0]),
  ) as Record<StrategyId, number>;
  const dims: Record<Dim, number> = { H: 0, E: 0, R: 0, X: 0, C: 0 };
  let fragile = false;
  let q5Income = false;
  // How many questions actually contributed to each strategy — a strategy that
  // wins on a single lucky answer shouldn't beat one with broad support.
  const hits = Object.fromEntries(ALL_STRATEGY_IDS.map((s) => [s, 0])) as Record<StrategyId, number>;

  for (const q of QUESTIONS) {
    const choice = answers[q.id];
    if (!choice) continue;
    const opt = q.options.find((o) => o.id === choice);
    if (!opt) continue;
    if (opt.dims) for (const [d, v] of Object.entries(opt.dims)) dims[d as Dim] += v!;
    if (opt.strategies)
      for (const [s, v] of Object.entries(opt.strategies)) {
        raw[s as StrategyId] += v!;
        if (v! > 0) hits[s as StrategyId] += 1;
      }
    if (opt.fragile) fragile = true;
    if (q.id === "q5" && opt.id === "a") q5Income = true;
  }

  // Normalize gates.
  const Hn = (dims.H / DIM_MAX.H) * 100;
  const Rn = (dims.R / DIM_MAX.R) * 100;
  const En = (dims.E / DIM_MAX.E) * 100;
  const Xn = (dims.X / DIM_MAX.X) * 100;
  const Cn = (dims.C / DIM_MAX.C) * 100;
  const riskHigh = Rn >= 70;
  const timeHigh = En >= 70;
  const expHigh = Xn >= 65;
  const capacityHigh = Cn >= 70; // financial ability to take real risk
  // Capacity is the gate that prevents harm: emotional willingness is not enough.
  const capacityOK = capacityHigh && !fragile;

  // Direct-point nudges that belong to the raw layer.
  if (q5Income) raw["dividend-income"] += 3;

  // The natural (pre-penalty) winner, used both for the day-trading warning and
  // to detect when the guardrails below redirect the user to the safe core.
  const rawWinner = topStrategy(raw);

  // --- Multiplicative guardrail PENALTIES on the raw layer ---
  // Every guardrail is now a percentage penalty rather than a hard zero or a
  // forced post-rank override: an out-of-profile strategy is demoted (so it sinks
  // in the ranking and reads as a low suitability %) but stays rankable and
  // visible in the full "see all" list. The safety NOTES still fire via the flags
  // below; we just no longer pretend the strategy scored zero or silently swap it.
  let dayTradingGated = false;
  // Active-Trading (the merged swing+day technical-trading identity, whose top
  // tier is intraday day trading) is the highest-risk path — gate it behind
  // high risk-tolerance + time + experience + confirmed capacity. Below the bar
  // it takes the steepest penalty.
  if (!(riskHigh && timeHigh && expHigh && capacityOK)) {
    if (raw["active-trading"] > 0) dayTradingGated = true;
    raw["active-trading"] *= 0.12;
  }
  if (!expHigh && !timeHigh) {
    raw["trend-momentum"] *= 0.5;
    raw["options-income"] *= 0.5;
  }
  // Inexperience GRADUATES the active strategies down rather than flattening them
  // with one blunt multiplier. A near-beginner (Xn≈5) is damped hard; someone
  // "comfortable with funds and long-term investing" (Xn≈42) is barely touched, so
  // their genuinely active-leaning answers can still surface as the honest pick
  // instead of being auto-diverted to the safe core. The result UI then carries an
  // experience CAUTION note (see experienceCaution) rather than swapping the pick.
  if (!expHigh) {
    const expFactor = 0.55 + 0.45 * (Xn / 65);
    for (const s of ACTIVE) raw[s] *= expFactor;
  }
  // Soft FIT penalties: strategies with a natural minimum profile shouldn't win
  // for users well below it (suboptimal-fit, not harm — so a damp, not a gate).
  // global-macro/event-driven reward sophistication; momentum needs risk appetite.
  if (Xn < 25) {
    raw["global-macro"] *= 0.4;
    raw["event-driven"] *= 0.5;
  }
  if (Rn < 40) {
    raw["trend-momentum"] *= 0.4;
  }
  // A genuinely fragile profile (high-interest debt / no emergency fund / nearly
  // all savings at stake / very low capacity) takes a HEAVY penalty on every
  // drawdown-prone strategy — the ACTIVE set plus real-assets (REITs/property
  // carry illiquidity, leverage, concentration). This sinks them far enough that
  // the safe core rises to the top on its own, replacing the old hard override.
  const hardFloor = fragile || Cn < 35;
  if (hardFloor) {
    for (const s of [...ACTIVE, "real-assets" as StrategyId]) raw[s] *= 0.15;
  }

  // Fit ratio: each strategy scored against its OWN attainable maximum, so a
  // concentrated strategy that nails its signature answers ranks fairly against
  // broad ones. A strategy supported by only one question is damped (it needs
  // ≥2 contributing answers to express its full ratio) to avoid fluke wins.
  // This is an ABSOLUTE 0–100 fit: a strongly-aligned user approaches 100, a
  // lukewarm match scores lower. We do NOT renormalize the winner up to 100.
  const score = fitScores(raw, hits);

  // Capacity/horizon nudge toward the evidence-based safe core for genuinely
  // conservative profiles — applied on the ratio scale (small, not dominating).
  if (Hn >= 80 && Rn <= 30) {
    score["index-passive"] += 12;
    score["dividend-income"] += 6;
    score["diversified"] += 6;
    score["lifecycle"] += 4;
  }
  // Short/medium horizon + low risk tolerance: a defensive multi-asset mix
  // (diversified/all-weather) is the honest home rather than equity-only index.
  if (Hn < 80 && Rn <= 30 && !riskHigh) {
    score["diversified"] += 10;
    score["lifecycle"] += 4;
  }

  // Rank by absolute fit; tie-break to lower risk. The penalties above already
  // demoted out-of-profile strategies, so the natural winner is the honest call —
  // we no longer force-swap the primary to a safe default after the fact.
  const ranked = [...ALL_STRATEGY_IDS].sort((a, b) => {
    if (score[b] !== score[a]) return score[b] - score[a];
    return RISK_ORDER.indexOf(a) - RISK_ORDER.indexOf(b);
  });

  const primary = ranked[0];
  const SAFE_CORE: StrategyId[] = ["index-passive", "lifecycle", "diversified", "dividend-income"];
  // Informational flag (drives the explanatory note, not a reassignment): the
  // user's raw, pre-penalty pick was an active / real-assets strategy, but the
  // guardrail penalties pushed a safe-core strategy to the top instead. That's
  // the honest "we steered you toward the evidence-based core" story.
  const rawWasRisky = ACTIVE.includes(rawWinner) || rawWinner === "real-assets";
  const flooredToPassive = SAFE_CORE.includes(primary) && rawWasRisky && primary !== rawWinner;
  // Low experience + an active best-fit: keep the honest pick, warn instead of
  // diverting. active-trading is excluded here — it has its own stronger gate/notes.
  const experienceCaution = !expHigh && ACTIVE.includes(primary) && primary !== "active-trading";
  // Fragile user whose honest best-fit is drawdown-prone: we keep the pick (this
  // reads the user's temperament, it doesn't prescribe a portfolio) but the UI
  // owes them a blunt risk disclosure on top of the foundation note.
  const fragileRiskyPrimary =
    fragile && (ACTIVE.includes(primary) || primary === "real-assets");

  // Absolute internal fit (0–100), used for logic decisions (e.g. the conflict
  // spread below) — NOT what we display. Kept raw so thresholds stay meaningful.
  const toSuit = (id: StrategyId) =>
    Math.round(Math.max(0, Math.min(100, score[id])));
  // DISPLAY-only scaling: the raw fit ratios cluster low (a genuine best-fit often
  // reads ~55), which erodes user trust in the number. A gamma curve (<1) lifts
  // mid/low values while pinning 0→0 and 100→100, so it's strictly monotonic —
  // ranking and bar-length ORDER are untouched, only the shown number changes.
  const displaySuit = (id: StrategyId) =>
    Math.round(100 * Math.pow(toSuit(id) / 100, DISPLAY_GAMMA));
  const rankedAll = ranked.map((id) => ({ id, suitability: displaySuit(id) }));
  // Runners-up: the two next-best fits by suitability. When the PRIMARY is a
  // risky/active strategy, the conservative core's nudge (above) tends to fill the
  // "also worth exploring" row with index/diversified/etc., which reads as ignoring
  // the user's fit — so behind a non-safe-core primary we allow at most ONE safe
  // core runner and take the next-best strategy for the second slot. Behind a
  // safe-core primary we don't cap (conservative peers are the honest neighbors).
  const capSafeCore = !SAFE_CORE.includes(primary);
  const runnersUp: StrategyId[] = [];
  let safeCoreUsed = 0;
  for (const s of ranked) {
    if (runnersUp.length >= 2) break;
    if (s === primary) continue;
    if (capSafeCore && SAFE_CORE.includes(s)) {
      if (safeCoreUsed >= 1) continue;
      safeCoreUsed += 1;
    }
    runnersUp.push(s);
  }

  // Conflicting-signals note: the strategies we actually SHOW (primary + runners)
  // span a wide risk gap only when the user gave self-contradictory answers. We
  // measure the spread in RISK_ORDER, but only count a runner that scored high
  // enough to really be presented (>=20) — a near-zero token pick isn't a conflict.
  const RISK_SPREAD_THRESHOLD = 8;
  const shownForSpread = [primary, ...runnersUp].filter(
    (id) => id === primary || toSuit(id) >= 20,
  );
  const tiers = shownForSpread.map((id) => RISK_ORDER.indexOf(id));
  const conflictingSignals =
    Math.max(...tiers) - Math.min(...tiers) >= RISK_SPREAD_THRESHOLD;

  // Surface the gated day-trading flag only when it actually would have won.
  return {
    primary,
    runnersUp,
    dayTradingGated: dayTradingGated && rawWinner === "active-trading",
    flooredToPassive,
    buildFoundationFirst: fragile,
    experienceCaution,
    fragileRiskyPrimary,
    conflictingSignals,
    ranked: rankedAll,
    scores: score,
  };
}

function topStrategy(scores: Record<StrategyId, number>): StrategyId {
  return [...ALL_STRATEGY_IDS].sort((a, b) => scores[b] - scores[a])[0];
}

// Absolute fit score (0–100) per strategy: earned points ÷ that strategy's own
// attainable maximum, times a breadth damper (a one-question fluke can't express
// a full match). This is NOT renormalized so the winner hits 100 — a lukewarm
// best-fit honestly reads as, say, 58, not a misleading 100%.
function fitScores(
  raw: Record<StrategyId, number>,
  hits: Record<StrategyId, number>,
): Record<StrategyId, number> {
  return Object.fromEntries(
    ALL_STRATEGY_IDS.map((s) => {
      const ratio = STRAT_MAX[s] > 0 ? raw[s] / STRAT_MAX[s] : 0;
      const breadth = hits[s] >= 2 ? 1 : hits[s] === 1 ? 0.6 : 0;
      return [s, ratio * breadth * 100];
    }),
  ) as Record<StrategyId, number>;
}
