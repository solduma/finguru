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

/** SEC EDGAR blocks automated capture, so we give a written navigation guide. */
export const EDGAR_STEPS: L[] = [
  {
    en: "Go to the EDGAR full-text search and enter the company name or ticker.",
    ko: "EDGAR 전체 텍스트 검색으로 가서 회사명이나 티커를 입력합니다.",
  },
  {
    en: "Filter the form type to 10-K (annual report) and open the most recent one.",
    ko: "공시 유형을 10-K(연차보고서)로 걸러, 가장 최근 것을 엽니다.",
  },
  {
    en: "In the filing, open the financial statements and find the income statement, balance sheet, and cash-flow statement.",
    ko: "공시 문서에서 재무제표를 열어 손익계산서·재무상태표·현금흐름표를 찾습니다.",
  },
  {
    en: "Read the line item you need (e.g. Net income, Cash from operations) — this is the figure the analyzer's number should match.",
    ko: "필요한 항목(예: 당기순이익, 영업활동현금흐름)을 읽습니다 — 분석기 숫자가 일치해야 할 값입니다.",
  },
];

// ---------------------------------------------------------------------------
// Growth investing (pilot) — reuses the CompanyLab growth analyzer.
// ---------------------------------------------------------------------------
