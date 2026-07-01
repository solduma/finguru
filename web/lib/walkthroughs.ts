// Guided walkthroughs (실습) — the教육 layer that sits ON TOP of the analyzer
// tools. Where an Analyzer (components/practicals/*Lab.tsx) is a calculator, a
// walkthrough teaches the whole loop: which data to pull, from which source and
// WHY, how to fetch it, how to compute and read it, how to turn it into an
// investment judgment, and what to conclude + do next.
//
// Each walkthrough is a short ordered list of steps. One step embeds the
// strategy's analyzer tool (kind: "tool"); the others are teaching, prompts,
// and a final checklist. Content is bilingual (EN/KO) and kept here — out of
// the main i18n Dict — so it can grow without bloating every page's strings.

import type { Locale } from "./i18n";
import type { LabId } from "./practicals";

/** A localized string pair. */
export interface L {
  en: string;
  ko: string;
}

export type StepKind =
  // Plain teaching prose (may include a bullet list).
  | "read"
  // A data-source callout: what to pull, from where, and why that source.
  | "source"
  // Embed the strategy's analyzer tool here; the learner runs it live.
  | "tool"
  // A reflection prompt — the learner writes/decides something (free text).
  | "judge"
  // The closing step: a takeaway + a concrete next-action checklist.
  | "conclude";

export interface SourceRef {
  name: L; // "OpenDART", "SEC EDGAR", …
  what: L; // what you pull from it
  why: L; // why this is the right source
  url: string; // where to see it yourself
}

export interface WalkStep {
  kind: StepKind;
  title: L;
  body: L; // markdown-ish; "\n- " starts bullets (rendered by the shell)
  sources?: SourceRef[]; // for kind: "source"
  prompt?: L; // for kind: "judge" — the question posed
  checklist?: L[]; // for kind: "conclude"
}

export interface Walkthrough {
  labId: LabId;
  /** Headline shown above the stepper. */
  title: L;
  /** One-line framing of what the learner will end up deciding. */
  goal: L;
  steps: WalkStep[];
}

/** Pick the locale side of an L. */
export function pick(l: L, locale: Locale): string {
  return locale === "ko" ? l.ko : l.en;
}

// ---------------------------------------------------------------------------
// Growth investing (pilot) — reuses the CompanyLab growth analyzer.
// ---------------------------------------------------------------------------

const growth: Walkthrough = {
  labId: "company-growth",
  title: {
    en: "Is this a quality growth company — at a sane price?",
    ko: "이 회사는 좋은 성장주인가 — 합리적인 가격에?",
  },
  goal: {
    en: "By the end you'll have pulled a real company's fundamentals, judged whether its growth is real and fundable, checked what you're paying for it, and written down a buy / watch / pass call with reasons.",
    ko: "끝까지 따라가면 실제 기업의 재무 데이터를 직접 가져와, 성장이 진짜이고 지속 가능한지 판단하고, 그 성장에 얼마를 지불하는지 확인한 뒤, 이유와 함께 매수/관망/보류 결론을 적게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: {
        en: "What we're actually deciding",
        ko: "우리가 실제로 결정하려는 것",
      },
      body: {
        en: "Growth investing (GARP — growth at a reasonable price) isn't \"buy what's going up.\" It's three questions in order: (1) Is the growth **real** — are sales and profits actually rising? (2) Is it **quality and fundable** — good margins, decent ROE, cash to back the earnings, not just debt? (3) Is the **price sane** relative to that growth (PEG)? We'll answer each with one number you pull yourself, then combine them into a call.\n- Real → revenue & EPS trend\n- Quality → net margin, ROE, FCF conversion, sustainable growth\n- Price → P/E and PEG",
        ko: "성장투자(GARP — 합리적 가격의 성장주)는 \"오르는 걸 산다\"가 아닙니다. 순서가 있는 세 질문입니다: (1) 성장이 **진짜**인가 — 매출과 이익이 실제로 늘고 있는가? (2) **우량하고 지속 가능**한가 — 마진·ROE가 괜찮고, 부채가 아니라 현금이 이익을 뒷받침하는가? (3) 그 성장 대비 **가격이 합리적**인가(PEG)? 각 질문을 당신이 직접 가져온 숫자 하나로 답하고, 이를 합쳐 결론을 냅니다.\n- 진짜 → 매출·EPS 추세\n- 우량 → 순이익률, ROE, FCF 전환율, 지속가능성장률\n- 가격 → PER과 PEG",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터는 어디서 오는가" },
      body: {
        en: "You never take a number on faith — you pull it from the primary filing and can click through to verify. For a US name we read SEC EDGAR; for a Korean name, OpenDART. The current price comes from a live quote; analyst forward growth (US) from FMP, and for Korea we fall back to the past-EPS trend (no free forward consensus).",
        ko: "숫자를 그냥 믿지 않습니다 — 원본 공시에서 직접 가져오고, 클릭해 확인할 수 있습니다. 미국 종목은 SEC EDGAR, 한국 종목은 OpenDART에서 읽습니다. 현재가는 실시간 시세, 애널리스트 선행 성장률은 미국은 FMP에서, 한국은 (무료 선행 컨센서스가 없어) 과거 EPS 추세로 대체합니다.",
      },
      sources: [
        {
          name: { en: "OpenDART", ko: "OpenDART (전자공시)" },
          what: {
            en: "Korean issuers' audited annual financials (revenue, profit, equity, cash flows).",
            ko: "한국 상장사의 감사받은 연간 재무제표(매출·이익·자본·현금흐름).",
          },
          why: {
            en: "It's the official regulatory filing system — the same statements the company is legally bound to.",
            ko: "법정 공시 시스템입니다 — 회사가 법적으로 책임지는 바로 그 재무제표입니다.",
          },
          url: "https://dart.fss.or.kr",
        },
        {
          name: { en: "SEC EDGAR", ko: "SEC EDGAR" },
          what: {
            en: "US issuers' 10-K XBRL fundamentals.",
            ko: "미국 상장사의 10-K XBRL 재무 데이터.",
          },
          why: {
            en: "The US regulator's primary filing store — no vendor in between.",
            ko: "미국 규제당국의 1차 공시 저장소 — 중간 벤더가 없습니다.",
          },
          url: "https://www.sec.gov/edgar",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull the company yourself", ko: "직접 회사를 조회하라" },
      body: {
        en: "Use the analyzer below. Enter a ticker (try a name you actually care about) and market — for Korea, keep the basis on **연결(consolidated)** unless you're analyzing a holding company. Read the numbers off the scorecard; we'll interpret them in the next steps. Note the revenue trend, EPS trend, PEG, ROE, net margin, and FCF conversion.",
        ko: "아래 분석 도구를 사용하세요. 종목 코드(관심 있는 실제 종목으로 해보세요)와 시장을 입력하고 — 한국은 지주회사가 아니면 기준을 **연결**로 두세요. 스코어카드의 숫자를 읽으면 다음 단계에서 해석합니다. 매출 추세, EPS 추세, PEG, ROE, 순이익률, FCF 전환율을 메모해 두세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — is the growth real?", ko: "1단계 — 성장이 진짜인가?" },
      body: {
        en: "Look at **revenue trend** and **EPS trend** side by side.\n- Both rising → clean growth story.\n- Revenue up but EPS flat/down → growth isn't reaching the bottom line (margin pressure, dilution, one-offs). This is the trap the analyzer is built to expose: a 2-point EPS shortcut can read ~0% even while sales compound double-digits, so we use a trend that uses every year.\n- Both falling → not a growth candidate; stop here.\nWrite down: is this real top-line growth, and is it flowing through to per-share earnings?",
        ko: "**매출 추세**와 **EPS 추세**를 나란히 보세요.\n- 둘 다 상승 → 깔끔한 성장 스토리.\n- 매출은 오르는데 EPS가 정체/하락 → 성장이 최종 이익까지 못 옵니다(마진 압박, 희석, 일회성). 이게 분석 도구가 드러내려는 함정입니다: 2점 방식은 매출이 두 자릿수로 늘어도 EPS를 ~0%로 읽을 수 있어, 모든 연도를 쓰는 추세를 사용합니다.\n- 둘 다 하락 → 성장주 후보 아님, 여기서 멈추세요.\n메모: 이게 진짜 매출 성장이며, 주당이익까지 흐르고 있는가?",
      },
    },
    {
      kind: "read",
      title: {
        en: "Step 2 — is it quality, and can it fund the growth?",
        ko: "2단계 — 우량하며, 성장을 감당할 수 있는가?",
      },
      body: {
        en: "Three quality gates:\n- **Net margin** — does it keep a healthy slice of each sale? Rising or stable is good.\n- **ROE** — is it compounding shareholder capital efficiently? Very roughly, sustained 15%+ is strong; single digits is weak.\n- **FCF conversion** (FCF ÷ net income) — do the profits show up as cash? Well under ~80% year after year means the \"earnings\" aren't turning into cash — a red flag.\nThen the **sustainable growth rate** (ROE × retention) tells you the growth the company can fund from its own retained earnings — if reported growth runs far above SGR, it's leaning on debt or dilution.",
        ko: "우량성 관문 세 가지:\n- **순이익률** — 매출에서 건강한 몫을 남기는가? 상승·유지면 좋음.\n- **ROE** — 주주 자본을 효율적으로 불리는가? 아주 대략, 15% 이상 지속이면 강함, 한 자릿수는 약함.\n- **FCF 전환율**(FCF ÷ 순이익) — 이익이 현금으로 잡히는가? 매년 ~80%를 크게 밑돌면 \"이익\"이 현금이 안 되는 것 — 경고 신호.\n그리고 **지속가능성장률**(ROE × 유보율)은 회사가 자체 유보이익으로 감당 가능한 성장을 알려줍니다 — 보고 성장률이 SGR을 크게 웃돌면 부채나 증자에 기대는 것입니다.",
      },
    },
    {
      kind: "read",
      title: {
        en: "Step 3 — are you paying a sane price?",
        ko: "3단계 — 합리적인 가격을 내고 있는가?",
      },
      body: {
        en: "Now the price. **P/E** alone can't compare a fast grower to a slow one — **PEG** (P/E ÷ growth%) does. Rules of thumb: PEG around 1 is roughly fair, well under 1 may be cheap, well over ~2 means you're paying up for growth. Two cautions the analyzer bakes in: (1) a forward-consensus PEG and a past-trend PEG are different claims — check the label; (2) for Korean names the \"1 = fair\" line doesn't transfer cleanly (Korea discount), so compare against Korean peers, not a fixed number.",
        ko: "이제 가격입니다. **PER** 하나로는 빠른 성장주와 느린 성장주를 비교할 수 없지만 **PEG**(PER ÷ 성장률%)는 가능합니다. 경험칙: PEG 1 근처면 대체로 적정, 1을 크게 밑돌면 저렴할 수 있고, ~2를 크게 넘으면 성장에 비싸게 지불하는 것. 분석 도구가 내장한 두 가지 주의: (1) 선행 컨센서스 PEG와 과거 추세 PEG는 다른 주장 — 라벨을 확인; (2) 한국 종목은 \"1=적정\" 기준이 그대로 통하지 않으니(코리아 디스카운트) 고정 숫자가 아니라 국내 동종과 비교하세요.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Combine the three answers. A buy-worthy GARP name usually clears all three: real growth, quality/fundable, sane price. One failing gate isn't automatically a pass/fail — but name which gate failed and whether it's a dealbreaker for you.",
        ko: "세 답을 합치세요. 매수할 만한 GARP 종목은 대개 세 관문을 다 통과합니다: 진짜 성장, 우량·지속 가능, 합리적 가격. 관문 하나 탈락이 자동으로 결론을 정하진 않지만 — 어느 관문이 왜 탈락했고, 그게 당신에게 결정적인지 적으세요.",
      },
      prompt: {
        en: "Growth real? Quality/fundable? Price sane? → Your call: BUY / WATCH / PASS, and the single biggest reason.",
        ko: "성장 진짜? 우량·지속 가능? 가격 합리적? → 결론: 매수 / 관망 / 보류, 그리고 가장 큰 이유 하나.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론 & 다음 행동" },
      body: {
        en: "You just ran the full loop on real data — not a memorized ratio, but source → fetch → compute → judge. That's repeatable for any name. Before you act on it for real, run this checklist.",
        ko: "방금 실제 데이터로 전체 흐름을 돌렸습니다 — 외운 지표가 아니라 소스 → 조회 → 계산 → 판단. 어떤 종목에도 반복 가능합니다. 실제로 행동에 옮기기 전에 이 체크리스트를 확인하세요.",
      },
      checklist: [
        {
          en: "I clicked through to the primary filing (DART/EDGAR) and the headline numbers matched.",
          ko: "원본 공시(DART/EDGAR)까지 클릭해 들어가 핵심 숫자가 일치함을 확인했다.",
        },
        {
          en: "I know whether my growth number is forward (analyst) or past-trend, and I didn't treat them as the same.",
          ko: "내 성장률이 선행(애널리스트)인지 과거 추세인지 알고, 둘을 같은 것으로 취급하지 않았다.",
        },
        {
          en: "I checked at least one Korean/US peer's PEG so I'm comparing, not trusting a fixed \"1.\"",
          ko: "동종 종목 하나 이상의 PEG를 확인해, 고정된 \"1\"을 믿는 게 아니라 비교했다.",
        },
        {
          en: "I identified the one thing that would change my mind (a broken quality gate, a price re-rating).",
          ko: "내 생각을 바꿀 단 하나의 요인(우량성 관문 붕괴, 가격 재평가)을 정했다.",
        },
        {
          en: "This is my hypothesis to test further — not a recommendation to act on blindly.",
          ko: "이건 더 검증할 나의 가설이지, 맹목적으로 따를 추천이 아니다.",
        },
      ],
    },
  ],
};

// ===========================================================================
// The remaining twelve walkthroughs live in ./walkthroughs.data — split out to
// keep this file (the model + pilot) readable. They follow the exact same
// WalkStep shape.
// ===========================================================================
import {
  dividend,
  value,
  reit,
  portfolio,
  costDrag,
  glidePath,
  trend,
  active,
  macro,
  options,
  factor,
  deal,
} from "./walkthroughs.data";

export const WALKTHROUGHS: Partial<Record<LabId, Walkthrough>> = {
  "company-growth": growth,
  "company-dividend": dividend,
  "company-value": value,
  "company-reit": reit,
  portfolio,
  "cost-drag": costDrag,
  "glide-path": glidePath,
  "trend-backtest": trend,
  "active-trading": active,
  macro,
  options,
  factor,
  deal,
};

export function getWalkthrough(labId: LabId): Walkthrough | null {
  return WALKTHROUGHS[labId] ?? null;
}
