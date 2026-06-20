import type { GlossaryEntry } from "./types";

/**
 * Bilingual technical-analysis glossary. Each entry's `match` forms are
 * auto-wrapped in an on-hover dictionary tooltip by the remarkGlossary plugin
 * at build time — no content files are edited.
 *
 * Keep definitions short (one or two sentences), plain-language, and
 * beginner-facing. Order does not matter; the plugin sorts by match length so
 * longer phrases win over substrings (e.g. "moving average" before "average").
 */
export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "momentum",
    match: ["momentum"],
    matchKo: ["모멘텀"],
    label: { en: "Momentum", ko: "모멘텀" },
    def: {
      en: "The speed and strength of a price move — how fast and forcefully price is changing, regardless of direction.",
      ko: "가격 움직임의 속도와 힘 — 방향과 무관하게 가격이 얼마나 빠르고 강하게 변하는지를 뜻합니다.",
    },
  },
  {
    id: "oscillator",
    match: ["oscillator"],
    matchKo: ["오실레이터"],
    label: { en: "Oscillator", ko: "오실레이터" },
    def: {
      en: "An indicator that moves back and forth within a fixed range (often 0–100), used to spot overbought/oversold conditions and momentum shifts.",
      ko: "정해진 범위(보통 0~100) 안에서 위아래로 움직이는 지표로, 과매수/과매도 상태와 모멘텀 변화를 포착하는 데 쓰입니다.",
    },
  },
  {
    id: "divergence",
    match: ["divergence"],
    matchKo: ["다이버전스"],
    label: { en: "Divergence", ko: "다이버전스" },
    def: {
      en: "When price and an indicator move in opposite directions (e.g. price makes a higher high but the indicator makes a lower high) — a hint that momentum is fading.",
      ko: "가격과 지표가 서로 반대로 움직이는 현상(예: 가격은 고점을 높이는데 지표는 고점을 낮춤) — 모멘텀이 약해지고 있다는 신호입니다.",
    },
  },
  {
    id: "overbought",
    match: ["overbought"],
    matchKo: ["과매수"],
    label: { en: "Overbought", ko: "과매수" },
    def: {
      en: "A condition where price has risen far and fast enough that a pause or pullback becomes more likely — not an automatic sell signal.",
      ko: "가격이 충분히 멀리, 빠르게 올라 잠시 멈추거나 되돌릴 가능성이 커진 상태 — 자동 매도 신호는 아닙니다.",
    },
  },
  {
    id: "oversold",
    match: ["oversold"],
    matchKo: ["과매도"],
    label: { en: "Oversold", ko: "과매도" },
    def: {
      en: "A condition where price has fallen far and fast enough that a bounce becomes more likely — not an automatic buy signal.",
      ko: "가격이 충분히 멀리, 빠르게 떨어져 반등 가능성이 커진 상태 — 자동 매수 신호는 아닙니다.",
    },
  },
  {
    id: "support",
    match: ["support level", "support"],
    matchKo: ["지지선", "지지"],
    label: { en: "Support", ko: "지지선" },
    def: {
      en: "A price level where buying tends to appear and halt a decline — a 'floor' that price has trouble falling through.",
      ko: "매수세가 나타나 하락을 멈추게 하는 가격대 — 가격이 쉽게 뚫고 내려가지 못하는 '바닥' 역할을 합니다.",
    },
  },
  {
    id: "resistance",
    match: ["resistance level", "resistance"],
    matchKo: ["저항선", "저항"],
    label: { en: "Resistance", ko: "저항선" },
    def: {
      en: "A price level where selling tends to appear and stall a rally — a 'ceiling' that price has trouble breaking above.",
      ko: "매도세가 나타나 상승을 멈추게 하는 가격대 — 가격이 쉽게 돌파하지 못하는 '천장' 역할을 합니다.",
    },
  },
  {
    id: "moving-average",
    match: ["moving average"],
    matchKo: ["이동평균선", "이동평균"],
    label: { en: "Moving average", ko: "이동평균선" },
    def: {
      en: "The average price over the last N periods, recalculated each bar so it slides forward — it smooths out noise to reveal the underlying trend.",
      ko: "최근 N개 기간의 평균 가격을 매 봉마다 다시 계산해 따라 움직이는 선으로, 잡음을 걸러 추세의 큰 흐름을 보여줍니다.",
    },
  },
  {
    id: "trend",
    match: ["uptrend", "downtrend"],
    matchKo: ["상승추세", "하락추세"],
    label: { en: "Trend", ko: "추세" },
    def: {
      en: "The general direction of price over time: an uptrend makes higher highs and higher lows; a downtrend makes lower highs and lower lows.",
      ko: "시간에 따른 가격의 전반적 방향: 상승추세는 고점과 저점을 점점 높이고, 하락추세는 고점과 저점을 점점 낮춥니다.",
    },
  },
  {
    id: "volume",
    match: ["volume"],
    matchKo: ["거래량"],
    label: { en: "Volume", ko: "거래량" },
    def: {
      en: "The number of shares or contracts traded in a period — a gauge of how much conviction is behind a price move.",
      ko: "한 기간 동안 거래된 주식·계약의 수 — 가격 움직임에 얼마나 강한 확신이 실렸는지를 가늠하는 척도입니다.",
    },
  },
  {
    id: "breakout",
    match: ["breakout"],
    matchKo: ["돌파"],
    label: { en: "Breakout", ko: "돌파" },
    def: {
      en: "When price pushes decisively beyond a support or resistance level, often signaling the start of a new move in that direction.",
      ko: "가격이 지지선이나 저항선을 분명하게 넘어서는 것으로, 그 방향으로 새로운 움직임이 시작됨을 알리는 경우가 많습니다.",
    },
  },
  {
    id: "confluence",
    match: ["confluence"],
    matchKo: ["컨플루언스", "근거의 중첩"],
    label: { en: "Confluence", ko: "컨플루언스" },
    def: {
      en: "When several independent signals point to the same price level or conclusion at once — stacked reasons are more reliable than any single one.",
      ko: "여러 독립적인 신호가 동시에 같은 가격대나 결론을 가리키는 것 — 근거가 겹칠수록 단일 신호보다 신뢰도가 높아집니다.",
    },
  },
  {
    id: "candlestick",
    match: ["candlestick"],
    matchKo: ["캔들스틱", "봉"],
    label: { en: "Candlestick", ko: "캔들스틱" },
    def: {
      en: "A price bar showing the open, high, low, and close for a period: the body spans open-to-close, the thin wicks show the high and low.",
      ko: "한 기간의 시가·고가·저가·종가를 보여주는 가격 봉으로, 몸통은 시가~종가, 가느다란 꼬리는 고가와 저가를 나타냅니다.",
    },
  },
  {
    id: "trendline",
    match: ["trendline", "trendlines"],
    matchKo: ["추세선"],
    label: { en: "Trendline", ko: "추세선" },
    def: {
      en: "A straight line connecting a series of higher lows (in an uptrend) or lower highs (in a downtrend) to visualize the slope and direction of a trend.",
      ko: "상승 추세에서 점점 높아지는 저점들을, 하락 추세에서 점점 낮아지는 고점들을 연결한 직선으로 추세의 기울기와 방향을 시각화한다.",
    },
  },
  {
    id: "neckline",
    match: ["neckline"],
    matchKo: ["목선"],
    label: { en: "Neckline", ko: "목선" },
    def: {
      en: "In head-and-shoulders or double-top patterns, the horizontal or slanted line connecting the reaction lows between the peaks; price must break below it to confirm the pattern.",
      ko: "헤드앤숄더나 이중 천장 패턴에서 봉우리들 사이의 저점들을 잇는 선으로, 가격이 이 선 아래로 돌파해야 패턴이 완성된다.",
    },
  },
  {
    id: "doji",
    match: ["doji"],
    matchKo: ["도지"],
    label: { en: "Doji", ko: "도지" },
    def: {
      en: "A candlestick where the open and close are virtually equal, forming a cross shape and signaling indecision between buyers and sellers.",
      ko: "시가와 종가가 거의 같아서 십자 모양을 이루는 캔들로, 매수자와 매도자 사이의 우유부단을 나타낸다.",
    },
  },
  {
    id: "hammer",
    match: ["hammer"],
    matchKo: ["망치형"],
    label: { en: "Hammer", ko: "망치형" },
    def: {
      en: "A candlestick with a small body near the top and a long lower shadow appearing after a downtrend, signaling that sellers pushed price down but buyers recovered it—a potential bullish reversal.",
      ko: "위쪽에 작은 몸통과 긴 아래쪽 그림자가 있는 캔들로 하락 추세 뒤에 나타나며, 매도자가 가격을 낮췄지만 매수자가 회복했음을 의미하는 잠재적 상승 반전이다.",
    },
  },
  {
    id: "engulfing",
    match: ["engulfing"],
    matchKo: ["장악형"],
    label: { en: "Engulfing", ko: "장악형" },
    def: {
      en: "A two-candle pattern where a larger candle completely covers the body of a smaller prior candle, signaling a shift in control from one side to the other.",
      ko: "더 큰 캔들이 작은 캔들의 몸통을 완전히 포함하는 두 캔들 패턴으로, 매수와 매도 세력 간 지배권의 전환을 나타낸다.",
    },
  },
  {
    id: "head-and-shoulders",
    match: ["head and shoulders"],
    matchKo: ["헤드앤숄더", "헤드앤숄더 천장형"],
    label: { en: "Head and Shoulders", ko: "헤드앤숄더" },
    def: {
      en: "A reversal pattern with three peaks—left shoulder, higher head, lower right shoulder—that forms at tops and signals a likely trend reversal when price breaks the neckline.",
      ko: "천장에서 형성되는 반전 패턴으로, 왼쪽 어깨, 더 높은 머리, 낮은 오른쪽 어깨로 이루어지며 가격이 목선 아래로 돌파할 때 추세 반전을 신호한다.",
    },
  },
  {
    id: "double-top-bottom",
    match: ["double top", "double bottom"],
    matchKo: ["이중천장", "이중바닥"],
    label: { en: "Double Top and Double Bottom", ko: "이중천장과 이중바닥" },
    def: {
      en: "A double top (two peaks at similar levels) signals failed buying; a double bottom (two troughs) signals failed selling—both confirm on a break of the level between them.",
      ko: "이중천장은 비슷한 높이의 두 봉우리로 매수 실패를 나타내고, 이중바닥은 두 골짜기로 매도 실패를 나타내며, 둘 다 그 사이의 레벨을 돌파할 때 확정된다.",
    },
  },
  {
    id: "triangle-pattern",
    match: ["triangle", "triangles", "symmetrical triangle", "ascending triangle", "descending triangle"],
    matchKo: ["삼각형", "대칭 삼각형", "상승 삼각형", "하락 삼각형"],
    label: { en: "Triangle", ko: "삼각형" },
    def: {
      en: "A continuation pattern formed by converging trendlines as price compresses into a narrowing range; breakout direction determines the next move.",
      ko: "가격이 점점 좁은 범위로 압축되면서 수렴하는 추세선들로 이루어진 지속 패턴으로, 돌파 방향이 다음 움직임을 결정한다.",
    },
  },
  {
    id: "flag-pennant",
    match: ["flag", "pennant"],
    matchKo: ["깃발", "페넌트", "깃발형", "페넌트형"],
    label: { en: "Flag and Pennant", ko: "깃발과 페넌트" },
    def: {
      en: "Continuation patterns following a sharp move (the flagpole): a flag is a small rectangle, a pennant is a tiny triangle—both usually mark the midpoint of the move.",
      ko: "가파른 움직임(깃대) 뒤에 형성되는 지속 패턴으로, 깃발은 작은 직사각형, 페넌트는 작은 삼각형이며 보통 움직임의 중간 지점을 표시한다.",
    },
  },
  {
    id: "cup-and-handle",
    match: ["cup and handle"],
    matchKo: ["컵앤핸들"],
    label: { en: "Cup and Handle", ko: "컵앤핸들" },
    def: {
      en: "A bullish pattern with a rounded cup (1–6 months) followed by a small downward pullback (handle) that retraces roughly 30–50% of the cup's rise, then breaks out above the rim.",
      ko: "둥근 컵(1~6개월) 뒤에 컵 상승의 30~50%를 되돌리는 작은 하향 핸들이 이어지고 나서 가장자리 위로 돌파하는 강세 패턴이다.",
    },
  },
  {
    id: "measured-move-target",
    match: ["measured-move target", "measured target", "measured objective"],
    matchKo: ["측정된 목표가"],
    label: { en: "Measured-Move Target", ko: "측정된 목표가" },
    def: {
      en: "A price objective calculated by measuring a pattern's height and projecting that distance from the breakout level—a rough estimate, not a guarantee.",
      ko: "패턴의 높이를 측정해 돌파 지점에서 그 거리를 투영하여 구한 가격 목표치로, 약속이 아닌 추정치이다.",
    },
  },
  {
    id: "retest",
    match: ["retest"],
    matchKo: ["리테스트"],
    label: { en: "Retest", ko: "리테스트" },
    def: {
      en: "When price returns to and re-touches a broken support or resistance level, often acting as confirmation of the breakout and a higher-probability entry point.",
      ko: "가격이 돌파된 지지선이나 저항선으로 돌아와 다시 닿는 현상으로, 종종 돌파를 확인해주고 신뢰도 높은 진입 기회를 제공한다.",
    },
  },
  {
    id: "bullish-bearish",
    match: ["bullish", "bearish", "bull", "bear"],
    matchKo: ["상승", "하락", "황소", "곰"],
    label: { en: "Bullish and Bearish", ko: "상승과 하락" },
    def: {
      en: "Bullish means upward price movement or buyer optimism; bearish means downward movement or seller pessimism. A bull market rises; a bear market falls.",
      ko: "상승은 가격이 올라가거나 매수자가 낙관적임을 의미하고, 하락은 가격이 내려가거나 매도자가 비관적임을 의미한다.",
    },
  },
  {
    id: "confirmation",
    match: ["confirmation", "confirm"],
    matchKo: ["확인", "확정"],
    label: { en: "Confirmation", ko: "확인" },
    def: {
      en: "Evidence that validates a signal—such as a pattern completing on rising volume, or two market averages both making new highs together, raising the probability that the move is genuine.",
      ko: "신호를 검증하는 증거로, 예를 들어 거래량 증가와 함께 패턴이 완성되거나 두 시장 평균이 함께 신고가를 만드는 것처럼 그 움직임이 진짜일 확률을 높인다.",
    },
  },
  {
    id: "fake-breakout-fakeout",
    match: ["false breakout", "fakeout"],
    matchKo: ["가짜 돌파", "페이크아웃"],
    label: { en: "False Breakout (Fakeout)", ko: "가짜 돌파" },
    def: {
      en: "When price pokes through a support or resistance level, triggering entries and stops, then snaps back inside the range instead of following through—a common trap.",
      ko: "가격이 지지선이나 저항선을 살짝 뚫어 진입과 손절을 촉발한 뒤 박스권 안으로 다시 튕겨 돌아오는 현상으로, 초보자가 자주 당하는 함정이다.",
    },
  },
  {
    id: "stop-loss",
    match: ["stop-loss"],
    matchKo: ["손절", "손절매"],
    label: { en: "Stop-Loss", ko: "손절" },
    def: {
      en: "A pre-set exit price placed beyond an invalidation point that automatically closes a losing position, capping your maximum loss on a trade.",
      ko: "패턴이나 지지선이 깨질 경우를 대비해 미리 정해둔 청산 가격으로, 손실을 제한하는 손실 거래를 자동으로 청산한다.",
    },
  },
  {
    id: "momentum-oscillator",
    match: ["momentum oscillator", "momentum oscillators"],
    matchKo: ["모멘텀 오실레이터"],
    label: { en: "Momentum Oscillator", ko: "모멘텀 오실레이터" },
    def: {
      en: "An indicator that measures the speed and strength of price changes, oscillating between extremes to signal when a trend is gaining or losing power.",
      ko: "가격 변화의 속도와 강도를 측정하며, 추세가 힘을 얻거나 잃을 때를 알려주기 위해 극단값 사이를 오갑니다.",
    },
  },
  {
    id: "rsi-relative-strength-index",
    match: ["Relative Strength Index", "RSI"],
    matchKo: ["상대강도지수", "RSI"],
    label: { en: "RSI (Relative Strength Index)", ko: "RSI (상대강도지수)" },
    def: {
      en: "A 0–100 momentum indicator that measures how much of recent price movement was upward versus downward, showing when a trend is gaining steam or weakening.",
      ko: "최근 가격 변화 중 상승분의 비율을 0~100 척도로 측정하는 모멘텀 지표로, 추세의 강도를 보여줍니다.",
    },
  },
  {
    id: "stochastic-oscillator",
    match: ["Stochastic Oscillator", "Stochastic"],
    matchKo: ["스토캐스틱 오실레이터", "스토캐스틱"],
    label: { en: "Stochastic Oscillator", ko: "스토캐스틱 오실레이터" },
    def: {
      en: "A 0–100 momentum indicator that shows where today's closing price falls within the recent high-low range, signaling whether buyers or sellers are in control.",
      ko: "오늘의 종가가 최근 고가-저가 변동폭 안의 어디에 위치하는지를 0~100 척도로 보여주는 모멘텀 지표입니다.",
    },
  },
  {
    id: "macd",
    match: ["MACD", "Moving Average Convergence Divergence"],
    matchKo: ["MACD", "이동평균 수렴·확산"],
    label: { en: "MACD (Moving Average Convergence Divergence)", ko: "MACD (이동평균 수렴·확산)" },
    def: {
      en: "A trend-and-momentum indicator built from two moving averages; when they converge (narrow gap) momentum is fading, when they diverge (widen gap) momentum is strengthening.",
      ko: "두 이동평균의 차이로 만든 지표로, 간격이 벌어질수록 상승 모멘텀이 강하고, 좁아질수록 약해집니다.",
    },
  },
  {
    id: "exponential-moving-average",
    match: ["Exponential Moving Average", "EMA"],
    matchKo: ["지수이동평균", "EMA"],
    label: { en: "Exponential Moving Average (EMA)", ko: "EMA (지수이동평균)" },
    def: {
      en: "A moving average that weighs recent prices more heavily than older ones, so it responds faster to price changes than a simple average.",
      ko: "최근 가격에 더 큰 가중치를 부여하는 이동평균으로, 단순 이동평균보다 가격 변화에 빠르게 반응합니다.",
    },
  },
  {
    id: "signal-line-crossover",
    match: ["signal-line crossover", "signal line crossover", "crossover"],
    matchKo: ["시그널선 교차", "크로스오버"],
    label: { en: "Signal-Line Crossover", ko: "시그널선 교차" },
    def: {
      en: "When a fast-moving indicator line crosses above or below a slower smoothed version of itself, often used to trigger buy or sell signals.",
      ko: "빠르게 움직이는 지표선이 그 선을 평활화한 느린 버전을 상향 또는 하향 돌파할 때 매수 또는 매도 신호로 사용됩니다.",
    },
  },
  {
    id: "centerline-zero-cross",
    match: ["centerline", "zero line", "zero cross", "zero crossover"],
    matchKo: ["중심선", "0선", "0 교차"],
    label: { en: "Centerline / Zero Crossover", ko: "중심선 (0선) 교차" },
    def: {
      en: "When an indicator crosses its neutral zero line, typically marking a shift in the balance between upside and downside momentum.",
      ko: "지표가 중립 위치인 0선을 교차할 때로, 상승과 하락 모멘텀의 균형이 바뀌었음을 나타냅니다.",
    },
  },
  {
    id: "histogram",
    match: ["histogram", "MACD histogram"],
    matchKo: ["히스토그램", "MACD 히스토그램"],
    label: { en: "Histogram (MACD)", ko: "히스토그램" },
    def: {
      en: "In MACD, the vertical bars showing the distance between the MACD line and its signal line—the first thing to shrink when momentum begins to fade.",
      ko: "MACD에서 MACD 선과 시그널 선 사이의 거리를 나타내는 막대로, 모멘텀이 약해지기 시작할 때 가장 먼저 줄어듭니다.",
    },
  },
  {
    id: "lookback-period",
    match: ["lookback", "look-back period", "lookback period"],
    matchKo: ["룩백", "룩백 기간"],
    label: { en: "Lookback Period", ko: "룩백 (회고 기간)" },
    def: {
      en: "The number of prior bars or time periods an indicator uses for its calculation—for example, a 14-period RSI looks back at the last 14 candles.",
      ko: "지표가 계산을 위해 참고하는 이전 봉이나 기간의 개수. 예를 들어 14기간 RSI는 지난 14개 봉을 되돌아봅니다.",
    },
  },
  {
    id: "smoothing",
    match: ["smoothing", "smoothed"],
    matchKo: ["평활화", "평활"],
    label: { en: "Smoothing", ko: "평활화" },
    def: {
      en: "A technique (usually averaging) applied to an indicator to reduce noise and sudden spikes, making trends clearer but also delaying the signal.",
      ko: "지표에 적용하여 노이즈를 줄이고 더 부드럽게 만드는 기법. 추세를 명확히 하지만 신호가 늦어질 수 있습니다.",
    },
  },
  {
    id: "lower-high-higher-low",
    match: ["lower high", "higher low", "lower low", "higher high"],
    matchKo: ["더 낮은 고점", "더 높은 저점", "더 낮은 저점", "더 높은 고점"],
    label: { en: "Lower High / Higher Low (Price Structure)", ko: "더 낮은 고점 / 더 높은 저점" },
    def: {
      en: "Terms describing successive peaks and troughs: a higher high means a new peak above the prior one; a lower low means a new trough below the prior one.",
      ko: "연속적인 고점과 저점을 설명하는 용어로, 더 높은 고점은 이전 고점보다 높은 새 정점을, 더 낮은 저점은 이전보다 낮은 새 저점을 뜻합니다.",
    },
  },
  {
    id: "trend-filter",
    match: ["trend filter"],
    matchKo: ["추세 필터"],
    label: { en: "Trend Filter", ko: "추세 필터" },
    def: {
      en: "A method (often a long moving average) used to confirm the larger trend direction before taking indicator signals, reducing false signals against the prevailing trend.",
      ko: "지표 신호를 따르기 전에 큰 추세 방향을 미리 확인하는 방법으로, 지배적인 추세에 반대되는 거짓 신호를 줄입니다.",
    },
  },
  {
    id: "whipsaw",
    match: ["whipsaw", "whipsaws", "whipsaw-prone"],
    matchKo: ["휩소", "휩쏘"],
    label: { en: "Whipsaw", ko: "휩소 (위닝)" },
    def: {
      en: "Rapid back-and-forth moves in price or an indicator that trigger conflicting signals in quick succession, causing traders to lose money on bad entries and fees.",
      ko: "가격이나 지표가 위아래로 급격히 오갔다 가는 현상으로, 빠르게 뒤바뀌는 신호로 인해 손실이 발생합니다.",
    },
  },
  {
    id: "pullback",
    match: ["pullback", "pullbacks"],
    matchKo: ["눌림목", "회조정"],
    label: { en: "Pullback", ko: "눌림목" },
    def: {
      en: "A temporary decline in price during an uptrend, usually offering a lower-risk entry point for buyers expecting the trend to resume.",
      ko: "상승 추세 중에 일시적으로 가격이 하락하는 것으로, 추세 재개를 기대하는 매수자들의 진입 기회가 됩니다.",
    },
  },
  {
    id: "curve-fitting",
    match: ["curve-fitting", "curve fitting"],
    matchKo: ["커브 피팅", "곡선적합"],
    label: { en: "Curve-Fitting", ko: "커브 피팅" },
    def: {
      en: "Over-optimizing indicator settings on historical data until past trades look perfect, creating a false sense of accuracy that fails on future, unseen data.",
      ko: "과거 데이터에서 완벽한 결과가 나오도록 지표 설정을 과도하게 최적화하면 미래 데이터에서는 실패하는 현상입니다.",
    },
  },
  {
    id: "lag-lagging",
    match: ["lag", "lagging", "lags"],
    matchKo: ["후행", "지연"],
    label: { en: "Lag / Lagging", ko: "후행 (지연)" },
    def: {
      en: "When an indicator reacts slower than price action itself, causing signals to appear after much of the move has already happened.",
      ko: "지표가 가격보다 더 늦게 반응해서 신호가 대부분의 가격 변화가 이미 일어난 후에 나타나는 현상입니다.",
    },
  },
  {
    id: "sma",
    match: ["SMA", "Simple Moving Average"],
    matchKo: ["SMA", "단순이동평균"],
    label: { en: "Simple Moving Average (SMA)", ko: "단순이동평균" },
    def: {
      en: "An unweighted average of the last N closing prices, where every price counts equally.",
      ko: "최근 N개 종가의 가중치 없는 평균으로, 모든 가격이 동등하게 반영된다.",
    },
  },
  {
    id: "golden-cross",
    match: ["golden cross"],
    matchKo: ["골든크로스"],
    label: { en: "Golden Cross", ko: "골든크로스" },
    def: {
      en: "A bullish signal when a shorter moving average crosses above a longer one (e.g., 50-day above 200-day).",
      ko: "짧은 이동평균이 긴 이동평균을 위로 뚫고 올라가는 강세 신호(예: 50일선이 200일선 위로).",
    },
  },
  {
    id: "death-cross",
    match: ["death cross"],
    matchKo: ["데드크로스"],
    label: { en: "Death Cross", ko: "데드크로스" },
    def: {
      en: "A bearish signal when a shorter moving average crosses below a longer one (e.g., 50-day below 200-day).",
      ko: "짧은 이동평균이 긴 이동평균을 아래로 뚫고 내려가는 약세 신호(예: 50일선이 200일선 아래로).",
    },
  },
  {
    id: "bollinger-bands",
    match: ["Bollinger Bands", "bollinger bands"],
    matchKo: ["볼린저 밴드"],
    label: { en: "Bollinger Bands", ko: "볼린저 밴드" },
    def: {
      en: "A volatility-based envelope drawn around a moving average that widens in volatile markets and tightens when calm, measuring relative highs and lows.",
      ko: "이동평균선 주위에 그려진 변동성 기반 외피로, 변동성이 클 때 넓어지고 잠잠할 때 좁혀져 상대적 고점과 저점을 측정한다.",
    },
  },
  {
    id: "squeeze",
    match: ["the Squeeze", "Squeeze"],
    matchKo: ["스퀴즈"],
    label: { en: "Squeeze", ko: "스퀴즈" },
    def: {
      en: "A setup where Bollinger Bands tighten to a multi-month low, signaling extreme calm before an expected volatility expansion.",
      ko: "볼린저 밴드가 수개월 만의 최저로 좁혀지는 상황으로, 변동성 확장 직전의 극단적 평온을 나타낸다.",
    },
  },
  {
    id: "standard-deviation",
    match: ["standard deviation"],
    matchKo: ["표준편차"],
    label: { en: "Standard Deviation", ko: "표준편차" },
    def: {
      en: "A statistical measure of how spread out recent prices are from their average; used to set band width in Bollinger Bands.",
      ko: "최근 가격이 평균에서 얼마나 퍼져 있는지를 나타내는 통계적 측정값으로, 볼린저 밴드의 폭을 결정하는 데 사용된다.",
    },
  },
  {
    id: "w-bottom",
    match: ["W-Bottom", "W-bottom", "W bottom"],
    matchKo: ["W-바닥", "W 바닥"],
    label: { en: "W-Bottom", ko: "W-바닥" },
    def: {
      en: "A bullish reversal pattern where price forms two lows with the second low holding above the lower band, signaling weakening selling pressure.",
      ko: "강세 반전 패턴으로, 가격이 두 개의 저점을 형성하되 두 번째 저점이 하단 밴드 위에서 버틸 때, 매도세가 약해지고 있음을 나타낸다.",
    },
  },
  {
    id: "m-top",
    match: ["M-Top", "M-top", "M top"],
    matchKo: ["M-천장", "M 천장"],
    label: { en: "M-Top", ko: "M-천장" },
    def: {
      en: "A bearish reversal pattern where price forms two highs with the second high failing to reach the upper band, signaling weakening momentum.",
      ko: "약세 반전 패턴으로, 가격이 두 개의 고점을 형성하되 두 번째 고점이 상단 밴드에 도달하지 못할 때, 모멘텀이 약해지고 있음을 나타낸다.",
    },
  },
  {
    id: "percent-b",
    match: ["%b"],
    matchKo: ["%b"],
    label: { en: "%b (Percent B)", ko: "%b" },
    def: {
      en: "A number from 0 to 1 showing where price sits within the Bollinger Bands; 0.5 = middle band, 1.0 = upper band, >1 = outside the bands.",
      ko: "가격이 볼린저 밴드 안에서 어디에 위치하는지를 0부터 1까지 나타낸 수치로, 0.5 = 중간 밴드, 1.0 = 상단 밴드, 1 초과 = 밴드 바깥.",
    },
  },
  {
    id: "bandwidth",
    match: ["BandWidth"],
    matchKo: ["밴드폭"],
    label: { en: "BandWidth", ko: "밴드폭" },
    def: {
      en: "A measure of how wide the Bollinger Bands are relative to the middle band, showing the current level of volatility.",
      ko: "중간 밴드 대비 볼린저 밴드의 폭을 나타내는 지표로, 현재의 변동성 수준을 보여준다.",
    },
  },
  {
    id: "adx",
    match: ["ADX", "Average Directional Index"],
    matchKo: ["ADX", "평균 방향성 지수"],
    label: { en: "ADX (Average Directional Index)", ko: "ADX" },
    def: {
      en: "An indicator measuring trend strength (not direction) on a scale of 0–100; above 25 signals a strong trend worth following.",
      ko: "추세의 강도(방향이 아님)를 0~100 척도로 측정하는 지표로, 25 이상이면 따라갈 만한 강한 추세를 나타낸다.",
    },
  },
  {
    id: "dmi",
    match: ["DMI", "+DI", "−DI"],
    matchKo: ["DMI", "+DI", "−DI"],
    label: { en: "DMI (Directional Movement Index)", ko: "DMI" },
    def: {
      en: "Two lines (+DI and −DI) showing whether buyers or sellers have control; when +DI crosses above −DI it is bullish, the reverse is bearish.",
      ko: "구매자와 판매자 중 누가 우위를 점하고 있는지 보여주는 두 개의 선(+DI, −DI)으로, +DI가 −DI 위로 교차하면 강세, 그 반대는 약세다.",
    },
  },
  {
    id: "atr",
    match: ["ATR", "Average True Range"],
    matchKo: ["ATR", "평균 실제 범위"],
    label: { en: "ATR (Average True Range)", ko: "ATR" },
    def: {
      en: "A volatility measure showing the average size of price moves, accounting for gaps; higher ATR means bigger swings are happening.",
      ko: "갭을 포함해 가격 변동의 평균 크기를 나타내는 변동성 지표로, ATR이 높을수록 더 큰 움직임이 일어나고 있다는 뜻이다.",
    },
  },
  {
    id: "true-range",
    match: ["True Range", "true range"],
    matchKo: ["실제 범위"],
    label: { en: "True Range (TR)", ko: "실제 범위" },
    def: {
      en: "The largest of: today's high minus low, distance from today's high to yesterday's close, or yesterday's close to today's low; captures gap moves.",
      ko: "당일 고가에서 저가의 거리, 당일 고가와 전일 종가의 거리, 전일 종가와 당일 저가의 거리 중 가장 큰 값으로, 갭 움직임을 포착한다.",
    },
  },
  {
    id: "regime",
    match: ["regime", "trend regime", "range regime"],
    matchKo: ["국면", "추세 국면", "박스권 국면"],
    label: { en: "Regime", ko: "국면" },
    def: {
      en: "The current market state — either trending (strong directional move) or ranging (sideways, choppy action); different strategies work in each.",
      ko: "현재의 시장 상태로, 추세 국면(강한 방향 움직임) 또는 박스권 국면(옆으로 움직임, 불규칙)이 있으며 각각 다른 전략이 효과적이다.",
    },
  },
  {
    id: "volatility",
    match: ["volatility"],
    matchKo: ["변동성"],
    label: { en: "Volatility", ko: "변동성" },
    def: {
      en: "How much and how fast price swings up and down; high volatility means bigger, faster moves; low volatility means smaller, slower moves.",
      ko: "가격이 오르내리는 정도와 속도로, 높은 변동성은 더 크고 빠른 움직임을, 낮은 변동성은 더 작고 느린 움직임을 의미한다.",
    },
  },
  {
    id: "obv",
    match: ["On-Balance Volume", "OBV"],
    matchKo: ["누적거래량지표", "OBV"],
    label: { en: "On-Balance Volume (OBV)", ko: "누적거래량지표(OBV)" },
    def: {
      en: "A cumulative total that adds or subtracts the day's volume based on whether price closed higher or lower than the previous day, converting volume into a single trending line.",
      ko: "종가가 전일보다 높으면 거래량을 더하고 낮으면 빼서, 거래량을 하나의 추세선으로 변환한 누적 합계.",
    },
  },
  {
    id: "retracement",
    match: ["retracement", "retracements"],
    matchKo: ["되돌림"],
    label: { en: "Retracement", ko: "되돌림" },
    def: {
      en: "The degree to which price retreats from a swing high or low before resuming the original trend, often measured as a percentage.",
      ko: "가격이 스윙 고점이나 저점에서부터 되돌아가는 정도로, 종종 백분율로 측정된다.",
    },
  },
  {
    id: "fibonacci-retracement",
    match: ["Fibonacci retracement", "Fibonacci retracements", "Fibonacci level", "Fibonacci levels"],
    matchKo: ["피보나치 되돌림", "피보나치 레벨"],
    label: { en: "Fibonacci Retracement", ko: "피보나치 되돌림" },
    def: {
      en: "Price levels derived from Fibonacci ratios (23.6%, 38.2%, 61.8%, etc.) where price often pauses or reverses during a pullback.",
      ko: "피보나치 비율(23.6%, 38.2%, 61.8% 등)에서 나온 가격 수준으로, 되돌림 중에 가격이 멈추거나 반전하기 쉬운 곳.",
    },
  },
  {
    id: "impulse",
    match: ["impulse", "impulses"],
    matchKo: ["임펄스"],
    label: { en: "Impulse", ko: "임펄스" },
    def: {
      en: "In Elliott Wave theory, a five-wave motive pattern that moves in the direction of the larger trend with waves 1, 3, and 5 pushing forward and waves 2 and 4 pulling back.",
      ko: "엘리엇 파동 이론에서 더 큰 추세 방향으로 움직이는 5파 추진 패턴으로, 1, 3, 5파는 앞으로 나가고 2, 4파는 되돌아온다.",
    },
  },
  {
    id: "correction",
    match: ["correction", "corrective", "corrective phase"],
    matchKo: ["조정", "조정파", "조정 국면"],
    label: { en: "Correction", ko: "조정" },
    def: {
      en: "In Elliott Wave theory, a three-wave pattern (A-B-C) that moves against the larger trend after an impulse completes.",
      ko: "엘리엇 파동 이론에서 임펄스 후에 더 큰 추세에 반하여 움직이는 3파 패턴(A-B-C).",
    },
  },
  {
    id: "elliott-wave",
    match: ["Elliott Wave", "Elliott wave", "wave count"],
    matchKo: ["엘리엇 파동", "파동 카운트"],
    label: { en: "Elliott Wave Theory", ko: "엘리엇 파동 이론" },
    def: {
      en: "A theory that markets move in repeating five-wave motive and three-wave corrective patterns driven by crowd psychology at every timeframe.",
      ko: "시장이 모든 시간 단위에서 군중 심리에 의해 추동되는 반복적인 5파 추진과 3파 조정 패턴으로 움직인다는 이론.",
    },
  },
  {
    id: "fractal",
    match: ["fractal", "fractals", "self-similarity"],
    matchKo: ["프랙탈", "자기 유사성"],
    label: { en: "Fractal", ko: "프랙탈" },
    def: {
      en: "In Elliott Wave, the property that each wave contains smaller waves of the same pattern, and is itself part of a larger wave at the same structure.",
      ko: "엘리엇 파동에서 각 파동이 같은 패턴의 더 작은 파동들을 포함하며, 동시에 더 큰 파동의 일부인 성질.",
    },
  },
  {
    id: "momentum-divergence",
    match: ["momentum divergence"],
    matchKo: ["모멘텀 다이버전스"],
    label: { en: "Momentum Divergence", ko: "모멘텀 다이버전스" },
    def: {
      en: "When price reaches a new high but a momentum indicator like RSI does not, signaling the impulse may be exhausting.",
      ko: "가격은 새 고점에 도달하지만 RSI 같은 모멘텀 지표는 그렇지 않아, 추진력이 소진되고 있음을 나타내는 현상.",
    },
  },
  {
    id: "invalidation",
    match: ["invalidation", "invalidate"],
    matchKo: ["무효화"],
    label: { en: "Invalidation", ko: "무효화" },
    def: {
      en: "The specific price level at which a wave count, pattern, or forecast is proven wrong and must be abandoned.",
      ko: "파동 카운트, 패턴, 또는 예측이 틀렸음을 증명하는 특정 가격 수준으로, 그 지점에 도달하면 카운트를 포기해야 한다.",
    },
  },
  {
    id: "accumulation-distribution",
    match: ["accumulation", "distribution"],
    matchKo: ["매집", "분산"],
    label: { en: "Accumulation & Distribution", ko: "매집과 분산" },
    def: {
      en: "Accumulation: large buyers absorbing shares quietly without pushing price up; Distribution: large holders unloading shares into rising price.",
      ko: "매집: 큰손이 가격을 끌어올리지 않은 채 조용히 물량을 흡수함; 분산: 대량 보유자가 가격 상승 중에 물량을 떨어뜨림.",
    },
  },
  {
    id: "volume-by-price",
    match: ["Volume-by-Price", "volume profile"],
    matchKo: ["가격대별 거래량", "볼륨 프로파일"],
    label: { en: "Volume-by-Price", ko: "가격대별 거래량" },
    def: {
      en: "A chart that shows how much trading volume occurred at each price level, revealing zones where buyers and sellers have fought and may resist future moves.",
      ko: "각 가격 수준에서 얼마나 많은 거래가 일어났는지를 보여주는 차트로, 매수자와 매도자가 싸웠으며 향후 움직임에 저항할 수 있는 구간을 드러낸다.",
    },
  },
  {
    id: "golden-ratio",
    match: ["golden ratio", "phi", "Fibonacci sequence"],
    matchKo: ["황금비", "파이", "피보나치 수열"],
    label: { en: "Golden Ratio (Phi)", ko: "황금비" },
    def: {
      en: "The mathematical ratio (1.618...) that emerges from the Fibonacci sequence and appears in many Fibonacci retracement and extension levels used in trading.",
      ko: "피보나치 수열에서 나타나는 수학적 비율(1.618...)로, 트레이딩에 쓰이는 많은 피보나치 되돌림 및 확장 레벨에서 나타난다.",
    },
  },
  {
    id: "climax-volume",
    match: ["climax volume", "selling climax", "buying climax"],
    matchKo: ["클라이맥스 거래량", "셀링 클라이맥스", "바잉 클라이맥스"],
    label: { en: "Climax Volume", ko: "클라이맥스 거래량" },
    def: {
      en: "An enormous volume spike at the end of a strong move that signals the last participants are exhausting, often preceding a reversal.",
      ko: "강한 움직임의 끝에서 나타나는 거대한 거래량 급증으로, 마지막 참여자들이 소진되었음을 나타내며 종종 반전을 앞둔다.",
    },
  },
  {
    id: "tenkan-sen",
    match: ["Tenkan-sen", "Conversion Line"],
    matchKo: ["전환선"],
    label: { en: "Tenkan-sen (Conversion Line)", ko: "전환선" },
    def: {
      en: "The faster of two equilibrium lines in Ichimoku, calculated as the midpoint of the 9-period high and low, showing short-term momentum.",
      ko: "일목균형표의 두 균형선 중 빠른 쪽으로, 9기간의 고가와 저가의 중간값으로 계산되며 단기 모멘텀을 나타낸다.",
    },
  },
  {
    id: "kijun-sen",
    match: ["Kijun-sen", "Base Line"],
    matchKo: ["기준선"],
    label: { en: "Kijun-sen (Base Line)", ko: "기준선" },
    def: {
      en: "The medium-speed equilibrium line in Ichimoku, calculated as the midpoint of the 26-period high and low; acts as a key support/resistance level and magnet for price.",
      ko: "일목균형표의 중간 속도 균형선으로, 26기간 고가와 저가의 중간값이며 핵심 지지/저항 수준으로 작동한다.",
    },
  },
  {
    id: "senkou-span",
    match: ["Senkou Span A", "Senkou Span B", "Leading Span A", "Leading Span B"],
    matchKo: ["선행스팬 A", "선행스팬 B"],
    label: { en: "Senkou Span A/B (Leading Spans)", ko: "선행스팬 A/B" },
    def: {
      en: "The two lines that form the Ichimoku cloud, plotted 26 periods into the future to project where support and resistance will sit ahead of current price.",
      ko: "일목균형표 구름대를 이루는 두 선으로, 현재 가격보다 앞으로 26기간 미래에 표시되어 앞으로의 지지·저항 위치를 투영한다.",
    },
  },
  {
    id: "chikou-span",
    match: ["Chikou Span", "Lagging Span"],
    matchKo: ["후행스팬"],
    label: { en: "Chikou Span (Lagging Span)", ko: "후행스팬" },
    def: {
      en: "Today's closing price plotted 26 periods into the past; confirms an uptrend when it floats above old price and the old cloud.",
      ko: "오늘의 종가를 26기간 뒤로 옮겨 표시한 선으로, 과거 가격과 과거 구름대 위에 떠 있을 때 상승추세를 확인해 준다.",
    },
  },
  {
    id: "kumo-cloud",
    match: ["Kumo", "the cloud"],
    matchKo: ["구름대"],
    label: { en: "Kumo (Cloud)", ko: "구름대" },
    def: {
      en: "The shaded area between Senkou Span A and B in Ichimoku; a thick cloud means strong support/resistance, a thin cloud is weak and easily pierced.",
      ko: "일목균형표에서 선행스팬 A와 B 사이의 음영 처리된 영역으로, 두꺼우면 강한 지지/저항, 얇으면 약하고 쉽게 뚫린다.",
    },
  },
  {
    id: "parabolic-sar",
    match: ["Parabolic SAR", "SAR"],
    matchKo: ["파라볼릭 SAR"],
    label: { en: "Parabolic SAR (Stop and Reverse)", ko: "파라볼릭 SAR" },
    def: {
      en: "A Wilder trend-following indicator that prints a trailing dot above or below price, flipping when price crosses it; whipsaws badly in sideways markets.",
      ko: "가격을 추적하며 위 또는 아래에 점을 찍는 와일더 추세 추종 지표로, 가격이 그것을 가로지르면 반전한다. 횡보장에서는 휩소를 일으킨다.",
    },
  },
  {
    id: "wilder-smoothing",
    match: ["Wilder smoothing", "smoothed moving average", "SMMA"],
    matchKo: ["와일더 평활화", "평활/수정 이동평균", "SMMA"],
    label: { en: "Wilder Smoothing (SMMA)", ko: "와일더 평활화" },
    def: {
      en: "A specific smoothing method (α = 1/n) used by Wilder in all his indicators; produces steadier results than simple moving averages by letting old data fade gradually.",
      ko: "와일더가 모든 지표에 사용한 특정 평활화 방식(α = 1/n)으로, 오래된 데이터가 절벽에서 떨어지듯 사라지는 대신 점진적으로 옅어져 단순 이동평균보다 더 안정적인 결과를 만든다.",
    },
  },
  {
    id: "td-sequential",
    match: ["TD Sequential", "TD Combo"],
    matchKo: ["TD 시퀀셜", "TD 콤보"],
    label: { en: "TD Sequential / Combo", ko: "TD 시퀀셜 / 콤보" },
    def: {
      en: "DeMark's mechanical counting systems that identify trend exhaustion without chart interpretation: Sequential counts Setup (9) then Countdown (13), while Combo allows overlap and signals earlier.",
      ko: "디마크의 기계적 카운팅 시스템으로 차트 해석 없이 추세 소진을 포착한다. 시퀀셜은 셋업(9)에서 카운트다운(13)으로 순차진행하고, 콤보는 겹침을 허용해 더 일찍 신호를 낸다.",
    },
  },
  {
    id: "td-setup",
    match: ["Setup", "TD Setup", "Sell Setup", "Buy Setup"],
    matchKo: ["셋업", "TD 셋업", "매도 셋업", "매수 셋업"],
    label: { en: "TD Setup", ko: "TD 셋업" },
    def: {
      en: "The first phase of TD Sequential: nine consecutive bars each closing higher (sell setup) or lower (buy setup) than the close four bars earlier; signals a mature trend, not a trade trigger.",
      ko: "TD 시퀀셜의 첫 단계로, 9개 연속 봉이 네 봉 이전 종가보다 높게(매도 셋업) 또는 낮게(매수 셋업) 마감하는 것. 추세가 성숙했음을 알리지만 거래 신호는 아니다.",
    },
  },
  {
    id: "td-countdown",
    match: ["Countdown", "TD Countdown"],
    matchKo: ["카운트다운", "TD 카운트다운"],
    label: { en: "TD Countdown", ko: "TD 카운트다운" },
    def: {
      en: "The second phase of TD Sequential after Setup completes: accumulates 13 qualifying bars (non-consecutive) where close crosses below the low two bars earlier; the exhaustion signal.",
      ko: "TD 셋업이 완성된 후 두 번째 단계로, 종가가 두 봉 이전의 저가 이하인 13개의 자격 봉(비연속)을 누적하면 소진 신호가 된다.",
    },
  },
  {
    id: "tdst-line",
    match: ["TDST", "TD Setup Trend"],
    matchKo: ["TDST", "TD Setup Trend"],
    label: { en: "TDST Line", ko: "TDST 선" },
    def: {
      en: "An objective support/resistance line drawn from the extreme where a TD Setup begins; if price closes back beyond it, argues the trend has resumed rather than reversed.",
      ko: "TD 셋업이 시작된 극단값에서 그려지는 객관적 지지/저항선으로, 가격이 그 너머로 다시 마감하면 반전이 아니라 추세 재개를 시사한다.",
    },
  },
  {
    id: "exhaustion-signal",
    match: ["exhaustion", "trend exhaustion"],
    matchKo: ["소진", "추세 소진"],
    label: { en: "Exhaustion (Signal)", ko: "소진 신호" },
    def: {
      en: "In DeMark's framework, the point where marginal buyers or sellers run out and a trend is ripe to reverse; signaled by the completed Countdown 13, not the Setup 9.",
      ko: "디마크 체계에서 한계 매수자 또는 매도자가 바닥나 추세 반전이 임박한 시점으로, 셋업 9가 아니라 완성된 카운트다운 13으로 신호된다.",
    },
  },
  {
    id: "perfection-demark",
    match: ["perfection", "perfected"],
    matchKo: ["퍼펙션", "퍼펙트된"],
    label: { en: "Perfection (DeMark)", ko: "퍼펙션" },
    def: {
      en: "A DeMark Setup quality filter: for a buy setup, the low of bar 8 or 9 must dip at or below the lows of bars 6 and 7; an unperfected setup is weaker.",
      ko: "디마크 셋업의 품질 필터로, 매수 셋업의 경우 8번 또는 9번 봉의 저가가 6번과 7번 봉의 저가 이하로 내려가야 한다. 퍼펙트되지 않은 셋업은 더 약하다.",
    },
  },
  {
    id: "reward-to-risk",
    match: ["reward-to-risk", "reward-to-risk ratio", "R:R"],
    matchKo: ["손익비", "손익비(R:R)"],
    label: { en: "Reward-to-Risk Ratio", ko: "손익비" },
    def: {
      en: "The ratio of your potential profit to your potential loss on a single trade, expressed as multiples of risk (e.g., 3:1 means three dollars profit per dollar risked).",
      ko: "한 거래에서 벌 수 있는 이익과 질 수 있는 손실의 비율을 리스크의 배수로 표현한 것(예: 3:1은 걸인 달러당 3달러 이익).",
    },
  },
  {
    id: "drawdown",
    match: ["drawdown", "drawdowns"],
    matchKo: ["드로다운"],
    label: { en: "Drawdown", ko: "드로다운" },
    def: {
      en: "The decline in your account value from its highest peak to its lowest point, measuring how much you have lost from the top.",
      ko: "계좌 가치가 최고점에서 최저점으로 내려가는 규모로, 최고점에서 얼마나 잃었는지를 측정.",
    },
  },
  {
    id: "expectancy",
    match: ["expectancy"],
    matchKo: ["기대값"],
    label: { en: "Expectancy", ko: "기대값" },
    def: {
      en: "The average profit or loss you can expect per trade over many trades, calculated as (win% × avg win) − (loss% × avg loss).",
      ko: "많은 거래를 통해 거래당 평균적으로 벌거나 잃을 금액으로, (승률% × 평균 이익) − (패율% × 평균 손실)로 계산됨.",
    },
  },
  {
    id: "kelly-criterion",
    match: ["Kelly criterion"],
    matchKo: ["켈리 기준"],
    label: { en: "Kelly Criterion", ko: "켈리 기준" },
    def: {
      en: "A formula that calculates the mathematically optimal fraction of your capital to risk per trade, though traders often use half-Kelly to reduce swings.",
      ko: "매매당 자본의 수학적으로 최적인 비율을 계산하는 공식이지만, 트레이더들은 변동성을 줄이기 위해 흔히 절반 켈리를 사용.",
    },
  },
  {
    id: "correlation",
    match: ["correlation"],
    matchKo: ["상관관계"],
    label: { en: "Correlation", ko: "상관관계" },
    def: {
      en: "A measure of how tightly two assets move together: +1 means they move in lockstep, 0 means unrelated, −1 means they move opposite.",
      ko: "두 자산이 얼마나 함께 움직이는지를 측정: +1은 완전히 같은 방향, 0은 무관, −1은 정반대 방향.",
    },
  },
  {
    id: "position-sizing",
    match: ["position sizing", "position size"],
    matchKo: ["포지션 사이징", "포지션 크기"],
    label: { en: "Position Sizing", ko: "포지션 사이징" },
    def: {
      en: "The calculation of how many shares or contracts to buy based on your stop-loss distance and the fixed dollar amount you are willing to risk.",
      ko: "손절 거리와 당신이 감수하기로 정한 고정 달러 금액을 바탕으로 구매할 주식 수를 계산하는 것.",
    },
  },
  {
    id: "loss-aversion",
    match: ["loss aversion"],
    matchKo: ["손실 회피"],
    label: { en: "Loss Aversion", ko: "손실 회피" },
    def: {
      en: "The psychological bias in which losing money feels about twice as painful as gaining the same amount feels good, causing traders to hold losers too long.",
      ko: "같은 금액을 버는 기쁨보다 잃는 고통이 약 두 배 크게 느껴지는 심리적 편향으로, 트레이더가 손실 포지션을 너무 오래 보유하게 만듦.",
    },
  },
  {
    id: "cognitive-bias",
    match: ["cognitive bias", "cognitive biases"],
    matchKo: ["인지 편향"],
    label: { en: "Cognitive Bias", ko: "인지 편향" },
    def: {
      en: "A systematic, repeatable mental error in how we think—such as confirmation bias or recency bias—that distorts our judgment and decisions.",
      ko: "확증 편향이나 최신 편향 같은 우리가 생각하는 방식에 나타나는 체계적이고 반복적인 정신적 오류로, 우리의 판단을 왜곡함.",
    },
  },
  {
    id: "disposition-effect",
    match: ["disposition effect"],
    matchKo: ["처분 효과"],
    label: { en: "Disposition Effect", ko: "처분 효과" },
    def: {
      en: "The tendency to sell winning positions too early to lock in small gains while holding losing positions too long in hope of recovery.",
      ko: "작은 이득을 확정하려고 이긴 포지션을 너무 일찍 팔고, 회복을 기대하며 진 포지션을 너무 오래 보유하는 경향.",
    },
  },
  {
    id: "fomo",
    match: ["FOMO", "Fear Of Missing Out"],
    matchKo: ["FOMO", "기회를 놓칠까 두려운 마음"],
    label: { en: "FOMO", ko: "FOMO" },
    def: {
      en: "Fear of missing out—the urge to buy a stock after it has already spiked because your feed shows everyone else profiting, often leading to buying near the top.",
      ko: "이미 급등한 주식을 피드에서 모두가 이득을 보는 것을 보고 놓칠까 두려워 사는 것으로, 흔히 꼭대기 근처에서 매수하게 됨.",
    },
  },
  {
    id: "revenge-trading",
    match: ["revenge trading"],
    matchKo: ["복수 매매"],
    label: { en: "Revenge Trading", ko: "복수 매매" },
    def: {
      en: "Taking an oversized, unplanned trade immediately after a loss in an attempt to quickly recoup that loss, usually resulting in bigger losses.",
      ko: "손실을 입은 직후 그것을 빠르게 만회하려고 계획에 없던 과도하게 큰 거래를 하는 것으로, 보통 더 큰 손실을 낳음.",
    },
  },
  {
    id: "tape-reading",
    match: ["tape reading"],
    matchKo: ["테이프 리딩"],
    label: { en: "Tape Reading", ko: "테이프 리딩" },
    def: {
      en: "The study of raw price and volume data in real time to identify the market's hidden intentions and momentum before broader trends become obvious.",
      ko: "시장의 숨은 의도와 모멘텀을 광범위한 추세가 명백해지기 전에 알아차리기 위해 실시간 가격과 거래량 데이터를 연구하는 것.",
    },
  },
  {
    id: "ticker-tape",
    match: ["ticker tape"],
    matchKo: ["티커 테이프"],
    label: { en: "Ticker Tape", ko: "티커 테이프" },
    def: {
      en: "The paper strip on which a ticker machine printed continuous stock price quotes in real time, the literal source of the phrase 'reading the tape.'",
      ko: "티커 기계가 실시간 주식 시세를 인쇄해 내보내던 종이 띠로, '테이프를 읽는다'는 표현의 문자 그대로의 기원.",
    },
  },
  {
    id: "bucket-shop",
    match: ["bucket shop", "bucket shops"],
    matchKo: ["버킷 숍"],
    label: { en: "Bucket Shop", ko: "버킷 숍" },
    def: {
      en: "An unregulated betting house that took wagers on stock price moves without ever buying actual shares, operating like a casino disguised as a brokerage.",
      ko: "실제 주식을 구매하지 않으면서 주가 변동에 베팅만 받던 규제를 받지 않는 가계소로, 증권사로 위장한 카지노처럼 작동.",
    },
  },
  {
    id: "line-of-least-resistance",
    match: ["line of least resistance"],
    matchKo: ["저항이 가장 적은 선"],
    label: { en: "Line of Least Resistance", ko: "저항이 가장 적은 선" },
    def: {
      en: "The direction in which a price moves most easily with the least fighting against support or resistance, a key concept in trend identification.",
      ko: "지지나 저항에 저항하는 것이 가장 적게 가격이 가장 쉽게 움직이는 방향으로, 추세 식별의 핵심 개념.",
    },
  },
  {
    id: "pivotal-point",
    match: ["pivotal point"],
    matchKo: ["피벗 포인트"],
    label: { en: "Pivotal Point", ko: "피벗 포인트" },
    def: {
      en: "A price level where the market signals a genuine move is beginning, such as breaking decisively above a long-standing high on heavy volume.",
      ko: "시장이 진짜 움직임이 시작되고 있다는 신호를 보내는 가격 수준으로, 예를 들어 오랫동안 유지된 고점을 대량 거래량과 함께 결정적으로 돌파하는 경우.",
    },
  },
  {
    id: "pyramiding",
    match: ["pyramiding"],
    matchKo: ["피라미딩"],
    label: { en: "Pyramiding", ko: "피라미딩" },
    def: {
      en: "Building a larger position in stages as the trade proves correct—adding to winners only as price confirms the trend, not averaging down into losses.",
      ko: "거래가 옳음이 증명될 때 단계적으로 더 큰 포지션을 구축하는 것으로, 가격이 추세를 확증할 때만 수익에 추가하고 손실에 물타기하지 않음.",
    },
  },
  {
    id: "probe",
    match: ["probe"],
    matchKo: ["탐색 매수"],
    label: { en: "Probe", ko: "탐색 매수" },
    def: {
      en: "A small initial position used to test whether a trading idea is working before committing full capital; if it loses, you exit small with valuable information.",
      ko: "거래 아이디어가 작동하는지 전체 자본을 투입하기 전에 테스트하기 위해 사용하는 작은 초기 포지션으로, 손실이 나면 귀중한 정보를 얻고 작게 손절.",
    },
  },
  {
    id: "short",
    match: ["short"],
    matchKo: ["공매도"],
    label: { en: "Short (Short Selling)", ko: "공매도" },
    def: {
      en: "Betting that a stock price will fall by selling shares you don't yet own, hoping to buy them back cheaper—the opposite of going long.",
      ko: "주식 가격이 떨어질 것이라는 데 베팅하여 아직 소유하지 않은 주식을 팔고 더 싼 가격에 사들일 것을 기대하는 것으로, 매수(롱)의 반대.",
    },
  },
  {
    id: "relative-strength",
    match: ["relative strength", "Relative Strength"],
    matchKo: ["상대강도"],
    label: { en: "Relative Strength (RS)", ko: "상대강도" },
    def: {
      en: "A ratio comparing how a stock's price performance stacks up against the broader market index over a set period.",
      ko: "특정 기간 동안 한 종목의 가격 성과를 광범위한 시장 지수와 비교한 비율.",
    },
  },
  {
    id: "mansfield-rs",
    match: ["Mansfield RS", "Mansfield Relative Strength"],
    matchKo: ["맨스필드 RS", "맨스필드 상대강도"],
    label: { en: "Mansfield Relative Strength", ko: "맨스필드 상대강도" },
    def: {
      en: "A version of relative strength that oscillates around a zero line, showing how far a stock's performance sits from its long-run average.",
      ko: "상대강도의 한 형태로, 0선을 중심으로 진동하며 종목의 성과가 장기 평균에서 얼마나 떨어져 있는지를 보여준다.",
    },
  },
  {
    id: "stage-analysis",
    match: ["Stage analysis", "stage model"],
    matchKo: ["국면 분석", "국면 모델"],
    label: { en: "Stage Analysis", ko: "국면 분석" },
    def: {
      en: "A framework that classifies every stock's price movement into four repeating phases: basing, advancing, topping, and declining.",
      ko: "모든 종목의 가격 움직임을 바닥 다지기, 상승, 천장, 하락의 네 가지 반복되는 국면으로 분류하는 틀.",
    },
  },
  {
    id: "volatility-contraction-pattern",
    match: ["Volatility Contraction Pattern", "VCP"],
    matchKo: ["변동성 수축 패턴", "VCP"],
    label: { en: "Volatility Contraction Pattern (VCP)", ko: "변동성 수축 패턴" },
    def: {
      en: "A base pattern inside an uptrend where pullbacks become progressively shallower and shorter on declining volume, signaling coiled tension ready to explode higher.",
      ko: "상승 추세 안에서 나타나는 베이스 패턴으로, 눌림이 점점 얕아지고 짧아지며 거래량이 줄어들어 터질 준비를 한 상태를 보여준다.",
    },
  },
  {
    id: "can-slim",
    match: ["CAN SLIM"],
    matchKo: ["CAN SLIM"],
    label: { en: "CAN SLIM", ko: "CAN SLIM" },
    def: {
      en: "William O'Neil's seven-letter acronym for stock characteristics (Current earnings, Annual growth, New, Supply/demand, Leader, Institutional sponsorship, Market direction) found in big winners before their advances.",
      ko: "윌리엄 오닐이 큰 상승을 하기 전의 승리 종목에서 발견한 7가지 특징을 담은 약어.",
    },
  },
  {
    id: "eps",
    match: ["EPS", "earnings per share"],
    matchKo: ["EPS", "주당순이익"],
    label: { en: "Earnings Per Share (EPS)", ko: "주당순이익" },
    def: {
      en: "A company's total profit divided by the number of outstanding shares; a key metric of profitability.",
      ko: "회사의 전체 이익을 발행 주식 수로 나눈 값으로, 수익성의 핵심 지표.",
    },
  },
  {
    id: "pivot-buy-point",
    match: ["pivot", "buy point"],
    matchKo: ["피벗", "매수 시점"],
    label: { en: "Pivot (Buy Point)", ko: "피벗" },
    def: {
      en: "The specific price level that, once cleared by the stock, signals the official start of a breakout and triggers entry.",
      ko: "종목이 뚫고 나갔을 때 돌파의 공식 시작을 알리고 진입을 유발하는 특정 가격 수준.",
    },
  },
  {
    id: "follow-through-day",
    match: ["follow-through day"],
    matchKo: ["후속 추격일"],
    label: { en: "Follow-Through Day (FTD)", ko: "후속 추격일" },
    def: {
      en: "A market timing signal where a major index rises significantly on heavier-than-prior-day volume several days after a market bottom, confirming a new uptrend.",
      ko: "시장 바닥 이후 며칠 뒤 주요 지수가 전날보다 무거운 거래량으로 크게 상승하는 것으로, 새 상승 추세를 확인하는 시장 타이밍 신호.",
    },
  },
  {
    id: "trend-template",
    match: ["Trend Template"],
    matchKo: ["추세 템플릿"],
    label: { en: "Trend Template", ko: "추세 템플릿" },
    def: {
      en: "A checklist of eight technical criteria (price above stacked moving averages, distance from 52-week extremes, high RS ranking) used to identify stocks in confirmed uptrends.",
      ko: "정배열된 이동평균 위의 가격, 52주 극값으로부터의 거리, 높은 RS 순위 등 8가지 기술적 기준으로 확인된 상승 추세의 종목을 식별하는 체크리스트.",
    },
  },
  {
    id: "utad",
    match: ["UTAD", "upthrust after distribution"],
    matchKo: ["UTAD", "분산 후 상향 돌파"],
    label: { en: "Upthrust After Distribution (UTAD)", ko: "UTAD" },
    def: {
      en: "A spike above resistance that fails immediately, acting as a bull trap that tests supply before the market declines.",
      ko: "저항선 위로 솟구쳤다가 즉시 실패하는 움직임으로, 시장이 하락하기 전에 공급을 테스트하는 불 트랩 역할을 한다.",
    },
  },
  {
    id: "spring-shakeout",
    match: ["spring", "Spring"],
    matchKo: ["스프링", "셰이크아웃"],
    label: { en: "Spring (Shakeout)", ko: "스프링" },
    def: {
      en: "A dip below support that quickly reverses back inside a trading range, shaking out weak holders before the actual breakout.",
      ko: "지지선 아래로 빠졌다가 빠르게 구간 안으로 되돌아오는 것으로, 실제 돌파 전에 약한 보유자들을 흔드는 베어 트랩.",
    },
  },
  {
    id: "automatic-rally",
    match: ["Automatic Rally", "automatic rally"],
    matchKo: ["자동 반등"],
    label: { en: "Automatic Rally", ko: "자동 반등" },
    def: {
      en: "The natural bounce that occurs when selling dries up and buy orders dominate, often setting the trading range upper boundary.",
      ko: "매도가 마르고 매수 주문이 지배할 때 나타나는 자연스러운 반등으로, 흔히 거래 구간의 상단을 정하는 움직임.",
    },
  },
  {
    id: "failure-swing",
    match: ["failure swing", "failure swings"],
    matchKo: ["실패 스윙"],
    label: { en: "Failure Swing", ko: "실패 스윙" },
    def: {
      en: "When price reaches a new extreme but the oscillator does not, a type of divergence indicating momentum is weakening.",
      ko: "가격이 새로운 극단에 도달했으나 오실레이터가 따라가지 못하는 다이버전스의 한 유형으로, 모멘텀이 약해지고 있음을 나타낸다.",
    },
  },
  {
    id: "volatility-breakout",
    match: ["volatility breakout", "volatility breakouts"],
    matchKo: ["변동성 돌파"],
    label: { en: "Volatility Breakout", ko: "변동성 돌파" },
    def: {
      en: "An entry method where a buy or sell order is placed a fixed distance (based on recent volatility) above or below the open, triggering if price thrusts that far.",
      ko: "시가에서 최근 변동성에 기반한 정해진 거리만큼 위나 아래에 매수/매도 주문을 설정하여, 가격이 그만큼 움직이면 발동되는 진입 방식.",
    },
  },
  {
    id: "swing-high-low",
    match: ["swing high", "swing low"],
    matchKo: ["스윙 고점", "스윙 저점"],
    label: { en: "Swing High / Swing Low", ko: "스윙 고점 / 저점" },
    def: {
      en: "The peak (high) or trough (low) of a short-term price movement before the direction reverses.",
      ko: "단기 가격 움직임에서 방향이 바뀌기 직전의 정점(고점) 또는 저점(저점).",
    },
  },
  {
    id: "kst",
    match: ["KST", "Know Sure Thing"],
    matchKo: ["KST"],
    label: { en: "KST (Know Sure Thing)", ko: "KST" },
    def: {
      en: "A momentum oscillator combining four rate-of-change indicators of different lengths, weighted to emphasize longer-term trends.",
      ko: "길이가 다른 네 개의 변화율 지표를 결합하여, 장기 추세를 더 강조하도록 가중한 모멘텀 오실레이터.",
    },
  },
  {
    id: "rate-of-change",
    match: ["rate of change", "ROC"],
    matchKo: ["변화율"],
    label: { en: "Rate of Change (ROC)", ko: "변화율" },
    def: {
      en: "The percentage difference between today's price and the price N periods ago, used to measure momentum speed.",
      ko: "오늘 가격과 N 기간 전 가격의 백분율 차이로, 모멘텀의 속도를 측정하는 데 사용된다.",
    },
  },
  {
    id: "mean-reversion",
    match: ["mean reversion"],
    matchKo: ["평균 회귀"],
    label: { en: "Mean Reversion", ko: "평균 회귀" },
    def: {
      en: "The tendency of price to return toward an average or prior level after stretching too far away from it.",
      ko: "가격이 평균이나 이전 수준에서 너무 멀리 벗어난 뒤 다시 그쪽으로 돌아오려는 경향.",
    },
  },
  {
    id: "convergence",
    match: ["convergence"],
    matchKo: ["수렴"],
    label: { en: "Convergence", ko: "수렴" },
    def: {
      en: "When multiple independent indicators or timeframes agree on the same price level or signal direction, strengthening confidence in the trade.",
      ko: "여러 개의 독립적 지표나 시간 프레임이 같은 가격 수준이나 방향 신호에 동의할 때, 거래에 대한 확신을 높인다.",
    },
  },
  {
    id: "trend-ranging",
    match: ["trend", "ranging"],
    matchKo: ["추세", "박스권"],
    label: { en: "Trend / Ranging", ko: "추세 / 박스권" },
    def: {
      en: "A trend is directional movement (up or down), while ranging is sideways consolidation within a band; markets alternate between these two states.",
      ko: "추세는 방향성 있는 움직임(상승 또는 하락)이고, 박스권은 대역폭 내의 횡보 정체이며, 시장은 이 두 상태 사이를 번갈아 순환한다.",
    },
  },
  {
    id: "break-of-structure",
    match: ["Break of Structure", "BOS"],
    matchKo: ["구조 돌파", "BOS"],
    label: { en: "Break of Structure (BOS)", ko: "구조 돌파" },
    def: {
      en: "When price breaks past a prior swing high or low in the trend's direction, signaling the trend will continue.",
      ko: "가격이 추세 방향으로 이전 스윙 지점을 돌파할 때, 추세 지속을 나타냄.",
    },
  },
  {
    id: "change-of-character",
    match: ["Change of Character", "CHoCH"],
    matchKo: ["성격 변화", "CHoCH"],
    label: { en: "Change of Character (CHoCH)", ko: "성격 변화" },
    def: {
      en: "When price breaks a swing point against the trend direction, often signaling the first hint of a potential reversal.",
      ko: "가격이 추세에 반하여 스윙 지점을 돌파할 때, 반전의 첫 신호를 나타냄.",
    },
  },
  {
    id: "order-block",
    match: ["order block", "order blocks", "Order block"],
    matchKo: ["오더 블록", "오더 블록들"],
    label: { en: "Order Block (OB)", ko: "오더 블록" },
    def: {
      en: "The last candle in the opposite direction before a strong price move, marking where institutional demand or supply may emerge.",
      ko: "강한 움직임 직전의 마지막 반대 방향 캔들로, 기관의 수요나 공급이 나타날 수 있는 곳을 표시함.",
    },
  },
  {
    id: "fair-value-gap",
    match: ["Fair value gap", "FVG", "Fair Value Gap", "fair value gaps"],
    matchKo: ["페어 밸류 갭", "FVG", "불균형"],
    label: { en: "Fair Value Gap (FVG)", ko: "페어 밸류 갭" },
    def: {
      en: "A three-candle pattern where a fast middle candle creates an unfilled price gap traders expect price to return and fill.",
      ko: "빠른 가운데 캔들이 주변 캔들과 겹치지 않는 갭을 남기는 패턴으로, 가격이 돌아와 채울 것으로 예상되는 구간.",
    },
  },
  {
    id: "liquidity",
    match: ["liquidity", "Liquidity", "liquidity pools"],
    matchKo: ["유동성", "유동성 풀"],
    label: { en: "Liquidity", ko: "유동성" },
    def: {
      en: "Clusters of resting buy or sell orders (especially stop-losses) that large traders aim to trigger and trade against.",
      ko: "대기 중인 매수나 매도 주문(특히 손절 주문)의 집단으로, 큰 트레이더들이 발동시켜 이익을 얻으려는 대상.",
    },
  },
  {
    id: "premium-discount",
    match: ["premium", "discount", "Premium", "Discount"],
    matchKo: ["프리미엄", "디스카운트"],
    label: { en: "Premium & Discount", ko: "프리미엄과 디스카운트" },
    def: {
      en: "Premium is the upper half of a price range (expensive, prefer to sell); discount is the lower half (cheap, prefer to buy).",
      ko: "프리미엄은 가격 범위의 위쪽 절반(비싼 구간, 매도 선호), 디스카운트는 아래쪽 절반(싼 구간, 매수 선호).",
    },
  },
  {
    id: "optimal-trade-entry",
    match: ["Optimal Trade Entry", "OTE"],
    matchKo: ["최적 거래 진입", "OTE"],
    label: { en: "Optimal Trade Entry (OTE)", ko: "최적 거래 진입" },
    def: {
      en: "Waiting for a pullback into the 62–79% Fibonacci retracement zone after a structure break before entering with the trend.",
      ko: "구조 돌파 후 가격이 62~79% 피보나치 되돌림 구간까지 내려올 때를 기다려 추세 방향으로 진입하는 것.",
    },
  },
  {
    id: "killzone",
    match: ["Killzones", "killzone"],
    matchKo: ["킬존"],
    label: { en: "Killzone", ko: "킬존" },
    def: {
      en: "Specific high-activity session windows (e.g., London open, New York AM) where significant price moves are expected to occur.",
      ko: "런던 개장, 뉴욕 오전 등 의미 있는 가격 움직임이 나타날 가능성이 높은 특정 거래 시간대.",
    },
  },
  {
    id: "power-of-three",
    match: ["Power of Three", "AMD"],
    matchKo: ["세 가지의 힘", "AMD"],
    label: { en: "Power of Three (AMD)", ko: "세 가지의 힘" },
    def: {
      en: "Three-phase price pattern: Accumulation (quiet range-building), Manipulation (false move to trap traders), Distribution (the real move).",
      ko: "매집(조용한 레인지), 조작(트레이더를 함정에 빠뜨리는 거짓 움직임), 분산(진짜 움직임)의 세 단계 패턴.",
    },
  },
  {
    id: "gann-angle",
    match: ["Gann angles", "Gann angle", "Gann fan"],
    matchKo: ["갠 앵글", "갠 부채꼴"],
    label: { en: "Gann Angles", ko: "갠 앵글" },
    def: {
      en: "Lines drawn from price pivots at fixed price-to-time ratios (like 2x1 or 1x2) to identify support, resistance, and trend strength.",
      ko: "가격 피벗에서 고정된 가격 대 시간 비율(예: 2x1, 1x2)로 그은 직선으로 지지, 저항, 추세의 강도를 파악함.",
    },
  },
  {
    id: "one-by-one-line",
    match: ["1x1", "45° line", "45 degree line"],
    matchKo: ["1x1 라인", "1x1 기준선", "45° 라인"],
    label: { en: "1x1 Line (45° line)", ko: "1x1 라인" },
    def: {
      en: "The baseline Gann angle representing one unit of price per one unit of time, used as the main trend reference.",
      ko: "시간 1단위당 가격 1단위를 나타내는 갠의 기준 앵글로, 추세의 기본 기준선으로 사용됨.",
    },
  },
  {
    id: "square-of-nine",
    match: ["Square of Nine"],
    matchKo: ["9의 제곱"],
    label: { en: "Square of Nine", ko: "9의 제곱" },
    def: {
      en: "A spiral of numbers where specific angular rotations (90°, 180°, 360°) are calculated to project harmonically-related support and resistance levels.",
      ko: "숫자들의 나선 구조를 이용해 특정 각도(90°, 180°, 360°) 회전으로 지지와 저항 수준을 계산하는 도구.",
    },
  },
  {
    id: "squaring-price-time",
    match: ["squaring price and time", "Squaring price and time"],
    matchKo: ["가격과 시간의 제곱화"],
    label: { en: "Squaring Price and Time", ko: "가격과 시간의 제곱화" },
    def: {
      en: "Gann's concept of when a price move and elapsed time become 'equal' in chosen units, marking a likely trend change point.",
      ko: "가격 움직임과 경과한 시간이 선택한 단위에서 '같아지는' 순간을 나타내는 갠의 개념으로, 추세 변화 지점을 표시함.",
    },
  },
  {
    id: "real-body",
    match: ["real body"],
    matchKo: ["몸통"],
    label: { en: "Real Body", ko: "몸통" },
    def: {
      en: "The thick rectangular part of a candlestick between the open and close prices, colored green if close is higher (bullish) or red if lower (bearish).",
      ko: "시가와 종가 사이의 캔들의 두꺼운 사각형 부분으로, 종가가 높으면 초록색(상승), 낮으면 빨간색(하락)으로 표현됨.",
    },
  },
  {
    id: "upper-shadow-wick",
    match: ["upper shadow", "wick", "wicks"],
    matchKo: ["위꼬리", "윗그림자", "꼬리"],
    label: { en: "Upper Shadow / Wick", ko: "위꼬리" },
    def: {
      en: "The thin line extending above a candlestick's body, reaching the period's high price, showing that buyers tested a higher level but it was rejected.",
      ko: "캔들 몸통 위로 뻗은 가느다란 선으로 해당 기간의 고가까지 도달하며, 매수자가 더 높은 가격을 시도했으나 거부당했음을 보여줌.",
    },
  },
  {
    id: "lower-shadow-wick",
    match: ["lower shadow"],
    matchKo: ["아래꼬리", "아랫그림자"],
    label: { en: "Lower Shadow", ko: "아래꼬리" },
    def: {
      en: "The thin line extending below a candlestick's body, reaching the period's low price, showing that sellers tested a lower level but were rejected.",
      ko: "캔들 몸통 아래로 뻗은 가느다란 선으로 해당 기간의 저가까지 도달하며, 매도자가 더 낮은 가격을 시도했으나 반발당했음을 보여줌.",
    },
  },
  {
    id: "hanging-man",
    match: ["Hanging Man"],
    matchKo: ["행잉맨"],
    label: { en: "Hanging Man", ko: "행잉맨" },
    def: {
      en: "A candlestick with identical shape to a hammer but appearing after an advance, warning of selling pressure; signals potential bearish reversal.",
      ko: "해머와 동일한 모양이지만 상승 후에 나타나는 캔들로, 매도 압력 증가를 경고하며 하락 반전 신호를 제공함.",
    },
  },
  {
    id: "morning-star",
    match: ["Morning Star"],
    matchKo: ["모닝스타"],
    label: { en: "Morning Star", ko: "모닝스타" },
    def: {
      en: "A three-candle bullish reversal pattern: large red candle, small-bodied candle gapping lower, then strong green candle closing into first body's range.",
      ko: "세 개 캔들의 상승 반전 패턴으로, 큰 빨간색 캔들, 갭을 두고 낮게 형성된 작은 캔들, 첫 번째 몸통 속으로 올라가는 강한 초록색 캔들로 구성됨.",
    },
  },
  {
    id: "evening-star",
    match: ["Evening Star"],
    matchKo: ["이브닝스타"],
    label: { en: "Evening Star", ko: "이브닝스타" },
    def: {
      en: "A three-candle bearish reversal pattern: large green candle, small-bodied candle gapping higher, then strong red candle closing into first body's range.",
      ko: "세 개 캔들의 하락 반전 패턴으로, 큰 초록색 캔들, 갭을 두고 높게 형성된 작은 캔들, 첫 번째 몸통 속으로 내려가는 강한 빨간색 캔들로 구성됨.",
    },
  },
];
