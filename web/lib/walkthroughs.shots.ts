// Shared annotated source screenshots + written nav guides, extracted into a
// leaf module so both walkthroughs.ts and walkthroughs.data.ts can import them
// without a circular value-dependency. Captured at 1280×900 by
// scripts/capture-source-shots.mjs; marker x/y/w/h are PERCENTAGES of that frame.
import type { L, SourceShot } from "./walkthroughs";

/** OpenDART home — the search box and the 연결/별도 financial-statement filters. */
export const DART_SHOT: SourceShot = {
  img: "/walkthroughs/dart-home.png",
  alt: {
    en: "OpenDART home page with the company search box and financial-statement filters",
    ko: "회사 검색창과 재무제표 필터가 있는 OpenDART 첫 화면",
  },
  markers: [
    {
      n: 1,
      x: 26.6,
      y: 31.7,
      w: 39.8,
      h: 3.8,
      label: {
        en: "Type the company name or 6-digit code here (e.g. 케이아이엔엑스 / 093320).",
        ko: "여기에 회사명이나 6자리 종목코드를 입력하세요 (예: 케이아이엔엑스 / 093320).",
      },
    },
    {
      n: 2,
      x: 28.9,
      y: 68.8,
      w: 8,
      h: 3.5,
      label: {
        en: "연결재무제표 (consolidated) — the default basis: parent + subsidiaries. Use this unless it's a holding company.",
        ko: "연결재무제표 — 기본 기준: 모회사 + 종속회사. 지주회사가 아니면 이걸 씁니다.",
      },
    },
    {
      n: 3,
      x: 55.6,
      y: 68.8,
      w: 8,
      h: 3.5,
      label: {
        en: "개별재무제표 (separate) — the parent alone. Switch to this for holding companies to avoid double-counting subsidiaries.",
        ko: "개별재무제표 — 모회사만. 지주회사는 종속회사 이중계산을 피하려 이걸로 바꿉니다.",
      },
    },
  ],
};

/** OpenDART — INSIDE a filing: the actual 연결 현금흐름표 (consolidated cash-flow
 *  statement), with the three lines FCF and dividend-safety are built from.
 *  This is the "into the room" companion to DART_SHOT's front-door view.
 *  (Real 삼성전자 2023 사업보고서; frame 1280×1500, markers are % of that.) */
export const DART_CASHFLOW_SHOT: SourceShot = {
  img: "/walkthroughs/dart-cashflow.png",
  alt: {
    en: "A real DART consolidated cash-flow statement (Samsung 2023), with the document table-of-contents on the left and the operating/investing/financing lines on the right",
    ko: "실제 DART 연결 현금흐름표(삼성전자 2023) — 왼쪽 문서목차와 오른쪽 영업·투자·재무활동 항목",
  },
  markers: [
    {
      n: 1,
      x: 3.0,
      y: 46.5,
      w: 18.5,
      h: 1.8,
      label: {
        en: "In the filing's left menu: III. 재무에 관한 사항 → 2. 연결재무제표 → 2-5. 연결 현금흐름표. (2-2 손익계산서 has net income; 2-1 재무상태표 has debt & cash.)",
        ko: "공시 왼쪽 목차: III. 재무에 관한 사항 → 2. 연결재무제표 → 2-5. 연결 현금흐름표. (2-2 손익계산서에 순이익, 2-1 재무상태표에 부채·현금.)",
      },
    },
    {
      n: 2,
      x: 27.2,
      y: 24.5,
      w: 48.3,
      h: 2.0,
      label: {
        en: "영업활동현금흐름 = operating cash flow (OCF). The first term of FCF.",
        ko: "영업활동현금흐름 = OCF. FCF의 첫 번째 항.",
      },
    },
    {
      n: 3,
      x: 27.2,
      y: 69.9,
      w: 48.3,
      h: 2.0,
      label: {
        en: "유형자산의 취득 = CAPEX (in the 투자활동 / investing section, shown negative). FCF = 영업활동현금흐름 − 유형자산의 취득.",
        ko: "유형자산의 취득 = CAPEX(투자활동 부분, 음수). FCF = 영업활동현금흐름 − 유형자산의 취득.",
      },
    },
    {
      n: 4,
      x: 27.2,
      y: 90.6,
      w: 48.3,
      h: 2.0,
      label: {
        en: "배당금의 지급 = dividends paid (in the 재무활동 / financing section). This is the numerator of the payout ratios.",
        ko: "배당금의 지급(재무활동 부분). 배당성향 계산의 분자입니다.",
      },
    },
  ],
};

/** OpenDART — the 연결 손익계산서 (consolidated income statement): revenue, operating
 *  income, net income, and EPS — what growth (and any earnings-based) analysis
 *  reads. Companion to the cash-flow shot. (Samsung 2023; frame 1280×1100.) */
export const DART_INCOME_SHOT: SourceShot = {
  img: "/walkthroughs/dart-income.png",
  alt: {
    en: "A real DART consolidated income statement (Samsung 2023), with revenue, operating income, net income and EPS lines",
    ko: "실제 DART 연결 손익계산서(삼성전자 2023) — 매출·영업이익·당기순이익·주당이익 항목",
  },
  markers: [
    {
      n: 1,
      x: 3.0,
      y: 57.0,
      w: 18.5,
      h: 1.7,
      label: {
        en: "Left menu: III. 재무에 관한 사항 → 2. 연결재무제표 → 2-2. 연결 손익계산서.",
        ko: "왼쪽 목차: III. 재무에 관한 사항 → 2. 연결재무제표 → 2-2. 연결 손익계산서.",
      },
    },
    {
      n: 2,
      x: 27.2,
      y: 33.4,
      w: 48.3,
      h: 2.4,
      label: {
        en: "영업수익 / 매출액 = revenue (the top line). Its year-over-year trend is the 'is the growth real?' check.",
        ko: "영업수익 / 매출액 = 매출(맨 윗줄). 연도별 추세가 '성장이 진짜인가' 점검의 핵심.",
      },
    },
    {
      n: 3,
      x: 27.2,
      y: 44.6,
      w: 48.3,
      h: 2.7,
      label: {
        en: "영업이익 = operating income (EBIT) — profit from the core business before financing and tax.",
        ko: "영업이익 = 영업이익(EBIT) — 금융비용·세금 전 본업 이익.",
      },
    },
    {
      n: 4,
      x: 27.2,
      y: 70.0,
      w: 48.3,
      h: 2.7,
      label: {
        en: "당기순이익 = net income (the bottom line). ROE = net income ÷ equity; also the payout-ratio denominator.",
        ko: "당기순이익 = 순이익(맨 아랫줄). ROE = 순이익 ÷ 자기자본; 배당성향의 분모이기도 함.",
      },
    },
    {
      n: 5,
      x: 27.2,
      y: 84.1,
      w: 48.3,
      h: 2.7,
      label: {
        en: "기본주당이익 = basic EPS (in won). Its trend is the per-share growth the PEG uses.",
        ko: "기본주당이익 = 기본 EPS(원). 그 추세가 PEG가 쓰는 주당 성장률.",
      },
    },
  ],
};

/** SEC EDGAR — the actual rendered Consolidated Statements of Cash Flows from a
 *  10-K (Apple FY2023, XBRL R-page), with the three lines FCF and dividend
 *  coverage are built from. The US counterpart to DART_CASHFLOW_SHOT: EDGAR's
 *  browse/search HTML blocks automated capture, but the archived filing
 *  statement pages render, so this SHOWS the table the EDGAR_STEPS guide
 *  describes. (Frame 1280×996; markers are % of that.) */
export const EDGAR_CASHFLOW_SHOT: SourceShot = {
  img: "/walkthroughs/edgar-cashflow.png",
  alt: {
    en: "A real SEC EDGAR Consolidated Statements of Cash Flows (Apple FY2023) with the Operating / Investing / Financing sections and the operating-cash-flow, capex, and dividends-paid lines",
    ko: "실제 SEC EDGAR 연결 현금흐름표(애플 FY2023) — 영업·투자·재무활동 구간과 영업현금흐름·CAPEX·지급배당 항목",
  },
  markers: [
    {
      n: 1,
      x: 0.9,
      y: 2.7,
      w: 42.2,
      h: 8.0,
      label: {
        en: "You're in Item 8 → Consolidated Statements of Cash Flows. Three sections follow in order: Operating, Investing, Financing.",
        ko: "Item 8 → 연결 현금흐름표(Consolidated Statements of Cash Flows). 영업·투자·재무활동 세 구간이 순서대로 나옵니다.",
      },
    },
    {
      n: 2,
      x: 0.9,
      y: 46.0,
      w: 64.1,
      h: 2.2,
      label: {
        en: "Cash generated by operating activities = operating cash flow (OCF), the total of the Operating section. The first term of FCF. (Other filers word it \"Net cash provided by operating activities\" — match the section's total line, not the exact phrase.)",
        ko: "Cash generated by operating activities = 영업활동현금흐름(OCF), 영업 구간의 합계. FCF의 첫 항. (다른 기업은 \"Net cash provided by operating activities\"로 쓰기도 합니다 — 정확한 문구가 아니라 영업 구간의 합계 줄을 찾으세요.)",
      },
    },
    {
      n: 3,
      x: 0.9,
      y: 57.6,
      w: 64.1,
      h: 2.2,
      label: {
        en: "Payments for acquisition of property, plant and equipment = CAPEX (in the Investing section, shown negative). FCF = OCF − CAPEX. (Wording varies a lot — \"Capital expenditures\", \"Purchases of property and equipment\" — so match the concept: cash spent to buy long-lived PP&E, in the Investing section.)",
        ko: "Payments for acquisition of property, plant and equipment = CAPEX(투자활동 구간, 음수). FCF = OCF − CAPEX. (문구는 회사마다 크게 다릅니다 — \"Capital expenditures\", \"Purchases of property and equipment\" 등 — 그러니 개념으로 찾으세요: 투자활동 구간의 유형자산(PP&E) 취득에 쓴 현금.)",
      },
    },
    {
      n: 4,
      x: 0.9,
      y: 69.3,
      w: 64.1,
      h: 2.2,
      label: {
        en: "Payments for dividends and dividend equivalents = dividends paid (in the Financing section). The payout-ratio numerator. (Others write \"Dividends paid\" / \"Cash dividends paid\" — it's the dividend cash outflow in the Financing section.)",
        ko: "Payments for dividends and dividend equivalents = 지급배당(재무활동 구간). 배당성향의 분자. (다른 기업은 \"Dividends paid\" / \"Cash dividends paid\"로 씁니다 — 재무활동 구간의 배당 현금 유출입니다.)",
      },
    },
  ],
};

/** SEC EDGAR — the Consolidated Statements of Operations (income statement) from
 *  a 10-K (Apple FY2023 R3.htm): net sales, operating income, net income, EPS —
 *  the earnings lines growth analysis reads. US counterpart of DART_INCOME_SHOT.
 *  (Frame 1280×714; markers are % of that.) */
export const EDGAR_INCOME_SHOT: SourceShot = {
  img: "/walkthroughs/edgar-income.png",
  alt: {
    en: "A real SEC EDGAR Consolidated Statements of Operations (Apple FY2023) with net sales, operating income, net income and earnings-per-share lines",
    ko: "실제 SEC EDGAR 연결 손익계산서(애플 FY2023) — 매출·영업이익·순이익·주당이익 항목",
  },
  markers: [
    {
      n: 1,
      x: 0.9,
      y: 3.9,
      w: 42.2,
      h: 12.0,
      label: {
        en: "You're in Item 8 → Consolidated Statements of Operations (the income statement).",
        ko: "Item 8 → 연결 손익계산서(Consolidated Statements of Operations).",
      },
    },
    {
      n: 2,
      x: 0.9,
      y: 18.9,
      w: 64.1,
      h: 3.1,
      label: {
        en: "Net sales = revenue (the top line). Its year-over-year trend is the 'is the growth real?' check.",
        ko: "Net sales = 매출(맨 윗줄). 연도별 추세가 '성장이 진짜인가' 점검의 핵심.",
      },
    },
    {
      n: 3,
      x: 0.9,
      y: 41.6,
      w: 64.1,
      h: 3.1,
      label: {
        en: "Operating income = EBIT — profit from the core business before financing and tax.",
        ko: "Operating income = 영업이익(EBIT) — 금융비용·세금 전 본업 이익.",
      },
    },
    {
      n: 4,
      x: 0.9,
      y: 54.6,
      w: 64.1,
      h: 3.1,
      label: {
        en: "Net income (the bottom line). ROE = net income ÷ equity; also the payout-ratio denominator.",
        ko: "Net income = 순이익(맨 아랫줄). ROE = 순이익 ÷ 자기자본; 배당성향의 분모이기도 함.",
      },
    },
    {
      n: 5,
      x: 0.9,
      y: 61.1,
      w: 64.1,
      h: 3.1,
      label: {
        en: "Basic (earnings per share). Its trend is the per-share growth the PEG uses.",
        ko: "Basic(기본 주당이익, EPS). 그 추세가 PEG가 쓰는 주당 성장률.",
      },
    },
  ],
};

/** FRED — the yield-curve-spread series page (search + Max range + the chart). */
export const FRED_SHOT: SourceShot = {
  img: "/walkthroughs/fred-spread.png",
  alt: {
    en: "FRED page for the 10-year minus 3-month Treasury spread, showing search, range buttons and the chart",
    ko: "10년-3개월 국채 금리차 FRED 페이지 — 검색창, 기간 버튼, 차트",
  },
  markers: [
    {
      n: 1,
      x: 52.8,
      y: 6,
      w: 32,
      h: 4,
      label: {
        en: "Search any series here — e.g. \"T10Y3M\" for the 10yr−3mo spread, or \"CPIAUCSL\" for CPI.",
        ko: "여기서 원하는 시계열을 검색하세요 — 예: 금리차는 \"T10Y3M\", CPI는 \"CPIAUCSL\".",
      },
    },
    {
      n: 2,
      x: 73.9,
      y: 32.4,
      w: 5,
      h: 3.5,
      label: {
        en: "Click Max to see the full history and where the spread went negative (inverted) before past recessions.",
        ko: "Max를 눌러 전체 이력과, 과거 침체 전에 금리차가 음(역전)으로 갔던 지점을 보세요.",
      },
    },
    {
      n: 3,
      x: 5.5,
      y: 44,
      w: 89,
      h: 45,
      label: {
        en: "Read the line against zero: below zero = inverted curve = a historical recession warning (a warning, not a timer).",
        ko: "선을 0 기준으로 읽으세요: 0 아래 = 곡선 역전 = 역사적 침체 경고(타이머가 아니라 경고).",
      },
    },
  ],
};

/** Yahoo Finance — a ticker's Historical Data table (date range + Adj Close). */
export const YAHOO_SHOT: SourceShot = {
  img: "/walkthroughs/yahoo-history.png",
  alt: {
    en: "Yahoo Finance historical-data table for SPY, showing the date-range control and the Adjusted Close column",
    ko: "SPY의 야후 파이낸스 과거 데이터 표 — 기간 선택과 수정 종가(Adj Close) 열",
  },
  markers: [
    {
      n: 1,
      x: 2.5,
      y: 48.5,
      w: 8,
      h: 3.5,
      label: {
        en: "Open \"Historical Data\" for the ticker.",
        ko: "종목의 \"Historical Data(과거 데이터)\"를 엽니다.",
      },
    },
    {
      n: 2,
      x: 14.5,
      y: 53.5,
      w: 17,
      h: 4,
      label: {
        en: "Set the date range long enough to cover a full bull-and-bear cycle.",
        ko: "상승·하락 사이클을 온전히 담을 만큼 긴 기간으로 설정하세요.",
      },
    },
    {
      n: 3,
      x: 55,
      y: 64,
      w: 12,
      h: 4,
      label: {
        en: "Use the Adj Close column — it's adjusted for splits and dividends, the honest series for backtests.",
        ko: "Adj Close(수정 종가) 열을 쓰세요 — 분할·배당이 반영된, 백테스트에 정직한 시계열입니다.",
      },
    },
  ],
};

/** Ken French Data Library — the list of downloadable factor datasets. */
export const FRENCH_SHOT: SourceShot = {
  img: "/walkthroughs/french-library.png",
  alt: {
    en: "Kenneth French Data Library index page listing the downloadable factor datasets",
    ko: "다운로드 가능한 팩터 데이터셋이 나열된 케네스 프렌치 데이터 라이브러리 페이지",
  },
  markers: [
    {
      n: 1,
      x: 3,
      y: 20,
      w: 60,
      h: 6,
      label: {
        en: "Find \"Fama/French 3 Factors\" — this is the Mkt-RF, SMB (size), HML (value) series used in the regression.",
        ko: "\"Fama/French 3 Factors\"를 찾으세요 — 회귀에 쓰는 Mkt-RF, SMB(규모), HML(가치) 시계열입니다.",
      },
    },
    {
      n: 2,
      x: 3,
      y: 27,
      w: 40,
      h: 5,
      label: {
        en: "Download the CSV/ZIP; the monthly factor returns are what a factor ETF's returns get regressed on.",
        ko: "CSV/ZIP를 내려받으세요; 이 월별 팩터 수익률에 팩터 ETF 수익률을 회귀합니다.",
      },
    },
  ],
};

/** CBOE — the BXM buy-write index dashboard. */
export const CBOE_SHOT: SourceShot = {
  img: "/walkthroughs/cboe-bxm.png",
  alt: {
    en: "CBOE BXM buy-write index dashboard showing the index level and performance",
    ko: "지수 수준과 성과를 보여주는 CBOE BXM 바이라이트 지수 대시보드",
  },
  markers: [
    {
      n: 1,
      x: 6,
      y: 22,
      w: 50,
      h: 8,
      label: {
        en: "BXM tracks the covered-call strategy on the S&P 500 — holding the index and writing monthly calls.",
        ko: "BXM은 S&P 500에 대한 커버드 콜 전략(지수 보유 + 매월 콜 매도)을 추종합니다.",
      },
    },
    {
      n: 2,
      x: 6,
      y: 45,
      w: 85,
      h: 40,
      label: {
        en: "Compare its performance to plain SPY: usually calmer, but it lags in strong bull markets (capped upside).",
        ko: "단순 SPY와 성과를 비교하세요: 대체로 잔잔하지만 강한 상승장에선 뒤처집니다(상단이 막혀서).",
      },
    },
  ],
};

/** DART_SHOT shows only the OpenDART landing page + 연결/별도 toggle. This written
 *  guide continues from there INTO the actual statement tables, so a beginner
 *  isn't left at the front door. Shown alongside the screenshot. */
export const DART_STEPS: L[] = [
  {
    en: "From the search results, open the latest 사업보고서 (annual business report). In its left-hand table of contents, click into 'III. 재무에 관한 사항' → '재무제표' (or '연결재무제표').",
    ko: "검색 결과에서 가장 최근 사업보고서를 엽니다. 왼쪽 목차에서 'III. 재무에 관한 사항' → '재무제표'(또는 '연결재무제표')를 클릭합니다.",
  },
  {
    en: "손익계산서 (income statement): 매출액 (revenue) at the top, 영업이익 (operating income / EBIT) in the middle, 당기순이익 (net income) at the bottom.",
    ko: "손익계산서: 맨 위 매출액, 중간 영업이익(EBIT), 맨 아래 당기순이익.",
  },
  {
    en: "현금흐름표 (cash-flow statement), three sections: 영업활동현금흐름 (operating cash flow, OCF); under 투자활동 find 유형자산의 취득 (CAPEX, shown negative); under 재무활동 find 배당금의 지급 (dividends paid). FCF = 영업활동현금흐름 − 유형자산의 취득.",
    ko: "현금흐름표(3부분): 영업활동현금흐름(OCF); 투자활동의 '유형자산의 취득'(CAPEX, 음수); 재무활동의 '배당금의 지급'. FCF = 영업활동현금흐름 − 유형자산의 취득.",
  },
  {
    en: "재무상태표 (balance sheet): total debt = 단기차입금 + 장기차입금 + 사채; cash = 현금및현금성자산. (For a REIT, the 배당가능이익 and distribution detail are in the 주석 (notes), not the main statements.)",
    ko: "재무상태표: 총부채 = 단기차입금 + 장기차입금 + 사채; 현금 = 현금및현금성자산. (리츠는 배당가능이익과 분배 내역이 본 재무제표가 아니라 주석에 있습니다.)",
  },
  {
    en: "Read the exact line — that is the figure the analyzer should match. Keep the basis consistent (연결 vs 별도) with what you selected on the search page.",
    ko: "필요한 줄을 정확히 읽습니다 — 분석기 값과 일치해야 합니다. 검색 페이지에서 고른 기준(연결/별도)과 동일하게 유지하세요.",
  },
];

/** SEC EDGAR blocks automated capture, so we give a written navigation guide.
 *  Deliberately walks INTO the specific statement + line (not just "find the
 *  financial statements") so a beginner can actually locate each number. */
export const EDGAR_STEPS: L[] = [
  {
    en: "Go to EDGAR full-text search (sec.gov/edgar/search), type the company name or ticker, and open its filings page.",
    ko: "EDGAR 전체 텍스트 검색(sec.gov/edgar/search)에서 회사명이나 티커를 입력하고, 그 회사의 공시 목록 페이지를 엽니다.",
  },
  {
    en: "Filter Form Type to 10-K (the annual report) and open the most recent one. Inside, jump to the section titled 'Item 8. Financial Statements and Supplementary Data' (or click the 'Financial Statements' tab in EDGAR's viewer).",
    ko: "공시 유형(Form Type)을 10-K(연차보고서)로 걸러 가장 최근 것을 엽니다. 문서 안에서 'Item 8. Financial Statements and Supplementary Data' 섹션으로 이동합니다(또는 EDGAR 뷰어의 'Financial Statements' 탭 클릭).",
  },
  {
    en: "The three statements appear in order. INCOME STATEMENT (\"Consolidated Statements of Operations\"): top line = Revenue/Net sales; near the top = Operating income (EBIT); bottom line = Net income.",
    ko: "세 재무제표가 순서대로 나옵니다. 손익계산서(\"Consolidated Statements of Operations\"): 맨 윗줄 = 매출(Revenue/Net sales), 위쪽 = 영업이익(Operating income, EBIT), 맨 아랫줄 = 당기순이익(Net income).",
  },
  {
    en: "CASH-FLOW STATEMENT (\"Consolidated Statements of Cash Flows\") has three sections: OPERATING (find 'Net cash provided by operating activities' = OCF); INVESTING (find 'Purchases of property, plant and equipment' = CAPEX, shown negative); FINANCING (find 'Dividends paid'). FCF = OCF − CAPEX.",
    ko: "현금흐름표(\"Consolidated Statements of Cash Flows\")는 세 부분입니다: 영업활동('Net cash provided by operating activities' = 영업활동현금흐름 OCF); 투자활동('Purchases of property, plant and equipment' = CAPEX, 음수로 표시); 재무활동('Dividends paid' = 지급배당금). FCF = OCF − CAPEX.",
  },
  {
    en: "BALANCE SHEET (\"Consolidated Balance Sheets\"): total debt = short-term + long-term borrowings/debt; cash = 'Cash and cash equivalents'. You need both for EV = market cap + debt − cash.",
    ko: "재무상태표(\"Consolidated Balance Sheets\"): 총부채 = 단기 + 장기 차입금/사채, 현금 = 'Cash and cash equivalents'. 기업가치 EV = 시가총액 + 부채 − 현금에 둘 다 필요합니다.",
  },
  {
    en: "Read the exact line you need — that figure is what the analyzer's number should match. (For a REIT, the FFO/AFFO reconciliation is NOT here — it's in the earnings-release 8-K exhibit or the 10-K's MD&A/supplemental, starting from net income and adding back depreciation.)",
    ko: "필요한 항목을 정확히 읽습니다 — 그 값이 분석기 숫자와 일치해야 합니다. (리츠의 FFO/AFFO 조정표는 여기 없습니다 — 실적발표 8-K 첨부자료나 10-K의 MD&A/보충자료에 있으며, 순이익에서 출발해 감가상각을 다시 더합니다.)",
  },
];

/** Merger-arbitrage needs a DIFFERENT EDGAR path than the 10-K financials guide:
 *  the offer price lives in the deal 8-K / DEFM14A, not the annual statements.
 *  A dedicated written guide so the deal lab isn't scaffolded by the wrong one. */
export const MERGER_8K_STEPS: L[] = [
  {
    en: "On EDGAR full-text search, open the TARGET company's filings and set Form Type to 8-K — the current report a US company files within ~4 business days of a major event (here, the merger announcement).",
    ko: "EDGAR 전체 텍스트 검색에서 피인수(대상) 기업의 공시를 열고, 공시 유형을 8-K로 거릅니다 — 미국 기업이 중대한 사건(여기서는 합병 발표) 후 약 4영업일 내 제출하는 수시보고서입니다.",
  },
  {
    en: "Open the merger 8-K (its Item 1.01 'Entry into a Material Definitive Agreement') and its attached exhibit — the actual merger agreement. Do NOT open the 10-K annual financial statements; the offer price is not there.",
    ko: "합병 8-K(Item 1.01 '중요한 확정 계약 체결')와 첨부된 exhibit — 실제 합병계약서 — 를 엽니다. 10-K 연간 재무제표는 열지 마세요; 인수 가격은 거기 없습니다.",
  },
  {
    en: "In the agreement's opening recitals, find the phrase \"$X.XX per share in cash\" — that single figure is the OFFER PRICE, the top input to the spread. (In a stock deal it's an exchange ratio instead; this lab assumes all-cash.)",
    ko: "계약서 앞부분 낭독조항(recitals)에서 \"주당 $X.XX 현금(per share in cash)\" 문구를 찾습니다 — 그 한 숫자가 인수 가격이며 스프레드의 최상단 입력값입니다. (주식 딜이면 교환비율이지만, 이 랩은 전액 현금 가정.)",
  },
  {
    en: "For extra detail (timeline, closing conditions, break fee), open the later DEFM14A proxy — the booklet mailed to shareholders before the vote. Cross-check the price against the 8-K; they must agree.",
    ko: "더 자세한 내용(일정·종료조건·위약금)은 이후 나오는 DEFM14A 위임장 — 표결 전 주주에게 보내는 소책자 — 을 엽니다. 가격을 8-K와 교차 확인하세요; 서로 일치해야 합니다.",
  },
];

/** Getting the pre-announcement price is a one-day quote lookup — NOT a backtest.
 *  A written guide so the deal lab isn't scaffolded by YAHOO_SHOT's backtest tips. */
export const PRIOR_DAY_CLOSE_STEPS: L[] = [
  {
    en: "Open the target's price history on any quote site (Yahoo/Google Finance or your broker). You need ONE day, not a range.",
    ko: "아무 시세 사이트(Yahoo/Google Finance 또는 증권사)에서 대상 기업의 주가 이력을 엽니다. 기간이 아니라 단 하루가 필요합니다.",
  },
  {
    en: "Find the announcement date (the 8-K filing date), then read the ordinary Close of the single trading day BEFORE it. That is the break-price anchor — where the stock reverts if the deal dies.",
    ko: "발표일(8-K 제출일)을 찾고, 그 하루 전 거래일의 일반 종가(Close)를 읽습니다. 이것이 결렬 가격 기준점 — 딜이 무산되면 주가가 되돌아가는 수준입니다.",
  },
  {
    en: "Use the plain Close, NOT 'Adjusted Close': Adj Close is back-adjusted for dividends/splits that happen AFTER that date, so it isn't the level the stock actually traded at — and not the level it reverts to.",
    ko: "'수정 종가(Adj Close)'가 아니라 일반 Close를 쓰세요: 수정 종가는 그 날짜 이후의 배당·분할을 소급 반영한 값이라, 주가가 실제 거래되던 수준도, 되돌아갈 수준도 아닙니다.",
  },
];

// ---------------------------------------------------------------------------
// Growth investing (pilot) — reuses the CompanyLab growth analyzer.
// ---------------------------------------------------------------------------
