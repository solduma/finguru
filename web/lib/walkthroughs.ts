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
import { DART_SHOT, EDGAR_STEPS } from "./walkthroughs.shots";

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

/** One annotated hotspot on a source screenshot: a numbered marker anchored at
 *  (x,y) as PERCENTAGES of the image, optionally boxing a region (w,h in %).
 *  Percentages keep the overlay aligned at any rendered width. */
export interface ShotMarker {
  n: number; // step order shown in the badge
  label: L; // what to do / look at here
  x: number; // 0–100, left of the marker/box
  y: number; // 0–100, top of the marker/box
  w?: number; // 0–100, box width (omit for a point marker)
  h?: number; // 0–100, box height
}

/** A real screenshot of the source plus an ordered click/read guide over it. */
export interface SourceShot {
  img: string; // path under /public, e.g. "/walkthroughs/dart-home.png"
  alt: L;
  markers: ShotMarker[];
}

export interface SourceRef {
  name: L; // "OpenDART", "SEC EDGAR", …
  what: L; // what you pull from it
  why: L; // why this is the right source
  url: string; // where to see it yourself
  shot?: SourceShot; // optional annotated screenshot walkthrough
  /** When there's no screenshot (e.g. SEC EDGAR blocks automated capture), a
   *  written, ordered navigation guide instead. */
  steps?: L[];
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
        en: "Growth investing (GARP — growth at a reasonable price) isn't \"buy what's going up.\" It's three questions in order: (1) Is the growth **real** — are sales and profits actually rising? (2) Is it **quality and fundable** — good margins, decent ROE, real cash behind the earnings, and growth the business can pay for itself? (3) Is the **price sane** relative to that growth (PEG)? Two traps we're guarding against: profit that only exists on paper but never shows up as cash, and growth that's really just borrowed money or newly issued shares rather than the business funding itself. We'll answer each question with one number you pull yourself, then combine them into a call.\n- Real → revenue & EPS trend\n- Quality → net margin, ROE, FCF conversion, sustainable growth\n- Price → P/E and PEG",
        ko: "성장투자(GARP — 합리적 가격의 성장주)는 \"오르는 걸 산다\"가 아닙니다. 순서가 있는 세 질문입니다: (1) 성장이 **진짜**인가 — 매출과 이익이 실제로 늘고 있는가? (2) **우량하고 지속 가능**한가 — 마진·ROE가 괜찮고, 이익 뒤에 진짜 현금이 있으며, 성장을 회사가 스스로 감당할 수 있는가? (3) 그 성장 대비 **가격이 합리적**인가(PEG)? 우리가 경계하는 두 가지 함정: 장부에만 있고 실제 현금으로는 들어오지 않는 이익, 그리고 회사가 스스로 벌어 키운 게 아니라 빌린 돈이나 새로 찍어낸 주식으로 만든 성장. 각 질문을 당신이 직접 가져온 숫자 하나로 답하고, 이를 합쳐 결론을 냅니다.\n- 진짜 → 매출·EPS 추세\n- 우량 → 순이익률, ROE, FCF 전환율, 지속가능성장률\n- 가격 → PER과 PEG",
      },
    },
    {
      kind: "read",
      title: {
        en: "The words you'll see (plain English)",
        ko: "앞으로 나올 용어 (쉽게)",
      },
      body: {
        en: "Before we go further, here are the seven words this walkthrough leans on, each in one line with an everyday picture — in the order we'll use them:\n- **Revenue / 매출** = the total money the company took in from selling, before any costs. The whole pie, before anyone takes a slice.\n- **Net income / 순이익** = what's left after ALL costs, interest, and taxes — the true bottom line. What you actually pocket after paying every bill.\n- **EPS (earnings per share) / 주당순이익** = net income ÷ number of shares = each single share's slice of profit. Same pizza cut into more slices means a thinner slice, even if the pizza grew.\n- **Equity / 자기자본** = the shareholders' own money in the business = assets minus liabilities (what it owns minus what it owes). Like your home equity: the house's value minus the mortgage.\n- **FCF (free cash flow) / 잉여현금흐름** = the actual cash left after the company runs AND reinvests in itself. \"Cash in the till\" — real money, not an accounting figure.\n- **P/E (price-to-earnings) / PER** = the price you pay for each 1 of yearly per-share profit; price ÷ EPS.\n- **PEG** = P/E adjusted for how fast profit grows = P/E ÷ growth-rate%.\nYou won't compute these — the analyzer does — but knowing what each MEANS is how you'll judge whether its answer is good or bad.",
        ko: "더 나아가기 전에, 이 실습이 기대는 일곱 단어를 각각 한 줄로 일상적인 비유와 함께 — 앞으로 쓸 순서대로 — 정리합니다:\n- **매출 / Revenue** = 회사가 물건이나 서비스를 팔아 벌어들인 총 금액, 비용을 빼기 전. 누가 한 조각 떼어가기 전의 '파이 전체'.\n- **순이익 / Net income** = 매출에서 모든 비용·이자·세금을 뺀 뒤 남는 것 — 진짜 '맨 아랫줄'. 모든 청구서를 낸 뒤 실제로 손에 쥐는 돈.\n- **EPS(주당순이익) / earnings per share** = 순이익 ÷ 발행주식수 = 주식 한 주가 갖는 이익의 몫. 피자가 커져도 조각을 더 많이 자르면 한 조각은 얇아진다.\n- **자기자본 / Equity** = 자산 − 부채(가진 것에서 갚아야 할 것을 뺀), 주주들 몫. 집값에서 대출을 뺀 '내 지분'과 같다.\n- **잉여현금흐름(FCF) / free cash flow** = 사업을 굴리고 재투자까지 하고도 실제로 남는 현금. 장부상 숫자가 아니라 '금고 속 진짜 돈'.\n- **PER(주가수익비율) / price-to-earnings** = 연간 주당 이익 1을 사기 위해 지불하는 가격 = 주가 ÷ EPS.\n- **PEG** = PER를 이익 성장 속도로 나눈 값 = PER ÷ 이익성장률%.\n이 값들을 직접 계산하지는 않습니다 — 분석기가 해 줍니다 — 하지만 각각의 뜻을 알아야 그 답이 좋은지 나쁜지 판단할 수 있습니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터는 어디서 오는가" },
      body: {
        en: "You never take a number on faith — you pull it from the primary filing and can click through to verify. For a US name we read SEC EDGAR; for a Korean name, OpenDART. The current price comes from a live quote; analyst forward growth (US) from FMP, and for Korea we fall back to the past-EPS trend (no free forward consensus).\n\n**Where each number lives in the filing:**\n- **Revenue** and **Net income** → the income statement (손익계산서). EPS is usually printed right on it too, or = net income ÷ shares.\n- **Equity** → the balance sheet (재무상태표), line \"자본총계 / total equity.\"\n- **Operating cash flow** and **CAPEX** → the cash-flow statement (현금흐름표): operating cash flow is 영업활동현금흐름; CAPEX is 유형자산의 취득 (\"purchases of property, plant & equipment\") under investing activities.\n- **FCF** = operating cash flow (영업활동현금흐름) − capital expenditure / 유형자산의 취득 (CAPEX).\n- **ROE** = net income ÷ equity.\n- **PEG** = P/E ÷ growth-rate%.\n- **In a DART 사업보고서 (annual report):** open **재무제표 (financial statements) → 손익계산서 (income statement)** for revenue, net income and EPS, and **현금흐름표 (cash-flow statement)** for the FCF inputs (영업활동현금흐름 and 유형자산의 취득).\nThe analyzer pulls these lines and does the division for you — this map is so you can open the filing and check that its inputs match.\n\n**A quick note on the labels you'll see:** forward growth = analysts' estimate of NEXT years' growth (a forecast); past-trend growth = growth we extrapolate from the company's OWN reported history. Consensus = the average of many analysts' forecasts. FMP is the data vendor we use for US forward estimates; XBRL is just the machine-readable format SEC filings come in. Korea has no free forward consensus, so there we always use the past-trend number.",
        ko: "숫자를 그냥 믿지 않습니다 — 원본 공시에서 직접 가져오고, 클릭해 확인할 수 있습니다. 미국 종목은 SEC EDGAR, 한국 종목은 OpenDART에서 읽습니다. 현재가는 실시간 시세, 애널리스트 선행 성장률은 미국은 FMP에서, 한국은 (무료 선행 컨센서스가 없어) 과거 EPS 추세로 대체합니다.\n\n**각 숫자가 공시의 어디에 있는가:**\n- **매출액**과 **당기순이익** → 손익계산서. EPS도 대개 그 아래에 바로 찍혀 있거나, = 순이익 ÷ 발행주식수.\n- **자기자본** → 재무상태표의 \"자본총계 / total equity\" 항목.\n- **영업활동현금흐름**과 **CAPEX** → 현금흐름표: 영업활동현금흐름은 그대로, CAPEX는 투자활동 아래 유형자산의 취득(\"유형자산 매입\").\n- **FCF** = 영업활동현금흐름 − 유형자산의 취득(CAPEX).\n- **ROE** = 당기순이익 ÷ 자기자본.\n- **PEG** = PER ÷ 이익성장률%.\n- **DART 사업보고서에서:** **재무제표 → 손익계산서**를 열면 매출액·당기순이익·EPS가, **현금흐름표**를 열면 FCF 입력값(영업활동현금흐름과 유형자산의 취득)이 있습니다.\n분석기가 이 항목들을 가져와 나눗셈까지 대신 해 줍니다 — 이 지도는 여러분이 직접 공시를 열어 그 입력값이 맞는지 확인하기 위한 것입니다.\n\n**앞으로 보게 될 라벨에 대한 짧은 설명:** forward(선행) 성장률 = 애널리스트들이 추정한 앞으로의 성장 전망치; past-trend(과거 추세) 성장률 = 회사가 실제로 보고한 과거 실적에서 뽑아낸 성장률. Consensus(컨센서스) = 여러 애널리스트 전망치의 평균. FMP는 미국 선행 추정치를 가져오는 데이터 공급사이고, XBRL은 SEC 공시가 담겨 오는 기계 판독용 형식일 뿐입니다. 한국은 무료 선행 컨센서스가 없어 항상 과거 추세 값을 씁니다.",
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
          shot: DART_SHOT,
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
          url: "https://www.sec.gov/edgar/search/",
          steps: EDGAR_STEPS,
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull the company yourself", ko: "직접 회사를 조회하라" },
      body: {
        en: "Use the analyzer below. Enter a ticker (try a name you actually care about) and market. For Korea, keep the basis on **연결(consolidated)** — that combines the parent company with the businesses it owns, the normal choice — unless the company is a holding company (its main job is just owning stakes in OTHER companies, e.g. names ending in 홀딩스/지주), where you'd use **별도(separate)** to avoid double-counting. Read the numbers off the scorecard — don't worry if the labels aren't obvious yet; Steps 1–3 define each one as we use it (and the glossary above has the one-liners). Note the revenue trend, EPS trend, PEG, ROE, net margin, and FCF conversion.",
        ko: "아래 분석 도구를 사용하세요. 종목 코드(관심 있는 실제 종목으로 해보세요)와 시장을 입력하세요. 한국은 기준(basis)을 **연결**로 두세요 — 모회사와 그 회사가 거느린 사업들을 합친 것으로, 일반적인 선택입니다. 다만 지주회사(주업이 다른 회사 지분을 보유하는 것뿐인 회사, 예: 이름이 홀딩스/지주로 끝나는 곳)라면 이중 계산을 피하려고 **별도**를 씁니다. 스코어카드의 숫자를 읽으세요 — 라벨이 아직 명확하지 않아도 걱정 마세요; 1~3단계에서 쓰면서 하나씩 정의합니다(위 용어집에 한 줄 설명이 있습니다). 매출 추세, EPS 추세, PEG, ROE, 순이익률, FCF 전환율을 메모해 두세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — is the growth real?", ko: "1단계 — 성장이 진짜인가?" },
      body: {
        en: "Look at **revenue trend** and **EPS trend** side by side.\n- Both rising → clean growth story.\n- Revenue up but EPS flat/down → growth isn't reaching the bottom line. Three usual culprits: **margin pressure** = costs rising faster than sales so less profit sticks; **dilution** = the company issued more shares, so each existing share owns a thinner slice (EPS falls even if total profit is flat); **one-offs** = a one-time gain/loss (e.g. selling a building) that flatters or dents a single year.\n- Both falling → not a growth candidate; stop here.\n\n**Why a trend, not just two endpoints?** A shortcut that looks only at the first and last year (a \"2-point\" or endpoint calc) can badly mislead, because it lets a single freak year set the whole answer. Worked example — an EPS path over five years: 5.00, 3.00, 5.20, 5.40, 5.60. The business is steadily earning ~5+ every year; year 2 was one bad year it fully recovered from. Now watch what the endpoint shortcut does depending on which two years you happen to grab:\n- Start-to-end (5.00 → 5.60): about **+2.9%/yr** — looks like a sleepy, barely-growing company.\n- If your first data year had been the dip (3.00 → 5.60): about **+16.9%/yr** — looks like a rocket.\nSame company, same reality, wildly different verdicts — purely because one endpoint landed on the odd year. A trend fit uses ALL five points at once, so it reports a steady mid-single-digit rate that neither the sleepy nor the rocket reading distorts. That's why the analyzer fits a line across EVERY year instead of just the first and last. **CAGR** = the smooth yearly rate that turns the start value into the end value using only those two endpoints; a **trend growth** uses all the years in between so one odd year can't hijack the number.\n\nWrite down: is this real top-line growth, and is it flowing through to per-share earnings?",
        ko: "**매출 추세**와 **EPS 추세**를 나란히 보세요.\n- 둘 다 상승 → 깔끔한 성장 스토리.\n- 매출은 오르는데 EPS가 정체/하락 → 성장이 최종 이익까지 못 옵니다. 흔한 세 범인: **마진 압박(margin pressure)** = 비용이 매출보다 빨리 늘어 남는 이익이 줄어드는 것; **희석(dilution)** = 회사가 주식을 더 발행해 기존 한 주의 몫이 얇아지는 것(총이익이 그대로여도 EPS는 하락); **일회성 항목(one-offs)** = 건물 매각 같은 한 번뿐인 이익/손실이 특정 연도만 부풀리거나 깎아내리는 것.\n- 둘 다 하락 → 성장주 후보 아님, 여기서 멈추세요.\n\n**왜 두 끝점이 아니라 추세인가?** 처음과 끝만 보는 방식(\"2점\" 또는 양 끝점 계산)은 크게 오도할 수 있습니다. 단 한 번의 이상한 해가 전체 결론을 좌우하게 놔두기 때문입니다. 계산 예시 — 5년간 EPS 경로: 5.00, 3.00, 5.20, 5.40, 5.60. 이 회사는 매년 꾸준히 5 이상을 벌고 있고, 2년차만 나빴다가 완전히 회복했습니다. 이제 어느 두 해를 집느냐에 따라 끝점 계산이 어떻게 달라지는지 보세요:\n- 처음→끝(5.00 → 5.60): 연 약 **+2.9%** — 거의 안 크는 졸린 회사처럼 보임.\n- 만약 첫 데이터 연도가 그 저점이었다면(3.00 → 5.60): 연 약 **+16.9%** — 로켓처럼 보임.\n같은 회사, 같은 실적인데 결론이 극과 극 — 순전히 끝점 하나가 이상한 해에 걸렸기 때문입니다. 추세 적합은 다섯 점을 한꺼번에 쓰므로, 졸린 해석도 로켓 해석도 왜곡하지 못하는 안정적인 한 자릿수 중반 성장률을 내놓습니다. 그래서 분석기는 처음·끝 두 점이 아니라 모든 해에 직선(추세)을 맞춥니다. **CAGR(연평균성장률)** = 오직 두 끝점만 써서 시작 값을 끝 값으로 바꾸는 매끄러운 연 성장률; **추세 성장률**은 그 사이의 모든 해를 함께 써서 이상한 한 해가 숫자를 가로채지 못하게 합니다.\n\n메모: 이게 진짜 매출 성장이며, 주당이익까지 흐르고 있는가?",
      },
    },
    {
      kind: "read",
      title: {
        en: "Step 2 — is it quality, and can it fund the growth?",
        ko: "2단계 — 우량하며, 성장을 감당할 수 있는가?",
      },
      body: {
        en: "Four quality gates, each with a plain definition, a rule of thumb, and a worked number:\n- **Net margin** = net income ÷ revenue = how much of each 1 of sales survives as profit. Benchmarks vary by industry — a grocer might keep ~2–4%, a software firm 20%+ — so judge it against peers and against its own trend (rising/stable good, falling bad). Example: net income 12 on revenue 150 → net margin 8%.\n- **ROE (return on equity)** = net income ÷ shareholders' equity (the owners' money in the business). It says how much profit the company squeezes from each 1 owners put in. Rule of thumb: sustained 15%+ strong, single digits weak. Example: 20 profit on 100 of equity → ROE 20%.\n- **FCF conversion** = FCF ÷ net income (recall FCF = operating cash flow − CAPEX). It asks: do the paper profits turn into real cash? Example: net income 100 but FCF only 60 → 60% conversion — well under ~80%, a red flag that earnings aren't becoming cash.\n- **Sustainable growth rate (SGR)** — two new words first. **Dividends** = cash the company pays out to shareholders from its profit (your cut for owning the stock). **Payout ratio** = the fraction of profit handed out as dividends (pay out 40 of every 100 of profit → payout 40%). Whatever isn't paid out is kept and reinvested — that kept fraction is **retention**, so payout% + retention% = 100%. SGR = ROE × retention = the growth the company can fund purely from its OWN retained profit, with no new debt or shares. Example: payout 50% → retention 0.5; ROE 20% × 0.5 = SGR 10%.\n\nNow the debt/dilution check. **Compare SGR against the EPS (earnings) growth**, not the revenue growth — SGR is built from ROE and retention, which are earnings/equity concepts, so the honest apples-to-apples match is earnings. If the scorecard's EPS growth is, say, +25% but SGR is only 10%, the extra ~15 points had to come from outside the retained profit — borrowing or issuing new shares — which is sustainable only if the company can keep tapping those. (Revenue can outrun SGR for other reasons, so it's not the right yardstick here.)",
        ko: "우량성 관문 네 가지, 각각 쉬운 정의·경험칙·계산 예시와 함께:\n- **순이익률** = 당기순이익 ÷ 매출액 = 매출 1당 이익으로 얼마가 남는가. 업종마다 달라서 — 마트는 약 2~4%, 소프트웨어 회사는 20% 이상일 수 있으니 — 동종업계 경쟁사 및 자사 추세(상승/안정 좋음, 하락 나쁨)와 비교해 판단하세요. 예: 매출 150에 순이익 12 → 순이익률 8%.\n- **ROE(자기자본이익률)** = 당기순이익 ÷ 자기자본(주주가 회사에 넣은 돈). 주주가 넣은 1당 얼마의 이익을 뽑아내는가. 경험칙: 15% 이상 꾸준하면 강함, 한 자릿수면 약함. 예: 자기자본 100에 이익 20 → ROE 20%.\n- **FCF 전환율** = FCF ÷ 당기순이익 (FCF = 영업활동현금흐름 − CAPEX). 장부상 이익이 진짜 현금이 되는지를 본다. 예: 순이익 100인데 FCF는 60뿐 → 전환율 60%로 약 80%에 크게 못 미치니, 이익이 현금이 되지 않는다는 경고 신호.\n- **지속가능성장률(SGR)** — 먼저 새 용어 둘. **배당** = 회사가 이익에서 주주에게 나눠 주는 현금(주식을 보유한 대가로 받는 몫). **배당성향(payout ratio)** = 이익 중 배당으로 나눠 주는 비율(이익 100당 40을 나눠 주면 배당성향 40%). 나눠 주지 않고 남겨 재투자하는 몫이 **유보율**이라, 배당성향% + 유보율% = 100%. SGR = ROE × 유보율 = 새 빚이나 신주 없이 회사가 스스로 남긴 이익만으로 감당할 수 있는 성장. 예: 배당성향 50% → 유보율 0.5; ROE 20% × 0.5 = SGR 10%.\n\n이제 부채/희석 점검. **SGR은 매출 성장률이 아니라 EPS(이익) 성장률과 비교하세요** — SGR은 ROE와 유보율(둘 다 이익·자본 개념)로 만들어지므로, 같은 잣대로 정직하게 맞대볼 대상은 이익입니다. 스코어카드의 EPS 성장률이 예컨대 +25%인데 SGR은 10%뿐이라면, 나머지 약 15%p는 남긴 이익 바깥 — 차입이나 신주 발행 — 에서 나온 것이고, 그 자금원을 계속 끌어올 수 있을 때만 지속 가능합니다. (매출은 다른 이유로도 SGR을 넘어설 수 있어 여기서는 올바른 잣대가 아닙니다.)",
      },
    },
    {
      kind: "read",
      title: {
        en: "Step 3 — are you paying a sane price?",
        ko: "3단계 — 합리적인 가격을 내고 있는가?",
      },
      body: {
        en: "Now the price. **P/E** (price ÷ EPS) = how many years of today's profit you're paying for one share. P/E 20 means you pay 20 for every 1 of annual per-share profit. But P/E alone can't compare a fast grower to a slow one — **PEG** (P/E ÷ growth%) does. Example: P/E 30 with 30% profit growth → PEG = 1.0 (fair); P/E 30 with 15% growth → PEG 2.0 (paying up). Rules of thumb: PEG around 1 is roughly fair, well under 1 may be cheap, well over ~2 means you're paying up for growth.\n\n**Which growth number is in this PEG?** The analyzer fills the PEG denominator with the SAME growth figure it shows on the scorecard for that market: for a US name, the forward-consensus EPS growth (analysts' forecast); for a Korean name, the past-EPS trend growth — the exact EPS-trend number you read in Step 1 (no free Korean forward consensus). So a US PEG is a forward claim and a Korean PEG is a past-trend claim; the denominator is always an EPS-growth figure, never revenue growth. Read the scorecard's growth label to confirm which one you're looking at, then you can honestly say whether your PEG is forward or past-trend.\n\n**Building a PEG without the tool.** If you're checking a name by hand, you still need a growth% for the denominator. A quick, tool-free estimate is a **multi-year EPS CAGR**: pull EPS for the latest year and an earlier year off the income statements and compute **(latest EPS ÷ earlier EPS)^(1 ÷ number of years) − 1**. Example: EPS 3.00 five years ago → 5.60 now is (5.60 ÷ 3.00)^(1/5) − 1 ≈ **13%/yr**; PEG = P/E ÷ 13. **Caveat — this is NOT the same growth the tool uses:** the analyzer's US PEG uses *analyst forward* growth (a forecast) and its Korean PEG uses a *trend-growth regression* across all the years, whereas your two-point CAGR just connects two endpoints — so it's rougher and, as Step 1 showed, one odd endpoint year can distort it. Treat your hand PEG as a sanity check, not a replacement for the tool's.\n\nTwo cautions the analyzer bakes in:\n- Because of the above, a **forward-consensus PEG** (US) and a **past-trend PEG** (Korea) are different claims and aren't directly comparable — check the label (both terms defined in the data-source step).\n- For Korean names the \"1 = fair\" line doesn't transfer cleanly. **Korea discount** = Korean stocks tend to trade at structurally lower valuations than global peers (governance, low dividend-payout, and other factors), so their PEG can run below 1 even when fairly priced.\n\nSo how do you get a fair yardstick? To compare, run the analyzer on 1–2 rivals in the same industry and read their PEG off the same scorecard; that peer number, not a fixed 1, is your yardstick.",
        ko: "이제 가격입니다. **PER**(주가 ÷ EPS) = 지금의 이익 기준으로 한 주에 몇 년치 이익을 지불하는가. PER 20 = 연간 주당 이익 1당 20을 지불한다는 뜻. 하지만 PER 하나로는 빠른 성장주와 느린 성장주를 비교할 수 없고 **PEG**(PER ÷ 성장률%)는 가능합니다. 예: PER 30에 이익성장률 30% → PEG = 1.0 (적정); PER 30에 성장률 15% → PEG 2.0 (비싸게 지불). 경험칙: PEG 1 근처면 대체로 적정, 1을 크게 밑돌면 저렴할 수 있고, ~2를 크게 넘으면 성장에 비싸게 지불하는 것.\n\n**이 PEG의 분모에는 어느 성장률이 들어갈까?** 분석기는 PEG 분모에 시장별로 스코어카드에 표시하는 바로 그 성장률을 넣습니다: 미국 종목은 선행 컨센서스 EPS 성장률(애널리스트 전망치), 한국 종목은 과거 EPS 추세 성장률 — 1단계에서 읽은 바로 그 EPS 추세 값(한국은 무료 선행 컨센서스가 없음). 그래서 미국 PEG는 선행 주장, 한국 PEG는 과거 추세 주장이며, 분모는 언제나 EPS 성장률이지 매출 성장률이 아닙니다. 스코어카드의 성장률 라벨을 확인해 어느 쪽인지 파악하면, 내 PEG가 선행인지 과거 추세인지 정직하게 말할 수 있습니다.\n\n**도구 없이 PEG 만들기.** 종목을 손으로 점검할 때도 분모에 넣을 성장률(%)은 필요합니다. 빠르고 도구가 필요 없는 추정은 **여러 해 EPS CAGR(연평균성장률)**입니다: 손익계산서에서 최근 연도와 몇 해 전의 EPS를 뽑아 **(최근 EPS ÷ 과거 EPS)^(1 ÷ 연수) − 1**을 계산합니다. 예: 5년 전 EPS 3.00 → 현재 5.60이면 (5.60 ÷ 3.00)^(1/5) − 1 ≈ **연 13%**; PEG = PER ÷ 13. **주의 — 이것은 도구가 쓰는 성장률과 다릅니다:** 분석기의 미국 PEG는 *애널리스트 선행* 성장률(전망치)을, 한국 PEG는 모든 해에 걸친 *추세 성장 회귀*를 쓰는 반면, 여러분의 두 점 CAGR은 양 끝점만 잇습니다 — 그래서 더 거칠고, 1단계에서 봤듯 이상한 끝점 한 해가 값을 왜곡할 수 있습니다. 손으로 낸 PEG는 도구를 대체하는 게 아니라 점검용 잣대로 쓰세요.\n\n분석 도구가 내장한 두 가지 주의:\n- 위 이유로 **선행 컨센서스 PEG**(미국)와 **과거 추세 PEG**(한국)는 다른 주장이며 직접 비교되지 않습니다 — 라벨을 확인(둘 다 데이터 소스 단계에서 정의).\n- 한국 종목은 \"1=적정\" 기준이 그대로 통하지 않습니다. **코리아 디스카운트** = 한국 주식이 지배구조·낮은 배당성향 등 구조적 요인 탓에 글로벌 동종업체보다 낮은 밸류에이션에 거래되는 경향 — 그래서 적정 가격이어도 PEG가 1 아래로 나올 수 있다.\n\n그럼 공정한 잣대는 어떻게 얻을까요? 비교하려면 같은 업종의 경쟁사 1~2곳을 분석기에 돌려 같은 스코어카드에서 그들의 PEG를 읽으세요. 고정된 1이 아니라 그 동종업체 값이 여러분의 잣대입니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Combine the three answers. A buy-worthy GARP name usually clears all three: real growth, quality/fundable, sane price. One failing gate isn't automatically a pass/fail — but name which gate failed and whether it's a dealbreaker for you.\n\n**Quick gate reference** — Real: revenue AND EPS trending up over the years. Quality/fundable: ROE ~15%+, net margin stable/rising vs peers, FCF conversion ~80%+, and reported growth not wildly above SGR. Price: PEG near 1 (or below a comparable Korean peer). A gate \"fails\" when it clearly misses — name which, and whether it's a dealbreaker.",
        ko: "세 답을 합치세요. 매수할 만한 GARP 종목은 대개 세 관문을 다 통과합니다: 진짜 성장, 우량·지속 가능, 합리적 가격. 관문 하나 탈락이 자동으로 결론을 정하진 않지만 — 어느 관문이 왜 탈락했고, 그게 당신에게 결정적인지 적으세요.\n\n**빠른 게이트 기준** — 진짜인가: 여러 해에 걸쳐 매출과 EPS가 모두 상승. 우량·자체조달 가능한가: ROE 약 15% 이상, 순이익률이 동종업계 대비 안정/상승, FCF 전환율 약 80% 이상, 보고된 성장률이 SGR을 크게 웃돌지 않음. 가격: PEG가 1 근처(또는 비교 대상 한국 동종업체보다 낮음). 어느 게이트가 명백히 미달하면 \"실패\" — 어느 것인지, 그리고 그것이 결정적 결격 사유인지 밝히세요.",
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
        en: "You just ran the full loop on real data — not a memorized ratio, but source → fetch → compute → judge. That's repeatable for any name.\n\n**How to sanity-check the analyzer by hand:** open the filing (DART 재무제표 or EDGAR 10-K financial statements). On the income statement read Revenue and Net income; on the balance sheet read Total equity; on the cash-flow statement read Operating cash flow and CAPEX (유형자산의 취득). Recompute one ratio yourself — e.g. Net income ÷ Equity should roughly match the scorecard's ROE, or Operating cash flow − CAPEX should roughly match its FCF. If your hand number and the tool disagree wildly, trust the filing and find out why.\n\nBefore you act on it for real, run this checklist.",
        ko: "방금 실제 데이터로 전체 흐름을 돌렸습니다 — 외운 지표가 아니라 소스 → 조회 → 계산 → 판단. 어떤 종목에도 반복 가능합니다.\n\n**분석기를 손으로 검산하는 법:** 공시를 여세요(DART 재무제표 또는 EDGAR 10-K의 재무제표). 손익계산서에서 매출액과 당기순이익을, 재무상태표에서 자본총계를, 현금흐름표에서 영업활동현금흐름과 유형자산의 취득(CAPEX)을 읽습니다. 비율 하나를 직접 다시 계산해 보세요 — 예: 당기순이익 ÷ 자기자본이 스코어카드의 ROE와 대략 맞아야 하고, 영업활동현금흐름 − 유형자산의 취득이 그 FCF와 대략 맞아야 합니다. 손 계산값과 도구값이 크게 다르면 공시를 믿고 그 이유를 찾으세요.\n\n실제로 행동에 옮기기 전에 이 체크리스트를 확인하세요.",
      },
      checklist: [
        {
          en: "I opened the primary filing (DART/EDGAR), found revenue / net income / equity / operating cash flow / CAPEX, and recomputed at least one ratio to confirm it roughly matched the scorecard.",
          ko: "원 공시(DART/EDGAR)를 열어 매출·순이익·자기자본·영업활동현금흐름·CAPEX를 찾았고, 비율을 최소 하나 다시 계산해 스코어카드와 대략 일치함을 확인했다.",
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
