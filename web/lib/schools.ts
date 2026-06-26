// The investment-school taxonomy: School → sub-strategy.
//
// This is metadata only (ids, bilingual labels, blurbs, ordering). Each lesson
// declares which school + strategy it belongs to via its frontmatter
// (`school` / `strategy`), so the /schools pages group lessons by frontmatter
// and use this file purely for labels, descriptions, and display order. That
// keeps a single source of truth for membership (the lessons themselves) and
// avoids maintaining parallel slug lists here.

import type { Locale } from "./i18n";

export const SCHOOL_IDS = [
  "technical",
  "fundamental",
  "quant",
  "macro",
] as const;
export type SchoolId = (typeof SCHOOL_IDS)[number];

export function isSchoolId(x: string): x is SchoolId {
  return (SCHOOL_IDS as readonly string[]).includes(x);
}

export interface Strategy {
  id: string;
  order: number;
  label: Record<Locale, string>;
  blurb: Record<Locale, string>;
}

export interface School {
  id: SchoolId;
  order: number;
  label: Record<Locale, string>;
  tagline: Record<Locale, string>;
  strategies: Strategy[];
}

export const SCHOOLS: Record<SchoolId, School> = {
  technical: {
    id: "technical",
    order: 1,
    label: { en: "Technical", ko: "기술적 분석" },
    tagline: {
      en: "Read price and volume directly — trends, patterns, and the crowd's psychology on the chart.",
      ko: "가격과 거래량을 직접 읽는다 — 추세, 패턴, 그리고 차트에 드러난 군중 심리.",
    },
    strategies: [
      {
        id: "foundations",
        order: 1,
        label: { en: "Foundations", ko: "기초 이론" },
        blurb: {
          en: "The grammar of the chart: trend, confirmation, and market phases.",
          ko: "차트의 문법: 추세, 확인, 그리고 시장 국면.",
        },
      },
      {
        id: "tape-price-action",
        order: 2,
        label: { en: "Tape & Price Action", ko: "테이프 & 가격 행동" },
        blurb: {
          en: "Reading raw price and the order flow behind it — the original day traders.",
          ko: "순수한 가격과 그 뒤의 주문 흐름을 읽기 — 원조 데이 트레이더들.",
        },
      },
      {
        id: "waves-cycles",
        order: 3,
        label: { en: "Waves & Cycles", ko: "파동 & 주기" },
        blurb: {
          en: "Markets as repeating geometric and time-based structures.",
          ko: "반복되는 기하학적·시간 기반 구조로서의 시장.",
        },
      },
      {
        id: "charting-patterns",
        order: 4,
        label: { en: "Charting & Patterns", ko: "차트 & 패턴" },
        blurb: {
          en: "Classic chart shapes and the setups built on them.",
          ko: "고전적인 차트 형태와 그 위에 세워진 셋업.",
        },
      },
      {
        id: "indicators",
        order: 5,
        label: { en: "Indicator Pioneers", ko: "지표 개척자" },
        blurb: {
          en: "The inventors of the oscillators and bands traders use daily.",
          ko: "트레이더가 매일 쓰는 오실레이터와 밴드를 만든 사람들.",
        },
      },
      {
        id: "candlesticks",
        order: 6,
        label: { en: "Candlesticks", ko: "캔들차트" },
        blurb: {
          en: "The Japanese visual language of price.",
          ko: "가격을 표현하는 일본의 시각적 언어.",
        },
      },
      {
        id: "trend-stage",
        order: 7,
        label: { en: "Trend & Stage Analysis", ko: "추세 & 국면 분석" },
        blurb: {
          en: "Following the primary trend through its life-cycle stages.",
          ko: "주요 추세를 생애 주기 국면을 통해 추종하기.",
        },
      },
      {
        id: "growth-momentum",
        order: 8,
        label: { en: "Growth & Momentum", ko: "성장 & 모멘텀" },
        blurb: {
          en: "Buying strength: leading stocks in powerful uptrends.",
          ko: "강세를 사기: 강력한 상승 추세의 주도주.",
        },
      },
      {
        id: "short-term-systems",
        order: 9,
        label: { en: "Short-Term & Systems", ko: "단기 & 시스템" },
        blurb: {
          en: "Rules, timing, and the discipline of short-term trading.",
          ko: "규칙, 타이밍, 그리고 단기 매매의 규율.",
        },
      },
      {
        id: "modern-microstructure",
        order: 10,
        label: { en: "Modern Price Action", ko: "현대 가격 행동" },
        blurb: {
          en: "Liquidity, market structure, and the modern institutional lens.",
          ko: "유동성, 시장 구조, 그리고 현대 기관의 관점.",
        },
      },
    ],
  },

  fundamental: {
    id: "fundamental",
    order: 2,
    label: { en: "Fundamental", ko: "기본적 분석" },
    tagline: {
      en: "Value a business, then let price come to you — intrinsic value, quality, and a margin of safety.",
      ko: "기업의 가치를 평가하고 가격이 다가오기를 기다린다 — 내재가치, 우량성, 그리고 안전마진.",
    },
    strategies: [
      {
        id: "canon",
        order: 1,
        label: { en: "The Foundational Canon", ko: "정통 고전" },
        blurb: {
          en: "Intrinsic value, Mr. Market, and the discipline value investing was built on.",
          ko: "내재가치, 미스터 마켓, 그리고 가치투자가 세워진 규율.",
        },
      },
      {
        id: "value-special-situations",
        order: 2,
        label: { en: "Value & Special Situations", ko: "가치 & 특수 상황" },
        blurb: {
          en: "Deep value, distress, spin-offs, and margin-of-safety extremes.",
          ko: "딥 밸류, 부실, 스핀오프, 그리고 극단적 안전마진.",
        },
      },
      {
        id: "growth-quality-valuation",
        order: 3,
        label: { en: "Growth, Quality & Valuation", ko: "성장·우량·가치평가" },
        blurb: {
          en: "GARP, economic moats, quality compounding, and the DCF toolkit.",
          ko: "GARP, 경제적 해자, 우량 복리, 그리고 DCF 도구.",
        },
      },
    ],
  },

  quant: {
    id: "quant",
    order: 3,
    label: { en: "Quantitative", ko: "퀀트" },
    tagline: {
      en: "Let the math and the data decide — portfolios, factors, and systematic edge at scale.",
      ko: "수학과 데이터가 결정하게 한다 — 포트폴리오, 팩터, 그리고 대규모 시스템적 우위.",
    },
    strategies: [
      {
        id: "academic-foundations",
        order: 1,
        label: { en: "Academic Foundations", ko: "학문적 기초" },
        blurb: {
          en: "Portfolio theory, CAPM, market efficiency, and option pricing.",
          ko: "포트폴리오 이론, CAPM, 시장 효율성, 그리고 옵션 가격결정.",
        },
      },
      {
        id: "systematic-practitioners",
        order: 2,
        label: { en: "Systematic Practitioners", ko: "시스템 실무가" },
        blurb: {
          en: "Edge + hedge + bet-sizing — the legends who proved math beats the market.",
          ko: "우위 + 헤지 + 베팅 크기 — 수학이 시장을 이긴다는 것을 증명한 전설들.",
        },
      },
      {
        id: "factors-risk",
        order: 3,
        label: { en: "Factors & Risk", ko: "팩터 & 리스크" },
        blurb: {
          en: "Momentum, the breadth of bets, risk parity, and adaptive markets.",
          ko: "모멘텀, 베팅의 폭, 리스크 패리티, 그리고 적응적 시장.",
        },
      },
      {
        id: "modern-ml",
        order: 4,
        label: { en: "Modern ML & Model Risk", ko: "현대 ML & 모델 리스크" },
        blurb: {
          en: "Machine learning for markets — and the discipline that stops it overfitting.",
          ko: "시장을 위한 머신러닝 — 그리고 과적합을 막는 규율.",
        },
      },
    ],
  },

  macro: {
    id: "macro",
    order: 4,
    label: { en: "Global Macro", ko: "글로벌 매크로" },
    tagline: {
      en: "Trade the big picture — currencies, rates, commodities, cycles, and policy regimes.",
      ko: "큰 그림을 거래한다 — 통화, 금리, 원자재, 경기 순환, 그리고 정책 국면.",
    },
    strategies: [
      {
        id: "legendary-traders",
        order: 1,
        label: { en: "The Legendary Traders", ko: "전설적 트레이더" },
        blurb: {
          en: "Reflexivity, conviction sizing, and asymmetric risk — the practitioner canon.",
          ko: "재귀성, 확신에 찬 베팅 크기, 그리고 비대칭 리스크 — 실무가의 정통.",
        },
      },
      {
        id: "modern-practitioners",
        order: 2,
        label: { en: "Modern Practitioners & Educators", ko: "현대 실무가 & 교육자" },
        blurb: {
          en: "Debt cycles, tail-risk bets, contrarianism, and macro as education.",
          ko: "부채 사이클, 꼬리위험 베팅, 역발상, 그리고 교육으로서의 매크로.",
        },
      },
      {
        id: "framework-economists",
        order: 3,
        label: { en: "Framework Economists", ko: "프레임워크 경제학자" },
        blurb: {
          en: "Animal spirits and financial instability — the intellectual spine of macro.",
          ko: "야성적 충동과 금융 불안정성 — 매크로의 지적 뼈대.",
        },
      },
    ],
  },
};

export const SCHOOL_LIST: School[] = Object.values(SCHOOLS).sort(
  (a, b) => a.order - b.order,
);

export function getSchool(id: string): School | null {
  return isSchoolId(id) ? SCHOOLS[id] : null;
}

/** Strategy metadata for a (school, strategy) pair, or null if unknown. */
export function getStrategy(
  school: string,
  strategy: string,
): Strategy | null {
  return getSchool(school)?.strategies.find((s) => s.id === strategy) ?? null;
}
