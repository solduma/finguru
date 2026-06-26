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
  | "dividend-income"
  | "value"
  | "growth"
  | "factor-quant"
  | "global-macro"
  | "trend-momentum"
  | "event-driven"
  | "swing-trading"
  | "day-trading";

// Scoring dimensions. H horizon, E effort, R risk tolerance, X experience.
// (A analytical style and I income/growth are captured via direct strategy
// points; we track H/E/R/X numerically for the guardrails.)
export type Dim = "H" | "E" | "R" | "X";

export interface Option {
  id: string;
  label: Record<Locale, string>;
  dims?: Partial<Record<Dim, number>>;
  strategies?: Partial<Record<StrategyId, number>>;
  /** Q10 "C" is the explicit risk-capacity confirmation that gates day trading. */
  capacityConfirm?: boolean;
}

export interface Question {
  id: string;
  prompt: Record<Locale, string>;
  options: Option[];
}

// Max attainable per dimension across the quiz — for normalizing to 0–100.
// (Sum of the largest dim value offered by each question that scores it.)
const DIM_MAX: Record<Dim, number> = { H: 95, E: 95, R: 95, X: 95 };

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: {
      en: "When do you expect to need most of this money back?",
      ko: "이 돈의 대부분을 언제 다시 써야 할 것 같나요?",
    },
    options: [
      { id: "a", label: { en: "Within weeks — or even the same day", ko: "몇 주 안에 — 심지어 당일" }, dims: { H: 5 }, strategies: { "day-trading": 3, "swing-trading": 2 } },
      { id: "b", label: { en: "Months to a couple of years", ko: "몇 달에서 1~2년" }, dims: { H: 25 }, strategies: { "swing-trading": 3, "trend-momentum": 2, "event-driven": 2 } },
      { id: "c", label: { en: "About 3–10 years", ko: "약 3~10년" }, dims: { H: 60 }, strategies: { value: 2, growth: 2, "factor-quant": 2, "global-macro": 2 } },
      { id: "d", label: { en: "10+ years (retirement, long-term wealth)", ko: "10년 이상 (은퇴, 장기 자산)" }, dims: { H: 95 }, strategies: { "index-passive": 3, "dividend-income": 2, value: 2, growth: 1 } },
    ],
  },
  {
    id: "q2",
    prompt: {
      en: "How much time do you want to spend managing investments?",
      ko: "투자를 관리하는 데 시간을 얼마나 쓰고 싶나요?",
    },
    options: [
      { id: "a", label: { en: "Almost none — set it and forget it", ko: "거의 안 쓴다 — 설정하고 잊기" }, dims: { E: 5 }, strategies: { "index-passive": 4, "dividend-income": 1 } },
      { id: "b", label: { en: "A few hours a month", ko: "한 달에 몇 시간" }, dims: { E: 30 }, strategies: { "dividend-income": 2, value: 2, "factor-quant": 2, "index-passive": 1 } },
      { id: "c", label: { en: "A few hours every week", ko: "매주 몇 시간" }, dims: { E: 60 }, strategies: { "swing-trading": 3, "trend-momentum": 2, "event-driven": 2, "global-macro": 1 } },
      { id: "d", label: { en: "It's a daily focus, like a job", ko: "직업처럼 매일 집중한다" }, dims: { E: 95 }, strategies: { "day-trading": 4, "swing-trading": 1 } },
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
      { id: "c", label: { en: "Hold, and maybe buy more at lower prices", ko: "버티고, 더 싼 가격에 추가 매수할 수도" }, dims: { R: 70 }, strategies: { value: 3, growth: 2, "index-passive": 1 } },
      { id: "d", label: { en: "See it as opportunity — volatility is where I make money", ko: "기회로 본다 — 변동성이 곧 수익의 원천" }, dims: { R: 95 }, strategies: { "day-trading": 3, "trend-momentum": 2, "swing-trading": 2 } },
    ],
  },
  {
    id: "q4",
    prompt: {
      en: "Which kind of thinking sounds most fun to you?",
      ko: "어떤 종류의 사고가 가장 재미있게 느껴지나요?",
    },
    options: [
      { id: "a", label: { en: "Crunching data, rules, and back-tested systems", ko: "데이터·규칙·백테스트된 시스템 다루기" }, strategies: { "factor-quant": 4, "trend-momentum": 2, "day-trading": 1 } },
      { id: "b", label: { en: "Judging whether a business is good and fairly priced", ko: "기업이 좋은지, 가격이 적정한지 판단하기" }, strategies: { value: 3, growth: 2, "dividend-income": 1 } },
      { id: "c", label: { en: "Reading price charts and spotting patterns", ko: "가격 차트를 읽고 패턴을 찾기" }, strategies: { "swing-trading": 3, "trend-momentum": 2, "day-trading": 2 } },
      { id: "d", label: { en: "Following the economy, rates, and world events", ko: "경제·금리·세계 정세를 따라가기" }, strategies: { "global-macro": 4, "event-driven": 1 } },
    ],
  },
  {
    id: "q5",
    prompt: {
      en: "What do you most want from this money?",
      ko: "이 돈에서 가장 원하는 것은 무엇인가요?",
    },
    options: [
      { id: "a", label: { en: "Steady cash/income I can use now", ko: "지금 쓸 수 있는 꾸준한 현금/인컴" }, strategies: { "dividend-income": 4, value: 1 } },
      { id: "b", label: { en: "Long-term growth; I'll reinvest everything", ko: "장기 성장; 전부 재투자하겠다" }, strategies: { growth: 3, "index-passive": 2, "factor-quant": 1 } },
      { id: "c", label: { en: "Broad, reliable market returns without surprises", ko: "놀랄 일 없는, 넓고 안정적인 시장 수익" }, strategies: { "index-passive": 4, "dividend-income": 1 } },
      { id: "d", label: { en: "Big gains from active trades, and I accept the risk", ko: "능동적 매매로 큰 수익, 위험은 감수" }, strategies: { "day-trading": 2, "trend-momentum": 2, "swing-trading": 2 } },
    ],
  },
  {
    id: "q6",
    prompt: {
      en: "Which describes your temperament best?",
      ko: "당신의 기질을 가장 잘 설명하는 것은?",
    },
    options: [
      { id: "a", label: { en: "Patient — happy to wait years for a thesis to play out", ko: "인내심 있음 — 논리가 실현되기까지 몇 년도 기다린다" }, strategies: { value: 3, "index-passive": 2, "dividend-income": 1 } },
      { id: "b", label: { en: "Steady but engaged — I like a catalyst or a plan", ko: "차분하지만 적극적 — 촉매나 계획을 좋아한다" }, strategies: { "event-driven": 3, growth: 1, "global-macro": 1 } },
      { id: "c", label: { en: "Decisive and quick — I act fast on new information", ko: "결단력 있고 빠름 — 새 정보에 신속히 행동한다" }, strategies: { "day-trading": 3, "swing-trading": 2, "trend-momentum": 1 } },
    ],
  },
  {
    id: "q7",
    prompt: {
      en: "How experienced are you with investing?",
      ko: "투자 경험이 어느 정도인가요?",
    },
    options: [
      { id: "a", label: { en: "Brand new — still learning the basics", ko: "완전 초보 — 아직 기초를 배우는 중" }, dims: { X: 5 }, strategies: { "index-passive": 4, "dividend-income": 1 } },
      { id: "b", label: { en: "Comfortable with funds and long-term investing", ko: "펀드와 장기 투자에 익숙함" }, dims: { X: 40 }, strategies: { "index-passive": 2, "dividend-income": 2, value: 2, growth: 1 } },
      { id: "c", label: { en: "I research individual stocks / use strategies", ko: "개별 종목을 분석하거나 전략을 쓴다" }, dims: { X: 70 }, strategies: { value: 2, growth: 2, "factor-quant": 2, "event-driven": 1 } },
      { id: "d", label: { en: "I actively trade and understand orders, leverage, risk", ko: "능동적으로 매매하며 주문·레버리지·위험을 이해한다" }, dims: { X: 95 }, strategies: { "day-trading": 3, "swing-trading": 2, "trend-momentum": 2, "global-macro": 1 } },
    ],
  },
  {
    id: "q8",
    prompt: {
      en: "How hands-on do you want to be?",
      ko: "얼마나 직접 관여하고 싶나요?",
    },
    options: [
      { id: "a", label: { en: "Fully hands-off — automate it", ko: "완전히 손 떼기 — 자동화한다" }, strategies: { "index-passive": 4 } },
      { id: "b", label: { en: "Mostly automated, occasional tweaks", ko: "대부분 자동화, 가끔 조정" }, strategies: { "dividend-income": 2, "factor-quant": 3, "index-passive": 1 } },
      { id: "c", label: { en: "I want to pick my own investments", ko: "내 투자는 내가 고르고 싶다" }, strategies: { value: 2, growth: 2, "dividend-income": 1 } },
      { id: "d", label: { en: "I want full control over every trade", ko: "모든 거래를 완전히 통제하고 싶다" }, strategies: { "day-trading": 3, "swing-trading": 2, "trend-momentum": 2 } },
    ],
  },
  {
    id: "q9",
    prompt: {
      en: "A stock you own jumps 25% in two weeks on no clear news. You…",
      ko: "보유 종목이 뚜렷한 뉴스 없이 2주 만에 25% 급등했습니다. 당신은…",
    },
    options: [
      { id: "a", label: { en: "Don't really track it day-to-day", ko: "사실 매일 들여다보지 않는다" }, strategies: { "index-passive": 2, "dividend-income": 1 } },
      { id: "b", label: { en: "Hold based on the company's long-term value", ko: "기업의 장기 가치를 믿고 보유" }, strategies: { value: 3, growth: 1 } },
      { id: "c", label: { en: "Ride the momentum while the trend holds", ko: "추세가 유지되는 한 모멘텀을 탄다" }, strategies: { "trend-momentum": 3, "swing-trading": 2 } },
      { id: "d", label: { en: "Look to take the quick profit", ko: "빠른 차익 실현을 노린다" }, strategies: { "swing-trading": 2, "day-trading": 2 } },
    ],
  },
  {
    id: "q10",
    prompt: {
      en: "Could you invest money you won't need — and emotionally survive losing a meaningful chunk of it?",
      ko: "당장 필요 없는 돈을 투자하고 — 그 상당 부분을 잃어도 감정적으로 버틸 수 있나요?",
    },
    options: [
      { id: "a", label: { en: "No — I need this money relatively safe", ko: "아니다 — 이 돈은 비교적 안전해야 한다" }, dims: { R: 10 }, strategies: { "index-passive": 3, "dividend-income": 2 } },
      { id: "b", label: { en: "A small portion, as a learning experiment", ko: "일부만, 배우기 위한 실험으로" }, dims: { R: 45 }, strategies: { "factor-quant": 1, "event-driven": 1, "swing-trading": 1, growth: 1 } },
      { id: "c", label: { en: "Yes — I have an emergency fund and stable income, and accept high risk", ko: "그렇다 — 비상금과 안정적 소득이 있고, 높은 위험을 감수한다" }, dims: { R: 90 }, strategies: { "day-trading": 2, "trend-momentum": 1, "global-macro": 1 }, capacityConfirm: true },
    ],
  },
];

export const ALL_STRATEGY_IDS: StrategyId[] = [
  "index-passive", "dividend-income", "value", "growth", "factor-quant",
  "global-macro", "trend-momentum", "event-driven", "swing-trading", "day-trading",
];

// Risk order (low → high) for tie-breaks and the passive floor.
const RISK_ORDER: StrategyId[] = [
  "index-passive", "dividend-income", "value", "factor-quant", "growth",
  "event-driven", "global-macro", "swing-trading", "trend-momentum", "day-trading",
];
const ACTIVE: StrategyId[] = [
  "value", "growth", "factor-quant", "global-macro", "trend-momentum",
  "event-driven", "swing-trading", "day-trading",
];

export interface QuizResult {
  primary: StrategyId;
  runnersUp: StrategyId[];
  /** True when the day-trading guardrail blocked an otherwise high score. */
  dayTradingGated: boolean;
  /** True when the Index/Passive floor overrode the raw winner. */
  flooredToPassive: boolean;
  scores: Record<StrategyId, number>;
}

/** answers: map of questionId -> chosen optionId. Unanswered questions are ignored. */
export function scoreQuiz(answers: Record<string, string>): QuizResult {
  const scores = Object.fromEntries(
    ALL_STRATEGY_IDS.map((s) => [s, 0]),
  ) as Record<StrategyId, number>;
  const dims: Record<Dim, number> = { H: 0, E: 0, R: 0, X: 0 };
  let capacityOK = false;
  let q5Income = false;

  for (const q of QUESTIONS) {
    const choice = answers[q.id];
    if (!choice) continue;
    const opt = q.options.find((o) => o.id === choice);
    if (!opt) continue;
    if (opt.dims) for (const [d, v] of Object.entries(opt.dims)) dims[d as Dim] += v!;
    if (opt.strategies)
      for (const [s, v] of Object.entries(opt.strategies)) scores[s as StrategyId] += v!;
    if (opt.capacityConfirm) capacityOK = true;
    if (q.id === "q5" && opt.id === "a") q5Income = true;
  }

  // Normalize gates.
  const Hn = (dims.H / DIM_MAX.H) * 100;
  const Rn = (dims.R / DIM_MAX.R) * 100;
  const En = (dims.E / DIM_MAX.E) * 100;
  const Xn = (dims.X / DIM_MAX.X) * 100;
  const riskHigh = Rn >= 70;
  const timeHigh = En >= 70;
  const expHigh = Xn >= 65;

  // Guardrails.
  const rawWinner = topStrategy(scores);
  let dayTradingGated = false;
  if (!(riskHigh && timeHigh && expHigh && capacityOK)) {
    if (scores["day-trading"] > 0) dayTradingGated = true;
    scores["day-trading"] = 0;
  }
  if (!expHigh && !timeHigh) {
    scores["swing-trading"] *= 0.5;
    scores["trend-momentum"] *= 0.5;
  }
  if (Hn >= 80 && Rn <= 30) {
    scores["index-passive"] += 4;
    scores["dividend-income"] += 2;
  }
  if (q5Income) scores["dividend-income"] += 3;

  // Rank.
  const ranked = [...ALL_STRATEGY_IDS].sort((a, b) => {
    if (scores[b] !== scores[a]) return scores[b] - scores[a];
    // Tie-break: lower risk wins.
    return RISK_ORDER.indexOf(a) - RISK_ORDER.indexOf(b);
  });

  let primary = ranked[0];
  let flooredToPassive = false;
  const top = scores[primary];
  const fourth = scores[ranked[3]] ?? 0;
  const flat = top - fourth < 6;
  const closeToPassive = Math.abs(top - scores["index-passive"]) <= 3;
  const inexperiencedActive = !expHigh && ACTIVE.includes(primary);
  if (primary !== "index-passive" && (flat || closeToPassive || inexperiencedActive)) {
    flooredToPassive = true;
    primary = "index-passive";
  }

  const runnersUp = ranked.filter((s) => s !== primary).slice(0, 2);
  // Surface the gated day-trading flag only when it actually would have won.
  return {
    primary,
    runnersUp,
    dayTradingGated: dayTradingGated && rawWinner === "day-trading",
    flooredToPassive,
    scores,
  };
}

function topStrategy(scores: Record<StrategyId, number>): StrategyId {
  return [...ALL_STRATEGY_IDS].sort((a, b) => scores[b] - scores[a])[0];
}
