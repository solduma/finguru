// The twelve non-pilot walkthroughs (the growth pilot lives in ./walkthroughs).
// Same WalkStep shape; split out purely to keep the model file readable.
import type { Walkthrough } from "./walkthroughs";

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
        en: "A high yield is a promise the company has to keep paying for. So we don't stop at \"how big is the dividend\" — we ask, in order:\n- **Is the yield actually attractive** relative to what you could get elsewhere?\n- **Can earnings cover it?** (payout ratio of net income)\n- **Can real cash cover it?** (payout of free cash flow — cash is harder to fake than earnings)\n- **Has management kept the promise?** (a growth streak, or a past cut)\n\nBy the end you'll say one thing: is this dividend **safe enough to rely on**, or not?",
        ko: "높은 배당수익률은 회사가 계속 지불해야 하는 약속입니다. 그래서 \"배당이 얼마나 큰가\"에서 멈추지 않고, 순서대로 질문합니다.\n- **수익률이 정말 매력적인가?** 다른 곳에서 얻을 수 있는 것과 비교해서요.\n- **이익으로 감당되는가?** (순이익 대비 배당성향)\n- **진짜 현금으로 감당되는가?** (잉여현금흐름 대비 배당 — 현금은 이익보다 꾸미기 어렵습니다)\n- **경영진이 약속을 지켜 왔는가?** (배당 증가 이력, 혹은 과거 삭감)\n\n마지막에 한 가지만 답합니다. 이 배당은 **믿고 의지할 만큼 안전한가**, 아닌가?",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터의 출처" },
      body: {
        en: "Dividends and cash flow live in the financial statements, not on a stock-quote site. We pull them from the primary filings so the numbers are the company's own reported figures.",
        ko: "배당과 현금흐름은 주가 사이트가 아니라 재무제표에 있습니다. 회사가 직접 공시한 숫자를 쓰기 위해 원천 공시에서 가져옵니다.",
      },
      sources: [
        {
          name: { en: "OpenDART (Korea)", ko: "OpenDART (한국)" },
          what: { en: "Audited annual/quarterly filings for Korean listed companies — dividends appear in the cash-flow statement and the notes.", ko: "한국 상장사의 감사받은 사업보고서/분기보고서 — 배당은 현금흐름표와 주석에 나타납니다." },
          why: { en: "It's the regulator's own database, so it's the source of record for KR fundamentals.", ko: "금융당국의 공식 데이터베이스라, 한국 기업 재무의 원천입니다." },
          url: "https://opendart.fss.or.kr/",
        },
        {
          name: { en: "SEC EDGAR (US)", ko: "SEC EDGAR (미국)" },
          what: { en: "US company filings (10-K/10-Q). Dividends paid show up in the financing section of the cash-flow statement.", ko: "미국 기업 공시(10-K/10-Q). 지급 배당은 현금흐름표의 재무활동 항목에 나옵니다." },
          why: { en: "Same idea for US names: the filing is the primary, verifiable source.", ko: "미국 기업도 동일합니다. 공시가 검증 가능한 원천입니다." },
          url: "https://www.sec.gov/edgar/searchedgar/companysearch",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull it yourself", ko: "직접 불러오기" },
      body: {
        en: "Type a ticker into the analyzer above and keep it in **dividend** mode. Read off five things:\n- **Dividend yield**\n- **Payout of earnings** (dividends ÷ net income)\n- **Payout of free cash flow** (dividends ÷ FCF)\n- **Dividend-growth streak** in years, and any **cut warning**\n- the **DPS-by-year chart** shape\n\nJot those five numbers down before you interpret anything — you'll judge each one in the next steps.",
        ko: "위 분석기에 종목 티커를 입력하고 **배당(dividend)** 모드로 둡니다. 다섯 가지를 읽어 적습니다.\n- **배당수익률**\n- **순이익 대비 배당성향** (배당 ÷ 순이익)\n- **잉여현금흐름 대비 배당성향** (배당 ÷ FCF)\n- **배당 증가 연속 연수**, 그리고 **삭감 경고** 여부\n- **연도별 주당배당금(DPS) 차트**의 모양\n\n해석하기 전에 이 다섯 숫자를 먼저 적어 두세요. 다음 단계에서 하나씩 판단합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Is the yield attractive — or a trap?", ko: "수익률이 매력적인가 — 아니면 함정인가?" },
      body: {
        en: "Yield is dividend ÷ price, so it rises when the dividend goes up **or when the price falls**. A yield far above peers is a flag, not a gift — the market may be pricing in a coming cut.\n\nRough rule of thumb: a yield **2–4×** a broad market index is interesting; something like **8%+** on a stock that isn't a REIT or a fund deserves suspicion until you've checked coverage below. High yield never substitutes for the safety questions that follow.",
        ko: "수익률은 배당 ÷ 주가라, 배당이 오르거나 **주가가 떨어지면** 올라갑니다. 동종업계보다 훨씬 높은 수익률은 선물이 아니라 경고 신호입니다. 시장이 다가올 삭감을 미리 반영하는 중일 수 있습니다.\n\n대략적인 기준으로, 시장 지수의 **2~4배** 수익률은 흥미로운 수준이고, 리츠나 펀드가 아닌데 **8% 이상**이면 아래 커버리지를 확인하기 전까지는 의심하는 편이 좋습니다. 높은 수익률이 뒤따르는 안전성 질문을 대신하지는 못합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Can earnings cover it? (payout of earnings)", ko: "이익으로 감당되는가? (순이익 대비 배당성향)" },
      body: {
        en: "Payout of earnings = dividends ÷ net income. It tells you how much of each dollar of profit is being handed back.\n- **Under ~60%** leaves a buffer for a bad year and room to keep raising — generally safer.\n- **60–100%** can be normal for a mature, stable business, but there's little cushion.\n- **Over 100%** means the company is paying out more than it earned — funded from cash reserves or debt, which can't last. Treat it as a warning.\n\nCaveat: one-off charges can depress net income for a single year, so a spike over 100% in one year isn't automatically fatal. Look at the trend, not one point.",
        ko: "순이익 대비 배당성향 = 배당 ÷ 순이익. 이익 1원 중 얼마를 주주에게 돌려주는지를 나타냅니다.\n- **약 60% 미만**이면 나쁜 해를 견딜 여유와 배당을 계속 늘릴 여지가 있어 대체로 안전합니다.\n- **60~100%**는 성숙하고 안정적인 사업에서는 정상일 수 있지만, 완충 여력이 거의 없습니다.\n- **100% 초과**는 번 것보다 많이 지급한다는 뜻으로, 현금 유보나 부채로 메우는 것이라 오래갈 수 없습니다. 경고로 받아들이세요.\n\n주의: 일회성 손실이 특정 해의 순이익을 눌러 놓을 수 있어, 한 해 100% 초과가 곧바로 치명적인 건 아닙니다. 한 점이 아니라 추세를 보세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Can real cash cover it? (payout of free cash flow)", ko: "진짜 현금으로 감당되는가? (잉여현금흐름 대비 배당성향)" },
      body: {
        en: "Earnings include non-cash items; **free cash flow is the actual cash left after running and maintaining the business**. Dividends are paid in cash, so FCF coverage is the tougher, more honest test.\n\nIf payout of earnings looks fine but **payout of FCF is over 100%**, the profit isn't turning into spendable cash — a classic red flag. The safest dividends are comfortably covered on **both** measures. FCF is lumpier than earnings (a big capex year can dent it), so again read a few years rather than one.",
        ko: "이익에는 비현금 항목이 섞여 있지만, **잉여현금흐름은 사업을 운영하고 유지한 뒤 실제로 남는 현금**입니다. 배당은 현금으로 지급되므로, FCF 커버리지가 더 엄격하고 정직한 시험입니다.\n\n순이익 대비 배당성향은 괜찮아 보이는데 **FCF 대비 배당성향이 100%를 넘는다면**, 이익이 쓸 수 있는 현금으로 바뀌지 않는 것으로 전형적인 위험 신호입니다. 가장 안전한 배당은 **두 지표 모두**에서 여유 있게 감당됩니다. FCF는 이익보다 변동이 커서(대규모 설비투자가 있는 해에는 크게 줄 수 있음), 역시 한 해가 아니라 몇 해를 함께 봐야 합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Has management kept the promise?", ko: "경영진이 약속을 지켜 왔는가?" },
      body: {
        en: "The chart and the streak tell you about discipline.\n- A **long growth streak** (many consecutive years of rising DPS) signals a management that treats the dividend as a commitment and has the earnings to back it.\n- A flat-but-steady DPS is fine — reliable if unexciting.\n- **A past cut is a broken promise.** The analyzer flags any year DPS fell. A cut doesn't mean \"never\", but it tells you this dividend can and did bend under pressure — weigh it heavily.\n\nRemember the streak is history, not a guarantee. A 20-year streak can still end next year if the business breaks.",
        ko: "차트와 연속 증가 연수는 경영진의 규율을 보여 줍니다.\n- **긴 증가 이력**(여러 해 연속 DPS 상승)은 배당을 약속으로 여기고 이를 뒷받침할 이익이 있는 경영진을 시사합니다.\n- 늘지 않아도 꾸준한 DPS는 괜찮습니다. 화려하지 않아도 믿을 만합니다.\n- **과거의 삭감은 깨진 약속입니다.** 분석기는 DPS가 줄어든 해를 표시합니다. 삭감이 \"다시는 안 됨\"을 뜻하진 않지만, 이 배당이 압박을 받으면 휘어질 수 있고 실제로 휘었음을 알려 줍니다. 무겁게 받아들이세요.\n\n연속 이력은 과거일 뿐 보장이 아닙니다. 20년 이력도 사업이 무너지면 내년에 끝날 수 있습니다.",
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
        { en: "Confirm the dividend and FCF figures against the company's actual filing (OpenDART / EDGAR), not just the analyzer.", ko: "배당과 FCF 수치를 분석기만이 아니라 회사의 실제 공시(OpenDART / EDGAR)와 대조해 확인했다." },
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
        en: "Value investing is one question asked carefully: **is the price today below what the business is worth?** To answer it we go in order:\n- What are **conservative** assumptions for growth, terminal growth, and discount rate?\n- What **intrinsic value per share** do those give?\n- How big is the **margin of safety** versus the current price?\n- How much of that value is just **terminal value** — the distant, least-knowable part?\n- As a sanity check, does a no-forecast yardstick (**earnings yield / return on capital**) agree?\n\nThe goal isn't a precise number — it's deciding whether there's enough of a cushion to be wrong and still be fine.",
        ko: "가치투자는 신중하게 던지는 한 가지 질문입니다. **오늘의 가격이 사업의 가치보다 낮은가?** 답하기 위해 순서대로 갑니다.\n- 성장률, 영구성장률, 할인율에 대한 **보수적인** 가정은 무엇인가?\n- 그 가정이 주는 **주당 내재가치**는 얼마인가?\n- 현재 주가 대비 **안전마진**은 얼마나 큰가?\n- 그 가치 중 얼마가 **잔존가치**, 즉 가장 알기 어려운 먼 미래 부분인가?\n- 점검용으로, 예측이 필요 없는 잣대(**이익수익률 / 자본이익률**)도 같은 방향을 가리키는가?\n\n목표는 정밀한 숫자가 아닙니다. 틀려도 괜찮을 만큼 완충이 충분한지를 판단하는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터의 출처" },
      body: {
        en: "A DCF is only as good as the cash-flow history you anchor it to. Those figures come from the filings; the analyzer seeds the sliders from reported numbers, but you should know their origin.",
        ko: "DCF는 기준으로 삼는 현금흐름 이력만큼만 좋습니다. 그 수치는 공시에서 나오고, 분석기가 보고된 숫자로 슬라이더를 초기화하지만, 출처를 알아 두는 편이 좋습니다.",
      },
      sources: [
        {
          name: { en: "OpenDART (Korea)", ko: "OpenDART (한국)" },
          what: { en: "Historical free cash flow, operating income (EBIT), invested capital and share count for KR companies.", ko: "한국 기업의 과거 잉여현금흐름, 영업이익(EBIT), 투하자본, 주식 수." },
          why: { en: "Your growth and terminal assumptions should be grounded in this actual history, not hope.", ko: "성장률과 잔존가치 가정은 희망이 아니라 이 실제 이력에 근거해야 합니다." },
          url: "https://opendart.fss.or.kr/",
        },
        {
          name: { en: "SEC EDGAR (US)", ko: "SEC EDGAR (미국)" },
          what: { en: "The same fundamentals for US names, from 10-K/10-Q filings.", ko: "미국 기업의 동일한 재무 데이터, 10-K/10-Q 공시에서." },
          why: { en: "Primary source for the FCF and EBIT the model depends on.", ko: "모델이 의존하는 FCF와 EBIT의 원천입니다." },
          url: "https://www.sec.gov/edgar/searchedgar/companysearch",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull it yourself", ko: "직접 불러오기" },
      body: {
        en: "Enter a ticker and switch the analyzer to **value** mode. Then set the three sliders **conservatively**:\n- **FCF growth (next 5 yrs)** — start at or below the recent history; don't extrapolate a boom.\n- **Terminal growth** — a small number (roughly a long-run GDP/inflation rate, e.g. 2–3%); it must be below your discount rate.\n- **Discount rate** — your required return; higher for riskier businesses.\n\nRead off: **intrinsic value per share**, **margin of safety** vs price, **% of value from terminal value**, plus the **earnings yield (EBIT/EV)** and **return on capital**. Note whether the terminal-value warning is showing.",
        ko: "티커를 입력하고 분석기를 **가치(value)** 모드로 바꿉니다. 그런 다음 세 슬라이더를 **보수적으로** 설정합니다.\n- **FCF 성장률(향후 5년)** — 최근 이력 수준이나 그 이하에서 시작하세요. 호황을 연장하지 마세요.\n- **영구성장률** — 작은 수(대략 장기 GDP/물가 상승률, 예: 2~3%). 반드시 할인율보다 낮아야 합니다.\n- **할인율** — 당신이 요구하는 수익률. 위험한 사업일수록 높게.\n\n다음을 읽어 적습니다. **주당 내재가치**, 주가 대비 **안전마진**, **잔존가치가 차지하는 비중(%)**, 그리고 **이익수익률(EBIT/EV)**과 **자본이익률**. 잔존가치 경고가 떠 있는지도 확인하세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Set conservative inputs first", ko: "먼저 보수적인 가정을 세운다" },
      body: {
        en: "A DCF will output whatever you feed it, so the discipline is in the inputs. Two habits keep you honest:\n- **Anchor growth to the past, then haircut it.** If FCF grew 8% historically, testing 4–5% forces the business to earn your optimism.\n- **Keep terminal growth humble.** No company outgrows the whole economy forever, so a terminal rate above ~3% is usually wishful.\n\nRun it once with your base case, then nudge growth down and the discount rate up to see how fast the value falls. A value that only works with aggressive inputs isn't a bargain — it's a bet.",
        ko: "DCF는 넣는 대로 뱉어내므로, 규율은 입력값에 있습니다. 두 가지 습관이 정직함을 지켜 줍니다.\n- **성장률을 과거에 고정하고, 거기서 깎으세요.** 과거 FCF가 8% 성장했다면 4~5%로 시험해 사업이 당신의 낙관을 스스로 증명하게 만드세요.\n- **영구성장률은 겸손하게.** 어떤 회사도 경제 전체를 영원히 앞지르지 못하므로, 약 3%를 넘는 영구성장률은 대개 희망사항입니다.\n\n기본 시나리오로 한 번 돌린 뒤, 성장률을 낮추고 할인율을 높여 가치가 얼마나 빨리 떨어지는지 보세요. 공격적인 입력값에서만 성립하는 가치는 저가 매수가 아니라 베팅입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the margin of safety", ko: "안전마진 읽기" },
      body: {
        en: "Margin of safety = how far the current price sits **below** your intrinsic value. It exists because your estimate is uncertain, so you want to be paid for that uncertainty.\n- A **positive margin (price below value)** is the whole point; the bigger, the more room to be wrong.\n- A rough bar many value investors use is **~25%+** before acting; more for shakier businesses.\n- **Negative margin (price above your value)** means no cushion at these assumptions — pass, or revisit whether your inputs were too pessimistic.\n\nThe cushion is your protection against a modeling error, not a target return.",
        ko: "안전마진 = 현재 주가가 당신이 계산한 내재가치보다 **얼마나 아래**에 있는지입니다. 당신의 추정이 불확실하기 때문에 존재하며, 그 불확실성에 대한 대가를 받고자 하는 것입니다.\n- **양(+)의 마진(가치보다 낮은 주가)**이 핵심입니다. 클수록 틀릴 여지가 큽니다.\n- 많은 가치투자자가 쓰는 대략적 기준은 실행 전 **약 25% 이상**이며, 불안정한 사업일수록 더 크게 봅니다.\n- **음(-)의 마진(가치보다 높은 주가)**은 이 가정에서 완충이 없다는 뜻입니다. 지나치거나, 입력값이 지나치게 비관적이지 않았는지 다시 보세요.\n\n완충은 목표 수익률이 아니라 모델링 오류에 대한 보호막입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Distrust value that's mostly terminal", ko: "잔존가치에 쏠린 가치를 의심하라" },
      body: {
        en: "The terminal value is everything past the 5-year forecast — the most distant, least knowable cash. The analyzer shows **what % of intrinsic value comes from it** and warns when that share is high.\n- If **most of the value** (say well over ~70–75%) sits in the terminal, your \"valuation\" is really a bet on assumptions decades out.\n- A high terminal share magnifies tiny changes: nudging terminal growth or the discount rate by half a point can swing the answer wildly.\n\nThis doesn't make the stock bad, but it means your margin of safety needs to be larger and your terminal-growth assumption extra humble.",
        ko: "잔존가치는 5년 예측 이후의 모든 것, 즉 가장 멀고 가장 알기 어려운 현금입니다. 분석기는 **내재가치 중 잔존가치의 비중(%)**을 보여 주고, 그 비중이 높으면 경고합니다.\n- **가치의 대부분**(가령 약 70~75%를 훌쩍 넘는)이 잔존가치에 있다면, 당신의 \"가치평가\"는 사실상 수십 년 뒤 가정에 대한 베팅입니다.\n- 높은 잔존가치 비중은 작은 변화를 증폭합니다. 영구성장률이나 할인율을 0.5%포인트만 움직여도 답이 크게 흔들릴 수 있습니다.\n\n이것이 주식을 나쁘게 만들지는 않지만, 그만큼 안전마진은 더 커야 하고 영구성장률 가정은 한층 더 겸손해야 합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Cross-check with a no-forecast yardstick", ko: "예측이 필요 없는 잣대로 교차 확인" },
      body: {
        en: "A DCF depends on forecasts; Greenblatt's two ratios don't, so they're a useful reality check.\n- **Earnings yield = EBIT / enterprise value.** How much the business earns relative to what you'd pay to own all of it (equity + debt). Higher is cheaper; compare it to a bond yield to see if you're being paid for the risk.\n- **Return on capital** = how efficiently the business turns capital into operating profit. Higher means a better-quality business.\n\nIf the DCF screams \"cheap\" but earnings yield is thin and return on capital is poor, your DCF is probably leaning on optimistic growth. When both approaches point the same way, you can hold your view with more confidence.",
        ko: "DCF는 예측에 의존하지만, 그린블라트의 두 비율은 그렇지 않아 유용한 현실 점검이 됩니다.\n- **이익수익률 = EBIT / 기업가치(EV).** 회사 전체를 사는 데 드는 값(자기자본 + 부채) 대비 벌어들이는 정도입니다. 높을수록 쌉니다. 채권 수익률과 비교해 위험에 대한 보상을 받는지 보세요.\n- **자본이익률** = 사업이 자본을 영업이익으로 얼마나 효율적으로 바꾸는지입니다. 높을수록 질 좋은 사업입니다.\n\nDCF는 \"싸다\"고 외치는데 이익수익률이 얇고 자본이익률이 낮다면, 그 DCF는 낙관적 성장률에 기대고 있을 가능성이 큽니다. 두 접근이 같은 방향을 가리킬 때 더 자신 있게 판단할 수 있습니다.",
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
        en: "Commit in writing: at today's price, is there a margin of safety — **buy / watch / pass**? State your intrinsic value, the margin of safety %, and the % of value from terminal value, then say whether the earnings yield agreed. Be explicit about the one assumption that most drives your value, and what price would give you the ~25% cushion you'd want.",
        ko: "글로 확정하세요. 오늘의 주가에서 안전마진이 있는가 — **매수 / 관찰 / 회피**? 당신의 내재가치, 안전마진 %, 잔존가치 비중 %를 적고, 이익수익률이 같은 방향이었는지 밝히세요. 당신의 가치를 가장 크게 좌우하는 가정 하나를 분명히 하고, 원하는 약 25% 완충을 주는 주가가 얼마인지도 적으세요.",
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
        { en: "Verify the seed FCF/EBIT numbers against the actual filing, since the whole model rests on them.", ko: "모델 전체가 기대고 있는 만큼, 초기 FCF/EBIT 숫자를 실제 공시와 대조해 검증했다." },
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
        en: "For a REIT the question is the same as any income stock — **is the distribution covered and reliable?** — but the usual tool is broken here, so mind the trap first:\n- A REIT's **payout of net income often looks impossible (well over 100%)**. That usually doesn't mean the distribution is unfunded.\n- The reason is **depreciation**: REITs own buildings, and accounting forces a big non-cash depreciation charge that crushes net income even while the cash rent keeps flowing.\n- That's exactly why REITs report **FFO (funds from operations)** and **AFFO**, which add that non-cash charge back.\n\nSo our loop is: don't trust the net-income payout, understand why, then go find the FFO-based coverage yourself.",
        ko: "리츠에서도 질문은 다른 인컴 주식과 같습니다 — **분배금이 감당되고 믿을 만한가?** — 하지만 평소 쓰던 도구가 여기서는 고장 나 있으니, 함정부터 조심합니다.\n- 리츠의 **순이익 대비 배당성향은 종종 불가능해 보입니다(100%를 훌쩍 넘음).** 그렇다고 분배금이 재원 없이 지급된다는 뜻은 대개 아닙니다.\n- 이유는 **감가상각**입니다. 리츠는 건물을 보유하는데, 회계상 큰 비현금 감가상각비가 강제되어 임대 현금은 계속 들어오는데도 순이익을 짓눌러 버립니다.\n- 바로 그래서 리츠는 그 비현금 비용을 다시 더해 주는 **FFO(운영자금)**와 **AFFO**를 보고합니다.\n\n그래서 우리의 흐름은 이렇습니다. 순이익 기준 배당성향을 믿지 말고, 그 이유를 이해한 뒤, FFO 기준 커버리지를 직접 찾아 확인하는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the data comes from", ko: "데이터의 출처" },
      body: {
        en: "We can pull yield, net income and the DPS record automatically, but **true FFO/AFFO is non-GAAP and isn't in the structured XBRL data**, so no analyzer can fetch it reliably. You have to read it out of the filing — here's exactly where to look.",
        ko: "수익률, 순이익, DPS 이력은 자동으로 가져올 수 있지만, **진짜 FFO/AFFO는 비(非)GAAP 수치라 구조화된 XBRL 데이터에 들어 있지 않습니다.** 그래서 어떤 분석기도 이를 안정적으로 가져올 수 없습니다. 공시에서 직접 읽어야 하며, 정확히 어디를 봐야 하는지 알려 드립니다.",
      },
      sources: [
        {
          name: { en: "SEC EDGAR (US) — supplemental & FFO reconciliation", ko: "SEC EDGAR (미국) — 보충자료 및 FFO 조정표" },
          what: { en: "In a US REIT's 10-K/10-Q and quarterly supplemental, find the \"reconciliation of net income to FFO\" and the AFFO table.", ko: "미국 리츠의 10-K/10-Q와 분기 보충자료(supplemental)에서 \"순이익→FFO 조정표\"와 AFFO 표를 찾으세요." },
          why: { en: "This is where the company itself defines and reports the coverage figure that net income hides.", ko: "회사가 직접 FFO를 정의하고, 순이익이 감추는 커버리지 수치를 보고하는 곳입니다." },
          url: "https://www.sec.gov/edgar/searchedgar/companysearch",
        },
        {
          name: { en: "OpenDART (Korea) — REIT reports", ko: "OpenDART (한국) — 리츠 보고서" },
          what: { en: "For KR REITs (리츠), the business report's financial notes and distribution schedule show distributable income and payout detail.", ko: "한국 리츠는 사업보고서의 재무 주석과 배당(분배) 관련 항목에서 배당가능이익과 분배 내역을 보여 줍니다." },
          why: { en: "KR REIT rules center on distributable profit; the filing spells out the basis for the payout.", ko: "한국 리츠 제도는 배당가능이익을 중심으로 하며, 공시가 분배의 근거를 명시합니다." },
          url: "https://opendart.fss.or.kr/",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Pull it yourself", ko: "직접 불러오기" },
      body: {
        en: "Enter the REIT's ticker and put the analyzer in **reit** mode. It leads with the FFO-trap hook. Read off:\n- **Dividend/distribution yield**\n- **Payout of net income** — and notice if it's over 100% or flagged as unreliable for a REIT\n- **DPS-by-year chart** and any **cut warning**\n\nDeliberately **do not** treat the net-income payout as the coverage answer here. You're noting it precisely so you can see the trap, then you'll go get the real number from the filing.",
        ko: "리츠의 티커를 입력하고 분석기를 **리츠(reit)** 모드로 둡니다. 이 모드는 FFO 함정 안내로 시작합니다. 다음을 읽어 적습니다.\n- **배당(분배) 수익률**\n- **순이익 대비 배당성향** — 100%를 넘는지, 리츠에서는 신뢰할 수 없다고 표시되는지 확인\n- **연도별 DPS 차트**와 **삭감 경고** 여부\n\n여기서는 순이익 기준 배당성향을 커버리지의 답으로 **일부러 취급하지 마세요.** 함정을 눈으로 보기 위해 기록해 두는 것이며, 진짜 숫자는 공시에서 가져올 것입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Why the net-income payout lies", ko: "왜 순이익 기준 배당성향이 거짓말을 하는가" },
      body: {
        en: "Buildings wear out on paper faster than in reality. Accounting makes a REIT record **depreciation** every year as an expense, which slashes reported net income — but no cash actually left the company for it. Meanwhile tenants keep paying rent in real cash.\n\nSo when you compute distributions ÷ net income, the denominator has been artificially shrunk, and the ratio balloons past 100%. For a normal industrial company that would scream danger; for a REIT it's often just the accounting. **This is why you never judge a REIT on the earnings payout ratio** — it's measuring against the wrong number.",
        ko: "건물은 실제보다 장부에서 더 빨리 낡습니다. 회계는 리츠가 매년 **감가상각비**를 비용으로 기록하게 만들고, 이는 보고 순이익을 크게 깎아냅니다 — 하지만 그 대가로 실제 현금이 빠져나간 것은 아닙니다. 그동안 세입자는 실제 현금으로 계속 임대료를 냅니다.\n\n그래서 분배금 ÷ 순이익을 계산하면 분모가 인위적으로 줄어 있어 비율이 100%를 훌쩍 넘어 부풀어 오릅니다. 평범한 제조업체라면 위험 신호이겠지만, 리츠에서는 대개 회계 탓일 뿐입니다. **바로 이 때문에 리츠를 이익 기준 배당성향으로 판단하면 안 됩니다** — 애초에 잘못된 숫자에 대고 재고 있는 것입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Find FFO and AFFO in the filing", ko: "공시에서 FFO와 AFFO 찾기" },
      body: {
        en: "Go to the filing and find the company's own **reconciliation of net income to FFO** (usually in the earnings release, 10-Q, or quarterly supplemental). The standard move is: start from net income, **add back real-estate depreciation and amortization**, adjust for property-sale gains/losses → **FFO**. Subtract recurring capex and a few adjustments → **AFFO** (the stricter, more cash-like figure).\n\nThen compute the coverage the analyzer can't:\n- **FFO (or AFFO) payout = distributions ÷ FFO (or AFFO).**\n- **Comfortably under 100%** means the distribution is covered by the REIT's real operating cash — AFFO under ~90–100% is the reassuring case.\n- **Over 100% on AFFO** means it's paying out more cash than it's really generating, funded by debt, asset sales, or new shares — the genuine warning a REIT can show.",
        ko: "공시로 가서 회사가 직접 만든 **순이익→FFO 조정표**를 찾으세요(대개 실적 발표자료, 10-Q, 분기 보충자료에 있습니다). 표준 방식은 이렇습니다. 순이익에서 출발해 **부동산 감가상각비를 다시 더하고**, 부동산 매각 손익을 조정 → **FFO**. 여기서 반복적 자본지출과 몇 가지 조정을 빼면 → **AFFO**(더 엄격하고 현금에 가까운 수치).\n\n그런 다음 분석기가 못 하는 커버리지를 계산합니다.\n- **FFO(또는 AFFO) 배당성향 = 분배금 ÷ FFO(또는 AFFO).**\n- **100%보다 여유 있게 낮으면** 분배금이 리츠의 실제 영업현금으로 감당되는 것입니다 — AFFO 기준 약 90~100% 미만이면 안심할 수 있는 경우입니다.\n- **AFFO 기준 100%를 넘으면** 실제로 벌어들이는 것보다 많은 현금을 지급하는 것으로, 부채·자산 매각·신주 발행으로 메우는 것입니다 — 리츠가 보일 수 있는 진짜 경고입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Check the yield and the distribution record", ko: "수익률과 분배 이력 확인" },
      body: {
        en: "With the coverage question handled honestly, use the two figures the analyzer does show well:\n- **Yield** — REITs are held for income, so the level matters, but the same trap logic applies: a yield far above comparable REITs can mean the market expects a cut. Sanity-check it against the FFO coverage you just computed.\n- **The DPS/distribution chart and cut warning** — a steady or rising distribution across cycles signals a durable portfolio and disciplined management; a past cut (common in REITs during downturns or rate shocks) tells you how the distribution behaves under stress.\n\nA reliable REIT income stream usually shows: reasonable yield, AFFO payout under 100%, and a distribution record that didn't collapse at the first bad year.",
        ko: "커버리지 질문을 정직하게 처리했으니, 분석기가 잘 보여 주는 두 수치를 활용합니다.\n- **수익률** — 리츠는 인컴을 위해 보유하므로 수준이 중요하지만, 같은 함정 논리가 적용됩니다. 비슷한 리츠보다 훨씬 높은 수익률은 시장이 삭감을 예상한다는 뜻일 수 있습니다. 방금 계산한 FFO 커버리지와 대조해 점검하세요.\n- **DPS/분배 차트와 삭감 경고** — 여러 경기 국면에 걸쳐 꾸준하거나 늘어나는 분배는 견고한 포트폴리오와 규율 있는 경영진을 시사합니다. 과거 삭감(리츠는 경기 침체나 금리 충격 때 흔합니다)은 분배금이 스트레스 아래에서 어떻게 움직이는지 알려 줍니다.\n\n믿을 만한 리츠 인컴은 대개 이렇게 보입니다. 합리적인 수익률, 100% 미만의 AFFO 배당성향, 그리고 첫 나쁜 해에 무너지지 않은 분배 이력.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Bring together the FFO-based coverage you found, the yield, and the distribution record.",
        ko: "당신이 찾은 FFO 기준 커버리지, 수익률, 분배 이력을 한데 모으세요.",
      },
      prompt: {
        en: "Write it down: on an **FFO/AFFO basis you found yourself**, is this REIT's distribution actually covered — **rely / watch / avoid**? Quote the FFO or AFFO payout you computed (and the source line in the filing), the yield, and the distribution record. Explicitly note that you are NOT relying on the net-income payout, and why. Say what would flip your view (e.g. \"if AFFO payout crosses 100%\").",
        ko: "직접 적어 보세요. **당신이 직접 찾은 FFO/AFFO 기준으로**, 이 리츠의 분배금은 실제로 감당되는가 — **의지 / 관찰 / 회피**? 계산한 FFO 또는 AFFO 배당성향(그리고 공시의 근거 줄), 수익률, 분배 이력을 인용하세요. 순이익 기준 배당성향에 의존하지 않는다는 점과 그 이유를 분명히 적으세요. 무엇이 판단을 뒤집을지도 적으세요(예: \"AFFO 배당성향이 100%를 넘으면\").",
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
        { en: "Check the distribution record for any past cut and how the REIT explained it.", ko: "분배 이력에서 과거 삭감이 있었는지, 리츠가 그것을 어떻게 설명했는지 확인했다." },
        { en: "Cross-check the yield against comparable REITs so an outlier yield doesn't lull you.", ko: "이상하게 높은 수익률에 방심하지 않도록, 수익률을 비슷한 리츠들과 교차 확인했다." },
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
        en: "You are about to compare four preset portfolios. Before you read a single number, decide what you are actually asking. Work through these in order:\n- **Return** — how fast does each mix grow? (CAGR, and **real CAGR** after inflation.)\n- **The ride** — how violently does it swing along the way? (volatility.)\n- **The worst moment** — how deep is the worst peak-to-trough fall? (max drawdown.)\n- **The tradeoff** — is a smoother ride worth giving up some return? That is a question about *you*, not about the data.\nThe whole point of this lab is that a portfolio is not \"good\" or \"bad\" in the abstract. It is good or bad *for a specific person who has to hold it through the worst year*.",
        ko: "이제 네 가지 프리셋 포트폴리오를 비교합니다. 숫자 하나를 읽기 전에, 무엇을 묻고 있는지부터 정합니다. 순서대로 짚어봅니다.\n- **수익률** — 각 조합은 얼마나 빨리 불어나는가? (CAGR, 그리고 물가를 반영한 **실질 CAGR**.)\n- **여정** — 그 과정에서 얼마나 심하게 출렁이는가? (변동성.)\n- **최악의 순간** — 고점 대비 가장 깊은 하락은 얼마나 되는가? (최대 낙폭, MDD.)\n- **맞바꿈** — 더 부드러운 여정을 위해 수익 일부를 포기할 가치가 있는가? 이건 데이터가 아니라 *당신*에 대한 질문입니다.\n이 랩의 핵심은, 포트폴리오에 그 자체로 \"좋다/나쁘다\"가 없다는 점입니다. *최악의 해를 끝까지 버텨야 하는 특정한 사람*에게 좋거나 나쁠 뿐입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where these returns come from", ko: "이 수익률의 출처" },
      body: {
        en: "This lab does not fetch live prices. It runs on a pre-ingested static dataset of **annual total returns, 1928–2025**, for US stocks, small-cap, T-bills, T-bonds, corporate bonds, real estate, and gold — plus inflation. That is why you can backtest a full century in a click. Know your source, and know its limits.",
        ko: "이 랩은 실시간 시세를 불러오지 않습니다. 미국 주식, 소형주, 단기국채, 장기국채, 회사채, 부동산, 금의 **1928~2025년 연간 총수익률**과 물가 자료를 미리 담아둔 정적 데이터셋 위에서 돌아갑니다. 그래서 100년치를 한 번의 클릭으로 백테스트할 수 있습니다. 출처를 알고, 그 한계도 알아둡니다.",
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
      kind: "tool",
      title: { en: "Run the comparison", ko: "비교 돌려보기" },
      body: {
        en: "Now drive the analyzer. Do this deliberately:\n- Pick a **preset**: 100% stocks, 60/40, All-Weather (30% stocks / 40% long bonds / 15% T-bills / 7.5% gold / 7.5% real estate), or Permanent (roughly equal quarters).\n- Choose a **start year** and a **rebalance** setting.\n- Read the four panels: the **growth-vs-stocks line**, the **drawdown chart**, the **allocation bar**, and the **6-stat grid** (CAGR, real CAGR, volatility, Sharpe, max drawdown).\nRun each preset over the *same* start year first so the comparison is fair. Then try 100% stocks vs 60/40 starting in **2007** — watch the drawdown chart through 2008.",
        ko: "이제 분석기를 직접 조작합니다. 신중하게 진행합니다.\n- **프리셋**을 고릅니다: 100% 주식, 60/40, 올웨더(주식 30% / 장기채 40% / 단기국채 15% / 금 7.5% / 부동산 7.5%), 또는 퍼머넌트(대략 4등분).\n- **시작 연도**와 **리밸런싱** 설정을 선택합니다.\n- 네 개 패널을 읽습니다: **주식 대비 성장 곡선**, **낙폭 차트**, **자산배분 막대**, **6개 지표 그리드**(CAGR, 실질 CAGR, 변동성, 샤프, 최대 낙폭).\n공정한 비교를 위해 먼저 *같은* 시작 연도로 각 프리셋을 돌립니다. 그다음 **2007년** 시작으로 100% 주식과 60/40을 비교하고, 2008년을 지나는 낙폭 차트를 지켜봅니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read CAGR and real CAGR together", ko: "CAGR과 실질 CAGR을 함께 읽기" },
      body: {
        en: "CAGR is the smoothed annual growth rate. **Real CAGR** subtracts inflation — it is what your purchasing power actually did.\n- A gap of ~2–4 points between nominal and real CAGR is normal; that gap *is* inflation quietly eating returns.\n- 100% stocks usually posts the highest CAGR. That is expected — it is the reward for taking the most risk.\n- Do not stop here. A higher CAGR earned through a 55% drawdown you sold into is worth *less* than a lower CAGR you actually held. The number only counts if you stay invested.",
        ko: "CAGR은 매끄럽게 다듬은 연평균 성장률입니다. **실질 CAGR**은 물가를 뺀 것으로, 실제 구매력이 어떻게 됐는지를 보여줍니다.\n- 명목과 실질 CAGR 사이의 2~4%p 정도 차이는 정상입니다. 그 차이가 바로 물가가 조용히 갉아먹은 수익입니다.\n- 보통 100% 주식이 가장 높은 CAGR을 기록합니다. 당연합니다. 가장 큰 위험을 감수한 대가니까요.\n- 여기서 멈추면 안 됩니다. 55% 낙폭 구간에서 팔아버린 채 얻은 높은 CAGR은, 끝까지 들고 있었던 낮은 CAGR보다 *가치가 낮습니다*. 숫자는 계속 투자하고 있을 때만 의미가 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read max drawdown as \"could I have held?\"", ko: "최대 낙폭을 \"내가 버틸 수 있었을까?\"로 읽기" },
      body: {
        en: "Max drawdown is the worst peak-to-trough loss. Translate it into money you own: a **50% drawdown** on a ₩100M portfolio means watching it sit at ₩50M — for months, sometimes years — with no promise it recovers.\n- 100% stocks has hit **~50–55%** in the worst episodes (2008, 1930s).\n- Diversified mixes like 60/40 or All-Weather typically cut the worst drawdown to roughly **20–35%**.\nAsk yourself honestly, not heroically: at what paper loss would you actually have sold? That number is your real risk limit — everything above it is fantasy.",
        ko: "최대 낙폭은 고점 대비 최악의 손실입니다. 이걸 내가 가진 돈으로 바꿔봅니다. 1억 원 포트폴리오의 **50% 낙폭**은 그것이 5천만 원에 머무는 걸 몇 달, 때로는 몇 년 동안, 회복 보장도 없이 지켜본다는 뜻입니다.\n- 100% 주식은 최악의 국면(2008년, 1930년대)에서 **약 50~55%**까지 떨어진 적이 있습니다.\n- 60/40이나 올웨더 같은 분산 조합은 보통 최악 낙폭을 대략 **20~35%**로 줄입니다.\n영웅적으로 말고 정직하게 자문합니다: 나는 평가손실이 몇 %일 때 실제로 팔았을까요? 그 숫자가 당신의 진짜 위험 한도이고, 그 위는 전부 환상입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "2008 vs 2022: why diversification is not a guarantee", ko: "2008 vs 2022: 분산이 보장이 아닌 이유" },
      body: {
        en: "Diversification works when your holdings fall at *different times*. It fails when they fall *together*.\n- **2008**: stocks crashed, but long bonds *rose* as investors fled to safety. A 60/40 or All-Weather holder felt a real but softer blow — bonds cushioned the fall.\n- **2022**: stocks AND bonds fell together as inflation and rate hikes hit both. Diversification gave far less protection that year.\nThe lesson: diversification lowers the *odds* and usually the *depth* of a bad year, but it does not promise safety. Any mix can have a painful year.",
        ko: "분산은 보유 자산들이 *서로 다른 시점*에 떨어질 때 효과가 있습니다. *함께* 떨어지면 실패합니다.\n- **2008년**: 주식은 폭락했지만, 안전자산으로 돈이 몰리며 장기채는 *올랐습니다*. 60/40이나 올웨더 보유자는 타격을 받되 더 부드럽게 받았습니다. 채권이 하락을 완충했습니다.\n- **2022년**: 물가와 금리 인상이 둘 다를 때리며 주식과 채권이 *함께* 떨어졌습니다. 그해엔 분산의 보호 효과가 훨씬 약했습니다.\n교훈: 분산은 나쁜 해의 *확률*과 대개 그 *깊이*를 낮추지만, 안전을 약속하지는 않습니다. 어떤 조합이든 고통스러운 해가 올 수 있습니다.",
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
        en: "Pick ONE preset you would actually hold and write two or three sentences: (1) its CAGR, real CAGR, and max drawdown from the tool; (2) the largest paper loss you believe you could hold through without selling; (3) why this mix — not the highest-CAGR one — fits the ride you can stomach. Name the tradeoff you are accepting out loud.",
        ko: "실제로 보유할 프리셋 하나를 고르고 두세 문장으로 적습니다: (1) 도구에서 본 CAGR, 실질 CAGR, 최대 낙폭; (2) 팔지 않고 버틸 수 있다고 믿는 최대 평가손실; (3) 왜 가장 높은 CAGR짜리가 아니라 이 조합이 당신이 견딜 수 있는 여정에 맞는지. 당신이 받아들이는 맞바꿈을 소리 내어 이름 붙입니다.",
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
        en: "Fees feel invisible because they are quoted as a tiny annual percentage. This lab makes them visible. Ask, in order:\n- **How much does a fee actually cost** over a multi-decade holding period, in money, not percent?\n- **Why does a small fee become a big number?** (Hint: it compounds every year, against your whole balance, forever.)\n- **Lump-sum or dollar-cost-averaging** — invest all at once, or spread it out? Which wins on average, and which lets me sleep?\nA fee is the one variable in investing you fully control. Returns you can't. This is worth getting right.",
        ko: "수수료는 아주 작은 연간 퍼센트로 표시되기 때문에 눈에 잘 띄지 않습니다. 이 랩은 그걸 눈에 보이게 만듭니다. 순서대로 묻습니다.\n- 수십 년 보유 기간 동안 수수료는 퍼센트가 아니라 **돈으로 실제 얼마가 드는가?**\n- **작은 수수료가 왜 큰 숫자가 되는가?** (힌트: 매년, 전체 잔고에 대해, 영원히 복리로 붙습니다.)\n- **일시투자 vs 분할매수** — 한 번에 다 넣을까, 나눠 넣을까? 평균적으로 무엇이 이기고, 무엇이 마음 편할까?\n수수료는 투자에서 당신이 완전히 통제할 수 있는 유일한 변수입니다. 수익률은 못 합니다. 제대로 정할 가치가 있습니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the growth numbers come from", ko: "성장 숫자의 출처" },
      body: {
        en: "The fee drag is not a guess — it is applied to real historical market growth. This lab reuses the same static dataset as the other allocation labs, so the \"lost to fees\" figure reflects what fees would have skimmed off actual multi-decade returns.",
        ko: "수수료로 인한 손실은 추정이 아니라, 실제 과거 시장 성장에 적용한 값입니다. 이 랩은 다른 자산배분 랩과 동일한 정적 데이터셋을 재사용하므로, \"수수료로 잃은 금액\"은 실제 수십 년 수익에서 수수료가 걷어갔을 몫을 반영합니다.",
      },
      sources: [
        {
          name: { en: "Damodaran NYU returns + Minneapolis Fed CPI", ko: "다모다란 NYU 수익률 + 미니애폴리스 연은 CPI" },
          what: { en: "Annual US total returns 1928–2025 (drives the growth curve) plus CPI (for real, after-inflation values).", ko: "1928~2025년 미국 연간 총수익률(성장 곡선을 만듭니다)과 CPI(실질, 물가 반영 값용)." },
          why: { en: "A fee is only meaningful against real compounding. Using genuine historical returns shows the drag as it actually would have played out, not on a made-up constant rate.", ko: "수수료는 실제 복리 위에서만 의미가 있습니다. 진짜 과거 수익률을 쓰면, 지어낸 고정 수익률이 아니라 실제로 벌어졌을 방식대로 그 손실이 드러납니다." },
          url: "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Run the fee simulator", ko: "수수료 시뮬레이터 돌려보기" },
      body: {
        en: "Drive the analyzer step by step:\n- Set a **start year** far enough back to see decades compound (try the earliest, or ~40 years ago).\n- Toggle **lump-sum vs dollar-cost-averaging (DCA)**.\n- Drag the **fee slider** from 0.1% up toward 2%.\nWatch two things: the **final value at a low fee vs your chosen fee**, and the **amount \"lost to fees\"**. Move the slider slowly from 0.1% to 1% and watch the lost-to-fees number climb far faster than the fee itself does. That acceleration is the whole lesson.",
        ko: "분석기를 단계별로 조작합니다.\n- 수십 년의 복리를 볼 수 있을 만큼 과거로 **시작 연도**를 설정합니다(가장 이른 해, 또는 약 40년 전).\n- **일시투자 vs 분할매수(DCA)**를 전환합니다.\n- **수수료 슬라이더**를 0.1%에서 2%까지 끌어올립니다.\n두 가지를 봅니다: **낮은 수수료일 때와 선택한 수수료일 때의 최종 금액**, 그리고 **\"수수료로 잃은 금액\"**. 슬라이더를 0.1%에서 1%로 천천히 옮기며, 잃은 금액이 수수료 자체보다 훨씬 빠르게 불어나는 걸 지켜봅니다. 그 가속이 이 랩의 핵심입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the \"lost to fees\" number honestly", ko: "\"수수료로 잃은 금액\"을 정직하게 읽기" },
      body: {
        en: "Over ~40 years, a **1% annual fee can quietly consume roughly a quarter of your ending balance** versus a near-zero fee. Not 1% — around 25%. That is because the fee is charged every year on the *whole* pot, so it also steals all the future growth that money would have earned.\n- The drag compounds: each year's fee removes capital that can never compound again.\n- The longer the horizon, the worse it gets — young investors pay the most in total.\n- This is why the difference between a 0.05% index fund and a 1% fund is not \"a little more expensive.\" It is a materially different retirement.",
        ko: "약 40년에 걸쳐, **연 1% 수수료는 거의 0에 가까운 수수료 대비 최종 잔고의 약 4분의 1을 조용히 삼킬 수 있습니다**. 1%가 아니라 약 25%입니다. 수수료가 매년 *전체* 자산에 부과되기 때문에, 그 돈이 벌었을 미래 성장까지 함께 훔쳐가기 때문입니다.\n- 손실은 복리로 커집니다: 매년의 수수료가 다시는 복리로 불어날 수 없는 원금을 떼어갑니다.\n- 기간이 길수록 더 나빠집니다. 젊은 투자자가 총액으로는 가장 많이 냅니다.\n- 그래서 0.05% 인덱스 펀드와 1% 펀드의 차이는 \"조금 더 비싸다\"가 아닙니다. 실질적으로 다른 노후입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Lump-sum vs DCA: math vs regret", ko: "일시투자 vs 분할매수: 수학 vs 후회" },
      body: {
        en: "Toggle the two modes and compare final values from the same start year.\n- **Lump-sum usually wins.** Markets rise more years than they fall, so money invested sooner spends more time compounding. On average, investing everything at once beats spreading it out.\n- **DCA usually loses a little — on average.** But it is not irrational. Spreading purchases means no single unlucky entry date wrecks you, and it lowers the odds of the specific regret of dumping everything in right before a crash.\n- The honest framing: lump-sum optimizes the *expected* outcome; DCA buys down *regret and behavioral risk*. If a worse average return is the price of not panic-selling, that can be a fair trade for a real human.",
        ko: "두 모드를 전환해 같은 시작 연도의 최종 금액을 비교합니다.\n- **일시투자가 보통 이깁니다.** 시장은 떨어지는 해보다 오르는 해가 많아서, 더 일찍 넣은 돈이 더 오래 복리로 불어납니다. 평균적으로는 한 번에 다 넣는 쪽이 나눠 넣는 쪽을 이깁니다.\n- **분할매수는 평균적으로는 조금 집니다.** 하지만 비합리적인 건 아닙니다. 매수를 나누면 운 나쁜 진입일 하나가 당신을 망치지 못하고, 폭락 직전에 전부 몰아넣는 특유의 후회 확률을 낮춥니다.\n- 정직한 정리: 일시투자는 *기대* 결과를 최적화하고, 분할매수는 *후회와 행동 위험*을 사들입니다. 조금 낮은 평균 수익이 공황 매도를 안 하는 대가라면, 진짜 인간에게는 공정한 거래일 수 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Two caveats before you decide", ko: "결정 전 두 가지 유의점" },
      body: {
        en: "Keep the tool honest in your head:\n- **Fee ≠ value.** A slightly higher fee is not automatically bad — a fund that reliably tracks its index for 0.20% may beat a sloppy 0.05% one. Judge fee *relative to what it delivers*, not in isolation. That said, for plain broad-market index exposure, low fee almost always wins.\n- **Past returns aren't future returns.** The dataset shows markets rose more often than they fell historically, which is what makes lump-sum win on average. If the future is different, the edge shrinks. The *fee* lesson, though, holds regardless — a fee is a certain, guaranteed cost no matter what returns do.",
        ko: "도구를 머릿속에서 정직하게 유지합니다.\n- **수수료 ≠ 가치.** 조금 더 높은 수수료가 자동으로 나쁜 건 아닙니다. 0.20%로 지수를 안정적으로 추종하는 펀드가 엉성한 0.05% 펀드를 이길 수 있습니다. 수수료는 홀로가 아니라 *그것이 주는 것 대비*로 판단합니다. 다만 평범한 광의 시장 인덱스 노출이라면 거의 항상 낮은 수수료가 이깁니다.\n- **과거 수익은 미래 수익이 아닙니다.** 데이터셋은 역사적으로 시장이 떨어질 때보다 오를 때가 많았음을 보여주고, 그래서 일시투자가 평균적으로 이깁니다. 미래가 다르면 그 우위는 줄어듭니다. 그러나 *수수료* 교훈은 무조건 유효합니다. 수수료는 수익이 어떻든 확정적이고 보장된 비용이니까요.",
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
        en: "Write it down: (1) the single expense-ratio ceiling you will refuse to exceed for a broad-market fund, and the \"lost to fees\" figure from the tool that convinced you of it; (2) whether you will use lump-sum or DCA for the money you have now, and one honest sentence on whether you chose it for the math or for your own peace of mind.",
        ko: "적어봅니다: (1) 광의 시장 펀드에 대해 절대 넘지 않을 단일 보수율 상한선과, 당신을 설득한 도구의 \"수수료로 잃은 금액\" 수치; (2) 지금 가진 돈에 일시투자를 쓸지 분할매수를 쓸지, 그리고 그것을 수학 때문에 골랐는지 마음의 평화 때문에 골랐는지에 대한 정직한 한 문장.",
      },
    },
    {
      kind: "conclude",
      title: { en: "Your fee rule, locked in", ko: "확정된 당신의 수수료 원칙" },
      body: {
        en: "You now see fees the way a long-term investor should: not as a small annual percent, but as a compounding drag that can quietly eat a quarter of your balance. And you have a stance on lump-sum vs DCA that fits your own psychology, not just a textbook. Before you act:",
        ko: "이제 당신은 장기 투자자가 봐야 하는 방식으로 수수료를 봅니다: 작은 연간 퍼센트가 아니라, 잔고의 4분의 1을 조용히 먹어치울 수 있는 복리 손실로. 그리고 교과서가 아니라 당신 자신의 심리에 맞는 일시투자 대 분할매수의 입장을 갖게 됐습니다. 실행하기 전에:",
      },
      checklist: [
        { en: "I wrote down a specific expense-ratio ceiling I will not exceed for index funds.", ko: "인덱스 펀드에 대해 넘지 않을 구체적인 보수율 상한선을 적었습니다." },
        { en: "I saw, in money, how ~1% over decades can cost roughly a quarter of the ending balance.", ko: "수십 년에 걸친 약 1%가 최종 잔고의 약 4분의 1을 앗아갈 수 있음을 돈으로 확인했습니다." },
        { en: "I chose lump-sum or DCA and can say honestly whether it was for the math or for regret-avoidance.", ko: "일시투자 또는 분할매수를 골랐고, 그것이 수학 때문인지 후회 회피 때문인지 정직하게 말할 수 있습니다." },
        { en: "I will check the actual expense ratio of any fund before buying, not just its name or past return.", ko: "어떤 펀드든 사기 전에 이름이나 과거 수익이 아니라 실제 보수율을 확인하겠습니다." },
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
        en: "This lab covers two ideas that only matter near a goal, especially retirement. Ask, in order:\n- **How should my mix change as the goal approaches?** (The glide path: from growth to safety as the horizon shortens.)\n- **Why is the timing of bad years so dangerous once I'm withdrawing?** (Sequence-of-returns risk.)\n- **Given my own years-to-goal, how much equity is right, and how does sequence risk change how I withdraw?**\nWhile you are only *saving*, the order of returns barely matters — you end up in the same place. The moment you start *withdrawing*, order becomes everything. This lab shows why.",
        ko: "이 랩은 목표, 특히 은퇴가 가까울 때만 중요해지는 두 가지 개념을 다룹니다. 순서대로 묻습니다.\n- **목표가 다가올수록 내 조합은 어떻게 바뀌어야 하는가?** (글라이드 패스: 기간이 짧아질수록 성장에서 안전으로.)\n- **인출을 시작하면 나쁜 해의 타이밍이 왜 그렇게 위험한가?** (수익률 순서 위험.)\n- **내 목표까지 남은 기간을 볼 때, 주식 비중은 얼마가 맞고, 순서 위험은 내 인출 방식을 어떻게 바꿔야 하는가?**\n*모으기만* 할 때는 수익률의 순서가 거의 상관없습니다. 결국 같은 자리에 도착합니다. *인출*을 시작하는 순간, 순서가 전부가 됩니다. 이 랩이 그 이유를 보여줍니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the sequence demo's returns come from", ko: "순서 데모의 수익률 출처" },
      body: {
        en: "The sequence demo is fixed at **2000–2024** on purpose — a stretch that opens with the dot-com bust and 2008, a genuinely brutal early sequence. Those are real annual returns from the static dataset, not invented, which is what makes the reversal so striking.",
        ko: "순서 데모는 의도적으로 **2000~2024년**으로 고정돼 있습니다. 닷컴 붕괴와 2008년으로 시작하는, 초반이 정말 혹독한 구간입니다. 그 값들은 지어낸 게 아니라 정적 데이터셋의 실제 연간 수익률이며, 그래서 순서를 뒤집었을 때의 대비가 그토록 강렬합니다.",
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
        en: "Two parts, run each deliberately:\n- **Glide path:** pick a **retirement year**. Watch the stacked area shift stock → bond → cash as the year approaches. Note roughly what equity share it lands on at, and just after, the target.\n- **Sequence demo (fixed 2000–2024, 6% annual withdrawal):** run the SAME returns in **normal order** and then **reversed order**. Read the two ending balances side by side.\nThe averages are identical in both runs. Only the *order* differs. Sit with how far apart the two endings are before moving on.",
        ko: "두 부분을 각각 신중하게 돌립니다.\n- **글라이드 패스:** **은퇴 연도**를 고릅니다. 그 해가 다가올수록 누적 영역이 주식 → 채권 → 현금으로 옮겨가는 걸 지켜봅니다. 목표 시점과 그 직후에 주식 비중이 대략 얼마에 안착하는지 봅니다.\n- **순서 데모(2000~2024 고정, 연 6% 인출):** 같은 수익률을 **정순**으로 한 번, **역순**으로 한 번 돌립니다. 두 최종 잔고를 나란히 읽습니다.\n두 실행의 평균은 동일합니다. 오직 *순서*만 다릅니다. 다음으로 넘어가기 전에, 두 결과가 얼마나 벌어지는지 곱씹어봅니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the glide path: growth early, safety late", ko: "글라이드 패스 읽기: 초반엔 성장, 후반엔 안전" },
      body: {
        en: "The logic is time, not age for its own sake.\n- **Far from the goal**, a bad year has decades to recover, so you can afford a high equity share to capture growth. A common rough anchor is a heavy equity tilt early on.\n- **Near and past the goal**, there is no time to recover a big loss and you are also drawing money out, so the path shifts toward bonds and cash.\n- These landing points (e.g. dropping toward ~40–50% equity around retirement) are *conventions and rules of thumb*, not laws. Your own risk tolerance, other income like a pension, and how flexible your spending is can all justify moving them.",
        ko: "논리는 나이 그 자체가 아니라 시간입니다.\n- **목표에서 멀 때**는 나쁜 해가 회복할 수십 년이 있으므로, 성장을 잡기 위해 높은 주식 비중을 감당할 수 있습니다. 흔한 대략적 기준은 초반에 주식 쪽으로 크게 기우는 것입니다.\n- **목표에 가깝거나 지난 뒤**에는 큰 손실을 회복할 시간이 없고 돈까지 빼 쓰고 있으므로, 경로가 채권과 현금 쪽으로 이동합니다.\n- 이런 안착 지점(예: 은퇴 무렵 주식 비중을 약 40~50%까지 낮추기)은 *관행이자 경험칙*이지 법칙이 아닙니다. 당신의 위험 감내도, 연금 같은 다른 소득, 지출을 얼마나 유연하게 줄일 수 있는지에 따라 이를 옮길 근거가 생깁니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the sequence demo: why order dominates", ko: "순서 데모 읽기: 왜 순서가 지배하는가" },
      body: {
        en: "Same 25 annual returns, same average, wildly different endings. Here is the mechanic:\n- When you **withdraw a fixed amount** and the **early** years are bad, you are selling shares into a fallen market to fund living costs. You lock in losses and shrink the base that must later recover — and it often never fully does.\n- Run the **bad years late** instead and you entered them with a much larger balance already built up; the same 6% withdrawal barely dents it.\n- This is sequence-of-returns risk: **once you are withdrawing, the ORDER of returns can matter more than the average return.** A retiree who hits a 2000–2008-style opening can run out of money that an identical-average retiree who got those years last never comes close to.",
        ko: "같은 25개 연간 수익률, 같은 평균, 완전히 다른 결말. 작동 원리는 이렇습니다.\n- **정액을 인출**하는데 **초반** 해들이 나쁘면, 생활비를 대려고 떨어진 시장에서 주식을 팔게 됩니다. 손실을 확정하고, 나중에 회복해야 할 원금 기반을 줄여버리며 — 그 기반은 끝내 완전히 회복되지 않는 경우가 많습니다.\n- 대신 **나쁜 해를 후반에** 두면, 이미 훨씬 큰 잔고를 쌓은 상태로 그 해들을 맞이합니다. 같은 6% 인출이 잔고에 거의 흠집도 못 냅니다.\n- 이것이 수익률 순서 위험입니다: **인출을 시작하면, 수익률의 순서가 평균 수익률보다 더 중요할 수 있습니다.** 2000~2008년 같은 시작을 맞은 은퇴자는, 평균이 똑같지만 그 해들을 마지막에 겪은 은퇴자라면 근처도 안 갔을 자금 고갈에 빠질 수 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "What sequence risk changes about withdrawing — and its limits", ko: "순서 위험이 인출에 대해 바꾸는 것 — 그리고 그 한계" },
      body: {
        en: "Sequence risk is the real reason to de-risk near and into retirement, and it points to a few defenses:\n- **De-risk before you start withdrawing**, not after — a smaller drawdown in the first few years is worth far more than in the last few.\n- **Keep a cash/bond buffer** to spend from in bad years so you are not forced to sell stocks low (the point of the cash sleeve on the glide path).\n- **Stay flexible on spending** — trimming withdrawals in a bad early year dramatically raises survival odds.\nHonest limits: this demo uses one fixed 2000–2024 window and a flat 6% withdrawal. Real outcomes depend on your actual start year, your spending flexibility, and other income. The mechanism is real and general; the exact numbers on screen are one illustrative case, not a forecast.",
        ko: "순서 위험은 은퇴 직전과 은퇴 기간에 위험을 줄여야 하는 진짜 이유이며, 몇 가지 방어책을 가리킵니다.\n- 인출을 시작한 *뒤*가 아니라 **시작하기 전에 위험을 줄입니다** — 첫 몇 해의 낮은 낙폭이 마지막 몇 해의 낙폭보다 훨씬 값집니다.\n- **현금·채권 완충분을 두어** 나쁜 해에는 거기서 꺼내 쓰고 주식을 싸게 팔지 않도록 합니다(글라이드 패스의 현금 부분이 존재하는 이유).\n- **지출을 유연하게 유지합니다** — 초반 나쁜 해에 인출을 줄이면 생존 확률이 극적으로 올라갑니다.\n정직한 한계: 이 데모는 고정된 2000~2024 구간 하나와 일정한 6% 인출을 씁니다. 실제 결과는 당신의 실제 시작 연도, 지출 유연성, 다른 소득에 따라 달라집니다. 원리는 실제적이고 일반적이지만, 화면의 정확한 숫자는 하나의 예시일 뿐 예측이 아닙니다.",
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
        en: "Write three things: (1) your years-to-goal and the equity share you think is right for that horizon now, with one reason; (2) the two ending balances the sequence demo produced for normal vs reversed order, in your own words; (3) one concrete change to how you'd withdraw — a cash buffer, a lower start rate, spending flexibility, or de-risking earlier — that sequence risk convinced you to adopt.",
        ko: "세 가지를 적습니다: (1) 목표까지 남은 기간과, 그 기간에 지금 맞다고 보는 주식 비중, 그리고 이유 한 가지; (2) 순서 데모가 정순과 역순에서 만들어낸 두 최종 잔고를 당신의 말로; (3) 순서 위험이 당신을 설득해 채택하게 만든 인출 방식의 구체적 변화 하나 — 현금 완충분, 낮은 시작 인출률, 지출 유연성, 또는 더 이른 위험 축소.",
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
        { en: "I stated my years-to-goal and an equity share that fits that horizon, not a fixed habit.", ko: "고정된 습관이 아니라 남은 기간에 맞는 주식 비중과 함께 목표까지의 기간을 적었습니다." },
        { en: "I saw the same 2000–2024 returns produce very different endings in normal vs reversed order.", ko: "같은 2000~2024 수익률이 정순과 역순에서 매우 다른 결말을 낳는 것을 확인했습니다." },
        { en: "I understand early bad years while withdrawing are far more damaging than late ones.", ko: "인출 중 초반의 나쁜 해가 후반의 나쁜 해보다 훨씬 큰 피해를 준다는 것을 이해합니다." },
        { en: "I named one concrete withdrawal defense (buffer, flexibility, lower rate, or earlier de-risking).", ko: "구체적인 인출 방어책 하나(완충분, 유연성, 낮은 인출률, 또는 더 이른 위험 축소)를 정했습니다." },
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
        en: "A trend system isn't \"buy low, sell high\" — it's a mechanical rule that keeps you invested while an asset trends up and pulls you out when it turns down. Its promise is **smaller drawdowns** — staying out of the worst of bear markets — usually at the cost of some upside and a lot of annoying whipsaws in choppy markets. We'll decide three things in order:\n- Does the rule **reduce drawdown** meaningfully vs just holding?\n- What does that protection **cost** in return (CAGR)?\n- Could **you** actually follow it — sit through the whipsaws and stay-out periods without overriding it?\nThe last one decides more real outcomes than the first two.",
        ko: "추세 시스템은 \"싸게 사서 비싸게 판다\"가 아닙니다 — 자산이 상승 추세일 때 투자 상태를 유지하고, 하락으로 돌아서면 빠져나오게 하는 기계적 규칙입니다. 그 약속은 **더 작은 낙폭** — 약세장의 최악을 피하는 것 — 이며, 대개 상승분 일부와 횡보장에서의 성가신 휩쏘(whipsaw)를 대가로 합니다. 순서대로 세 가지를 결정합니다:\n- 규칙이 단순 보유 대비 **낙폭을 의미 있게 줄이는가**?\n- 그 보호가 수익률(CAGR)로 얼마를 **대가로** 치르는가?\n- **당신**이 실제로 따를 수 있는가 — 휩쏘와 관망 구간을 규칙을 어기지 않고 견딜 수 있는가?\n마지막 질문이 앞의 둘보다 실제 결과를 더 많이 좌우합니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the prices come from", ko: "가격은 어디서 오는가" },
      body: {
        en: "A backtest is only as honest as its data. We use **adjusted** daily closes — adjusted for splits and dividends — so a total-return system isn't fooled by a price gap on an ex-dividend day. The prices are pre-ingested from Yahoo Finance's chart data into static JSON in the app, but you can click through to Yahoo and see the same series yourself.",
        ko: "백테스트는 그 데이터만큼만 정직합니다. 우리는 **수정** 일간 종가 — 액면분할과 배당을 반영한 값 — 를 사용해, 배당락일의 가격 갭에 총수익 시스템이 속지 않게 합니다. 가격은 야후 파이낸스 차트 데이터에서 앱의 정적 JSON으로 미리 수집돼 있지만, 야후로 클릭해 들어가 같은 시계열을 직접 확인할 수 있습니다.",
      },
      sources: [
        {
          name: { en: "Yahoo Finance — historical prices", ko: "야후 파이낸스 — 과거 시세" },
          what: { en: "Daily adjusted OHLCV for the symbol, going back years.", ko: "종목의 일간 수정 OHLCV, 수년치." },
          why: { en: "It's free, split/dividend-adjusted, and long enough to cover at least one full bull-and-bear cycle — which is the only fair test of a trend system.", ko: "무료이고 분할·배당이 반영돼 있으며, 최소 한 번의 완전한 상승·하락 사이클을 담을 만큼 길어 — 추세 시스템의 유일하게 공정한 시험대가 됩니다." },
          url: "https://finance.yahoo.com/quote/SPY/history",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Run the backtest yourself", ko: "직접 백테스트를 돌려라" },
      body: {
        en: "Use the analyzer below. Pick a symbol and one rules-based system:\n- **200-day moving average** — in when price is above its 200-day average, out when below.\n- **12-month momentum** — in when the price is above where it was ~12 months ago.\n- **Donchian breakout** — in on a new N-day high, out on a new N-day low.\nThe engine uses **only past data for each signal** — no look-ahead, no peeking at tomorrow's close to decide today's trade. Read off two pairs of numbers: **CAGR** (system vs buy-and-hold) and **max drawdown** (system vs buy-and-hold). Note the equity curve shape too.",
        ko: "아래 분석 도구를 사용하세요. 종목 하나와 규칙 기반 시스템 하나를 고르세요:\n- **200일 이동평균** — 가격이 200일 평균 위면 진입, 아래면 청산.\n- **12개월 모멘텀** — 가격이 약 12개월 전보다 높으면 진입.\n- **돈치안 돌파** — N일 신고가면 진입, N일 신저가면 청산.\n엔진은 **각 신호에 과거 데이터만** 씁니다 — 룩어헤드 없음, 오늘의 매매를 정하려고 내일 종가를 훔쳐보지 않습니다. 두 쌍의 숫자를 읽으세요: **CAGR**(시스템 대 매수후보유)와 **최대낙폭**(시스템 대 매수후보유). 자산곡선 모양도 메모하세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — read the drawdown first, not the return", ko: "1단계 — 수익률 말고 낙폭을 먼저 읽어라" },
      body: {
        en: "The whole point of a trend system is protection, so judge it there first. Compare **max drawdown**: the deepest peak-to-trough loss you'd have lived through.\n- System drawdown clearly shallower than buy-and-hold (e.g. -20% vs -50%) → the rule did its job; it got you out before the worst of a decline.\n- Drawdowns about equal → the rule isn't protecting you; it's just adding trades and costs for nothing.\nA smaller drawdown is worth real money and, more importantly, is what lets you actually stay in the game — most people abandon a strategy at the bottom of a deep drawdown.",
        ko: "추세 시스템의 존재 이유는 보호이므로, 거기부터 판단하세요. **최대낙폭**을 비교하세요: 고점에서 저점까지 겪었을 가장 깊은 손실입니다.\n- 시스템 낙폭이 매수후보유보다 확실히 얕음(예: -20% 대 -50%) → 규칙이 제 역할을 함; 하락의 최악 전에 빠져나오게 함.\n- 낙폭이 비슷함 → 규칙이 보호하지 못하고 매매와 비용만 늘림.\n더 작은 낙폭은 실제 돈이 되고, 더 중요하게는 당신이 게임에 남아 있게 합니다 — 대부분은 깊은 낙폭의 바닥에서 전략을 버립니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 2 — what did the protection cost?", ko: "2단계 — 보호의 대가는 얼마였나?" },
      body: {
        en: "Now the return. Compare **CAGR** (compound annual growth). Trend systems very often trail buy-and-hold on raw CAGR — that's normal and expected, because you spend time in cash and eat whipsaw losses.\n- System CAGR slightly below buy-and-hold, but with a much smaller drawdown → a good trade; you gave up a little return for a lot less pain.\n- System CAGR far below buy-and-hold with only a slightly smaller drawdown → a bad trade; the protection wasn't worth it.\nThe honest way to compare is **return per unit of drawdown**, not CAGR alone. A system that makes 8% with a -20% drawdown can be better than one that makes 10% with a -50% drawdown.",
        ko: "이제 수익률입니다. **CAGR**(연복리성장률)을 비교하세요. 추세 시스템은 원시 CAGR에서 매수후보유에 뒤지는 경우가 매우 흔합니다 — 현금 보유 기간과 휩쏘 손실 때문에 정상이며 예상되는 결과입니다.\n- 시스템 CAGR이 매수후보유보다 약간 낮지만 낙폭이 훨씬 작음 → 좋은 거래; 약간의 수익으로 훨씬 적은 고통을 샀습니다.\n- 시스템 CAGR이 매수후보유보다 크게 낮은데 낙폭은 조금만 작음 → 나쁜 거래; 보호가 값어치를 못 했습니다.\n정직한 비교는 CAGR 단독이 아니라 **낙폭 대비 수익**입니다. -20% 낙폭에 8%를 버는 시스템이 -50% 낙폭에 10%를 버는 것보다 나을 수 있습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 3 — count the whipsaws honestly", ko: "3단계 — 휩쏘를 정직하게 세어라" },
      body: {
        en: "A backtest hides the emotional cost. Look at how the system behaved in **choppy, sideways periods** — those are where trend rules bleed. Each false signal is a round-trip: you sell near a dip, buy back higher, and pay costs both ways.\n- Many quick in-out flips → lots of whipsaws. Every one is a moment you'd be tempted to override the rule (\"this signal is obviously wrong\").\n- Honest caveats: this backtest is **one symbol over one history**. It says nothing about the future, ignores taxes on each sale, and the real-world **costs and slippage** on every trade will drag results below the backtest. Discretion — you second-guessing the rule — usually makes it worse, not better.",
        ko: "백테스트는 감정 비용을 숨깁니다. 시스템이 **횡보·톱니 구간**에서 어떻게 행동했는지 보세요 — 추세 규칙이 피를 흘리는 곳입니다. 잘못된 신호 하나하나가 왕복 거래입니다: 저점 근처에서 팔고, 더 높게 되사고, 양방향으로 비용을 냅니다.\n- 빠른 진입·청산 반복이 많음 → 휩쏘가 많음. 하나하나가 규칙을 어기고 싶은 순간입니다(\"이 신호는 딱 봐도 틀렸어\").\n- 정직한 주의: 이 백테스트는 **한 종목의 한 역사**입니다. 미래에 대해 아무것도 말하지 않고, 매도 시 세금을 무시하며, 매 거래의 실제 **비용과 슬리피지**가 결과를 백테스트보다 끌어내립니다. 재량 — 당신이 규칙을 의심하는 것 — 은 대개 결과를 더 나쁘게 만듭니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Put the three answers together. A trend system is worth running only if it clearly cuts drawdown, the return it gives up is acceptable for that protection, AND you honestly believe you'd follow it through the whipsaws. Be brutally honest about the last part — a great system you abandon at the worst moment is worse than buy-and-hold you never touch.",
        ko: "세 답을 합치세요. 추세 시스템은 낙폭을 확실히 줄이고, 그 보호를 위해 포기하는 수익이 받아들일 만하며, **그리고** 당신이 휩쏘를 뚫고 따를 거라고 정직하게 믿을 때만 돌릴 가치가 있습니다. 마지막 부분에 대해 냉정하게 정직하세요 — 최악의 순간에 버릴 훌륭한 시스템은, 절대 손대지 않을 매수후보유보다 나쁩니다.",
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
        { en: "The backtest covered at least one full bull-and-bear cycle, not just a rising market that flatters any system.", ko: "백테스트가 어떤 시스템에도 유리한 상승장만이 아니라, 최소 한 번의 완전한 상승·하락 사이클을 담았다." },
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
        en: "To size a trade you need the asset's recent **volatility**, and for that you need real daily candles — highs, lows, closes. We use adjusted daily OHLCV so gaps and dividends don't distort the range. From those candles we compute **ATR (average true range)**: roughly, how far the price typically moves in a day. That single number sets a stop that respects how the asset actually breathes — instead of a random \"I'll risk 5%.\"",
        ko: "트레이드를 사이징하려면 자산의 최근 **변동성**이 필요하고, 그러려면 실제 일간 캔들 — 고가·저가·종가 — 이 필요합니다. 갭과 배당이 범위를 왜곡하지 않도록 수정 일간 OHLCV를 씁니다. 그 캔들에서 **ATR(평균 실질 범위)** 를 계산합니다: 대략, 하루에 가격이 통상 얼마나 움직이는가. 이 숫자 하나가, 임의의 \"5% 감수\"가 아니라 자산이 실제 숨쉬는 방식을 존중하는 손절가를 정합니다.",
      },
      sources: [
        {
          name: { en: "Yahoo Finance — historical prices", ko: "야후 파이낸스 — 과거 시세" },
          what: { en: "Daily OHLC candles used to compute ATR and to resolve each trade against real highs/lows.", ko: "ATR 계산과 각 거래를 실제 고가·저가로 판정하는 데 쓰는 일간 OHLC 캔들." },
          why: { en: "You need true daily ranges — not just closes — to measure volatility and to test whether a stop would have been hit intrabar.", ko: "변동성을 재고 손절이 장중에 닿았을지 시험하려면 종가만이 아니라 실제 일간 범위가 필요합니다." },
          url: "https://finance.yahoo.com/quote/AAPL/history",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Build the plans and let them resolve", ko: "계획을 세우고 전개되게 하라" },
      body: {
        en: "Use the analyzer below. It steps through a handful of **frozen trade entries** — real setups you can't cheat by peeking ahead. For each, it builds the plan: entry price, a **stop distance set from ATR** (e.g. 2 × ATR below entry), and a **position size** so that hitting the stop loses exactly your chosen risk %. Then it resolves each trade against the real candles — **intrabar, stop-first** (if a bar's low pierced your stop, you're out at the stop, even if it closed higher). Some win, some stop out. Watch the running P&L, not just each trade.",
        ko: "아래 분석 도구를 사용하세요. 몇 개의 **고정된 트레이드 진입** — 앞을 훔쳐봐서 속일 수 없는 실제 셋업 — 을 하나씩 밟습니다. 각각에 대해 계획을 세웁니다: 진입가, **ATR로 정한 손절 거리**(예: 진입 아래 2 × ATR), 그리고 손절에 닿으면 정확히 당신이 고른 위험 %만 잃도록 하는 **포지션 크기**. 그런 다음 실제 캔들로 각 거래를 판정합니다 — **장중, 손절 우선**(어떤 봉의 저가가 손절가를 뚫었다면, 더 높게 마감했어도 손절가에서 청산). 일부는 이기고 일부는 손절됩니다. 개별 거래가 아니라 누적 손익을 지켜보세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — the stop comes from volatility, not hope", ko: "1단계 — 손절은 희망이 아니라 변동성에서 나온다" },
      body: {
        en: "Look at how the stop distance was set: a multiple of **ATR**, not a round number. Why? If you place a stop closer than the asset's normal daily wiggle, ordinary noise will stop you out over and over even when your idea is fine. If you place it too far, a single loss is too big.\n- Stop ≈ 1.5–3 × ATR is a common range — tight enough to cap the loss, loose enough to survive normal noise.\n- The stop is set **before entry** and doesn't move against you. A stop you widen mid-trade because \"it'll come back\" is how a small planned loss becomes an account-ending one.",
        ko: "손절 거리가 어떻게 정해졌는지 보세요: 둥근 숫자가 아니라 **ATR**의 배수입니다. 왜일까요? 자산의 정상적인 일간 흔들림보다 가깝게 손절을 두면, 아이디어가 멀쩡해도 평범한 잡음이 계속 당신을 털어냅니다. 너무 멀리 두면 한 번의 손실이 너무 큽니다.\n- 손절 ≈ 1.5~3 × ATR가 흔한 범위 — 손실을 제한할 만큼 좁고, 정상 잡음을 견딜 만큼 넓습니다.\n- 손절은 **진입 전에** 정하며 당신에게 불리하게 움직이지 않습니다. \"돌아올 거야\" 하며 도중에 넓히는 손절이, 작게 계획된 손실을 계좌를 끝내는 손실로 바꿉니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 2 — position size is an output, not a feeling", ko: "2단계 — 포지션 크기는 감이 아니라 출력값이다" },
      body: {
        en: "This is the core move. You fix two things: your **risk % per trade** (say 1% of capital) and your **stop distance** (from ATR). Position size then falls out:\n- **shares ≈ (capital × risk%) ÷ stop distance per share.**\nSo a wider stop → a smaller position, a tighter stop → a bigger one, and every trade risks the *same dollar amount* regardless of the stock's price or volatility. Notice what this kills: the urge to \"bet big on a good one.\" The setup you're most excited about gets the same risk budget as any other. That uniformity is what makes a long string of trades survivable.",
        ko: "이것이 핵심입니다. 두 가지를 고정합니다: **거래당 위험 %**(가령 자본의 1%)와 **손절 거리**(ATR에서). 그러면 포지션 크기가 자동으로 나옵니다:\n- **주식 수 ≈ (자본 × 위험%) ÷ 주당 손절 거리.**\n따라서 손절이 넓으면 → 포지션이 작아지고, 손절이 좁으면 → 커지며, 모든 거래는 주가나 변동성과 무관하게 *같은 금액*을 감수합니다. 이것이 무엇을 없애는지 보세요: \"좋은 놈에 크게 걸고 싶은\" 충동. 가장 기대되는 셋업도 다른 것과 같은 위험 예산을 받습니다. 그 균일함이 긴 거래 연속을 견딜 수 있게 합니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 3 — expectancy, not the last trade", ko: "3단계 — 마지막 거래가 아니라 기대값" },
      body: {
        en: "Now read the run of resolved trades as a whole. Individual trades are noise; the **distribution** is the signal.\n- **Win rate** alone means nothing — a 40% win rate is very profitable if wins are 3× the size of losses, and a 70% win rate loses money if losses are huge.\n- What matters is **expectancy**: average $ gained per trade = (win% × avg win) − (loss% × avg loss). Positive expectancy repeated many times, with fixed small risk, is the entire edge.\n- Honest caveats: this is a small frozen sample. Real trading adds **commissions, slippage, and gaps that jump past your stop** (you can lose more than planned on an overnight gap). And a **losing streak WILL happen** — even a positive-expectancy system delivers strings of losses; your sizing has to survive them.",
        ko: "이제 판정된 거래들을 전체로 읽으세요. 개별 거래는 잡음이고, **분포**가 신호입니다.\n- **승률** 하나로는 아무 의미도 없습니다 — 승리가 손실의 3배면 40% 승률도 매우 수익성 있고, 손실이 거대하면 70% 승률도 돈을 잃습니다.\n- 중요한 건 **기대값**입니다: 거래당 평균 이익 = (승률 × 평균 이익) − (패율 × 평균 손실). 고정된 작은 위험으로 양(+)의 기대값을 여러 번 반복하는 것이 엣지의 전부입니다.\n- 정직한 주의: 이건 작은 고정 표본입니다. 실전은 **수수료, 슬리피지, 손절을 건너뛰는 갭**을 더합니다(밤사이 갭에서 계획보다 더 잃을 수 있음). 그리고 **연패는 반드시 옵니다** — 양의 기대값 시스템도 손실의 연속을 냅니다; 당신의 사이징이 그것을 견뎌야 합니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Pick your fixed risk % per trade and stress-test it. The classic answer is small — often 0.5% to 1% of capital — because you must survive a run of, say, 10 losses in a row without your account or your nerve breaking. Do the arithmetic: at your chosen risk %, what's your capital after 10 consecutive stop-outs? If that number scares you, your risk % is too high.",
        ko: "거래당 고정 위험 %를 고르고 스트레스 테스트하세요. 고전적 답은 작습니다 — 흔히 자본의 0.5%~1% — 예컨대 10연패를 계좌도 멘탈도 무너지지 않고 견뎌야 하기 때문입니다. 계산해 보세요: 고른 위험 %에서 10연속 손절 후 자본은 얼마인가? 그 숫자가 무섭다면, 위험 %가 너무 높은 것입니다.",
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
        { en: "This is a small backtested sample and a plan to test — no guarantee, past ≠ future, and discipline is what makes or breaks it, not the setup.", ko: "이건 작은 백테스트 표본이자 검증할 계획 — 보장 없고, 과거 ≠ 미래이며, 셋업이 아니라 규율이 성패를 가른다." },
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
        en: "Macro investing doesn't bet on a single indicator — it positions for a **regime**, the broad backdrop of growth and inflation that tends to favor whole asset classes. We'll read four things and combine them into one picture:\n- **Yield-curve spread** (10yr − 3mo) — an inversion has preceded most recessions.\n- **Inflation YoY** — rising or falling, and how fast.\n- **Sahm indicator** — a real-time flag for the *start* of a recession.\n- **Growth/inflation quadrant** — growth up/down × inflation up/down, which suggests what tends to work.\nNone of these is a crystal ball. Each lags, whipsaws, or has fired falsely before. The skill is reading them together, not worshipping one.",
        ko: "매크로 투자는 단일 지표에 베팅하지 않습니다 — 자산군 전체에 유리하게 작용하는 성장·인플레이션의 큰 배경, 즉 **국면**에 포지션합니다. 네 가지를 읽어 하나의 그림으로 합칩니다:\n- **장단기 금리차**(10년 − 3개월) — 역전은 대부분의 경기침체에 선행했습니다.\n- **인플레이션 YoY** — 오르는지 내리는지, 얼마나 빠른지.\n- **삼(Sahm) 지표** — 경기침체 *시작*을 실시간으로 알리는 신호.\n- **성장/인플레이션 사분면** — 성장 상/하 × 인플레이션 상/하, 무엇이 통하는 경향인지 시사.\n어느 것도 수정 구슬이 아닙니다. 각각 지연되거나 휩쏘하거나 과거에 헛불질을 했습니다. 기술은 하나를 숭배하는 게 아니라 함께 읽는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the macro data comes from", ko: "매크로 데이터는 어디서 오는가" },
      body: {
        en: "Every series here is official US government / central-bank data, pulled from **FRED** (the Federal Reserve Bank of St. Louis) via its keyless fredgraph CSV endpoint and pre-ingested to static JSON. You can click any series' FRED page and see the exact same numbers, revisions and all. That transparency matters: macro data gets **revised** after the fact, so a signal that looks clean today may have looked different in real time.",
        ko: "여기의 모든 시계열은 공식 미국 정부/중앙은행 데이터로, **FRED**(세인트루이스 연방준비은행)의 키 없는 fredgraph CSV 엔드포인트에서 가져와 정적 JSON으로 미리 수집했습니다. 어떤 시계열이든 FRED 페이지를 클릭해 정확히 같은 숫자를(수정 이력까지) 볼 수 있습니다. 그 투명성이 중요합니다: 매크로 데이터는 사후에 **수정**되므로, 오늘 깔끔해 보이는 신호가 실시간에는 다르게 보였을 수 있습니다.",
      },
      sources: [
        {
          name: { en: "FRED — St. Louis Fed", ko: "FRED — 세인트루이스 연준" },
          what: { en: "Treasury yields (10yr, 3mo), CPI, unemployment rate and related series used for the spread, inflation, Sahm rule and quadrant.", ko: "국채 금리(10년·3개월), CPI, 실업률 등 — 금리차·인플레이션·삼 규칙·사분면 계산에 쓰는 시계열." },
          why: { en: "It's the definitive free archive of US macro data, sourced straight from the government agencies that publish it — no vendor spin.", ko: "미국 매크로 데이터의 결정판 무료 아카이브로, 데이터를 발표하는 정부 기관에서 곧바로 가져옵니다 — 벤더의 가공이 없습니다." },
          url: "https://fred.stlouisfed.org",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Read the dashboard yourself", ko: "직접 대시보드를 읽어라" },
      body: {
        en: "Use the analyzer below. It computes and displays, from the FRED series:\n- the **yield-curve spread** (10yr − 3mo) and whether it's inverted,\n- **inflation YoY** and its direction,\n- the **Sahm recession indicator** vs its trigger,\n- an overall **recession gauge**, and\n- the **regime quadrant** (growth up/down × inflation up/down).\nDon't just read the summary verdict — note each raw number and which way it's moving. The direction of travel often matters more than the level.",
        ko: "아래 분석 도구를 사용하세요. FRED 시계열로부터 다음을 계산해 보여줍니다:\n- **장단기 금리차**(10년 − 3개월)와 역전 여부,\n- **인플레이션 YoY**와 방향,\n- **삼(Sahm) 침체 지표**와 발동 기준,\n- 종합 **침체 게이지**,\n- **국면 사분면**(성장 상/하 × 인플레이션 상/하).\n요약 결론만 읽지 말고 각 원시 숫자와 그 이동 방향을 메모하세요. 방향이 수준보다 더 중요할 때가 많습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 1 — the yield curve: warning, not timer", ko: "1단계 — 수익률 곡선: 타이머가 아니라 경고" },
      body: {
        en: "Read the **spread** (10yr − 3mo).\n- Positive (long rates above short) → normal, expansionary backdrop.\n- **Negative (inverted)** → the market expects rate cuts, historically a recession warning — it has preceded most US recessions.\nBut two honest caveats: the lag from inversion to recession has ranged from months to **over a year**, and it has given false-ish signals. It tells you risk is *elevated*, not *when*. Don't sell everything the day it inverts.",
        ko: "**금리차**(10년 − 3개월)를 읽으세요.\n- 양(+)(장기 금리가 단기보다 높음) → 정상, 확장적 배경.\n- **음(−)(역전)** → 시장이 금리 인하를 예상 — 역사적으로 침체 경고이며, 대부분의 미국 침체에 선행했습니다.\n그러나 두 가지 정직한 주의: 역전에서 침체까지의 시차는 수개월에서 **1년 이상**까지 다양했고, 애매한 헛신호도 있었습니다. 위험이 *높아졌다*는 걸 알릴 뿐 *언제*인지는 아닙니다. 역전된 날 전부 팔지 마세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 2 — Sahm & the recession gauge: is it starting?", ko: "2단계 — 삼 지표와 침체 게이지: 시작됐는가?" },
      body: {
        en: "The yield curve warns early; the **Sahm indicator** flags a recession that's likely *already beginning*. It triggers when the 3-month average unemployment rate rises about **0.5 point above its recent low** — a pattern that has historically marked recession onsets in real time.\n- Below trigger → no recession-start signal yet.\n- At/above trigger → the labor market is deteriorating fast; the recession gauge should be elevated too.\nCaveat: it's a real-time rule of thumb built on **revisable** unemployment data, and its designer has warned it can misfire when the labor market is behaving unusually. Treat a fresh trigger as \"pay close attention,\" not \"it's confirmed.\"",
        ko: "수익률 곡선은 일찍 경고하고, **삼(Sahm) 지표**는 *이미 시작되고 있을* 가능성이 큰 침체를 알립니다. 3개월 평균 실업률이 최근 저점보다 약 **0.5%포인트** 오르면 발동하는데 — 역사적으로 실시간으로 침체 개시를 표시한 패턴입니다.\n- 기준 미만 → 아직 침체 시작 신호 없음.\n- 기준 이상 → 노동시장이 빠르게 악화; 침체 게이지도 높아져 있을 것.\n주의: 이건 **수정 가능한** 실업 데이터에 기반한 실시간 경험칙이며, 고안자 본인이 노동시장이 이례적일 때 오작동할 수 있다고 경고했습니다. 새 발동은 \"확정\"이 아니라 \"주의 깊게 보라\"로 받아들이세요.",
      },
    },
    {
      kind: "read",
      title: { en: "Step 3 — the quadrant: what tends to work where", ko: "3단계 — 사분면: 어디서 무엇이 통하는 경향" },
      body: {
        en: "Combine **growth** direction and **inflation** direction into a quadrant. As rough historical tendencies (not laws):\n- **Growth up, inflation down** — the sweet spot; **stocks** (esp. growth) tend to do well.\n- **Growth up, inflation up** — reflation; **commodities**, real assets, sometimes value stocks.\n- **Growth down, inflation up** — stagflation, the hard one; **gold / commodities** have sometimes held up, most things struggle.\n- **Growth down, inflation down** — deflationary slowdown; **long-duration bonds / cash** tend to shine.\nThese are tendencies over history, badly noisy in any single episode. The quadrant tells you *which way to tilt*, not to go all-in.",
        ko: "**성장** 방향과 **인플레이션** 방향을 사분면으로 결합하세요. 대략의 역사적 경향(법칙 아님)으로:\n- **성장 상, 인플레 하** — 최적 구간; **주식**(특히 성장주)이 잘하는 경향.\n- **성장 상, 인플레 상** — 리플레이션; **원자재**, 실물자산, 때로 가치주.\n- **성장 하, 인플레 상** — 스태그플레이션, 어려운 국면; **금/원자재**가 때때로 버텼고 대부분은 고전.\n- **성장 하, 인플레 하** — 디플레적 둔화; **장기채/현금**이 빛나는 경향.\n이는 역사에 걸친 경향이며 개별 국면에서는 잡음이 심합니다. 사분면은 *어느 쪽으로 기울일지*를 알려줄 뿐, 몰빵하라는 게 아닙니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Your call", ko: "당신의 판단" },
      body: {
        en: "Weigh the four readings together — do they agree or conflict? (A steep positive curve with a fired Sahm trigger, say, is a genuine contradiction worth naming.) Then state the regime the balance of evidence points to, and one concrete allocation tilt it implies — a lean, not a lurch. Say what would have to change to flip your read.",
        ko: "네 판독을 함께 저울질하세요 — 일치하는가, 충돌하는가? (예컨대 가파른 양(+)의 곡선인데 삼 지표가 발동한 것은 짚어둘 만한 진짜 모순입니다.) 그런 다음 증거의 균형이 가리키는 국면을 밝히고, 그것이 함의하는 구체적 자산배분 기울기 하나를 — 급전환이 아니라 기울임으로 — 말하세요. 무엇이 바뀌면 판독이 뒤집힐지도 적으세요.",
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
        en: "You just read the macro backdrop the way a regime investor does — several probabilistic signals combined into a tilt, not a single indicator turned into a bet. That's the discipline: position for the environment, stay humble about timing. Before acting, run this checklist.",
        ko: "방금 국면 투자자가 하듯 매크로 배경을 읽었습니다 — 단일 지표를 베팅으로 바꾸는 게 아니라, 여러 확률적 신호를 하나의 기울기로 결합. 그게 규율입니다: 환경에 맞게 포지션하고, 타이밍에 대해서는 겸손하게. 행동 전에 이 체크리스트를 확인하세요.",
      },
      checklist: [
        { en: "I read each raw number AND its direction of travel, not just the dashboard's summary verdict.", ko: "대시보드의 요약 결론만이 아니라 각 원시 숫자와 그 이동 방향을 읽었다." },
        { en: "I combined all four signals and noted where they agree or conflict, instead of acting on one.", ko: "하나에 반응하지 않고 네 신호를 모두 결합해, 어디서 일치·충돌하는지 적었다." },
        { en: "I remembered these signals lag, whipsaw, and rely on revisable data — a warning is not a timer.", ko: "이 신호들이 지연·휩쏘하며 수정 가능한 데이터에 기댄다는 걸 기억했다 — 경고는 타이머가 아니다." },
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
      title: { en: "Frame the decision as three questions", ko: "결정을 세 가지 질문으로 정리합니다" },
      body: {
        en: "A covered call means you own 100 shares and **sell** someone the right to buy them from you at a fixed **strike** price. You pocket the **premium** now; in exchange you give up any gain above the strike. Before touching the tool, hold three questions in your head:\n- **What's my view on the stock?** Covered calls fit a flat-to-mildly-bullish view — you don't expect a big rip higher.\n- **Which strike, for how much premium?** A strike close to today's price pays more but caps you sooner; a far strike pays little but leaves room to run.\n- **Am I OK capping my upside?** If the stock doubles, you sold it away at the strike. Be honest about how that would feel.",
        ko: "커버드 콜은 주식 100주를 보유한 상태에서, 정해진 **행사가**에 그 주식을 사갈 권리를 남에게 **파는** 것입니다. 지금 **프리미엄**을 챙기는 대신, 행사가 위쪽의 상승분은 포기합니다. 도구를 만지기 전에 세 가지 질문을 떠올려 두십시오.\n- **이 주식에 대한 내 시각은?** 커버드 콜은 횡보~약한 상승을 볼 때 맞습니다. 큰 폭의 급등을 기대하지 않는 경우입니다.\n- **어떤 행사가에, 얼마의 프리미엄?** 현재가에 가까운 행사가는 더 많이 받지만 더 빨리 상단이 막히고, 먼 행사가는 적게 받지만 오를 여지를 남깁니다.\n- **상승 여력을 포기해도 괜찮은가?** 주가가 두 배가 되면 행사가에 팔아넘긴 셈입니다. 그때 어떤 기분일지 솔직하게 상상해 보십시오.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the numbers come from", ko: "숫자가 어디서 오는지" },
      body: {
        en: "Live option chains are licensed market data we can't redistribute in a lesson, so this lab **generates** an illustrative chain with the Black-Scholes model. You set implied volatility and days-to-expiry; the model prices the calls. For a reality check on whether selling calls actually helps, we compare against CBOE's BXM buy-write index, which tracks exactly this strategy on the S&P 500.",
        ko: "실시간 옵션 체인은 라이선스가 걸린 시장 데이터라 강의에서 재배포할 수 없습니다. 그래서 이 랩은 블랙-숄즈 모형으로 예시용 체인을 **생성**합니다. 여러분이 내재변동성과 만기일수를 정하면 모형이 콜 가격을 매깁니다. 콜을 파는 것이 실제로 도움이 되는지 확인하기 위해, 이 전략을 S&P 500에 그대로 적용해 추종하는 CBOE의 BXM 바이라이트 지수와 비교합니다.",
      },
      sources: [
        {
          name: { en: "Black-Scholes model (synthetic chain)", ko: "블랙-숄즈 모형 (합성 체인)" },
          what: { en: "The option prices in this lab, computed from spot price, strike, implied volatility, days-to-expiry, and a ~4% risk-free rate.", ko: "이 랩의 옵션 가격. 현재가, 행사가, 내재변동성, 만기일수, 약 4% 무위험이자율로 계산합니다." },
          why: { en: "Real chains are licensed and can't be shared here. A synthetic chain is illustrative — the shapes and trade-offs are honest, but the exact prices are model output, not a live quote.", ko: "실제 체인은 라이선스가 걸려 여기서 공유할 수 없습니다. 합성 체인은 예시용입니다. 손익의 모양과 트레이드오프는 사실 그대로지만, 정확한 가격은 실시간 호가가 아니라 모형이 뱉은 값입니다." },
          url: "https://en.wikipedia.org/wiki/Black%E2%80%93Scholes_model",
        },
        {
          name: { en: "CBOE BXM Buy-Write Index", ko: "CBOE BXM 바이라이트 지수" },
          what: { en: "A published index that holds the S&P 500 and systematically writes at-the-money calls each month — the covered-call strategy as an index.", ko: "S&P 500을 보유하면서 매달 등가격(ATM) 콜을 체계적으로 매도하는 공표 지수. 커버드 콜 전략을 지수화한 것입니다." },
          why: { en: "It's the closest thing to a real-world track record for this exact strategy, so you can see how buy-write actually behaved vs plain SPY over years.", ko: "이 전략의 현실 세계 성과에 가장 가까운 기록이라, 바이라이트가 단순 SPY 대비 수년간 실제로 어떻게 움직였는지 볼 수 있습니다." },
          url: "https://www.cboe.com/us/indices/dashboard/bxm/",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Build the chain and write a call", ko: "체인을 만들고 콜을 매도해 봅니다" },
      body: {
        en: "Run the analyzer below. Do this in order:\n- Set **implied volatility** and **days-to-expiry** — watch how both push premiums up.\n- Pick a **strike** above today's price and read the **premium income** it pays.\n- Study the **payoff diagram**: flat gain to the strike, then a hard ceiling.\n- Flip to the **BXM vs SPY** chart and note where buy-write won and where it lagged.\nDon't optimize yet — just get a feel for how strike, IV, and time move the premium and the payoff shape.",
        ko: "아래 분석기를 실행하십시오. 순서대로 해봅니다.\n- **내재변동성**과 **만기일수**를 조정하며 둘 다 프리미엄을 어떻게 밀어 올리는지 보십시오.\n- 현재가보다 높은 **행사가**를 하나 골라, 그때 받는 **프리미엄 수익**을 읽으십시오.\n- **손익 다이어그램**을 살펴보십시오. 행사가까지는 이익이 커지다가, 그 위로는 딱딱한 천장이 생깁니다.\n- **BXM vs SPY** 차트로 넘어가, 바이라이트가 이긴 구간과 뒤처진 구간을 확인하십시오.\n아직 최적화하지 마십시오. 행사가·변동성·시간이 프리미엄과 손익 모양을 어떻게 바꾸는지 감을 잡는 단계입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the premium — it's rent, with a catch", ko: "프리미엄을 읽습니다 — 이건 월세지만, 함정이 있습니다" },
      body: {
        en: "The premium is cash in your account today, no matter what the stock does. Think of it as **rent on shares you already own**. As a rough yardstick, people often look at the premium as a percent of the stock price for the period — e.g. **1–2% per month** on a near strike can look juicy. But rent isn't free money: you collected it by **selling your upside**. If the stock finishes below the strike, you keep the shares and the premium — the good case. If it blows past the strike, your shares get called away at that price and you miss the rest of the move.",
        ko: "프리미엄은 주가가 어떻게 되든 오늘 계좌에 들어오는 현금입니다. 이미 보유한 **주식에서 받는 월세**라고 생각하십시오. 대략적인 잣대로, 사람들은 해당 기간의 주가 대비 프리미엄 비율을 보는데, 가까운 행사가에서 **월 1~2%**면 꽤 매력적으로 보입니다. 하지만 이 월세는 공짜가 아닙니다. **상승 여력을 팔아서** 받은 것입니다. 만기에 주가가 행사가보다 낮으면 주식과 프리미엄을 모두 지키는 좋은 경우입니다. 하지만 행사가를 크게 뚫고 오르면, 주식은 그 가격에 넘어가고 나머지 상승은 놓칩니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Higher IV pays more — but usually for a reason", ko: "높은 변동성은 더 주지만 — 대개 이유가 있습니다" },
      body: {
        en: "Crank implied volatility up and premiums balloon. Tempting — but IV is the market's estimate of how wildly the stock will move, and it's usually high right before earnings, drug trial results, or a shaky macro tape. So a fat premium is often **compensation for a fat risk** you're taking on the stock you hold. High IV cuts both ways: more income, but also a bumpier ride on the shares underneath. Don't read a rich premium as a free lunch — ask *why* it's rich.",
        ko: "내재변동성을 올리면 프리미엄이 부풀어 오릅니다. 솔깃하지만, 변동성(IV)은 주가가 얼마나 크게 움직일지에 대한 시장의 추정치이고, 대개 실적 발표, 임상 결과, 불안한 거시 국면 직전에 높습니다. 그래서 두툼한 프리미엄은 여러분이 보유한 주식에 대해 **떠안는 두툼한 위험의 대가**인 경우가 많습니다. 높은 변동성은 양날의 검입니다. 수입은 늘지만, 밑에 깔린 주식의 움직임도 그만큼 거칩니다. 후한 프리미엄을 공짜 점심으로 읽지 말고, *왜* 후한지 물으십시오.",
      },
    },
    {
      kind: "read",
      title: { en: "What a covered call does — and doesn't — do", ko: "커버드 콜이 하는 일 — 그리고 못 하는 일" },
      body: {
        en: "Be clear on the trade you're making:\n- **It lowers volatility and generates income** — the premium cushions small drops and smooths returns. That's why BXM is usually calmer than SPY.\n- **It caps your gains** — above the strike, you don't participate. In a roaring bull market, buy-write lags badly.\n- **It barely protects the downside** — the premium is a thin cushion. If the stock falls 30%, a 2% premium won't save you. A covered call is *not* a hedge; if you want downside protection, that's a different trade (a put).",
        ko: "지금 하는 거래를 분명히 해두십시오.\n- **변동성을 낮추고 수입을 만듭니다** — 프리미엄이 작은 하락을 완충하고 수익률을 매끄럽게 합니다. BXM이 대개 SPY보다 잔잔한 이유입니다.\n- **상승 이익을 제한합니다** — 행사가 위로는 참여하지 못합니다. 강한 상승장에서 바이라이트는 크게 뒤처집니다.\n- **하락은 거의 방어하지 못합니다** — 프리미엄은 얇은 완충일 뿐입니다. 주가가 30% 빠지면 2% 프리미엄으로는 못 막습니다. 커버드 콜은 헤지가 *아닙니다*. 하락 방어가 필요하면 그건 다른 거래(풋 매수)입니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Make the call — literally", ko: "결론을 내립니다 — 말 그대로" },
      body: {
        en: "Pin down one specific covered call and decide whether you'd actually place it.",
        ko: "구체적인 커버드 콜 하나를 정하고, 실제로 그 주문을 낼지 결정하십시오.",
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
        { en: "Wrote down the premium as a % per period and judged whether it's worth the capped upside.", ko: "프리미엄을 기간당 %로 적고, 상단이 막히는 대가에 값하는지 판단했다." },
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
      title: { en: "Frame the decision as three questions", ko: "결정을 세 가지 질문으로 정리합니다" },
      body: {
        en: "\"Factor investing\" means deliberately tilting toward long-run return premia — **value**, **size**, **momentum**, **quality**, **low-volatility** — rather than just buying the whole market. An ETF sells you a label (\"value fund\"); a regression checks whether it walks the walk. Hold three questions:\n- **Does it load on the factor it claims?** A value ETF should show a positive tilt to the value factor, not a token one.\n- **How much of its return is just factor beta vs true skill (alpha)?** Most factor returns are beta you could get cheaply elsewhere.\n- **Do the factors explain it (R²), or is there a hidden bet?** Low R² means something else is driving returns.",
        ko: "\"팩터 투자\"란 시장 전체를 사는 대신, 장기 초과수익 프리미엄 — **가치**, **규모(사이즈)**, **모멘텀**, **퀄리티**, **저변동성** — 쪽으로 의도적으로 기울이는 것입니다. ETF는 라벨(\"가치 펀드\")을 팔지만, 회귀분석은 그 말대로 행동하는지 확인합니다. 세 가지 질문을 떠올리십시오.\n- **주장하는 팩터에 실제로 실려 있는가?** 가치 ETF라면 가치 팩터에 형식적이 아니라 뚜렷하게 양(+)의 성향을 보여야 합니다.\n- **수익 중 얼마가 단순 팩터 베타이고, 얼마가 진짜 실력(알파)인가?** 대부분의 팩터 수익은 다른 곳에서 싸게 얻을 수 있는 베타입니다.\n- **팩터로 설명되는가(R²), 아니면 숨은 베팅이 있는가?** R²이 낮으면 다른 무언가가 수익을 움직이고 있는 것입니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the numbers come from", ko: "숫자가 어디서 오는지" },
      body: {
        en: "The factor return series — Market, SMB (small-minus-big = size), HML (high-minus-low = value) — come straight from Kenneth French's data library at Dartmouth, the academic reference source everyone uses. The ETF's own returns come from Yahoo Finance price history. We regress the ETF's monthly excess returns on the three factors.",
        ko: "팩터 수익률 시계열 — 시장(Market), SMB(소형-대형 = 규모), HML(고-저 = 가치) — 은 다트머스 대학교 케네스 프렌치 데이터 라이브러리에서 곧바로 가져옵니다. 모두가 쓰는 학술적 기준 출처입니다. ETF 자체의 수익률은 야후 파이낸스 가격 이력에서 옵니다. ETF의 월별 초과수익률을 이 세 팩터에 회귀분석합니다.",
      },
      sources: [
        {
          name: { en: "Kenneth French Data Library (Dartmouth)", ko: "케네스 프렌치 데이터 라이브러리 (다트머스)" },
          what: { en: "The Fama-French 3-factor monthly return series: Market, SMB (size), HML (value), plus the risk-free rate.", ko: "파마-프렌치 3팩터 월별 수익률 시계열: 시장, SMB(규모), HML(가치), 그리고 무위험이자율." },
          why: { en: "It's the canonical, academic definition of the factors — the same data the original research and thousands of papers use, so your betas mean what the textbook says.", ko: "팩터의 정통 학술적 정의입니다. 원 논문과 수천 편의 연구가 쓰는 바로 그 데이터라, 여러분의 베타가 교과서가 말하는 의미 그대로가 됩니다." },
          url: "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html",
        },
        {
          name: { en: "Yahoo Finance (ETF prices)", ko: "야후 파이낸스 (ETF 가격)" },
          what: { en: "Monthly adjusted-close price history for the ETF (VTV, MTUM, QUAL, USMV, VLUE), turned into returns.", ko: "ETF(VTV, MTUM, QUAL, USMV, VLUE)의 월별 수정종가 이력. 이것을 수익률로 변환합니다." },
          why: { en: "It's free, adjusts for dividends and splits, and covers the whole ETF history — plenty for a monthly regression.", ko: "무료이고, 배당과 액면분할을 반영하며, ETF의 전체 이력을 담습니다. 월별 회귀에는 충분합니다." },
          url: "https://finance.yahoo.com/",
        },
      ],
    },
    {
      kind: "tool",
      title: { en: "Run the regression", ko: "회귀분석을 돌립니다" },
      body: {
        en: "Run the analyzer below on an ETF whose label you can predict — start with **VTV** (value):\n- Read the **factor betas**: HML is the value tilt, SMB the size tilt, Mkt the overall market exposure.\n- Read **alpha**: the annualized return *not* explained by the factors.\n- Read **R²**: how much of the ETF's month-to-month wiggle the three factors account for.\nThen re-run it on **MTUM** and **USMV** and watch the loadings change — momentum and low-vol aren't captured well by these three factors, which is itself informative.",
        ko: "라벨을 예측할 수 있는 ETF로 아래 분석기를 실행하십시오. **VTV**(가치)부터 시작합니다.\n- **팩터 베타**를 읽으십시오. HML은 가치 성향, SMB는 규모 성향, Mkt는 전체 시장 노출입니다.\n- **알파**를 읽으십시오. 팩터로 설명되지 *않는* 연율화 수익입니다.\n- **R²**를 읽으십시오. ETF의 월별 등락 중 세 팩터가 설명하는 비중입니다.\n그다음 **MTUM**과 **USMV**로 다시 돌려, 로딩이 어떻게 바뀌는지 보십시오. 모멘텀과 저변동성은 이 세 팩터로 잘 잡히지 않는데, 그 사실 자체가 정보를 줍니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the betas — is the tilt really there?", ko: "베타를 읽습니다 — 성향이 정말 있는가?" },
      body: {
        en: "Each beta is the ETF's sensitivity to that factor. For a value ETF, you want a clearly **positive HML** — say **+0.3 or more** is a real, deliberate value tilt; near **0** means it's value in name only. The **Mkt beta** should sit near **1** (it's still a stock fund). Watch for *unwanted* loadings: if your \"value\" fund also loads heavily positive on SMB, you're getting a size bet you may not have asked for. The sign matters as much as the size — a negative HML on a value fund is a red flag.",
        ko: "각 베타는 해당 팩터에 대한 ETF의 민감도입니다. 가치 ETF라면 뚜렷하게 **양(+)의 HML**을 원합니다. 예컨대 **+0.3 이상**이면 진짜로 의도된 가치 성향이고, **0** 근처면 이름만 가치입니다. **Mkt 베타**는 **1** 근처여야 합니다(여전히 주식 펀드니까요). *원치 않은* 로딩도 살피십시오. \"가치\" 펀드가 SMB에도 크게 양(+)으로 실려 있으면, 청하지 않은 규모 베팅을 떠안는 셈입니다. 크기만큼 부호도 중요합니다. 가치 펀드의 음(-)의 HML은 위험 신호입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read alpha — skill, or just repackaged beta?", ko: "알파를 읽습니다 — 실력인가, 재포장된 베타인가?" },
      body: {
        en: "Alpha is the return left over *after* the factors explain what they can — the part not accounted for by market, size, and value exposure. For a plain, cheap factor ETF you should expect alpha near **zero, maybe slightly negative** by the fund's fee. That's actually the *good* outcome: it means the ETF is delivering pure, honest factor beta and not much else. A large positive alpha over a short window is usually noise or luck, not a discovered edge — treat it with suspicion, not excitement. You're buying exposure, not a manager's magic.",
        ko: "알파는 팩터가 설명할 수 있는 부분을 *다 걷어낸 뒤* 남는 수익입니다. 시장·규모·가치 노출로 설명되지 않는 부분이죠. 저렴한 단순 팩터 ETF라면 알파는 **0 근처, 어쩌면 수수료만큼 약간 음(-)**일 것으로 기대해야 합니다. 사실 그것이 *좋은* 결과입니다. ETF가 군더더기 없이 순수하고 정직한 팩터 베타를 제공한다는 뜻이니까요. 짧은 기간의 큰 양(+)의 알파는 대개 발견된 우위가 아니라 잡음이나 운입니다. 흥분하지 말고 의심하십시오. 여러분이 사는 것은 노출이지, 운용자의 마법이 아닙니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read R² — and mind the honest limits", ko: "R²을 읽고, 솔직한 한계를 유념합니다" },
      body: {
        en: "R² tells you how much of the ETF's return the three factors explain. A broad value or market fund often shows **high R² (0.9+)** — the factors capture almost everything, so what you see is what you get. A momentum or quality ETF may show **lower R²**, because those tilts live *outside* the three-factor model (there are 5-factor and momentum-augmented models for exactly this reason). Low R² isn't necessarily bad — it can mean the fund's edge is a factor this model doesn't measure. Two honest caveats: betas drift over time, and a short return history makes every number shakier. This is a snapshot, not a guarantee.",
        ko: "R²은 ETF 수익 중 세 팩터가 얼마나 설명하는지 알려줍니다. 광범위한 가치·시장 펀드는 흔히 **높은 R²(0.9 이상)**을 보입니다. 팩터가 거의 전부를 잡아내니, 보이는 그대로입니다. 모멘텀이나 퀄리티 ETF는 **더 낮은 R²**를 보일 수 있는데, 그 성향들이 3팩터 모형 *바깥*에 살기 때문입니다(바로 이 때문에 5팩터·모멘텀 확장 모형이 있습니다). 낮은 R²이 반드시 나쁜 것은 아닙니다. 이 모형이 측정하지 못하는 팩터에 펀드의 우위가 있다는 뜻일 수 있습니다. 두 가지 솔직한 유의점: 베타는 시간이 지나며 흐르고, 짧은 수익 이력은 모든 숫자를 더 불안정하게 만듭니다. 이것은 스냅샷이지 보증이 아닙니다.",
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
        en: "Write it down: \"**____** advertises a **____** tilt. Its HML/SMB/momentum beta is ____, which (confirms / weakens) that claim. Its alpha is about ____%, so I'm getting (clean factor beta / an unexplained bet / a manager story). R² is ____, meaning the factors (do / don't) explain it. Given its expense ratio of ____%, I would (buy it for the tilt / skip it because ______).\"",
        ko: "이렇게 적으십시오. \"**____**는 **____** 성향을 광고한다. 그 HML/SMB/모멘텀 베타는 ____이고, 이는 그 주장을 (확인한다 / 약화시킨다). 알파는 약 ____%라, 나는 (깔끔한 팩터 베타 / 설명 안 되는 베팅 / 운용자 스토리)를 얻고 있다. R²은 ____라, 팩터가 이것을 (설명한다 / 설명하지 못한다). 총보수 ____%를 감안해, 나는 (그 성향을 위해 매수하겠다 / ______ 때문에 제외하겠다).\"",
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
        { en: "Named the factor the ETF advertises and checked its beta on that factor confirms the tilt.", ko: "ETF가 광고하는 팩터를 적고, 그 팩터의 베타가 성향을 확인해 주는지 점검했다." },
        { en: "Checked for unwanted loadings (a hidden size or market bet I didn't ask for).", ko: "원치 않은 로딩(청하지 않은 숨은 규모·시장 베팅)이 있는지 점검했다." },
        { en: "Judged alpha as near-zero (clean beta) vs a suspicious spike (noise or a story).", ko: "알파를 0 근처(깔끔한 베타)인지, 의심스러운 급등(잡음이나 스토리)인지 판단했다." },
        { en: "Read R² and noted whether the model even measures this fund's edge, plus the fee I pay.", ko: "R²을 읽고 이 모형이 펀드의 우위를 측정하기는 하는지, 그리고 내가 내는 수수료를 적었다." },
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
        en: "When Company A agrees to buy Company B at a fixed price, B's stock usually jumps toward that price but stops just short of it. That gap is the **arb spread** — the market's pay for holding the risk that the deal doesn't close. Merger arb harvests it. Hold three questions:\n- **How big is the spread, annualized?** A tiny gap over three days can be a huge annualized return; the same gap over two years is meager.\n- **What do I lose if it breaks?** If the deal dies, the stock usually falls back toward its **pre-announcement** price — often a much bigger loss than the spread you're chasing.\n- **What are the odds it closes?** You can back out the market-implied probability and ask whether *you* think it's too high or too low.",
        ko: "A사가 B사를 정해진 가격에 인수하기로 합의하면, B사 주가는 보통 그 가격 쪽으로 뛰지만 살짝 못 미쳐 멈춥니다. 그 간격이 **차익 스프레드**입니다. 딜이 성사되지 않을 위험을 떠안는 대가로 시장이 주는 것이죠. 합병 차익거래는 이걸 거둡니다. 세 가지 질문을 떠올리십시오.\n- **연율화하면 스프레드가 얼마나 큰가?** 사흘 동안의 작은 간격은 엄청난 연율 수익이 될 수 있고, 같은 간격이 2년이면 초라합니다.\n- **깨지면 얼마를 잃는가?** 딜이 무산되면 주가는 보통 **발표 이전** 가격 쪽으로 되돌아갑니다. 노리는 스프레드보다 훨씬 큰 손실인 경우가 많습니다.\n- **성사 확률은 얼마인가?** 시장이 암시하는 확률을 역산해, *내가* 보기에 그게 너무 높은지 낮은지 물을 수 있습니다.",
      },
    },
    {
      kind: "source",
      title: { en: "Where the deal terms come from", ko: "딜 조건이 어디서 오는지" },
      body: {
        en: "For a real deal, the terms aren't rumor — they're filed. The moment a merger is announced, the target files an **8-K** with SEC EDGAR containing the merger agreement (price, structure, conditions, break fees), followed by a proxy statement for the shareholder vote. That's your primary source. The companies' own press releases give you the plain-English version and the expected timeline. This lab pre-loads two illustrative deals — one that closed cleanly and one that broke — and lets you edit any field to model a live deal.",
        ko: "실제 딜의 조건은 소문이 아니라 공시됩니다. 합병이 발표되는 순간, 피인수 기업은 합병 계약서(가격, 구조, 조건, 위약금)를 담은 **8-K**를 SEC EDGAR에 제출하고, 이어서 주주총회 표결을 위한 위임장(proxy)을 냅니다. 그것이 1차 출처입니다. 기업의 보도자료는 쉬운 말로 된 요약과 예상 일정을 줍니다. 이 랩은 예시 딜 두 개 — 깔끔하게 성사된 것과 깨진 것 — 를 미리 불러오고, 어떤 항목이든 편집해 실제 딜을 모델링하게 해줍니다.",
      },
      sources: [
        {
          name: { en: "SEC EDGAR (merger 8-K / proxy)", ko: "SEC EDGAR (합병 8-K / 위임장)" },
          what: { en: "The primary deal terms: offer price, cash-vs-stock structure, closing conditions, regulatory approvals needed, break fees, and the expected close date.", ko: "1차 딜 조건: 인수 가격, 현금/주식 구조, 종료 조건, 필요한 규제 승인, 위약금, 예상 종료일." },
          why: { en: "It's the legally binding source — not a headline. Everything you plug into the analyzer should trace back to a filing, not a tweet.", ko: "헤드라인이 아니라 법적 구속력이 있는 출처입니다. 분석기에 넣는 모든 값은 트윗이 아니라 공시 문서로 거슬러 올라가야 합니다." },
          url: "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany",
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
        en: "Run the analyzer below. Start with the **clean-close** example, then the **broken** one:\n- Read **deal price**, **current price**, and **pre-announcement price**.\n- The **spread** = deal price − current price. Divide by current price for the raw return.\n- Enter the **expected days to close**; the tool **annualizes** the spread.\n- Note the **downside**: current price − pre-announcement price is roughly what you'd lose per share if it breaks.\nRun both deals and compare: the broken deal probably showed a *wider* spread — that width was the market pricing in the risk you now know played out.",
        ko: "아래 분석기를 실행하십시오. **정상 종료** 예시부터, 그다음 **결렬** 예시로 갑니다.\n- **딜 가격**, **현재가**, **발표 이전 가격**을 읽으십시오.\n- **스프레드** = 딜 가격 − 현재가. 현재가로 나누면 원시 수익률입니다.\n- **예상 종료 일수**를 입력하면 도구가 스프레드를 **연율화**합니다.\n- **하락 위험**에 주목하십시오. 현재가 − 발표 이전 가격이 딜이 깨질 때 주당 대략 잃는 금액입니다.\n두 딜을 다 돌려 비교하십시오. 결렬된 딜은 아마 *더 넓은* 스프레드를 보였을 겁니다. 그 넓이는 이제 여러분이 결과를 아는 그 위험을 시장이 가격에 반영한 것이었습니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Read the annualized spread — with a grain of salt", ko: "연율화 스프레드를 읽습니다 — 소금 한 꼬집과 함께" },
      body: {
        en: "Annualizing makes a small gap look impressive: a **1.5%** spread that closes in **90 days** annualizes to roughly **6%**. That's the headline merger-arb pros chase. But annualizing assumes you can redeploy the cash into an equally good deal the moment this one closes — not guaranteed. And it's exquisitely sensitive to the **time-to-close** you assume: if a deal drags an extra six months in regulatory review, that gaudy annualized number collapses. Treat the annualized figure as a ranking tool, not a promise.",
        ko: "연율화하면 작은 간격이 인상적으로 보입니다. **90일**에 종료되는 **1.5%** 스프레드는 대략 **6%**로 연율화됩니다. 합병 차익 전문가들이 좇는 헤드라인 숫자죠. 하지만 연율화는 이 딜이 종료되는 즉시 똑같이 좋은 딜에 현금을 재투입할 수 있다고 가정하는데, 보장된 게 아닙니다. 그리고 가정한 **종료 기간**에 극도로 민감합니다. 딜이 규제 심사로 여섯 달 더 끌면, 그 화려한 연율 숫자는 무너집니다. 연율화 수치는 약속이 아니라 순위를 매기는 도구로 다루십시오.",
      },
    },
    {
      kind: "read",
      title: { en: "Size the downside — the payoff is asymmetric", ko: "하락 위험을 가늠합니다 — 손익은 비대칭입니다" },
      body: {
        en: "This is the heart of merger arb, and where people get hurt. You win a small, capped amount (the spread) if the deal closes. You lose a large amount if it breaks — the stock craters back toward its pre-announcement price, sometimes below it. So the payoff is **asymmetric**: a single broken deal can erase the profit from *many* successful ones. Do the arithmetic explicitly: if the spread is 1.5% and the break-loss is 20%, one break wipes out **thirteen** clean closes. That ratio, not the annualized return, is the number that should keep you honest.",
        ko: "이것이 합병 차익거래의 핵심이자, 사람들이 다치는 지점입니다. 딜이 성사되면 작고 상한이 있는 금액(스프레드)을 법니다. 깨지면 큰 금액을 잃습니다. 주가가 발표 이전 가격 쪽으로, 때로는 그 아래로 폭락하니까요. 그래서 손익은 **비대칭**입니다. 딜 하나가 깨지면 성공한 *여러* 딜의 이익을 지울 수 있습니다. 산수를 명시적으로 해보십시오. 스프레드가 1.5%이고 결렬 손실이 20%라면, 한 번의 결렬이 정상 종료 **열세 번**을 날립니다. 연율 수익이 아니라 바로 이 비율이 여러분을 정직하게 붙잡아 둬야 할 숫자입니다.",
      },
    },
    {
      kind: "read",
      title: { en: "Back out the market-implied odds of closing", ko: "시장이 암시하는 종료 확률을 역산합니다" },
      body: {
        en: "The current price sits between the deal price and the break price, and *where* it sits tells you the market's implied probability of closing. Roughly: **implied P(close) ≈ (current − break price) ÷ (deal price − break price)**. If the current price is near the deal price, the market is nearly sure it closes (thin spread). If it's languishing near the break price, the market is scared. Now the real question flips from arithmetic to judgment: do **you** think that implied probability is right? An edge in merger arb comes from disagreeing — informed — with the market's read on regulatory risk, financing, or the shareholder vote. If you have no view, you have no edge.",
        ko: "현재가는 딜 가격과 결렬 가격 사이에 있고, *어디에* 있느냐가 시장이 암시하는 종료 확률을 알려줍니다. 대략: **암시 P(종료) ≈ (현재가 − 결렬 가격) ÷ (딜 가격 − 결렬 가격)**. 현재가가 딜 가격에 가까우면 시장은 종료를 거의 확신하는 것입니다(얇은 스프레드). 결렬 가격 근처에서 맴돌면 시장은 겁먹은 것입니다. 이제 진짜 질문이 산수에서 판단으로 바뀝니다. **여러분**은 그 암시 확률이 맞다고 보십니까? 합병 차익의 우위는 규제 위험·자금 조달·주주 표결에 대한 시장의 해석에, 근거를 갖고, 반대하는 데서 나옵니다. 시각이 없으면 우위도 없습니다.",
      },
    },
    {
      kind: "judge",
      title: { en: "Decide: paid enough for the break risk?", ko: "판단합니다: 결렬 위험에 값하는 대가를 받는가?" },
      body: {
        en: "Weigh the annualized spread against the asymmetric downside for THIS deal.",
        ko: "이 딜에서 연율화 스프레드를 비대칭 하락 위험과 저울질하십시오.",
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
        { en: "Sized the break-loss and wrote how many clean closes one break would wipe out.", ko: "결렬 손실을 가늠하고, 한 번의 결렬이 정상 종료 몇 번을 날리는지 적었다." },
        { en: "Backed out the market-implied probability and stated whether I disagree, with a reason.", ko: "시장이 암시하는 확률을 역산하고, 이유와 함께 그에 동의하는지 밝혔다." },
        { en: "This is a hypothesis about one deal's risk/reward, not a recommendation — deals break unexpectedly.", ko: "이것은 한 딜의 위험/보상에 대한 가설이지 추천이 아니다 — 딜은 예기치 않게 깨진다." },
      ],
    },
  ],
};
