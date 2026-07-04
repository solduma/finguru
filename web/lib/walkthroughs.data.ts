// The twelve non-pilot walkthroughs (the growth pilot lives in ./walkthroughs).
// Same WalkStep shape; split out purely to keep the model file readable.
import type { Walkthrough } from "./walkthroughs";
import {
  DART_SHOT,
  DART_STEPS,
  DART_CASHFLOW_SHOT,
  FRED_SHOT,
  YAHOO_SHOT,
  FRENCH_SHOT,
  CBOE_SHOT,
  EDGAR_STEPS,
} from "./walkthroughs.shots";

export const dividend: Walkthrough = {
  labId: "company-dividend",
  title: { en: "Dividend Safety Check", ko: "배당 안전성 점검" },
  goal: {
    en: "Decide whether a company's dividend is not just attractive but actually safe enough to rely on — using payout ratios, free-cash-flow coverage, and the dividend track record.",
    ko: "한 회사의 배당이 단지 매력적인지가 아니라, 믿고 의지할 만큼 안전한지를 판단합니다. 배당성향, 잉여현금흐름 커버리지, 그리고 배당 이력을 함께 봅니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "What we're actually deciding", ko: "우리가 실제로 결정하는 것" },
      body: {
        en: "A **dividend** is a cash payment a company sends to each shareholder, usually a few times a year — think of it as your slice of the profits, paid out to you instead of kept inside the company.\n\n**Dividend yield** is that annual cash-per-share as a percentage of the share price: if a stock costs 10,000원 and pays 400원 a year in dividends, its yield is 400 ÷ 10,000 = **4%**.\n\nA high yield is a promise the company has to keep paying for. So we don't stop at \"how big is the dividend\" — we ask, in order:\n- **Is the yield actually attractive** relative to what you could get elsewhere?\n- **Can earnings cover it?** — payout ratio of net income (how much of profit is paid out)\n- **Can real cash cover it?** — payout of free cash flow (real spare cash; cash is harder to fake than earnings)\n- **Has management kept the promise?** — a growth streak (years the per-share dividend rose in a row), or a past cut\n\nBy the end you'll say one thing: is this dividend **safe enough to rely on**, or not?",
        ko: "**배당**은 회사가 주주 각각에게 보내는 현금 지급으로, 보통 1년에 몇 차례 이루어집니다 — 회사가 안에 쌓아 두는 대신 여러분에게 나눠 주는 이익의 몫이라고 생각하면 됩니다.\n\n**배당수익률**은 그 연간 주당 현금을 주가에 대한 백분율로 나타낸 것입니다. 주가가 10,000원인 종목이 1년에 400원을 배당하면 수익률은 400 ÷ 10,000 = **4%**입니다.\n\n높은 배당수익률은 회사가 계속 지불해야 하는 약속입니다. 그래서 \"배당이 얼마나 큰가\"에서 멈추지 않고, 순서대로 질문합니다.\n- **수익률이 정말 매력적인가?** 다른 곳에서 얻을 수 있는 것과 비교해서요.\n- **이익으로 감당되는가?** — 순이익 대비 배당성향(이익 중 얼마를 배당으로 내주는가)\n- **진짜 현금으로 감당되는가?** — 잉여현금흐름 대비 배당(실제로 남는 여유 현금; 현금은 이익보다 꾸미기 어렵습니다)\n- **경영진이 약속을 지켜 왔는가?** — 배당 증가 이력(주당 배당이 몇 년 연속 올랐는지), 혹은 과거 삭감\n\n마지막에 한 가지만 답합니다. 이 배당은 **믿고 의지할 만큼 안전한가**, 아닌가?",
      },
    },
    {
      kind: "read",
      title: { en: "The three statements & the words you'll meet", ko: "세 가지 재무제표와 앞으로 만날 용어" },
      body: {
        en: "Before any numbers, here's the map. A company files **three financial statements**, each answering a different question:\n- **Income statement** — \"did we make a profit this year?\"\n- **Balance sheet** — \"what we own vs. what we owe, on one single day.\"\n- **Cash-flow statement** — \"where actual cash came in and went out,\" split into three sections: **operating** (cash from the core business), **investing** (cash spent on equipment and the like), and **financing** (cash to/from lenders and shareholders — **this is where dividends paid appear**).\n- **The notes** = the fine-print tables at the back of the filing that break the headline numbers down.\n\nAnd the five terms the rest of this walkthrough leans on — one plain sentence each:\n- **A note on the unit 억:** Korean filings count money in **억 = 100 million won** (100,000,000원). So 100억 = 10 billion won, and 250억 = 25 billion won. We use 억 as the money unit throughout.\n- **Net income** = profit after ALL costs, interest and taxes — the *bottom line*. It is not sales; sales is the *top line*.\n- **DPS (dividend per share)** = the dividend paid on ONE share for the year = total dividends ÷ number of shares. Example: pay 100억 (10 billion won) total across 10 million shares = 10,000,000,000 ÷ 10,000,000 = 1,000원 DPS.\n- **Capex (capital expenditure)** = cash spent buying or replacing long-lived equipment, buildings, machines — \"the cost of keeping the lights on and the factory running.\"\n- **Free cash flow (FCF)** = operating cash flow − capex — \"the cash actually left after the business paid its bills AND maintained itself; the money truly available to pay dividends.\"\n- **Non-cash items** = accounting entries like depreciation that reduce profit on paper but move no actual cash.\n\nDon't worry about memorizing these — the analyzer computes them for you. This page is here so the numbers mean something when you see them.",
        ko: "숫자를 보기 전에, 지도를 먼저 그려 둡니다. 회사는 **세 가지 재무제표**를 공시하고, 각각 다른 질문에 답합니다.\n- **손익계산서** — \"올해 이익을 냈는가?\"\n- **재무상태표** — \"어느 하루 기준으로, 가진 것과 갚아야 할 것.\"\n- **현금흐름표** — \"실제 현금이 어디서 들어오고 어디로 나갔는가\"를 세 부분으로 나눕니다: **영업활동**(핵심 사업에서 나온 현금), **투자활동**(장비 등에 쓴 현금), **재무활동**(대출기관·주주와 오간 현금 — **배당금 지급이 바로 여기 나옵니다**).\n- **주석** = 보고서 뒤쪽에서 대표 숫자들을 세부적으로 풀어 놓은 작은 글씨의 표.\n\n그리고 이 실습 나머지가 기대는 다섯 용어 — 각각 쉬운 한 문장씩입니다.\n- **단위 억에 대하여:** 한국 공시는 돈을 **억(1억 = 100,000,000원 = 1억 원)** 단위로 셉니다. 즉 100억 = 100억 원(10,000,000,000원), 250억 = 250억 원입니다. 이 실습 전체에서 억을 금액 단위로 씁니다.\n- **순이익** = 모든 비용·이자·세금을 뺀 뒤 남는 *맨 아랫줄* 숫자. 매출이 아닙니다(매출은 *맨 윗줄*).\n- **주당배당금(DPS)** = 한 주에 대해 1년간 지급된 배당 = 총 배당 ÷ 주식 수. 예: 총 100억 원(10,000,000,000원)을 1,000만(10,000,000) 주에 지급하면 DPS = 10,000,000,000 ÷ 10,000,000 = 1,000원.\n- **CAPEX(설비투자)** = 오래 쓰는 장비·건물·기계를 사거나 교체하는 데 쓴 현금 — \"공장을 계속 돌리는 데 드는 비용.\"\n- **잉여현금흐름(FCF)** = 영업활동현금흐름 − CAPEX — \"사업을 굴리고 스스로를 유지한 뒤 실제로 남는 현금; 배당에 진짜로 쓸 수 있는 돈.\"\n- **비현금 항목** = 감가상각비처럼 장부상 이익은 줄이지만 실제 현금은 움직이지 않는 회계 항목.\n\n이것들을 외우려 애쓰지 않아도 됩니다 — 분석기가 대신 계산해 줍니다. 이 페이지는 나중에 그 숫자들이 눈에 들어올 때 의미를 갖도록 하려는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터의 출처" },
      body: {
        en: "Dividends and cash flow live in the financial statements, not on a stock-quote site. We pull them from the primary filings so the numbers are the company's own reported figures. Dividends paid live in the **financing** section of the cash-flow statement (see the previous step); the **operating** cash flow and **capex** you need for FCF live in the **operating** and **investing** sections of that same statement.",
        ko: "배당과 현금흐름은 주가 사이트가 아니라 재무제표에 있습니다. 회사가 직접 공시한 숫자를 쓰기 위해 원천 공시에서 가져옵니다. 지급 배당은 현금흐름표의 **재무활동** 부분에 있고(앞 단계 참고), FCF에 필요한 **영업**현금흐름과 **CAPEX**는 같은 표의 **영업활동**·**투자활동** 부분에 있습니다.",
      },
      sources: [
        {
          name: { en: "OpenDART (Korea)", ko: "OpenDART (한국)" },
          what: { en: "Audited annual/quarterly filings for Korean listed companies. Dividends paid = 배당금의 지급 in the financing section (재무활동현금흐름); operating cash flow = 영업활동현금흐름; capex = 유형자산의 취득 in the investing section (투자활동현금흐름).", ko: "한국 상장사의 감사받은 사업보고서/분기보고서. 지급 배당 = 재무활동현금흐름 안의 배당금의 지급, 영업활동현금흐름, 그리고 투자활동현금흐름 안의 유형자산의 취득(CAPEX)." },
          why: { en: "It's the regulator's own database, so it's the source of record for KR fundamentals.", ko: "금융당국의 공식 데이터베이스라, 한국 기업 재무의 원천입니다." },
          url: "https://opendart.fss.or.kr/",
          shot: DART_SHOT,
          steps: DART_STEPS,
        },
        {
          name: { en: "OpenDART — inside the cash-flow statement", ko: "OpenDART — 현금흐름표 속으로" },
          what: { en: "The real 연결 현금흐름표 (consolidated cash-flow statement) from a filing — this is exactly where the three numbers sit, shown on an actual page instead of described.", ko: "공시 속 실제 연결 현금흐름표 — 세 숫자가 정확히 어디 있는지를 설명이 아니라 실제 페이지로 보여줍니다." },
          why: { en: "The front-door search gets you to the company; this shows you the exact rows to read once you're in the filing.", ko: "첫 화면 검색은 회사까지 데려다주고, 이 화면은 공시 안에서 읽어야 할 정확한 줄을 보여줍니다." },
          url: "https://dart.fss.or.kr/",
          shot: DART_CASHFLOW_SHOT,
        },
        {
          name: { en: "SEC EDGAR (US)", ko: "SEC EDGAR (미국)" },
          what: { en: "US company filings (10-K/10-Q). Dividends paid = \"Dividends paid\" / \"Cash dividends paid\" (financing section); operating cash flow = \"Net cash provided by operating activities\"; capex = \"Purchases of property, plant and equipment\" (investing section).", ko: "미국 기업 공시(10-K/10-Q). 지급 배당 = Dividends paid / Cash dividends paid(재무활동), 영업활동현금흐름 = Net cash provided by operating activities, CAPEX = Purchases of property, plant and equipment(투자활동)." },
          why: { en: "Same idea for US names: the filing is the primary, verifiable source.", ko: "미국 기업도 동일합니다. 공시가 검증 가능한 원천입니다." },
          url: "https://www.sec.gov/edgar/searchedgar/companysearch",
          steps: EDGAR_STEPS,
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull it yourself", ko: "직접 불러오기" },
      body: {
        en: "Type a ticker into the analyzer above and keep it in **dividend** mode. Read off five things:\n- **Dividend yield**\n- **Payout of earnings** (total dividends paid ÷ net income)\n- **Payout of free cash flow** (total dividends paid ÷ FCF)\n- **Dividend-growth streak** in years, and any **cut warning**\n- the **DPS-by-year chart** shape\n\nJot those five numbers down before you interpret anything — you'll judge each one in the next steps.\n\nThe analyzer computes all five for you — you don't calculate anything here. As a rough sanity check, yields usually land **0–8%**, and a healthy payout of earnings is typically about **20–70%**. A payout **over 100%** means the company paid out more than it earned that year (something you'll weigh carefully two steps from now); one you read as **250%** usually means a genuinely rough year OR a data quirk worth a second look, not necessarily a fatal problem. And when net income or FCF is negative the analyzer shows the ratio as *n.a.* rather than a negative number, so a blank cell isn't an error.\n\n**Example of what the tool is doing:** if the filing shows 100억 in dividends paid and 250억 in net income, payout of earnings = 100 ÷ 250 = **40%**. If operating cash flow was 300억 and capex was 120억, then FCF = 300 − 120 = 180억, so payout of FCF = 100 ÷ 180 ≈ **56%**. (The analyzer's FCF uses the **most recent fiscal year**, and its capex is 유형자산의 취득 only — it does not add 무형자산의 취득, so a hand-check that includes intangibles won't match.)",
        ko: "위 분석기에 종목 티커를 입력하고 **배당(dividend)** 모드로 둡니다. 다섯 가지를 읽어 적습니다.\n- **배당수익률**\n- **순이익 대비 배당성향** (총 지급배당금 ÷ 순이익)\n- **잉여현금흐름 대비 배당성향** (총 지급배당금 ÷ FCF)\n- **배당 증가 연속 연수**, 그리고 **삭감 경고** 여부\n- **연도별 주당배당금(DPS) 차트**의 모양\n\n해석하기 전에 이 다섯 숫자를 먼저 적어 두세요. 다음 단계에서 하나씩 판단합니다.\n\n분석기가 다섯 가지를 모두 계산해 줍니다 — 여기서 직접 계산할 것은 없습니다. 대략적인 점검으로, 배당수익률은 보통 **0~8%** 사이에 놓이고, 건전한 순이익 대비 배당성향은 대체로 **20~70%** 수준입니다. **100%를 넘는** 값은 그해에 번 것보다 많이 배당했다는 뜻이고(두 단계 뒤에서 자세히 따져 봅니다), **250%**처럼 읽히는 값은 대개 정말 힘든 해였거나 데이터 오류일 수 있어 한 번 더 확인할 대상이지 반드시 치명적인 문제는 아닙니다. 그리고 순이익이나 FCF가 음수면 분석기는 음수 대신 *n.a.*로 표시하므로, 빈 칸이 오류인 것은 아닙니다.\n\n**분석기가 하는 일 예시:** 공시에 지급배당금 100억, 순이익 250억이 나오면 순이익 대비 배당성향 = 100 ÷ 250 = **40%**. 영업활동현금흐름이 300억, CAPEX가 120억이면 FCF = 300 − 120 = 180억이고, FCF 대비 배당성향 = 100 ÷ 180 ≈ **56%**입니다. (분석기의 FCF는 **가장 최근 회계연도**를 쓰며, CAPEX는 유형자산의 취득만 사용하고 무형자산의 취득은 포함하지 않습니다. 그래서 무형자산을 넣어 손으로 계산하면 값이 맞지 않습니다.)",
      },
    },
    {
      kind: "read",
      title: { en: "Is the yield attractive — or a trap?", ko: "수익률이 매력적인가 — 아니면 함정인가?" },
      body: {
        en: "Yield is dividend ÷ price, so it rises when the dividend goes up **or when the price falls**. A yield far above peers is a flag, not a gift — the market may be **pricing in a coming cut** (pushing the price down because investors expect the dividend to be reduced soon).\n\nHere's the falling-price mechanism in numbers: say a stock pays 400원 a year. At a 10,000원 price that's a 4% yield; if the price drops to 5,000원 but the dividend hasn't changed, the yield jumps to 8% (400 ÷ 5,000) — the dividend didn't get better, the market got scared.\n\nRough rule of thumb: a broad market index yields only about **1–2% today** (roughly ~1.2% for the S&P 500, ~2% for the KOSPI). So a yield **2–4×** the index — call it the interesting band of about **2.5–5%** if the market yields ~1.2% — is worth a look; something like **8%+** on a stock that isn't a **REIT** or a fund deserves suspicion until you've checked coverage below. (A **REIT** — real-estate investment trust — is a company that owns rent-earning property like malls, offices and warehouses and is legally required to pay out most of its income to shareholders, so unusually high yields are normal there.) High yield never substitutes for the safety questions that follow.",
        ko: "수익률은 배당 ÷ 주가라, 배당이 오르거나 **주가가 떨어지면** 올라갑니다. 동종업계보다 훨씬 높은 수익률은 선물이 아니라 경고 신호입니다. 시장이 다가올 **삭감을 미리 반영**하는 중일 수 있습니다(투자자들이 곧 배당이 줄 것이라 예상해 주가를 미리 끌어내리는 것).\n\n주가 하락으로 수익률이 오르는 원리를 숫자로 보면: 한 종목이 1년에 400원을 배당한다고 합시다. 주가가 10,000원이면 수익률은 4%입니다. 주가가 5,000원으로 떨어졌는데 배당은 그대로면 수익률은 8%(400 ÷ 5,000)로 뛰어오릅니다 — 배당이 좋아진 게 아니라 시장이 겁을 먹은 것입니다.\n\n대략적인 기준으로, 넓은 시장 지수의 배당수익률은 **오늘날 약 1~2%**에 불과합니다(S&P 500은 약 1.2%, KOSPI는 역사적으로 약 2% 안팎). 그래서 지수의 **2~4배** 수익률 — 시장이 약 1.2%라면 대략 **2.5~5%**가 흥미로운 구간 — 은 살펴볼 만하고, **리츠(REIT)**나 펀드가 아닌데 **8% 이상**이면 아래 커버리지를 확인하기 전까지는 의심하는 편이 좋습니다. (**리츠(REIT, 부동산투자회사)**는 상가·오피스·물류창고 같은 임대 부동산을 보유하고, 법적으로 이익 대부분을 주주에게 분배해야 하는 회사입니다. 그래서 높은 배당수익률이 자연스럽습니다.) 높은 수익률이 뒤따르는 안전성 질문을 대신하지는 못합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Can earnings cover it? (payout of earnings)", ko: "이익으로 감당되는가? (순이익 대비 배당성향)" },
      body: {
        en: "Payout of earnings = total dividends paid ÷ net income (net income = the company's bottom-line profit after all costs, interest and taxes — from the glossary step). It tells you how much of each dollar of profit is being handed back.\n- **Under ~60%** leaves a buffer for a bad year and room to keep raising — generally safer.\n- **60–100%** can be normal for a mature, stable business, but there's little cushion.\n- **Over 100%** means the company is paying out more than it earned — funded from cash reserves or debt, which can't last. Treat it as a warning.\n\n**Example:** a company earns 5억 in net income and pays 3억 in dividends → payout of earnings = 3 ÷ 5 = **60%** — right at the top of the comfortable range, covered but with a thin cushion.\n\nCaveat: a **one-off charge** — a cost that hits once and won't repeat, e.g. a big **write-down** (marking an asset down because it lost value) or a lawsuit settlement — can shrink net income for a single year and make the payout ratio spike, even though the actual dividend is unchanged and fine. So a spike over 100% in one year isn't automatically fatal. Look at the trend, not one point.\n\n**Same ratio, two places in the filing.** A lesson often writes payout as **DPS ÷ EPS** (dividend per share ÷ earnings per share) — both read straight off the **income statement**. The analyzer instead computes **total dividends paid ÷ net income**, where the total dividends-paid figure comes from the **financing section of the cash-flow statement**. These are the same ratio (divide top and bottom of DPS ÷ EPS by share count and you get total dividends ÷ net income) — just sourced from different statements, so don't be thrown if you're reading two different lines. Note too that **dividend yield is NOT on the filing at all**: a statement has no share price, so you compute yield yourself as **DPS ÷ current market price**.",
        ko: "순이익 대비 배당성향 = 총 지급배당금 ÷ 순이익(순이익 = 모든 비용·이자·세금을 뺀 뒤 남는 회사의 맨 아랫줄 이익 — 용어 단계 참고). 이익 1원 중 얼마를 주주에게 돌려주는지를 나타냅니다.\n- **약 60% 미만**이면 나쁜 해를 견딜 여유와 배당을 계속 늘릴 여지가 있어 대체로 안전합니다.\n- **60~100%**는 성숙하고 안정적인 사업에서는 정상일 수 있지만, 완충 여력이 거의 없습니다.\n- **100% 초과**는 번 것보다 많이 지급한다는 뜻으로, 현금 유보나 부채로 메우는 것이라 오래갈 수 없습니다. 경고로 받아들이세요.\n\n**예시:** 한 회사가 순이익 5억을 벌고 3억을 배당하면 → 순이익 대비 배당성향 = 3 ÷ 5 = **60%** — 편안한 구간의 딱 위쪽 끝으로, 감당은 되지만 완충이 얇습니다.\n\n주의: **일회성 손실** — 한 번만 발생하고 반복되지 않는 비용, 예를 들어 자산가치 하락에 따른 대규모 **손상차손**(자산을 낮춰 잡는 것)이나 소송 합의금 — 은 특정 해의 순이익을 줄여 배당성향을 확 튀게 만들 수 있지만, 실제 배당 자체는 그대로 멀쩡할 수 있습니다. 그래서 한 해 100% 초과가 곧바로 치명적인 건 아닙니다. 한 점이 아니라 추세를 보세요.\n\n**같은 비율, 공시에서는 두 곳.** 교과서는 배당성향을 흔히 **DPS ÷ EPS**(주당배당금 ÷ 주당순이익)로 씁니다 — 둘 다 **손익계산서**에서 바로 읽습니다. 반면 분석기는 **총 지급배당금 ÷ 순이익**으로 계산하는데, 이때 총 지급배당금은 **현금흐름표의 재무활동 부분**에서 옵니다. 두 값은 같은 비율입니다(DPS ÷ EPS의 분자·분모를 각각 주식 수로 곱하면 총 배당 ÷ 순이익이 됩니다) — 단지 서로 다른 재무제표에서 가져올 뿐이니, 두 개의 다른 줄을 읽더라도 당황하지 마세요. 또한 **배당수익률은 공시에 아예 없다**는 점도 기억하세요: 재무제표에는 주가가 없으므로, 수익률은 **DPS ÷ 현재 시장가격**으로 직접 계산합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Can real cash cover it? (payout of free cash flow)", ko: "진짜 현금으로 감당되는가? (잉여현금흐름 대비 배당성향)" },
      body: {
        en: "This is the crux. **Free cash flow (FCF) = operating cash flow − capex** (영업활동현금흐름 − 유형자산의 취득). Both lines are in the cash-flow statement: operating cash flow in the **operating** section, capex in the **investing** section. FCF is the cash left after the business runs itself AND maintains its equipment — the pool dividends are really paid from. (**Capex** = cash spent buying or replacing long-lived equipment and buildings; **non-cash items** = costs like depreciation that reduce profit on paper but move no cash.)\n\nEarnings include non-cash items; cash doesn't. Dividends are paid in cash, so FCF coverage is the tougher, more honest test. If payout of earnings looks fine but **payout of FCF is over 100%**, the profit isn't turning into spendable cash — a classic red flag.\n\n**A quick note before the example** — you *read* operating cash flow straight off the operating section of the cash-flow statement (that's still where you get it). But it's worth seeing *why* it usually comes out higher than net income, because it explains the whole point of using cash instead of profit. Net income was already reduced by **depreciation** — an on-paper cost that spreads out the price of equipment over years but sends **no cash out the door this year**. Since no cash actually left for it, the cash-flow statement **adds that non-cash cost back**: operating cash flow ≈ net income + depreciation (+ other non-cash items). That add-back is exactly why cash can look healthier than profit. (Depreciation and other non-cash items are listed right in the operating section, so you can see the add-back on the statement itself — you don't have to trust the math.)\n\n**How profit and cash can disagree:** suppose net income is 200억, so a 100억 dividend is a comfy 50% payout of earnings. That profit was already knocked down by 80억 of **depreciation** (감가상각비 — a non-cash charge, so no cash actually left for it), so the operating section adds it back: operating cash flow ≈ 200 + 80 = **280억**. But the company also spent 260억 of real cash on capex, so FCF = 280 − 260 = **20억**. Now the 100억 dividend is 100 ÷ 20 = **500% of FCF** — paid out of savings or borrowing, not this year's cash. Earnings said fine; cash said danger.\n\nThe safest dividends are comfortably covered on **both** measures. FCF is lumpier than earnings (a big capex year can dent it), so again read a few years rather than one.",
        ko: "여기가 핵심입니다. **잉여현금흐름(FCF) = 영업활동현금흐름 − 유형자산의 취득(CAPEX)**입니다. 두 항목 모두 현금흐름표에 있습니다: 영업활동현금흐름은 **영업활동** 부분에, CAPEX는 **투자활동** 부분에 있습니다. FCF는 사업이 스스로를 굴리고 장비를 유지한 뒤에 남는 현금으로, 배당이 실제로 나오는 재원입니다. (**CAPEX** = 오래 쓰는 장비·건물을 사거나 교체하는 데 쓴 현금; **비현금 항목** = 감가상각비처럼 장부상 이익은 줄이지만 현금은 움직이지 않는 비용.)\n\n이익에는 비현금 항목이 섞여 있지만 현금에는 없습니다. 배당은 현금으로 지급되므로 FCF 커버리지가 더 엄격하고 정직한 시험입니다. 순이익 대비 배당성향은 괜찮아 보이는데 **FCF 대비 배당성향이 100%를 넘는다면**, 이익이 쓸 수 있는 현금으로 바뀌지 않는 것으로 전형적인 위험 신호입니다.\n\n**예시 전에 짚고 갈 것** — 영업활동현금흐름은 현금흐름표의 영업활동 부분에서 그대로 *읽어* 오는 값입니다(가져오는 곳은 여전히 거기입니다). 다만 그 값이 왜 대개 순이익보다 크게 나오는지 알아 두면, 이익 대신 현금을 보는 이유가 분명해집니다. 순이익은 이미 **감가상각비**만큼 깎여 있습니다 — 감가상각비는 장비 값을 여러 해에 나눠 반영하는 장부상 비용일 뿐, **올해 실제 현금이 나가지는 않습니다**. 실제로 나간 현금이 없으니 현금흐름표는 이 비현금 비용을 **다시 더해 줍니다**: 영업활동현금흐름 ≈ 순이익 + 감가상각비(+ 기타 비현금 항목). 이 되더하기 때문에 현금이 이익보다 건강해 보일 수 있는 것입니다. (감가상각비 등 비현금 항목은 영업활동 부분에 그대로 적혀 있어, 되더하는 과정을 표에서 직접 눈으로 확인할 수 있습니다 — 계산을 믿을 필요가 없습니다.)\n\n**이익과 현금이 어긋나는 방식:** 순이익이 200억이라고 하면 100억 배당은 편안한 50% 순이익 배당성향입니다. 그 이익은 이미 80억의 **감가상각비**(비현금 비용이라 실제 현금이 나가지 않음)만큼 깎여 있었으므로, 영업활동 부분은 이를 다시 더합니다: 영업활동현금흐름 ≈ 200 + 80 = **280억**. 그런데 회사는 실제 현금 260억을 CAPEX로 썼으므로 FCF = 280 − 260 = **20억**입니다. 이제 100억 배당은 100 ÷ 20 = **FCF의 500%** — 올해 번 현금이 아니라 저축이나 차입에서 지급된 것입니다. 이익은 괜찮다 했지만 현금은 위험하다고 말합니다.\n\n가장 안전한 배당은 **두 지표 모두**에서 여유 있게 감당됩니다. FCF는 이익보다 변동이 커서(대규모 설비투자가 있는 해에는 크게 줄 수 있음), 역시 한 해가 아니라 몇 해를 함께 봐야 합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Has management kept the promise?", ko: "경영진이 약속을 지켜 왔는가?" },
      body: {
        en: "The chart and the streak tell you about discipline. The chart's y-axis is **DPS (dividend per share)** — the dividend paid on a single share for the year — so a rising line means the payout per share grew.\n- A **long growth streak** signals a management that treats the dividend as a commitment and has the earnings to back it. Concretely: **10+ consecutive years** of rising DPS is genuinely strong (in the US, S&P 500 companies that have raised their dividend for **25+ straight years** are called **Dividend Aristocrats**); **3–5 years** is a decent start; one or two years tells you little. Korea has no equivalent formal badge, and long unbroken raising streaks are rarer there, so even a steady **5–10 year** record stands out.\n- A flat-but-steady DPS is fine — reliable if unexciting.\n- **A past cut is a broken promise.** The analyzer flags any year DPS fell. A cut doesn't mean \"never\", but it tells you this dividend can and did bend under pressure — weigh it heavily.\n\nRemember the streak is history, not a guarantee. A 20-year streak can still end next year if the business breaks.",
        ko: "차트와 연속 증가 연수는 경영진의 규율을 보여 줍니다. 차트의 세로축은 **주당배당금(DPS)** — 한 주에 대해 1년간 지급된 배당 — 이므로, 선이 올라간다는 것은 주당 배당이 늘었다는 뜻입니다.\n- **긴 증가 이력**은 배당을 약속으로 여기고 이를 뒷받침할 이익이 있는 경영진을 시사합니다. 구체적으로: DPS가 **10년 이상 연속** 오르면 정말 강한 신호이고(미국에서는 배당을 **25년 이상 연속** 늘린 S&P 500 기업을 **배당 귀족주(Dividend Aristocrats)**라 부릅니다), **3~5년**이면 괜찮은 출발이며, 한두 해로는 알기 어렵습니다. 한국에는 이에 상응하는 공식 명칭이 없고, 오랜 연속 증가 이력 자체가 드물어 **5~10년**만 꾸준해도 눈에 띕니다.\n- 늘지 않아도 꾸준한 DPS는 괜찮습니다. 화려하지 않아도 믿을 만합니다.\n- **과거의 삭감은 깨진 약속입니다.** 분석기는 DPS가 줄어든 해를 표시합니다. 삭감이 \"다시는 안 됨\"을 뜻하진 않지만, 이 배당이 압박을 받으면 휘어질 수 있고 실제로 휘었음을 알려 줍니다. 무겁게 받아들이세요.\n\n연속 이력은 과거일 뿐 보장이 아닙니다. 20년 이력도 사업이 무너지면 내년에 끝날 수 있습니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Combine the four answers. A reliable dividend usually clears all four: attractive yield, covered by earnings AND by cash, with an unbroken record.",
        ko: "네 답을 합치세요. 믿을 만한 배당은 대개 네 가지를 다 통과합니다: 매력적인 수익률, 이익과 현금 모두로 감당, 그리고 깨지지 않은 이력.",
      },
      prompt: {
        en: "Write it down: Is this dividend safe enough to rely on — **rely / watch / avoid**? In two or three sentences, name the yield, both payout ratios, and the track record, then state which one drove your decision. If you'd rely on it, say what would make you change your mind (e.g. \"if FCF payout goes over 100% two years running\").",
        ko: "직접 적어 보세요. 이 배당은 믿고 의지할 만큼 안전한가 — **의지 / 관찰 / 회피**? 두세 문장으로 수익률, 두 배당성향, 배당 이력을 적고, 어느 지표가 결정을 이끌었는지 밝히세요. 의지하겠다면, 무엇이 바뀌면 생각을 바꿀지도 적으세요(예: \"FCF 배당성향이 2년 연속 100%를 넘으면\").",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론과 다음 행동" },
      body: {
        en: "You now have a defensible view of dividend safety built from coverage, not just yield. Before you act on it, close the loop:",
        ko: "이제 수익률만이 아니라 커버리지에서 나온, 근거 있는 배당 안전성 판단을 갖게 되었습니다. 실행에 옮기기 전에 마무리하세요:",
      },
      checklist: [
        { en: "Confirm the dividend and FCF figures against the company's actual filing — dividends paid in the financing section of the cash-flow statement, and FCF = operating cash flow − capex from the operating and investing sections (OpenDART / EDGAR), not just the analyzer.", ko: "배당과 FCF 수치를 회사의 실제 공시와 대조해 확인했다 — 지급 배당은 현금흐름표의 재무활동 부분, FCF = 영업활동현금흐름 − CAPEX(영업활동·투자활동 부분)이며, 분석기(OpenDART / EDGAR)만 믿지 않았다." },
        { en: "Check both payout ratios over several years, not a single year, to rule out a one-off distortion.", ko: "일회성 왜곡을 배제하기 위해 두 배당성향을 한 해가 아니라 여러 해에 걸쳐 확인했다." },
        { en: "Note explicitly whether there has ever been a cut, and how the company explained it.", ko: "과거 삭감이 있었는지, 회사가 그것을 어떻게 설명했는지 명시적으로 기록했다." },
        { en: "Write your rely/watch/avoid call and the trigger that would change it.", ko: "의지/관찰/회피 판단과 그것을 바꿀 방아쇠를 적었다." },
        { en: "Remember this is a hypothesis about safety, not a recommendation to buy — past discipline doesn't guarantee future payments.", ko: "이것은 안전성에 대한 가설이지 매수 추천이 아니며, 과거의 규율이 미래 지급을 보장하지 않음을 기억한다." },
      ],
    },
  ],
};

export const value: Walkthrough = {
  labId: "company-value",
  title: { en: "Intrinsic Value & Margin of Safety", ko: "내재가치와 안전마진" },
  goal: {
    en: "Estimate what a business is roughly worth with a conservative two-stage DCF, compare it to today's price, and decide whether there's a real margin of safety — while staying honest about how much of your answer rests on distant assumptions.",
    ko: "보수적인 2단계 DCF로 사업의 대략적인 가치를 추정하고, 오늘의 주가와 비교해 진짜 안전마진이 있는지 판단합니다. 그 답의 얼마만큼이 먼 미래 가정에 기대고 있는지에 대해서는 정직함을 유지합니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "What we're actually deciding", ko: "우리가 실제로 결정하는 것" },
      body: {
        en: "Value investing is one question asked carefully: **is the price today below what the business is worth?** To answer it we go in order:\n- What are **conservative** assumptions for growth, terminal growth, and discount rate?\n- What **intrinsic value per share** do those give?\n- How big is the **margin of safety** versus the current price?\n- How much of that value is just **terminal value** — (a lump-sum estimate of all the cash after year 5 — defined in the next steps)?\n- As a sanity check, does a no-forecast yardstick (**earnings yield / return on capital**) agree?\n\nDon't worry that this list has a lot of new words — **DCF, discounting, discount rate, and terminal value are all defined in the next steps**, one at a time. The goal isn't a precise number — it's deciding whether there's enough of a cushion to be wrong and still be fine.",
        ko: "가치투자는 신중하게 던지는 한 가지 질문입니다. **오늘의 가격이 사업의 가치보다 낮은가?** 답하기 위해 순서대로 갑니다.\n- 성장률, 영구성장률, 할인율에 대한 **보수적인** 가정은 무엇인가?\n- 그 가정이 주는 **주당 내재가치**는 얼마인가?\n- 현재 주가 대비 **안전마진**은 얼마나 큰가?\n- 그 가치 중 얼마가 **잔존가치**, 즉 (5년 이후의 모든 현금을 하나의 금액으로 추정한 값 — 다음 단계에서 정의합니다)인가?\n- 점검용으로, 예측이 필요 없는 잣대(**이익수익률 / 자본이익률**)도 같은 방향을 가리키는가?\n\n낯선 용어가 많다고 걱정하지 마세요. **DCF, 할인, 할인율, 잔존가치는 모두 다음 단계에서** 하나씩 정의합니다. 목표는 정밀한 숫자가 아닙니다. 틀려도 괜찮을 만큼 완충이 충분한지를 판단하는 것입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "What a DCF is (plain version)", ko: "DCF란 무엇인가 (쉽게)" },
      body: {
        en: "This whole lab is a **DCF** — short for **discounted cash flow**. It's the method named in the goal above, and the idea behind it is simpler than the acronym.\n\n**The one core idea:** money you'll get in the future is worth *less* than money today. A promise of \\$100 in 10 years is worth less than \\$100 in your hand right now — because you could invest today's money and grow it, and because the future is uncertain (the promise might not be kept). So before we add up a company's future cash, we **shrink** each future year's cash back to its **present value** (what it's worth to you *today*). That shrinking is called **discounting**.\n\n**Discount rate** = the yearly percentage we shrink by. In plain terms it's the annual return you'd demand for tying up your money in this business, given its risk. A reasonable anchor is **~8–10% for an ordinary, established company**, higher for riskier or less predictable ones. (One tiny worked line: **\\$110 arriving next year, discounted at 10%, is worth \\$110 ÷ 1.10 = \\$100 today.**)\n\n**\"Two-stage\"** means we split the future in two:\n- **Stage 1:** forecast the next ~5 years of cash, one year at a time, and discount each back to today.\n- **Stage 2:** a single lump-sum **terminal value** that stands in for *every year after* year 5 (we can't forecast decade by decade forever).\n\n**Intrinsic value = (present value of the 5 forecast years) + (present value of the terminal value).** Divide that whole-company value by the number of shares and you get the **intrinsic value per share** — a price you can compare directly to today's stock price.",
        ko: "이 실습 전체가 **DCF** — **discounted cash flow(현금흐름 할인)**의 줄임말 — 입니다. 위 목표에 적힌 바로 그 방법이며, 약자보다 훨씬 단순한 생각입니다.\n\n**핵심 한 가지:** 미래에 받을 돈은 오늘의 돈보다 *가치가 낮습니다*. 10년 뒤에 받을 100달러는 지금 손에 든 100달러보다 못합니다. 오늘의 돈은 투자해 불릴 수 있고, 미래는 불확실하기 때문입니다(약속이 안 지켜질 수도 있죠). 그래서 회사의 미래 현금을 더하기 전에, 각 미래 연도의 현금을 **오늘 가치(현재가치)**로 **줄입니다**. 이 줄이는 작업을 **할인**이라고 합니다.\n\n**할인율** = 매년 줄이는 비율(%)입니다. 쉽게 말해 이 사업의 위험을 감수하고 돈을 묶어 두는 대가로 요구하는 연간 수익률입니다. 무난한 기준은 **평범하고 안정된 기업이라면 약 8~10%**, 위험하거나 예측이 어려운 기업일수록 더 높게 잡습니다. (짧은 예: **1년 뒤에 받을 110달러를 10%로 할인하면 110 ÷ 1.10 = 오늘의 100달러**입니다.)\n\n**\"2단계\"**는 미래를 둘로 나눈다는 뜻입니다.\n- **1단계:** 향후 약 5년의 현금을 한 해씩 예측하고, 각각을 오늘 가치로 할인합니다.\n- **2단계:** 5년 *이후의 모든 해*를 대신하는 하나의 금액, **잔존가치**를 계산합니다(수십 년을 영원히 한 해씩 예측할 수는 없으니까요).\n\n**내재가치 = (예측한 5년의 현재가치) + (잔존가치의 현재가치).** 이 회사 전체 가치를 주식 수로 나누면 **주당 내재가치**가 나오고, 이는 오늘의 주가와 곧바로 비교할 수 있는 가격입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터의 출처" },
      body: {
        en: "A DCF is only as good as the numbers you feed it, and those come from the company's filings. The analyzer pulls them for you and seeds the sliders — but knowing what each one *means* and *where it lives* lets you sanity-check the tool by hand. Here are the five seed inputs in plain language:\n- **Free cash flow (FCF)** = the real cash left after the business pays its running costs **and** its capital spending. Formula: **FCF = operating cash flow − capital expenditures (CAPEX)**. Both lines are on the **cash-flow statement (현금흐름표)**; in Korean filings that's **영업활동현금흐름** minus **유형자산의 취득 (CAPEX)**. (On the filing CAPEX is already shown as a negative outflow, so in words it's \"operating cash minus the money spent on equipment.\")\n- **Operating income**, also called **EBIT (Earnings Before Interest and Taxes)** = profit from the core business *before* financing costs and taxes; it sits near the top of the **income statement (손익계산서)**, usually labeled **영업이익**.\n- **Invested capital** (as this tool measures it) = the company's net worth on the books — everything it owns minus everything it owes (assets − liabilities), i.e. **shareholders' equity** — the capital that has to earn a return.\n- **Total debt and cash** — needed later for **enterprise value (EV) = market cap + total debt − cash**. Both live on the **balance sheet (재무상태표)**: sum the short- and long-term borrowings (단기차입금 + 장기차입금 + 사채) for total debt, and read cash & cash-equivalents (현금및현금성자산). EV is the one figure the tool doesn't hand you pre-built, so this is where you assemble it.\n- **Share count** = how many shares exist, used to turn a whole-company value into a per-share value.",
        ko: "DCF는 넣는 숫자만큼만 좋고, 그 숫자는 회사의 공시에서 나옵니다. 분석기가 대신 불러와 슬라이더를 초기화하지만, 각 숫자가 *무엇을 뜻하고* *어디에 있는지*를 알면 도구를 손으로 직접 점검할 수 있습니다. 다섯 가지 초기 입력값을 쉬운 말로 정리하면 다음과 같습니다.\n- **잉여현금흐름(FCF)** = 사업이 운영비용 **그리고** 설비투자까지 치르고 실제로 남는 현금. 공식: **FCF = 영업활동현금흐름 − 유형자산의 취득(CAPEX)**. 두 항목 모두 **현금흐름표**에 있습니다(미국은 cash-flow statement). (공시에서 CAPEX는 이미 마이너스 유출로 표시되므로, 말로 하면 \"영업현금에서 설비에 쓴 돈을 뺀 것\"입니다.)\n- **영업이익**, 즉 **EBIT(이자·세금 차감 전 이익)** = 금융비용과 세금을 빼기 *전*, 본업에서 번 이익. **손익계산서** 위쪽에 있으며 보통 **영업이익**으로 표기됩니다.\n- **투하자본**(이 도구 기준) = 회사가 가진 것에서 갚아야 할 것을 뺀 장부상 순자산(자산 − 부채), 즉 **자기자본** — 수익을 내야 하는 자본입니다.\n- **총부채와 현금** — 뒤에서 쓸 **기업가치(EV) = 시가총액 + 총부채 − 현금**에 필요합니다. 둘 다 **재무상태표**에 있습니다: 총부채는 단기·장기 차입금을 합하고(단기차입금 + 장기차입금 + 사채), 현금은 현금및현금성자산을 읽습니다. EV는 도구가 미리 만들어 주지 않는 유일한 값이라, 바로 여기서 여러분이 직접 조립합니다.\n- **주식 수** = 발행된 주식의 개수. 회사 전체 가치를 주당 가치로 바꾸는 데 씁니다.",
      },
      sources: [
        {
          name: { en: "OpenDART (Korea)", ko: "OpenDART (한국)" },
          what: { en: "For KR companies: FCF from the cash-flow statement (영업활동현금흐름 − 유형자산의 취득), EBIT from the income statement (영업이익), plus equity/liabilities and share count from the balance sheet.", ko: "한국 기업: 현금흐름표의 FCF(영업활동현금흐름 − 유형자산의 취득), 손익계산서의 EBIT(영업이익), 그리고 재무상태표의 자기자본·부채와 주식 수." },
          why: { en: "Your growth and terminal assumptions should be grounded in this actual history, not hope.", ko: "성장률과 잔존가치 가정은 희망이 아니라 이 실제 이력에 근거해야 합니다." },
          url: "https://opendart.fss.or.kr/",
          shot: DART_SHOT,
          steps: DART_STEPS,
        },
        {
          name: { en: "OpenDART — inside the cash-flow statement", ko: "OpenDART — 현금흐름표 속으로" },
          what: { en: "The real 연결 현금흐름표 (consolidated cash-flow statement) from a filing — this is exactly where the three numbers sit, shown on an actual page instead of described.", ko: "공시 속 실제 연결 현금흐름표 — 세 숫자가 정확히 어디 있는지를 설명이 아니라 실제 페이지로 보여줍니다." },
          why: { en: "The front-door search gets you to the company; this shows you the exact rows to read once you're in the filing.", ko: "첫 화면 검색은 회사까지 데려다주고, 이 화면은 공시 안에서 읽어야 할 정확한 줄을 보여줍니다." },
          url: "https://dart.fss.or.kr/",
          shot: DART_CASHFLOW_SHOT,
        },
        {
          name: { en: "SEC EDGAR (US)", ko: "SEC EDGAR (미국)" },
          what: { en: "The same fundamentals for US names from 10-K/10-Q: FCF from the cash-flow statement (operating cash flow − CAPEX), EBIT from the income statement (operating income), equity and share count from the balance sheet.", ko: "미국 기업의 동일한 데이터, 10-K/10-Q에서: 현금흐름표의 FCF(영업현금흐름 − CAPEX), 손익계산서의 EBIT(영업이익), 재무상태표의 자기자본과 주식 수." },
          why: { en: "Primary source for the FCF and EBIT the model depends on.", ko: "모델이 의존하는 FCF와 EBIT의 원천입니다." },
          url: "https://www.sec.gov/edgar/searchedgar/companysearch",
          steps: EDGAR_STEPS,
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull it yourself", ko: "직접 불러오기" },
      body: {
        en: "Enter a ticker and switch the analyzer to **value** mode. Then set the three sliders **conservatively**:\n- **FCF growth (next 5 yrs)** — the tool does *not* show you the company's recent FCF growth in value mode, and it defaults this slider to a fixed **8%, which is already optimistic**. To ground it, compute the past growth yourself: pull FCF (operating cash flow − CAPEX) for **the latest year and a few years back** from the filings, then use **(this year ÷ that year) − 1** for a rough total change. (Worked example: FCF of **150** now vs **100** three years ago is 150 ÷ 100 − 1 = **50%** total; spread over 3 years that's roughly **14% a year** — the per-year figure is what the slider wants.) Set the slider *at or below* that history, or — if unsure or if past FCF is lumpy — just start with a small single-digit number. (The analyzer's **dividend mode**, a different tab of this same tool, lists FCF year by year if you'd rather read the history than compute it.)\n- **Terminal growth** — a small number (roughly a long-run GDP/inflation rate, e.g. 2–3%). It **must be below your discount rate**: if terminal growth ever equalled or exceeded the discount rate, the terminal-value math blows up to infinity (the business would out-earn the cost of money forever, which is impossible), so the tool won't give a sane number.\n- **Discount rate** — your required return. A common range is **~8–10% for an ordinary company; use the higher end for riskier businesses.**\n\nRead off the outputs, noting their units:\n- **intrinsic value per share** — a currency *price* (₩ for KR tickers, \\$ for US), directly comparable to the current price.\n- **margin of safety** and **% of value from terminal value** — percentages.\n- **earnings yield (EBIT/EV)** and **return on capital** — percentages. (\"EV\" is *enterprise value*, defined in the cross-check step below.)\n\nAlso note whether the terminal-value warning is showing.",
        ko: "티커를 입력하고 분석기를 **가치(value)** 모드로 바꿉니다. 그런 다음 세 슬라이더를 **보수적으로** 설정합니다.\n- **FCF 성장률(향후 5년)** — 가치 모드에서는 회사의 최근 FCF 성장률이 *표시되지 않으며*, 이 슬라이더의 기본값은 고정 **8%로 이미 낙관적**입니다. 근거를 잡으려면 과거 성장률을 직접 계산하세요. 공시에서 **최근 연도와 몇 해 전**의 FCF(영업활동현금흐름 − CAPEX)를 뽑아, **(올해 ÷ 그해) − 1**로 대략의 전체 변화율을 구합니다. (예시: 지금 FCF가 **150**, 3년 전이 **100**이면 150 ÷ 100 − 1 = 전체 **50%**; 3년에 나눠 보면 연 약 **14%** — 슬라이더가 원하는 건 이 연간 수치입니다.) 슬라이더를 그 과거치 *이하*로 설정하거나, 확실치 않거나 과거 FCF가 들쭉날쭉하면 그냥 한 자릿수의 작은 값에서 시작하세요. (같은 도구의 다른 탭인 분석기 **배당 모드**는 계산하기 싫다면 FCF를 연도별로 나열해 보여 줍니다.)\n- **영구성장률** — 작은 수(대략 장기 GDP/물가 상승률, 예: 2~3%). **반드시 할인율보다 낮아야 합니다.** 영구성장률이 할인율과 같거나 크면 잔존가치 계산이 무한대로 폭주하기 때문입니다(사업이 자본비용을 영원히 앞지른다는 뜻이라 불가능합니다). 그래서 도구가 정상적인 값을 내주지 않습니다.\n- **할인율** — 당신이 요구하는 수익률. **평범한 기업은 약 8~10%가 무난하고, 위험한 사업일수록 높게** 잡습니다.\n\n결과를 단위와 함께 읽어 적습니다.\n- **주당 내재가치** — 통화 단위의 *가격*(한국주는 ₩, 미국주는 \\$)으로, 현재 주가와 곧바로 비교됩니다.\n- **안전마진**과 **잔존가치가 차지하는 비중(%)** — 백분율.\n- **이익수익률(EBIT/EV)**과 **자본이익률** — 백분율. (\"EV\"는 *기업가치*로, 아래 교차 확인 단계에서 정의합니다.)\n\n잔존가치 경고가 떠 있는지도 확인하세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Set conservative inputs first", ko: "먼저 보수적인 가정을 세운다" },
      body: {
        en: "A DCF will output whatever you feed it, so the discipline is in the inputs. Two habits keep you honest:\n- **Anchor growth to the past, then haircut it.** If FCF grew 8% historically, testing 4–5% forces the business to earn your optimism.\n- **Keep terminal growth humble.** No company outgrows the whole economy forever, so a terminal rate above ~3% is usually wishful.\n\nSee it for yourself: on a rough example, dropping the 5-year FCF growth from **8% to 4%** might cut the **intrinsic value per share by something like a fifth** (the exact swing depends on the company — its terminal share, debt and share count — so this is a direction and rough size, not a fixed fact). Run it both ways in the tool and read the two per-share numbers to see *your* stock's swing. A value that only works with aggressive inputs isn't a bargain — it's a bet.",
        ko: "DCF는 넣는 대로 뱉어내므로, 규율은 입력값에 있습니다. 두 가지 습관이 정직함을 지켜 줍니다.\n- **성장률을 과거에 고정하고, 거기서 깎으세요.** 과거 FCF가 8% 성장했다면 4~5%로 시험해 사업이 당신의 낙관을 스스로 증명하게 만드세요.\n- **영구성장률은 겸손하게.** 어떤 회사도 경제 전체를 영원히 앞지르지 못하므로, 약 3%를 넘는 영구성장률은 대개 희망사항입니다.\n\n직접 확인해 보세요. 대략적인 예로 5년 FCF 성장률을 **8%에서 4%로** 낮추면 **주당 내재가치가 5분의 1가량** 줄 수 있습니다(정확한 폭은 기업마다 다릅니다 — 잔존가치 비중, 부채, 주식 수에 따라 달라지므로 이것은 방향과 대략적 크기일 뿐 고정된 사실이 아닙니다). 도구에서 두 가지로 돌려 두 주당 값을 읽고 *당신* 종목의 변동 폭을 확인하세요. 공격적인 입력값에서만 성립하는 가치는 저가 매수가 아니라 베팅입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the margin of safety", ko: "안전마진 읽기" },
      body: {
        en: "Margin of safety = how far the current price sits **below** your intrinsic value. It exists because your estimate is uncertain, so you want to be paid for that uncertainty.\n\n**Formula: margin of safety = (intrinsic value − price) ÷ intrinsic value.** Worked example: if your intrinsic value is **100** and the price is **70**, the margin is (100 − 70) ÷ 100 = **30%** — you're paying 70 for something you think is worth 100.\n- A **positive margin (price below value)** is the whole point; the bigger, the more room to be wrong.\n- A rough bar many value investors use is **~25%+** before acting; more for shakier businesses. To turn that into a target price, invert the formula: to get a 25% cushion you'd want to pay **at most value × (1 − 0.25)**. On a value of 100 that's a price of **75 or below**.\n- **Negative margin (price above your value)** means no cushion at these assumptions — pass, or revisit whether your inputs were too pessimistic.\n\nThe cushion is your protection against a modeling error, not a target return.",
        ko: "안전마진 = 현재 주가가 당신이 계산한 내재가치보다 **얼마나 아래**에 있는지입니다. 당신의 추정이 불확실하기 때문에 존재하며, 그 불확실성에 대한 대가를 받고자 하는 것입니다.\n\n**공식: 안전마진 = (내재가치 − 가격) ÷ 내재가치.** 예: 내재가치가 **100**이고 가격이 **70**이면 안전마진은 (100 − 70) ÷ 100 = **30%** — 100의 가치라고 보는 것을 70에 사는 셈입니다.\n- **양(+)의 마진(가치보다 낮은 주가)**이 핵심입니다. 클수록 틀릴 여지가 큽니다.\n- 많은 가치투자자가 쓰는 대략적 기준은 실행 전 **약 25% 이상**이며, 불안정한 사업일수록 더 크게 봅니다. 이를 목표가로 바꾸려면 공식을 뒤집습니다. 25% 여유를 원하면 최대 **내재가치 × (1 − 0.25)**까지만 지불합니다. 내재가치가 100이면 **75 이하**의 가격입니다.\n- **음(-)의 마진(가치보다 높은 주가)**은 이 가정에서 완충이 없다는 뜻입니다. 지나치거나, 입력값이 지나치게 비관적이지 않았는지 다시 보세요.\n\n완충은 목표 수익률이 아니라 모델링 오류에 대한 보호막입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Distrust value that's mostly terminal", ko: "잔존가치에 쏠린 가치를 의심하라" },
      body: {
        en: "Recall the **terminal value** is the single lump sum standing in for all cash past the 5-year forecast — the most distant, least knowable part. The analyzer shows **what % of intrinsic value comes from it** and warns when that share is high (over ~60%).\n- If **most of the value** (say well over ~70–75%) sits in the terminal, your \"valuation\" is really a bet on assumptions decades out.\n- **How the terminal value is built:** take the **last forecast year's FCF (year 5)**, grow it **one more year** at the terminal rate to get the first \"forever\" year's cash, then divide that by **(discount rate − terminal growth)**. In symbols: **terminal value = year-5 FCF × (1 + terminal growth) ÷ (discount rate − terminal growth)**. (The division is just the shortcut for adding up an ever-growing cash stream that never ends.) Mini-example: if year-5 FCF is **100**, terminal growth **2%**, discount **9%**, the top is 100 × 1.02 = **102** and the terminal value is 102 ÷ 0.07 ≈ **1,457** — so you can hand-check the tool's terminal figure from its year-5 cash.\n- **Why a small change swings so much:** the denominator **(discount rate − terminal growth)** is a *small* number, and shrinking a small number a little makes the result jump a lot. Same example, nudge terminal growth from **2% to 3%**: the gap goes from **7% to 6%** (and the top edges up to 100 × 1.03 = 103), so the terminal value rises from ≈1,457 to 103 ÷ 0.06 ≈ **1,717** — roughly **+18%** from that half-hidden change alone.\n\nThis doesn't make the stock bad, but it means your margin of safety needs to be larger and your terminal-growth assumption extra humble.",
        ko: "**잔존가치**는 5년 예측 이후의 모든 현금을 대신하는 하나의 금액 — 가장 멀고 가장 알기 어려운 부분 — 임을 떠올리세요. 분석기는 **내재가치 중 잔존가치의 비중(%)**을 보여 주고, 그 비중이 높으면(약 60% 초과) 경고합니다.\n- **가치의 대부분**(가령 약 70~75%를 훌쩍 넘는)이 잔존가치에 있다면, 당신의 \"가치평가\"는 사실상 수십 년 뒤 가정에 대한 베팅입니다.\n- **잔존가치를 만드는 법:** **마지막 예측 연도(5년 차)의 FCF**를 가져와 영구성장률로 **한 해 더** 성장시켜 첫 \"영구\" 연도의 현금을 구한 뒤, 이를 **(할인율 − 영구성장률)**로 나눕니다. 식으로: **잔존가치 = 5년 차 FCF × (1 + 영구성장률) ÷ (할인율 − 영구성장률)**. (나눗셈은 끝없이 조금씩 늘어나는 현금 흐름을 모두 더하는 지름길일 뿐입니다.) 예시: 5년 차 FCF가 **100**, 영구성장률 **2%**, 할인율 **9%**이면 위쪽은 100 × 1.02 = **102**, 잔존가치는 102 ÷ 0.07 ≈ **1,457** — 그래서 도구의 잔존가치를 5년 차 현금으로 손수 확인할 수 있습니다.\n- **작은 변화가 크게 흔드는 이유:** 분모 **(할인율 − 영구성장률)**은 *작은* 수라, 작은 수를 조금 줄이면 결과가 크게 뜁니다. 같은 예에서 영구성장률을 **2%에서 3%로** 올리면 차이는 **7%에서 6%로** 줄고(위쪽도 100 × 1.03 = 103으로 조금 오릅니다), 잔존가치는 ≈1,457에서 103 ÷ 0.06 ≈ **1,717**로 — 이 반쯤 숨은 변화만으로 약 **+18%** 커집니다.\n\n이것이 주식을 나쁘게 만들지는 않지만, 그만큼 안전마진은 더 커야 하고 영구성장률 가정은 한층 더 겸손해야 합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Cross-check with a no-forecast yardstick", ko: "예측이 필요 없는 잣대로 교차 확인" },
      body: {
        en: "A DCF depends on forecasts; Joel Greenblatt's two \"Magic Formula\" ratios don't, so they're a useful reality check. Both use the **same profit figure (EBIT)** on top but divide by **two different denominators** — and that's the whole point: one asks *how cheap is the price?*, the other asks *how good is the business?*\n\n**First, enterprise value (EV)** = **market cap (share price × share count — what all the shares cost) + total debt − cash.** It's the true price to buy the whole business: you take on its debts but you also get its cash.\n- **Earnings yield = EBIT ÷ EV.** Here the denominator is **what you'd pay** for the whole company, so this ratio measures **cheapness** — how much profit you get per dollar of purchase price. Higher is cheaper. Compare it to a **bond yield** — the annual % a safe government bond pays (treated as the near-risk-free benchmark; a 10-year government bond is around **4–4.5%** in mid-2026). An earnings yield of ~9% vs a ~4% bond is a **~5-point premium** for taking stock risk; if the earnings yield were only 4–5%, you're barely paid over a safe bond.\n- **Return on capital = EBIT ÷ invested capital** (here, book shareholders' equity). Here the denominator is **what's actually invested inside the business**, so this ratio measures **quality** — how many cents of operating profit the business squeezes out of each dollar (or won) of capital put into it, regardless of what its shares cost. Rule of thumb: **above ~15–20% is strong**, around 10% is middling, and single digits is weak. Thresholds vary by industry, so treat these as guides, not hard cutoffs.\n\n**Why high return on capital signals a \"durable advantage\":** a *durable competitive advantage* (a \"moat\") is anything that keeps rivals from copying a business and stealing its profits — a trusted brand, a patent, a network everyone already uses, or costs no one else can match. Without one, high profits attract competitors who pile in and drive returns back down toward ordinary. So a company that keeps earning ~15–20%+ on its capital year after year probably has some moat protecting it — that persistence is the clue.\n\nIf the DCF screams \"cheap\" but earnings yield is thin and return on capital is poor, your DCF is probably leaning on optimistic growth. When both approaches point the same way, you can hold your view with more confidence.",
        ko: "DCF는 예측에 의존하지만, 조엘 그린블라트의 두 \"마법공식\" 비율은 그렇지 않아 유용한 현실 점검이 됩니다. 둘 다 위쪽에는 **같은 이익 수치(EBIT)**를 쓰지만 **서로 다른 두 분모**로 나눕니다. 바로 그 점이 핵심입니다. 하나는 *가격이 얼마나 싼가?*를, 다른 하나는 *사업이 얼마나 좋은가?*를 묻습니다.\n\n**먼저 기업가치(EV)** = **시가총액(주가 × 주식 수 — 모든 주식을 사는 값) + 총부채 − 현금.** 회사 전체를 사는 실제 가격입니다. 빚은 떠안지만 현금은 내 것이 됩니다.\n- **이익수익률 = EBIT ÷ EV.** 여기서 분모는 회사 전체를 사는 데 **지불하는 값**이라, 이 비율은 **싼 정도**를 잽니다 — 매수 가격 1달러당 얼마의 이익을 얻는가. 높을수록 쌉니다. **채권수익률**과 비교하세요 — 채권이 매년 지급하는 수익률(%)이며, 국채는 사실상 무위험 기준으로 봅니다(10년물 국채는 2026년 중반 기준 약 **4~4.5%**). 이익수익률 약 9% 대 4%짜리 채권이면 주식 위험을 감수하는 대가로 **약 5%포인트 프리미엄**을 받는 것이고, 이익수익률이 4~5%에 그치면 안전한 채권보다 거의 더 받는 게 없습니다.\n- **자본이익률 = EBIT ÷ 투하자본**(여기서는 장부상 자기자본). 여기서 분모는 사업 **안에 실제로 투입된 자본**이라, 이 비율은 **품질**을 잽니다 — 주식이 얼마든 상관없이, 투입한 자본 **1원(또는 1달러)당 몇 원의 영업이익**을 뽑아내는가. 대략적 기준: **약 15~20% 이상이면 강함**, 10% 안팎이면 보통, 한 자릿수면 약함. 업종마다 다르므로 딱 잘라 자르는 선이 아니라 참고로 삼으세요.\n\n**높은 자본이익률이 \"지속적 우위\"의 신호인 이유:** *지속적 경쟁 우위*(\"해자, moat\")란 경쟁자가 사업을 베껴 이익을 빼앗지 못하게 막는 무언가입니다 — 신뢰받는 브랜드, 특허, 모두가 이미 쓰는 네트워크, 아무도 못 따라오는 원가 같은 것이죠. 이런 것이 없으면 높은 이익은 경쟁자를 불러들이고, 이들이 몰려들어 수익률을 평범한 수준으로 끌어내립니다. 그래서 해마다 자본에서 약 15~20% 이상을 계속 버는 회사는 대개 그것을 지켜 주는 해자가 있다는 뜻입니다 — 그 지속성이 단서입니다.\n\nDCF는 \"싸다\"고 외치는데 이익수익률이 얇고 자본이익률이 낮다면, 그 DCF는 낙관적 성장률에 기대고 있을 가능성이 큽니다. 두 접근이 같은 방향을 가리킬 때 더 자신 있게 판단할 수 있습니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Combine the answers. A buy-worthy value case usually shows a real margin of safety on conservative inputs, a value that isn't purely terminal, and a no-forecast yardstick that agrees.",
        ko: "답을 합치세요. 매수할 만한 가치 사례는 대개 보수적 가정에서 진짜 안전마진이 있고, 잔존가치에만 쏠리지 않으며, 예측이 필요 없는 잣대도 같은 방향을 가리킵니다.",
      },
      prompt: {
        en: "Commit in writing: at today's price, is there a margin of safety — **buy / watch / pass**? State your intrinsic value, the margin of safety %, and the % of value from terminal value, then say whether the earnings yield **agreed** — meaning the earnings yield is healthy (well above the ~4% bond yield) and return on capital is solid, pointing the same buy/pass direction as the DCF; \"disagreed\" = the DCF says cheap but the yardsticks look weak. Be explicit about the one assumption that most drives your value, and what price would give you the ~25% cushion you'd want (recall from the margin-of-safety step: **target price = intrinsic value × 0.75**).",
        ko: "글로 확정하세요. 오늘의 주가에서 안전마진이 있는가 — **매수 / 관찰 / 회피**? 당신의 내재가치, 안전마진 %, 잔존가치 비중 %를 적고, 이익수익률이 **같은 방향이었는지** 밝히세요 — 여기서 \"같은 방향\"이란 이익수익률이 건전하고(약 4%의 채권수익률을 크게 웃돌고) 자본이익률도 탄탄해 DCF와 같은 매수/회피 방향을 가리키는 것을 뜻하고, \"다른 방향\"은 DCF는 싸다는데 잣대들은 약해 보이는 경우입니다. 당신의 가치를 가장 크게 좌우하는 가정 하나를 분명히 하고, 원하는 약 25% 완충을 주는 주가가 얼마인지도 적으세요(안전마진 단계에서: **목표가 = 내재가치 × 0.75**).",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론과 다음 행동" },
      body: {
        en: "You've turned a price into a value judgment with an explicit cushion and an honest read of how fragile the estimate is. Tidy up before trusting it:",
        ko: "가격을 명시적 완충과 함께 가치 판단으로 바꾸고, 그 추정이 얼마나 취약한지도 정직하게 읽었습니다. 신뢰하기 전에 정리하세요:",
      },
      checklist: [
        { en: "Re-run the DCF with a downside case (lower growth, higher discount rate) and check the margin of safety still holds.", ko: "하방 시나리오(낮은 성장률, 높은 할인율)로 DCF를 다시 돌려 안전마진이 여전히 유지되는지 확인했다." },
        { en: "Confirm the terminal-value share isn't so high that the answer is really an assumption about the distant future.", ko: "잔존가치 비중이 너무 높아 답이 사실상 먼 미래 가정이 되어 버리지는 않았는지 확인했다." },
        { en: "Verify the seed FCF and EBIT against the actual filing — FCF = operating cash flow − CAPEX on the cash-flow statement; EBIT = 영업이익 / operating income on the income statement.", ko: "초기 FCF와 EBIT를 실제 공시와 대조해 검증했다 — FCF = 현금흐름표의 영업활동현금흐름 − CAPEX(유형자산의 취득), EBIT = 손익계산서의 영업이익." },
        { en: "Write your buy/watch/pass call, the assumption that drives it, and the price that would give you your target margin.", ko: "매수/관찰/회피 판단, 그것을 좌우하는 가정, 목표 마진을 주는 주가를 적었다." },
        { en: "Treat this as a hypothesis about value under your assumptions, not a recommendation — a different reasonable analyst could land elsewhere.", ko: "이것을 당신의 가정 아래 가치에 대한 가설로 다루고 추천으로 여기지 않는다. 다른 합리적인 분석가는 다른 결론에 이를 수 있다." },
      ],
    },
  ],
};

export const reit: Walkthrough = {
  labId: "company-reit",
  title: { en: "REIT Income Check", ko: "리츠 인컴 점검" },
  goal: {
    en: "Judge whether a REIT's distribution is actually covered — while learning why the net-income payout ratio lies for REITs, and where to find the FFO/AFFO figure that tells the truth.",
    ko: "리츠의 분배금이 실제로 감당되는지 판단합니다. 동시에 왜 순이익 기준 배당성향이 리츠에서는 거짓말을 하는지, 그리고 진실을 말해 주는 FFO/AFFO 수치를 어디서 찾는지 배웁니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "What we're actually deciding — and the trap", ko: "우리가 결정하는 것 — 그리고 함정" },
      body: {
        en: "Start with what a REIT even is. A **REIT (real-estate investment trust)** is a company that owns rent-producing property — apartments, malls, warehouses — and by law must pay out most of its income to shareholders each year. That legal payout rule is why its distribution is unusually large, and why the only real question is: **is that distribution actually covered by cash?**\n\nA few terms this whole lesson leans on, each in one line:\n- **income stock** — a stock you hold mainly for its regular cash payout rather than price growth. A REIT is the classic example.\n- **distribution** — a REIT's version of a dividend: the cash it hands shareholders. We use \"distribution\" and \"dividend\" interchangeably here.\n- **net income** — the bottom-line reported profit after every expense is subtracted. It lives on the *income statement*.\n- **payout of net income (payout ratio)** — distributions ÷ net income: the share of reported profit paid out. Over 100% means it paid out more than it reported earning.\n\nNow the trap. For a REIT the question is the same as any income stock — **is the distribution covered and reliable?** — but the usual tool is broken here:\n- A REIT's **payout of net income often looks impossible (well over 100%)**. That usually does NOT mean the distribution is unfunded.\n- The reason is **depreciation** = a yearly paper expense that spreads a building's cost over its life (think of a $20M building counted as $1M of \"wear\" a year for 20 years). It lowers reported profit even though no cash left the company that year — it sits on the income statement. So the cash rent keeps flowing while net income gets crushed.\n- That's exactly why REITs report **FFO (funds from operations)** — which adds the depreciation paper-charge back to net income to show operating cash — and **AFFO (adjusted funds from operations)**, which goes further, also subtracting the cash a REIT must keep re-spending to maintain its buildings. AFFO is the stricter, more honest cash figure.\n\nSo our loop is: don't trust the net-income payout, understand why, then go find the FFO/AFFO-based coverage yourself.",
        ko: "리츠가 무엇인지부터 시작합니다. **리츠(부동산투자회사, REIT)**는 임대수익이 나는 부동산 — 아파트, 쇼핑몰, 물류창고 — 을 보유하고, 법에 따라 매년 소득의 대부분을 주주에게 배당해야 하는 회사입니다. 이 법적 배당 규정 때문에 분배금이 유난히 크고, 그래서 진짜 질문은 하나뿐입니다: **그 분배금이 실제로 현금으로 감당되는가?**\n\n이 실습 전체가 기대는 몇 가지 용어를, 각각 한 줄로 정리합니다.\n- **인컴주** — 가격 상승보다 정기적인 현금 배당을 목적으로 보유하는 주식. 리츠가 대표적인 예입니다.\n- **분배금(distribution)** — 리츠판 배당입니다: 주주에게 주는 현금. 여기서는 \"분배금\"과 \"배당\"을 같은 뜻으로 씁니다.\n- **순이익** — 모든 비용을 뺀 최종 보고 이익. *손익계산서*에 있습니다.\n- **순이익 대비 배당성향(payout ratio)** — 분배금 ÷ 순이익: 보고 이익 중 얼마를 배당했는지. 100%를 넘으면 보고한 이익보다 많이 배당한 것입니다.\n\n이제 함정입니다. 리츠에서도 질문은 다른 인컴주와 같습니다 — **분배금이 감당되고 믿을 만한가?** — 하지만 평소 쓰던 도구가 여기서는 고장 나 있습니다.\n- 리츠의 **순이익 대비 배당성향은 종종 불가능해 보입니다(100%를 훌쩍 넘음).** 그렇다고 분배금이 재원 없이 지급된다는 뜻은 대개 아닙니다.\n- 이유는 **감가상각** = 건물 원가를 사용연수에 걸쳐 나눠 잡는 장부상 연간 비용입니다(2천만 달러짜리 건물을 20년간 매년 100만 달러씩 '마모'로 처리한다고 생각하세요). 그해에 현금이 나가지 않았는데도 보고 이익을 낮춥니다 — 손익계산서에 있습니다. 그래서 임대 현금은 계속 들어오는데도 순이익은 짓눌립니다.\n- 바로 그래서 리츠는 **FFO(운영자금)** — 순이익에 감가상각 장부비용을 다시 더해 영업 현금을 보여 주는 수치 — 와, 여기서 더 나아가 건물 유지에 반복 지출해야 하는 현금까지 빼는 **AFFO(조정운영자금)**를 보고합니다. AFFO가 더 엄격하고 정직한 현금 수치입니다.\n\n그래서 우리의 흐름은 이렇습니다. 순이익 기준 배당성향을 믿지 말고, 그 이유를 이해한 뒤, FFO/AFFO 기준 커버리지를 직접 찾아 확인하는 것입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "A number that shows the trap", ko: "함정을 보여 주는 숫자" },
      body: {
        en: "One made-up (round, illustrative — not a real company) example makes the whole trap concrete. Every line adds up, so you can check the arithmetic yourself.\n\nSay a REIT collects **$100M** of rent cash in a year. The income statement then subtracts, in order:\n- **$15M** operating expenses (property taxes, upkeep, management) — real cash out,\n- **$10M** interest on its loans — real cash out,\n- **$60M** depreciation — a *paper* charge, no cash out.\n\nThat leaves reported **net income of $100M − $15M − $10M − $60M = $15M**. It pays out **$45M** in distributions.\n- On paper that's $45M ÷ $15M = **300% payout** — looks reckless.\n- But add the $60M depreciation back (no cash ever left for it) and operating cash — **FFO** — is about **$75M** ($15M net income + $60M). Notice the $15M and $10M of *real* cash costs stay subtracted — only the paper charge comes back.\n- $45M ÷ $75M = **60% FFO payout**, comfortably covered.\n\nSame REIT, same year: the net-income payout says danger, the FFO payout says fine. THAT is the trap — and the rest of this walkthrough is just learning to compute the right-hand number for a real REIT.",
        ko: "지어낸(둥근 숫자의 예시일 뿐, 실제 회사가 아님) 예 하나면 함정 전체가 구체적으로 잡힙니다. 모든 줄이 딱 맞아떨어지므로 계산을 직접 검산할 수 있습니다.\n\n어떤 리츠가 1년에 임대료 현금 **1억 달러**를 걷는다고 합시다. 손익계산서는 순서대로 이렇게 차감합니다.\n- **1,500만 달러** 운영비(재산세, 유지관리, 관리비) — 실제 현금 유출,\n- **1,000만 달러** 대출 이자 — 실제 현금 유출,\n- **6천만 달러** 감가상각 — *장부상* 비용, 현금 유출 없음.\n\n그러면 보고 **순이익 = 1억 − 1,500만 − 1,000만 − 6,000만 = 1,500만 달러**가 남습니다. 이 리츠는 분배금으로 **4,500만 달러**를 지급합니다.\n- 장부상으로는 4,500만 ÷ 1,500만 = **배당성향 300%** — 무모해 보입니다.\n- 하지만 감가상각 6천만 달러를 다시 더하면(그 대가로 현금은 나간 적이 없으니) 영업 현금 — **FFO** — 은 약 **7,500만 달러**입니다(순이익 1,500만 + 6,000만). 1,500만·1,000만 달러의 *실제* 현금 비용은 그대로 차감된 채 남고, 장부상 비용만 되돌아온다는 점에 주목하세요.\n- 4,500만 ÷ 7,500만 = **FFO 배당성향 60%**, 여유 있게 감당됩니다.\n\n같은 리츠, 같은 해인데 순이익 배당성향은 위험이라 하고, FFO 배당성향은 괜찮다고 합니다. 바로 이것이 함정입니다 — 그리고 이 실습의 나머지는 실제 리츠에 대해 오른쪽 숫자를 계산하는 법을 배우는 것뿐입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터의 출처" },
      body: {
        en: "We can pull yield, net income and the DPS record automatically, but the true FFO/AFFO figure you can't. Why? A quick vocabulary:\n- **GAAP** = the standard accounting rulebook US companies must follow.\n- **non-GAAP** = a company-defined metric that sits OUTSIDE those standard rules. FFO is one — so it is not filed in a fixed, machine-readable slot.\n- **XBRL** = the tagged, machine-readable data our analyzer reads automatically.\n\nPut together: because FFO is non-GAAP, it isn't tagged in the XBRL data the analyzer pulls, so you must read it out of the filing yourself. Here's exactly where to look.",
        ko: "수익률, 순이익, DPS 이력은 자동으로 가져올 수 있지만, 진짜 FFO/AFFO 수치는 그렇지 못합니다. 왜일까요? 짧은 용어 정리부터.\n- **GAAP** = 미국 기업이 따라야 하는 표준 회계 규칙(회계기준).\n- **비(非)GAAP** = 그 표준 규칙 밖에 있는, 회사가 자체 정의한 지표. FFO가 그 예입니다 — 그래서 고정된, 기계가 읽을 수 있는 칸에 공시되지 않습니다.\n- **XBRL** = 우리 분석기가 자동으로 읽어 들이는, 태깅된 기계 판독용 데이터.\n\n종합하면: FFO는 비GAAP이라 분석기가 가져오는 XBRL 데이터에 태깅되어 있지 않고, 그래서 공시에서 직접 읽어야 합니다. 정확히 어디를 봐야 하는지 알려 드립니다.",
      },
      sources: [
        {
          name: { en: "SEC EDGAR (US) — supplemental & FFO reconciliation", ko: "SEC EDGAR (미국) — 보충자료 및 FFO 조정표" },
          what: { en: "Document types: the **10-K** = the annual report; the **10-Q** = the quarterly report; the **quarterly supplemental** = an extra investor packet REITs publish; the **earnings release** = the press-release results. Finding-them tip: the supplemental and earnings release usually do NOT appear as their own form type in EDGAR — they're attached as **exhibits to an 8-K** (the \"current report\" form). So on EDGAR, open the most recent **8-K** and click its exhibits, OR just fall back to the 10-Q/10-K, which always contains the same table. Inside any of these, look for the table literally titled \"Reconciliation of net income to FFO\". It's a short stack of lines that reads roughly: *Net income $15M → + Depreciation $60M → ± Property-sale gains/losses → = FFO $75M → − Recurring capex → = AFFO*. Once you see that shape, you've found it (the FFO-to-AFFO part is often the bottom half of the same table).", ko: "문서 종류: **10-K** = 연차보고서; **10-Q** = 분기보고서; **분기 보충자료(supplemental)** = 리츠가 발행하는 추가 투자자용 자료집; **실적 발표자료(earnings release)** = 실적 보도자료. 찾는 요령: 보충자료와 실적 발표자료는 EDGAR에서 대개 독립된 문서 종류로 나타나지 않고, **8-K(수시보고서)의 첨부(exhibit)**로 붙습니다. 그러니 EDGAR에서 최신 **8-K**를 열어 첨부를 확인하거나, 아니면 그냥 같은 표가 반드시 들어 있는 10-Q/10-K로 대체하세요. 이 중 아무 문서에서나 \"Reconciliation of net income to FFO(순이익→FFO 조정)\"이라는 제목의 표를 찾으세요. 대략 이런 몇 줄짜리 표입니다: *순이익 1,500만 → + 감가상각 6,000만 → ± 부동산 매각손익 → = FFO 7,500만 → − 경상 자본지출 → = AFFO*. 이 모양이 보이면 찾은 것입니다(FFO→AFFO 부분은 흔히 같은 표의 아래쪽 절반입니다)." },
          why: { en: "This is where the company itself defines and reports the coverage figure that net income hides.", ko: "회사가 직접 FFO를 정의하고, 순이익이 감추는 커버리지 수치를 보고하는 곳입니다." },
          url: "https://www.sec.gov/edgar/searchedgar/companysearch",
          steps: EDGAR_STEPS,
        },
        {
          name: { en: "OpenDART (Korea) — REIT reports", ko: "OpenDART (한국) — 리츠 보고서" },
          what: { en: "Korean REITs (리츠) don't use the US \"FFO\" label. Instead the business report's financial notes state **배당가능이익 (distributable income)** — the legally distributable profit the payout is based on — and the distribution schedule shows what was actually paid. Use distributable income as the KR stand-in for the coverage denominator.", ko: "한국 리츠(리츠)는 미국식 \"FFO\" 명칭을 쓰지 않습니다. 대신 사업보고서의 재무제표 주석에 **배당가능이익** — 분배의 법적 기준이 되는, 법상 배당 가능한 이익 — 이 나오고, 배당(분배) 내역에서 실제 지급액을 보여 줍니다. 커버리지 분모의 한국식 대체값으로 배당가능이익을 쓰세요." },
          why: { en: "KR REIT rules require distributing at least 90% of distributable profit, so it's the correct legal basis for coverage — but note it's a legal/accounting profit figure, not a like-for-like cash FFO.", ko: "한국 리츠 제도는 배당가능이익의 90% 이상 의무 배당을 규정하므로, 이것이 커버리지의 올바른 법적 기준입니다 — 다만 미국식 현금 FFO와 동일한 지표가 아니라 법적·회계상 이익 개념임을 유념하세요." },
          url: "https://opendart.fss.or.kr/",
          shot: DART_SHOT,
          steps: DART_STEPS,
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull it yourself", ko: "직접 불러오기" },
      body: {
        en: "Enter the REIT's **ticker** (the stock's short trading code you type in — e.g. O, PLD) and put the analyzer in **reit** mode. It leads with the FFO-trap hook. Read off:\n- **Distribution yield** — yield = annual distribution ÷ share price, the cash return as a % of what you pay (DPS $3.00 on a $50 price → 6%).\n- **Payout of net income** — and notice if it's over 100% or flagged as unreliable for a REIT.\n- **DPS-by-year chart** — **DPS = distribution (dividend) per share**, the cash paid per share each year; the chart shows it year by year so you can spot a cut — and any **cut warning**.\n\nDeliberately **do not** treat the net-income payout as the coverage answer here. You're noting it precisely so you can see the trap, then you'll go get the real number from the filing.",
        ko: "리츠의 **티커**(입력하는 주식의 짧은 거래 코드 — 예: O, PLD)를 입력하고 분석기를 **리츠(reit)** 모드로 둡니다. 이 모드는 FFO 함정 안내로 시작합니다. 다음을 읽어 적습니다.\n- **분배 수익률** — 수익률 = 연간 분배금 ÷ 주가, 지불한 가격 대비 현금 수익률(%)입니다(주가 50달러에 DPS 3달러 → 6%).\n- **순이익 대비 배당성향** — 100%를 넘는지, 리츠에서는 신뢰할 수 없다고 표시되는지 확인.\n- **연도별 DPS 차트** — **DPS = 주당배당금(분배금)**, 주당 매년 지급하는 현금이며, 연도별로 보여 주므로 삭감을 포착할 수 있습니다 — 그리고 **삭감 경고** 여부.\n\n여기서는 순이익 기준 배당성향을 커버리지의 답으로 **일부러 취급하지 마세요.** 함정을 눈으로 보기 위해 기록해 두는 것이며, 진짜 숫자는 공시에서 가져올 것입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Why the net-income payout lies", ko: "왜 순이익 기준 배당성향이 거짓말을 하는가" },
      body: {
        en: "Recall the example: the $60M depreciation charge shrank reported net income to $15M even though that $60M never left as cash. When you divide distributions by that artificially shrunk net income, the ratio balloons past 100% — not because the payout is unsafe, but because the denominator is fake-small.\n\nIt helps to know where each number physically lives: **depreciation and net income both sit on the income statement**; the actual rent **cash shows up on the cash-flow statement**. So the income-statement ratio (distributions ÷ net income) is measuring the payout against a number that's been beaten down by a non-cash charge. For a normal industrial company an over-100% ratio would scream danger; for a REIT it's often just the accounting. **This is why you never judge a REIT on the earnings payout ratio** — it's measuring against the wrong number.",
        ko: "앞의 예를 떠올려 보세요. 감가상각비 6천만 달러가 보고 순이익을 1,500만 달러로 줄였지만, 그 6천만 달러는 현금으로 나간 적이 없습니다. 분배금을 그렇게 인위적으로 줄어든 순이익으로 나누면 비율이 100%를 훌쩍 넘어 부풀어 오릅니다 — 배당이 위험해서가 아니라 분모가 거짓으로 작아졌기 때문입니다.\n\n각 숫자가 실제로 어디에 있는지 알면 도움이 됩니다. **감가상각과 순이익은 둘 다 손익계산서**에 있고, 실제 임대료 **현금은 현금흐름표**에 나타납니다. 그래서 손익계산서 기반 비율(분배금 ÷ 순이익)은 비현금 비용에 얻어맞아 눌린 숫자에 대고 배당을 재고 있는 셈입니다. 평범한 제조업체라면 100% 초과 비율은 위험 신호이겠지만, 리츠에서는 대개 회계 탓일 뿐입니다. **바로 이 때문에 리츠를 이익 기준 배당성향으로 판단하면 안 됩니다** — 애초에 잘못된 숫자에 대고 재고 있는 것입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Find FFO and AFFO in the filing", ko: "공시에서 FFO와 AFFO 찾기" },
      body: {
        en: "This is the crux, so go slowly.\n\n**1. Navigate to the table.** Open the latest **quarterly supplemental** or **earnings release** (fastest — the FFO table is usually near the front), or the **10-Q/10-K** as backup. Search the document text for the word \"**FFO**\" or \"**Funds from operations**\" to jump straight to the reconciliation table.\n\n**2. Read the adjustments (each defined once).** The table starts from net income and adjusts:\n- **+ depreciation and amortization.** *amortization* = the same paper-spreading idea as depreciation, but for non-physical items.\n- **± property-sale gains/losses** = one-off profit or loss from selling a building — stripped out because it isn't recurring rent. The goal is to leave only the money the buildings earn year after year, so anything one-off has to come out. A sale *gain* was added into net income once and won't repeat, so it inflated the figure — you **subtract it back out**. A sale *loss* was subtracted once and likewise won't repeat, so it dented the figure unfairly — you **add it back**. Either way you're undoing a non-recurring bump. → that gives you **FFO**.\n- Then, for **AFFO**, subtract **recurring capex.** *capex (capital expenditure)* = cash spent buying or upgrading property; *recurring capex* = the ongoing cash a REIT must spend just to keep existing buildings rentable (new roofs, HVAC). AFFO subtracts this because it's unavoidable. **Heads-up:** recurring (maintenance) capex is rarely a single clean line — REITs often bundle it with development spending or disclose it only in the notes or a separate capex breakdown, so you may have to read the footnotes to pull the maintenance portion (if you truly can't isolate it, note that your AFFO is an estimate).\n\n**3. Get the numerator (the part the tool never gives you).** You need **total distributions paid** — total dollars, not per-share. Get it from the **cash-flow statement**, financing section, line \"distributions/dividends **paid**\" (use *paid*, the actual cash out — not \"declared\"), or compute it as **DPS × shares outstanding**. Use the same period as your FFO (both full-year, or both the same quarter).\n\n**4. Compute and interpret.** e.g. distributions **$80M** ÷ AFFO **$100M** = **80% AFFO payout → covered.** If AFFO were only $70M, that's $80M ÷ $70M = **114% → paying out more cash than it earns → warning.**\n\n**5. Which one decides?** Judge the verdict on **AFFO** — it's the stricter test because it already subtracts the maintenance cash. FFO payout under 100% is encouraging context, but **AFFO payout is the one that decides rely / watch / avoid**: comfortably under ~90% = covered, 90–100% = borderline (fine but little cushion), over 100% = the real warning.",
        ko: "여기가 핵심이니 천천히 갑니다.\n\n**1. 표로 이동합니다.** 최신 **분기 보충자료(supplemental)** 또는 **실적 발표자료(earnings release)**를 여세요(가장 빠릅니다 — FFO 표가 대개 앞쪽에 있습니다). 없으면 **10-Q/10-K**로 대체합니다. 문서에서 \"**FFO**\" 또는 \"**Funds from operations**\"를 검색해 조정표로 바로 이동하세요.\n\n**2. 조정 항목을 읽습니다(각 용어는 한 번씩 정의).** 표는 순이익에서 출발해 조정합니다.\n- **+ 감가상각 및 무형자산상각.** *무형자산상각* = 감가상각과 같은 '나눠 잡기' 원리를 무형(비물리) 항목에 적용한 것.\n- **± 부동산 매각손익** = 건물 매각에서 나온 일회성 손익 — 반복 임대수익이 아니라 제거합니다. 목표는 건물이 해마다 벌어들이는 돈만 남기는 것이라, 일회성인 것은 모두 빼내야 합니다. 매각 *이익*은 순이익에 한 번 더해졌고 다시 반복되지 않으니 수치를 부풀린 것 — 그래서 **다시 차감**합니다. 매각 *손실*은 한 번 차감되었고 마찬가지로 반복되지 않으니 수치를 부당하게 깎은 것 — 그래서 **다시 가산**합니다. 어느 쪽이든 비반복 요철을 되돌리는 것입니다. → 여기까지가 **FFO**.\n- 그다음 **AFFO**를 위해 **경상 자본지출(recurring capex)**을 뺍니다. *자본지출(capex)* = 부동산을 사거나 개선하는 데 쓴 현금; *경상 자본지출* = 기존 건물을 임대 가능한 상태로 유지하기 위해 계속 써야 하는 현금(지붕 교체, 냉난방설비). 불가피하므로 AFFO에서 뺍니다. **주의:** 경상(유지보수) 자본지출은 깔끔한 한 줄로 나오는 경우가 드뭅니다 — 리츠는 이를 개발 투자와 묶어 놓거나 주석 또는 별도의 자본지출 명세에서만 밝히는 경우가 많아, 유지보수 몫만 뽑아내려면 주석을 읽어야 할 수 있습니다(도저히 분리할 수 없다면 당신의 AFFO는 추정치라고 적어 두세요).\n\n**3. 분자를 구합니다(도구가 절대 주지 않는 부분).** **총 지급 분배금** — 주당이 아니라 총액(달러)이 필요합니다. **현금흐름표**의 재무활동 구간, \"distributions/dividends **paid**(배당금 지급)\" 줄에서 가져오거나(반드시 *지급(paid)*, 즉 실제 유출 현금 — \"선언(declared)\"이 아님), **DPS × 발행주식수**로 계산합니다. FFO와 같은 기간으로 맞추세요(둘 다 연간, 또는 둘 다 같은 분기).\n\n**4. 계산하고 해석합니다.** 예: 분배금 **8천만 달러** ÷ AFFO **1억 달러** = **AFFO 배당성향 80% → 감당됨.** 만약 AFFO가 7천만 달러뿐이라면 8천만 ÷ 7천만 = **114% → 버는 현금보다 많이 배당 → 경고.**\n\n**5. 무엇으로 판정하나요?** 판정은 **AFFO**로 합니다 — 유지보수 현금까지 이미 뺀 더 엄격한 시험이기 때문입니다. FFO 배당성향이 100% 미만이면 안심되는 참고치이지만, **의지 / 관찰 / 회피를 결정하는 것은 AFFO 배당성향**입니다: 약 90% 미만이면 감당됨, 90~100%면 경계(괜찮지만 여유가 얇음), 100% 초과면 진짜 경고입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Check the yield and the distribution record", ko: "수익률과 분배 이력 확인" },
      body: {
        en: "With coverage handled honestly, use the two figures the analyzer does show well:\n- **Yield.** Most healthy equity REITs yield roughly **3–6%**. A REIT yielding **10%+** is a flag — the market is often pricing in a coming cut (the price has fallen faster than the payout, pushing yield up). Find comparables by looking at other REITs in the **same property type** (apartments vs warehouses vs malls — comparing across types is apples-to-oranges); a free screener (e.g. Finviz, Yahoo Finance) filtered by REIT sub-sector, or the REIT's own stated peer list in its 10-K, works. Sanity-check the yield against the AFFO coverage you just computed.\n- **The DPS/distribution chart and cut warning.** A steady or rising distribution across cycles signals a durable portfolio and disciplined management; a past cut tells you how the distribution behaves under stress. REITs are **rate-sensitive** because they borrow heavily to buy property: when rates jump, their interest bills rise AND safe bonds start paying competitive income, so investors demand a higher yield (lower price) — which can pressure the distribution.\n\nA reliable REIT income stream usually shows: reasonable yield, AFFO payout under 100%, and a distribution record that didn't collapse at the first bad year.",
        ko: "커버리지를 정직하게 처리했으니, 분석기가 잘 보여 주는 두 수치를 활용합니다.\n- **수익률.** 건전한 지분형 리츠의 수익률은 대략 **3~6%**입니다. **10% 이상**인 리츠는 경고 신호입니다 — 시장이 다가올 삭감을 선반영하는 경우가 많습니다(주가가 배당보다 빨리 떨어져 수익률이 올라간 것). 비교 대상은 **같은 부동산 유형**의 다른 리츠에서 찾으세요(아파트 vs 물류창고 vs 쇼핑몰 — 유형이 다르면 사과와 오렌지 비교입니다). 무료 스크리너(예: Finviz, 야후 파이낸스)에서 리츠 하위 섹터로 거르거나, 리츠가 10-K에 밝힌 동종그룹 목록을 쓰면 됩니다. 방금 계산한 AFFO 커버리지와 대조해 점검하세요.\n- **DPS/분배 차트와 삭감 경고.** 여러 경기 국면에 걸쳐 꾸준하거나 늘어나는 분배는 견고한 포트폴리오와 규율 있는 경영진을 시사합니다. 과거 삭감은 분배금이 스트레스 아래에서 어떻게 움직이는지 알려 줍니다. 리츠는 부채로 부동산을 사기 때문에 **금리에 민감**합니다: 금리가 뛰면 이자비용이 늘고, 동시에 안전한 채권이 경쟁력 있는 수익을 내기 시작해 투자자가 더 높은 수익률(더 낮은 가격)을 요구합니다 — 이것이 분배금을 압박할 수 있습니다.\n\n믿을 만한 리츠 인컴은 대개 이렇게 보입니다. 합리적인 수익률, 100% 미만의 AFFO 배당성향, 그리고 첫 나쁜 해에 무너지지 않은 분배 이력.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Bring together the FFO/AFFO-based coverage you found, the yield, and the distribution record.",
        ko: "당신이 찾은 FFO/AFFO 기준 커버리지, 수익률, 분배 이력을 한데 모으세요.",
      },
      prompt: {
        en: "Write it down: on an **FFO/AFFO basis you found yourself**, is this REIT's distribution actually covered — **rely / watch / avoid**? Quote the FFO or AFFO payout you computed (and the source line in the filing), the yield, and the distribution record. Explicitly note that you are NOT relying on the net-income payout, and why. Say what would flip your view (e.g. \"if AFFO payout crosses 100%\").\n\nIf you could not locate the full reconciliation, use the **headline FFO/AFFO figure the REIT reports in its earnings release** (or a reputable data provider) and say so — note which source you used and that it's a shortcut. A sourced shortcut is honest; this is a hypothesis about distribution safety, not a recommendation.",
        ko: "직접 적어 보세요. **당신이 직접 찾은 FFO/AFFO 기준으로**, 이 리츠의 분배금은 실제로 감당되는가 — **의지 / 관찰 / 회피**? 계산한 FFO 또는 AFFO 배당성향(그리고 공시의 근거 줄), 수익률, 분배 이력을 인용하세요. 순이익 기준 배당성향에 의존하지 않는다는 점과 그 이유를 분명히 적으세요. 무엇이 판단을 뒤집을지도 적으세요(예: \"AFFO 배당성향이 100%를 넘으면\").\n\n조정표 전체를 찾지 못했다면, **리츠가 실적 발표자료에 보고하는 대표 FFO/AFFO 수치**(또는 신뢰할 만한 데이터 제공업체)를 쓰고 그렇다고 밝히세요 — 어떤 출처를 썼는지, 그리고 그것이 지름길임을 적으세요. 출처 있는 지름길은 정직합니다. 이것은 분배 안전성에 대한 가설이지 추천이 아닙니다.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론과 다음 행동" },
      body: {
        en: "You judged a REIT the way it must be judged — on cash-based FFO/AFFO you sourced yourself, not the misleading earnings payout. Close the loop:",
        ko: "리츠를 마땅히 판단해야 하는 방식으로, 즉 오해를 부르는 이익 기준 배당성향이 아니라 당신이 직접 구한 현금 기반 FFO/AFFO로 판단했습니다. 마무리하세요:",
      },
      checklist: [
        { en: "Confirm you found the FFO/AFFO reconciliation in the actual filing and computed payout against it, not against net income.", ko: "실제 공시에서 FFO/AFFO 조정표를 찾아, 순이익이 아니라 그 수치에 대고 배당성향을 계산했음을 확인했다." },
        { en: "Note the exact source (filing type, section/line) so your FFO number is traceable.", ko: "FFO 숫자를 추적할 수 있도록 정확한 출처(공시 종류, 항목/줄)를 기록했다." },
        { en: "If you could not find the reconciliation table, note the fallback you used (earnings-release headline FFO/AFFO, or a data provider) and its limits — a sourced shortcut beats guessing from net income.", ko: "조정표를 찾지 못했다면 사용한 대안(실적 발표자료의 대표 FFO/AFFO 수치 또는 데이터 제공업체)과 그 한계를 기록했다 — 순이익으로 추측하는 것보다 출처 있는 지름길이 낫다." },
        { en: "Check the distribution record for any past cut and how the REIT explained it.", ko: "분배 이력에서 과거 삭감이 있었는지, 리츠가 그것을 어떻게 설명했는지 확인했다." },
        { en: "Cross-check the yield against comparable REITs of the same property type so an outlier yield doesn't lull you.", ko: "이상하게 높은 수익률에 방심하지 않도록, 수익률을 같은 부동산 유형의 비슷한 리츠들과 교차 확인했다." },
        { en: "Treat this as a hypothesis about distribution safety, not a recommendation — and remember the analyzer's net-income payout is intentionally the wrong tool for a REIT.", ko: "이것을 분배 안전성에 대한 가설로 다루고 추천으로 여기지 않으며, 분석기의 순이익 기준 배당성향은 리츠에는 일부러 잘못된 도구임을 기억한다." },
      ],
    },
  ],
};

export const portfolio: Walkthrough = {
  labId: "portfolio",
  title: {
    en: "Comparing portfolio mixes over a century of returns",
    ko: "100년치 수익률로 포트폴리오 조합 비교하기",
  },
  goal: {
    en: "Decide which asset mix matches the drop and the bumpy ride you can actually live through — not just the one with the biggest number.",
    ko: "가장 높은 숫자가 아니라, 실제로 견뎌낼 수 있는 하락과 변동성에 맞는 자산 조합을 스스로 정합니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "Frame the questions before you touch the tool", ko: "도구를 만지기 전에 질문부터 정리하기" },
      body: {
        en: "You are about to compare four preset portfolios. Before you read a single number, decide what you are actually asking. Work through these in order:\n- **Return** — how fast does each mix grow? (**CAGR** — the one steady yearly growth rate that would have taken you from start to finish; and **real CAGR**, the same after subtracting inflation, i.e. what your buying power actually did.)\n- **The ride** — how violently does it swing along the way? (**volatility** — how far the yearly result typically strays from average; a high number means big up-and-down swings, a low number a calmer path.)\n- **The worst moment** — how deep is the worst fall? (**max drawdown** — the biggest drop from a previous high point to the bottom before it recovered.)\n- **The tradeoff** — is a smoother ride worth giving up some return? That is a question about *you*, not about the data.\nDon't worry if these are new; each gets a plain definition and a real number below. The whole point of this lab is that a portfolio is not \"good\" or \"bad\" in the abstract. It is good or bad *for a specific person who has to hold it through the worst year*.",
        ko: "이제 네 가지 프리셋 포트폴리오를 비교합니다. 숫자 하나를 읽기 전에, 무엇을 묻고 있는지부터 정합니다. 순서대로 짚어봅니다.\n- **수익률** — 각 조합은 얼마나 빨리 불어나는가? (**CAGR** — 시작에서 끝까지 데려다줄 단 하나의 꾸준한 연 성장률, 그리고 물가를 뺀 같은 값인 **실질 CAGR**, 즉 실제 구매력이 어떻게 됐는지.)\n- **여정** — 그 과정에서 얼마나 심하게 출렁이는가? (**변동성** — 한 해 결과가 평균에서 보통 얼마나 벗어나는지. 클수록 위아래 출렁임이 크고, 작을수록 잔잔한 길입니다.)\n- **최악의 순간** — 가장 깊은 하락은 얼마나 되는가? (**최대 낙폭** — 이전 고점에서 회복 전 바닥까지의 가장 큰 하락.)\n- **맞바꿈** — 더 부드러운 여정을 위해 수익 일부를 포기할 가치가 있는가? 이건 데이터가 아니라 *당신*에 대한 질문입니다.\n처음 보는 용어라도 걱정하지 마세요. 아래에서 각각 쉬운 정의와 실제 숫자로 다시 설명합니다. 이 랩의 핵심은, 포트폴리오에 그 자체로 \"좋다/나쁘다\"가 없다는 점입니다. *최악의 해를 끝까지 버텨야 하는 특정한 사람*에게 좋거나 나쁠 뿐입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where these returns come from", ko: "이 수익률의 출처" },
      body: {
        en: "This lab does not fetch live prices. It runs on a pre-ingested static dataset of **annual total returns, 1928–2025**, for US stocks, small-cap, T-bills, T-bonds, corporate bonds, real estate, and gold — plus inflation. That is why you can backtest a full century in a click.\nMeet the ingredients in plain language before you mix them:\n- **US stocks / small-cap** — shares of American companies; small-cap = smaller companies, historically higher return but a bumpier ride.\n- **T-bills** — short-term (≤1 year) US government IOUs; the closest thing to 'cash', very safe, low return.\n- **T-bonds (long bonds)** — longer-term (10yr+) US government loans; steadier income, but their price swings with interest rates.\n- **Corporate bonds** — loans to companies; pay a bit more than government bonds because the company could default.\n- **Real estate / gold** — a property-income asset and a metal held as an inflation/panic hedge; they often move differently from stocks, which is the point of mixing them.\n**Total return** means price change PLUS dividends/interest reinvested — the full result of holding, not just the price. (The dataset also contains small-cap and corporate bonds, but the four presets below never use them, so you won't see those two in an allocation bar.) Know your source, and know its limits.",
        ko: "이 랩은 실시간 시세를 불러오지 않습니다. 미국 주식, 소형주, 단기국채, 장기국채, 회사채, 부동산, 금의 **1928~2025년 연간 총수익률**과 물가 자료를 미리 담아둔 정적 데이터셋 위에서 돌아갑니다. 그래서 100년치를 한 번의 클릭으로 백테스트할 수 있습니다.\n섞기 전에 재료들을 쉬운 말로 먼저 만납니다.\n- **미국 주식 / 소형주** — 미국 기업의 주식. 소형주는 규모가 작은 기업으로, 역사적으로 수익은 높지만 변동이 더 큽니다.\n- **단기국채(T-bill)** — 만기 1년 이하의 미국 정부 IOU. 현금에 가장 가깝고 매우 안전하며 수익은 낮습니다.\n- **장기국채(T-bond, 장기채)** — 만기 10년 이상의 미국 정부 대출. 이자는 안정적이지만 가격이 금리에 따라 출렁입니다.\n- **회사채** — 기업에 빌려주는 대출. 부도 위험이 있어 국채보다 이자를 조금 더 줍니다.\n- **부동산 / 금** — 임대수익을 내는 자산과, 인플레·공포 대비로 보유하는 금속. 주식과 다르게 움직일 때가 많은데, 바로 그 점이 섞는 이유입니다.\n**총수익률**은 가격 변동에 배당·이자 재투자까지 더한 것 — 가격만이 아닌 보유의 전체 결과입니다. (데이터셋에는 소형주와 회사채도 있지만 아래 네 프리셋은 이 둘을 쓰지 않아, 자산배분 막대에서는 보이지 않습니다.) 출처를 알고, 그 한계도 알아둡니다.",
      },
      sources: [
        {
          name: { en: "Damodaran NYU annual returns", ko: "다모다란 NYU 연간 수익률" },
          what: { en: "Yearly total returns for each asset class since 1928 (the histretSP series).", ko: "1928년 이후 각 자산군의 연간 총수익률(histretSP 시리즈)." },
          why: { en: "It is the most widely cited free, long-horizon US return dataset — decades of consistent, comparable annual numbers in one place.", ko: "가장 널리 인용되는 무료 장기 미국 수익률 자료로, 수십 년치의 일관되고 비교 가능한 연간 숫자가 한곳에 모여 있습니다." },
          url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
        },
        {
          name: { en: "Minneapolis Fed CPI", ko: "미니애폴리스 연은 CPI" },
          what: { en: "Historical US consumer price inflation, used to turn nominal returns into real (after-inflation) ones.", ko: "미국 소비자물가 상승률 자료로, 명목 수익률을 실질(물가 반영) 수익률로 바꾸는 데 씁니다." },
          why: { en: "Nominal returns flatter old data. Real CAGR is the honest yardstick across long periods.", ko: "명목 수익률은 오래된 데이터를 과대포장합니다. 긴 기간을 비교할 땐 실질 CAGR이 정직한 잣대입니다." },
          url: "https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-",
        },
      ],
    },
    {
      kind: "read",
      title: { en: "What the named mixes are — and why rebalancing", ko: "이름 붙은 조합들이 무엇인지 — 그리고 리밸런싱이란" },
      body: {
        en: "The four presets are not arbitrary labels. Know what each one holds before you compare them:\n- **100% stocks** — every won in US stocks, no bonds or gold. This is the deliberate high-risk, high-return baseline: it is NOT a recommendation, it is the yardstick every other mix is measured against (does giving up some of its return buy a smoother ride and a shallower worst drop?).\n- **60/40** — 60% stocks / 40% long-term government (Treasury) bonds. Read the notation as 'sixty percent stocks, forty percent bonds'. This is the classic 'balanced' benchmark everyone compares against.\n- **All-Weather** — 30% stocks / 40% long bonds / 15% T-bills / 7.5% gold / 7.5% real estate. A real, named strategy published by investor **Ray Dalio**.\n- **Permanent** — 25% each in stocks / long bonds / gold / T-bills (equal quarters). A real, named strategy published by **Harry Browne**.\nAll-Weather and Permanent deliberately hold gold and bonds so that in ANY economic weather — boom, bust, inflation, deflation — *something* in the mix tends to hold up. That is why a mix would seemingly 'waste' 7.5% on gold: it is insurance, not a growth bet. Note that 'long bonds' here are the same **long-term government (T-)bonds** from the previous step.\n**Rebalancing** — over time the winners grow into a bigger slice than you intended. Rebalancing means periodically selling a little of what grew and buying what shrank to return to your target mix — like re-leveling a see-saw. It quietly sells high and buys low, and keeps your risk from drifting. The tool has a single **'Rebalance yearly'** checkbox: leave it ON to reset to target weights each year-end, or turn it OFF to let each holding just compound (so the best-performing asset slowly takes over the whole mix).",
        ko: "네 프리셋은 아무렇게나 붙인 이름이 아닙니다. 비교하기 전에 각각 무엇을 담는지 알아둡니다.\n- **100% 주식** — 모든 돈을 미국 주식에, 채권도 금도 없습니다. 이것은 일부러 둔 고위험·고수익 기준선입니다: 권고가 아니라, 다른 모든 조합을 재는 잣대입니다(수익 일부를 포기하면 더 부드러운 여정과 더 얕은 최악의 하락을 살 수 있는가?).\n- **60/40** — 주식 60% / 장기국채(미국 국채) 40%. '주식 60퍼센트, 채권 40퍼센트'로 읽습니다. 모두가 기준으로 삼는 고전적인 '균형' 벤치마크입니다.\n- **올웨더(All-Weather)** — 주식 30% / 장기채 40% / 단기국채 15% / 금 7.5% / 부동산 7.5%. 투자자 **레이 달리오**가 공개한 실제 이름 있는 전략입니다.\n- **퍼머넌트(Permanent)** — 주식 / 장기채 / 금 / 단기국채를 각각 25%씩(4등분). 투자자 **해리 브라운**이 공개한 실제 전략입니다.\n올웨더와 퍼머넌트는 금과 채권을 일부러 담아, 어떤 경제 날씨(호황, 불황, 인플레, 디플레)에서도 조합 속 *무언가*는 버티도록 설계했습니다. 금에 7.5%를 '낭비'하는 듯 보이는 이유가 이것입니다 — 성장 베팅이 아니라 보험입니다. 여기서 '장기채'는 앞 단계의 **장기국채(T-bond)**와 같은 것입니다.\n**리밸런싱** — 시간이 지나면 오른 자산이 원래 의도보다 큰 비중을 차지합니다. 리밸런싱은 오른 것을 조금 팔고 내린 것을 사서 목표 비중으로 되돌리는 것 — 시소를 다시 수평으로 맞추는 것과 같습니다. 조용히 비싸게 팔고 싸게 사며, 위험이 제멋대로 커지는 걸 막습니다. 이 도구에는 **'매년 리밸런싱'** 체크박스 하나가 있습니다: 켜두면 매년 말 목표 비중으로 되돌리고, 끄면 각 자산이 그대로 복리로 불어나(가장 잘나가는 자산이 서서히 조합 전체를 차지) 갑니다.",
      },
    },
    {
      kind: "tool",
      title: { en: "Run the comparison", ko: "비교 돌려보기" },
      body: {
        en: "Now drive the analyzer. Do this deliberately:\n- Pick a **preset**: 100% stocks, 60/40 (defined last step), All-Weather, or Permanent.\n- Choose a **start year** and the **Rebalance yearly** setting.\n- Read the four panels: the **growth-vs-stocks line**, the **drawdown chart**, the **allocation bar**, and the **5-stat grid** (CAGR, real CAGR, volatility, Sharpe, max drawdown).\n- **Volatility** = how big the typical yearly swing is (higher = bumpier). **Sharpe** = return earned per unit of that bumpiness — 'how much reward for the stomach-churn' (higher is better). Simple rule of thumb for THIS data: on a full century of annual returns most mixes land around **0.3–0.6**, so treat **~0.5 as a good, realistic result** and anything **near or above 1 as unusually good (rare here)**. Don't chase a textbook '>1' — it almost never shows up on long-run annual numbers.\nRun each preset over the *same* start year first so the comparison is fair. Start year matters because a mix that begins right before a crash looks worse than the identical mix begun a year later — same portfolio, different luck. Holding the start year fixed strips out that luck so you compare the mixes, not their entry points. Then try 100% stocks vs 60/40 starting in **2007** — watch the drawdown chart through 2008.",
        ko: "이제 분석기를 직접 조작합니다. 신중하게 진행합니다.\n- **프리셋**을 고릅니다: 100% 주식, 60/40(앞 단계에서 정의), 올웨더, 또는 퍼머넌트.\n- **시작 연도**와 **매년 리밸런싱** 설정을 선택합니다.\n- 네 개 패널을 읽습니다: **주식 대비 성장 곡선**, **낙폭 차트**, **자산배분 막대**, **5개 지표 그리드**(CAGR, 실질 CAGR, 변동성, 샤프, 최대 낙폭).\n- **변동성** = 한 해 출렁임이 보통 얼마나 큰지(클수록 험난). **샤프** = 그 출렁임 한 단위당 벌어들인 수익 — '출렁임 대비 보상'(높을수록 좋음). 이 데이터에 맞는 간단한 기준: 100년치 연간 수익률에서는 대개 **0.3~0.6** 사이에 놓이므로, **0.5 부근이면 현실적으로 좋은 결과**로 보고, **1에 가깝거나 넘으면 (여기선 드문) 매우 좋은 편**으로 봅니다. 교과서적인 '1 초과'를 좇을 필요는 없습니다 — 장기 연간 숫자에서는 거의 나오지 않습니다.\n공정한 비교를 위해 먼저 *같은* 시작 연도로 각 프리셋을 돌립니다. 시작 연도가 중요한 이유: 폭락 직전에 시작한 조합은, 똑같은 조합을 1년 뒤에 시작한 것보다 나빠 보입니다 — 같은 포트폴리오, 다른 운. 시작 연도를 고정하면 그 운을 걷어내, 진입 시점이 아니라 조합 자체를 비교하게 됩니다. 그다음 **2007년** 시작으로 100% 주식과 60/40을 비교하고, 2008년을 지나는 낙폭 차트를 지켜봅니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read CAGR and real CAGR together", ko: "CAGR과 실질 CAGR을 함께 읽기" },
      body: {
        en: "'Smoothed' means CAGR is the single steady rate that gets you from start to end value — NOT the average of the yearly ups and downs. A portfolio that does +50% then −40% averages +5%/yr, but its CAGR is about −5%/yr (₩100 → ₩150 → ₩90), because compounding punishes the big fall. That gap is why we use CAGR, not a simple average.\n- A 9% CAGR over 30 years turns ₩10M into about ₩133M (10M × 1.09^30 ≈ 10M × 13.27). You can sanity-check the tool by hand: end value ÷ start value, take the (1/years) root, minus 1 → (133/10)^(1/30) − 1 ≈ 0.09. If it doesn't roughly match the CAGR the tool shows, you misread a number.\n- 'Nominal' is the headline before-inflation number; 'real' is after subtracting inflation. **Real CAGR** is what your purchasing power actually did.\n- A '2–4 point' gap between nominal and real CAGR means percentage POINTS — e.g. 9% nominal minus ~3% inflation ≈ 6% real, a 3-point gap (%p = percentage points) — not that real is 2–4% smaller than nominal. That gap *is* inflation quietly eating returns.\n- 100% stocks usually posts the highest CAGR. That is expected — it is the reward for taking the most risk. But do not stop here: a higher CAGR earned through a deep drawdown you sold into is worth *less* than a lower CAGR you actually held. The number only counts if you stay invested.",
        ko: "'다듬은'이란, CAGR이 매해의 오르내림을 평균낸 값이 *아니라* 시작값에서 끝값까지 데려다주는 단 하나의 꾸준한 비율이라는 뜻입니다. 한 해 +50%, 다음 해 −40%면 단순 평균은 +5%/년이지만, 실제 CAGR은 약 −5%/년입니다(100 → 150 → 90). 큰 하락이 복리를 갉아먹기 때문입니다. 이 차이 때문에 단순 평균이 아니라 CAGR을 씁니다.\n- 연 9% CAGR로 30년이면 1,000만 원이 약 1억 3,300만 원이 됩니다(1,000만 × 1.09^30 ≈ 1,000만 × 13.27배). 도구를 손으로 검산할 수도 있습니다: 끝값 ÷ 시작값, 여기에 (1/연수) 제곱근, 마지막에 1을 빼기 → (133/10)^(1/30) − 1 ≈ 0.09. 도구가 보여주는 CAGR과 대략 맞지 않으면 숫자를 잘못 읽은 것입니다.\n- '명목'은 인플레 반영 전 표면 숫자, '실질'은 인플레를 뺀 뒤입니다. **실질 CAGR**이 실제 구매력이 어떻게 됐는지를 보여줍니다.\n- 명목과 실질 CAGR 사이의 '2~4포인트' 차이는 퍼센트포인트를 뜻합니다 — 예: 명목 9%에서 인플레 약 3%를 빼면 실질 약 6%(3포인트 차이, %p = 퍼센트포인트) — 실질이 명목보다 2~4% 작다는 뜻이 아닙니다. 그 차이가 바로 물가가 조용히 갉아먹은 수익입니다.\n- 보통 100% 주식이 가장 높은 CAGR을 기록합니다. 당연합니다 — 가장 큰 위험을 감수한 대가니까요. 하지만 여기서 멈추면 안 됩니다: 깊은 낙폭 구간에서 팔아버린 채 얻은 높은 CAGR은, 끝까지 들고 있었던 낮은 CAGR보다 *가치가 낮습니다*. 숫자는 계속 투자하고 있을 때만 의미가 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read max drawdown as \"could I have held?\"", ko: "최대 낙폭을 \"내가 버틸 수 있었을까?\"로 읽기" },
      body: {
        en: "Max drawdown is the worst **peak-to-trough** loss — from a previous high point (the peak) down to the lowest point before it recovered (the trough). Translate it into money you own: a **50% drawdown** on a ₩100M portfolio means watching it sit at ₩50M — for months, sometimes years — with no promise it recovers.\n- On this annual data, 100% stocks has fallen about **−37%** in the 2008 crash and roughly **−65%** across the 1929–32 Depression, depending on your start year.\n- Diversified mixes like 60/40 or All-Weather typically cut the worst drawdown to roughly **12–40%** depending on the mix and start year — always shallower than 100% stocks.\n- One caveat: these drawdowns are measured at year-ends, so the true within-year lows were deeper (real-world stocks fell about −55% peak-to-trough into early 2009, versus the ~−37% this year-end series shows for 2008).\nAsk yourself honestly, not heroically: at what paper loss would you actually have sold? That number is your real risk limit — everything above it is fantasy.",
        ko: "최대 낙폭은 최악의 **고점 대비 바닥까지(peak-to-trough)** 손실입니다 — 이전 고점(peak)에서 회복 전 가장 낮은 지점(trough, 바닥)까지의 하락. 이걸 내가 가진 돈으로 바꿔봅니다: 1억 원 포트폴리오의 **50% 낙폭**은 그것이 5천만 원에 머무는 걸 몇 달, 때로는 몇 년 동안, 회복 보장도 없이 지켜본다는 뜻입니다.\n- 이 연간 데이터에서 100% 주식은 2008년에 약 **−37%**, 1929~32년 대공황을 포함하면 약 **−65%**까지 떨어졌습니다 — 시작 연도에 따라 다릅니다.\n- 60/40이나 올웨더 같은 분산 조합은 조합과 시작 연도에 따라 최악 낙폭을 대략 **12~40%**로 줄입니다 — 언제나 100% 주식보다 얕습니다.\n- 한 가지 유의점: 이 낙폭은 연말 기준으로 측정되므로, 실제 연중 저점은 더 깊었습니다(실제 주식은 2009년 초까지 고점 대비 약 −55% 떨어졌지만, 이 연말 시리즈의 2008년은 약 −37%로 나옵니다).\n영웅적으로 말고 정직하게 자문합니다: 나는 평가손실이 몇 %일 때 실제로 팔았을까요? 그 숫자가 당신의 진짜 위험 한도이고, 그 위는 전부 환상입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "2008 vs 2022: why diversification is not a guarantee", ko: "2008 vs 2022: 분산이 보장이 아닌 이유" },
      body: {
        en: "Diversification works when your holdings fall at *different times*. It fails when they fall *together*. First, one rule that drives both years: **when interest rates rise, existing bond prices fall** (and vice-versa). Why: a bond you own pays a fixed interest amount each year; if new bonds start paying more, yours is worth less at full price, so its market price drops to compensate. And in a panic, scared investors rush to buy the safest asset they know — government bonds — pushing their prices UP. That is 'fleeing to safety'. With that in hand:\n- **2008**: rates fell and money fled to safety, so long bonds *rose* ~+20% while stocks crashed ~−37%. A 60/40 or All-Weather holder felt a real but softer blow — bonds cushioned the fall.\n- **2022**: rates were hiked hard to fight inflation, so stocks (~−18%) AND long bonds (~−18%) fell *together*. Diversification gave far less protection that year.\nThe lesson: diversification lowers the *odds* and usually the *depth* of a bad year, but it does not promise safety. Any mix can have a painful year.",
        ko: "분산은 보유 자산들이 *서로 다른 시점*에 떨어질 때 효과가 있습니다. *함께* 떨어지면 실패합니다. 먼저 두 해를 모두 움직인 규칙 하나: **금리가 오르면 기존 채권 가격은 내립니다**(반대도 마찬가지). 이유: 내가 가진 채권은 매년 정해진 이자를 주는데, 새 채권이 이자를 더 주면 내 채권은 제값에 안 팔려 가격이 내려가 균형을 맞춥니다. 그리고 공포 국면에는 겁먹은 투자자들이 가장 안전한 자산인 국채로 몰려 가격이 오릅니다 — 이것이 '안전자산으로의 도피'입니다. 이걸 알고 나면:\n- **2008년**: 금리가 내리고 돈이 안전자산으로 몰리며 장기채는 약 +20% *올랐고* 주식은 약 −37% 폭락했습니다. 60/40이나 올웨더 보유자는 타격을 받되 더 부드럽게 받았습니다 — 채권이 하락을 완충했습니다.\n- **2022년**: 물가를 잡으려 금리를 강하게 올리자, 주식(약 −18%)과 장기채(약 −18%)가 *함께* 떨어졌습니다. 그해엔 분산의 보호 효과가 훨씬 약했습니다.\n교훈: 분산은 나쁜 해의 *확률*과 대개 그 *깊이*를 낮추지만, 안전을 약속하지는 않습니다. 어떤 조합이든 고통스러운 해가 올 수 있습니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Write down your mix — and why", ko: "당신의 조합과 그 이유를 적기" },
      body: {
        en: "Time to commit to paper. This is where the numbers become a decision.",
        ko: "이제 종이에 옮길 차례입니다. 숫자가 결정으로 바뀌는 지점입니다.",
      },
      prompt: {
        en: "Pick ONE preset you would actually hold and write two or three sentences: (1) its CAGR, real CAGR, volatility (or Sharpe), and max drawdown from the tool (volatility/Sharpe tell you how bumpy the ride was per unit of return — note whether your chosen mix is calmer than 100% stocks); (2) the largest paper loss you believe you could hold through without selling; (3) why this mix — not the highest-CAGR one — fits the ride you can stomach. Name the tradeoff you are accepting out loud.",
        ko: "실제로 보유할 프리셋 하나를 고르고 두세 문장으로 적습니다: (1) 도구에서 본 CAGR, 실질 CAGR, 변동성(또는 샤프), 최대 낙폭 (변동성/샤프는 수익 대비 여정이 얼마나 출렁였는지를 알려줍니다 — 내가 고른 조합이 100% 주식보다 잔잔한지 확인하세요); (2) 팔지 않고 버틸 수 있다고 믿는 최대 평가손실; (3) 왜 가장 높은 CAGR짜리가 아니라 이 조합이 당신이 견딜 수 있는 여정에 맞는지. 당신이 받아들이는 맞바꿈을 소리 내어 이름 붙입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Build it for real: sleeves → tickers, and the two formulas to re-measure it", ko: "실전으로 옮기기: 슬리브 → 티커, 그리고 다시 측정할 두 공식" },
      body: {
        en: "This lab compares *abstract sleeves* (US stocks, long bonds, gold, real estate, cash). To actually assemble the mix in a brokerage account you buy a low-cost **ETF** (exchange-traded fund — a single fund, bought like a stock, that holds a whole basket) for each sleeve. Here is one common way to map them — these are **examples to show what each sleeve looks like as a buyable fund, NOT recommendations**; always check the current expense ratio and holdings yourself:\n- **US stocks** → VTI or VOO\n- **Long-term Treasuries (long bonds)** → TLT (20yr+) or IEF (7–10yr)\n- **Gold** → GLD or IAU\n- **Real estate** → VNQ\n- **T-bills / cash** → BIL or SGOV\nKorean-listed equivalents exist for a won-denominated version (again, **예시일 뿐 추천이 아닙니다**): **KODEX 200** (stocks sleeve), **TIGER 미국채10년선물** (long Treasuries), **KODEX 골드선물(H)** (gold), **TIGER 리츠부동산** (real estate), **KODEX 단기채권** (T-bills/cash). \"(H)\" marks a currency-hedged fund; the *선물* ones hold futures, so read the fund's own page before buying.\n\nOnce you own a real mix, you don't need this tool to re-measure it — you can recompute the two headline risk numbers from any return series (monthly or yearly) yourself:\n- **Sharpe ratio** ≈ (CAGR − average T-bill/cash return) ÷ volatility. In words: take your annualized growth rate, subtract the roughly risk-free cash return over the same period (so you only reward the *extra* earned for taking risk), then divide by volatility — the annualized standard deviation of your returns (how far a typical period strays from average). Higher = more reward per unit of bumpiness.\n- **Max drawdown** = the worst value of (portfolio value ÷ its running peak − 1) across the whole period. In words: track the highest value reached so far (the running peak), and at each point compute how far below that peak you are; the deepest such drop is your max drawdown. It is always ≤ 0, and −0.30 means \"at the worst point you were 30% below your best-ever balance.\"\nWith the ticker map and these two formulas you can assemble the mix and keep score on your own — the tool was only ever training wheels.",
        ko: "이 랩은 *추상적인 슬리브*(미국 주식, 장기채, 금, 부동산, 현금)를 비교합니다. 이 조합을 실제 증권 계좌에서 꾸리려면, 슬리브마다 저비용 **ETF**(상장지수펀드 — 주식처럼 사고파는 하나의 펀드로, 자산 바구니 전체를 담습니다)를 하나씩 삽니다. 흔히 쓰는 대응 방식을 하나 보여드립니다 — 이건 **각 슬리브가 실제로 살 수 있는 펀드로는 어떤 모습인지 보여주는 예시일 뿐, 추천이 아닙니다**. 보수(운용수수료)와 편입 종목은 반드시 직접 최신 정보를 확인하세요.\n- **미국 주식** → VTI 또는 VOO\n- **장기국채(장기채)** → TLT(만기 20년+) 또는 IEF(7–10년)\n- **금** → GLD 또는 IAU\n- **부동산** → VNQ\n- **단기국채(T-bill)/현금** → BIL 또는 SGOV\n원화로 담고 싶다면 국내 상장 대응 상품도 있습니다(역시 **예시일 뿐 추천이 아닙니다**): **KODEX 200**(주식 슬리브), **TIGER 미국채10년선물**(장기국채), **KODEX 골드선물(H)**(금), **TIGER 리츠부동산**(부동산), **KODEX 단기채권**(단기국채/현금). \"(H)\"는 환헤지 상품을 뜻하고, *선물*이 붙은 것은 선물을 담으므로, 사기 전에 해당 펀드 안내 페이지를 꼭 읽어보세요.\n\n실제 조합을 보유하고 나면, 다시 측정하는 데 이 도구가 필요 없습니다 — 어떤 수익률 시리즈(월별이든 연별이든)에서든 두 개의 핵심 위험 지표를 직접 다시 계산할 수 있습니다.\n- **샤프 지수** ≈ (CAGR − 단기국채/현금 평균 수익) ÷ 변동성. 풀어 쓰면: 연환산 성장률에서 같은 기간의 대략 무위험인 현금 수익을 빼고(위험을 감수해 *추가로* 번 부분만 보상하도록), 이를 변동성 — 수익률의 연환산 표준편차(한 기간이 평균에서 보통 얼마나 벗어나는지) — 로 나눕니다. 높을수록 출렁임 한 단위당 보상이 큽니다.\n- **최대 낙폭** = 전 기간에 걸친 (포트폴리오 가치 ÷ 지금까지의 최고점 − 1)의 최악값. 풀어 쓰면: 지금까지 도달한 최고 가치(러닝 피크)를 계속 추적하고, 각 시점에서 그 고점보다 얼마나 아래인지 계산합니다. 그중 가장 깊은 하락이 최대 낙폭입니다. 항상 0 이하이며, −0.30은 \"최악의 순간에 역대 최고 잔고보다 30% 아래였다\"는 뜻입니다.\n티커 대응표와 이 두 공식만 있으면, 조합을 직접 꾸리고 스스로 점수를 매길 수 있습니다 — 이 도구는 어디까지나 보조바퀴였을 뿐입니다.",
      },
    },
    {
      kind: "conclude",
      title: { en: "What you decided, and what's next", ko: "무엇을 결정했고, 다음은 무엇인가" },
      body: {
        en: "You compared mixes on three axes at once — return, ride, and worst drop — and chose the one built for the person who has to hold it, not the one with the biggest headline number. That is the whole skill. Before you act on it, run this check:",
        ko: "당신은 수익, 여정, 최악의 하락이라는 세 축을 동시에 놓고 조합을 비교했고, 가장 눈에 띄는 숫자가 아니라 그것을 끝까지 들고 있어야 할 사람을 위한 조합을 골랐습니다. 그게 바로 이 기술의 전부입니다. 실행에 옮기기 전에 아래를 점검합니다.",
      },
      checklist: [
        { en: "I compared CAGR, real CAGR, AND max drawdown — not return alone.", ko: "수익률만이 아니라 CAGR, 실질 CAGR, 최대 낙폭을 함께 비교했습니다." },
        { en: "I noted how bumpy my mix's ride was (volatility / Sharpe), not just its return and worst drop.", ko: "수익과 최악의 하락만이 아니라, 내 조합의 여정이 얼마나 출렁였는지(변동성/샤프)도 확인했습니다." },
        { en: "I named the specific paper loss I believe I could actually hold through.", ko: "실제로 버틸 수 있다고 믿는 구체적인 평가손실 수준을 적었습니다." },
        { en: "I understand 2022 showed stocks and bonds can fall together — diversification is not a guarantee.", ko: "2022년이 주식과 채권이 함께 떨어질 수 있음을 보여줬다는 것, 즉 분산이 보장이 아님을 이해합니다." },
        { en: "My chosen mix reflects the ride I can stomach, not the highest possible return.", ko: "내가 고른 조합은 가능한 최고 수익이 아니라 내가 견딜 수 있는 여정을 반영합니다." },
        { en: "I treat this as a hypothesis to test further, not a recommendation to act on blindly.", ko: "이것을 맹목적으로 실행할 권고가 아니라, 더 검증해볼 가설로 다룹니다." },
      ],
    },
  ],
};

export const costDrag: Walkthrough = {
  labId: "cost-drag",
  title: {
    en: "What a 1% fee really costs over a lifetime",
    ko: "1% 수수료가 평생에 걸쳐 정말로 얼마나 드는가",
  },
  goal: {
    en: "Set a personal expense-ratio ceiling you will refuse to cross, and decide lump-sum vs dollar-cost-averaging for your own situation.",
    ko: "절대 넘지 않을 개인 보수율 상한선을 정하고, 당신의 상황에 맞는 일시투자 대 분할매수를 결정합니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "Frame the questions", ko: "질문 정리하기" },
      body: {
        en: "Fees feel invisible because they are quoted as a tiny annual percentage. This lab makes them visible. Ask, in order:\n- **How much does a fee actually cost** over a multi-decade holding period, in money, not percent?\n- **Why does a small fee become a big number?** (Hint: it compounds every year, against your whole balance, forever.)\n- **Lump-sum or dollar-cost-averaging (DCA)?** Lump-sum = put the whole amount in on day one. DCA = split it into equal chunks and buy the same dollar amount on a fixed schedule (e.g. 1/12 of it each month for a year), regardless of price. Which wins on average, and which lets me sleep?\n\nFirst, the word that runs through the whole lab: **compounding**. Compounding is growth earning its own growth — this year's gains join next year's base, so the pile grows faster and faster, like a snowball rolling downhill that picks up more snow the bigger it gets. A fee is a slice taken off that snowball every single year, so it doesn't just cost you the slice — it costs you all the future snowball that slice would have become. A fee is the one variable in investing you fully control. Returns you can't. This is worth getting right.",
        ko: "수수료는 아주 작은 연간 퍼센트로 표시되기 때문에 눈에 잘 띄지 않습니다. 이 랩은 그걸 눈에 보이게 만듭니다. 순서대로 묻습니다.\n- 수십 년 보유 기간 동안 수수료는 퍼센트가 아니라 **돈으로 실제 얼마가 드는가?**\n- **작은 수수료가 왜 큰 숫자가 되는가?** (힌트: 매년, 전체 잔고에 대해, 영원히 복리로 붙습니다.)\n- **일시불(목돈 투자)이냐 분할매수(DCA)냐?** 일시불 = 전액을 첫날 한 번에 넣기. 분할매수 = 같은 금액을, 정해진 주기로, 가격과 무관하게 나눠 사기(예: 12개월에 걸쳐 매달 1/12씩). 평균적으로 무엇이 이기고, 무엇이 마음 편할까?\n\n먼저, 이 랩 전체를 관통하는 단어: **복리**. 복리란 이자가 이자를 낳는 것 — 올해의 수익이 내년의 원금에 더해져서, 쌓일수록 점점 더 빨리 불어납니다. 굴러갈수록 더 커지는 눈덩이처럼요. 수수료는 그 눈덩이에서 매년 한 조각씩 떼어가는 것이라, 떼인 그 조각뿐 아니라 그 조각이 앞으로 불어났을 미래의 눈덩이 전체를 잃는 셈입니다. 수수료는 투자에서 당신이 완전히 통제할 수 있는 유일한 변수입니다. 수익률은 못 합니다. 제대로 정할 가치가 있습니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the growth numbers come from", ko: "성장 숫자의 출처" },
      body: {
        en: "The fee drag is not a guess — it is applied to real historical market growth. This lab reuses the same static dataset as the other allocation labs, so the \"lost to fees\" figure reflects what fees would have skimmed off actual multi-decade returns.\n\nAs a rough anchor, US stocks returned very roughly ~10% per year before inflation (~7% after inflation) over this long history. You can turn a growth rate into a doubling time with the **rule of 72** — a mental shortcut where 72 ÷ (percent return) ≈ the years for money to double. At ~10% nominal that is 72 ÷ 10 ≈ 7 years; at ~7% real it is 72 ÷ 7 ≈ 10 years. So the *nominal* (dollar) curve should roughly double every ~7 years and the *real* (after-inflation) buying power every ~10 years — that is where the \"~7–10 years\" range comes from, and it is the anchor the fee is quietly charged against.\n\nOne more term the tool uses: **nominal vs real**. Nominal is the dollar number you see on your statement; real (after-inflation) is what that money can actually buy, because prices rise over time. Prices are measured by **CPI (the Consumer Price Index)** — an official gauge of the average price of a typical shopping basket (food, rent, transport). When CPI rises, the same money buys less. Example: your balance grows $1,000 → $1,030 in a year (+3% nominal) but prices also rose 3% (CPI +3%) — in real terms you can buy exactly the same amount, so your real gain is ~0%. The tool may show a \"real\" value smaller than the nominal balance: that is not a bug, it is inflation.",
        ko: "수수료로 인한 손실은 추정이 아니라, 실제 과거 시장 성장에 적용한 값입니다. 이 랩은 다른 자산배분 랩과 동일한 정적 데이터셋을 재사용하므로, \"수수료로 잃은 금액\"은 실제 수십 년 수익에서 수수료가 걷어갔을 몫을 반영합니다.\n\n대략적인 기준으로, 미국 주식은 이 긴 역사에서 물가 반영 전 연 약 10%(물가 반영 후 약 7%)를 냈습니다. 수익률을 두 배가 되는 기간으로 바꾸는 암산 요령이 **72의 법칙**입니다 — 72 ÷ (퍼센트 수익률) ≈ 돈이 두 배가 되는 데 걸리는 햇수. 명목 약 10%면 72 ÷ 10 ≈ 7년, 실질 약 7%면 72 ÷ 7 ≈ 10년입니다. 그래서 *명목*(달러) 곡선은 약 7년마다, *실질*(물가 반영 후) 구매력은 약 10년마다 대략 두 배가 됩니다 — 여기서 \"약 7~10년\" 범위가 나오며, 이것이 바로 수수료가 조용히 부과되는 기준선입니다.\n\n도구가 쓰는 용어 하나 더: **명목 vs 실질**. 명목은 계좌에 찍히는 숫자이고, 실질(물가 반영 후)은 그 돈으로 실제로 살 수 있는 양입니다. 시간이 지나면 물가가 오르기 때문이죠. 물가는 **CPI(소비자물가지수)**로 측정합니다 — 전형적인 장바구니(식료품, 임대료, 교통)의 평균 가격을 재는 공식 지표입니다. CPI가 오르면 같은 돈으로 살 수 있는 게 줄어듭니다. 예: 잔고가 1년에 $1,000 → $1,030으로 늘어(+3% 명목) 물가도 3% 올랐다면(CPI +3%), 실제로 살 수 있는 양은 그대로여서 실질 수익은 약 0%입니다. 그래서 실질 값이 명목 잔고보다 작게 보일 수 있는데, 이는 오류가 아니라 물가(인플레이션) 때문입니다.",
      },
      sources: [
        {
          name: { en: "Damodaran NYU returns + Minneapolis Fed CPI", ko: "다모다란 NYU 수익률 + 미니애폴리스 연은 CPI" },
          what: { en: "Annual US total returns 1928–2025 (drives the growth curve) plus CPI, the Consumer Price Index (for real, after-inflation values).", ko: "1928~2025년 미국 연간 총수익률(성장 곡선을 만듭니다)과 소비자물가지수 CPI(실질, 물가 반영 값용)." },
          why: { en: "A fee is only meaningful against real compounding. Using genuine historical returns shows the drag as it actually would have played out, not on a made-up constant rate.", ko: "수수료는 실제 복리 위에서만 의미가 있습니다. 진짜 과거 수익률을 쓰면, 지어낸 고정 수익률이 아니라 실제로 벌어졌을 방식대로 그 손실이 드러납니다." },
          url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
        },
      ],
    },
    {
      kind: "read",
      title: { en: "What a fee actually is (and where to find it)", ko: "수수료가 정확히 무엇인가 (그리고 어디서 찾는가)" },
      body: {
        en: "The fee the tool sliders is a fund's **expense ratio (보수율)** — the annual percentage of your invested money the fund company skims off every year, automatically, just for holding it. A 1% expense ratio means for every $10,000 you have in the fund, about $100 leaves your account each year, forever, whether the fund goes up or down.\n\nA couple of terms that show up throughout:\n- An **index fund** is a fund that simply owns everything in a market *index* (a fixed, published list of stocks) in the same proportions, instead of paying a manager to pick winners — so it is cheap to run.\n- **Broad-market** means the index covers essentially the whole market (e.g. the S&P 500 or a total-market fund), not a narrow slice like one sector or one country.\n\n**Where to read it on a REAL fund (so you can do this without our tool):** open the fund's **fact sheet**, its **prospectus** (투자설명서; for a quick version look for the 간이투자설명서, the summary prospectus), or the fund/ETF page at your broker. Look for a line labeled **Expense Ratio**, **Net Expense Ratio**, or **TER (Total Expense Ratio)** — in Korea the same figure is labeled **총보수**, **총보수·비용(TER)**, or shown on the **간이투자설명서**. If both a gross and a net figure are shown, read the *net* one; that is what you actually pay. Typical ranges to sanity-check what you find: a broad-market index fund/ETF runs about **0.02%–0.20%**; an actively managed fund is often **0.5%–1.5%+**. If a fund quotes far above those ranges, that is your signal to ask what you are paying for.",
        ko: "도구의 슬라이더가 조절하는 수수료는 펀드의 **보수율(expense ratio)**입니다 — 그저 보유하고 있다는 이유만으로, 매년 자동으로, 펀드 회사가 당신의 투자금에서 떼어가는 연간 퍼센트입니다. 1% 보수율은 펀드에 넣은 $10,000당 매년 약 $100가, 펀드가 오르든 내리든, 영원히 계좌에서 빠져나간다는 뜻입니다.\n\n두루 등장하는 용어 몇 가지:\n- **인덱스 펀드**는 종목을 고르는 매니저에게 비용을 치르는 대신, 시장 *지수*(공표된 고정 종목 리스트)에 담긴 종목 전부를 같은 비중으로 그대로 보유하는 펀드입니다 — 그래서 운용비가 쌉니다.\n- **광범위 시장(broad-market)**은 특정 섹터나 한 나라 같은 좁은 조각이 아니라 시장 전체를 사실상 모두 담는다는 뜻입니다(예: S&P 500, 또는 전체시장 펀드).\n\n**실제 펀드에서 어디를 읽는가 (우리 도구 없이 직접 하려면):** 펀드의 **팩트시트**, **투자설명서**(빠르게 보려면 요약본인 **간이투자설명서**를 찾으세요), 또는 증권사의 펀드/ETF 상세 페이지를 엽니다. **Expense Ratio**, **Net Expense Ratio**, 또는 **TER(Total Expense Ratio, 총보수·비용)** 라고 적힌 줄을 찾으세요 — 한국에서는 같은 수치가 **총보수**, **총보수·비용(TER)** 로 표시되거나 **간이투자설명서**에 실려 있습니다. 총(gross)과 순(net) 두 값이 함께 나오면 *순(net)* 값을 읽으세요; 그게 실제로 내는 금액입니다. 찾은 값을 가늠할 전형적인 범위: 광범위 시장 인덱스 펀드/ETF는 약 **0.02%~0.20%**, 액티브 운용 펀드는 흔히 **0.5%~1.5% 이상**입니다. 이 범위를 크게 웃도는 펀드라면, 무엇에 대한 대가를 치르는지 물어봐야 한다는 신호입니다.",
      },
    },
    {
      kind: "tool",
      title: { en: "Run the fee simulator", ko: "수수료 시뮬레이터 돌려보기" },
      body: {
        en: "Drive the analyzer step by step:\n- Set a **start year** far enough back to see decades compound (try the earliest, or ~40 years ago).\n- Toggle **lump-sum vs dollar-cost-averaging (DCA)**.\n- Drag the **fee slider** from 0.1% up toward 2%.\n\nWatch two things: the **final value at a low fee vs your chosen fee**, and the **amount \"lost to fees\"**. Move the slider slowly from 0.1% to 1% and watch the lost-to-fees number climb far faster than the fee itself does. That acceleration is the whole lesson.\n\nWhat the money figures are relative to:\n- The tool grows a **fixed $10,000**. In DCA mode it invests that same $10,000 in equal yearly slices across the whole period instead of all on day one. So every dollar figure is relative to that $10,000 — read \"lost to fees\" as \"of my $10,000-grown-for-decades, this much is gone to fees.\"\n- The low-fee benchmark it compares against is a near-zero **0.03%** fund; \"lost to fees\" = that 0.03% fund's value minus your slider-fee fund's value.\n- **What to expect** (default: start 1985, ~41 years, $10,000, **in lump-sum mode**): at 0.03% it grows to about **$968,000**; at 1% it ends near **$674,000** — roughly **$294,000, about 30%, gone to fees**. Notice raising the fee from 0.1% to 1% (about $90/yr more on the first $10k) costs far more than the fee gap suggests, because the skimmed dollars also missed decades of compounding.\n- If you have **DCA toggled on**, all these dollar totals will be much smaller (your $10,000 goes in gradually, so it spends fewer years compounding) — that is expected, not a sign you did it wrong. To reproduce the $968k/$674k/$294k figures exactly, switch to lump-sum. The *fee lesson* (roughly a third lost to a 1% fee) holds in both modes; only the dollar totals move.",
        ko: "분석기를 단계별로 조작합니다.\n- 수십 년의 복리를 볼 수 있을 만큼 과거로 **시작 연도**를 설정합니다(가장 이른 해, 또는 약 40년 전).\n- **일시투자 vs 분할매수(DCA)**를 전환합니다.\n- **수수료 슬라이더**를 0.1%에서 2%까지 끌어올립니다.\n\n두 가지를 봅니다: **낮은 수수료일 때와 선택한 수수료일 때의 최종 금액**, 그리고 **\"수수료로 잃은 금액\"**. 슬라이더를 0.1%에서 1%로 천천히 옮기며, 잃은 금액이 수수료 자체보다 훨씬 빠르게 불어나는 걸 지켜봅니다. 그 가속이 이 랩의 핵심입니다.\n\n돈 숫자가 무엇을 기준으로 하는지:\n- 이 도구는 고정된 **$10,000**를 굴립니다. 분할매수 모드에서는 같은 $10,000를 처음에 한 번에 넣는 대신 전체 기간에 걸쳐 매년 똑같은 금액으로 나눠 넣습니다. 그래서 모든 달러 숫자는 그 $10,000 기준입니다 — \"수수료로 잃은 금액\"은 \"수십 년 굴린 내 $10,000 중 이만큼이 수수료로 사라졌다\"로 읽으세요.\n- 비교 기준이 되는 저수수료 벤치마크는 거의 0에 가까운 **0.03%** 펀드입니다. \"수수료로 잃은 금액\" = 그 0.03% 펀드의 값 빼기 당신의 슬라이더 수수료 펀드의 값.\n- **예상 결과**(기본값: 1985년 시작, 약 41년, $10,000, **일시투자 모드 기준**): 0.03%에서는 약 **$968,000**이 되지만, 1%에서는 약 **$674,000**에 그칩니다 — 약 **$294,000, 대략 30%가 수수료로** 사라진 셈입니다. 수수료를 0.1%에서 1%로 올리면(첫 $10k에 대해 연 약 $90 차이) 수수료 격차가 시사하는 것보다 훨씬 큰 비용이 드는데, 떼인 돈이 수십 년의 복리까지 놓쳤기 때문입니다.\n- **분할매수(DCA)를 켜 두었다면** 이 모든 달러 총액은 훨씬 작아집니다($10,000가 나눠 들어가서 복리로 불어나는 햇수가 적기 때문) — 이는 잘못한 게 아니라 당연한 결과입니다. $968k/$674k/$294k 수치를 그대로 재현하려면 일시투자로 바꾸세요. *수수료 교훈*(1% 수수료에 약 3분의 1 손실)은 두 모드 모두에서 유효하며, 달러 총액만 달라집니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the \"lost to fees\" number honestly", ko: "\"수수료로 잃은 금액\"을 정직하게 읽기" },
      body: {
        en: "Over a long ~30–40 year horizon at ~10% growth, a **1% annual fee quietly eats roughly a quarter to a third of your final pile** versus a near-zero fee — about 24% at 30 years, about 31% at 40 years. Not 1% — a quarter to a third. That is because the fee is charged every year on the *whole* pot, so it also steals all the future growth that money would have earned.\n- **Where that comes from (so you can reproduce it):** the tool subtracts the fee from each year's return, so a 1% fee turns a ~10% gross return into ~9% net. To hand-check the *fraction* lost, pretend the return is a flat 10% every year and compare the two paths over N years: kept = ((1.10 − fee) / 1.10)^N, and lost = 1 − kept. At 30 years, (1.09/1.10)^30 = 0.76 → about 24% lost; at 40 years, (1.09/1.10)^40 = 0.69 → about 31% lost. Shorten the horizon, lower the return, or shrink the fee and the lost fraction shrinks — that is why it is \"roughly a quarter to a third,\" not exact.\n- **Why your hand-check won't match the tool's dollars exactly:** this flat-10% formula only estimates the *percentage* lost. The tool uses the *real, year-by-year historical returns* (some years +30%, some −20%), not a smooth 10%, so its dollar totals (e.g. $968k, not the $520k a flat 10% on $10,000 over 41 years would give) differ — and its lost *fraction* can land a bit off ~24–31% too, because the fee bites hardest in the biggest-return years. The rule of thumb to trust: the *percentage* eaten by a 1% fee should land near a quarter-to-a-third over 30–40 years; the exact dollars come from the real return path.\n- The drag compounds: each year's fee removes **capital (your invested money / principal)** that can never compound again.\n- The longer the horizon, the worse it gets — young investors pay the most in total.\n- This is why the difference between a 0.05% index fund and a 1% fund is not \"a little more expensive.\" Recall: 0.05% is about $5/yr per $10,000; 1% is about $100/yr — **20× more, every single year**. It is a materially different retirement.",
        ko: "약 10% 수익률로 30~40년의 긴 기간을 굴리면, **연 1% 수수료는 거의 0에 가까운 수수료 대비 최종 잔고의 대략 4분의 1에서 3분의 1을 조용히 갉아먹습니다** — 30년이면 약 24%, 40년이면 약 31%. 1%가 아니라 4분의 1에서 3분의 1입니다. 수수료가 매년 *전체* 자산에 부과되기 때문에, 그 돈이 벌었을 미래 성장까지 함께 훔쳐가기 때문입니다.\n- **이 숫자의 출처(직접 재현해 보기):** 도구는 매년 수익률에서 수수료를 빼므로, 1% 수수료는 약 10% 총수익을 약 9% 순수익으로 바꿉니다. *잃는 비율*을 손으로 확인하려면, 수익률을 매년 일정한 10%라고 가정하고 두 경로를 N년에 걸쳐 비교하면: 남는 비율 = ((1.10 − 수수료) / 1.10)^N, 잃는 비율 = 1 − 남는 비율. 30년이면 (1.09/1.10)^30 = 0.76 → 약 24% 손실, 40년이면 (1.09/1.10)^40 = 0.69 → 약 31% 손실. 기간을 줄이거나, 수익률을 낮추거나, 수수료를 줄이면 잃는 비율도 줄어듭니다 — 그래서 정확한 값이 아니라 \"대략 4분의 1에서 3분의 1\"입니다.\n- **손으로 계산한 값이 도구의 달러와 정확히 안 맞는 이유:** 이 일정-10% 공식은 잃는 *퍼센트*만 추정합니다. 도구는 매끄러운 10%가 아니라 *실제 연도별 과거 수익률*(어떤 해는 +30%, 어떤 해는 −20%)을 쓰므로, 달러 총액(예: $968k, 일정 10%로 $10,000를 41년 굴리면 나오는 약 $520k가 아님)이 다르고 — 수수료가 수익이 큰 해에 가장 크게 물리기 때문에 잃는 *비율*도 약 24~31%에서 조금 벗어날 수 있습니다. 믿어야 할 규칙: 1% 수수료가 먹는 *퍼센트*는 30~40년 기준 4분의 1에서 3분의 1 근처에 떨어져야 하고, 정확한 달러는 실제 수익 경로에서 나옵니다.\n- 손실은 복리로 커집니다: 매년의 수수료가 다시는 복리로 불어날 수 없는 **자본(투자한 원금)**을 떼어갑니다.\n- 기간이 길수록 더 나빠집니다. 젊은 투자자가 총액으로는 가장 많이 냅니다.\n- 그래서 0.05% 인덱스 펀드와 1% 펀드의 차이는 \"조금 더 비싸다\"가 아닙니다. 참고: 0.05%는 $10,000당 연 약 $5, 1%는 연 약 $100 — **매년 20배** 더 냅니다. 실질적으로 다른 노후입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Lump-sum vs DCA: math vs regret", ko: "일시투자 vs 분할매수: 수학 vs 후회" },
      body: {
        en: "Toggle the two modes and compare final values from the same start year.\n- **Lump-sum usually wins.** Markets rise more years than they fall, so money invested sooner spends more time compounding. On average, investing everything at once beats spreading it out. Historically, investing a lump sum right away has beaten spreading it over ~12 months about two-thirds of the time, ending ahead by only a couple of percent of the *final ending balance* on average — not a fortune (Vanguard). Put in money: on a pot that grew to about $12,000 after that first year, a 2% edge is roughly **$240** — small next to the $294,000 a 1% fee cost over decades. So the \"cost\" of choosing DCA for peace of mind is usually small. (Note: the tool's DCA spreads your $10,000 across the *whole* multi-decade window, not just 12 months, so its gap is much larger than that classic finding — it mostly reflects the money being invested for less time, not the fee.)\n- **DCA can still be rational.** Spreading purchases means no single unlucky entry date wrecks you, and it lowers the odds of the specific regret of dumping everything in right before a crash.\n- The honest framing: lump-sum optimizes the *expected outcome* (the average result across many possible histories, not the one you happen to hope for); DCA buys down *behavioral risk* (the risk that YOU panic and sell at the worst moment). If a slightly worse average return is the price of not panic-selling, that can be a fair trade for a real human.",
        ko: "두 모드를 전환해 같은 시작 연도의 최종 금액을 비교합니다.\n- **일시투자가 보통 이깁니다.** 시장은 떨어지는 해보다 오르는 해가 많아서, 더 일찍 넣은 돈이 더 오래 복리로 불어납니다. 평균적으로는 한 번에 다 넣는 쪽이 나눠 넣는 쪽을 이깁니다. 역사적으로 목돈을 한 번에 투자하는 편이 약 12개월에 걸쳐 나눠 넣는 것보다 약 3분의 2의 경우 앞섰고, 평균 우위는 *최종 잔고*의 겨우 몇 퍼센트 수준이었습니다 — 큰돈이 아닙니다(뱅가드). 돈으로 환산하면: 첫해에 약 $12,000까지 불어난 자산에서 2% 우위는 약 **$240**로, 수십 년에 걸쳐 1% 수수료가 앗아간 $294,000에 비하면 미미합니다. 그래서 마음의 평화를 위해 분할매수를 택하는 비용은 대개 작습니다. (참고: 이 도구의 분할매수는 $10,000를 12개월이 아니라 수십 년 *전체* 기간에 걸쳐 나눠 넣으므로, 그 격차는 위 고전적 결과보다 훨씬 큽니다 — 이는 주로 돈이 평균적으로 더 짧게 투자된 탓이지 수수료 탓이 아닙니다.)\n- **분할매수도 합리적일 수 있습니다.** 매수를 나누면 운 나쁜 진입일 하나가 당신을 망치지 못하고, 폭락 직전에 전부 몰아넣는 특유의 후회 확률을 낮춥니다.\n- 정직한 정리: 일시투자는 *기댓값*(하나의 바람이 아니라 수많은 가능한 역사에 걸친 평균 결과)을 최적화하고, 분할매수는 *행동 위험*(최악의 순간에 당신이 겁먹고 팔아버릴 위험)을 사들입니다. 조금 낮은 평균 수익이 공황 매도를 안 하는 대가라면, 진짜 인간에게는 공정한 거래일 수 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Two caveats before you decide", ko: "결정 전 두 가지 유의점" },
      body: {
        en: "Keep the tool honest in your head:\n- **Fee ≠ value.** A slightly higher fee is not automatically bad — a fund that reliably *tracks its index* for 0.20% may beat a sloppy 0.05% one. (Tracking an index = how closely a fund matches the index it copies; a fund that tracks well moves almost exactly with the index, a sloppy one drifts away, so two funds with the same fee can deliver different results.) Judge fee *relative to what it delivers*, not in isolation. That said, for plain broad-market exposure (broad-market = owning essentially the whole market, not a narrow slice — see the fee step above), low fee almost always wins.\n- **Past returns aren't future returns.** The dataset shows markets rose more often than they fell historically, which is what makes lump-sum win on average. If the future is different, the edge shrinks. The *fee* lesson, though, holds regardless — a fee is a certain, guaranteed cost no matter what returns do.",
        ko: "도구를 머릿속에서 정직하게 유지합니다.\n- **수수료 ≠ 가치.** 조금 더 높은 수수료가 자동으로 나쁜 건 아닙니다 — 0.20%로 지수를 안정적으로 *추종*하는 펀드가 엉성한 0.05% 펀드를 이길 수 있습니다. (지수 추종 = 펀드가 베끼려는 지수를 얼마나 정확히 따라가는가. 잘 추종하는 펀드는 지수와 거의 똑같이 움직이고, 엉성한 펀드는 벌어져서, 수수료가 같아도 결과가 다를 수 있습니다.) 수수료는 홀로가 아니라 *그것이 주는 것 대비*로 판단합니다. 다만 평범한 광범위 시장 노출이라면(광범위 시장 = 좁은 조각이 아니라 시장 전체를 사실상 모두 담는 것 — 위 수수료 단계 참고) 거의 항상 낮은 수수료가 이깁니다.\n- **과거 수익은 미래 수익이 아닙니다.** 데이터셋은 역사적으로 시장이 떨어질 때보다 오를 때가 많았음을 보여주고, 그래서 일시투자가 평균적으로 이깁니다. 미래가 다르면 그 우위는 줄어듭니다. 그러나 *수수료* 교훈은 무조건 유효합니다. 수수료는 수익이 어떻든 확정적이고 보장된 비용이니까요.",
      },
    },
    {
      kind: "judge",
      title: { en: "Set your ceiling and your method", ko: "당신의 상한선과 방식 정하기" },
      body: {
        en: "Turn what you saw into two personal rules.",
        ko: "본 것을 두 가지 개인 원칙으로 바꿉니다.",
      },
      prompt: {
        en: "Write it down: (1) the single expense-ratio ceiling you will refuse to exceed for a broad-market fund, and the \"lost to fees\" figure from the tool at the standard scenario you ran (start amount, ~40-year horizon, your ceiling fee vs a near-zero fee) that convinced you of it; (2) whether you will use lump-sum or DCA for the money you have now, and one honest sentence on whether you chose it for the math or for your own peace of mind.",
        ko: "적어봅니다: (1) 광범위 시장 펀드에 대해 절대 넘지 않을 단일 보수율 상한선과, 당신을 설득한 도구의 표준 시나리오(시작 금액, 약 40년 기간, 상한선 수수료 대 거의 0인 수수료)에서 나온 \"수수료로 잃은 금액\" 수치; (2) 지금 가진 돈에 일시투자를 쓸지 분할매수를 쓸지, 그리고 그것을 수학 때문에 골랐는지 마음의 평화 때문에 골랐는지에 대한 정직한 한 문장.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Your fee rule, locked in", ko: "확정된 당신의 수수료 원칙" },
      body: {
        en: "You now see fees the way a long-term investor should: not as a small annual percent, but as a compounding drag that can quietly eat a quarter to a third of your balance. And you have a stance on lump-sum vs DCA that fits your own psychology, not just a textbook. Before you act:",
        ko: "이제 당신은 장기 투자자가 봐야 하는 방식으로 수수료를 봅니다: 작은 연간 퍼센트가 아니라, 잔고의 4분의 1에서 3분의 1을 조용히 먹어치울 수 있는 복리 손실로. 그리고 교과서가 아니라 당신 자신의 심리에 맞는 일시투자 대 분할매수의 입장을 갖게 됐습니다. 실행하기 전에:",
      },
      checklist: [
        { en: "I wrote down a specific expense-ratio ceiling I will not exceed for index funds.", ko: "인덱스 펀드에 대해 넘지 않을 구체적인 보수율 상한선을 적었습니다." },
        { en: "I saw, in money, how ~1% over decades can cost roughly a quarter to a third of the ending balance.", ko: "수십 년에 걸친 약 1%가 최종 잔고의 약 4분의 1에서 3분의 1을 앗아갈 수 있음을 돈으로 확인했습니다." },
        { en: "I chose lump-sum or DCA and can say honestly whether it was for the math or for regret-avoidance.", ko: "일시투자 또는 분할매수를 골랐고, 그것이 수학 때문인지 후회 회피 때문인지 정직하게 말할 수 있습니다." },
        { en: "I will check the actual expense ratio of any fund before buying (on its fact sheet, prospectus, or broker page), not just its name or past return.", ko: "어떤 펀드든 사기 전에 이름이나 과거 수익이 아니라 실제 보수율을(팩트시트, 투자설명서, 또는 증권사 페이지에서) 확인하겠습니다." },
        { en: "I treat this as a hypothesis to test against my real options, not a recommendation to act on blindly.", ko: "이것을 맹목적으로 실행할 권고가 아니라, 내 실제 선택지에 비춰 검증할 가설로 다룹니다." },
      ],
    },
  ],
};

export const glidePath: Walkthrough = {
  labId: "glide-path",
  title: {
    en: "The glide path and why order of returns can make or break you",
    ko: "글라이드 패스, 그리고 수익률의 순서가 왜 당신을 살리거나 무너뜨리는가",
  },
  goal: {
    en: "Decide how much equity is right for your years-to-goal, and how sequence-of-returns risk should change your withdrawal plan.",
    ko: "당신의 목표까지 남은 기간에 맞는 주식 비중을 정하고, 수익률 순서 위험이 인출 계획을 어떻게 바꿔야 하는지를 결정합니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "Frame the questions", ko: "질문 정리하기" },
      body: {
        en: "First, three words this whole lab reuses:\n- A **portfolio** is simply all your invested money, split across different TYPES of holdings. This lab uses three: **stocks** (also called *equities* — part-ownership of companies), **bonds** (loans to a government or company that pay interest), and **cash** (money parked safely earning a little, here short-term government bills). Think of your portfolio as a grocery cart — you choose how much of each type to put in.\n- Your **equity share** is the fraction of your portfolio held in stocks. \"70% equity\" means 70 cents of every dollar you own is in stocks, and the other 30 cents in bonds and cash. (Equity = stocks; the words are interchangeable.)\n- The core trade-off in one line: stocks tend to earn the most over long stretches but can crash hard in a single year; bonds and cash earn less but barely move. **Cash is the fire extinguisher, stocks are the engine.**\n\nWith that vocabulary, this lab covers two ideas that only matter near a goal, especially retirement. Ask, in order:\n- **How should my mix change as the goal approaches?** (The glide path: from growth to safety as the horizon shortens.)\n- **Why is the timing of bad years so dangerous once I'm withdrawing?** (Sequence-of-returns risk.)\n- **Given my own years-to-goal, how much equity is right, and how does sequence risk change how I withdraw?**\n\nWhile you are only *saving* — adding money and never taking any out — every dollar and every share you buy is still there at the end no matter what order the good and bad years came in, so the final balance depends only on the total compounded growth, not the sequence. The moment you start *withdrawing* — selling some holdings each year to live on — a bad year early forces you to sell shares while prices are low, and those sold shares are gone before the recovery. Sold shares can't participate in the rebound, so order suddenly decides everything. This lab shows why.",
        ko: "먼저, 이 랩 전체가 반복해서 쓰는 세 단어부터:\n- **포트폴리오**는 그저 당신의 투자한 돈 전부를, 서로 다른 종류의 보유 자산에 나눠 담은 것입니다. 이 랩은 세 가지를 씁니다: **주식**(*equity*라고도 하며, 회사의 부분 소유권), **채권**(정부나 기업에 빌려주고 이자를 받는 것), **현금**(안전하게 두고 약간의 이자를 받는 돈, 여기서는 단기 국채). 포트폴리오는 장바구니와 같아서, 각 종류를 얼마씩 담을지 당신이 정합니다.\n- **주식 비중**은 포트폴리오 중 주식에 담긴 비율입니다. \"주식 비중 70%\"는 보유한 1달러 중 70센트가 주식에 있고 나머지 30센트가 채권과 현금에 있다는 뜻입니다. (equity = 주식이며, 두 말은 같은 뜻입니다.)\n- 핵심 트레이드오프를 한 줄로: 주식은 장기적으로 가장 높은 수익을 내는 경향이 있지만 특정 한 해에는 크게 폭락할 수 있고, 채권과 현금은 수익은 낮지만 거의 움직이지 않습니다. **현금은 소화기, 주식은 엔진입니다.**\n\n이 어휘를 갖고, 이 랩은 목표(특히 은퇴)가 가까울 때만 중요해지는 두 가지 개념을 다룹니다. 순서대로 묻습니다.\n- **목표가 다가올수록 내 조합은 어떻게 바뀌어야 하는가?** (글라이드 패스: 기간이 짧아질수록 성장에서 안전으로.)\n- **인출을 시작하면 나쁜 해의 타이밍이 왜 그렇게 위험한가?** (수익률 순서 위험.)\n- **내 목표까지 남은 기간을 볼 때, 주식 비중은 얼마가 맞고, 순서 위험은 내 인출 방식을 어떻게 바꿔야 하는가?**\n\n*모으기만* 할 때 — 돈을 넣기만 하고 하나도 빼지 않을 때 — 는 좋은 해와 나쁜 해의 순서가 어떻든 산 주식이 끝까지 그대로 남아 있어, 최종 잔액은 순서가 아니라 누적 성장에만 달려 있습니다. 하지만 *인출*을 시작하는 순간 — 매년 생활비로 일부를 팔아야 하는 순간 — 초반의 나쁜 해는 가격이 낮을 때 주식을 팔도록 강요하고, 그렇게 팔린 주식은 반등 전에 사라집니다. 팔아버린 주식은 이후 반등에 참여할 수 없으므로, 순서가 갑자기 모든 것을 좌우하게 됩니다. 이 랩이 그 이유를 보여줍니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the sequence demo's returns come from", ko: "순서 데모의 수익률 출처" },
      body: {
        en: "First, what a \"return\" is: a return for a year is simply the percent your money gained or lost that year — a return of +20% means your holding grew by a fifth; −37% means it lost more than a third of its value in that year.\n\nThe sequence demo is fixed at **2000–2024** on purpose — a stretch that opens with the dot-com bust (2000–2002) and the 2008 financial crisis, a genuinely brutal early sequence. Both were stock-market crashes where the broad US market fell roughly **45–55% from peak to trough** — \"peak to trough\" means measured from its highest point down to its lowest point (the total decline over the slump), *not* a one-year return. Those crashes show up as several deeply negative annual returns in a row in the static dataset — real, not invented — which is what makes the reversal so striking.\n\n(The dataset also carries each year's **inflation** — the general rise in prices, which erodes what a dollar buys. The general backtest engine uses it to show a purchasing-power-adjusted result, but note the withdrawal in this particular demo is a flat dollar amount — see the tool step.)",
        ko: "먼저 \"수익률\"이 무엇인지: 수익률(return)은 그 해에 돈이 얼마나 늘거나 줄었는지를 백분율로 나타낸 것입니다. +20%는 5분의 1 늘었다는 뜻, −37%는 그 해에 3분의 1 넘게 잃었다는 뜻입니다.\n\n순서 데모는 의도적으로 **2000~2024년**으로 고정돼 있습니다. 닷컴 붕괴(2000~2002년)와 2008년 금융위기로 시작하는, 초반이 정말 혹독한 구간입니다. 두 사건 모두 미국 광범위 주식시장이 **고점 대비 약 45~55% 하락**한 주가 폭락이었습니다 — \"고점 대비(peak to trough)\"란 가장 높았던 지점에서 가장 낮았던 지점까지, 즉 하락기 전체 낙폭을 재는 것으로, 한 해의 수익률이 *아닙니다*. 이 폭락은 데이터셋에서 여러 해 연속의 깊은 마이너스 연간 수익률로 나타나며 — 지어낸 게 아닌 실제 값입니다 — 그래서 순서를 뒤집었을 때의 대비가 그토록 강렬합니다.\n\n(데이터셋은 해마다 **물가(inflation)** — 물건값이 전반적으로 오르며 1달러의 구매력을 깎아먹는 것 — 도 담고 있습니다. 일반 백테스트 엔진은 이를 써서 구매력 기준 결과를 보여주지만, 이 특정 데모의 인출액은 고정된 달러 금액입니다 — 도구 단계 참고.)",
      },
      sources: [
        {
          name: { en: "Damodaran NYU returns + Minneapolis Fed CPI", ko: "다모다란 NYU 수익률 + 미니애폴리스 연은 CPI" },
          what: { en: "The actual 2000–2024 sequence of annual asset returns and inflation used in both the glide path and the withdrawal demo.", ko: "글라이드 패스와 인출 데모 양쪽에 쓰이는 2000~2024년 실제 연간 자산 수익률과 물가." },
          why: { en: "Using a real, well-known bad-first-decade sequence — not a hypothetical — makes sequence risk undeniable: same returns, same average, opposite outcomes.", ko: "가정이 아니라 초반 10년이 나빴던 실제로 잘 알려진 구간을 쓰면 순서 위험을 부정할 수 없게 됩니다. 같은 수익률, 같은 평균, 정반대의 결과." },
          url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Run the glide path and the sequence demo", ko: "글라이드 패스와 순서 데모 돌려보기" },
      body: {
        en: "Two parts, run each deliberately:\n- **Glide path:** pick a **retirement year**. Watch the stacked area shift stock → bond → cash as the year approaches. That shift is a move from riskiest to safest — stocks swing the most, bonds are steadier, cash barely moves — so watching the band slide down is literally watching the portfolio trade growth for safety as the goal nears. Note roughly what equity share it lands on at, and just after, the target.\n- **Sequence demo (fixed 2000–2024, 6% annual withdrawal):** \"6% annual withdrawal\" means you take out an amount equal to 6% of your STARTING balance — $6,000 a year from a $100,000 pot — and the demo keeps taking that same fixed $6,000 every year, no matter how the market moved. (For scale: the well-known **4% rule** says ~4% of the starting balance is a historically survivable retirement withdrawal rate, so the 6% here is deliberately on the aggressive side — chosen to make sequence risk visible, not as a recommendation.) Run the SAME returns in **normal order** and then **reversed order**, and read the two ending balances side by side.\n\nWhat stays identical between the two runs is the **average annual return** — the simple mean of the 25 yearly percentage gains and losses (about 7.7% a year) — because they use the very same 25 numbers in a different order. It is the *ending balances* that come out wildly different, not the average. Sit with how far apart the two endings are before moving on.",
        ko: "두 부분을 각각 신중하게 돌립니다.\n- **글라이드 패스:** **은퇴 연도**를 고릅니다. 그 해가 다가올수록 누적 영역이 주식 → 채권 → 현금으로 옮겨가는 걸 지켜봅니다. 이 이동은 가장 위험한 것에서 가장 안전한 것으로 옮겨가는 것입니다 — 주식은 가장 크게 출렁이고, 채권은 더 안정적이며, 현금은 거의 움직이지 않습니다. 그래서 띠가 아래로 미끄러지는 것을 보는 것은 목표가 다가올수록 성장 대신 안전을 택하는 과정을 그대로 보는 것입니다. 목표 시점과 그 직후에 주식 비중이 대략 얼마에 안착하는지 봅니다.\n- **순서 데모(2000~2024 고정, 연 6% 인출):** \"연 6% 인출\"은 시작 잔액의 6%에 해당하는 금액, 즉 100,000달러에서 매년 6,000달러를 빼는 것을 뜻하며, 데모는 시장이 어떻게 움직였든 매년 같은 고정 6,000달러를 인출합니다. (참고로: 흔히 쓰이는 **4% 법칙**은 시작 잔액의 약 4%가 역사적으로 지속 가능한 인출률이라고 봅니다. 따라서 여기서 쓰는 6%는 의도적으로 공격적인 수치로, 시퀀스 위험을 눈에 띄게 드러내기 위한 것이지 권장 수치가 아닙니다.) 같은 수익률을 **정순**으로 한 번, **역순**으로 한 번 돌리고, 두 최종 잔고를 나란히 읽습니다.\n\n두 실행 사이에서 동일하게 유지되는 것은 **평균 연 수익률** — 25개 연간 손익률의 단순 평균(연 약 7.7%) — 입니다. 같은 25개 숫자를 순서만 바꿔 쓰기 때문입니다. 크게 달라지는 것은 평균이 아니라 *최종 잔액*입니다. 다음으로 넘어가기 전에, 두 결과가 얼마나 벌어지는지 곱씹어봅니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the glide path: growth early, safety late", ko: "글라이드 패스 읽기: 초반엔 성장, 후반엔 안전" },
      body: {
        en: "The glide path rests on the trade-off from step one: over long periods stocks have historically earned more than bonds or cash (roughly 10%/yr for US stocks vs ~5% for long bonds and ~3% for cash over the last century, as long-run averages, not guarantees), but in any single year stocks can drop sharply, while bonds and cash are far steadier. The logic is *time*, not age for its own sake.\n- **Far from the goal**, a bad year has decades to recover, so you can afford a high equity share to capture that higher long-run growth. A common rough anchor is roughly **80–90% equity in your 30s**.\n- **Near and past the goal**, there is no time to recover a big loss and you are also drawing money out, so the path glides down toward **~40–50% equity around retirement age**. (This particular demo glides from 90% down to a more conservative 30% stocks; real-world **target-date funds** often land nearer 40–50%. A target-date fund is a single ready-made portfolio you buy — named for a retirement year, like a \"2050 fund\" — that automatically runs this glide path for you, dialing equity down year after year so you don't have to rebalance by hand.)\n- These landing points are *conventions and rules of thumb*, not laws. Your own risk tolerance and other income can justify moving them. For example, a guaranteed income like a **pension** covers your baseline (must-pay) bills, so a crash threatens a smaller share of what you truly need — that lets you safely carry MORE equity. Likewise, if you can easily cut spending in a bad year (flexibility), you are less forced to sell shares while they are down.",
        ko: "글라이드 패스는 1단계의 트레이드오프에 뿌리를 둡니다: 장기적으로 주식은 채권이나 현금보다 더 높은 수익을 내왔지만(지난 100년 기준 장기 평균으로 미국 주식 연 약 10%, 장기 채권 약 5%, 현금 약 3% — 보장은 아님), 특정 한 해에는 크게 하락할 수 있고, 채권과 현금은 훨씬 안정적입니다. 논리는 나이 그 자체가 아니라 *시간*입니다.\n- **목표에서 멀 때**는 나쁜 해가 회복할 수십 년이 있으므로, 그 더 높은 장기 성장을 잡기 위해 높은 주식 비중을 감당할 수 있습니다. 흔한 대략적 기준은 **30대에 주식 비중 약 80~90%**입니다.\n- **목표에 가깝거나 지난 뒤**에는 큰 손실을 회복할 시간이 없고 돈까지 빼 쓰고 있으므로, 경로가 **은퇴 나이 무렵 주식 비중 약 40~50%**까지 내려갑니다. (이 데모는 90%에서 더 보수적인 30%까지 내려갑니다. 실제 **타깃데이트 펀드**는 종종 40~50% 근처에 안착합니다. 타깃데이트 펀드란 당신이 사는 하나의 완성된 포트폴리오 상품으로 — \"2050 펀드\"처럼 은퇴 연도를 이름에 달고 — 이 글라이드 패스를 자동으로 대신 굴려, 해마다 주식 비중을 낮춰 주므로 직접 리밸런싱할 필요가 없습니다.)\n- 이런 안착 지점은 *관행이자 경험칙*이지 법칙이 아닙니다. 당신의 위험 감내도와 다른 소득이 이를 옮길 근거가 됩니다. 예를 들어 **연금** 같은 보장된 소득이 기본(반드시 내야 할) 생활비를 충당하면, 폭락이 실제 필요한 것에 미치는 타격이 줄어들어 더 많은 주식을 안전하게 보유할 수 있습니다. 마찬가지로 나쁜 해에 지출을 쉽게 줄일 수 있다면(유연성) 주가가 낮을 때 억지로 팔 필요가 줄어듭니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the sequence demo: why order dominates", ko: "순서 데모 읽기: 왜 순서가 지배하는가" },
      body: {
        en: "Same 25 annual returns, same 7.7% average, wildly different endings. First, three plain-language idioms this rests on:\n- **Sell shares into a fallen market** = sell some stocks *after* prices have dropped, to raise the cash you need to live on.\n- **Lock in losses** = a loss on paper (your stock is worth less than you paid) is only temporary and can recover — but the moment you SELL, that loss becomes permanent and those shares are gone, so they can't bounce back when the market recovers.\n- **Shrink the base** = you have fewer shares left to grow during the eventual rebound, so the recovery works on a smaller pile.\n\nHere is the mechanic:\n- When you **withdraw a fixed amount** and the **early** years are bad, you sell shares into a fallen market to fund living costs. You lock in losses and shrink the base that must later recover — and it often never fully does.\n- Run the **bad years late** instead and, before the withdrawals bite, years of early growth have pushed the balance well above the starting amount — so the same fixed $6,000 is a small slice of a large, still-growing pot and barely dents it.\n\nA concrete example you can picture (the exact numbers the tool computes from the real 2000–2024 series, using round figures for a $100,000 pot at 70% equity): with the **bad years first** (the crashes hit while the balance is small and you're already selling), the pot sags to a low near ~$39,000 and ends around **~$42,000** — roughly a fifth of what it could have been. With the **same 25 returns but bad years last**, it ends around **~$234,000** — about **5.5× more**. Same numbers, same average, order alone made the difference.\n\nOne thing that trips up beginners: \"+7.7% average, yet the bad-first run ends at ~$42k — a loss?\" Two things dissolve the puzzle. First, a **simple average of yearly percentages overstates what actually compounds.** A year of −50% then a year of +50% averages to 0%, but you don't break even — $100 falls to $50, then rises to $75, a real −25%. Losses hit a bigger base than the gains that follow, so the *compounded* result trails the simple average whenever returns swing hard. Second, and bigger here, **you're withdrawing $6,000 every year regardless.** That fixed drain, taken from a shrunken pot during the early crashes (selling shares low), is money that can never rebound. The +7.7% is a true description of the return numbers; it was never a promise about your ending balance once volatility and withdrawals are in play.\n\nThis is sequence-of-returns risk: **once you are withdrawing, the ORDER of returns can matter more than the average return.** A retiree who hits a 2000–2008-style opening can be left far smaller than an identical-average retiree who got those years last.",
        ko: "같은 25개 연간 수익률, 같은 7.7% 평균, 완전히 다른 결말. 먼저, 이것이 기대는 세 가지 표현을 쉬운 말로:\n- **하락한 시장에 주식을 판다** = 생활비 마련을 위해 가격이 떨어진 *뒤에* 주식을 파는 것.\n- **손실을 확정한다(lock in)** = 장부상 손실(산 값보다 싸진 상태)은 일시적이라 회복될 수 있지만, 파는 순간 그 손실은 영구적이 되고 그 주식은 사라져 시장이 회복해도 반등에 참여하지 못합니다.\n- **원금 기반(base)을 줄인다** = 나중에 반등할 때 불어날 주식이 더 적게 남아, 회복이 더 작은 더미 위에서 일어납니다.\n\n작동 원리는 이렇습니다.\n- **정액을 인출**하는데 **초반** 해들이 나쁘면, 생활비를 대려고 떨어진 시장에서 주식을 팝니다. 손실을 확정하고 나중에 회복해야 할 원금 기반을 줄여버리며 — 그 기반은 끝내 완전히 회복되지 않는 경우가 많습니다.\n- 대신 **나쁜 해를 후반에** 두면, 인출이 시작될 무렵 초반의 성장으로 잔고가 이미 시작 금액보다 훨씬 커져 있어 — 같은 고정 6,000달러는 크고 여전히 자라는 항아리의 작은 조각일 뿐이라 거의 흠집도 못 냅니다.\n\n머릿속에 그릴 수 있는 구체적 예(실제 2000~2024 시계열로 도구가 계산하는 값을, 주식 비중 70%인 100,000달러 항아리에 대해 반올림한 숫자로): **나쁜 해가 먼저** 올 때(잔고가 작고 이미 팔고 있는 와중에 폭락이 닥침)는 항아리가 약 ~39,000달러 저점까지 주저앉았다가 약 **~42,000달러**로 끝납니다 — 될 수 있었던 것의 대략 5분의 1. **같은 25개 수익률인데 나쁜 해를 마지막에** 두면 약 **~234,000달러**로 끝납니다 — 약 **5.5배 더**. 같은 숫자, 같은 평균, 순서만으로 차이가 났습니다.\n\n초보자가 자주 걸려 넘어지는 지점: \"평균이 +7.7%인데 나쁜 해가 먼저인 실행은 ~4.2만 달러로, 손실이라고?\" 두 가지가 이 수수께끼를 풀어줍니다. 첫째, **연간 백분율의 단순 평균은 실제 복리로 불어나는 결과를 부풀립니다.** −50%인 해 다음 +50%인 해는 평균이 0%지만 본전이 아닙니다 — 100달러가 50달러로 떨어졌다가 75달러로 올라, 실제로는 −25%입니다. 손실은 뒤이은 상승보다 더 큰 기반에 작용하므로, 수익률이 크게 출렁일수록 *복리* 결과는 단순 평균보다 뒤처집니다. 둘째, 여기서 더 큰 요인은 **시장과 무관하게 매년 6,000달러를 인출한다**는 점입니다. 초반 폭락기에 쪼그라든 항아리에서 (주식을 싸게 팔아) 빼내는 이 고정 유출은 결코 반등할 수 없는 돈입니다. +7.7%는 수익률 숫자에 대한 참된 서술일 뿐, 변동성과 인출이 개입한 뒤의 최종 잔액에 대한 약속이었던 적은 없습니다.\n\n이것이 수익률 순서 위험입니다: **인출을 시작하면, 수익률의 순서가 평균 수익률보다 더 중요할 수 있습니다.** 2000~2008년 같은 시작을 맞은 은퇴자는, 평균이 똑같지만 그 해들을 마지막에 겪은 은퇴자보다 훨씬 작게 남을 수 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "What sequence risk changes about withdrawing — and its limits", ko: "순서 위험이 인출에 대해 바꾸는 것 — 그리고 그 한계" },
      body: {
        en: "Sequence risk is the real reason to **de-risk** near and into retirement — de-risk means shift money OUT of stocks and INTO bonds and cash so a crash does less damage to your balance. It points to a few defenses:\n- **De-risk before you start withdrawing**, not after — a smaller **drawdown** in the first few years is worth far more than in the last few. (Drawdown = how far your balance has fallen from its highest point; a −30% drawdown means you're 30% below your best-ever balance.)\n- **Keep a buffer** — often about **2–3 years of spending** held in cash and bonds — to live on during a crash, so you needn't sell stocks while they're down and your stocks get time to recover. (A \"sleeve\" is just a labeled slice of the portfolio, e.g. the cash sleeve.)\n- **Stay flexible on spending.** The demo takes a *fixed* $6,000 every year no matter what the market did; \"trimming withdrawals\" means voluntarily taking LESS than that planned $6,000 in a bad early year, which leaves more shares invested to recover — and dramatically raises survival odds.\n\nHonest limits: this demo uses one fixed 2000–2024 window and a flat 6% withdrawal. Real outcomes depend on your actual start year, your spending flexibility, and other income. The mechanism is real and general; the exact numbers on screen are one illustrative case, not a forecast.",
        ko: "순서 위험은 은퇴 직전과 은퇴 기간에 **위험을 낮춰야(de-risk)** 하는 진짜 이유입니다 — 위험 낮추기란 돈을 주식에서 빼내 채권과 현금으로 옮겨, 폭락이 잔액에 주는 타격을 줄이는 것입니다. 이는 몇 가지 방어책을 가리킵니다.\n- 인출을 시작한 *뒤*가 아니라 **시작하기 전에 위험을 줄입니다** — 첫 몇 해의 낮은 **낙폭(drawdown)** 이 마지막 몇 해의 낙폭보다 훨씬 값집니다. (낙폭은 잔액이 사상 최고점에서 얼마나 떨어졌는지를 나타냅니다. −30% 낙폭은 최고 잔액보다 30% 아래에 있다는 뜻입니다.)\n- **완충 자금을 두세요** — 흔히 **2~3년치 생활비**를 현금과 채권으로 — 폭락기에 이 자금으로 생활하면 주가가 낮을 때 주식을 팔지 않아도 되어 주식이 회복할 시간을 법니다. (\"슬리브(sleeve)\"는 포트폴리오의 이름 붙은 한 조각을 가리키는 말일 뿐입니다, 예: 현금 슬리브.)\n- **지출을 유연하게 유지합니다.** 데모는 시장이 어떻든 매년 *고정된* 6,000달러를 인출합니다. \"인출을 줄인다(trimming)\"는 것은 나쁜 초반 해에 그 계획된 6,000달러보다 적게 빼서 더 많은 주식이 투자된 채로 남아 회복하도록 하는 것으로 — 생존 확률을 극적으로 올립니다.\n\n정직한 한계: 이 데모는 고정된 2000~2024 구간 하나와 일정한 6% 인출을 씁니다. 실제 결과는 당신의 실제 시작 연도, 지출 유연성, 다른 소득에 따라 달라집니다. 원리는 실제적이고 일반적이지만, 화면의 정확한 숫자는 하나의 예시일 뿐 예측이 아닙니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Set your equity share and your withdrawal defense", ko: "주식 비중과 인출 방어책 정하기" },
      body: {
        en: "Turn both ideas into decisions for your own timeline.",
        ko: "두 개념을 당신 자신의 시간표에 대한 결정으로 바꿉니다.",
      },
      prompt: {
        en: "Write three things: (1) your years-to-goal and your equity share (the % of your portfolio in stocks, from the glide-path step) that you think is right for that horizon now, with one reason; (2) the two ending balances the sequence demo produced for normal vs reversed order (~$42,000 bad-years-early vs ~$234,000 bad-years-late), in your own words; (3) one concrete withdrawal defense — a cash buffer (2–3 years of spending), a lower starting withdrawal rate, spending flexibility, or de-risking earlier (all defined above) — that sequence risk convinced you to adopt.",
        ko: "세 가지를 적습니다: (1) 목표까지 남은 기간과, 그 기간에 지금 맞다고 보는 당신의 주식 비중(글라이드 패스 단계에서 정의한, 포트폴리오 중 주식 비율), 그리고 이유 한 가지; (2) 순서 데모가 정순과 역순에서 만들어낸 두 최종 잔고(초반 나쁜 해 ~42,000달러 대 후반 나쁜 해 ~234,000달러)를 당신의 말로; (3) 순서 위험이 당신을 설득해 채택하게 만든 구체적 인출 방어책 하나 — 현금 완충 자금(2~3년치), 낮은 시작 인출률, 지출 유연성, 또는 더 이른 위험 낮추기(모두 위에서 정의됨).",
      },
    },
    {
      kind: "conclude",
      title: { en: "Your horizon-aware plan", ko: "기간을 아는 당신의 계획" },
      body: {
        en: "You now hold two ideas most people learn too late: your equity share should track your time horizon, and once you withdraw, the ORDER of returns can matter more than the average. That reframes retirement risk from \"what's the average return?\" to \"what if the bad years come first?\" Before you act:",
        ko: "이제 당신은 대부분이 너무 늦게 배우는 두 가지를 갖게 됐습니다: 주식 비중은 남은 기간을 따라가야 하고, 인출을 시작하면 수익률의 순서가 평균보다 더 중요할 수 있다는 것. 이는 은퇴 위험을 \"평균 수익률이 얼마인가?\"에서 \"나쁜 해가 먼저 오면?\"으로 다시 틀어줍니다. 실행하기 전에:",
      },
      checklist: [
        { en: "I stated my years-to-goal and an equity share (the % in stocks) that fits that horizon, not a fixed habit.", ko: "고정된 습관이 아니라 남은 기간에 맞는 주식 비중(주식에 담긴 비율)과 함께 목표까지의 기간을 적었습니다." },
        { en: "I saw the same 2000–2024 returns produce very different endings (~$42k vs ~$234k) in normal vs reversed order.", ko: "같은 2000~2024 수익률이 정순과 역순에서 매우 다른 결말(약 4.2만 대 약 23.4만 달러)을 낳는 것을 확인했습니다." },
        { en: "I understand early bad years while withdrawing are far more damaging than late ones — because you lock in losses and shrink the base.", ko: "인출 중 초반의 나쁜 해가 후반의 나쁜 해보다 훨씬 큰 피해를 준다는 것을 이해합니다 — 손실을 확정하고 원금 기반을 줄이기 때문입니다." },
        { en: "I named one concrete withdrawal defense — a cash buffer (2–3 years), spending flexibility, a lower start rate, or de-risking (shifting from stocks to bonds/cash) earlier.", ko: "구체적인 인출 방어책 하나를 정했습니다 — 현금 완충 자금(2~3년치), 지출 유연성, 낮은 인출률, 또는 더 이른 위험 낮추기(주식에서 채권·현금으로 이동)." },
        { en: "I treat this as a hypothesis to test against my real plan, not a recommendation to act on blindly.", ko: "이것을 맹목적으로 실행할 권고가 아니라, 내 실제 계획에 비춰 검증할 가설로 다룹니다." },
      ],
    },
  ],
};

export const trend: Walkthrough = {
  labId: "trend-backtest",
  title: {
    en: "Does this trend system beat buy-and-hold — for you?",
    ko: "이 추세 시스템은 매수 후 보유를 이기는가 — 당신에게?",
  },
  goal: {
    en: "By the end you'll have backtested a rules-based trend system against buy-and-hold on real prices, read CAGR and max drawdown side by side, and written down whether it's better on a risk-adjusted basis AND whether you could actually follow it.",
    ko: "끝까지 따라가면 규칙 기반 추세 시스템을 실제 가격으로 매수 후 보유와 비교 백테스트하고, CAGR과 최대낙폭을 나란히 읽은 뒤, 위험조정 기준으로 더 나은지 그리고 당신이 실제로 따를 수 있는지를 적게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "What we're actually deciding", ko: "우리가 실제로 결정하려는 것" },
      body: {
        en: "A trend system isn't \"buy low, sell high\" — it's a mechanical rule that keeps you invested while an asset trends up and pulls you out when it turns down. Its promise is **smaller drawdowns** — staying out of the worst of bear markets — usually at the cost of some upside and a lot of annoying whipsaws in choppy markets. First, four words this whole decision rests on, in plain language:\n- **Drawdown** = how far your money falls from its highest point to its next low — the size of the worst hole you sit in, judged in %.\n- **CAGR** = the smoothed yearly growth rate; if your money had grown at one steady rate every year, this is the rate that would land it where it actually ended.\n- **Whipsaw (휩쏘)** = when the rule sells you out on a dip, then the price bounces right back so you buy in higher — you lose a little on the round trip and got nothing for it. This is the main way trend rules bleed money in flat, choppy markets.\n- Judging on a **risk-adjusted** basis just means: don't only ask how much it made — ask how much it made *for the size of the drops you had to survive*.\nWith those defined, we'll decide three things in order:\n- Does the rule **reduce drawdown** meaningfully vs just holding?\n- What does that protection **cost** in return (CAGR)?\n- Could **you** actually follow it — sit through the whipsaws and stay-out periods without overriding it?\nThe last one decides more real outcomes than the first two.",
        ko: "추세 시스템은 \"싸게 사서 비싸게 판다\"가 아닙니다 — 자산이 상승 추세일 때 투자 상태를 유지하고, 하락으로 돌아서면 빠져나오게 하는 기계적 규칙입니다. 그 약속은 **더 작은 낙폭** — 약세장의 최악을 피하는 것 — 이며, 대개 상승분 일부와 횡보장에서의 성가신 휩쏘(whipsaw)를 대가로 합니다. 먼저, 이 결정 전체가 딛고 있는 네 단어를 쉬운 말로 정의합니다:\n- **낙폭(drawdown)** = 돈이 최고점에서 다음 저점까지 얼마나 떨어지는가 — 당신이 앉아 있어야 할 가장 깊은 구덩이의 크기이며, %로 판단합니다.\n- **CAGR(연복리성장률)** = 매끄럽게 편 연간 성장률; 돈이 매년 하나의 일정한 속도로 자랐다면, 실제 도달한 곳에 이르게 하는 그 속도입니다.\n- **휩쏘(whipsaw)** = 규칙이 하락에서 당신을 팔아 내보낸 뒤, 가격이 곧바로 반등해 더 높게 되사게 되는 상황 — 왕복에서 조금 손해 보고 얻은 건 아무것도 없습니다. 밋밋하고 톱니 같은 시장에서 추세 규칙이 돈을 흘리는 주된 방식입니다.\n- **위험조정(risk-adjusted)** 기준으로 판단한다는 건 이런 뜻입니다: 얼마를 벌었는지만 묻지 말고, *견뎌야 했던 하락의 크기 대비* 얼마를 벌었는지 물어라.\n이것들을 정의했으니, 순서대로 세 가지를 결정합니다:\n- 규칙이 단순 보유 대비 **낙폭을 의미 있게 줄이는가**?\n- 그 보호가 수익률(CAGR)로 얼마를 **대가로** 치르는가?\n- **당신**이 실제로 따를 수 있는가 — 휩쏘와 관망 구간을 규칙을 어기지 않고 견딜 수 있는가?\n마지막 질문이 앞의 둘보다 실제 결과를 더 많이 좌우합니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the prices come from", ko: "가격은 어디서 오는가" },
      body: {
        en: "A backtest is only as honest as its data. We use **adjusted** daily closes, and here's why that matters:\n- A **stock split** just divides each share into more, smaller shares — the total value you own is unchanged, only the per-share price and share count change. Example (4-for-1): 1 share worth $400 becomes 4 shares worth $100 each (still $400 total); the raw quoted price suddenly drops 75% even though nothing about the company changed.\n- A **dividend** is a cash payment to holders. On the **ex-dividend day** — the first day the stock trades *without* the right to that dividend — the price drops by roughly the payout at the open, because a new buyer no longer gets that cash. Example: a $50 stock paying a $1 dividend typically opens around $49 on the ex-date.\n- **Adjusted** closes edit past prices to erase those two mechanical drops, so a fall in the *adjusted* line always means the stock actually lost value — not that it split or paid a dividend. Yahoo's **Adj Close** column is back-adjusted for *both* splits and dividends (its plain **Close** fixes splits only). If you used raw prices, the rule would read a split or ex-dividend drop as a real downturn and sell you out for no reason.\nThe prices are pre-ingested from Yahoo Finance's chart data into static JSON in the app, but you can click through to Yahoo and see the same series yourself.\n- **Korean names (삼성전자, KOSPI, etc.):** don't rely on Yahoo here — its KRX coverage is patchy and unreliable (missing days, stale or wrong split/dividend adjustments). Instead pull **수정주가(adjusted price)** daily OHLC — already corrected for splits and dividends — from **Naver 금융 (finance.naver.com)** or the KRX **정보데이터시스템 (data.krx.co.kr)**. On Naver, open the stock's 시세 (quote) page and its 일별 시세 / 과거 데이터; on KRX, use the 개별종목 시세 추이 under 통계. Confirm the series is 수정주가, not raw, before you backtest.\nOne fairness bar for the test window: a **bull market** is a long, sustained rise and a **bear market** is a long, sustained fall — a common rule of thumb marks a bear at a drop of roughly -20% or more from the recent peak (and a bull at a rise of about +20% from a low). Treat those as rough guideposts, not exact rules. You want your window to contain at least one of each, so you see the rule both in a rise and in a crash.\n**Run the three systems by hand, straight off the price columns — no tool needed:**\n- **200-day SMA (단순이동평균):** average the last 200 daily adjusted closes (add them up, divide by 200). Hold when today's adjusted close is *above* that average; exit when it's below.\n- **12-1 momentum:** compare today's price to its price ~12 months ago, but *skip the most recent month* (that's the \"-1\" — the freshest month is noisy and often reverses). If today is higher than ~12 months back, hold; if lower, stay out.\n- **Donchian channel (돈치안 채널) breakout:** pick a window of N days (e.g. 50). Hold when price makes a **new N-day high** (tops the highest High of the last N days); exit when it makes a **new N-day low** (below the lowest Low of the last N). Use the daily High/Low columns, not closes. In between, do nothing.\nWhichever you use, decide each day *only* from data you'd have had that day — never peek at a later price.",
        ko: "백테스트는 그 데이터만큼만 정직합니다. 우리는 **수정** 일간 종가를 쓰며, 그 이유는 이렇습니다:\n- **액면분할**은 기존 1주를 여러 개의 더 작은 주식으로 쪼개는 것으로, 보유 총가치는 그대로이고 주당 가격과 주식 수만 바뀝니다. 예(4-for-1): 400달러짜리 1주가 100달러짜리 4주가 됩니다(합계는 여전히 400달러). 회사는 그대로인데 원시 가격만 갑자기 75% 떨어집니다.\n- **배당**은 주주에게 주는 현금 지급입니다. **배당락일** — 그 배당을 받을 권리 없이 거래되는 첫날 — 에는 시가에서 대략 배당금만큼 가격이 떨어집니다. 새 매수자는 그 현금을 못 받기 때문입니다. 예: 1달러 배당을 주는 50달러 주식은 배당락일에 대략 49달러 근처에서 시작합니다.\n- **수정** 종가는 이 두 가지 기계적 하락을 지우도록 과거 가격을 고칩니다. 그래서 *수정* 선의 하락은 언제나 주식이 실제로 가치를 잃었다는 뜻이지, 분할하거나 배당을 줬다는 뜻이 아닙니다. 야후의 **Adj Close(수정 종가)** 는 분할과 배당을 *모두* 반영해 소급 조정한 값입니다(일반 **Close(종가)** 는 분할만 반영). 원시 가격을 쓰면 규칙이 분할·배당락 하락을 진짜 하락으로 읽고 이유 없이 당신을 팔아 내보냅니다.\n가격은 야후 파이낸스 차트 데이터에서 앱의 정적 JSON으로 미리 수집돼 있지만, 야후로 클릭해 들어가 같은 시계열을 직접 확인할 수 있습니다.\n- **한국 종목(삼성전자, 코스피 등):** 여기서는 야후에 의존하지 마세요 — 야후의 한국거래소(KRX) 커버리지는 듬성듬성하고 신뢰하기 어렵습니다(빠진 날, 오래되거나 틀린 분할·배당 조정). 대신 분할·배당이 이미 반영된 **수정주가(adjusted price)** 일간 OHLC를 **네이버 금융 (finance.naver.com)** 또는 KRX **정보데이터시스템 (data.krx.co.kr)** 에서 받으세요. 네이버에서는 종목의 시세 페이지에서 일별 시세 / 과거 데이터를, KRX에서는 통계 메뉴의 개별종목 시세 추이를 이용합니다. 백테스트 전에 원시 가격이 아니라 수정주가 시계열인지 반드시 확인하세요.\n시험 구간의 공정성 기준 하나: **강세장(불마켓)** 은 길고 지속적인 상승, **약세장(베어마켓)** 은 길고 지속적인 하락입니다 — 통상적인 경험칙으로는 최근 고점 대비 약 -20% 이상 하락하면 약세장, 저점 대비 약 +20% 상승하면 강세장으로 봅니다. 엄격한 규칙이 아니라 대략적인 기준선으로 여기세요. 상승과 폭락 양쪽에서 규칙을 볼 수 있도록, 시험 구간에 둘이 최소 하나씩은 들어 있길 원합니다.\n**세 시스템을 가격 열만 보고 손으로 직접 돌리기 — 도구 없이:**\n- **200일 단순이동평균(SMA):** 최근 200개 일간 수정 종가의 평균(모두 더해 200으로 나눔). 오늘 수정 종가가 그 평균 *위*면 보유, 아래면 청산.\n- **12-1 모멘텀:** 오늘 가격을 약 12개월 전 가격과 비교하되, *가장 최근 1개월은 건너뜁니다*(\"-1\"이 그 뜻 — 가장 최근 달은 잡음이 많고 곧잘 되돌립니다). 오늘이 약 12개월 전보다 높으면 보유, 낮으면 관망.\n- **돈치안 채널(Donchian channel) 돌파:** N일(예: 50) 창을 정합니다. 가격이 **N일 신고가**(최근 N일 최고 고가(High)를 넘어섬)를 찍으면 보유, **N일 신저가**(최근 N일 최저 저가(Low) 아래)를 찍으면 청산. 종가가 아니라 일간 고가·저가 열을 씁니다. 그 사이에는 아무것도 하지 않습니다.\n어느 것을 쓰든 매일 *그날까지 가졌을 데이터만*으로 판단하세요 — 나중 가격을 절대 미리 보지 마세요.",
      },
      sources: [
        {
          name: { en: "Yahoo Finance — historical prices", ko: "야후 파이낸스 — 과거 시세" },
          what: { en: "Daily adjusted OHLCV — Open, High, Low, Close and Volume for each day — for the symbol, going back years.", ko: "종목의 일간 수정 OHLCV — 하루하루의 시가(Open)·고가(High)·저가(Low)·종가(Close)·거래량(Volume) — , 수년치." },
          why: { en: "It's free, split/dividend-adjusted, and long enough to cover at least one full bull-and-bear cycle — which is the only fair test of a trend system.", ko: "무료이고 분할·배당이 반영돼 있으며, 최소 한 번의 완전한 상승·하락 사이클을 담을 만큼 길어 — 추세 시스템의 유일하게 공정한 시험대가 됩니다." },
          url: "https://finance.yahoo.com/quote/SPY/history",
          shot: YAHOO_SHOT,
        },
        {
          name: { en: "Naver 금융 / KRX 정보데이터시스템 — Korean prices", ko: "네이버 금융 / KRX 정보데이터시스템 — 한국 시세" },
          what: { en: "수정주가(adjusted price) daily OHLC for KR names like 삼성전자 or the KOSPI index — already corrected for splits and dividends. On Naver: the stock's 일별 시세 / 과거 데이터. On KRX: 개별종목 시세 추이 under 통계.", ko: "삼성전자나 코스피 지수 같은 한국 종목의 수정주가(adjusted price) 일간 OHLC — 분할·배당이 이미 반영된 값. 네이버는 종목의 일별 시세 / 과거 데이터, KRX는 통계 메뉴의 개별종목 시세 추이." },
          why: { en: "Use these for any Korean symbol — Yahoo's KRX coverage is patchy and unreliable (missing days, stale or wrong adjustments), while Naver and KRX are the authoritative local sources. Confirm the series is 수정주가, not raw, before backtesting.", ko: "한국 종목에는 이쪽을 쓰세요 — 야후의 한국거래소(KRX) 커버리지는 듬성듬성하고 신뢰하기 어렵지만(빠진 날, 오래되거나 틀린 조정), 네이버와 KRX는 권위 있는 국내 원천입니다. 백테스트 전에 원시 가격이 아니라 수정주가인지 확인하세요." },
          url: "https://data.krx.co.kr",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Run the backtest yourself", ko: "직접 백테스트를 돌려라" },
      body: {
        en: "Use the analyzer below. Pick a symbol and one rules-based system — you just choose, the engine computes:\n- **200-day moving average** — the average closing price of the last 200 trading days, a slow line that smooths out daily noise. Rule: in when today's price is above that line (recent prices are beating the long-run average → uptrend), out when below.\n- **12-1 momentum** — compares the price now to the price ~12 months ago, but skips the most recent ~1 month (that's the \"-1\"). Why skip it? Prices tend to *reverse* over very short windows — a stock that jumped last month often gives some back the next — so the freshest month is noisy and can point the wrong way; leaving it out gives a cleaner read on the year-long trend. If the price is higher, the past year was an uptrend, so stay in; if lower, step out.\n- **Donchian 50-day breakout** — this tool uses a 50-day look-back window. A **new 50-day high** (price tops the highest High of the last 50 days) signals fresh strength → in; a **new 50-day low** (below the lowest Low of the last 50) signals weakness → out.\nTwo honesty ideas as you read the result:\n- **Look-ahead** would be cheating — using tomorrow's price to decide today's trade, which no real trader can do; it makes any backtest look magically good. This engine only ever uses data available on the day and applies the *next* day's price move, so the result is honest.\n- **Equity curve** = a line of what your account would have been worth over time. A good one climbs with shallow dips; a bad one has deep valleys. Compare the system's curve and the buy-and-hold curve side by side.\nRead off two pairs of numbers: **CAGR** (system vs buy-and-hold) and **max drawdown** (system vs buy-and-hold). The stat grid also shows **exposure** (the % of days your money was actually invested vs sitting in cash — 60% exposure means it was out of the market 40% of the time) and **trades** (how many times the signal flipped in↔out — more trades means more whipsaws and, in real life, more costs).",
        ko: "아래 분석 도구를 사용하세요. 종목 하나와 규칙 기반 시스템 하나를 고르세요 — 당신은 고르기만 하고, 엔진이 계산합니다:\n- **200일 이동평균** — 최근 200거래일 종가의 평균으로, 하루하루의 잡음을 매끄럽게 편 느린 선입니다. 규칙: 오늘 가격이 그 선 위면 진입(최근 가격이 장기 평균을 이기는 중 → 상승 추세), 아래면 청산.\n- **12-1 모멘텀** — 지금 가격(최근 약 1개월은 건너뜀)을 약 12개월 전 가격과 비교합니다. 더 높으면 지난 1년이 상승 추세였으니 유지, 더 낮으면 물러납니다.\n- **돈치안 50일 돌파** — 이 도구는 50일 되돌아보기 창을 씁니다. **50일 신고가**(가격이 최근 50일 최고 고가(High)를 넘어섬)면 새 강세 신호 → 진입, **50일 신저가**(최근 50일 최저 저가(Low) 아래로)면 약세 신호 → 청산.\n결과를 읽을 때 정직함에 관한 두 가지 개념:\n- **룩어헤드(look-ahead)** 는 내일 가격으로 오늘 매매를 정하는 반칙입니다 — 실제 투자자는 할 수 없죠; 이걸 하면 어떤 백테스트든 마법처럼 좋아 보입니다. 이 엔진은 언제나 그날까지의 데이터만 쓰고 *그다음* 날의 가격 변동을 적용하므로 정직합니다.\n- **자산곡선(equity curve)** = 시간에 따라 계좌 가치가 어땠을지를 그린 선입니다. 좋은 곡선은 얕은 굴곡으로 우상향하고, 나쁜 곡선은 깊은 골짜기가 있습니다. 시스템 곡선과 매수후보유 곡선을 나란히 비교하세요.\n두 쌍의 숫자를 읽으세요: **CAGR**(시스템 대 매수후보유)와 **최대낙폭**(시스템 대 매수후보유). 통계표에는 **노출도**(돈이 실제로 투자돼 있던 날의 비율 대 현금 관망 — 노출도 60%면 40%의 기간은 시장 밖에 있었다는 뜻)와 **거래 수**(신호가 진입↔청산으로 바뀐 횟수 — 거래가 많을수록 휩쏘가 많고 실전에서는 비용도 많음)도 나옵니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — read the drawdown first, not the return", ko: "1단계 — 수익률 말고 낙폭을 먼저 읽어라" },
      body: {
        en: "The whole point of a trend system is protection, so judge it there first. Compare **max drawdown**: the deepest peak-to-trough loss you'd have lived through.\nWorked example: say your $100 grows to a peak of $150, then falls to $90 before recovering. The drawdown is measured from the *peak*: (150 − 90) / 150 = **40%**. So a -40% drawdown means at the worst point your account was 40% below its previous high. In dollars on a $10,000 account: -20% = you watch it fall to $8,000; -50% = it falls to $5,000 — and you have to sit through that without selling. That gut-check is why we read drawdown first.\n- System drawdown clearly shallower than buy-and-hold (e.g. -20% vs -50%) → the rule did its job; it got you out before the worst of a decline.\n- Drawdowns about equal → the rule isn't protecting you; it's just adding trades and costs for nothing.\nA smaller drawdown is worth real money and, more importantly, is what lets you actually stay in the game — most people abandon a strategy at the bottom of a deep drawdown.",
        ko: "추세 시스템의 존재 이유는 보호이므로, 거기부터 판단하세요. **최대낙폭**을 비교하세요: 고점에서 저점까지 겪었을 가장 깊은 손실입니다.\n예시: 100달러가 고점 150달러까지 올랐다가 회복 전에 90달러로 떨어집니다. 낙폭은 *고점* 기준으로 잽니다: (150 − 90) / 150 = **40%**. 따라서 -40% 낙폭은 최악의 순간에 계좌가 직전 고점보다 40% 아래였다는 뜻입니다. 1만 달러 계좌에서 달러로 보면: -20%는 8,000달러로, -50%는 5,000달러로 떨어지는 것 — 그리고 그것을 팔지 않고 견뎌야 합니다. 이 체감 확인이 낙폭을 먼저 읽는 이유입니다.\n- 시스템 낙폭이 매수후보유보다 확실히 얕음(예: -20% 대 -50%) → 규칙이 제 역할을 함; 하락의 최악 전에 빠져나오게 함.\n- 낙폭이 비슷함 → 규칙이 보호하지 못하고 매매와 비용만 늘림.\n더 작은 낙폭은 실제 돈이 되고, 더 중요하게는 당신이 게임에 남아 있게 합니다 — 대부분은 깊은 낙폭의 바닥에서 전략을 버립니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 2 — what did the protection cost?", ko: "2단계 — 보호의 대가는 얼마였나?" },
      body: {
        en: "Now the return. Compare **CAGR** (compound annual growth rate). It answers: *if my money had grown at one steady rate every year, what rate would land it where it actually ended?* Unlike total return, it lets you compare periods of different length. Worked example: $100 becomes $200 over 10 years. That's +100% total, but as a yearly rate it's about **7.2%** a year (because 1.072 multiplied by itself 10 times ≈ 2). The tool computes this for you; you just compare the two CAGRs. Trend systems very often trail buy-and-hold on raw CAGR — that's normal and expected, because you spend time in cash and eat whipsaw losses.\n- System CAGR slightly below buy-and-hold, but with a much smaller drawdown → a good trade; you gave up a little return for a lot less pain.\n- System CAGR far below buy-and-hold with only a slightly smaller drawdown → a bad trade; the protection wasn't worth it.\nThe honest way to compare is **return per unit of drawdown**, not CAGR alone: return per unit of drawdown = CAGR ÷ drawdown size. The 8%-with-(-20%) system scores 8/20 = **0.4**; the 10%-with-(-50%) system scores 10/50 = **0.2**. Higher is better, so the first system wins even though it earned less — you got more return for each unit of pain. Compute this for your own two numbers from the tool.",
        ko: "이제 수익률입니다. **CAGR**(연복리성장률)을 비교하세요. 이 값은 이렇게 답합니다: *내 돈이 매년 하나의 일정한 속도로 자랐다면, 실제 도달한 곳에 이르게 하는 속도는 얼마인가?* 총수익과 달리 길이가 다른 기간을 서로 비교하게 해줍니다. 예시: 100달러가 10년 만에 200달러가 됩니다. 총 +100%지만, 연율로는 약 **7.2%**/년입니다(1.072를 10번 곱하면 대략 2가 되니까요). 이 값은 도구가 계산해 주고, 당신은 두 CAGR을 비교하기만 하면 됩니다. 추세 시스템은 원시 CAGR에서 매수후보유에 뒤지는 경우가 매우 흔합니다 — 현금 보유 기간과 휩쏘 손실 때문에 정상이며 예상되는 결과입니다.\n- 시스템 CAGR이 매수후보유보다 약간 낮지만 낙폭이 훨씬 작음 → 좋은 거래; 약간의 수익으로 훨씬 적은 고통을 샀습니다.\n- 시스템 CAGR이 매수후보유보다 크게 낮은데 낙폭은 조금만 작음 → 나쁜 거래; 보호가 값어치를 못 했습니다.\n정직한 비교는 CAGR 단독이 아니라 **낙폭 대비 수익**입니다: 낙폭 대비 수익 = CAGR ÷ 낙폭 크기. -20% 낙폭에 8%인 시스템은 8/20 = **0.4**, -50% 낙폭에 10%인 시스템은 10/50 = **0.2**. 높을수록 좋으므로, 덜 벌었어도 첫 번째 시스템이 이깁니다 — 고통 한 단위당 더 많은 수익을 얻은 것입니다. 도구에서 얻은 당신의 두 숫자로 이것을 직접 계산해 보세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 3 — count the whipsaws honestly", ko: "3단계 — 휩쏘를 정직하게 세어라" },
      body: {
        en: "A backtest hides the emotional cost. Look at how the system behaved in **choppy, sideways periods** — where the price is drifting flat with no clear trend, just up-down noise. Those are the exact conditions that trigger false in/out signals, and where trend rules bleed. Each false signal is a **round-trip**: one sell-then-rebuy pair — you pay a cost getting out and again getting back in.\n- Many quick in-out flips → lots of whipsaws. Every one is a moment you'd be tempted to override the rule (\"this signal is obviously wrong\").\n- Honest caveats: this backtest is **one symbol over one history**. It says nothing about the future. It also ignores **slippage** — the small gap between the price you expected and the price you actually got filled at. Two things cause it: the market moves in the split second your order lands, and you have to cross the **bid-ask spread**. At any moment a stock has *two* live prices, not one — the **bid** (the best price a buyer will pay you if you sell) sits a little below the **ask** (the best price a seller will take from you if you buy). That small gap between them is the spread, and it's a real cost: you buy at the higher ask and later sell at the lower bid, so every round trip quietly loses that gap even if the price never moved. On many trades it adds up. And it ignores taxes on each sale — in most accounts, selling a winner at a profit turns a paper gain into a realized gain you can owe tax on *now* (capital-gains tax, transaction tax, and the like), while simply holding defers that tax until you eventually sell, so a rule that trades often carries a hidden tax drag the backtest never shows. Discretion — you second-guessing the rule — usually makes it worse, not better.",
        ko: "백테스트는 감정 비용을 숨깁니다. 시스템이 **횡보·톱니 구간**에서 어떻게 행동했는지 보세요 — 뚜렷한 추세 없이 가격이 밋밋하게 오르내리는 잡음만 있는 구간입니다. 바로 이런 조건이 잘못된 진입·청산 신호를 유발하며, 추세 규칙이 피를 흘리는 곳입니다. 잘못된 신호 하나하나가 **왕복거래(round-trip)** 입니다: 한 번 팔고 다시 사는 한 쌍 — 나갈 때 한 번, 다시 들어올 때 한 번 비용을 냅니다.\n- 빠른 진입·청산 반복이 많음 → 휩쏘가 많음. 하나하나가 규칙을 어기고 싶은 순간입니다(\"이 신호는 딱 봐도 틀렸어\").\n- 정직한 주의: 이 백테스트는 **한 종목의 한 역사**입니다. 미래에 대해 아무것도 말하지 않습니다. 또 **슬리피지(slippage)** 를 무시합니다 — 체결을 기대한 가격과 실제로 체결된 가격 사이의 작은 차이입니다. 원인은 두 가지입니다: 주문을 넣고 체결되는 찰나에 시장이 움직이고, **매수·매도 호가 스프레드(bid-ask spread)** 를 넘어야 합니다. 어느 순간에나 주식에는 가격이 하나가 아니라 *둘*이 있습니다 — **매수 호가(bid)** (당신이 팔 때 사줄 사람이 내는 최선의 가격)는 **매도 호가(ask)** (당신이 살 때 팔 사람이 받는 최선의 가격)보다 조금 아래에 있습니다. 이 둘 사이의 작은 틈이 스프레드이고, 이는 실제 비용입니다: 당신은 더 높은 매도 호가에 사서 나중에 더 낮은 매수 호가에 팔게 되므로, 가격이 전혀 움직이지 않아도 왕복마다 그 틈만큼 조용히 잃습니다. 거래가 잦을수록 쌓입니다. 그리고 매도 시 세금을 무시합니다 — 대부분의 계좌에서 이익 난 포지션을 팔면 평가이익이 실현이익으로 바뀌어 그 시점에 세금이 발생할 수 있고(양도소득세·거래세 등), 그냥 보유하면 실제로 팔 때까지 그 세금을 미룰 수 있으니, 자주 매매하는 규칙에는 백테스트에 드러나지 않는 숨은 세금 부담이 있습니다. 재량 — 당신이 규칙을 의심하는 것 — 은 대개 결과를 더 나쁘게 만듭니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Put the three answers together. A trend system is worth running only if it clearly cuts drawdown, the return it gives up is acceptable for that protection, AND you honestly believe you'd follow it through the whipsaws. As a rough anchor, treat a drawdown cut of only a few points (e.g. -45% vs -50%) as *not* clearly worth the trades; a cut like -20% vs -50% is clearly meaningful. And check the return-per-drawdown score from Step 2 — if the system's score is higher than buy-and-hold's, that's the concrete sign the protection paid for itself. Be brutally honest about the last part — a great system you abandon at the worst moment is worse than buy-and-hold you never touch.",
        ko: "세 답을 합치세요. 추세 시스템은 낙폭을 확실히 줄이고, 그 보호를 위해 포기하는 수익이 받아들일 만하며, **그리고** 당신이 휩쏘를 뚫고 따를 거라고 정직하게 믿을 때만 돌릴 가치가 있습니다. 대략적인 기준선으로, 낙폭이 몇 포인트만 줄어든 경우(예: -45% 대 -50%)는 거래를 감수할 값어치가 *분명하지 않다*고 보고, -20% 대 -50% 같은 감소는 분명히 의미가 있습니다. 그리고 2단계의 낙폭 대비 수익 점수를 확인하세요 — 시스템 점수가 매수후보유보다 높다면, 그것이 보호가 값을 했다는 구체적 신호입니다. 마지막 부분에 대해 냉정하게 정직하세요 — 최악의 순간에 버릴 훌륭한 시스템은, 절대 손대지 않을 매수후보유보다 나쁩니다.",
      },
      prompt: {
        en: "Drawdown clearly reduced? Return cost acceptable? Could you actually follow it through the whipsaws? → Your call: USE THIS SYSTEM / JUST BUY-AND-HOLD, and the one number or behavior that decided it.",
        ko: "낙폭이 확실히 줄었는가? 수익 대가가 받아들일 만한가? 휩쏘를 뚫고 실제로 따를 수 있는가? → 결론: 이 시스템을 쓴다 / 그냥 매수후보유한다, 그리고 그것을 결정한 숫자나 행동 하나.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론 & 다음 행동" },
      body: {
        en: "You just tested a mechanical rule against the honest benchmark — holding — on real prices, and judged it on risk, not just return. That loop is the whole discipline of systematic trend following. Before you'd ever trade it, run this checklist.",
        ko: "방금 기계적 규칙을 정직한 벤치마크 — 단순 보유 — 와 실제 가격으로 겨루고, 수익만이 아니라 위험으로 판단했습니다. 그 흐름이 시스템형 추세추종의 규율 전부입니다. 실제로 매매하기 전에 이 체크리스트를 확인하세요.",
      },
      checklist: [
        { en: "I compared max drawdown FIRST, not CAGR — I know how much pain the system actually saved me.", ko: "CAGR이 아니라 최대낙폭을 먼저 비교했다 — 시스템이 실제로 덜어준 고통이 얼마인지 안다." },
        { en: "The backtest covered at least one full bull-and-bear cycle — I checked the price chart and confirmed it includes a real drop of roughly -20% or more, not just a rising market that flatters any system.", ko: "백테스트가 최소 한 번의 완전한 상승·하락 사이클을 담았다 — 가격 차트를 확인해, 어떤 시스템에도 유리한 상승장만이 아니라 대략 -20% 이상의 실제 하락이 들어 있음을 확인했다." },
        { en: "I mentally added real trading costs and slippage on every signal — the live result will be worse than the backtest.", ko: "모든 신호에 실제 거래비용과 슬리피지를 머릿속으로 더했다 — 실전 결과는 백테스트보다 나쁠 것이다." },
        { en: "I looked at the whipsaw-heavy stretches and honestly decided whether I'd have kept following the rule.", ko: "휩쏘가 심한 구간을 보고, 그래도 규칙을 계속 따랐을지 정직하게 판단했다." },
        { en: "This is a backtest on one symbol's past — a hypothesis about a rule, not a promise about the future or a recommendation to trade.", ko: "이건 한 종목 과거에 대한 백테스트 — 규칙에 관한 가설이지, 미래의 약속이나 매매 추천이 아니다." },
      ],
    },
  ],
};

export const active: Walkthrough = {
  labId: "active-trading",
  title: {
    en: "Risk first: sizing a trade so a loss can't hurt you",
    ko: "위험이 먼저: 손실이 당신을 다치게 할 수 없도록 트레이드 사이징하기",
  },
  goal: {
    en: "By the end you'll have built ATR-based trade plans, watched a run of trades play out (wins and stop-outs), seen how expectancy — not any single trade — decides the outcome, and written down the fixed % of capital you'll risk per trade.",
    ko: "끝까지 따라가면 ATR 기반 트레이드 계획을 세우고, 일련의 거래가 전개되는 것을(승리와 손절) 지켜보며, 개별 거래가 아니라 기대값이 결과를 결정하는 것을 확인한 뒤, 거래당 감수할 자본의 고정 %를 적게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "What we're actually deciding", ko: "우리가 실제로 결정하려는 것" },
      body: {
        en: "Amateurs ask \"what should I buy?\" Professionals ask, in this order:\n- **How much can I lose** on this trade if I'm wrong? (fixed, small % of capital)\n- **Where's my stop** — the price that proves the idea wrong? (set from volatility, before entry)\n- **How big a position** does that stop and that risk imply? (position size falls out of the math)\nOnly then does the entry matter. This is *risk-first* trading: you decide your loss before your gain. The goal of this lab is to make that ordering feel automatic.",
        ko: "아마추어는 \"뭘 사야 하지?\"라고 묻습니다. 프로는 이 순서로 묻습니다:\n- 틀렸을 때 이 거래에서 **얼마를 잃을 수 있는가**? (자본의 고정된 작은 %)\n- **손절가는 어디인가** — 이 아이디어가 틀렸음을 증명하는 가격은? (진입 전에 변동성으로 설정)\n- 그 손절과 그 위험이 함의하는 **포지션 크기**는? (사이즈는 계산에서 자동으로 나옴)\n그런 다음에야 진입이 중요해집니다. 이것이 *위험 우선* 트레이딩입니다: 이익보다 손실을 먼저 정합니다. 이 랩의 목표는 그 순서를 자동처럼 느끼게 하는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the candles come from", ko: "캔들은 어디서 오는가" },
      body: {
        en: "To size a trade you need the asset's recent **volatility**, and for that you need real daily candles. A **candle** is just a compact picture of one trading day: it packs four prices — **Open** (first trade of the day), **High** (highest), **Low** (lowest), **Close** (last trade) — plus **Volume** (shares traded). Together those five are called **OHLCV**. We use *adjusted* candles: on days a stock splits (e.g. 1 share becomes 4) or pays a dividend, the raw price drops for a bookkeeping reason, not a real move — adjustment removes that artificial jump so the daily range reflects real trading, not accounting. From those candles we measure how far the price typically travels in a day — the number we'll turn into a stop in the next two steps, instead of a random \"I'll risk 5%.\"",
        ko: "트레이드를 사이징하려면 자산의 최근 **변동성**이 필요하고, 그러려면 실제 일간 캔들이 필요합니다. **캔들**은 하루 거래의 압축된 그림일 뿐입니다: 네 가지 가격 — **시가**(그날 첫 체결가), **고가**(가장 높은 가격), **저가**(가장 낮은 가격), **종가**(그날 마지막 체결가) — 에 **거래량**(거래된 주식 수)이 더해집니다. 이 다섯 개를 합쳐 **OHLCV**라고 부릅니다. 우리는 *수정* 캔들을 씁니다: 주식이 분할되거나(예: 1주가 4주로) 배당을 지급하는 날에는 실제 움직임이 아니라 회계상의 이유로 원가격이 떨어집니다 — 수정은 그 인위적 점프를 제거해 일간 범위가 회계가 아니라 실제 거래를 반영하게 합니다. 그 캔들에서 하루에 가격이 통상 얼마나 움직이는지를 측정하고, 다음 두 단계에서 임의의 \"5% 감수\"가 아니라 그 숫자를 손절로 바꿉니다.",
      },
      sources: [
        {
          name: { en: "Yahoo Finance — historical prices", ko: "야후 파이낸스 — 과거 시세" },
          what: { en: "Daily OHLC candles used to compute ATR and to resolve each trade against real highs/lows.", ko: "ATR 계산과 각 거래를 실제 고가·저가로 판정하는 데 쓰는 일간 OHLC 캔들." },
          why: { en: "You need true daily ranges — not just closes — to measure volatility and to test whether a stop would have been hit intrabar.", ko: "변동성을 재고 손절이 장중에 닿았을지 시험하려면 종가만이 아니라 실제 일간 범위가 필요합니다." },
          url: "https://finance.yahoo.com/quote/AAPL/history",
          shot: YAHOO_SHOT,
        },
      ],
    },
    {
      kind: "read",
      title: { en: "What ATR actually is", ko: "ATR가 실제로 무엇인가" },
      body: {
        en: "The one number that drives everything below is **ATR (Average True Range)**. It answers one question in dollars: on a normal day, how far does this stock swing? Think of it as the stock's normal *stride length*.\n- **True Range** for a single day is the widest of three gaps: today's high minus today's low, *or* today's high minus yesterday's close, *or* yesterday's close minus today's low — whichever is biggest. The extra two cases catch overnight jumps a plain high−low would miss.\n- **ATR** is simply the average of that daily True Range over the last ~14 days, so one odd day doesn't dominate the number.\n- **Example with units:** a $180 stock with ATR ≈ $3.50 typically travels about $3.50 up-and-down on a normal day. ATR is in *dollars per share* — you can also read it as a %: $3.50 ÷ $180 ≈ 1.9%.\n- **By hand on a REAL trade (do this once so you can size a fresh trade without our tool):** pull up the stock's daily table on Yahoo Finance (or Naver 증권) and read the **High / Low / Close** columns for the last ~15 rows. For each day compute **True Range = max( High − Low, |High − prevClose|, |Low − prevClose| )** — that is the widest of the three gaps, using *yesterday's* Close for the last two. Then **ATR = the average of the last 14 days' True Range**. That ATR (in dollars per share) is your volatility number; you then size the trade with the formula from Step 2 below: **shares = (capital × risk%) ÷ stop distance per share**, where the stop distance is your ATR multiple (e.g. 2 × ATR). Do it by hand once and the tool's output stops being a black box.\n- **Sanity check:** eyeball a few recent daily bars on the chart — if most days span roughly $3–4, an ATR near $3.50 is believable; if the tool printed $30, something's wrong. The analyzer computes ATR for you, but you should always be able to eyeball whether the number is plausible.",
        ko: "아래 모든 것을 이끄는 단 하나의 숫자가 **ATR(평균 실질 범위)** 입니다. 이는 한 가지 질문에 달러로 답합니다: 평범한 날 이 주식은 얼마나 흔들리는가? 이 주식의 평소 *보폭*이라고 생각하세요.\n- 하루의 **실질 범위(True Range)** 는 세 가지 간격 중 가장 넓은 것입니다: 오늘 고가 − 오늘 저가, *또는* 오늘 고가 − 어제 종가, *또는* 어제 종가 − 오늘 저가 — 셋 중 가장 큰 값. 뒤의 두 경우는 단순한 고가−저가로는 놓치는 밤사이 점프(갭)를 잡아냅니다.\n- **ATR** 는 그 일간 실질 범위를 최근 약 14일간 평균한 것일 뿐입니다. 그래야 이상한 하루가 숫자를 좌우하지 않습니다.\n- **단위가 있는 예시:** ATR ≈ $3.50인 $180짜리 주식은 평범한 날 대략 $3.50만큼 위아래로 움직입니다. ATR의 단위는 *주당 달러* 입니다 — 퍼센트로도 읽을 수 있습니다: $3.50 ÷ $180 ≈ 1.9%.\n- **실제 트레이드에서 손으로 (우리 도구 없이 새 트레이드를 사이징할 수 있도록 한 번 해보세요):** 야후 파이낸스(또는 네이버 증권)에서 그 종목의 일간 시세표를 열어 최근 약 15줄의 **고가(High) / 저가(Low) / 종가(Close)** 열을 읽습니다. 각 날에 대해 **실질 범위(True Range) = max( 고가 − 저가, |고가 − 어제 종가|, |저가 − 어제 종가| )** 를 계산합니다 — 세 간격 중 가장 넓은 값이며, 뒤의 두 개는 *어제* 종가를 씁니다. 그런 다음 **ATR = 최근 14일 실질 범위의 평균**. 이 ATR(주당 달러)가 당신의 변동성 숫자이고, 아래 2단계의 공식으로 트레이드를 사이징합니다: **주식 수 = (자본 × 위험%) ÷ 주당 손절 거리**, 여기서 손절 거리는 당신이 정한 ATR 배수(예: 2 × ATR)입니다. 손으로 한 번 해보면 도구의 출력이 더 이상 블랙박스가 아니게 됩니다.\n- **검증:** 차트에서 최근 일간 봉 몇 개를 눈으로 확인하세요 — 대부분의 날이 대략 $3~4 폭이면 $3.50 근처의 ATR는 믿을 만합니다; 도구가 $30을 찍었다면 뭔가 잘못된 것입니다. 분석 도구가 ATR를 대신 계산해 주지만, 그 숫자가 그럴듯한지는 항상 눈으로 확인할 수 있어야 합니다.",
      },
    },
    {
      kind: "tool",
      title: { en: "Build the plans and let them resolve", ko: "계획을 세우고 전개되게 하라" },
      body: {
        en: "Use the analyzer below. It steps through a handful of frozen trade entries and resolves each one. A few terms first:\n- A **setup** is the pre-decided reason to enter — the specific condition that triggers a trade. These are *frozen*, i.e. fixed in advance, so the test can't secretly peek at future prices and cheat.\n- A **bar** is one candle = one day. **Intrabar** means the price touched a level at some moment *during* the day, even if the day closed somewhere else.\n- **Stop-first** means: if the day's Low dipped to (pierced) your stop price at any point, we count you as sold at the stop — we don't give you the benefit of a higher close you never acted on.\nFor each setup it builds the plan: entry price, a **stop distance set from ATR** (e.g. 2 × ATR below entry), and a **position size** so that hitting the stop loses exactly your chosen risk %.\n- **Concrete example:** entry $180, ATR $3.50, stop set 2 × ATR below → 180 − 2×3.50 = $173. Your planned loss per share is that $7 gap.\nThen it resolves each trade against the real candles, intrabar and stop-first. Some win, some stop out. Watch the running **P&L (profit and loss)** — the cumulative total of every win and stop-out added up as you go — not just each trade on its own.",
        ko: "아래 분석 도구를 사용하세요. 몇 개의 고정된 트레이드 진입을 하나씩 밟으며 각각을 판정합니다. 먼저 몇 가지 용어:\n- **셋업**은 진입하는 미리 정해진 이유입니다 — 거래를 촉발하는 구체적 조건. 이것들은 *고정*되어 있습니다, 즉 사전에 정해져서 테스트가 몰래 미래 가격을 훔쳐보고 속일 수 없습니다.\n- **봉(bar)** 은 캔들 하나 = 하루입니다. **장중(intrabar)** 은 하루 중 어느 순간 가격이 어떤 수준에 닿았다는 뜻입니다, 그날이 다른 곳에서 마감했더라도.\n- **손절 우선(stop-first)** 은: 그날 저가가 어느 시점에든 손절가까지 내려가(뚫어) 닿았다면, 더 높게 마감했더라도 손절가에서 매도된 것으로 셉니다 — 실제로 실행하지 않은 높은 종가의 혜택은 주지 않습니다.\n각 셋업에 대해 계획을 세웁니다: 진입가, **ATR로 정한 손절 거리**(예: 진입 아래 2 × ATR), 그리고 손절에 닿으면 정확히 당신이 고른 위험 %만 잃도록 하는 **포지션 크기**.\n- **구체적 예:** 진입 $180, ATR $3.50, 손절은 2 × ATR 아래로 설정 → 180 − 2×3.50 = $173. 주당 계획된 손실은 그 $7 간격입니다.\n그런 다음 실제 캔들로 각 거래를 장중·손절 우선으로 판정합니다. 일부는 이기고 일부는 손절됩니다. 개별 거래 하나하나가 아니라 누적 **손익(P&L, profit and loss)** — 모든 승리와 손절이 진행되며 차곡차곡 합산된 총합 — 을 지켜보세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — the stop comes from volatility, not hope", ko: "1단계 — 손절은 희망이 아니라 변동성에서 나온다" },
      body: {
        en: "Look at how the stop distance was set: a multiple of **ATR**, not a round number. Why? If you place a stop closer than the asset's normal daily wiggle, ordinary noise will stop you out over and over even when your idea is fine. If you place it too far, a single loss is too big.\n- Stop ≈ 1.5–3 × ATR is a common range — tight enough to cap the loss, loose enough to survive normal noise.\n- **Worked example:** with ATR $3.50, a stop only $1 below entry (well under one normal day's swing) gets hit by routine wiggle almost immediately, even if your idea is right; a 2×ATR = $7 stop sits outside normal daily noise, so only a genuine move against you triggers it. That's the whole reason the stop is a multiple of ATR, not a flat $1 or a round 5%.\n- The stop is set **before entry** and doesn't move against you. A stop you widen mid-trade because \"it'll come back\" is how a small planned loss becomes an account-ending one.",
        ko: "손절 거리가 어떻게 정해졌는지 보세요: 둥근 숫자가 아니라 **ATR**의 배수입니다. 왜일까요? 자산의 정상적인 일간 흔들림보다 가깝게 손절을 두면, 아이디어가 멀쩡해도 평범한 잡음이 계속 당신을 털어냅니다. 너무 멀리 두면 한 번의 손실이 너무 큽니다.\n- 손절 ≈ 1.5~3 × ATR가 흔한 범위 — 손실을 제한할 만큼 좁고, 정상 잡음을 견딜 만큼 넓습니다.\n- **예시:** ATR $3.50에서, 진입 아래 겨우 $1인 손절(정상적인 하루 흔들림에 한참 못 미침)은 아이디어가 맞아도 일상적 흔들림에 거의 즉시 닿습니다; 2×ATR = $7 손절은 정상적인 일간 잡음 바깥에 있어, 당신에게 불리한 진짜 움직임만이 그것을 촉발합니다. 이것이 손절이 밋밋한 $1이나 둥근 5%가 아니라 ATR의 배수여야 하는 이유 전부입니다.\n- 손절은 **진입 전에** 정하며 당신에게 불리하게 움직이지 않습니다. \"돌아올 거야\" 하며 도중에 넓히는 손절이, 작게 계획된 손실을 계좌를 끝내는 손실로 바꿉니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 2 — position size is an output, not a feeling", ko: "2단계 — 포지션 크기는 감이 아니라 출력값이다" },
      body: {
        en: "This is the core move. You fix two things: your **risk % per trade** (say 1% of capital) and your **stop distance** (from ATR). Position size then falls out:\n- **shares ≈ (capital × risk%) ÷ stop distance per share.**\nThe **stop distance per share** is exactly the dollar gap from entry to stop — the $7 from our example (2 × ATR).\n- **Worked example:** say capital = $10,000 and risk % = 1%, so the most you'll lose on this trade is $10,000 × 1% = $100. Each share can lose $7 before the stop. Shares = $100 ÷ $7 ≈ 14 shares (round *down* so you never exceed the budget). If you're wrong and the stop hits, 14 × $7 = ~$98 — essentially your 1% budget.\n- **Why a wider stop means fewer shares — same risk:** compare two stocks, same $100 risk budget. Stock A is calm, stop distance $2/share → 100 ÷ 2 = 50 shares; Stock B is wild, stop distance $10/share → 100 ÷ 10 = 10 shares. Very different share counts, but if either stops out you lose the *same $100*. Volatility changes the position size, never the risk.\nNotice what this kills: the urge to \"bet big on a good one.\" The setup you're most excited about gets the same risk budget as any other. That uniformity is what makes a long string of trades survivable.",
        ko: "이것이 핵심입니다. 두 가지를 고정합니다: **거래당 위험 %**(가령 자본의 1%)와 **손절 거리**(ATR에서). 그러면 포지션 크기가 자동으로 나옵니다:\n- **주식 수 ≈ (자본 × 위험%) ÷ 주당 손절 거리.**\n**주당 손절 거리**는 진입에서 손절까지의 달러 간격 바로 그것입니다 — 우리 예시의 $7 (2 × ATR).\n- **예시:** 자본 = $10,000, 위험 % = 1%라고 합시다. 그러면 이 거래에서 잃을 수 있는 최대는 $10,000 × 1% = $100입니다. 각 주식은 손절까지 $7을 잃을 수 있습니다. 주식 수 = $100 ÷ $7 ≈ 14주(예산을 넘지 않도록 *내림*). 틀려서 손절에 닿으면 14 × $7 = 약 $98 — 사실상 당신의 1% 예산입니다.\n- **왜 손절이 넓으면 주식 수가 적어지는데 위험은 같은가:** 두 주식을 비교하세요, 같은 $100 위험 예산. 주식 A는 잔잔해서 손절 거리 $2/주 → 100 ÷ 2 = 50주; 주식 B는 거칠어서 손절 거리 $10/주 → 100 ÷ 10 = 10주. 주식 수는 매우 다르지만, 둘 중 어느 쪽이 손절되든 *같은 $100*을 잃습니다. 변동성은 포지션 크기를 바꿀 뿐, 위험은 절대 바꾸지 않습니다.\n이것이 무엇을 없애는지 보세요: \"좋은 놈에 크게 걸고 싶은\" 충동. 가장 기대되는 셋업도 다른 것과 같은 위험 예산을 받습니다. 그 균일함이 긴 거래 연속을 견딜 수 있게 합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 3 — expectancy, not the last trade", ko: "3단계 — 마지막 거래가 아니라 기대값" },
      body: {
        en: "Now read the run of resolved trades as a whole. A **distribution** just means the whole spread of outcomes — how many small wins, big wins, small losses, big losses — read together, instead of fixating on the last result. One trade is noise; the shape of all of them is the signal.\n- **Win rate** alone means nothing — a 40% win rate is very profitable if wins are 3× the size of losses, and a 70% win rate loses money if losses are huge.\n- What matters is **expectancy** = average dollars won or lost per trade, in dollars: (win% × avg win) − (loss% × avg loss).\n  - *40% win example:* 0.40 × $300 (avg win) − 0.60 × $100 (avg loss) = $120 − $60 = **+$60 per trade** — profitable despite losing 60% of the time, because wins are 3× losses.\n  - *70% win example:* 0.70 × $50 − 0.30 × $400 = $35 − $120 = **−$85 per trade** — a losing system despite winning most trades, because the few losses are huge.\n- Your **edge** is the small, repeatable statistical advantage that makes you profitable *in aggregate* — not on any one trade, but averaged over many. Positive expectancy repeated many times, with fixed small risk, IS that edge; there is nothing more to it.\n- Honest caveats: this is a small frozen sample. Real trading adds commissions, **slippage** (the difference between the price you expected and the price you actually got filled at — in fast markets your order fills a bit worse), and an **overnight gap** (the stock *opens* far from where it closed the day before, on bad news, so it can blow past your stop and you exit worse than planned — a real way to lose more than your 1%). And a **losing streak WILL happen** — even a positive-expectancy system delivers strings of losses; your sizing has to survive them.",
        ko: "이제 판정된 거래들을 전체로 읽으세요. **분포(distribution)** 란 결과 전체의 퍼짐을 뜻할 뿐입니다 — 작은 이익, 큰 이익, 작은 손실, 큰 손실이 각각 몇 개인지를 함께 읽는 것, 마지막 결과에 집착하는 대신. 한 번의 거래는 잡음이고, 그 전부의 모양이 신호입니다.\n- **승률** 하나로는 아무 의미도 없습니다 — 승리가 손실의 3배면 40% 승률도 매우 수익성 있고, 손실이 거대하면 70% 승률도 돈을 잃습니다.\n- 중요한 건 **기대값** = 거래당 평균 손익, 단위는 달러: (승률 × 평균 이익) − (패율 × 평균 손실).\n  - *40% 승률 예시:* 0.40 × $300(평균 이익) − 0.60 × $100(평균 손실) = $120 − $60 = **+$60/거래** — 60%를 잃어도 수익성 있음, 이익이 손실의 3배이기 때문.\n  - *70% 승률 예시:* 0.70 × $50 − 0.30 × $400 = $35 − $120 = **−$85/거래** — 대부분 이겨도 지는 시스템, 몇 안 되는 손실이 거대하기 때문.\n- **엣지(edge)** 란 개별 거래가 아니라 여러 거래에 걸쳐 *총합적으로* 당신을 수익성 있게 만드는, 작지만 반복 가능한 통계적 우위입니다. 고정된 작은 위험으로 양(+)의 기대값을 여러 번 반복하는 것이 바로 그 엣지이며, 그 이상은 없습니다.\n- 정직한 주의: 이건 작은 고정 표본입니다. 실전은 수수료, **슬리피지**(당신이 기대한 가격과 실제로 체결된 가격의 차이 — 빠른 시장에서는 주문이 약간 더 나쁘게 체결됨), 그리고 **밤사이 갭**(주식이 전날 마감한 곳에서 멀리 떨어져 *시가*가 형성되는 것, 악재로, 그래서 손절을 지나쳐 버려 계획보다 나쁘게 청산될 수 있음 — 1%보다 더 잃는 실제 경로)을 더합니다. 그리고 **연패는 반드시 옵니다** — 양의 기대값 시스템도 손실의 연속을 냅니다; 당신의 사이징이 그것을 견뎌야 합니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Pick your fixed risk % per trade and stress-test it. The classic answer is small — often 0.5% to 1% of capital — because you must survive a run of, say, 10 losses in a row without your account or your nerve breaking.\nOne subtlety first. In Step 2 we fixed the dollar risk at 1% of the *original* $10,000 — a flat $100 every trade — to keep the sizing example simple. But in real practice you recompute the % off your *current* balance before each trade, so the risk isn't a frozen $100 forever. That's what the stress-test below assumes: losses compound on shrinking capital — you risk your % of whatever you have *now*, so after each loss the next dollar risk is a bit smaller (1% of $9,900 is $99, not $100). Because the dollar amount changes each time, you multiply the survival factor, you don't just subtract a flat amount 10 times:\n- At **1% risk**, after 10 straight losses you keep about 0.99^10 ≈ 90.4% of capital (a $10,000 account → ~$9,044).\n- At **2%** it's 0.98^10 ≈ 81.7% (~$8,171).\n- At **5%** it's 0.95^10 ≈ 59.9% (~$5,987).\nNotice how fast a bigger % bites. If the number you land on scares you, your risk % is too high. (The 11th setup = the next time your entry condition triggers.)",
        ko: "거래당 고정 위험 %를 고르고 스트레스 테스트하세요. 고전적 답은 작습니다 — 흔히 자본의 0.5%~1% — 예컨대 10연패를 계좌도 멘탈도 무너지지 않고 견뎌야 하기 때문입니다.\n먼저 한 가지 미묘한 점. 2단계에서는 사이징 예시를 단순하게 유지하려고 달러 위험을 *처음* $10,000의 1%인 매 거래 밋밋한 $100로 고정했습니다. 하지만 실전에서는 각 거래 전에 *현재* 잔고를 기준으로 %를 다시 계산하므로, 위험이 영원히 $100로 얼어붙어 있지 않습니다. 아래 스트레스 테스트는 바로 이것을 가정합니다: 손실은 줄어드는 자본에 복리로 작용합니다 — 당신은 *지금* 가진 것의 %를 감수하므로, 손실마다 다음 달러 위험이 조금씩 작아집니다($9,900의 1%는 $100이 아니라 $99). 달러 금액이 매번 바뀌므로, 밋밋한 금액을 10번 빼는 게 아니라 생존 배율을 곱합니다:\n- 위험 **1%** 에서 10연패 후 자본의 약 0.99^10 ≈ 90.4%가 남습니다($10,000 계좌 → 약 $9,044).\n- **2%** 면 0.98^10 ≈ 81.7%(약 $8,171).\n- **5%** 면 0.95^10 ≈ 59.9%(약 $5,987).\n더 큰 %가 얼마나 빨리 갉아먹는지 보세요. 당신이 도달한 숫자가 무섭다면, 위험 %가 너무 높은 것입니다. (11번째 셋업 = 당신의 진입 조건이 다음으로 촉발되는 때.)",
      },
      prompt: {
        en: "My fixed risk per trade = ___% of capital. After 10 straight losses I'd have ___ left. Can I trade the 11th setup calmly? → If not, lower the %.",
        ko: "내 거래당 고정 위험 = 자본의 ___%. 10연패 후 남는 자본 = ___. 11번째 셋업을 침착하게 매매할 수 있는가? → 아니라면 %를 낮춰라.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론 & 다음 행동" },
      body: {
        en: "You just planned trades the professional way — loss first, size as an output, judged over a series instead of one lucky or unlucky trade. The entry was almost the least important part, and that's the point. Before risking real money, run this checklist.",
        ko: "방금 프로처럼 거래를 계획했습니다 — 손실 먼저, 크기는 출력값, 운 좋은/나쁜 한 거래가 아니라 시리즈로 판단. 진입은 거의 가장 덜 중요했고, 그게 핵심입니다. 실제 돈을 걸기 전에 이 체크리스트를 확인하세요.",
      },
      checklist: [
        { en: "I set my stop from ATR (volatility) BEFORE entry, and I commit not to widen it mid-trade.", ko: "진입 전에 ATR(변동성)로 손절을 정했고, 도중에 넓히지 않기로 약속한다." },
        { en: "I let position size fall out of (risk% × capital) ÷ stop — every trade risks the same fixed amount.", ko: "포지션 크기를 (위험% × 자본) ÷ 손절에서 자동으로 도출했다 — 모든 거래가 같은 고정 금액을 감수한다." },
        { en: "I judged the plan on expectancy over many trades, not on whether the last trade won.", ko: "마지막 거래의 승패가 아니라 여러 거래에 걸친 기대값으로 계획을 판단했다." },
        { en: "I checked that my risk % survives a 10-loss streak, and I added real costs, slippage, and gap risk on top.", ko: "내 위험 %가 10연패를 견디는지 확인했고, 그 위에 실제 비용·슬리피지·갭 위험을 더했다." },
        { en: "This was a small frozen sample tested on past candles (a backtest) and a plan to test — no guarantee, past ≠ future, and discipline is what makes or breaks it, not the setup.", ko: "이건 과거 캔들로 검증한 작은 고정 표본(백테스트, 과거 시세로 계획을 검증한 것)이자 앞으로 검증할 계획 — 보장 없고, 과거 ≠ 미래이며, 셋업이 아니라 규율이 성패를 가른다." },
      ],
    },
  ],
};

export const macro: Walkthrough = {
  labId: "macro",
  title: {
    en: "What regime are we in — and how would you tilt?",
    ko: "우리는 어떤 국면에 있는가 — 그리고 어떻게 기울일 것인가?",
  },
  goal: {
    en: "By the end you'll have read the yield-curve spread, inflation, the Sahm indicator and a growth/inflation quadrant off real FRED data, decided which regime the evidence points to, and written down how that would tilt your allocation.",
    ko: "끝까지 따라가면 실제 FRED 데이터로 장단기 금리차, 인플레이션, 삼(Sahm) 지표, 성장/인플레이션 사분면을 읽고, 증거가 가리키는 국면을 판단한 뒤, 그것이 자산배분을 어떻게 기울일지를 적게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "What we're actually deciding", ko: "우리가 실제로 결정하려는 것" },
      body: {
        en: "First, two words we'll lean on. **Asset classes** are the big buckets you can put money in: **stocks** (owning slices of companies), **bonds** (lending money for interest), **commodities** (physical things like oil and gold) and **cash**. A **regime** is just: which bucket the economic weather favors right now. Macro investing doesn't bet on a single indicator — it positions for the *regime*, the broad backdrop of growth and inflation that tends to favor whole asset classes.\n\nWe'll read four things and combine them into one picture:\n- **Yield-curve spread** (10yr − 3mo) — the gap between long-term and short-term government interest rates. When short-term rates rise above long-term ones (called an *inversion*, explained in Step 1), it has preceded most recessions.\n- **Inflation YoY** (year-over-year — how much prices rose vs. the same month a year ago) — rising or falling, and how fast.\n- **Sahm indicator** — a real-time flag for the *start* of a recession, built from the unemployment rate.\n- **Growth/inflation quadrant** — growth up/down × inflation up/down, which suggests what tends to work.\n\nNone of these is a crystal ball. Each lags, whipsaws (flips back and forth, faking you out), or has fired falsely before. The skill is reading them together, not worshipping one.",
        ko: "먼저 앞으로 계속 쓸 두 단어. **자산군**은 돈을 담는 큰 바구니들입니다: **주식**(회사의 지분 조각을 소유), **채권**(이자를 받고 돈을 빌려줌), **원자재**(석유·금 같은 물리적 자산), **현금**. **국면(regime)**은 결국: 지금 경제 날씨가 어느 바구니에 유리한가입니다. 매크로 투자는 단일 지표에 베팅하지 않습니다 — 자산군 전체에 유리하게 작용하는 성장·인플레이션의 큰 배경, 즉 *국면*에 포지션합니다.\n\n네 가지를 읽어 하나의 그림으로 합칩니다:\n- **장단기 금리차**(10년 − 3개월) — 장기와 단기 국채 금리의 차이. 단기 금리가 장기보다 높아지는 것(이른바 *역전*, 1단계에서 설명)은 대부분의 경기침체에 선행했습니다.\n- **인플레이션 YoY**(전년 동월 대비 — 1년 전 같은 달과 비교해 물가가 얼마나 올랐는지) — 오르는지 내리는지, 얼마나 빠른지.\n- **삼(Sahm) 지표** — 실업률로 만든, 경기침체 *시작*을 실시간으로 알리는 신호.\n- **성장/인플레이션 사분면** — 성장 상/하 × 인플레이션 상/하, 무엇이 통하는 경향인지 시사.\n\n어느 것도 수정 구슬이 아닙니다. 각각 지연되거나, 톱니처럼 위아래로 번갈아 나오는 속임수 신호(whipsaw)를 내거나, 과거에 헛불질을 했습니다. 기술은 하나를 숭배하는 게 아니라 함께 읽는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the macro data comes from", ko: "매크로 데이터는 어디서 오는가" },
      body: {
        en: "Before we name the inputs, here's what the raw series actually are:\n- A **Treasury yield** is the interest rate the US government pays to borrow money — the 10-year yield is for borrowing for 10 years, the 3-month for 3 months.\n- **CPI** (Consumer Price Index) tracks the cost of a typical basket of everyday goods and services; its year-over-year change *is* inflation.\n- The **unemployment rate** is the share of people who want a job but don't have one.\n\nThe tool turns these raw series into the four signals — you don't compute anything by hand. Every series here is official US government / central-bank data, pulled from **FRED** (the Federal Reserve Bank of St. Louis) via its keyless CSV endpoint and pre-ingested to static JSON. You can click any series' FRED page and see the exact same numbers. That transparency matters: macro data gets **revised** (official agencies update these numbers weeks or months later as better data arrives), so a signal that looks clean today may have looked different in real time.",
        ko: "입력값 이름을 대기 전에, 원시 시계열이 실제로 무엇인지 봅시다:\n- **국채 금리(Treasury yield)**는 미국 정부가 돈을 빌리며 지불하는 이자율입니다 — 10년물 금리는 10년간 빌릴 때, 3개월물은 3개월간 빌릴 때의 이율입니다.\n- **CPI**(소비자물가지수)는 일상적인 재화·서비스 묶음의 비용을 추적합니다; 그 전년 대비 변화가 곧 인플레이션입니다.\n- **실업률**은 일하고 싶지만 일자리가 없는 사람의 비율입니다.\n\n이 도구가 이 원시 시계열을 네 신호로 바꿉니다 — 손으로 계산할 게 없습니다. 여기의 모든 시계열은 공식 미국 정부/중앙은행 데이터로, **FRED**(세인트루이스 연방준비은행)의 키 없는 CSV 엔드포인트에서 가져와 정적 JSON으로 미리 수집했습니다. 어떤 시계열이든 FRED 페이지를 클릭해 정확히 같은 숫자를 볼 수 있습니다. 그 투명성이 중요합니다: 매크로 데이터는 **수정**됩니다(공식 기관이 더 나은 자료가 들어오면 수 주~수 개월 뒤 숫자를 갱신). 그래서 오늘 깔끔해 보이는 신호가 실시간에는 다르게 보였을 수 있습니다.",
      },
      sources: [
        {
          name: { en: "FRED — St. Louis Fed", ko: "FRED — 세인트루이스 연준" },
          what: { en: "The tool pulls FRED's ready-made spread series T10Y3M (10yr − 3mo, in percentage points), plus UNRATE (unemployment %), CPIAUCSL (CPI index — the tool computes YoY itself), and related series. Click any FRED series page to see the same numbers.", ko: "이 도구는 FRED가 이미 계산해 둔 금리차 시계열 T10Y3M(10년 − 3개월, %포인트)과 UNRATE(실업률 %), CPIAUCSL(CPI 지수 — YoY는 도구가 직접 계산), 관련 시계열을 가져옵니다. FRED 시계열 페이지를 클릭하면 같은 숫자를 볼 수 있습니다." },
          why: { en: "It's the definitive free archive of US macro data, sourced straight from the government agencies that publish it — no vendor spin.", ko: "미국 매크로 데이터의 결정판 무료 아카이브로, 데이터를 발표하는 정부 기관에서 곧바로 가져옵니다 — 벤더의 가공이 없습니다." },
          url: "https://fred.stlouisfed.org",
          shot: FRED_SHOT,
        },
      ],
    },
    {
      kind: "read",
      title: { en: "What each number looks like — and how to check it", ko: "각 숫자는 어떻게 생겼나 — 그리고 검산법" },
      body: {
        en: "So you can recognize a normal vs. an alarming reading — and spot-check the tool's arithmetic — here's the **unit**, a rough magnitude, and one by-hand check for each readout:\n- **Spread** — in **percentage points**. Illustrative: if 10yr = 4.1% and 3mo = 4.6%, spread = 4.1 − 4.6 = **−0.5 points** — the negative sign is the inversion. A positive spread (e.g. +1.5) is normal.\n- **Inflation YoY** — a **percent**. ~2% is the Fed's target, ~3–4% is warm, high single digits is hot. By hand: (this year's CPI index ÷ last year's same-month CPI index − 1). E.g. Jan-2024 CPI ≈ 309.7 ÷ Jan-2023 CPI ≈ 300.5 − 1 ≈ **+3.1%**. (A CPI *index level* isn't dollars — it's a unitless number pegged to a base period set at 100, so 310 means the basket costs 3.1× what it did in that base period. CPIAUCSL sits around 310–334 in 2024–26; only the year-over-year division above turns it into the percent that *is* inflation.)\n- **Sahm** — in **points of the unemployment rate**. It's (the 3-month-average unemployment rate now) minus (its lowest 3-month average in the past 12 months). Worked example (illustrative, not today's reading): low was 3.5%, now 4.1% → **0.6 points** → above the 0.5 trigger.\n- **Recession gauge** — a **0–100** summary (higher = more recession risk). The tool colors it green, amber above ~35, red above ~60.\n\nThe tool computes all of these; these examples just let you check its arithmetic and know what a normal vs. alarming reading looks like.",
        ko: "정상 판독과 경고 판독을 알아보고 — 도구의 계산을 손으로 확인할 수 있도록 — 각 판독값의 **단위**, 대략적 크기, 손 검산법 하나씩:\n- **금리차** — 단위는 **%포인트**. 설명용 예: 10년물 = 4.1%, 3개월물 = 4.6%면 금리차 = 4.1 − 4.6 = **−0.5포인트** — 음(−) 부호가 역전입니다. 양(+)의 금리차(예: +1.5)는 정상.\n- **인플레이션 YoY** — 단위는 **%**. ~2%는 연준 목표, ~3~4%는 다소 높음, 높은 한 자릿수는 과열. 손 검산: (올해 CPI 지수 ÷ 작년 같은 달 CPI 지수 − 1). 예: 2024년 1월 CPI ≈ 309.7 ÷ 2023년 1월 CPI ≈ 300.5 − 1 ≈ **+3.1%**. (CPI *지수 수준*은 달러가 아니라 기준 시점을 100으로 놓은 단위 없는 숫자입니다 — 310이면 그 기준 시점 대비 묶음 값이 3.1배라는 뜻. CPIAUCSL은 2024~26년 기준 310~334쯤이고, 위 전년 대비 나눗셈을 거쳐야만 곧 인플레이션인 %가 됩니다.)\n- **삼(Sahm)** — 단위는 **실업률의 %포인트**. (지금 실업률의 3개월 평균) − (지난 12개월 중 그 3개월 평균의 최저점). 워크드 예시(설명용, 오늘 수치 아님): 저점 3.5%, 지금 4.1% → **0.6포인트** → 0.5 발동선 초과.\n- **침체 게이지** — **0~100** 요약치(높을수록 침체 위험 큼). 도구는 녹색, ~35 초과 시 황색, ~60 초과 시 적색으로 표시합니다.\n\n이 값들은 모두 도구가 계산합니다; 위 예시는 도구의 계산을 검산하고 정상 판독과 경고 판독이 어떻게 생겼는지 알기 위한 것일 뿐입니다.",
      },
    },
    {
      kind: "tool",
      title: { en: "Read the dashboard yourself", ko: "직접 대시보드를 읽어라" },
      body: {
        en: "Use the analyzer below. It computes and displays, from the FRED series:\n- the **yield-curve spread** (10yr − 3mo) and whether it's inverted,\n- **inflation YoY** and its direction,\n- the **Sahm recession indicator** vs its trigger,\n- an overall **recession gauge**, and\n- the **growth trend** (up or down) it reads from the data, used for the quadrant,\n- the **regime quadrant** (growth up/down × inflation up/down).\nEach readout has a unit — spread in percentage points, inflation and Sahm as percents/points, the gauge on its 0–100 scale (see the previous step for what normal vs. alarming looks like). Don't just read the summary verdict — note each raw number and which way it's moving. The direction of travel often matters more than the level.",
        ko: "아래 분석 도구를 사용하세요. FRED 시계열로부터 다음을 계산해 보여줍니다:\n- **장단기 금리차**(10년 − 3개월)와 역전 여부,\n- **인플레이션 YoY**와 방향,\n- **삼(Sahm) 침체 지표**와 발동 기준,\n- 종합 **침체 게이지**,\n- 데이터에서 읽어낸 **성장 추세**(상승/하락) — 사분면에 사용,\n- **국면 사분면**(성장 상/하 × 인플레이션 상/하).\n각 판독값에는 단위가 있습니다 — 금리차는 %포인트, 인플레이션·삼은 %/포인트, 게이지는 0~100 척도(정상 대 경고가 어떤 모습인지는 앞 단계 참고). 요약 결론만 읽지 말고 각 원시 숫자와 그 이동 방향을 메모하세요. 방향이 수준보다 더 중요할 때가 많습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — the yield curve: warning, not timer", ko: "1단계 — 수익률 곡선: 타이머가 아니라 경고" },
      body: {
        en: "Read the **spread** (10yr − 3mo) — the 10-year is the *long* rate, the 3-month is the *short* rate.\n- Positive (long rates above short) → normal, *expansionary* backdrop (expansionary = the economy is growing).\n- **Negative (inverted)** → historically a recession warning; it has preceded most US recessions.\nWorked example (illustrative): 10yr = 4.1%, 3mo = 4.6% → spread = **−0.5 points** → inverted.\n\nWhy would that warn of recession? Normally you demand *more* interest to lend for longer. The short rate closely tracks the rate the Fed sets directly; the long rate is roughly the market's average bet on where short rates will be over the next 10 years. So when long rates fall **below** short rates, the market is betting the Fed will **cut** soon because it expects growth to weaken (a *rate cut* = the Federal Reserve lowering the short-term interest rate it controls, which it does to stimulate a slowing economy).\n\nTwo honest caveats: the lag from inversion to recession has ranged from months to **over a year**, and it has given false-ish signals. It tells you risk is *elevated*, not *when*. Don't sell everything the day it inverts.",
        ko: "**금리차**(10년 − 3개월)를 읽으세요 — 10년물이 *장기* 금리, 3개월물이 *단기* 금리입니다.\n- 양(+)(장기 금리가 단기보다 높음) → 정상, *확장적* 배경(확장적 = 경제가 성장하고 있음).\n- **음(−)(역전)** → 역사적으로 침체 경고이며, 대부분의 미국 침체에 선행했습니다.\n워크드 예시(설명용): 10년물 = 4.1%, 3개월물 = 4.6% → 금리차 = **−0.5포인트** → 역전.\n\n왜 그것이 침체를 경고할까요? 보통은 더 오래 빌려줄수록 *더 많은* 이자를 요구합니다. 단기 금리는 연준이 직접 정하는 금리를 바짝 따라가고, 장기 금리는 향후 10년간 단기 금리가 어디쯤일지에 대한 시장의 평균 예상치에 가깝습니다. 그래서 장기 금리가 단기 금리 **아래로** 내려가면, 시장이 성장 둔화를 예상해 연준이 곧 **인하**하리라고 베팅하고 있다는 뜻입니다(*금리 인하* = 연준이 자기가 통제하는 단기 정책금리를 낮추는 것, 둔화되는 경기를 부양하려고 합니다).\n\n두 가지 정직한 주의: 역전에서 침체까지의 시차는 수개월에서 **1년 이상**까지 다양했고, 애매한 헛신호도 있었습니다. 위험이 *높아졌다*는 걸 알릴 뿐 *언제*인지는 아닙니다. 역전된 날 전부 팔지 마세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 2 — Sahm & the recession gauge: is it starting?", ko: "2단계 — 삼 지표와 침체 게이지: 시작됐는가?" },
      body: {
        en: "The yield curve warns early; the **Sahm indicator** flags a recession that's likely *already beginning*. It equals (the 3-month average unemployment rate now) minus (its **recent low** = the lowest 3-month average over the trailing 12 months). At **+0.50 point** it fires.\nWorked example (illustrative, not today's reading): over the past year the 3-month-average unemployment rate bottomed at 3.5% (the recent low); it's now 4.1% → a rise of **0.6 point** → above the 0.5 trigger → Sahm fires.\n- Below trigger → no recession-start signal yet.\n- At/above trigger → the labor market is deteriorating fast.\nThe **recession gauge** is a different thing: it's the tool's overall summary that blends the yield-curve reading and the Sahm rule (**not** inflation) into a single 0–100, higher-is-riskier number — so it can be elevated even before Sahm fires.\nCaveat: Sahm is a real-time rule of thumb built on **revisable** unemployment data, and its designer has warned it can misfire when the labor market is behaving unusually. Treat a fresh trigger as \"pay close attention,\" not \"it's confirmed.\"",
        ko: "수익률 곡선은 일찍 경고하고, **삼(Sahm) 지표**는 *이미 시작되고 있을* 가능성이 큰 침체를 알립니다. 삼 값 = (지금 실업률의 3개월 평균) − (**최근 저점** = 지난 12개월 중 그 3개월 평균의 최저점). **+0.50%포인트**에서 발동합니다.\n워크드 예시(설명용, 오늘 수치 아님): 지난 1년간 실업률 3개월 평균이 3.5%에서 바닥(최근 저점)을 찍고 지금 4.1% → **0.6%포인트** 상승 → 0.5 발동선 초과 → 삼 발동.\n- 기준 미만 → 아직 침체 시작 신호 없음.\n- 기준 이상 → 노동시장이 빠르게 악화.\n**침체 게이지**는 별개입니다: 수익률 곡선 판독과 삼 규칙을 하나로 합친(인플레이션은 **들어가지 않음**) 0~100 요약치(높을수록 위험 큼)입니다 — 그래서 삼이 발동하기 전에도 높아져 있을 수 있습니다.\n주의: 삼은 **수정 가능한** 실업 데이터에 기반한 실시간 경험칙이며, 고안자 본인이 노동시장이 이례적일 때 오작동할 수 있다고 경고했습니다. 새 발동은 \"확정\"이 아니라 \"주의 깊게 보라\"로 받아들이세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 3 — the quadrant: what tends to work where", ko: "3단계 — 사분면: 어디서 무엇이 통하는 경향" },
      body: {
        en: "The quadrant crosses **growth** direction with **inflation** direction. First, the terms:\n- **Goldilocks** = growth up, prices cooling — the best mix.\n- **Reflation** = growth *and* prices both picking up after a slump.\n- **Stagflation** = stalling growth *with* rising prices — the worst mix.\n- **Deflation / bust** = growth *and* prices both falling.\n- **Real assets** = things with physical/intrinsic value like commodities, gold, property. **Value stocks** = cheaper, established companies; **growth stocks** = fast-growing companies priced for the future. **Long-duration bonds** = bonds that pay back far in the future, whose price jumps most when rates fall (**duration** = how sensitive a bond's price is to interest-rate changes). **Inflation-linked bonds** = bonds whose payout automatically rises with inflation (in the US these are called *TIPS*), so they hold their real value when prices climb — which is why they help in stagflation.\n\nWhere does the tool get the **growth** reading? From the **unemployment trend**: falling unemployment over the last ~6 months = growth rising. (This is the *same* unemployment series the Sahm indicator uses in Step 2 — just read for direction: falling unemployment = growth rising here, while a sharp *rise* is what makes Sahm fire. One number, two lenses, always consistent: rising unemployment means both \"growth down\" here and, if it rises fast enough, \"Sahm fires\" there.) Inflation direction likewise = is YoY CPI higher than ~6 months ago? The classic framing is growth/inflation vs. market *expectations*; the tool approximates it with this realized 6-month momentum.\n\nRough historical tendencies (not laws), matching the tool's own labels:\n- **Goldilocks** (growth up, inflation down) → favors **stocks** (and bonds do fine too).\n- **Reflation** (growth up, inflation up) → **stocks + commodities**.\n- **Stagflation** (growth down, inflation up) → **commodities + inflation-linked bonds**.\n- **Deflation / bust** (growth down, inflation down) → **long government bonds, cash**.\nThese are tendencies over history, badly noisy in any single episode. The quadrant tells you *which way to tilt*, not to go all-in.",
        ko: "사분면은 **성장** 방향과 **인플레이션** 방향을 교차합니다. 먼저 용어부터:\n- **골디락스** = 성장은 오르고 물가는 식는, 가장 좋은 조합.\n- **리플레이션** = 침체 뒤 성장과 물가가 *함께* 살아나는 국면.\n- **스태그플레이션** = 성장은 정체되는데 물가는 *오르는*, 가장 고약한 조합.\n- **디플레이션 / 붕괴** = 성장도 물가도 *함께* 내려가는 국면.\n- **실물자산** = 원자재·금·부동산처럼 물리적·본질적 가치를 지닌 것. **가치주** = 싸고 안정적인 성숙 기업; **성장주** = 미래 성장에 값이 매겨진 빠르게 크는 기업. **장기채(long-duration bonds)** = 만기가 먼 채권으로, 금리가 내리면 가격이 가장 크게 오릅니다(**듀레이션** = 채권 가격이 금리 변화에 얼마나 민감한지). **물가연동채(inflation-linked bonds)** = 이자·원금이 인플레이션에 따라 자동으로 늘어나는 채권으로(미국에서는 *TIPS*라 부름), 물가가 오를 때 실질 가치를 지켜줍니다 — 그래서 스태그플레이션에서 도움이 됩니다.\n\n도구는 **성장** 판독을 어디서 얻을까요? **실업률 추세**에서: 지난 ~6개월간 실업률이 내려갔으면 성장 상승으로 봅니다. (이건 2단계에서 삼 지표가 쓰는 것과 *같은* 실업률 시계열입니다 — 방향만 다르게 읽을 뿐: 여기서는 실업률이 내려가면 성장 상승, 반대로 급하게 *오르면* 삼이 발동합니다. 하나의 숫자, 두 가지 관점이며 항상 일관됩니다: 실업률이 오르면 여기서는 \"성장 하락\"이고, 충분히 빠르게 오르면 저기서는 \"삼 발동\"입니다.) 인플레이션 방향도 마찬가지로 = YoY CPI가 ~6개월 전보다 높은가? 고전적 틀은 성장·인플레이션을 시장의 *예상*과 비교하는 것인데, 도구는 이 실현된 6개월 모멘텀으로 근사합니다.\n\n대략의 역사적 경향(법칙 아님), 도구의 라벨과 일치:\n- **골디락스**(성장 상, 인플레 하) → **주식**에 유리(채권도 무난).\n- **리플레이션**(성장 상, 인플레 상) → **주식 + 원자재**.\n- **스태그플레이션**(성장 하, 인플레 상) → **원자재 + 물가연동채**.\n- **디플레이션 / 붕괴**(성장 하, 인플레 하) → **장기 국채, 현금**.\n이는 역사에 걸친 경향이며 개별 국면에서는 잡음이 심합니다. 사분면은 *어느 쪽으로 기울일지*를 알려줄 뿐, 몰빵하라는 게 아닙니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Weigh the four readings together — do they agree or conflict? (A steep positive curve with a fired Sahm trigger, say, is a genuine contradiction worth naming — *steep* = a large positive gap, e.g. +2 points, the opposite of inverted.) Then state the regime the balance of evidence points to, and one concrete allocation tilt it implies. An **allocation** is how you split money across the asset classes (stocks/bonds/commodities/cash); a **tilt** is nudging that split a bit toward what the regime favors — a lean, not a lurch. Say what would have to change to flip your read.",
        ko: "네 판독을 함께 저울질하세요 — 일치하는가, 충돌하는가? (예컨대 가파른 양(+)의 곡선인데 삼 지표가 발동한 것은 짚어둘 만한 진짜 모순입니다 — *가파른 곡선* = 큰 양(+)의 금리차, 예: +2%포인트, 역전의 반대.) 그런 다음 증거의 균형이 가리키는 국면을 밝히고, 그것이 함의하는 구체적 자산배분 기울기 하나를 말하세요. **자산배분(allocation)**은 돈을 자산군(주식·채권·원자재·현금)에 나눠 담는 방식이고, **기울기(tilt)**는 국면이 유리하게 보는 쪽으로 그 배분을 살짝 기울이는 것입니다 — 급전환이 아니라 미세 조정. 무엇이 바뀌면 판독이 뒤집힐지도 적으세요.",
      },
      prompt: {
        en: "Which quadrant does the balance of evidence put us in? → My regime read is ___, so I'd tilt toward ___ and away from ___. This flips if ___ changes.",
        ko: "증거의 균형은 우리를 어느 사분면에 두는가? → 내 국면 판독은 ___, 그래서 ___로 기울이고 ___에서 줄이겠다. ___가 바뀌면 이 판독은 뒤집힌다.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Conclusion & next actions", ko: "결론 & 다음 행동" },
      body: {
        en: "You just read the macro backdrop the way a regime investor does — several probabilistic signals combined into a tilt, not a single indicator turned into a bet. That's the discipline: position for the environment, stay humble about timing. You should now be able to state, for each signal, one raw number and its unit (spread in points, inflation and Sahm in percent/points, the gauge on 0–100). Before acting, run this checklist.",
        ko: "방금 국면 투자자가 하듯 매크로 배경을 읽었습니다 — 단일 지표를 베팅으로 바꾸는 게 아니라, 여러 확률적 신호를 하나의 기울기로 결합. 그게 규율입니다: 환경에 맞게 포지션하고, 타이밍에 대해서는 겸손하게. 이제 각 신호에 대해 원시 숫자 하나와 그 단위를 말할 수 있어야 합니다(금리차는 포인트, 인플레이션·삼은 %/포인트, 게이지는 0~100). 행동 전에 이 체크리스트를 확인하세요.",
      },
      checklist: [
        { en: "I read each raw number AND its direction of travel, not just the dashboard's summary verdict.", ko: "대시보드의 요약 결론만이 아니라 각 원시 숫자와 그 이동 방향을 읽었다." },
        { en: "I combined all four signals and noted where they agree or conflict, instead of acting on one.", ko: "하나에 반응하지 않고 네 신호를 모두 결합해, 어디서 일치·충돌하는지 적었다." },
        { en: "I remembered these signals lag, flip back and forth (whipsaw), and rely on numbers that get revised later — a warning is not a timer.", ko: "이 신호들이 지연되고, 위아래로 번갈아 나오는 속임수 신호(whipsaw)를 내며, 나중에 수정되는 숫자에 기댄다는 걸 기억했다 — 경고는 타이머가 아니다." },
        { en: "My conclusion is a tilt (lean toward/away), not an all-in bet, and I named what would flip it.", ko: "내 결론은 몰빵 베팅이 아니라 기울기(늘림/줄임)이며, 무엇이 그것을 뒤집을지 명시했다." },
        { en: "This is my read of a probabilistic backdrop — a hypothesis to position around, not a recommendation or a market-timing signal.", ko: "이건 확률적 배경에 대한 나의 판독 — 포지션의 근거가 될 가설이지, 추천이나 마켓타이밍 신호가 아니다." },
      ],
    },
  ],
};

export const options: Walkthrough = {
  labId: "options",
  title: {
    en: "Should you write a covered call on this stock — and cap your upside?",
    ko: "이 주식에 커버드 콜을 써야 할까 — 그리고 상승 여력을 포기해도 될까?",
  },
  goal: {
    en: "By the end you'll have built an illustrative option chain, picked a strike, seen the premium income and the exact payoff, compared a buy-write strategy to just holding the index, and written down whether selling that call makes sense for your view.",
    ko: "끝까지 따라가면 예시용 옵션 체인을 만들고, 행사가를 고르고, 받는 프리미엄과 정확한 손익 구조를 확인하고, 커버드 콜(바이라이트) 전략을 지수 단순 보유와 비교한 뒤, 그 콜을 파는 것이 자신의 시각에 맞는지 적게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "First, what even is an option?", ko: "먼저, 옵션이란 게 뭘까요?" },
      body: {
        en: "Before any strategy, get these five words straight — the whole lab leans on them:\n- **Option** — a *contract*, a deal between two people, that trades on an exchange just like a stock.\n- **Call** — one kind of option. It gives its **buyer** the *right* (not the obligation) to **buy** a stock at a fixed price by a fixed date.\n- **Contract size** — one option contract almost always covers **100 shares** (the standard unit). That's why this whole lab talks in blocks of 100 shares, and why premiums quoted \"per share\" get multiplied by 100 for the real cash.\n- **Strike** = the fixed price the call lets its buyer pay; **expiry** = the fixed date the contract ends.\n- **Premium** — the cash the buyer pays the seller *up front* for this right.\nEveryday analogy: it's like a deposit that locks in a price — the buyer pays a fee today for the right to buy later at a set price. **In this lab, YOU are the SELLER of the call.** You already own the shares, so you can hand them over if the buyer asks — that is what makes your call \"covered.\"",
        ko: "어떤 전략에 들어가기 전에, 이 다섯 단어를 확실히 해둡시다. 랩 전체가 여기에 기대고 있습니다.\n- **옵션(option)** — 두 사람 사이의 거래인 *계약*으로, 주식처럼 거래소에서 사고팔립니다.\n- **콜(call)** — 옵션의 한 종류. **매수자**에게 정해진 가격에, 정해진 날짜까지 주식을 **살** *권리*(의무가 아님)를 줍니다.\n- **계약 단위(contract size)** — 옵션 계약 한 개는 거의 항상 **100주**를 담습니다(표준 단위). 이 랩이 내내 100주 단위로 이야기하는 이유이고, \"주당\"으로 표시된 프리미엄에 100을 곱해야 실제 현금이 되는 이유입니다.\n- **행사가(strike)** = 콜이 매수자에게 지불하도록 허용하는 정해진 가격, **만기(expiry)** = 계약이 끝나는 정해진 날짜.\n- **프리미엄(premium)** — 이 권리의 대가로 매수자가 매도자에게 *미리* 지불하는 현금.\n일상 비유: 가격을 잠가두는 예약금 같은 것입니다. 매수자는 나중에 정해진 가격에 살 권리를 얻으려고 오늘 수수료를 냅니다. **이 랩에서 여러분은 콜의 *매도자*입니다.** 이미 주식을 갖고 있어서 매수자가 요청하면 넘겨줄 수 있고, 그래서 여러분의 콜이 \"커버드(covered, 보유로 담보된)\"가 됩니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Frame the decision as three questions", ko: "결정을 세 가지 질문으로 정리합니다" },
      body: {
        en: "A covered call means you own 100 shares and **sell** someone the right to buy them from you at a fixed **strike** price (you are the seller of a call — see the previous step). You pocket the **premium** now; in exchange you give up any gain above the strike. Before touching the tool, hold three questions in your head:\n- **What's my view on the stock?** Covered calls fit a flat-to-mildly-bullish view (**bullish** = you expect the price to rise; **flat** = you expect it to roughly go sideways) — so this fits when you think the stock drifts up a little or stays put, not when you expect a big jump.\n- **Which strike, for how much premium?** A strike close to today's price pays more but caps you sooner; a far strike pays little but leaves room to run.\n- **Am I OK capping my upside?** If the stock doubles, you sold it away at the strike. Be honest about how that would feel.\n**Worked example of the cap:** you own 100 shares bought at $100. You sell a call with a $110 strike and collect, say, $2/share = $200 premium. If the stock climbs to $130 by expiry, the buyer *exercises* — uses their right to buy — so your shares are sold at $110, not $130. You made $10/share of price gain + $2 premium = **$12/share**. But you handed the buyer the **$20/share ($2,000)** of gain above the strike ($130 − $110). Sanity-check it against just holding: holding to $130 would have made $30/share, and $30 − $12 = **$18/share** more than the covered call — the $2 premium is what shrinks the $20 you gave up down to an $18 net shortfall. Either way, capping your upside has a cost.",
        ko: "커버드 콜은 주식 100주를 보유한 상태에서, 정해진 **행사가**에 그 주식을 사갈 권리를 남에게 **파는** 것입니다(여러분은 콜의 매도자입니다 — 앞 단계 참고). 지금 **프리미엄**을 챙기는 대신, 행사가 위쪽의 상승분은 포기합니다. 도구를 만지기 전에 세 가지 질문을 떠올려 두십시오.\n- **이 주식에 대한 내 시각은?** 커버드 콜은 횡보~약한 상승(**상승 시각(bullish)** = 가격이 오를 것으로 봄, **횡보(flat)** = 대체로 옆으로 갈 것으로 봄)을 볼 때 맞습니다. 주가가 조금 오르거나 제자리에 머물 것으로 볼 때 맞고, 큰 폭의 급등을 기대할 때는 아닙니다.\n- **어떤 행사가에, 얼마의 프리미엄?** 현재가에 가까운 행사가는 더 많이 받지만 더 빨리 상단이 막히고, 먼 행사가는 적게 받지만 오를 여지를 남깁니다.\n- **상승 여력을 포기해도 괜찮은가?** 주가가 두 배가 되면 행사가에 팔아넘긴 셈입니다. 그때 어떤 기분일지 솔직하게 상상해 보십시오.\n**상단 제한 예시:** $100에 산 100주를 보유합니다. 행사가 $110 콜을 팔아 예컨대 주당 $2 = $200 프리미엄을 받습니다. 만기까지 주가가 $130으로 오르면 매수자가 권리를 *행사합니다* — 살 권리를 씁니다 — 그래서 여러분의 주식은 $130이 아니라 $110에 팔립니다. 주당 $10의 가격 이익 + 프리미엄 $2 = **주당 $12**를 벌었습니다. 하지만 행사가 위쪽의 이익 **주당 $20($2,000)**($130 − $110)은 매수자에게 넘긴 셈입니다. 단순 보유와 대조해 확인해 보십시오. $130까지 보유했다면 주당 $30을 벌었을 테고, $30 − $12 = 커버드 콜보다 **주당 $18** 더 많습니다 — 프리미엄 $2가 여러분이 포기한 $20을 순 $18 부족으로 줄여준 것입니다. 어느 쪽이든 상승 여력을 막는 데는 대가가 따릅니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the numbers come from", ko: "숫자가 어디서 오는지" },
      body: {
        en: "Live option chains are licensed market data we can't redistribute in a lesson, so this lab **generates** an illustrative chain with the Black-Scholes model. The **Black-Scholes model** is a well-known formula that estimates a fair price for an option from a few inputs — today's stock price, the strike, how volatile the stock is, how long until expiry, and current interest rates. You set **implied volatility** (the market's estimate of how much the stock will swing, quoted as an annual percentage — e.g. 25% means fairly jumpy) and **days-to-expiry** (how many days until the contract ends); the model prices the calls.\n\nFor a reality check on whether selling calls actually helps, we compare against CBOE's BXM buy-write index. The **S&P 500** is an *index* — a single number that tracks a basket of the 500 largest U.S. companies, standing in for \"the U.S. stock market.\" **SPY** is the popular *ETF* (a fund you can buy like a stock) that simply holds the S&P 500. BXM applies exactly this covered-call strategy to the S&P 500, so it's a real track record to sanity-check against.",
        ko: "실시간 옵션 체인은 라이선스가 걸린 시장 데이터라 강의에서 재배포할 수 없습니다. 그래서 이 랩은 블랙-숄즈 모형으로 예시용 체인을 **생성**합니다. **블랙-숄즈 모형**은 몇 가지 입력값 — 오늘의 주가, 행사가, 주가가 얼마나 출렁이는지, 만기까지 남은 기간, 현재 금리 — 으로 옵션의 적정 가격을 추정하는 잘 알려진 공식입니다. 여러분이 **내재변동성**(주가가 얼마나 흔들릴지에 대한 시장의 추정치로, 연 단위 퍼센트로 표시 — 예: 25%면 꽤 출렁이는 편)과 **만기일수**(계약이 끝날 때까지 며칠 남았는지)를 정하면 모형이 콜 가격을 매깁니다.\n\n콜을 파는 것이 실제로 도움이 되는지 확인하기 위해 CBOE의 BXM 바이라이트 지수와 비교합니다. **S&P 500**은 *지수(index)* — 미국 대형사 500곳을 담은 바구니를 하나의 숫자로 추종해 \"미국 주식시장\"을 대표하는 지표입니다. **SPY**는 주식처럼 사고파는 *ETF*(펀드)로, S&P 500을 그대로 담는 인기 상품입니다. BXM은 이 커버드 콜 전략을 S&P 500에 그대로 적용하므로, 대조해 볼 실제 성과 기록이 됩니다.",
      },
      sources: [
        {
          name: { en: "Black-Scholes model (synthetic chain)", ko: "블랙-숄즈 모형 (합성 체인)" },
          what: { en: "The option prices in this lab, computed from spot price, strike, implied volatility, days-to-expiry, and a ~4% risk-free rate (risk-free rate = the interest you could earn with no risk, e.g. on short-term government debt; it nudges option prices slightly because money has a time value — a dollar today is worth more than a dollar at expiry).", ko: "이 랩의 옵션 가격. 현재가, 행사가, 내재변동성, 만기일수, 약 4% 무위험이자율로 계산합니다(무위험이자율 = 사실상 위험 없이 얻을 수 있는 이자로, 예컨대 단기 국채의 이자. 돈에는 시간 가치가 있어서 — 오늘의 1달러가 만기의 1달러보다 가치가 커서 — 옵션 가격을 조금 밀어 올리거나 내립니다)." },
          why: { en: "Real chains are licensed and can't be shared here. A synthetic chain is illustrative — the shapes and trade-offs are honest, but the exact prices are model output, not a live quote.", ko: "실제 체인은 라이선스가 걸려 여기서 공유할 수 없습니다. 합성 체인은 예시용입니다. 손익의 모양과 트레이드오프는 사실 그대로지만, 정확한 가격은 실시간 호가가 아니라 모형이 뱉은 값입니다." },
          url: "https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model",
        },
        {
          name: { en: "CBOE BXM Buy-Write Index", ko: "CBOE BXM 바이라이트 지수" },
          what: { en: "A published index that holds the S&P 500 and systematically writes at-the-money calls each month — the covered-call strategy as an index. \"Buy-write\" is just another name for a covered call (buy the shares, write = sell a call — the same strategy this lab teaches); \"at-the-money (ATM)\" means the strike is set right at the current stock price.", ko: "S&P 500을 보유하면서 매달 등가격(ATM) 콜을 체계적으로 매도하는 공표 지수. 커버드 콜 전략을 지수화한 것입니다. \"바이라이트(buy-write)\"는 커버드 콜의 다른 이름일 뿐이고(주식을 사고 콜을 write=매도 — 이 랩이 가르치는 바로 그 전략), \"등가격(at-the-money, ATM)\"은 행사가가 현재 주가와 거의 같은 상태를 말합니다." },
          why: { en: "It's the closest thing to a real-world track record for this exact strategy, so you can see how buy-write actually behaved vs plain SPY over years.", ko: "이 전략의 현실 세계 성과에 가장 가까운 기록이라, 바이라이트가 단순 SPY 대비 수년간 실제로 어떻게 움직였는지 볼 수 있습니다." },
          url: "https://www.cboe.com/us/indices/dashboard/bxm/",
          shot: CBOE_SHOT,
        },
      ],
    },
    {
      kind: "read",
      title: { en: "Reading a real option chain", ko: "진짜 옵션 체인 읽는 법" },
      body: {
        en: "Our tool shows a clean synthetic chain. A **real broker's chain** is a denser grid — for each **expiration** date it lists a row per **strike**, with columns you'll actually use:\n- **Bid** — the highest price a buyer will pay right now; **Ask** — the lowest price a seller will accept; **Last** — the price of the most recent trade (can be stale).\n- **IV** — implied volatility for that specific contract; **Delta** — roughly how much the option moves per $1 of stock (also a rough gauge of the odds it finishes in-the-money); **Volume** — contracts traded today; **Open Interest** — contracts still outstanding (both tell you how liquid it is).\n**The number that matters for you:** as a call **seller** you get filled near the **BID**, not the **mid** our tool displays. The mid sits between bid and ask, so your **real income is a bit lower** than the lab's premium. Before selling, check the **bid-ask spread is tight** (bid and ask close together) — a wide spread means poor liquidity and a worse fill; thin Volume/Open Interest is the usual culprit.\n**Placing it: Sell to Open (covered).** On a broker with options approval, pick the **underlying** → the **expiration** → the **strike**, choose the action **\"Sell to Open\"**, and set **quantity in CONTRACTS** (1 contract = 100 shares you already own — so 100 shares covers exactly 1). Review the **max gain / if-assigned** summary the broker shows, then submit as a **limit** order at or above the bid (never a naked market order — you control the price you accept).",
        ko: "우리 도구는 깔끔한 합성 체인을 보여줍니다. **진짜 증권사 체인**은 훨씬 빽빽한 표입니다 — 각 **만기(expiration)**마다 **행사가(strike)**별로 한 줄씩 있고, 실제로 쓰게 될 열들이 붙어 있습니다.\n- **Bid(매수호가)** — 지금 매수자가 내려는 가장 높은 가격; **Ask(매도호가)** — 매도자가 받으려는 가장 낮은 가격; **Last(체결가)** — 가장 최근 거래 가격(오래됐을 수 있음).\n- **IV(내재변동성)** — 그 특정 계약의 내재변동성; **Delta(델타)** — 주가 $1당 옵션이 대략 얼마나 움직이는지(내가격으로 끝날 확률의 대략적 지표이기도 함); **Volume(거래량)** — 오늘 거래된 계약 수; **Open Interest(미결제약정)** — 아직 남아 있는 계약 수(둘 다 유동성이 얼마나 좋은지 알려줌).\n**여러분에게 중요한 숫자:** 콜 **매도자**는 우리 도구가 보여주는 **중간값(mid)**이 아니라 **BID(매수호가)** 근처에서 체결됩니다. mid는 bid와 ask 사이에 있으므로, **실제 수입은 랩의 프리미엄보다 조금 낮습니다.** 팔기 전에 **매수-매도 호가 스프레드가 좁은지**(bid와 ask가 서로 가까운지) 확인하십시오 — 스프레드가 넓으면 유동성이 나쁘고 체결도 불리하며, 대개 얇은 Volume·Open Interest가 원인입니다.\n**주문 넣기: Sell to Open(매도 진입, 커버드).** 옵션 승인이 있는 증권사에서 **기초자산(underlying)** → **만기(expiration)** → **행사가(strike)**를 고르고, 주문 유형으로 **\"Sell to Open\"(매도 진입)**을 선택한 뒤, **수량을 계약(CONTRACTS) 단위**로 설정하십시오(1계약 = 이미 보유한 100주 — 그래서 100주면 딱 1계약을 커버합니다). 증권사가 보여주는 **최대 이익 / 배정 시(if-assigned)** 요약을 검토하고, **지정가(limit)** 주문으로 bid 이상에서 제출하십시오(절대 시장가로 던지지 마십시오 — 받아들일 가격은 여러분이 통제합니다).",
      },
    },
    {
      kind: "tool",
      title: { en: "Build the chain and write a call", ko: "체인을 만들고 콜을 매도해 봅니다" },
      body: {
        en: "An **option chain** is just the menu of available calls — a grid listing each strike price and what the call at that strike costs. \"Building the chain\" here means generating that menu. Run the analyzer below, in order (remember: to **write** a call just means to **sell** one):\n- Set **implied volatility** and **days-to-expiry** — watch how both push premiums up. They raise the premium for the same reason: more volatility or more time each give the stock a better chance of finishing above the strike, so the buyer will pay more for the right to buy it.\n- Pick a **strike** above today's price and read the **premium income** it pays.\n- Study the **payoff diagram**: it plots your profit (up/down axis) against the stock price at expiry (left/right axis). Below the strike your profit rises as the stock rises, PLUS you keep the premium; at the strike the line goes flat — that kink is the cap. Worked point (same $100 shares, $110 strike, $2 premium as before): end at $105 → $5 + $2 = **$7/share**; end at $110 → $10 + $2 = **$12/share**; end at $130 → STILL **$12/share**, because everything above the strike goes to the buyer. That flat line to the right is your capped upside.\n- Flip to the **BXM vs SPY** chart and note where buy-write won and where it lagged.\nDon't optimize yet — just get a feel for how strike, IV, and time move the premium and the payoff shape. (Tip: to reproduce a ~$2 premium on a $110 call over a $100 stock, set implied volatility around 40% and days-to-expiry around 45 — a far, cheaper strike pays little when volatility is calm.)",
        ko: "**옵션 체인(option chain)**은 살 수 있는 콜들의 메뉴일 뿐입니다. 각 행사가와 그 행사가 콜의 가격을 나열한 표입니다. 여기서 \"체인을 만든다\"는 그 메뉴를 생성한다는 뜻입니다. 아래 분석기를 순서대로 실행하십시오(기억하세요: 콜을 **write(매도)**한다는 건 콜을 **판다**는 뜻입니다).\n- **내재변동성**과 **만기일수**를 조정하며 둘 다 프리미엄을 어떻게 밀어 올리는지 보십시오. 둘이 프리미엄을 올리는 이유는 같습니다. 변동성이 크거나 시간이 많으면 주가가 행사가 위에서 끝날 확률이 높아지고, 그래서 매수자가 살 권리에 더 많이 내려 하기 때문입니다.\n- 현재가보다 높은 **행사가**를 하나 골라, 그때 받는 **프리미엄 수익**을 읽으십시오.\n- **손익 다이어그램**을 살펴보십시오. 만기 시 주가(가로축) 대비 여러분의 이익(세로축)을 그립니다. 행사가 아래에서는 주가와 함께 이익이 오르고, 여기에 프리미엄이 더해집니다. 행사가에서 선이 평평해지는데 그 꺾임이 상단 제한입니다. 계산 예시(앞과 같은 $100 주식, $110 행사가, $2 프리미엄): $105 종료 → $5 + $2 = **주당 $7**; $110 종료 → $10 + $2 = **주당 $12**; $130 종료 → 여전히 **주당 $12**, 행사가 위쪽은 모두 매수자 몫이기 때문입니다. 오른쪽의 그 평평한 선이 여러분의 막힌 상승 여력입니다.\n- **BXM vs SPY** 차트로 넘어가, 바이라이트가 이긴 구간과 뒤처진 구간을 확인하십시오.\n아직 최적화하지 마십시오. 행사가·변동성·시간이 프리미엄과 손익 모양을 어떻게 바꾸는지 감을 잡는 단계입니다. (팁: $100 주식의 $110 콜에서 약 $2 프리미엄을 재현하려면 내재변동성을 약 40%, 만기일수를 약 45일로 맞추십시오. 먼 행사가는 변동성이 잔잔할 때 아주 조금만 줍니다.)",
      },
    },
    {
      kind: "read",
      title: { en: "Read the premium — it's rent, with a catch", ko: "프리미엄을 읽습니다 — 이건 월세지만, 함정이 있습니다" },
      body: {
        en: "The premium is cash in your account today, no matter what the stock does. Think of it as **rent on shares you already own**. As a rough yardstick, people look at the premium as a percent of the stock price for the period — e.g. **1–2% per month** on a near strike can look juicy. **How the percentage works:** premium ÷ stock price. On a $100 stock, a $1.50 premium is 1.5% (1.50 ÷ 100), which on your 100-share contract is **$150 of cash**. That is what \"1–2% per month\" means in real money — and you can check the tool's percentage yourself by dividing the premium it shows by the stock price. (Heads up: the tool also shows an *annualized* version of this — premium ÷ price × 365 ÷ days — so for a short expiry that annualized stat reads higher than 1.5%. Don't be surprised.)\n\nBut rent isn't free money: you collected it by **selling your upside**. If the stock finishes below the strike at **expiry** — the day the contract ends; before then nothing is forced — you keep the shares and the premium, the good case. If it blows past the strike, your shares get **called away** (the buyer uses their right, so your 100 shares are automatically sold at the strike price) and you miss the rest of the move.",
        ko: "프리미엄은 주가가 어떻게 되든 오늘 계좌에 들어오는 현금입니다. 이미 보유한 **주식에서 받는 월세**라고 생각하십시오. 대략적인 잣대로, 사람들은 해당 기간의 주가 대비 프리미엄 비율을 보는데, 가까운 행사가에서 **월 1~2%**면 꽤 매력적으로 보입니다. **비율 계산법:** 프리미엄 ÷ 주가. $100 주식에서 $1.50 프리미엄은 1.5%(1.50 ÷ 100)이고, 100주 계약이면 **현금 $150**입니다. 그것이 \"월 1~2%\"를 실제 돈으로 옮긴 것이며, 도구가 보여주는 프리미엄을 주가로 나눠 도구의 퍼센트를 직접 확인할 수 있습니다. (참고: 도구는 이를 *연율화*한 값 — 프리미엄 ÷ 주가 × 365 ÷ 일수 — 도 함께 보여주므로, 만기가 짧으면 그 연율화 수치는 1.5%보다 높게 나옵니다. 놀라지 마십시오.)\n\n하지만 이 월세는 공짜가 아닙니다. **상승 여력을 팔아서** 받은 것입니다. **만기**(계약이 끝나는 날, 그 전에는 강제되는 것이 없음)에 주가가 행사가보다 낮으면 주식과 프리미엄을 모두 지키는 좋은 경우입니다. 하지만 행사가를 크게 뚫고 오르면 주식이 **콜어웨이**(매수자가 권리를 행사해 보유 100주가 행사가에 자동으로 팔려나가는 것)되고, 나머지 상승은 놓칩니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Higher IV pays more — but usually for a reason", ko: "높은 변동성은 더 주지만 — 대개 이유가 있습니다" },
      body: {
        en: "Crank implied volatility up and premiums balloon. Tempting — recall **IV** is the market's estimate of how wildly the stock will move (an annual % swing). It's usually high right before big known events — an **earnings report** (a company's quarterly announcement of how much it made, which can jolt the stock sharply) or an uncertain economic backdrop (rates, recession fears). So a fat premium is often **compensation for a fat risk** you're taking on the stock you hold. High IV cuts both ways: more income, but also a bumpier ride on the shares underneath. Don't read a rich premium as a free lunch — ask *why* it's rich.",
        ko: "내재변동성을 올리면 프리미엄이 부풀어 오릅니다. 솔깃하지만, **변동성(IV)**은 주가가 얼마나 크게 움직일지에 대한 시장의 추정치(연 단위 % 흔들림)임을 기억하십시오. IV는 대개 알려진 큰 이벤트 직전에 높습니다 — **실적 발표**(회사가 분기에 얼마를 벌었는지 알리는 것으로 주가를 크게 흔들 수 있음)나 불확실한 경제 상황(금리, 경기 침체 우려) 앞에서요. 그래서 두툼한 프리미엄은 여러분이 보유한 주식에 대해 **떠안는 두툼한 위험의 대가**인 경우가 많습니다. 높은 변동성은 양날의 검입니다. 수입은 늘지만, 밑에 깔린 주식의 움직임도 그만큼 거칩니다. 후한 프리미엄을 공짜 점심으로 읽지 말고, *왜* 후한지 물으십시오.",
      },
    },
    {
      kind: "read",
      title: { en: "What a covered call does — and doesn't — do", ko: "커버드 콜이 하는 일 — 그리고 못 하는 일" },
      body: {
        en: "Be clear on the trade you're making:\n- **It smooths your returns and generates income** — the premium cushions small drops and calms the bumpiness of your portfolio's value over time. (Note this is a *different* sense of \"volatility\" than the IV input: here it means how much your portfolio's value jumps around, which steady premium income settles down.) That's why BXM is usually calmer than SPY.\n- **It caps your gains** — above the strike, you don't participate. In a roaring bull market, buy-write lags badly.\n- **It barely protects the downside** — the premium is a thin cushion. If the stock falls 30%, a 2% premium won't save you. A covered call is *not* a **hedge** (a hedge = a separate position bought specifically to offset losses, like insurance). If you want real downside protection you'd instead **buy a put** — a different option that gives you the right to *sell* your shares at a set price, so it pays off when the stock falls.",
        ko: "지금 하는 거래를 분명히 해두십시오.\n- **수익률을 매끄럽게 하고 수입을 만듭니다** — 프리미엄이 작은 하락을 완충하고, 시간이 지나며 포트폴리오 가치가 출렁이는 정도를 진정시킵니다. (이것은 IV 입력값과는 *다른* 의미의 \"변동성\"입니다. 여기서는 여러분 포트폴리오 가치가 얼마나 요동치느냐를 뜻하고, 꾸준한 프리미엄 수입이 그것을 가라앉힙니다.) BXM이 대개 SPY보다 잔잔한 이유입니다.\n- **상승 이익을 제한합니다** — 행사가 위로는 참여하지 못합니다. 강한 상승장에서 바이라이트는 크게 뒤처집니다.\n- **하락은 거의 방어하지 못합니다** — 프리미엄은 얇은 완충일 뿐입니다. 주가가 30% 빠지면 2% 프리미엄으로는 못 막습니다. 커버드 콜은 **헤지(hedge)**가 *아닙니다*(헤지 = 손실을 상쇄하려고 따로 잡는 포지션, 보험 같은 것). 진짜 하락 방어가 필요하면 대신 **풋(put)을 매수**합니다 — 정해진 가격에 주식을 *팔* 권리를 주는 다른 옵션으로, 주가가 떨어질 때 이익이 납니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Picking the strike, and managing it after", ko: "행사가 고르기, 그리고 그 뒤 관리하기" },
      body: {
        en: "Opening the trade is half the skill; **choosing which strike and managing it afterward** is the other half — this is what separates \"I sold one call once\" from running the strategy.\n\n**Pick the strike by delta, not by gut.** On a real chain each call shows a **delta** — for a call it runs 0 to 1, and it doubles as a rough probability the option finishes in-the-money (i.e. gets assigned). Common covered-call practice:\n- **~0.30 delta** (further out-of-the-money) → roughly a 30% chance of assignment: smaller premium, but you keep more upside and are less likely to have your shares called away. A popular default.\n- **~0.40–0.50 delta** (closer to the money) → more premium, but a much higher chance you're capped and assigned. Choose this only if you're happy to sell at that strike.\nSo delta lets you *dial* the trade: how much income you want vs. how much upside you're willing to risk losing.\n\n**Then manage the open call — you have three moves as expiry nears:**\n- **Let it expire worthless** (stock below strike) — you keep the shares AND the whole premium. The goal case; sell another call next cycle.\n- **Let it get assigned** (stock above strike) — your 100 shares are sold at the strike. Fine *if* you were happy to sell there; you keep premium + gains up to the strike.\n- **Roll it** — if you want to KEEP the shares but the call is now in-the-money, you **buy-to-close** the current call (pay to cancel your obligation) and **sell-to-open** a later-dated (and often higher-strike) call, usually for a net credit. Rolling \"up and out\" defers assignment and raises the cap, at the cost of tying the position up longer.\nRule of thumb: never sell a call at a strike you'd be unhappy to sell your shares at — because assignment is exactly what you signed up for.",
        ko: "거래를 여는 것은 기술의 절반이고, **어떤 행사가를 고르고 그 뒤에 관리하느냐**가 나머지 절반입니다 — 이것이 \"콜 한 번 팔아봤다\"와 \"전략을 굴린다\"를 가릅니다.\n\n**행사가는 감이 아니라 델타로 고릅니다.** 실제 체인에서 각 콜에는 **델타(delta)**가 표시되는데 — 콜의 경우 0에서 1 사이이고, 옵션이 내가격으로 끝날(즉 배정될) 대략적인 확률로도 읽힙니다. 흔한 커버드 콜 방식:\n- **델타 약 0.30**(더 외가격) → 배정 확률 약 30%: 프리미엄은 적지만 상승 여력을 더 지키고 주식이 넘어갈 가능성이 낮습니다. 널리 쓰는 기본값.\n- **델타 약 0.40~0.50**(등가격에 가까움) → 프리미엄은 많지만 상단이 막히고 배정될 확률이 훨씬 높습니다. 그 행사가에 팔아도 좋을 때만 고르세요.\n즉 델타로 거래를 *조절*합니다: 수입을 얼마나 원하는가 대 상승 여력을 얼마나 잃을 위험을 감수하는가.\n\n**그다음 열린 콜을 관리합니다 — 만기가 다가올 때 선택지는 셋입니다:**\n- **그냥 소멸시키기**(주가가 행사가 아래) — 주식과 프리미엄을 모두 지킵니다. 목표 상황이며, 다음 사이클에 콜을 또 팝니다.\n- **배정되게 두기**(주가가 행사가 위) — 100주가 행사가에 팔립니다. 그 가격에 팔아도 좋았다면 괜찮고, 프리미엄 + 행사가까지의 이익을 챙깁니다.\n- **롤링(roll)** — 주식을 **계속 보유**하고 싶은데 콜이 내가격이 됐다면, 현재 콜을 **바이투클로즈(buy-to-close)**로 되사서(의무를 취소) 더 늦은 만기(그리고 대개 더 높은 행사가)의 콜을 **셀투오픈(sell-to-open)**합니다 — 보통 순(net) 크레딧을 받으며. \"위로 그리고 뒤로(up and out)\" 롤링은 배정을 미루고 상단을 높이지만, 포지션이 더 오래 묶입니다.\n경험칙: 주식을 팔아도 아깝지 않을 행사가가 아니면 콜을 팔지 마세요 — 배정은 바로 여러분이 감수하기로 한 것이기 때문입니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Make the call — literally", ko: "결론을 내립니다 — 말 그대로" },
      body: {
        en: "Pin down one specific covered call and decide whether you'd actually place it. Tip: to fill the \"__% for __ days\" blank, take the premium ÷ stock price (that's the % for the period shown), using the days-to-expiry you set — same math as the rent example.",
        ko: "구체적인 커버드 콜 하나를 정하고, 실제로 그 주문을 낼지 결정하십시오. 팁: \"__일간 __%\" 빈칸은 프리미엄 ÷ 주가(그것이 표시된 기간의 %)로 채우되, 여러분이 설정한 만기일수를 쓰십시오. 월세 예시와 같은 계산입니다.",
      },
      prompt: {
        en: "Write it down: \"I'd write the strike **$X** call for **$Y** premium (about __% for __ days) because my view on the stock is ______. I'm OK capping my upside at $X because ______. If it rips past $X I will feel ______, and if it drops 20% the premium (won't / barely will) help.\" If any blank makes you wince, that's your answer.",
        ko: "이렇게 적어 보십시오. \"나는 행사가 **$X** 콜을 프리미엄 **$Y**(약 __일간 __%)에 매도하겠다. 이 주식에 대한 내 시각이 ______이기 때문이다. $X에서 상승이 막혀도 괜찮은 이유는 ______이다. 만약 $X를 크게 뚫고 오르면 나는 ______하게 느낄 것이고, 20% 하락하면 프리미엄은 (도움이 안 된다 / 거의 안 된다).\" 빈칸 하나라도 채우다 움찔했다면, 그게 답입니다.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Your covered-call thesis", ko: "당신의 커버드 콜 결론" },
      body: {
        en: "You've priced a call, seen the payoff, and weighed income against a capped upside. A covered call earns its keep in flat-to-mildly-up markets and hurts when you're wrong and the stock soars. Keep the receipts below.",
        ko: "콜 가격을 매기고, 손익 구조를 보고, 수입과 상단이 막히는 대가를 저울질했습니다. 커버드 콜은 횡보~약한 상승장에서 값을 하고, 예상이 틀려 주가가 급등할 때 아픕니다. 아래 항목을 기록으로 남기십시오.",
      },
      checklist: [
        { en: "Stated my view on the stock (flat / mildly up / could rip) and matched the strike to it.", ko: "주식에 대한 내 시각(횡보 / 약한 상승 / 급등 가능)을 밝히고, 행사가를 거기에 맞췄다." },
        { en: "Wrote down the premium as a % per period (premium ÷ stock price) and judged whether it's worth the capped upside.", ko: "프리미엄을 기간당 %(프리미엄 ÷ 주가)로 적고, 상단이 막히는 대가에 값하는지 판단했다." },
        { en: "Checked whether high IV means the premium is pricing in a known risk (earnings, event).", ko: "높은 변동성이 알려진 위험(실적, 이벤트)을 반영한 프리미엄인지 확인했다." },
        { en: "Acknowledged this caps upside and barely protects downside — it's income, not a hedge.", ko: "이것이 상승을 제한하고 하락은 거의 방어하지 못한다는 점을 인정했다 — 헤지가 아니라 수입이다." },
        { en: "This is a hypothesis about one call, not a recommendation to trade options — and prices here are synthetic.", ko: "이것은 콜 하나에 대한 가설이지, 옵션 거래 추천이 아니며, 여기 가격은 합성 값이다." },
      ],
    },
  ],
};

export const factor: Walkthrough = {
  labId: "factor",
  title: {
    en: "Does this ETF actually deliver the factor tilt it advertises?",
    ko: "이 ETF는 광고하는 팩터 성향을 정말로 제공하고 있을까?",
  },
  goal: {
    en: "By the end you'll have regressed a factor ETF's returns on the Fama-French factors, read its alpha, factor betas, and R², and decided whether it gives you the cheap, clean exposure you actually want.",
    ko: "끝까지 따라가면 팩터 ETF의 수익률을 파마-프렌치 팩터에 회귀분석하고, 알파·팩터 베타·R²을 읽은 뒤, 그 ETF가 원하는 저비용의 깔끔한 노출을 실제로 주는지 판단하게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "First, the words we'll keep using", ko: "먼저, 계속 쓸 용어들" },
      body: {
        en: "This lab leans on a handful of terms. Read them once here, in plain language, and the rest of the flow will make sense:\n- **Factor** — a shared trait of stocks that has historically earned a bit of extra long-run return. Think of factors as the few big ingredients (flour, sugar) most of a stock's return is baked from.\n- The **five common factors**, one line each: **value** = cheap stocks (low price relative to profits, or to *book value* — the company's net worth on paper, i.e. what it owns minus what it owes — like buying on sale); **size** = smaller companies rather than giants; **momentum** = stocks that have been rising lately; **quality** = profitable, financially sound companies; **low-volatility** = calmer, less bouncy stocks.\n- **Return premium** — the extra return you historically earned for holding that trait, *above* the plain market. It's the payoff the factor is supposed to deliver.\n- **Tilt = loading = exposure** — three words for the *same* thing: how much of a given factor the fund carries. We'll use them interchangeably, so treat them as synonyms.\n- **Beta** (preview) — a number saying how strongly the fund moves with something (a factor, or the whole market). Full definition later.\n- **Alpha** (preview) — the leftover return *not* explained by the factors. Full definition later.\n- **R²** (preview) — how much of the fund's ups and downs the factors explain, on a 0-to-1 scale. Full definition later.",
        ko: "이 랩은 몇 개의 용어에 기댑니다. 여기서 쉬운 말로 한 번 읽어두면 나머지 흐름이 이해됩니다.\n- **팩터** — 주식들이 공유하는 특성으로, 역사적으로 장기 초과수익을 조금 더 벌어온 것입니다. 팩터는 주식 수익의 대부분이 구워져 나오는 몇 안 되는 큰 재료(밀가루, 설탕)라고 생각하십시오.\n- **다섯 가지 흔한 팩터**를 한 줄씩: **가치** = 싼 주식(이익, 또는 *장부가치*(장부상 순자산 — 가진 것에서 빚을 뺀 값)에 비해 가격이 낮음 — 세일 중인 주식을 사는 것); **규모(사이즈)** = 거대 기업보다 작은 회사; **모멘텀** = 최근 오르고 있던 주식; **퀄리티** = 수익성 좋고 재무가 탄탄한 우량 기업; **저변동성** = 덜 출렁이는 잔잔한 주식.\n- **수익 프리미엄** — 그 특성을 보유한 대가로, 시장 평균 *위에* 역사적으로 더 받은 수익입니다. 팩터가 주기로 되어 있는 보상이죠.\n- **성향 = 로딩 = 노출** — 셋 다 *같은* 뜻입니다: 펀드가 특정 팩터를 얼마나 담고 있는지. 서로 바꿔 쓸 것이니 동의어로 여기십시오.\n- **베타**(예고) — 펀드가 무언가(팩터, 또는 시장 전체)를 따라 얼마나 세게 움직이는지 나타내는 숫자. 자세한 정의는 뒤에서.\n- **알파**(예고) — 팩터로 설명되지 *않는* 나머지 수익. 자세한 정의는 뒤에서.\n- **R²**(예고) — 펀드의 등락 중 팩터가 설명하는 비중을 0에서 1 사이로 나타낸 것. 자세한 정의는 뒤에서.",
      },
    },
    {
      kind: "read",
      title: { en: "Frame the decision as three questions", ko: "결정을 세 가지 질문으로 정리합니다" },
      body: {
        en: "\"Factor investing\" means deliberately tilting toward the return-earning traits we just defined — **value, size, momentum, quality, low-volatility** — rather than just buying the whole market. An ETF sells you a label (\"value fund\"); a regression checks whether it walks the walk. Hold three questions:\n- **Does it load on the factor it claims?** A value ETF should show a positive tilt to the value factor, not a token one.\n- **How much of its return is just factor beta vs true skill (alpha)?** Beta here is cheap exposure you could buy almost anywhere; alpha is return from genuine skill, *not* just factor exposure. Most factor returns turn out to be beta.\n- **Do the factors explain it (R²), or is there a hidden bet?** Low R² means something else is driving returns.\n\n**One honest heads-up before we start.** The classic tool we'll use measures only **three** of those five factors — **market, size, and value**. Momentum, quality, and low-volatility came later and aren't in it. So the first question is answerable *directly* only for value/size funds; for a momentum, quality, or low-vol fund the tool can't show you the tilt you'd hope to see — and that *absence* is itself the finding. We'll spell out exactly how to read that when we get there.",
        ko: "\"팩터 투자\"란 시장 전체를 사는 대신, 방금 정의한 수익을 버는 특성들 — **가치, 규모, 모멘텀, 퀄리티, 저변동성** — 쪽으로 의도적으로 기울이는 것입니다. ETF는 라벨(\"가치 펀드\")을 팔지만, 회귀분석은 그 말대로 행동하는지 확인합니다. 세 가지 질문을 떠올리십시오.\n- **주장하는 팩터에 실제로 실려 있는가?** 가치 ETF라면 가치 팩터에 형식적이 아니라 뚜렷하게 양(+)의 성향을 보여야 합니다.\n- **수익 중 얼마가 단순 팩터 베타이고, 얼마가 진짜 실력(알파)인가?** 여기서 베타는 어디서나 싸게 살 수 있는 노출이고, 알파는 단순한 팩터 노출이 *아니라* 진짜 실력에서 나오는 수익입니다. 대부분의 팩터 수익은 알고 보면 베타입니다.\n- **팩터로 설명되는가(R²), 아니면 숨은 베팅이 있는가?** R²이 낮으면 다른 무언가가 수익을 움직이고 있는 것입니다.\n\n**시작 전 솔직한 예고 하나.** 우리가 쓸 고전적 도구는 다섯 팩터 중 **셋** — **시장·규모·가치** — 만 측정합니다. 모멘텀·퀄리티·저변동성은 나중에 나온 것이라 여기 없습니다. 그래서 첫 질문은 가치·규모 펀드에만 *곧바로* 답할 수 있고, 모멘텀·퀄리티·저변동성 펀드는 도구가 기대하는 성향을 보여주지 못합니다 — 그리고 그 *부재* 자체가 발견입니다. 그것을 어떻게 읽는지는 해당 단계에서 정확히 설명합니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the numbers come from", ko: "숫자가 어디서 오는지" },
      body: {
        en: "The regression needs two ingredients: the factors' monthly returns, and the ETF's monthly returns. Here's what each input actually *is*:\n- A \"factor\" here is itself a **return series** — a track record of monthly gains and losses — built from a two-sided portfolio: it **buys** one basket of stocks and **short-sells** the opposite basket. (\"Short-selling\" is finance shorthand for *betting a stock falls* — you sell shares you don't own, hoping to buy them back cheaper; you can ignore the mechanics, just read it as \"bets against.\") The factor's return each month is *how much the bought basket beat the sold one*.\n- **SMB** (Small-Minus-Big = size) buys small companies and bets against big ones — so a positive SMB month means small-caps beat large-caps. **HML** (High-Minus-Low = value) buys cheap stocks and bets against expensive ones — a positive HML month means value beat growth. (\"High\" and \"Low\" refer to a cheapness ratio explained in the next bullet.) **Market** is the whole stock market's return minus the risk-free rate.\n- What makes a stock \"cheap\"? A common yardstick is **book-to-market**: the company's **book value** (its net worth on paper — everything it owns minus everything it owes, straight off the balance sheet) divided by its **market value** (what the stock market prices it at). A *high* book-to-market means you're paying little market price per dollar of on-paper net worth — that's \"cheap\" (a \"value\" stock). A *low* ratio means you're paying up (a \"growth\" stock). So HML = High-minus-Low = cheap-minus-expensive.\n- **Excess return** = a return *minus the risk-free rate* — i.e. how much better than doing nothing risky. The **risk-free rate** is roughly the yield on safe short-term government bills (T-bills).\n- **Fama-French** just names the two researchers (Eugene Fama, Kenneth French) whose standard recipe for these factors everyone uses.\nThe factor series come straight from Kenneth French's data library; the ETF's returns come from Yahoo Finance price history. We regress the ETF's monthly excess returns on the three factors.",
        ko: "회귀분석에는 두 재료가 필요합니다: 팩터들의 월별 수익률과 ETF의 월별 수익률. 각 입력이 실제로 *무엇인지* 봅시다.\n- 여기서 \"팩터\"는 그 자체가 **수익률 시계열** — 월별 이익과 손실의 기록 — 이며, 양쪽으로 짜인 포트폴리오에서 나옵니다: 한 바구니의 주식을 **사고**, 반대편 바구니를 **공매도**합니다. (\"공매도\"는 *주식이 떨어질 것에 베팅*하는 금융 용어입니다 — 갖고 있지 않은 주식을 팔았다가 더 싸게 되사길 노리는 것인데, 구체적 방식은 몰라도 되고 그냥 \"반대로 베팅한다\"로 읽으면 됩니다.) 팩터의 그달 수익은 *산 바구니가 판 바구니를 얼마나 이겼는가*입니다.\n- **SMB**(Small-Minus-Big = 규모)는 작은 회사를 사고 큰 회사에 반대로 베팅합니다 — SMB가 플러스인 달은 소형주가 대형주를 이긴 달입니다. **HML**(High-Minus-Low = 가치)은 싼 주식을 사고 비싼 주식에 반대로 베팅합니다 — HML이 플러스인 달은 가치주가 성장주를 이긴 달입니다. (\"High\"와 \"Low\"는 다음 항목에서 설명하는 저렴함 비율을 가리킵니다.) **시장(Market)**은 주식시장 전체 수익에서 무위험이자율을 뺀 것입니다.\n- 무엇이 주식을 \"싸게\" 만들까요? 흔한 잣대가 **장부/시가 비율(book-to-market)**입니다: 회사의 **장부가치**(장부상 순자산 — 가진 것 전부에서 빚 전부를 뺀 값으로, 대차대조표에 바로 나옵니다)를 **시가총액**(주식시장이 매긴 값)으로 나눈 것입니다. 이 비율이 *높으면* 장부상 순자산 1달러당 치르는 시장 가격이 적다는 뜻 — 즉 \"싸다\"(가치주)입니다. *낮으면* 비싸게 주고 사는 것(성장주)입니다. 그래서 HML = High에서 Low를 뺌 = 싼 것에서 비싼 것을 뺌입니다.\n- **초과수익** = 수익 *에서 무위험이자율을 뺀 것* — 즉 위험 없이 가만히 있는 것보다 얼마나 나았는가입니다. **무위험이자율**은 안전한 단기 국채(단기 국공채)가 준 이자 정도입니다.\n- **파마-프렌치**는 그저 이 팩터들의 표준 레시피를 만들어 모두가 쓰는 두 연구자(유진 파마, 케네스 프렌치)의 이름입니다.\n팩터 시계열은 케네스 프렌치 데이터 라이브러리에서 곧바로, ETF 수익률은 야후 파이낸스 가격 이력에서 옵니다. ETF의 월별 초과수익률을 이 세 팩터에 회귀분석합니다.",
      },
      sources: [
        {
          name: { en: "Kenneth French Data Library (Dartmouth)", ko: "케네스 프렌치 데이터 라이브러리 (다트머스)" },
          what: { en: "The Fama-French 3-factor monthly return series: Market, SMB (size), HML (value), plus the risk-free rate.", ko: "파마-프렌치 3팩터 월별 수익률 시계열: 시장, SMB(규모), HML(가치), 그리고 무위험이자율." },
          why: { en: "It's the canonical, academic definition of the factors — the same data the original research and thousands of papers use, so your betas mean what the textbook says.", ko: "팩터의 정통 학술적 정의입니다. 원 논문과 수천 편의 연구가 쓰는 바로 그 데이터라, 여러분의 베타가 교과서가 말하는 의미 그대로가 됩니다." },
          url: "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html",
          shot: FRENCH_SHOT,
        },
        {
          name: { en: "Yahoo Finance (ETF prices)", ko: "야후 파이낸스 (ETF 가격)" },
          what: { en: "Monthly adjusted-close price history for the ETF (VTV, MTUM, QUAL, USMV, VLUE), turned into returns. The ETF's expense ratio (its annual fee) is also listed here on its fund Profile/Summary page.", ko: "ETF(VTV, MTUM, QUAL, USMV, VLUE)의 월별 수정종가 이력. 이것을 수익률로 변환합니다. ETF의 총보수(연간 수수료)도 이곳 펀드 프로필/summary 페이지에 표시됩니다." },
          why: { en: "It's free, adjusts for dividends and splits, and covers the whole ETF history — plenty for a monthly regression.", ko: "무료이고, 배당과 액면분할을 반영하며, ETF의 전체 이력을 담습니다. 월별 회귀에는 충분합니다." },
          url: "https://finance.yahoo.com/",
          shot: YAHOO_SHOT,
        },
        {
          name: { en: "ETF fact sheet / fund page (expense ratio)", ko: "ETF 설명서 / 펀드 페이지 (총보수)" },
          what: { en: "The expense ratio — the yearly % fee the fund quietly deducts from your return. VTV ≈ 0.03-0.04%/yr; the iShares factor funds (MTUM, QUAL, USMV, VLUE) ≈ 0.15%/yr. Labeled \"Expense ratio\" (KO 총보수).", ko: "총보수 — 펀드가 매년 수익에서 조용히 떼어가는 연간 % 수수료. VTV는 연 약 0.03-0.04%, iShares 팩터 펀드들(MTUM·QUAL·USMV·VLUE)은 연 약 0.15%. \"Expense ratio\"(총보수)로 표기됩니다." },
          why: { en: "You'll need it in the final decision. It's on the issuer's product page — Vanguard for VTV, iShares/BlackRock for the rest — or the fund's Yahoo profile.", ko: "마지막 판단에 필요합니다. 발행사 상품 페이지(VTV는 뱅가드, 나머지는 iShares) 또는 펀드의 야후 프로필에서 확인합니다." },
          url: "https://www.ishares.com/us",
        },
      ],
    },
    {
      kind: "read",
      title: { en: "Run it yourself on real data (no tool needed)", ko: "실제 데이터로 직접 돌리기 (도구 없이)" },
      body: {
        en: "Our analyzer is just a shortcut. Once you've downloaded the two ingredients above, you can run the exact same 3-factor regression in Excel or Google Sheets — no code:\n- **Lay the months out in rows** — one row per month, all series lined up on the same dates.\n- **Columns X = the three factors: Mkt-RF, SMB, HML** — copy them straight from the Fama-French CSV (they're already what you need; see the gotchas below).\n- **Column Y = your fund's excess return = the fund's monthly return − RF** — turn the Yahoo prices into monthly returns first (formula below), then subtract that month's RF (the last column of the FF CSV).\n- **Run one formula:** `=LINEST(Y-range, X-range, TRUE, TRUE)` — select a 5-row × 4-column block, type it, press Ctrl+Shift+Enter (Sheets: just Enter). Or use **Data ▸ Data Analysis ▸ Regression** in Excel's Analysis ToolPak.\n- **Read the output — mind the order:** the top row is your three factor betas plus alpha, but **`LINEST` prints the coefficients RIGHT-TO-LEFT, in the reverse of your X columns.** With X laid out as Mkt-RF, SMB, HML, the top row reads **HML beta, then SMB beta, then Mkt-RF beta, then the intercept (monthly alpha)** — left to right. (The Data-Analysis ▸ Regression tool instead labels each coefficient by name, so if the reversal trips you up, use that.) HML = value tilt, SMB = size tilt, Mkt-RF = market beta; multiply alpha by 12 for the annual figure.\n\nTurn Yahoo **Adj Close** into a monthly return like this: **thisMonthAdjClose ÷ lastMonthAdjClose − 1** (use Adj Close, not Close — it already folds in dividends and splits).\n\nFive gotchas that quietly wreck the numbers:\n- **`LINEST` reverses the coefficient order** (see above) — read them right-to-left, or you'll pin the value tilt on the market and vice-versa. This is the single most common way a by-hand factor regression goes wrong.\n- **FF values are percent-per-period** — a 0.53 in the CSV means 0.53%, i.e. 0.0053. Keep your Y in the *same* unit (if the factors are in %, put your fund return in % too), or your betas will be right but alpha's scale will be off.\n- **The factors are already excess** — Mkt-RF, SMB, HML already have the risk-free rate handled, so **don't subtract RF from them**. You only subtract RF from *your fund's* return to build column Y.\n- **-99.99 (or -999) = missing data** — Fama-French uses it as a placeholder for months with no value. **Drop those rows** before regressing, or one bad cell poisons every coefficient.\n- **The dates must line up exactly** — your fund's month and the factor row for that same month must sit on the same spreadsheet row. A single month of offset (e.g. the FF file starts in a different month than your price history) silently shifts every pairing and **corrupts every beta with no error message**. Before regressing, eyeball that row 1 of both is the same year-month, and that the two columns end on the same month too.",
        ko: "우리 분석기는 지름길일 뿐입니다. 위의 두 재료를 내려받았다면, 똑같은 3팩터 회귀를 엑셀이나 구글 시트에서 직접 돌릴 수 있습니다 — 코드 없이:\n- **월(月)을 행으로 나열하세요** — 한 달에 한 행, 모든 시계열을 같은 날짜에 맞춰 정렬합니다.\n- **X 열 = 세 팩터: Mkt-RF, SMB, HML** — 파마-프렌치(FF) CSV에서 그대로 복사합니다(이미 필요한 형태입니다 — 아래 함정 참고).\n- **Y 열 = 당신 펀드의 초과수익 = 펀드 월 수익률 − RF** — 먼저 야후 가격을 월별 수익률로 바꾼 뒤(아래 공식), 그 달의 RF(FF CSV의 마지막 열)를 뺍니다.\n- **공식 하나를 실행:** `=LINEST(Y범위, X범위, TRUE, TRUE)` — 5행 × 4열 블록을 선택하고 입력한 뒤 Ctrl+Shift+Enter(구글 시트는 그냥 Enter). 또는 엑셀 분석 도구(Analysis ToolPak)의 **데이터 ▸ 데이터 분석 ▸ 회귀 분석**을 씁니다.\n- **결과 읽기 — 순서 주의:** 맨 윗줄이 세 팩터 베타와 알파인데, **`LINEST`는 계수를 X 열과 반대인 오른쪽→왼쪽 순서로 출력합니다.** X를 Mkt-RF, SMB, HML 순으로 놓았다면 맨 윗줄은 왼쪽부터 **HML 베타, SMB 베타, Mkt-RF 베타, 그리고 절편(월별 알파)** 순으로 읽힙니다. (반면 **데이터 분석 ▸ 회귀 분석** 도구는 각 계수에 이름을 붙여 주니, 뒤집힌 순서가 헷갈리면 그쪽을 쓰세요.) HML = 가치 성향, SMB = 규모 성향, Mkt-RF = 시장 베타; 알파에 12를 곱하면 연 단위 값입니다.\n\n야후 **수정종가(Adj Close)**를 월별 수익률로 바꾸는 법: **이번달수정종가 ÷ 지난달수정종가 − 1** (Close가 아니라 Adj Close를 쓰세요 — 배당과 액면분할이 이미 반영돼 있습니다).\n\n숫자를 조용히 망가뜨리는 함정 다섯 가지:\n- **`LINEST`는 계수 순서를 뒤집습니다**(위 참고) — 오른쪽→왼쪽으로 읽으세요. 안 그러면 가치 성향을 시장 베타 자리에, 시장 베타를 가치 자리에 잘못 붙이게 됩니다. 손으로 하는 팩터 회귀가 틀어지는 가장 흔한 원인입니다.\n- **FF 값은 기간당 퍼센트(%)입니다** — CSV의 0.53은 0.53%, 즉 0.0053을 뜻합니다. Y도 *같은* 단위로 맞추세요(팩터가 %면 펀드 수익률도 %로). 안 그러면 베타는 맞아도 알파의 스케일이 어긋납니다.\n- **팩터는 이미 초과수익입니다** — Mkt-RF, SMB, HML은 무위험이자율이 이미 처리돼 있으니 **여기서 RF를 또 빼지 마세요**. RF는 오직 *당신 펀드*의 수익률에서만 빼서 Y 열을 만듭니다.\n- **-99.99(또는 -999) = 결측값입니다** — 파마-프렌치는 값이 없는 달의 자리표시로 이 숫자를 씁니다. 회귀 전에 **그 행들을 지우세요.** 안 그러면 나쁜 셀 하나가 모든 계수를 오염시킵니다.\n- **날짜가 정확히 맞아야 합니다** — 당신 펀드의 그 달과 같은 달의 팩터 행이 스프레드시트에서 같은 줄에 있어야 합니다. 한 달만 어긋나도(예: FF 파일 시작 월이 가격 이력 시작 월과 다름) 모든 짝이 조용히 밀려 **오류 메시지 없이 모든 베타가 오염됩니다.** 회귀 전에 양쪽 1행이 같은 연-월인지, 그리고 두 열이 같은 달에 끝나는지 눈으로 확인하세요.",
      },
    },
    {
      kind: "read",
      title: { en: "What a regression actually does", ko: "회귀분석이 실제로 하는 일" },
      body: {
        en: "Before you run one, here's what a **linear regression** does in plain language. It looks at every month in the history and asks: *when the value factor was up 1% that month, how much did this ETF tend to move? when the market was up 1%, how much did the ETF move?* It then finds the single best-fit set of sensitivities — the **betas** — that best reproduce the ETF's monthly ups and downs from the factors' ups and downs, plus a leftover constant (**alpha**) and a fit score (**R²**).\n\nThe picture: it's like fitting the straightest line through a scatter of dots — the *slope* of that line is the beta. The tool does all this math for you; your job is just to read and interpret the three outputs (betas, alpha, R²).\n\nA by-hand sanity check: if in most months the ETF moved about the *same %* as the market, its market beta is about **1**; if it moved *half* as much, about **0.5**. (Technical note: the tool needs at least ~2 years of monthly history — 24 months — or it can't report anything.)",
        ko: "돌리기 전에, **선형 회귀분석**이 하는 일을 쉬운 말로 봅시다. 회귀분석은 이력의 매달을 보고 이렇게 묻습니다: *그 달에 가치 팩터가 1% 올랐을 때 이 ETF는 얼마나 움직였나? 시장이 1% 올랐을 때는?* 그런 다음 팩터들의 등락으로 ETF의 등락을 가장 잘 재현하는 단 하나의 최적 민감도 세트 — **베타** — 에, 남는 상수(**알파**)와 적합도 점수(**R²**)를 더해 찾아냅니다.\n\n그림으로 보면: 점들의 흩어짐에 가장 곧은 직선을 긋는 것과 같고, 그 직선의 *기울기*가 베타입니다. 계산은 도구가 다 해주며, 당신 일은 세 결과(베타·알파·R²)를 읽고 해석하는 것뿐입니다.\n\n손으로 하는 검산: 대부분의 달에 ETF가 시장과 거의 *같은 %*로 움직였다면 시장 베타는 약 **1**, *절반*만 움직였다면 약 **0.5**입니다. (기술 참고: 도구는 최소 약 2년치 월별 이력 — 24개월 — 이 있어야 결과를 낼 수 있습니다.)",
      },
    },
    {
      kind: "tool",
      title: { en: "Run the regression", ko: "회귀분석을 돌립니다" },
      body: {
        en: "Run the analyzer below on an ETF whose label you can predict — start with **VTV** (value):\n- Read the **factor betas** (the loadings/tilts): HML is the value tilt, SMB the size tilt, Mkt the overall market exposure.\n- Read **alpha** — the return not explained by the factors, expressed per year (we explain \"annualized\" in the next step).\n- Read **R²**: how much of the ETF's month-to-month wiggle the three factors account for.\nThen re-run it on **MTUM** (momentum) and **USMV** (low-vol). Here's the catch we flagged earlier: this tool has no momentum or low-vol factor, so you *won't* find a momentum or low-vol loading to confirm — instead watch the three betas you *do* get, and notice the tilt those funds advertise isn't among them. That gap is the finding, and R² (a later step) will quantify it.",
        ko: "라벨을 예측할 수 있는 ETF로 아래 분석기를 실행하십시오. **VTV**(가치)부터 시작합니다.\n- **팩터 베타**(로딩/성향)를 읽으십시오. HML은 가치 성향, SMB는 규모 성향, Mkt는 전체 시장 노출입니다.\n- **알파**를 읽으십시오. 팩터로 설명되지 않는 수익을 연 단위로 나타낸 값입니다(\"연율화\"는 다음 단계에서 설명합니다).\n- **R²**를 읽으십시오. ETF의 월별 등락 중 세 팩터가 설명하는 비중입니다.\n그다음 **MTUM**(모멘텀)과 **USMV**(저변동성)로 다시 돌리십시오. 앞서 예고한 함정이 여기 있습니다: 이 도구에는 모멘텀·저변동성 팩터가 없어, 확인할 모멘텀·저변동성 로딩을 *찾지 못합니다* — 대신 나오는 세 베타를 보고, 그 펀드들이 광고하는 성향이 그 안에 없다는 점을 알아채십시오. 그 공백이 바로 발견이며, R²(뒤 단계)이 그것을 수치로 보여줍니다.",
      },
    },
    {
      kind: "read",
      title: { en: "A quick word on 'annualized'", ko: "'연율화'에 대한 짧은 설명" },
      body: {
        en: "The alpha (and other numbers) come out **annualized** — converted from a per-month figure to what it would be over a full year, so they're comparable to yearly things like a fund's fee. Worked example: an alpha of about **−0.03% per month** works out to roughly **−0.4% per year** (≈ −0.03% × 12); that's the same ballpark as a typical ETF fee. Units matter: alpha is in **% per year**, and a fund's fee is in **% per year**, so you can lay them side by side.\n\n(For the curious: the tool actually *compounds* the monthly figure — (1 + monthly alpha)^12 − 1 — but for the tiny alphas typical of a clean ETF that's almost identical to just multiplying by 12, so the ×12 mental model is fine.)",
        ko: "알파(그리고 다른 숫자들)는 **연율화**되어 나옵니다 — 한 달 단위 수치를 1년 전체 기준으로 환산해, 펀드 수수료 같은 연 단위 숫자와 비교할 수 있게 만든 것입니다. 예시: 월 약 **−0.03%**의 알파는 연 약 **−0.4%**(≈ −0.03% × 12)가 되며, 이는 흔한 ETF 보수와 비슷한 규모입니다. 단위가 중요합니다: 알파는 **연 %**이고 펀드 수수료도 **연 %**라, 나란히 놓고 비교할 수 있습니다.\n\n(궁금한 분을 위해: 도구는 사실 월별 수치를 복리로 불립니다 — (1 + 월 알파)^12 − 1 — 하지만 깨끗한 ETF의 아주 작은 알파에서는 단순히 12를 곱한 값과 거의 같아, ×12 개념으로 이해해도 괜찮습니다.)",
      },
    },
    {
      kind: "read",
      title: { en: "Read the betas — is the tilt really there?", ko: "베타를 읽습니다 — 성향이 정말 있는가?" },
      body: {
        en: "Each beta is the ETF's sensitivity to that factor. Put a number on it: an **HML beta of +0.3** means when the value factor earns 1% in a month, this ETF tends to earn about **+0.3%** from its value tilt; **+0.05** is almost nothing (value in name only); **+0.6** is a strong tilt. For a value ETF you want a clearly positive HML — **+0.3 or more** is a real, deliberate value tilt. (A broad value fund like VTV usually shows a modest positive HML; a dedicated value-factor fund like VLUE a bigger one — the tool computes the real figure for you.)\n\nThe **Mkt beta** should sit near **1**: a market beta of 1 means the fund moves roughly one-for-one with the market — market up 2%, fund up ~2%; 0.9 means slightly calmer (~1.8%), 1.1 slightly punchier (~2.2%). A min-vol fund like USMV is the deliberate exception — it should read noticeably below 1, which is the whole point of it.\n\nWatch for *unwanted* loadings: if your \"value\" fund also loads heavily positive on SMB, you're getting a size bet you may not have asked for. The sign matters as much as the size — a negative HML on a value fund is a red flag.",
        ko: "각 베타는 해당 팩터에 대한 ETF의 민감도입니다. 숫자로 봅시다: **HML 베타 +0.3**은 가치 팩터가 한 달에 1%를 벌 때 이 ETF가 가치 성향에서 약 **+0.3%**를 버는 경향을 뜻합니다. **+0.05**는 거의 없음(이름만 가치), **+0.6**은 강한 성향입니다. 가치 ETF라면 뚜렷하게 양(+)의 HML을 원합니다 — **+0.3 이상**이면 진짜로 의도된 가치 성향입니다. (VTV 같은 넓은 가치 펀드는 보통 완만한 플러스 HML, VLUE 같은 전용 가치-팩터 펀드는 더 큰 값을 보입니다 — 실제 수치는 도구가 계산해 줍니다.)\n\n**Mkt 베타**는 **1** 근처여야 합니다: 시장 베타 1은 펀드가 시장과 거의 일대일로 움직인다는 뜻입니다 — 시장이 2% 오르면 펀드도 약 2%; 0.9는 약간 잔잔(약 1.8%), 1.1은 약간 세게(약 2.2%). USMV 같은 저변동성 펀드는 의도된 예외로, 1보다 눈에 띄게 낮게 나와야 하며 그게 이 펀드의 존재 이유입니다.\n\n*원치 않은* 로딩도 살피십시오. \"가치\" 펀드가 SMB에도 크게 양(+)으로 실려 있으면, 청하지 않은 규모 베팅을 떠안는 셈입니다. 크기만큼 부호도 중요합니다. 가치 펀드의 음(-)의 HML은 위험 신호입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read alpha — skill, or just repackaged beta?", ko: "알파를 읽습니다 — 실력인가, 재포장된 베타인가?" },
      body: {
        en: "Alpha is the piece of the yearly return the three factors could *not* account for — expressed as **% per year**. For a clean, cheap value ETF you might see alpha ≈ **−0.4% per year**; that negative number is basically the fund's fee (its **expense ratio** — the annual fee a fund charges, where to find it is covered in the sources above) dragging return, and it's the *good* outcome: pure factor beta, no funny business. A large *positive* alpha over a short window is a reason for **suspicion, not excitement** — it usually reflects luck, a missing factor, or too-short history, not durable skill. You're buying exposure, not a manager's magic.",
        ko: "알파는 연 수익 중 세 팩터로는 설명되지 *않는* 부분이며, **연 %** 단위로 나타냅니다. 깨끗하고 저렴한 가치 ETF라면 알파가 연 약 **−0.4%** 정도로 나올 수 있습니다. 이 마이너스는 사실상 펀드 수수료(**총보수** — 펀드가 매년 물리는 연간 수수료, 찾는 곳은 위 출처에서 다룸)가 수익을 갉아먹은 것이며, 오히려 *좋은* 결과입니다: 순수한 팩터 베타이고 수상한 구석이 없다는 뜻이니까요. 짧은 기간의 큰 *플러스* 알파는 흥분이 아니라 **의심할 이유**입니다 — 지속되는 실력이 아니라 대개 운, 빠진 팩터, 또는 너무 짧은 이력을 반영합니다. 여러분이 사는 것은 노출이지, 운용자의 마법이 아닙니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read R² — and mind the honest limits", ko: "R²을 읽고, 솔직한 한계를 유념합니다" },
      body: {
        en: "R² runs from **0 to 1** (or 0% to 100%) and tells you how much of the ETF's return the three factors explain. Worked example: **R² = 0.9** means the three factors explain about **90%** of the ETF's month-to-month wiggle, and the other 10% is something else (fund-specific noise or a tilt these three factors don't capture); **R² = 0.6** means a big **40%** chunk is unexplained. A broad value or market fund often shows **high R² (0.9+)** — the factors capture almost everything, so what you see is what you get. A momentum or quality ETF may show **lower R²**.\n\nWhy? The three factors here are only **Market, size (SMB), and value (HML)**. Researchers later added more — momentum, profitability, investment — to capture tilts these three miss, which is why a momentum fund (MTUM) or a quality fund (QUAL, which leans on profitability) can score a lower R² here: its main engine isn't one of the three we're measuring. Low R² isn't necessarily bad — it flags a factor this model doesn't measure.\n\nTwo honest caveats: betas drift over time, and a short return history makes every number shakier. This is a snapshot, not a guarantee.",
        ko: "R²은 **0에서 1**(또는 0%에서 100%) 사이이며, ETF 수익 중 세 팩터가 얼마나 설명하는지 알려줍니다. 예시: **R² = 0.9**는 세 팩터가 ETF 월별 등락의 약 **90%**를 설명한다는 뜻이고, 나머지 10%는 다른 무언가(펀드 고유의 잡음이거나 이 세 팩터가 못 잡는 성향)입니다. **R² = 0.6**이면 **40%**나 되는 큰 덩어리가 설명되지 않습니다. 광범위한 가치·시장 펀드는 흔히 **높은 R²(0.9 이상)**을 보입니다 — 팩터가 거의 전부를 잡아내니, 보이는 그대로입니다. 모멘텀이나 퀄리티 ETF는 **더 낮은 R²**를 보일 수 있습니다.\n\n왜일까요? 여기 세 팩터는 **시장·규모(SMB)·가치(HML)**뿐입니다. 연구자들은 나중에 모멘텀·수익성·투자 같은 팩터를 더해 이 셋이 놓치는 성향을 잡았고, 그래서 모멘텀 펀드(MTUM)나 수익성에 기대는 퀄리티 펀드(QUAL)는 여기서 R²가 더 낮게 나올 수 있습니다 — 핵심 엔진이 우리가 재는 세 팩터에 없기 때문입니다. 낮은 R²이 반드시 나쁜 건 아니며, 이 모형이 측정 못 하는 팩터가 있음을 알리는 신호입니다.\n\n두 가지 솔직한 유의점: 베타는 시간이 지나며 흐르고, 짧은 수익 이력은 모든 숫자를 더 불안정하게 만듭니다. 이것은 스냅샷이지 보증이 아닙니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Decide: right tilt, cheap, clean?", ko: "판단합니다: 맞는 성향, 저렴, 깔끔?" },
      body: {
        en: "Turn the three numbers into a keep / skip decision on this ETF.",
        ko: "세 숫자를 이 ETF에 대한 채택/제외 결정으로 바꾸십시오.",
      },
      prompt: {
        en: "Write it down: \"**____** advertises a **____** tilt. Its value (HML) / size (SMB) / market beta is ____, which (confirms / weakens) that claim. Its alpha is about ____% per year, so I'm getting (clean factor beta / an unexplained bet / a manager story). R² is ____, meaning the factors (do / don't) explain it. Given its expense ratio (fee) of about ____%, I would (buy it for the tilt / skip it because ______).\"",
        ko: "이렇게 적으십시오. \"**____**는 **____** 성향을 광고한다. 이 펀드의 가치(HML) / 규모(SMB) / 시장 베타는 ____이고, 이는 그 주장을 (확인한다 / 약화시킨다). 알파는 연 약 ____%라, 나는 (깔끔한 팩터 베타 / 설명 안 되는 베팅 / 운용자 스토리)를 얻고 있다. R²은 ____라, 팩터가 이것을 (설명한다 / 설명하지 못한다). 총보수(수수료) 약 ____%를 감안해, 나는 (그 성향을 위해 매수하겠다 / ______ 때문에 제외하겠다).\"",
      },
    },
    {
      kind: "conclude",
      title: { en: "Your factor-exposure verdict", ko: "당신의 팩터 노출 판정" },
      body: {
        en: "You've X-rayed an ETF's returns and separated the tilt it sells from the tilt it actually delivers, the beta you're paying for, and any hidden bets. A good factor ETF gives you the exposure you want, cheaply, with few surprises. Record the verdict below.",
        ko: "ETF 수익을 엑스레이로 들여다보고, 파는 성향과 실제로 주는 성향, 지불하는 베타, 숨은 베팅을 분리했습니다. 좋은 팩터 ETF는 원하는 노출을 저렴하게, 놀랄 일 없이 줍니다. 아래에 판정을 기록하십시오.",
      },
      checklist: [
        { en: "Named the factor the ETF advertises and checked its beta on that factor is clearly positive (roughly +0.3 or more) to confirm the tilt is real, not value-in-name-only.", ko: "ETF가 광고하는 팩터를 적고, 그 팩터의 베타가 뚜렷하게 플러스(대략 +0.3 이상)인지 확인해 성향이 이름뿐이 아니라 실제인지 점검했다." },
        { en: "Checked for unwanted loadings (a hidden size or market bet I didn't ask for).", ko: "원치 않은 로딩(청하지 않은 숨은 규모·시장 베팅)이 있는지 점검했다." },
        { en: "Judged alpha as near-zero or slightly negative by about the fee (clean factor beta) versus a suspicious positive spike.", ko: "알파가 0에 가깝거나 보수만큼 살짝 마이너스인지(깨끗한 팩터 베타) 아니면 수상한 플러스 급등인지 판단했다." },
        { en: "Read R² to see whether the factors explain the fund (high, ~0.9+) or a hidden bet lurks (low), and checked the actual expense ratio, not just the fund's name.", ko: "R²로 팩터가 펀드를 잘 설명하는지(높음, 약 0.9+) 아니면 숨은 베팅이 있는지(낮음) 보고, 이름이 아니라 실제 총보수를 확인했다." },
        { en: "This is a hypothesis from a backward-looking regression, not a recommendation — betas drift.", ko: "이것은 과거를 보는 회귀에서 나온 가설이지 추천이 아니다 — 베타는 흐른다." },
      ],
    },
  ],
};

export const deal: Walkthrough = {
  labId: "deal",
  title: {
    en: "Does this merger's spread pay you enough for the risk it breaks?",
    ko: "이 합병의 스프레드는 딜이 깨질 위험에 값하는 대가를 주는가?",
  },
  goal: {
    en: "By the end you'll have computed a merger-arb spread, annualized it over the expected time-to-close, sized up the loss if the deal breaks, estimated the market-implied odds of closing, and decided whether the trade compensates you for that asymmetric risk.",
    ko: "끝까지 따라가면 합병 차익거래 스프레드를 계산하고, 예상 종료 기간으로 연율화하고, 딜이 깨졌을 때의 손실을 가늠하고, 시장이 암시하는 종료 확률을 추정한 뒤, 이 거래가 그 비대칭 위험에 값하는지 결정하게 됩니다.",
  },
  steps: [
    {
      kind: "read",
      title: { en: "Frame the decision as three questions", ko: "결정을 세 가지 질문으로 정리합니다" },
      body: {
        en: "When Company A agrees to buy Company B at a fixed price, B's stock usually jumps toward that price but stops just short of it. That gap is the **arb spread** (short for arbitrage) — the market's pay for holding the risk that the deal doesn't close. Merger arb harvests it. Hold three questions:\n- **How big is the spread, annualized?** *Annualizing* just means scaling a return up to a full year so you can compare deals of different lengths. A tiny gap over three days can be a huge annualized return; the same gap over two years is meager.\n- **What do I lose if it breaks?** Before the merger was announced, B traded at some ordinary price — call it the **pre-announcement price** (literally the closing price the day before the deal was made public). The offer usually sits well above it, which is why the stock jumped on the news. If the deal dies, the reason for the jump vanishes and the stock typically slides back toward that pre-announcement level — often a far bigger drop than the spread you were chasing. (It's like a concert ticket that doubled because a star was rumored to appear: if the star cancels, the price falls back to the plain-ticket value.)\n- **What are the odds it closes?** You can even read the market's **implied probability** of closing straight off the current price — we show how in a later step — and ask whether *you* think it's too high or too low.",
        ko: "A사가 B사를 정해진 가격에 인수하기로 합의하면, B사 주가는 보통 그 가격 쪽으로 뛰지만 살짝 못 미쳐 멈춥니다. 그 간격이 **차익 스프레드**(arb는 arbitrage의 줄임말)입니다. 딜이 성사되지 않을 위험을 떠안는 대가로 시장이 주는 것이죠. 합병 차익거래는 이걸 거둡니다. 세 가지 질문을 떠올리십시오.\n- **연율화하면 스프레드가 얼마나 큰가?** *연율화*란 수익률을 1년 기준으로 늘려, 기간이 다른 딜끼리 비교할 수 있게 하는 것뿐입니다. 사흘 동안의 작은 간격은 엄청난 연율 수익이 될 수 있고, 같은 간격이 2년이면 초라합니다.\n- **깨지면 얼마를 잃는가?** 합병이 발표되기 전, B는 어떤 평범한 가격에 거래되고 있었습니다 — 이를 **발표 전 가격**(pre-announcement price)이라 부르자 (문자 그대로, 딜이 공개되기 하루 전 종가). 인수 제안 가격은 보통 그보다 한참 위에 있고, 그래서 발표 소식에 주가가 뛴 것입니다. 딜이 무산되면 그 급등의 이유가 사라져 주가는 보통 발표 전 가격 쪽으로 되돌아갑니다 — 노리던 스프레드보다 훨씬 큰 하락인 경우가 많습니다. (스타가 나온다는 소문에 값이 두 배가 된 콘서트 티켓 같은 것이죠. 스타가 취소하면 값은 원래 일반 티켓 가격으로 떨어집니다.)\n- **성사 확률은 얼마인가?** 현재 주가에서 시장이 매기는 종료 확률, 즉 **암시 확률**(implied probability)까지 바로 읽어낼 수 있습니다 — 방법은 뒤 단계에서 보여줍니다 — 그리고 그 확률이 너무 높은지 낮은지 스스로 판단하면 됩니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the deal terms come from", ko: "딜 조건이 어디서 오는지" },
      body: {
        en: "For a real deal, the terms aren't rumor — they're filed. The moment a merger is announced, the target files an **8-K** with SEC EDGAR (see the first source below), followed by a **proxy statement** for the shareholder vote. Those, plus the company's own press release, are your primary sources.\n\n**Ignore the on-screen tips in the two generic source guides below and do exactly this instead** — those guides were reused from other labs (a backtest and a 10-K read), so their marker labels point you the wrong way for a merger:\n- **Deal terms → the merger 8-K and the DEFM14A/proxy, NOT the income statement.** On EDGAR, do *not* open the annual 10-K financial statements; open the target's **merger 8-K** (filed within days of the announcement, with the merger agreement attached) and the **DEFM14A** proxy. Hunt for the recital that reads \"**$X.XX per share in cash**\" — that single line is your offer price. Revenue and earnings on the income statement tell you nothing about what a shareholder gets paid per share.\n- **Pre-announcement price → the plain Close the day before, NOT Adjusted Close.** On the price chart, first find the **announcement date** (the 8-K filing date), then read the ordinary **Close** of the single trading day *before* it. Do **not** use **Adjusted Close (Adj Close)**: it is back-adjusted for dividends and splits that happen *after* that date, so it is not the level the stock actually traded at — and not the level it would revert to if the deal breaks. You want the raw close, the real break-price anchor. (Also ignore the chart tip about setting a long \"bull-and-bear\" date range — here you need one single day, not a full market cycle.)\n\nA few terms you'll meet:\n- **8-K** — a short SEC filing a US company must publish within days of any major event (here, the merger); it attaches the actual merger agreement.\n- **Proxy statement (DEFM14A)** — the booklet mailed to shareholders before they vote on the deal; it restates the price, timeline, and risks in more detail.\n- **Break fee** — a penalty one side pays the other if it walks away from the deal; a signal of how committed the parties are.\n- **Closing conditions** — the boxes that must be ticked before the deal can complete, mainly regulator approvals and the shareholder vote.\n\nThe offer price is stated in the first page or two of the press release and in the merger agreement's opening recitals — look for a phrase like \"$X.XX per share in cash.\"\n\n**Cash vs. stock.** In an **all-cash** deal the offer is a fixed dollar figure (e.g. $50.00/share) — simple. In a **stock** deal the buyer pays in its own shares, so the effective deal price floats up and down with the buyer's stock price and is harder to pin down. This lab assumes an **all-cash** deal (a fixed deal price); stock deals need an extra step we don't cover here.\n\nOne number is *not* in any filing: the **pre-announcement price**. It's just a historical stock quote — pull up a price chart (see the second source), find the announcement date, and read the closing price of the trading day *before* it. That single number is your break-price anchor. This lab pre-loads two illustrative deals — one that closed cleanly and one that broke — and lets you edit any field to model a live deal.",
        ko: "실제 딜의 조건은 소문이 아니라 공시됩니다. 합병이 발표되는 순간, 피인수 기업은 **8-K**를 SEC EDGAR에 제출하고(아래 첫 번째 출처 참조), 이어서 주주총회 표결을 위한 **위임장(proxy)**을 냅니다. 이것들과 기업의 보도자료가 1차 출처입니다.\n\n**아래 두 개의 일반 출처 가이드에 붙은 화면 설명은 무시하고, 대신 정확히 이렇게 하십시오** — 그 가이드들은 다른 랩(백테스트와 10-K 읽기)에서 재사용한 것이라, 마커 설명이 합병에는 엉뚱한 방향을 가리킵니다.\n- **딜 조건 → 합병 8-K와 DEFM14A(위임장), 손익계산서가 *아님*.** EDGAR에서 연간 10-K 재무제표를 열지 *마십시오*. 대상 회사의 **합병 8-K**(발표 후 며칠 안에 제출되며 합병계약서가 첨부됨)와 **DEFM14A** 위임장을 여십시오. \"**주당 $X.XX 현금(per share in cash)**\"이라 적힌 낭독조항을 찾으면 — 그 한 줄이 인수 가격입니다. 손익계산서의 매출·이익은 주주가 주당 얼마를 받는지에 대해 아무것도 알려주지 않습니다.\n- **발표 전 가격 → 하루 전의 일반 Close(종가), 수정 종가가 *아님*.** 주가 차트에서 먼저 **발표일**(8-K 제출일)을 찾고, 그 *하루 전* 단 하나의 거래일의 일반 **Close(종가)**를 읽으십시오. **Adjusted Close(수정 종가, Adj Close)**는 쓰지 **마십시오**: 수정 종가는 그 날짜 *이후*에 일어난 배당·분할을 소급 반영한 값이라, 주가가 실제로 거래되던 수준이 아니며 — 딜이 깨졌을 때 되돌아갈 수준도 아닙니다. 필요한 것은 원시 종가, 진짜 결렬 가격 기준점입니다. (긴 \"상승·하락(bull-and-bear)\" 기간을 설정하라는 차트 설명도 무시하십시오 — 여기서는 시장 사이클 전체가 아니라 단 하루가 필요합니다.)\n\n마주치게 될 몇 가지 용어:\n- **8-K** — 미국 기업이 중대한 사건(여기서는 합병) 발생 후 며칠 안에 반드시 제출해야 하는 짧은 SEC 공시 — 실제 합병계약서가 첨부됩니다 (통상 사건 후 영업일 4일 이내).\n- **위임장(DEFM14A)** — 주주들이 딜에 투표하기 전에 우편으로 받는 소책자 — 가격·일정·위험을 더 자세히 다시 설명합니다 (DEFM14A = 확정 합병 위임장).\n- **위약금(break fee)** — 한쪽이 딜에서 발을 뺄 때 상대방에게 무는 위약금 — 양측이 얼마나 진지한지 보여주는 신호.\n- **종료 조건(closing conditions)** — 딜이 완료되기 전에 채워져야 하는 항목들 — 주로 규제당국 승인과 주주 투표.\n\n인수 가격은 보도자료 첫 한두 페이지와 합병계약서 맨 앞의 낭독조항(recitals)에 적혀 있습니다 — \"주당 $X.XX 현금(per share in cash)\" 같은 문구를 찾으면 됩니다.\n\n**현금이냐 주식이냐.** 전액 현금(all-cash) 딜에서는 인수 가격이 고정된 금액(예: 주당 $50.00)이라 간단합니다. 주식(stock) 딜에서는 인수자가 자기 회사 주식으로 지불하므로, 실효 딜 가격이 인수자 주가를 따라 오르내려 확정하기 어렵습니다. 이 랩은 전액 현금 딜(고정 딜 가격)을 가정합니다 — 주식 딜은 여기서 다루지 않는 추가 단계가 필요합니다.\n\n한 숫자만은 어떤 공시에도 *없습니다*: **발표 전 가격**입니다. 그저 과거 주가일 뿐이라 — 주가 차트(아래 두 번째 출처 참조)를 열어 발표일을 찾고, 그 하루 전 거래일의 종가를 읽으면 됩니다. 이 한 숫자가 결렬 가격(break price)의 기준점입니다. 이 랩은 예시 딜 두 개 — 깔끔하게 성사된 것과 깨진 것 — 를 미리 불러오고, 어떤 항목이든 편집해 실제 딜을 모델링하게 해줍니다.",
      },
      sources: [
        {
          name: { en: "SEC EDGAR (merger 8-K / proxy)", ko: "SEC EDGAR (합병 8-K / 위임장)" },
          what: { en: "The primary deal terms: offer price, cash-vs-stock structure, closing conditions, regulatory approvals needed, break fees, and the expected close date.", ko: "1차 딜 조건: 인수 가격, 현금/주식 구조, 종료 조건, 필요한 규제 승인, 위약금, 예상 종료일." },
          why: { en: "It's the legally binding source — not a headline. Everything you plug into the analyzer should trace back to a filing, not a tweet.", ko: "헤드라인이 아니라 법적 구속력이 있는 출처입니다. 분석기에 넣는 모든 값은 트윗이 아니라 공시 문서로 거슬러 올라가야 합니다." },
          url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany",
          steps: EDGAR_STEPS,
        },
        {
          name: { en: "Price chart (Yahoo/Google Finance or broker)", ko: "주가 차트 (Yahoo/Google Finance 또는 증권사)" },
          what: { en: "The historical closing price on the trading day before the announcement — your break-price anchor.", ko: "발표 하루 전 거래일 종가 — 결렬 가격 기준점." },
          why: { en: "A broken deal reverts toward this level, so it sets your downside; no filing contains it — it's just a historical quote.", ko: "딜이 깨지면 주가가 이 수준으로 되돌아가므로 하방 손실을 결정합니다 — 어떤 공시에도 없고, 그저 과거 시세일 뿐입니다." },
          url: "https://finance.yahoo.com",
          shot: YAHOO_SHOT,
        },
        {
          name: { en: "Company press releases", ko: "기업 보도자료" },
          what: { en: "The plain-language deal summary, strategic rationale, and management's expected timeline to close.", ko: "쉬운 말로 된 딜 요약, 전략적 명분, 경영진이 밝힌 예상 종료 일정." },
          why: { en: "They translate the legal 8-K into a readable summary and give you the timeline you need to annualize the spread — cross-check them against the filing.", ko: "법적인 8-K를 읽기 쉬운 요약으로 옮기고, 스프레드를 연율화하는 데 필요한 일정을 줍니다. 공시 문서와 교차 확인하십시오." },
          url: "https://www.prnewswire.com/news/",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Compute the spread and annualize it", ko: "스프레드를 계산하고 연율화합니다" },
      body: {
        en: "Run the analyzer below. Start with the **clean-close** example, then the **broken** one:\n- Read **deal price**, **current price**, and **pre-announcement price**.\n- The **dollar spread** = deal price − current price (the gap in Step 1). But to compare deals and annualize, you need it as a *percent*: the tool divides that dollar gap by the *current* price to get the **spread %**. From here on, whenever we say \"spread\" as a percent (e.g. the 1.5% in the next step, or \"spread %\" in the judge step), we mean exactly this — dollar spread ÷ current price. (Example: deal price $50, current $49.25 → dollar spread $0.75; spread % = 0.75 ÷ 49.25 ≈ 1.5%.)\n- Enter the **expected days to close**. The tool then **annualizes** the spread % — it simply scales the return up to a full year: annualized ≈ spread % × (365 ÷ days to close). We work a number through this in the next step.\n- Note the **downside**. Because the current price is *above* the pre-announcement price, the difference (current − pre-announcement) is a positive dollar amount — but it represents a **fall**: it's roughly how much *per share* the stock would drop if the deal breaks and reverts. Divide it by the current price to turn that dollar drop into a **percent loss** — that percent is what you compare against the spread. (Example: current $98.50, pre-announcement $72 → dollar drop $26.50; percent loss = 26.50 ÷ 98.50 ≈ 26.9%.)\nRun both deals and compare: the broken deal probably showed a *wider* spread — that width was the market pricing in the risk you now know played out.",
        ko: "아래 분석기를 실행하십시오. **정상 종료** 예시부터, 그다음 **결렬** 예시로 갑니다.\n- **딜 가격**, **현재가**, **발표 전 가격**을 읽으십시오.\n- **달러 스프레드** = 딜 가격 − 현재가 (1단계의 그 간격). 하지만 딜끼리 비교하고 연율화하려면 이를 *퍼센트*로 바꿔야 합니다: 도구는 이 달러 간격을 *현재가*로 나눠 **스프레드 %**를 구합니다. 이제부터 스프레드를 퍼센트로 말할 때(예: 다음 단계의 1.5%, 판단 단계의 \"스프레드 %\")는 바로 이것 — 달러 스프레드 ÷ 현재가 — 을 뜻합니다. (예: 딜 가격 $50, 현재가 $49.25 → 달러 스프레드 $0.75; 스프레드 % = 0.75 ÷ 49.25 ≈ 1.5%.)\n- **예상 종료 일수**를 입력하십시오. 그러면 도구가 스프레드 %를 **연율화**합니다 — 수익률을 1년 기준으로 늘리는 것뿐입니다: 연율화 ≈ 스프레드 % × (365 ÷ 종료 일수). 다음 단계에서 실제 숫자로 계산해 봅니다.\n- **하방**을 확인하십시오. 현재가가 발표 전 가격보다 높기 때문에 그 차이(현재가 − 발표 전 가격)는 양(+)의 금액입니다 — 하지만 이는 **하락**을 뜻합니다: 딜이 깨져 되돌아가면 주당 대략 이만큼 떨어진다는 뜻입니다. 이 금액을 현재가로 나누면 달러 하락이 **퍼센트 손실**로 바뀝니다 — 그 퍼센트를 스프레드와 비교하면 됩니다. (예: 현재가 $98.50, 발표 전 가격 $72 → 달러 하락 $26.50; 퍼센트 손실 = 26.50 ÷ 98.50 ≈ 26.9%.)\n두 딜을 다 돌려 비교하십시오. 결렬된 딜은 아마 *더 넓은* 스프레드를 보였을 겁니다. 그 넓이는 이제 여러분이 결과를 아는 그 위험을 시장이 가격에 반영한 것이었습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the annualized spread — with a grain of salt", ko: "연율화 스프레드를 읽습니다 — 소금 한 꼬집과 함께" },
      body: {
        en: "Annualizing makes a small gap look impressive. Take a **1.5%** spread that closes in **90 days**. A year has about 365 days, and 90 days is roughly one quarter of it, so you could in theory repeat this trade about 4 times a year: 1.5% × (365 ÷ 90) ≈ 1.5% × 4.06 ≈ **6%**. That's the headline merger-arb pros chase. Notice the hidden assumption: the ×4 only pays off if, the instant this deal closes, you can find another equally good deal to roll the cash into. In the real world you often can't, so the annualized figure is a best case. It's also exquisitely sensitive to the **time-to-close** you assume: if a deal drags an extra six months in regulatory review, that gaudy annualized number collapses. Treat the annualized figure as a ranking tool, not a promise.",
        ko: "연율화는 작은 격차를 인상적으로 보이게 합니다. 90일 만에 종료되는 **1.5%** 스프레드를 봅시다. 1년은 약 365일이고 90일은 그 4분의 1쯤이라, 이론상 1년에 이 거래를 약 4번 반복할 수 있습니다: 1.5% × (365 ÷ 90) ≈ 1.5% × 4.06 ≈ **6%**. 이것이 합병 차익 전문가들이 좇는 대표 숫자입니다. 숨은 가정을 눈치채십시오: ×4는 이 딜이 끝나는 즉시 똑같이 좋은 다른 딜을 찾아 현금을 굴릴 수 있어야만 실현됩니다. 현실에서는 그럴 수 없는 경우가 많아, 연율화 수치는 최선의 경우일 뿐입니다. 게다가 가정한 **종료 기간**에 극도로 민감합니다. 딜이 규제 심사로 여섯 달 더 끌면, 그 화려한 연율 숫자는 무너집니다. 연율화 수치는 약속이 아니라 순위를 매기는 도구로 다루십시오.",
      },
    },
    {
      kind: "read",
      title: { en: "Size the downside — the payoff is asymmetric", ko: "하락 위험을 가늠합니다 — 손익은 비대칭입니다" },
      body: {
        en: "This is the heart of merger arb, and where people get hurt. You win a small, capped amount (the spread) if the deal closes. You lose a large amount if it breaks — the stock craters back toward its pre-announcement price, sometimes below it. So the payoff is **asymmetric**: a single broken deal can erase the profit from *many* successful ones. Do the arithmetic explicitly. (The round numbers below are a fresh illustration to keep the mental math clean — don't try to reconcile them with the tool step's 26.9% or the odds step's figures; each step invents its own tidy example.) Suppose your **downside** from the previous step — (current − pre-announcement) ÷ current, the same percent-loss you computed with the tool — works out to a **20%** loss if it breaks, while the **spread** you'd earn if it closes is **1.5%**. How many good deals does one break undo? Just divide: 20% ÷ 1.5% ≈ **13**. So a single broken deal wipes out the profit from about **thirteen** clean closes. That ratio (clean-closes-per-break ≈ downside % ÷ spread %), not the annualized return, is the number that should keep you honest.",
        ko: "이것이 합병 차익거래의 핵심이자, 사람들이 다치는 지점입니다. 딜이 성사되면 작고 상한이 있는 금액(스프레드)을 법니다. 깨지면 큰 금액을 잃습니다 — 주가가 발표 전 가격 쪽으로, 때로는 그 아래로 폭락하니까요. 그래서 손익은 **비대칭**입니다. 딜 하나가 깨지면 성공한 *여러* 딜의 이익을 지울 수 있습니다. 산수를 명시적으로 해봅시다. (아래 딱 떨어지는 숫자들은 암산을 쉽게 하려는 새 예시일 뿐입니다 — 도구 단계의 26.9%나 확률 단계의 숫자들과 억지로 맞추려 하지 마십시오. 각 단계는 저마다 깔끔한 예시를 따로 씁니다.) 앞 단계의 **하방** — (현재가 − 발표 전 가격) ÷ 현재가, 방금 도구로 계산한 바로 그 퍼센트 손실 — 이 결렬 시 **20%** 손실로 나왔고, 종료 시 벌 **스프레드**는 **1.5%**라 합시다. 한 번의 결렬이 좋은 딜 몇 개를 지우는가? 그냥 나눕니다: 20% ÷ 1.5% ≈ **13**. 즉 딜 한 번 깨지면 정상 종료 약 **열세 번**의 이익이 날아갑니다. 연율 수익이 아니라 바로 이 비율(결렬당 정상종료 횟수 ≈ 하방 % ÷ 스프레드 %)이 여러분을 정직하게 붙잡아 둬야 할 숫자입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Back out the market-implied odds of closing", ko: "시장이 암시하는 종료 확률을 역산합니다" },
      body: {
        en: "One vocabulary note: the **break price** is just the pre-announcement price from the earlier steps — the level the stock is expected to fall to if the deal breaks. Same number, shorter name. The current price sits between the deal price and the break price, and *where* it sits tells you the market's implied probability of closing. Roughly: **implied P(close) ≈ (current − break price) ÷ (deal price − break price)**.\n\nHere's why this ratio is a probability. If the deal is certain to close, the stock should already trade at the deal price; if it's certain to break, it should trade at the break price. The current price sits **between** the two — like a weighted average — and how far along it sits *is* the market's odds. Worked example: deal price $50, break price $40, current price $48. Then implied P(close) ≈ (48 − 40) ÷ (50 − 40) = 8 ÷ 10 = **80%**. The stock is 80% of the way from the break price up to the deal price, so the market is pricing an 80% chance the deal closes.\n\nNow the real question flips from arithmetic to judgment: do **you** think that implied probability is right? What actually decides whether a deal closes:\n- **Regulatory risk** — will antitrust/competition regulators (e.g. the US FTC/DOJ or the EU Commission) block it for reducing competition? Bigger overlaps between the two firms = higher risk.\n- **Financing risk** — for a cash deal, has the buyer actually lined up the money? A committed financing letter in the filing lowers this risk.\n- **Shareholder-vote risk** — will the target's owners approve the price at the meeting? A large **premium** (how far the offer price sits above the pre-announcement price — the same jump that opened this whole lab) and board backing lower this risk, because shareholders are being paid well above the old market price and are more likely to vote yes.\nYou don't need to be an expert — but you need *a* view on at least one of these to claim an edge. If you have no view, you have no edge.",
        ko: "용어 하나만 짚읍시다: **결렬 가격**(break price)은 앞 단계의 발표 전 가격과 같습니다 — 딜이 깨지면 주가가 떨어질 것으로 예상되는 수준입니다. 같은 숫자, 짧은 이름일 뿐입니다. 현재가는 딜 가격과 결렬 가격 사이에 있고, *어디에* 있느냐가 시장이 암시하는 종료 확률을 알려줍니다. 대략: **암시 P(종료) ≈ (현재가 − 결렬 가격) ÷ (딜 가격 − 결렬 가격)**.\n\n왜 이 비율이 확률인지 봅시다. 딜이 확실히 종료된다면 주가는 이미 딜 가격에 거래되어야 하고, 확실히 깨진다면 결렬 가격에 거래되어야 합니다. 현재가는 그 둘 사이에 — 가중평균처럼 — 놓이며, 얼마나 위쪽에 놓였는가가 곧 시장의 확률입니다. 예시: 딜 가격 $50, 결렬 가격 $40, 현재가 $48. 그러면 종료 확률 ≈ (48 − 40) ÷ (50 − 40) = 8 ÷ 10 = **80%**. 주가가 결렬 가격에서 딜 가격까지의 80% 지점에 있으므로, 시장은 딜 종료 확률을 80%로 매기고 있습니다.\n\n이제 진짜 질문이 산수에서 판단으로 바뀝니다. **여러분**은 그 암시 확률이 맞다고 보십니까? 딜의 종료 여부를 실제로 좌우하는 것:\n- **규제 위험** — 반독점/경쟁 당국(예: 미국 FTC/DOJ 또는 EU 집행위)이 경쟁 제한을 이유로 막을까? 두 회사의 사업 겹침이 클수록 위험이 높습니다.\n- **자금조달 위험** — 현금 딜에서 인수자가 실제로 돈을 마련해 두었는가? 공시에 확약된 자금조달 확약서(financing letter)가 있으면 위험이 낮아집니다.\n- **주주투표 위험** — 대상 회사 주주들이 주총에서 가격을 승인할까? 높은 **프리미엄**(인수 가격이 발표 전 가격보다 얼마나 위에 있는지 — 이 랩 첫머리에서 주가를 뛰게 한 바로 그 격차)과 이사회 지지가 이 위험을 낮춥니다. 주주들이 옛 시장가보다 한참 높은 값을 받게 되니 찬성표를 던질 가능성이 높아지기 때문입니다.\n전문가일 필요는 없지만, 우위를 주장하려면 이 중 최소 하나에는 견해가 있어야 합니다. 시각이 없으면 우위도 없습니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Decide: paid enough for the break risk?", ko: "판단합니다: 결렬 위험에 값하는 대가를 받는가?" },
      body: {
        en: "Weigh the annualized spread against the asymmetric downside for THIS deal. The tool shows you the **spread %** and the **annualized %** directly; the **downside %** (dollar downside ÷ current price) and the **implied %** (the formula from the odds step) are quick hand-calcs on top of it. If you want to check the tool, the two hand-checks you just learned are: annualized ≈ spread × (365 ÷ days), and clean-closes-per-break ≈ downside % ÷ spread %.",
        ko: "이 딜에서 연율화 스프레드를 비대칭 하락 위험과 저울질하십시오. 도구는 **스프레드 %**와 **연율화 %**를 직접 보여줍니다. **하방 %**(달러 하방 ÷ 현재가)와 **암시 %**(확률 단계의 공식)는 그 위에 얹는 간단한 손계산입니다. 도구를 확인하고 싶다면, 방금 배운 두 손계산은: 연율화 ≈ 스프레드 × (365 ÷ 일수), 결렬당 정상종료 횟수 ≈ 하방 % ÷ 스프레드 %.",
      },
      prompt: {
        en: "Write it down: \"The spread is **__%** (about **__%** annualized over __ days). If it breaks I lose about **__%** back toward the pre-announcement price, so one break costs me __ clean closes. The market implies a **__%** chance of closing; I think the true odds are (higher / lower / about right) because of ______ (regulatory / financing / vote). Therefore I would (take the trade / pass) because ______.\"",
        ko: "이렇게 적으십시오. \"스프레드는 **__%**(__일간 약 **__%** 연율화)이다. 깨지면 발표 이전 가격 쪽으로 약 **__%**를 잃으니, 한 번의 결렬은 정상 종료 __번의 값이다. 시장은 종료 확률을 **__%**로 암시하는데, 나는 ______(규제 / 자금 조달 / 표결) 때문에 실제 확률이 (더 높다 / 더 낮다 / 대체로 맞다)고 본다. 따라서 나는 ______ 때문에 (이 거래를 하겠다 / 넘기겠다).\"",
      },
    },
    {
      kind: "conclude",
      title: { en: "Your merger-arb thesis", ko: "당신의 합병 차익 결론" },
      body: {
        en: "You've turned an announced deal into a spread, an annualized return, a break-loss, and an implied probability — then judged whether the pay matches the risk. Merger arb is picking up small coins in front of an occasional steamroller; the whole game is in whether you priced the steamroller. Record the thesis below.",
        ko: "발표된 딜을 스프레드, 연율 수익, 결렬 손실, 암시 확률로 바꾼 뒤, 그 대가가 위험에 걸맞은지 판단했습니다. 합병 차익은 이따금 굴러오는 증기롤러 앞에서 작은 동전을 줍는 일입니다. 승부는 그 증기롤러를 제대로 가격에 반영했느냐에 달려 있습니다. 아래에 결론을 기록하십시오.",
      },
      checklist: [
        { en: "Traced the deal price and terms to the actual 8-K / proxy, not a headline.", ko: "딜 가격과 조건을 헤드라인이 아니라 실제 8-K / 위임장으로 확인했다." },
        { en: "Computed the spread and annualized it, noting how sensitive it is to time-to-close.", ko: "스프레드를 계산해 연율화하고, 종료 기간에 얼마나 민감한지 적어 두었다." },
        { en: "Sized the break-loss (dollar drop ÷ current price) and wrote how many clean closes one break would wipe out.", ko: "결렬 손실(달러 하락 ÷ 현재가)을 가늠하고, 한 번의 결렬이 정상 종료 몇 번을 날리는지 적었다." },
        { en: "Backed out the market-implied probability and stated whether I disagree, with a reason.", ko: "시장이 암시하는 확률을 역산하고, 이유와 함께 그에 동의하는지 밝혔다." },
        { en: "This is a hypothesis about one deal's risk/reward, not a recommendation — deals break unexpectedly.", ko: "이것은 한 딜의 위험/보상에 대한 가설이지 추천이 아니다 — 딜은 예기치 않게 깨진다." },
      ],
    },
  ],
};
