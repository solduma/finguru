// The STRATEGY layer: goal-oriented investment identities a learner self-selects.
//
// A strategy is more concrete than a "school" (lib/schools.ts) and cuts ACROSS
// schools — e.g. Value draws on the Fundamental canon, Trend Following spans
// Technical + Quant. Each strategy therefore can't be derived from a single
// school grouping; instead it owns an explicit, research-ordered list of lesson
// steps (its learning path). Lessons are referenced by (kind, slug); a step
// whose lesson doesn't exist yet renders as a "coming soon" placeholder using
// its `newTitle`. Ordering + the per-step `why` come from the 2026-06 research
// synthesis (docs/strategy-learning-paths-2026-06.md).

import type { LessonKind } from "./content";
import type { Locale } from "./i18n";
import type { SchoolId } from "./schools";

export interface PathStep {
  slug: string;
  kind: LessonKind;
  /** Why this lesson sits here in the path (1 line, beginner-facing). */
  why: Record<Locale, string>;
  /** Present ONLY for lessons not yet written — used for the placeholder card. */
  newTitle?: Record<Locale, string>;
}

export interface Strategy {
  id: string;
  /** Suitability rank as a beginner's starting identity (1 = most suitable). */
  rank: number;
  /** Relative risk, low (1) → very high (10); used for quiz tie-breaks + badges. */
  riskRank: number;
  label: Record<Locale, string>;
  blurb: Record<Locale, string>;
  /** Schools this strategy draws on (for cross-linking to /schools). */
  schools: SchoolId[];
  steps: PathStep[];
}

// Helpers to keep the step list terse.
const guru = (
  slug: string,
  en: string,
  ko: string,
  newTitle?: Record<Locale, string>,
): PathStep => ({ slug, kind: "guru", why: { en, ko }, newTitle });
const concept = (
  slug: string,
  en: string,
  ko: string,
  newTitle?: Record<Locale, string>,
): PathStep => ({ slug, kind: "indicator", why: { en, ko }, newTitle });

export const STRATEGIES: Strategy[] = [
  {
    id: "index-passive",
    rank: 1,
    riskRank: 1,
    label: { en: "Index / Passive", ko: "인덱스 / 패시브" },
    blurb: {
      en: "Own the whole market cheaply and hold for the long run — the evidence-based default for most investors.",
      ko: "시장 전체를 저비용으로 보유하고 장기간 유지한다 — 대다수 투자자에게 근거가 가장 탄탄한 기본 전략.",
    },
    schools: ["quant"],
    steps: [
      guru("william-sharpe", "The arithmetic proof that the average active dollar must lose to the average passive dollar after costs.", "비용을 빼면 평균적인 액티브 투자가 평균적인 패시브 투자에 질 수밖에 없다는 산술적 증명."),
      guru("bogle-cost-matters", "The man who turned that arithmetic into a product: minimize cost, the one thing you control.", "그 산술을 상품으로 만든 인물: 당신이 통제할 수 있는 유일한 변수인 비용을 최소화하라.", { en: "John Bogle — The Rules of Humble Arithmetic", ko: "존 보글 — 겸손한 산술의 법칙" }),
      guru("fama-french", "Why it works: if markets are largely efficient, capture the average cheaply instead of trying to beat it.", "왜 통하는가: 시장이 대체로 효율적이라면, 이기려 하지 말고 평균을 저렴하게 취하라."),
      concept("index-funds-etfs", "The actual product: what an index is, fund vs ETF, total-market vs S&P 500, tracking error.", "실제 상품: 인덱스란 무엇인가, 펀드 vs ETF, 전체시장 vs S&P 500, 추적오차.", { en: "Index Funds & ETFs — Owning the Whole Market", ko: "인덱스 펀드 & ETF — 시장 전체 보유하기" }),
      guru("harry-markowitz", "Why a broad index beats a few picks: diversification is the only free lunch in investing.", "왜 광범위한 인덱스가 소수 종목보다 나은가: 분산은 투자의 유일한 공짜 점심."),
      concept("asset-allocation", "The decision that dominates outcomes: your stock/bond mix, the three-fund portfolio, and rebalancing.", "결과를 좌우하는 결정: 주식/채권 비중, 3-펀드 포트폴리오, 그리고 리밸런싱.", { en: "Asset Allocation & the Three-Fund Portfolio", ko: "자산배분 & 3-펀드 포트폴리오" }),
      concept("dollar-cost-averaging", "How to deploy money over time — and the honest math of when it helps vs. investing a lump sum.", "시간에 걸쳐 자금을 투입하는 법 — 그리고 일시 투자 대비 언제 유리한지에 대한 솔직한 계산.", { en: "Dollar-Cost Averaging — Steady Hands, Honest Math", ko: "분할 매수 — 흔들리지 않는 손, 정직한 계산" }),
      guru("trading-psychology", "Buy-and-hold lives or dies on discipline: not panic-selling or chasing performance through drawdowns.", "장기 보유의 성패는 규율에 달렸다: 하락장에서 공포 매도하거나 성과를 좇지 않기."),
      guru("warren-buffett", "The capstone authority: the greatest stock-picker tells ordinary investors to just buy a low-cost index fund.", "마무리 권위자: 최고의 종목 선정가가 일반 투자자에게 저비용 인덱스 펀드를 사라고 말한다."),
      concept("risk-management", "Position the passive portfolio in a lifetime context: horizon, drawdown tolerance, sequence risk.", "패시브 포트폴리오를 생애 관점에서 배치하기: 투자기간, 손실 감내, 시퀀스 리스크."),
    ],
  },
  {
    id: "dividend-income",
    rank: 2,
    riskRank: 2,
    label: { en: "Dividend / Income", ko: "배당 / 인컴" },
    blurb: {
      en: "Hold durable companies that pay growing dividends, and let the reinvested cash compound.",
      ko: "성장하는 배당을 지급하는 견고한 기업을 보유하고, 재투자한 현금이 복리로 불어나게 한다.",
    },
    schools: ["fundamental"],
    steps: [
      guru("charles-dow", "The shared root: a stock is a claim on a real business, the premise income investing rests on.", "공통 뿌리: 주식은 실제 기업에 대한 청구권이며, 인컴 투자가 기대는 전제."),
      guru("benjamin-graham", "Foundation: income with safety, Mr. Market, and the margin of safety.", "기초: 안전마진을 갖춘 인컴, 미스터 마켓, 그리고 안전마진."),
      guru("john-burr-williams", "The theory that a stock is worth its discounted future dividends — the intellectual core of income.", "주식의 가치는 할인된 미래 배당의 합이라는 이론 — 인컴 투자의 지적 핵심."),
      concept("dividend-investing", "The practical mechanics: yield, payout ratio, coverage, DRIP compounding, aristocrats, and yield traps.", "실전 메커니즘: 배당수익률, 배당성향, 커버리지, DRIP 복리, 배당귀족, 그리고 고배당 함정.", { en: "Dividend Investing — Yield, Coverage & Compounding", ko: "배당 투자 — 수익률, 커버리지 & 복리" }),
      guru("geraldine-weiss", "The dividend specialist: using a stock's historical yield band to judge over/undervaluation.", "배당 전문가: 주식의 역사적 배당수익률 밴드로 고평가/저평가를 판단하기.", { en: "Geraldine Weiss — Dividend Yield Theory", ko: "제럴딘 와이스 — 배당수익률 이론" }),
      guru("peter-lynch", "Dividend-growth discipline and the warning against overpaying for an income stream.", "배당 성장의 규율, 그리고 인컴을 위해 과도한 가격을 치르지 말라는 경고."),
      guru("terry-smith", "Quality + durable moats: the engine behind sustainable, growing dividends (high ROCE, cash conversion).", "우량성 + 견고한 해자: 지속 가능하고 성장하는 배당의 엔진(높은 ROCE, 현금 전환)."),
      guru("pat-dorsey", "The moat checklist that separates a true aristocrat from a future dividend cut.", "진짜 배당귀족과 미래의 배당 삭감을 가르는 해자 체크리스트."),
      concept("risk-management", "Discipline against yield-chasing concentration; sizing to avoid ruin.", "고수익 추종형 집중에 맞서는 규율; 파산을 피하는 비중 조절."),
    ],
  },
  {
    id: "value",
    rank: 3,
    riskRank: 3,
    label: { en: "Value", ko: "가치투자" },
    blurb: {
      en: "Buy businesses for meaningfully less than they're worth, demand a margin of safety, and wait.",
      ko: "기업을 그 가치보다 확실히 싸게 사고, 안전마진을 요구하며, 기다린다.",
    },
    schools: ["fundamental"],
    steps: [
      guru("john-burr-williams", "Intrinsic value defined: a stock is worth the present value of its future cash.", "내재가치의 정의: 주식의 가치는 미래 현금흐름의 현재가치."),
      guru("benjamin-graham", "The grammar of value: intrinsic value, Mr. Market, margin of safety, net-nets.", "가치투자의 문법: 내재가치, 미스터 마켓, 안전마진, 넷넷."),
      guru("david-dodd", "Security Analysis: Graham's method systematized into a repeatable discipline.", "증권분석: 그레이엄의 방법을 반복 가능한 규율로 체계화하다."),
      guru("warren-buffett", "The upgrade from cheap to wonderful: durable moats and owner earnings.", "싼 것에서 훌륭한 것으로의 도약: 견고한 해자와 주주이익."),
      guru("charlie-munger", "Quality at a fair price — why a great business beats a merely cheap one.", "합리적 가격의 우량 기업 — 훌륭한 기업이 단지 싼 기업을 이기는 이유."),
      guru("pat-dorsey", "Makes the moat testable: the four sources of durable competitive advantage.", "해자를 검증 가능하게: 지속 가능한 경쟁우위의 네 가지 원천."),
      guru("peter-lynch", "Accessible bottom-up picking: buy what you understand, at a reasonable price.", "접근하기 쉬운 상향식 종목 선정: 이해하는 것을, 합리적 가격에 사라."),
      concept("value-traps", "The strategy's #1 failure mode: when cheap is a warning, not a bargain.", "이 전략의 최대 실패 모드: 싼 것이 기회가 아니라 경고일 때.", { en: "Value Traps — When Cheap Is a Warning", ko: "가치 함정 — 싼 것이 경고일 때" }),
      guru("joel-greenblatt", "The Magic Formula: cheap + high return on capital, value and quality combined mechanically.", "마법 공식: 싼 가격 + 높은 자본수익률, 가치와 우량성을 기계적으로 결합."),
      guru("aswath-damodaran", "Rigorous intrinsic valuation: turning the philosophy into actual DCF numbers.", "엄밀한 내재가치 평가: 철학을 실제 DCF 숫자로 옮기기."),
      guru("seth-klarman", "Margin of Safety in practice: capital preservation first, deep discounts, patience.", "실전 안전마진: 자본 보존 우선, 깊은 할인, 인내."),
      guru("howard-marks", "Second-level thinking and cycles: when bargains actually appear.", "2차적 사고와 사이클: 진짜 헐값이 나타나는 시점."),
      guru("mohnish-pabrai", "Dhandho: heads I win, tails I don't lose much — asymmetric, concentrated bets.", "단도: 앞면이면 내가 이기고 뒷면이면 크게 잃지 않는다 — 비대칭적이고 집중된 베팅."),
    ],
  },
  {
    id: "growth",
    rank: 4,
    riskRank: 5,
    label: { en: "Growth", ko: "성장투자" },
    blurb: {
      en: "Buy companies growing faster than the market for capital gains — higher upside, higher volatility.",
      ko: "시장보다 빠르게 성장하는 기업을 자본이득을 위해 산다 — 더 큰 상승 여력, 더 큰 변동성.",
    },
    schools: ["fundamental", "technical"],
    steps: [
      guru("peter-lynch", "The friendliest entry: invest in what you know, ten-baggers, and the PEG ratio.", "가장 친근한 입문: 아는 것에 투자하라, 텐배거, 그리고 PEG 비율."),
      guru("philip-fisher", "How to identify a durable growth company: the 15 points and scuttlebutt research.", "지속 성장 기업을 식별하는 법: 15가지 포인트와 발품 조사(scuttlebutt)."),
      guru("t-rowe-price", "The father of growth investing: own the fertile field through its life cycle.", "성장투자의 아버지: 비옥한 분야를 그 생애주기 내내 보유하라.", { en: "T. Rowe Price — The Growth Stock Theory", ko: "T. 로우 프라이스 — 성장주 이론" }),
      guru("terry-smith", "Modern quality-compounding: buy good companies, don't overpay, do nothing.", "현대적 우량 복리: 좋은 기업을 사고, 비싸게 사지 말고, 가만히 있어라."),
      concept("peg-ratio-garp", "The corrective lens that stops you overpaying: PEG and growth at a reasonable price.", "과도한 가격 지불을 막는 교정 렌즈: PEG와 합리적 가격의 성장(GARP).", { en: "PEG Ratio & Growth at a Reasonable Price", ko: "PEG 비율 & 합리적 가격의 성장(GARP)" }),
      guru("joel-greenblatt", "High ROIC + earnings yield: quality growth at a reasonable price, made systematic.", "높은 ROIC + 이익수익률: 합리적 가격의 우량 성장을 체계화하다."),
      guru("warren-buffett", "A wonderful company at a fair price: growth and value are joined at the hip.", "합리적 가격의 훌륭한 기업: 성장과 가치는 한 몸이다."),
      guru("william-oneil", "CAN SLIM: blending fundamental growth with chart timing and relative strength.", "CAN SLIM: 펀더멘털 성장에 차트 타이밍과 상대강도를 결합."),
      guru("stan-weinstein", "Stage Analysis: when to buy and sell growth leaders using the 30-week trend.", "국면 분석: 30주 추세로 성장 주도주를 언제 사고팔지 판단."),
      guru("mark-minervini", "SEPA and the Volatility Contraction Pattern: the risk-managed pinnacle of growth-leader trading.", "SEPA와 변동성 수축 패턴: 위험을 관리하는 성장주도주 매매의 정점."),
      concept("risk-management", "Non-negotiable given growth's volatility: position sizing and stops against the high-multiple disappointment.", "성장주의 변동성을 감안하면 필수: 고배수 실망에 대비한 비중 조절과 손절."),
    ],
  },
  {
    id: "factor-quant",
    rank: 5,
    riskRank: 4,
    label: { en: "Factor / Quant", ko: "팩터 / 퀀트" },
    blurb: {
      en: "Tilt a diversified portfolio toward proven return drivers — value, size, momentum, quality — by rule, not hunch.",
      ko: "검증된 수익 동인(가치·규모·모멘텀·우량)으로 분산 포트폴리오를 규칙에 따라 기울인다.",
    },
    schools: ["quant"],
    steps: [
      guru("william-sharpe", "Start here: CAPM defines beta (the market factor) and the Sharpe ratio. A factor model is CAPM + more betas.", "여기서 시작: CAPM은 베타(시장 팩터)와 샤프 비율을 정의한다. 팩터 모델은 'CAPM + 더 많은 베타'다."),
      guru("harry-markowitz", "Mean-variance optimization: factor investing is portfolio construction first.", "평균-분산 최적화: 팩터 투자는 무엇보다 포트폴리오 구성이다."),
      guru("fama-french", "The empirical birth of factors: the 3- and 5-factor models prove CAPM is incomplete.", "팩터의 실증적 탄생: 3·5 팩터 모델이 CAPM의 불완전성을 증명한다."),
      guru("jegadeesh-titman-carhart", "Momentum — the factor Fama-French left out, and the one that decays and reverses.", "모멘텀 — 파마-프렌치가 빠뜨린 팩터이자, 감쇠하고 반전하는 팩터."),
      guru("joel-greenblatt", "A bridge for beginners: the Magic Formula makes 'value + quality factors' concrete.", "초심자를 위한 다리: 마법 공식이 '가치+우량 팩터'를 구체화한다."),
      guru("cliff-asness", "The synthesis: combining lowly-correlated factors that take turns into one portfolio.", "종합: 상관이 낮아 번갈아 작동하는 팩터들을 하나의 포트폴리오로 결합."),
      concept("risk-parity", "Allocate by risk contribution, not dollars — how practitioners weight and lever exposures.", "금액이 아니라 위험 기여도로 배분하기 — 실무가들이 익스포저를 가중·레버리지하는 방식."),
      guru("grinold-kahn", "The Fundamental Law: information ratio ≈ skill × √breadth — the math for why systematic breadth wins.", "능동운용의 근본법칙: 정보비율 ≈ 스킬 × √폭 — 시스템적 폭이 이기는 이유의 수학."),
      guru("andrew-lo", "Adaptive Markets: why factors decay and crowd as capital chases them.", "적응적 시장: 자본이 몰리면서 팩터가 감쇠하고 혼잡해지는 이유."),
      guru("lopez-de-prado", "The worst failure mode: overfitting, backtest multiplicity, and the factor zoo.", "최악의 실패 모드: 과적합, 백테스트 다중성, 그리고 '팩터 동물원'."),
      concept("smart-beta-and-factor-etfs", "How a retail investor actually implements factor exposure, cheaply and long-only.", "개인 투자자가 팩터 익스포저를 저비용·롱온리로 실제로 구현하는 방법.", { en: "Smart Beta & Factor ETFs", ko: "스마트 베타 & 팩터 ETF" }),
    ],
  },
  {
    id: "global-macro",
    rank: 6,
    riskRank: 7,
    label: { en: "Global Macro", ko: "글로벌 매크로" },
    blurb: {
      en: "Trade the big picture — currencies, rates, commodities, cycles — on macro and policy views.",
      ko: "큰 그림을 거래한다 — 통화·금리·원자재·사이클 — 거시와 정책 전망에 근거해.",
    },
    schools: ["macro"],
    steps: [
      concept("the-business-cycle", "The gentlest entry: expansion → peak → contraction → trough, and how credit amplifies it.", "가장 부드러운 입문: 확장 → 정점 → 수축 → 저점, 그리고 신용이 이를 증폭하는 방식.", { en: "The Business & Credit Cycle 101", ko: "경기·신용 사이클 입문" }),
      concept("macro-indicators", "Learn to read the cycle: leading (yield curve, ISM), coincident, and lagging indicators.", "사이클을 읽는 법: 선행(수익률곡선, ISM), 동행, 후행 지표.", { en: "Reading the Economy: Leading, Coincident & Lagging Indicators", ko: "경제 읽기: 선행·동행·후행 지표" }),
      concept("central-banks-monetary-policy", "The lever that steers the cycle: rates, transmission, inflation targets, QE/QT.", "사이클을 조종하는 지렛대: 금리, 전달 경로, 물가 목표, QE/QT.", { en: "Central Banks & Policy Regimes", ko: "중앙은행 & 정책 국면" }),
      guru("ray-dalio", "The synthesizer: the Economic Machine fuses cycle + credit + policy, and the All-Weather portfolio.", "종합가: '경제 기계'가 사이클+신용+정책을 융합하고, 올웨더 포트폴리오를 제시한다."),
      guru("john-maynard-keynes", "Animal spirits and the beauty contest: why markets misprice cycles.", "야성적 충동과 미인대회: 시장이 사이클을 잘못 가격 매기는 이유."),
      guru("hyman-minsky", "Stability is destabilizing: how booms quietly build the next bust.", "안정이 불안정을 낳는다: 호황이 조용히 다음 붕괴를 쌓는 과정."),
      concept("risk-parity", "The systematic macro capstone: balance risk across growth × inflation quadrants, then lever to target.", "시스템적 매크로의 정점: 성장×인플레 사분면에 위험을 균형 배분하고 목표까지 레버리지."),
      guru("george-soros", "Reflexivity and boom/bust: the first trader to bet on the regime shifts themselves.", "재귀성과 호황/붕괴: 국면 전환 자체에 베팅한 최초의 트레이더."),
      guru("stanley-druckenmiller", "Concentration + asymmetry: it's how much you make when right vs. lose when wrong.", "집중 + 비대칭: 맞았을 때 얼마를 벌고 틀렸을 때 얼마를 잃느냐가 핵심."),
      guru("paul-tudor-jones", "Defense first: assume every position is wrong and never average losers.", "수비 먼저: 모든 포지션이 틀렸다고 가정하고, 손실 종목을 물타기하지 마라."),
      guru("bruce-kovner", "Probabilistic scenarios and sizing: define the exit before the entry.", "확률적 시나리오와 비중: 진입 전에 청산을 정의하라."),
      guru("michael-steinhardt", "Variant perception: edge is a well-founded view that differs from the priced-in consensus.", "변이적 인식: 우위란 이미 가격에 반영된 컨센서스와 다른, 근거 있는 견해."),
      guru("jim-rogers", "Commodity supercycles and boots-on-the-ground research — the long-secular leg of macro.", "원자재 슈퍼사이클과 현장 조사 — 매크로의 장기 구조적 축."),
      guru("kyle-bass", "Asymmetric macro/credit: pay a small known cost for a huge payoff if a crisis hits.", "비대칭 매크로/신용: 위기가 오면 큰 보상을 얻기 위해 작고 확정된 비용을 치른다."),
      guru("hugh-hendry", "Contrarian narrative macro: a contentious premise outside the consensus, held with discipline.", "역발상 내러티브 매크로: 컨센서스 밖의 논쟁적 전제를 규율 있게 견지한다."),
      guru("raoul-pal", "The modern liquidity-cycle lens: central-bank balance sheets and M2 over the cycle.", "현대적 유동성 사이클 렌즈: 사이클에 걸친 중앙은행 대차대조표와 M2."),
    ],
  },
  {
    id: "trend-momentum",
    rank: 7,
    riskRank: 9,
    label: { en: "Trend Following / Momentum", ko: "추세추종 / 모멘텀" },
    blurb: {
      en: "Buy what's already rising, ride the move for months, and exit on reversal — in charts and in factors.",
      ko: "이미 오르는 것을 사서 몇 달간 추세를 타고, 반전 시 빠져나온다 — 차트로도, 팩터로도.",
    },
    schools: ["technical", "quant"],
    steps: [
      guru("charles-dow", "Defines what a trend even is: higher highs and lows, and confirmation.", "추세가 무엇인지를 정의한다: 고점·저점의 상승, 그리고 확인."),
      concept("moving-averages", "The first quantitative trend tool; the smoothing/lag tradeoff under every trend filter.", "최초의 정량적 추세 도구; 모든 추세 필터의 바탕인 평활/지연 트레이드오프."),
      guru("jesse-livermore", "The behavior of trend trading: buy the leader, ride it, cut losses fast, pyramid.", "추세 매매의 행동: 주도주를 사서 타고, 손실은 빨리 끊고, 피라미딩하라."),
      concept("support-resistance-patterns", "Breakouts clearing resistance are the canonical momentum entry.", "저항을 돌파하는 브레이크아웃이 전형적인 모멘텀 진입이다."),
      concept("volume-obv", "Momentum breakouts need volume confirmation to separate the real from the trap.", "모멘텀 브레이크아웃은 진짜와 함정을 가르기 위해 거래량 확인이 필요하다."),
      guru("stan-weinstein", "Stage Analysis: only buy a confirmed Stage-2 uptrend above a rising 30-week average.", "국면 분석: 상승하는 30주선 위의 확인된 2국면 상승만 매수하라."),
      concept("adx-atr", "Measure trend strength (ADX) and size risk by volatility (ATR) — the CTA engine.", "추세 강도(ADX)를 측정하고 변동성(ATR)으로 위험을 조절한다 — CTA의 엔진."),
      guru("martin-pring", "Formalizes momentum oscillators and ties trend to the business cycle.", "모멘텀 오실레이터를 정식화하고 추세를 경기 사이클과 연결한다."),
      guru("william-oneil", "Momentum leadership selection: relative strength, new highs, and the 7–8% stop.", "모멘텀 주도주 선정: 상대강도, 신고가, 그리고 7~8% 손절."),
      guru("mark-minervini", "The lowest-risk breakout timing: SEPA Trend Template and VCP entries.", "가장 낮은 위험의 브레이크아웃 타이밍: SEPA 추세 템플릿과 VCP 진입."),
      guru("turtle-traders", "The systematic bridge: rules-based Donchian breakouts, ATR sizing, and managed futures.", "시스템적 다리: 규칙 기반 돈치안 브레이크아웃, ATR 사이징, 그리고 매니지드 퓨처스.", { en: "The Turtle Traders & Managed-Futures Trend Following", ko: "터틀 트레이더 & 매니지드 퓨처스 추세추종" }),
      guru("jegadeesh-titman-carhart", "The academic proof: cross-sectional momentum (~1%/month) and the Carhart factor.", "학술적 증명: 횡단면 모멘텀(월 약 1%)과 카하트 팩터."),
      guru("cliff-asness", "Momentum at scale: multi-asset, and why you diversify across factors.", "대규모 모멘텀: 멀티에셋, 그리고 팩터 간 분산이 필요한 이유."),
      concept("risk-management", "The honest closer: trailing stops, pyramiding rules, and the momentum-crash problem.", "정직한 마무리: 추적 손절, 피라미딩 규칙, 그리고 모멘텀 급락 문제."),
      guru("trading-psychology", "Why momentum exists behaviorally — and why traders break trend discipline.", "모멘텀이 행동학적으로 존재하는 이유 — 그리고 트레이더가 추세 규율을 어기는 이유."),
    ],
  },
  {
    id: "event-driven",
    rank: 8,
    riskRank: 6,
    label: { en: "Event-Driven / Special Situations", ko: "이벤트 드리븐 / 특수 상황" },
    blurb: {
      en: "Profit from corporate events — spin-offs, mergers, distress, activism — where a catalyst unlocks value.",
      ko: "기업 이벤트에서 수익을 낸다 — 스핀오프·합병·부실·행동주의 — 촉매가 가치를 푸는 곳.",
    },
    schools: ["fundamental"],
    steps: [
      guru("benjamin-graham", "Graham invented the 'workouts' bucket: arbitrage and special situations as a separate sleeve.", "그레이엄이 '워크아웃' 바구니를 발명했다: 차익거래와 특수 상황을 별도 영역으로."),
      guru("warren-buffett", "Risk/merger arbitrage in the partnership years: catalyst-based, market-independent returns.", "파트너십 시절의 위험/합병 차익거래: 촉매 기반의, 시장과 무관한 수익."),
      guru("joel-greenblatt", "The canonical text: spin-offs, restructurings, and special situations for the individual.", "정전(正典)과 같은 책: 개인을 위한 스핀오프, 구조조정, 특수 상황."),
      guru("seth-klarman", "Distressed debt, bankruptcies, and complex workouts paired with deep risk discipline.", "부실채권, 파산, 복잡한 워크아웃을 깊은 위험 규율과 결합."),
      guru("howard-marks", "The distressed-debt master: cycle timing and second-level thinking for credit events.", "부실채권의 거장: 신용 이벤트를 위한 사이클 타이밍과 2차적 사고."),
      guru("mohnish-pabrai", "Event-driven bets as asymmetric wagers, with Kelly-style sizing.", "이벤트 드리븐 베팅을 비대칭 베팅으로, 켈리식 사이징과 함께."),
      concept("merger-arbitrage", "The one mechanic the strategy is named for: deal spread, break risk, and annualized return.", "전략 이름의 바로 그 메커니즘: 딜 스프레드, 무산 위험, 그리고 연환산 수익률.", { en: "Merger Arbitrage — Betting on the Deal Closing", ko: "합병 차익거래 — 딜 성사에 베팅하기" }),
    ],
  },
  {
    id: "swing-trading",
    rank: 9,
    riskRank: 8,
    label: { en: "Swing Trading", ko: "스윙 트레이딩" },
    blurb: {
      en: "Capture multi-day to multi-week price swings off technical setups — the middle horizon.",
      ko: "기술적 셋업으로 며칠~몇 주의 가격 스윙을 포착한다 — 중간 시간대.",
    },
    schools: ["technical"],
    steps: [
      guru("charles-dow", "Foundation: trend definition and confirmation — the grammar every swing setup is written in.", "기초: 추세 정의와 확인 — 모든 스윙 셋업이 쓰여지는 문법."),
      concept("support-resistance-patterns", "The levels you buy, stop, and target against; where a swing begins and ends.", "매수·손절·목표의 기준 레벨; 스윙이 시작되고 끝나는 곳."),
      concept("candlestick-patterns", "Entry-timing grammar: the precise bar to act on at a level.", "진입 타이밍의 문법: 레벨에서 행동할 정확한 봉."),
      guru("steve-nison", "The master of candlesticks: reading engulfings, hammers, and stars at swing pivots.", "캔들차트의 거장: 스윙 변곡점에서 장악형·해머·별형 읽기."),
      concept("volume-obv", "Volume confirms breakouts vs. traps and validates the move you'll ride for days.", "거래량은 브레이크아웃과 함정을 구분하고, 며칠 탈 움직임을 검증한다."),
      concept("moving-averages", "The trend filter and dynamic support that say which swings are with the tide.", "어떤 스윙이 큰 흐름과 같은 편인지 알려주는 추세 필터이자 동적 지지선."),
      concept("rsi", "Overbought/oversold and momentum for timing pullback entries and exits into strength.", "과매수/과매도와 모멘텀으로 눌림목 진입과 강세 청산의 타이밍을 잡기."),
      concept("macd", "Momentum and trend-shift confirmation, plus divergence — a core swing oscillator.", "모멘텀과 추세 전환 확인, 그리고 다이버전스 — 핵심 스윙 오실레이터."),
      concept("bollinger-bands", "The volatility envelope: squeezes precede swings; band-walk vs. reversion.", "변동성 밴드: 수축은 스윙을 예고한다; 밴드 워킹 vs. 회귀."),
      guru("john-bollinger", "The author himself: combine bands with volume and momentum to avoid the touch=reverse mistake.", "밴드 창시자: 밴드를 거래량·모멘텀과 결합해 '터치=반전' 실수를 피하라."),
      concept("adx-atr", "Regime filter (ADX) and volatility-based stop/target sizing (ATR).", "국면 필터(ADX)와 변동성 기반 손절/목표 사이징(ATR)."),
      guru("welles-wilder", "The originator of RSI, ADX, and ATR — consolidating the indicator toolkit.", "RSI·ADX·ATR의 창시자 — 지표 도구함을 통합한다."),
      guru("richard-wyckoff", "Accumulation/distribution: which stage a stock is in, so you buy near markup.", "매집/분산: 종목이 어느 국면인지 파악해 상승 직전에 매수하기."),
      guru("william-jiler", "Classical chart patterns: the multi-day formations and measured-move targets.", "고전 차트 패턴: 며칠짜리 형성 패턴과 측정된 목표가."),
      guru("linda-raschke", "The model swing playbook: regime-reading and concrete, codeable setups.", "모범 스윙 플레이북: 국면 읽기와 코드화 가능한 구체적 셋업."),
      guru("alan-farley", "The Master Swing Trader: Pattern Cycles, signal convergence, capital preservation first.", "마스터 스윙 트레이더: 패턴 사이클, 신호 수렴, 자본 보존 우선."),
      guru("larry-williams", "Short-term timing edges that sharpen swing entries: volatility breakouts, %R, seasonality.", "스윙 진입을 날카롭게 하는 단기 타이밍 우위: 변동성 돌파, %R, 계절성."),
      guru("thomas-demark", "Objective exhaustion and turning points without subjective discretion.", "주관적 재량 없이 객관적인 소진과 전환점 포착."),
      concept("swing-trading-playbook", "The capstone: a repeatable scan → setup → entry → stop → target → manage workflow.", "정점: 반복 가능한 스캔 → 셋업 → 진입 → 손절 → 목표 → 관리 워크플로우.", { en: "The Swing Trading Playbook: Entries, Stops & Targets", ko: "스윙 트레이딩 플레이북: 진입·손절·목표" }),
      concept("risk-management", "Position sizing, stops, R-multiples, expectancy — survival over setups.", "비중 조절, 손절, R-멀티플, 기대값 — 셋업보다 생존."),
      guru("trading-psychology", "Discipline over knowledge: patience to hold swings and avoid overtrading.", "지식보다 규율: 스윙을 버티고 과매매를 피하는 인내."),
    ],
  },
  {
    id: "day-trading",
    rank: 10,
    riskRank: 10,
    label: { en: "Day Trading", ko: "데이 트레이딩" },
    blurb: {
      en: "Intraday positions closed by the bell — the highest-effort, highest-risk path. Most lose money; learn the reality first.",
      ko: "장 마감 전 청산하는 일중 매매 — 가장 노력이 많이 들고 가장 위험한 길. 대부분 손실을 본다; 현실부터 배우라.",
    },
    schools: ["technical"],
    steps: [
      concept("day-trading-reality-check", "Read this first: the odds, the cost drag, the leverage danger, and why ~90% lose money.", "이것부터 읽어라: 확률, 비용 부담, 레버리지 위험, 그리고 약 90%가 손실을 보는 이유.", { en: "Day Trading Reality Check — The Odds & The Costs", ko: "데이 트레이딩 현실 점검 — 확률과 비용" }),
      guru("trading-psychology", "Day trading fails on discipline, not analysis: overtrading, revenge trading, tilt.", "데이 트레이딩은 분석이 아니라 규율에서 무너진다: 과매매, 복수 매매, 틸트."),
      concept("risk-management", "The only mathematically defensible reason a minority survive: sizing and daily max-loss rules.", "소수가 살아남는 수학적으로 정당한 유일한 이유: 사이징과 일일 최대손실 규칙."),
      concept("support-resistance-patterns", "The core intraday map: levels, ranges, breakouts, and failures.", "핵심 일중 지도: 레벨, 박스권, 돌파, 그리고 실패."),
      concept("volume-obv", "Volume confirmation and climaxes — the bridge to tape and microstructure.", "거래량 확인과 클라이맥스 — 테이프와 시장 미시구조로 가는 다리."),
      concept("candlestick-patterns", "A fast visual read of intraday bars: reversals and exhaustion on compressed timeframes.", "일중 봉의 빠른 시각적 해석: 압축된 시간대의 반전과 소진."),
      guru("charles-dow", "Trend structure scaled to intraday — the conceptual root of price-action reading.", "일중으로 축소한 추세 구조 — 가격 행동 읽기의 개념적 뿌리."),
      guru("jesse-livermore", "The original tape reader — and the original cautionary tale about discipline.", "원조 테이프 리더 — 그리고 규율에 관한 원조 경고담."),
      guru("richard-wyckoff", "Tape reading and the composite operator: who is on the other side of your trade.", "테이프 읽기와 컴포지트 오퍼레이터: 당신 거래의 반대편에 누가 있는가."),
      guru("larry-williams", "Short-term timing systems: %R, volatility breakouts — canonical intraday methodology.", "단기 타이밍 시스템: %R, 변동성 돌파 — 전형적인 일중 방법론."),
      guru("linda-raschke", "Professional short-term setups and a working trader's risk routine.", "프로의 단기 셋업과 현업 트레이더의 위험 관리 루틴."),
      guru("alan-farley", "Pattern-cycle and intraday entries with tight risk control.", "패턴 사이클과 엄격한 위험 관리를 갖춘 일중 진입."),
      guru("thomas-demark", "Exhaustion timing (TD Sequential) for intraday turning points — advanced, optional.", "일중 전환점을 위한 소진 타이밍(TD 시퀀셜) — 고급, 선택."),
      guru("michael-huddleston", "Modern microstructure: liquidity, order blocks, stop-runs — last, and with a healthy skepticism.", "현대 미시구조: 유동성, 오더블록, 스톱런 — 마지막에, 건강한 회의와 함께."),
    ],
  },
];

export function getStrategy(id: string): Strategy | null {
  return STRATEGIES.find((s) => s.id === id) ?? null;
}

export function isStrategyId(x: string): boolean {
  return STRATEGIES.some((s) => s.id === x);
}

/** Risk badge label for a strategy's riskRank. */
export function riskLabel(riskRank: number): Record<Locale, string> {
  if (riskRank <= 2) return { en: "Lower risk", ko: "낮은 위험" };
  if (riskRank <= 5) return { en: "Moderate risk", ko: "중간 위험" };
  if (riskRank <= 8) return { en: "Higher risk", ko: "높은 위험" };
  return { en: "Very high risk", ko: "매우 높은 위험" };
}
