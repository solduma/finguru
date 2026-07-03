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
import type { LabId } from "./practicals";

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
  /** Hands-on capstone lab for this strategy's path, if one is wired up. */
  practical?: LabId;
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
      concept("investing-basics", "New to all of this? Start here: stock, share, ticker, broker, bond, dividend, fund — every word the path uses, in one plain paragraph each.", "여기가 처음인가요? 여기서 시작하세요: 주식·주·티커·증권사·채권·배당·펀드 — 이 경로가 쓰는 모든 용어를 한 문단씩 쉬운 말로."),
      guru("william-sharpe", "The arithmetic proof that the average active dollar must lose to the average passive dollar after costs.", "비용을 빼면 평균적인 액티브 투자가 평균적인 패시브 투자에 질 수밖에 없다는 산술적 증명."),
      guru("bogle-cost-matters", "The man who turned that arithmetic into a product: minimize cost, the one thing you control.", "그 산술을 상품으로 만든 인물: 당신이 통제할 수 있는 유일한 변수인 비용을 최소화하라.", { en: "John Bogle — The Rules of Humble Arithmetic", ko: "존 보글 — 겸손한 산술의 법칙" }),
      guru("fama-french", "Why it works: if markets are largely efficient, capture the average cheaply instead of trying to beat it.", "왜 통하는가: 시장이 대체로 효율적이라면, 이기려 하지 말고 평균을 저렴하게 취하라."),
      concept("index-funds-etfs", "The actual product: what an index is, fund vs ETF, total-market vs S&P 500, tracking error.", "실제 상품: 인덱스란 무엇인가, 펀드 vs ETF, 전체시장 vs S&P 500, 추적오차.", { en: "Index Funds & ETFs — Owning the Whole Market", ko: "인덱스 펀드 & ETF — 시장 전체 보유하기" }),
      guru("harry-markowitz", "Why a broad index beats a few picks: diversification is the only free lunch in investing.", "왜 광범위한 인덱스가 소수 종목보다 나은가: 분산은 투자의 유일한 공짜 점심."),
      concept("asset-allocation", "The decision that dominates outcomes: your stock/bond mix, the three-fund portfolio, and rebalancing.", "결과를 좌우하는 결정: 주식/채권 비중, 3-펀드 포트폴리오, 그리고 리밸런싱.", { en: "Asset Allocation & the Three-Fund Portfolio", ko: "자산배분 & 3-펀드 포트폴리오" }),
      concept("dollar-cost-averaging", "How to deploy money over time — and the honest math of when it helps vs. investing a lump sum.", "시간에 걸쳐 자금을 투입하는 법 — 그리고 일시 투자 대비 언제 유리한지에 대한 솔직한 계산.", { en: "Dollar-Cost Averaging — Steady Hands, Honest Math", ko: "분할 매수 — 흔들리지 않는 손, 정직한 계산" }),
      concept("trading-psychology", "Buy-and-hold lives or dies on discipline: not panic-selling or chasing performance through drawdowns.", "장기 보유의 성패는 규율에 달렸다: 하락장에서 공포 매도하거나 성과를 좇지 않기."),
      guru("warren-buffett", "The capstone authority: the greatest stock-picker tells ordinary investors to just buy a low-cost index fund.", "마무리 권위자: 최고의 종목 선정가가 일반 투자자에게 저비용 인덱스 펀드를 사라고 말한다."),
      concept("risk-management", "Position the passive portfolio in a lifetime context: horizon, drawdown tolerance, sequence risk.", "패시브 포트폴리오를 생애 관점에서 배치하기: 투자기간, 손실 감내, 시퀀스 리스크."),
      concept("placing-your-first-trade", "The last mile: open and fund a brokerage account, pick the right tax-advantaged wrapper, and place the order — turning the plan into shares you own.", "마지막 단계: 증권 계좌를 열고 자금을 넣고, 알맞은 절세 계좌를 고르고, 주문을 넣어 — 계획을 실제 보유 주식으로 바꾸기."),
    ],
    practical: "cost-drag",
  },
  {
    // Goal-based, fully automated: target-date funds & roboadvisors that
    // auto-allocate AND glide down risk over time. The most common real
    // individual "strategy" — distinct from static index/passive.
    id: "lifecycle",
    rank: 2,
    riskRank: 2,
    label: { en: "Lifecycle / Automated", ko: "라이프사이클 / 자동" },
    blurb: {
      en: "Pick a target retirement date (or a roboadvisor) and let it auto-diversify and de-risk for you over the decades — the lowest-effort path to a goal.",
      ko: "목표 은퇴 시점(또는 로보어드바이저)을 고르면 수십 년에 걸쳐 자동으로 분산하고 위험을 줄여 준다 — 목표 달성을 위한 가장 손이 덜 가는 길.",
    },
    schools: ["quant"],
    steps: [
      concept("investing-basics", "Brand new? Start here: what a stock, fund, ETF, bond, and index actually are — the vocabulary the rest of this path assumes.", "완전 초보인가요? 여기서 시작하세요: 주식·펀드·ETF·채권·지수가 실제로 무엇인지 — 이 경로가 전제하는 기본 어휘."),
      guru("bogle-cost-matters", "The foundation: keep costs near zero — a target-date fund is only as good as its fees.", "기초: 비용을 0에 가깝게 — 타깃데이트 펀드의 가치는 그 보수에 달렸다.", { en: "John Bogle — Why Costs Decide", ko: "존 보글 — 비용이 결정한다" }),
      concept("index-funds-etfs", "What's inside: a target-date fund is a fund-of-index-funds that rebalances itself.", "내부 구조: 타깃데이트 펀드는 스스로 리밸런싱하는 '인덱스 펀드의 펀드'.", { en: "Index Funds & ETFs", ko: "인덱스 펀드 & ETF" }),
      concept("asset-allocation", "The glide path: how the stock/bond mix automatically gets safer as your date nears.", "글라이드 패스: 목표 시점이 다가올수록 주식/채권 비중이 자동으로 안전해지는 방식.", { en: "Asset Allocation & the Glide Path", ko: "자산배분 & 글라이드 패스" }),
      concept("dollar-cost-averaging", "Automate contributions: pay yourself first, on schedule, and ignore the noise.", "자동 납입: 정해진 일정에 따라 먼저 저축하고 소음은 무시하라.", { en: "Dollar-Cost Averaging", ko: "분할 매수" }),
      guru("harry-markowitz", "Why it works: diversification across assets is the free lunch the glide path harvests for you.", "왜 통하는가: 자산 간 분산이라는 공짜 점심을 글라이드 패스가 대신 취해 준다."),
      concept("trading-psychology", "The only hard part is leaving it alone — automation removes the temptation to tinker.", "유일하게 어려운 점은 그냥 두는 것 — 자동화가 손대고 싶은 유혹을 없앤다."),
      concept("risk-management", "Match the target date to when you'll need the money; understand sequence-of-returns risk near the goal.", "목표 시점을 돈이 필요한 때에 맞추고, 목표 부근의 시퀀스 리스크를 이해하라."),
      concept("placing-your-first-trade", "The last mile: open and fund the account, choose a retirement wrapper (IRP/연금저축 or a target-date fund), and automate the contribution.", "마지막 단계: 계좌를 열고 자금을 넣고, 은퇴 계좌(IRP/연금저축 또는 타깃데이트 펀드)를 고른 뒤 자동 납입을 설정하기."),
    ],
    practical: "glide-path",
  },
  {
    // Defensive multi-asset: 60/40, All-Weather, permanent portfolio,
    // risk-parity-for-individuals. The low-anxiety home for the conservative
    // investor who wants more than equity-index but less than stock-picking.
    id: "diversified",
    rank: 3,
    riskRank: 3,
    label: { en: "Diversified / All-Weather", ko: "분산 / 올웨더" },
    blurb: {
      en: "Spread risk across stocks, bonds, real assets, and cash so no single environment can sink you — a calm, balanced core for the long run.",
      ko: "주식·채권·실물자산·현금에 위험을 분산해 어떤 국면에서도 무너지지 않게 한다 — 장기적으로 차분하고 균형 잡힌 핵심 전략.",
    },
    schools: ["quant", "macro"],
    steps: [
      concept("investing-basics", "New here? Start with the vocabulary: stock, bond, fund, index, and risk — the words every mix in this path is built from.", "여기가 처음인가요? 어휘부터: 주식·채권·펀드·지수·위험 — 이 경로의 모든 조합이 이 단어들로 이루어집니다."),
      guru("harry-markowitz", "The core idea: combining assets that don't move together lowers risk for the same return.", "핵심 아이디어: 함께 움직이지 않는 자산을 결합하면 같은 수익에서 위험이 낮아진다."),
      concept("asset-allocation", "The decision that dominates outcomes: your mix across stocks, bonds, and cash.", "결과를 좌우하는 결정: 주식·채권·현금 사이의 비중.", { en: "Asset Allocation & the Three-Fund Portfolio", ko: "자산배분 & 3-펀드 포트폴리오" }),
      concept("bonds-fixed-income", "The ballast: how bonds, duration, and the yield curve cushion equity drawdowns.", "안정판: 채권·듀레이션·수익률곡선이 주식 하락을 완충하는 방식.", { en: "Bonds & Fixed Income — The Portfolio's Ballast", ko: "채권 & 고정수익 — 포트폴리오의 안정판" }),
      guru("william-sharpe", "Risk-adjusted return: why a smoother ride (higher Sharpe) can beat a higher-octane one.", "위험조정 수익: 더 매끄러운 여정(높은 샤프 비율)이 고옥탄 전략을 이길 수 있는 이유."),
      guru("ray-dalio", "All-Weather: balance risk across growth × inflation environments, not just dollars.", "올웨더: 금액이 아니라 성장×인플레 국면에 위험을 균형 배분하기."),
      concept("risk-parity", "Balance by risk contribution, not dollars — the individual's version, kept simple.", "금액이 아니라 위험 기여도로 균형 잡기 — 개인을 위한 단순한 버전."),
      concept("dollar-cost-averaging", "Fund it steadily and rebalance on a schedule — the discipline that makes it work.", "꾸준히 납입하고 정기적으로 리밸런싱 — 이를 작동하게 하는 규율.", { en: "Rebalancing & Dollar-Cost Averaging", ko: "리밸런싱 & 분할 매수" }),
      concept("trading-psychology", "The payoff is behavioral: a calmer portfolio is one you'll actually stick with.", "보상은 행동에서 온다: 더 차분한 포트폴리오라야 실제로 끝까지 유지한다."),
      concept("placing-your-first-trade", "The last mile: open and fund the account, then buy each sleeve of the mix and set a rebalancing cadence.", "마지막 단계: 계좌를 열고 자금을 넣은 뒤, 조합의 각 자산을 매수하고 리밸런싱 주기를 정하기."),
    ],
    practical: "portfolio",
  },
  {
    id: "dividend-income",
    rank: 4,
    riskRank: 2,
    label: { en: "Dividend / Income", ko: "배당 / 인컴" },
    blurb: {
      en: "Hold durable companies that pay growing dividends, and let the reinvested cash compound.",
      ko: "성장하는 배당을 지급하는 견고한 기업을 보유하고, 재투자한 현금이 복리로 불어나게 한다.",
    },
    schools: ["fundamental"],
    steps: [
      concept("investing-basics", "First time investing? Start here: what a share, dividend, yield, and payout mean in plain language before we judge whether one is safe.", "투자가 처음인가요? 여기서 시작하세요: 배당이 안전한지 따지기 전에 주·배당·수익률·배당성향이 쉬운 말로 무엇인지부터."),
      guru("charles-dow", "The shared root: a stock is a claim on a real business, the premise income investing rests on.", "공통 뿌리: 주식은 실제 기업에 대한 청구권이며, 인컴 투자가 기대는 전제."),
      guru("benjamin-graham", "Foundation: income with safety, Mr. Market, and the margin of safety.", "기초: 안전마진을 갖춘 인컴, 미스터 마켓, 그리고 안전마진."),
      guru("john-burr-williams", "The theory that a stock is worth its discounted future dividends — the intellectual core of income.", "주식의 가치는 할인된 미래 배당의 합이라는 이론 — 인컴 투자의 지적 핵심."),
      concept("dividend-investing", "The practical mechanics: yield, payout ratio, coverage, DRIP compounding, aristocrats, and yield traps.", "실전 메커니즘: 배당수익률, 배당성향, 커버리지, DRIP 복리, 배당귀족, 그리고 고배당 함정.", { en: "Dividend Investing — Yield, Coverage & Compounding", ko: "배당 투자 — 수익률, 커버리지 & 복리" }),
      guru("geraldine-weiss", "The dividend specialist: using a stock's historical yield band to judge over/undervaluation.", "배당 전문가: 주식의 역사적 배당수익률 밴드로 고평가/저평가를 판단하기.", { en: "Geraldine Weiss — Dividend Yield Theory", ko: "제럴딘 와이스 — 배당수익률 이론" }),
      guru("peter-lynch", "Dividend-growth discipline and the warning against overpaying for an income stream.", "배당 성장의 규율, 그리고 인컴을 위해 과도한 가격을 치르지 말라는 경고."),
      guru("terry-smith", "Quality + durable moats: the engine behind sustainable, growing dividends (high ROCE, cash conversion).", "우량성 + 견고한 해자: 지속 가능하고 성장하는 배당의 엔진(높은 ROCE, 현금 전환)."),
      guru("pat-dorsey", "The moat checklist that separates a true aristocrat from a future dividend cut.", "진짜 배당귀족과 미래의 배당 삭감을 가르는 해자 체크리스트."),
      concept("risk-management", "Discipline against yield-chasing concentration; sizing to avoid ruin.", "고수익 추종형 집중에 맞서는 규율; 파산을 피하는 비중 조절."),
      concept("placing-your-first-trade", "The last mile: open and fund the account, buy the stock, and consider a DRIP so the dividends reinvest and compound automatically.", "마지막 단계: 계좌를 열고 자금을 넣고, 종목을 매수하고, 배당이 자동 재투자·복리되도록 DRIP을 고려하기."),
    ],
    practical: "company-dividend",
  },
  {
    id: "value",
    rank: 5,
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
    practical: "company-value",
  },
  {
    id: "growth",
    rank: 6,
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
    practical: "company-growth",
  },
  {
    id: "factor-quant",
    rank: 7,
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
    practical: "factor",
  },
  {
    id: "global-macro",
    rank: 11,
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
    practical: "macro",
  },
  {
    id: "trend-momentum",
    rank: 12,
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
      concept("trading-psychology", "Why momentum exists behaviorally — and why traders break trend discipline.", "모멘텀이 행동학적으로 존재하는 이유 — 그리고 트레이더가 추세 규율을 어기는 이유."),
    ],
    practical: "trend-backtest",
  },
  {
    id: "event-driven",
    rank: 9,
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
    practical: "deal",
  },
  {
    // Tangible/real-asset exposure for income + inflation protection, reached by
    // most individuals through REITs (and REIT funds) rather than direct property.
    id: "real-assets",
    rank: 8,
    riskRank: 4,
    label: { en: "Real Assets / REITs", ko: "실물자산 / 리츠" },
    blurb: {
      en: "Own income-producing real things — real estate (via REITs), and inflation hedges — for yield and diversification that doesn't move in lockstep with stocks.",
      ko: "수익을 내는 실물 — 부동산(리츠를 통해)과 인플레이션 헤지 자산 — 을 보유해, 주식과 똑같이 움직이지 않는 수익과 분산을 얻는다.",
    },
    schools: ["fundamental", "macro"],
    steps: [
      concept("real-assets-reits", "The core: what a REIT is, how it must pay out income, and direct property vs. REIT funds.", "핵심: 리츠란 무엇인가, 왜 수익을 의무적으로 배당하는가, 그리고 직접 부동산 vs. 리츠 펀드.", { en: "Real Assets & REITs — Owning Income-Producing Things", ko: "실물자산 & 리츠 — 수익을 내는 자산 보유하기" }),
      concept("asset-allocation", "Where it fits: real assets as a diversifying sleeve alongside stocks and bonds.", "배치: 주식·채권 옆에 분산용으로 두는 실물자산 비중.", { en: "Asset Allocation with Real Assets", ko: "실물자산을 포함한 자산배분" }),
      concept("dividend-investing", "How to read the yield: payout discipline, coverage, and REIT-specific metrics (FFO).", "수익률 읽는 법: 배당 규율, 커버리지, 그리고 리츠 고유 지표(FFO).", { en: "Reading REIT Yield & Coverage", ko: "리츠 수익률 & 커버리지 읽기" }),
      guru("geraldine-weiss", "Yield-band discipline applies to income real assets too: cheap vs. dear by historical yield.", "수익률 밴드 규율은 인컴형 실물자산에도 적용된다: 역사적 수익률로 본 저평가 vs. 고평가."),
      concept("the-business-cycle", "Why rates and the cycle matter: real assets are sensitive to inflation and interest rates.", "왜 금리와 사이클이 중요한가: 실물자산은 인플레이션과 금리에 민감하다.", { en: "Real Assets, Rates & Inflation", ko: "실물자산·금리·인플레이션" }),
      guru("ray-dalio", "Real assets in an all-weather frame: the inflation-up quadrant they're meant to protect.", "올웨더 관점의 실물자산: 이들이 방어하려는 '인플레이션 상승' 사분면."),
      concept("risk-management", "The honest risks: illiquidity, leverage, concentration, and rate sensitivity.", "솔직한 위험: 비유동성, 레버리지, 집중, 그리고 금리 민감도."),
    ],
    practical: "company-reit",
  },
  {
    // Selling option premium on shares you own (covered calls) or cash you set
    // aside (cash-secured puts / the wheel). A defined-risk income overlay —
    // distinct from dividend (earnings cash) and from active trading (speculation).
    id: "options-income",
    rank: 10,
    riskRank: 6,
    label: { en: "Options Income", ko: "옵션 인컴" },
    blurb: {
      en: "Earn steady premium by selling covered calls and cash-secured puts on assets you'd be happy to own — income with capped upside, not leveraged speculation.",
      ko: "기꺼이 보유할 자산에 커버드콜과 현금담보풋을 매도해 꾸준한 프리미엄을 번다 — 상승은 제한되지만 레버리지 투기가 아닌 인컴.",
    },
    schools: ["technical", "quant"],
    steps: [
      concept("risk-management", "Start here: options multiply both ways — sizing and defined risk come before any premium.", "여기서 시작: 옵션은 양방향으로 증폭된다 — 프리미엄보다 사이징과 정의된 위험이 먼저다."),
      concept("options-basics", "The instrument: calls, puts, strikes, expiry, and what assignment actually means.", "도구: 콜·풋·행사가·만기, 그리고 배정이 실제로 의미하는 것.", { en: "Options 101 — Calls, Puts & Assignment", ko: "옵션 입문 — 콜·풋·배정" }),
      guru("edward-thorp", "Edge, hedge, and size: the quantitative mindset behind selling priced risk for income.", "엣지·헤지·사이징: 가격이 매겨진 위험을 인컴을 위해 파는 정량적 사고방식."),
      concept("covered-calls-wheel", "The core engine: covered calls, cash-secured puts, and the wheel — and their honest tradeoffs.", "핵심 엔진: 커버드콜, 현금담보풋, 그리고 휠 — 그리고 그 솔직한 트레이드오프.", { en: "Covered Calls, Cash-Secured Puts & the Wheel", ko: "커버드콜·현금담보풋·휠" }),
      guru("emanuel-derman", "What you're really selling: implied volatility — and why the model is a metaphor, not the truth.", "당신이 실제로 파는 것: 내재변동성 — 그리고 모델은 진리가 아니라 은유라는 점."),
      concept("dividend-investing", "Pairs naturally with quality, dividend-paying holdings you're glad to keep if assigned.", "배정되어도 기꺼이 보유할 우량 배당주와 자연스럽게 어울린다.", { en: "Quality Holdings for an Income Overlay", ko: "인컴 오버레이를 위한 우량 보유" }),
      concept("trading-psychology", "The trap: capping upside and chasing premium into assets you don't actually want.", "함정: 상승을 막고, 실제로는 원치 않는 자산까지 프리미엄을 좇는 것."),
    ],
    practical: "options",
  },
  {
    // Merged technical-trading identity. Swing and day trading are holding-period
    // horizons of one discipline, not separate strategies — this path teaches the
    // swing core first, then escalates to the intraday (day-trading) reality check
    // and microstructure as the highest-risk capstone.
    id: "active-trading",
    rank: 13,
    riskRank: 10,
    label: { en: "Active Technical Trading", ko: "능동적 기술적 트레이딩" },
    blurb: {
      en: "Trade technical setups over days (swing) down to intraday (day trading) — the highest-effort, highest-risk path. Most who go intraday lose money; learn the reality first.",
      ko: "며칠 단위(스윙)부터 일중(데이 트레이딩)까지 기술적 셋업을 매매한다 — 가장 노력이 많이 들고 가장 위험한 길. 일중 매매에 뛰어든 대부분은 손실을 본다; 현실부터 배우라.",
    },
    schools: ["technical"],
    steps: [
      guru("charles-dow", "Foundation: trend definition and confirmation — the grammar every setup is written in.", "기초: 추세 정의와 확인 — 모든 셋업이 쓰여지는 문법."),
      concept("support-resistance-patterns", "The levels you buy, stop, and target against; where a trade begins and ends.", "매수·손절·목표의 기준 레벨; 매매가 시작되고 끝나는 곳."),
      concept("candlestick-patterns", "Entry-timing grammar: the precise bar to act on at a level.", "진입 타이밍의 문법: 레벨에서 행동할 정확한 봉."),
      guru("steve-nison", "The master of candlesticks: reading engulfings, hammers, and stars at pivots.", "캔들차트의 거장: 변곡점에서 장악형·해머·별형 읽기."),
      concept("volume-obv", "Volume confirms breakouts vs. traps and validates the move you'll ride.", "거래량은 브레이크아웃과 함정을 구분하고, 탈 움직임을 검증한다."),
      concept("moving-averages", "The trend filter and dynamic support that say which trades are with the tide.", "어떤 매매가 큰 흐름과 같은 편인지 알려주는 추세 필터이자 동적 지지선."),
      concept("rsi", "Overbought/oversold and momentum for timing pullback entries and exits into strength.", "과매수/과매도와 모멘텀으로 눌림목 진입과 강세 청산의 타이밍을 잡기."),
      concept("macd", "Momentum and trend-shift confirmation, plus divergence — a core oscillator.", "모멘텀과 추세 전환 확인, 그리고 다이버전스 — 핵심 오실레이터."),
      concept("bollinger-bands", "The volatility envelope: squeezes precede moves; band-walk vs. reversion.", "변동성 밴드: 수축은 움직임을 예고한다; 밴드 워킹 vs. 회귀."),
      concept("adx-atr", "Regime filter (ADX) and volatility-based stop/target sizing (ATR).", "국면 필터(ADX)와 변동성 기반 손절/목표 사이징(ATR)."),
      guru("welles-wilder", "The originator of RSI, ADX, and ATR — consolidating the indicator toolkit.", "RSI·ADX·ATR의 창시자 — 지표 도구함을 통합한다."),
      guru("richard-wyckoff", "Accumulation/distribution and the composite operator: who is on the other side.", "매집/분산과 컴포지트 오퍼레이터: 반대편에 누가 있는가."),
      guru("linda-raschke", "The model short-term playbook: regime-reading and concrete, codeable setups.", "모범 단기 플레이북: 국면 읽기와 코드화 가능한 구체적 셋업."),
      guru("alan-farley", "The Master Swing Trader: Pattern Cycles, signal convergence, capital preservation first.", "마스터 스윙 트레이더: 패턴 사이클, 신호 수렴, 자본 보존 우선."),
      concept("swing-trading-playbook", "The swing capstone: a repeatable scan → setup → entry → stop → target → manage workflow.", "스윙의 정점: 반복 가능한 스캔 → 셋업 → 진입 → 손절 → 목표 → 관리 워크플로우.", { en: "The Swing Trading Playbook: Entries, Stops & Targets", ko: "스윙 트레이딩 플레이북: 진입·손절·목표" }),
      concept("day-trading-reality-check", "Before going intraday, read this: the odds, the cost drag, the leverage danger, and why ~90% lose money.", "일중 매매에 뛰어들기 전에 읽어라: 확률, 비용 부담, 레버리지 위험, 그리고 약 90%가 손실을 보는 이유.", { en: "Day Trading Reality Check — The Odds & The Costs", ko: "데이 트레이딩 현실 점검 — 확률과 비용" }),
      guru("jesse-livermore", "The original tape reader — and the original cautionary tale about discipline.", "원조 테이프 리더 — 그리고 규율에 관한 원조 경고담."),
      guru("larry-williams", "Short-term timing systems: %R, volatility breakouts — canonical intraday methodology.", "단기 타이밍 시스템: %R, 변동성 돌파 — 전형적인 일중 방법론."),
      guru("michael-huddleston", "Modern microstructure: liquidity, order blocks, stop-runs — last, and with healthy skepticism.", "현대 미시구조: 유동성, 오더블록, 스톱런 — 마지막에, 건강한 회의와 함께."),
      concept("risk-management", "Position sizing, stops, R-multiples, daily max-loss — the only reason a minority survive.", "비중 조절, 손절, R-멀티플, 일일 최대손실 — 소수가 살아남는 유일한 이유."),
      concept("trading-psychology", "Discipline over analysis: overtrading, revenge trading, and tilt are what actually wreck traders.", "분석보다 규율: 과매매, 복수 매매, 틸트가 트레이더를 실제로 무너뜨린다."),
    ],
    practical: "active-trading",
  },
];

export function getStrategy(id: string): Strategy | null {
  return STRATEGIES.find((s) => s.id === id) ?? null;
}

export function isStrategyId(x: string): boolean {
  return STRATEGIES.some((s) => s.id === x);
}

/** A lesson's position within a strategy's ordered path, plus its neighbours in
 *  THAT path (not the global biographical order). Returns null if the strategy
 *  is unknown or the (kind, slug) isn't a step in it. Powers the "Step N of M
 *  in <strategy>" nav so Prev/Next follow the path the learner actually chose. */
export interface StrategyPlacement {
  strategyId: string;
  strategyLabel: Record<Locale, string>;
  index: number; // 0-based position in the step list
  total: number; // number of steps
  prev: PathStep | null;
  next: PathStep | null;
  /** True once the learner is on the last step — the practical lab comes next. */
  atLastStep: boolean;
  hasPractical: boolean;
}

export function placeInStrategy(
  strategyId: string,
  kind: LessonKind,
  slug: string,
): StrategyPlacement | null {
  const strategy = getStrategy(strategyId);
  if (!strategy) return null;
  const i = strategy.steps.findIndex(
    (s) => s.kind === kind && s.slug === slug,
  );
  if (i === -1) return null;
  return {
    strategyId: strategy.id,
    strategyLabel: strategy.label,
    index: i,
    total: strategy.steps.length,
    prev: i > 0 ? strategy.steps[i - 1] : null,
    next: i < strategy.steps.length - 1 ? strategy.steps[i + 1] : null,
    atLastStep: i === strategy.steps.length - 1,
    hasPractical: Boolean(strategy.practical),
  };
}

/** Risk badge label for a strategy's riskRank. */
export function riskLabel(riskRank: number): Record<Locale, string> {
  if (riskRank <= 2) return { en: "Lower risk", ko: "낮은 위험" };
  if (riskRank <= 5) return { en: "Moderate risk", ko: "중간 위험" };
  if (riskRank <= 8) return { en: "Higher risk", ko: "높은 위험" };
  return { en: "Very high risk", ko: "매우 높은 위험" };
}
