// Locale configuration + UI string dictionary for the whole site.

export const LOCALES = ["en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];

// The CONTENT-tree base locale: lessons live at content/<sub> for this locale
// and content/<locale>/<sub> for others (see lib/content.ts), and it's the
// fallback for UI strings. English content is the canonical set, so this must
// stay "en" — changing it would break content loading. To change the language
// a visitor LANDS on, edit LANDING_LOCALE below instead.
export const DEFAULT_LOCALE: Locale = "en";

// The locale a bare visit to "/" redirects to (app/page.tsx). This is the
// user-facing default language; it's independent of the content base above.
export const LANDING_LOCALE: Locale = "ko";

export function isLocale(x: string): x is Locale {
  return (LOCALES as readonly string[]).includes(x);
}

export const LOCALE_LABEL: Record<Locale, string> = {
  en: "EN",
  ko: "한국어",
};

// All user-facing UI chrome strings, per locale. Lesson *content* is handled
// separately (translated MDX under content/ko/).
type Dict = {
  brand: string;
  nav: {
    path: string;
    strategies: string;
    schools: string;
    gurus: string;
    indicators: string;
  };
  strategiesIndex: {
    title: string;
    intro: string;
    findTitle: string;
    findBlurb: string;
    findCta: string;
    steps: (n: number) => string;
    rankLabel: string;
    schoolsLabel: string;
    cryptoNote: string;
  };
  strategyPage: {
    back: string;
    pathHeading: string;
    comingSoon: string;
    drawsFrom: string;
    takeQuiz: string;
  };
  quiz: {
    title: string;
    intro: string;
    start: string;
    of: string; // "Question {a} of {b}" — {a}/{b} substituted client-side
    back: string;
    next: string;
    seeResult: string;
    retake: string;
    resultTitle: string;
    whyFits: string;
    alsoExplore: string;
    startPath: string;
    floorNote: string;
    activeNote: string;
    dayGatedNote: string;
    dayWarning: string;
    foundationNote: string;
    suitabilityLabel: string;
    suitabilityShort: string;
    seeAll: string;
    hideAll: string;
    allTitle: string;
  };
  schoolsIndex: {
    title: string;
    intro: string;
    explore: string;
    lessonCount: (n: number) => string;
  };
  home: {
    heroTitle: string;
    heroIntro: string;
    heroQuizCta: string;
    heroBrowseCta: string;
    // Number-bracketing parts so the animated CountUp number can sit between
    // them. Plain serializable strings (not functions) — required because the
    // home page is a Server Component and can't pass functions to <CountUp>.
    statStrategies: { prefix: string; suffix: string };
    statLessons: { prefix: string; suffix: string };
    statSchools: { prefix: string; suffix: string };
    schoolsHeading: string;
    schoolsSub: string;
    strategiesHeading: string;
    strategiesSub: string;
    strategiesAll: (n: number) => string;
    gurusHeading: string;
    gurusSub: string;
    gurusAll: string;
    toolsHeading: string;
    toolsSub: string;
    toolsCta: string;
    howHeading: string;
    howSteps: { title: string; body: string }[];
  };
  path: { title: string; intro: string; soon: string };
  gurusIndex: { title: string; intro: string; soon: string };
  indicatorsIndex: { title: string; intro: string; soon: string };
  lesson: {
    recommendedFirst: string;
    prev: string;
    next: string;
    backToPath: string;
    onThisPage: string;
    translationNote: string;
  };
  chat: {
    open: string;
    close: string;
    title: string;
    placeholder: string;
    send: string;
    empty: string;
    unreachable: string;
  };
  notFound: { title: string; body: string; cta: string };
  levels: { beginner: string; intermediate: string; advanced: string };
  kinds: { guru: string; indicator: string };
};

export const STRINGS: Record<Locale, Dict> = {
  en: {
    brand: "FinGuru",
    nav: {
      path: "Learning Path",
      strategies: "Learning Path",
      schools: "Schools",
      gurus: "Gurus",
      indicators: "Indicators",
    },
    strategiesIndex: {
      title: "Find Your Learning Path",
      intro:
        "Pick the investment strategy that fits how you think, how much time you have, and how much risk you can stomach — and follow a learning path built just for it, drawn from the masters who pioneered it. Not sure which is you? Take the 2-minute quiz.",
      findTitle: "Find My Strategy",
      findBlurb:
        "Answer 10 quick questions and we'll match you to the strategy — and the learning path — that fits you best.",
      findCta: "Take the quiz →",
      steps: (n) => `${n} step${n === 1 ? "" : "s"}`,
      rankLabel: "Beginner-friendliness",
      schoolsLabel: "Draws from",
      cryptoNote:
        "Not here: crypto / digital assets. We don't cover it as a strategy — it's a distinct, highly volatile asset class with its own risks, and teaching it responsibly is beyond this guide's scope. If you already hold crypto, size it as a small, speculative slice and keep the foundations above as your core.",
    },
    strategyPage: {
      back: "← All strategies",
      pathHeading: "Your learning path",
      comingSoon: "Coming soon",
      drawsFrom: "Draws from",
      takeQuiz: "Not sure this is you? Take the quiz →",
    },
    quiz: {
      title: "Find My Strategy",
      intro:
        "A dozen quick questions. There are no wrong answers — we'll match you to the investing strategy that fits how you think, the time you have, and the risk you can handle.",
      start: "Start the quiz",
      of: "Question {a} of {b}",
      back: "← Back",
      next: "Next →",
      seeResult: "See my result →",
      retake: "Retake the quiz",
      resultTitle: "Your best-fit strategy",
      whyFits: "Why this fits you",
      alsoExplore: "Also worth exploring",
      startPath: "Start this learning path →",
      floorNote:
        "Your answers are spread across several styles, so we're starting you with the approach most evidence supports for the majority of investors. You can always explore the others.",
      activeNote:
        "This approach needs ongoing effort and carries more risk than a simple index fund. A common move is to keep a passive core and use this for a smaller, deliberate slice.",
      dayGatedNote:
        "Your answers leaned toward fast, high-risk trading — but we don't recommend day trading until you've built more experience, time, and risk capacity. Here's a path to get there safely first.",
      dayWarning:
        "Day trading is the highest-risk path. Studies consistently find most day traders lose money, and it demands full-time attention, real experience, and money you can afford to lose. Master the fundamentals before risking capital.",
      foundationNote:
        "First, the foundation: your answers suggest high-interest debt, little emergency savings, or most of your money on the line. Before any active strategy, pay down costly debt and build a cash cushion — then invest. We're starting you with the safest, simplest approach.",
      suitabilityLabel: "{score}% match",
      suitabilityShort: "{score}% match",
      seeAll: "See all strategies ranked →",
      hideAll: "Hide full ranking",
      allTitle: "All strategies, ranked by fit",
    },
    schoolsIndex: {
      title: "The Schools of Investing",
      intro:
        "Four ways to read a market. Each school is a different answer to one question — what actually moves price? — and each gathers the masters who built it, grouped by the strategy they're known for.",
      explore: "Explore the school →",
      lessonCount: (n) => `${n} lesson${n === 1 ? "" : "s"}`,
    },
    home: {
      heroTitle: "Learn to invest from the masters who wrote the playbook.",
      heroIntro:
        "From your first chart to a professional's toolkit — taught through the legendary investors who pioneered each method and the tools they left behind. Every lesson is plain enough for a newcomer and thorough enough for a pro.",
      heroQuizCta: "Find my strategy →",
      heroBrowseCta: "Browse the learning paths",
      statStrategies: { prefix: "", suffix: " strategy paths" },
      statLessons: { prefix: "", suffix: " in-depth lessons" },
      statSchools: { prefix: "", suffix: " schools of investing" },
      schoolsHeading: "Four ways to read a market",
      schoolsSub:
        "Every method belongs to one of four schools — each a different answer to the question, what actually moves price? Start where your curiosity is.",
      strategiesHeading: "Pick a goal, follow a path",
      strategiesSub:
        "Each strategy is a complete, ordered learning path built from the masters who pioneered it — matched to how you think, your time, and your appetite for risk.",
      strategiesAll: (n) => `See all ${n} strategies →`,
      gurusHeading: "Meet the masters",
      gurusSub:
        "Every lesson is built around the investor or trader who proved the idea works — their story, their method, and how to use it today.",
      gurusAll: "Browse all the gurus →",
      toolsHeading: "The indicators & tools reference",
      toolsSub:
        "A searchable library of the instruments of the trade — what each one measures, how to read it, and where it misleads you.",
      toolsCta: "Open the reference →",
      howHeading: "How it works",
      howSteps: [
        {
          title: "Find your strategy",
          body: "Take the 2-minute quiz, or pick a school that fits how you think.",
        },
        {
          title: "Follow the path",
          body: "Work through an ordered sequence of lessons built from the masters who pioneered it.",
        },
        {
          title: "Ask the tutor",
          body: "Stuck on anything? The AI tutor in the corner is grounded in these very lessons.",
        },
      ],
    },
    path: {
      title: "The Learning Path",
      intro:
        "Follow this sequence start to finish and you'll move from “what is a chart?” to reading markets like the professionals. Each step builds on the last.",
      soon: "Lessons coming soon.",
    },
    gurusIndex: {
      title: "The Gurus",
      intro:
        "The people who built technical analysis — in roughly the order their ideas entered the field.",
      soon: "Guru lessons coming soon.",
    },
    indicatorsIndex: {
      title: "Indicators & Tools",
      intro:
        "The instruments of the trade — what each one measures, how to read it, and where it misleads you.",
      soon: "Indicator lessons coming soon.",
    },
    lesson: {
      recommendedFirst: "Recommended first:",
      prev: "← Previous",
      next: "Next →",
      backToPath: "← Back to the Learning Path",
      onThisPage: "On this page",
      translationNote:
        "This lesson isn't translated into Korean yet — showing the English version.",
    },
    chat: {
      open: "Ask the Tutor",
      close: "Close",
      title: "FinGuru Tutor",
      placeholder: "What is RSI divergence?",
      send: "Send",
      empty:
        "Ask anything about technical analysis — the gurus, the indicators, the history. I teach concepts, not trades.",
      unreachable: "Could not reach the tutor:",
    },
    notFound: {
      title: "Lesson not found",
      body: "That page isn't part of the guide (yet).",
      cta: "Go to the Learning Path",
    },
    levels: {
      beginner: "beginner",
      intermediate: "intermediate",
      advanced: "advanced",
    },
    kinds: { guru: "guru", indicator: "indicator" },
  },
  ko: {
    brand: "FinGuru",
    nav: {
      path: "학습 경로",
      strategies: "학습 경로",
      schools: "투자 유파",
      gurus: "거장들",
      indicators: "지표 & 도구",
    },
    strategiesIndex: {
      title: "나만의 학습 경로 찾기",
      intro:
        "당신의 사고방식, 투자에 쓸 시간, 감당할 수 있는 위험에 맞는 투자 전략을 고르세요 — 그리고 그 전략을 개척한 거장들로부터 뽑아낸, 그 전략만을 위한 학습 경로를 따라가세요. 어떤 것이 나에게 맞는지 모르겠다면 2분짜리 퀴즈를 풀어 보세요.",
      findTitle: "내 전략 찾기",
      findBlurb:
        "10개의 간단한 질문에 답하면, 당신에게 가장 잘 맞는 전략과 학습 경로를 찾아 드립니다.",
      findCta: "퀴즈 풀기 →",
      steps: (n) => `${n}단계`,
      rankLabel: "입문자 적합도",
      schoolsLabel: "기반 유파",
      cryptoNote:
        "여기에 없는 것: 암호화폐 / 디지털 자산. 전략으로 다루지 않습니다 — 고유한 위험을 지닌, 변동성이 매우 큰 별개의 자산군이며, 이를 책임감 있게 가르치는 것은 이 가이드의 범위를 넘어섭니다. 이미 보유 중이라면, 작고 투기적인 비중으로 한정하고 위의 기초 전략들을 핵심으로 유지하세요.",
    },
    strategyPage: {
      back: "← 모든 전략",
      pathHeading: "당신의 학습 경로",
      comingSoon: "준비 중",
      drawsFrom: "기반 유파",
      takeQuiz: "이게 나에게 맞는지 모르겠다면? 퀴즈 풀기 →",
    },
    quiz: {
      title: "내 전략 찾기",
      intro:
        "10여 개의 간단한 질문입니다. 정답은 없습니다 — 당신의 사고방식, 투자 가능 시간, 감당할 수 있는 위험에 맞는 투자 전략을 찾아 드립니다.",
      start: "퀴즈 시작하기",
      of: "질문 {a} / {b}",
      back: "← 이전",
      next: "다음 →",
      seeResult: "결과 보기 →",
      retake: "퀴즈 다시 풀기",
      resultTitle: "당신에게 가장 잘 맞는 전략",
      whyFits: "이 전략이 잘 맞는 이유",
      alsoExplore: "함께 살펴보면 좋은 전략",
      startPath: "이 학습 경로 시작하기 →",
      floorNote:
        "당신의 답변이 여러 스타일에 걸쳐 있어, 대다수 투자자에게 근거가 가장 탄탄한 접근법부터 시작하도록 안내합니다. 다른 전략은 언제든 살펴볼 수 있습니다.",
      activeNote:
        "이 접근법은 지속적인 노력이 필요하고, 단순한 인덱스 펀드보다 위험이 큽니다. 흔한 방법은 패시브를 핵심으로 두고, 이 전략은 더 작고 의도적인 비중에 쓰는 것입니다.",
      dayGatedNote:
        "당신의 답변은 빠르고 위험이 큰 매매 쪽으로 기울었습니다 — 하지만 경험·시간·위험 감내력을 더 쌓기 전까지는 데이 트레이딩을 권하지 않습니다. 먼저 안전하게 그 단계에 이르는 경로를 안내합니다.",
      dayWarning:
        "데이 트레이딩은 가장 위험한 길입니다. 여러 연구는 대부분의 데이 트레이더가 손실을 본다는 것을 일관되게 보여줍니다. 또한 종일 집중, 실제 경험, 그리고 잃어도 되는 자금이 필요합니다. 자본을 위험에 두기 전에 기초부터 숙달하세요.",
      foundationNote:
        "먼저 기초부터: 당신의 답변은 고금리 부채, 부족한 비상금, 또는 거의 전 재산이 걸려 있음을 시사합니다. 어떤 능동적 전략에 앞서, 고비용 부채를 갚고 현금 완충을 마련한 뒤 투자하세요. 가장 안전하고 단순한 접근법부터 시작하도록 안내합니다.",
      suitabilityLabel: "적합도 {score}%",
      suitabilityShort: "적합도 {score}%",
      seeAll: "전체 전략 적합도 보기 →",
      hideAll: "전체 순위 숨기기",
      allTitle: "적합도 순 전체 전략",
    },
    schoolsIndex: {
      title: "투자의 유파들",
      intro:
        "시장을 읽는 네 가지 방법. 각 유파는 ‘무엇이 진짜 가격을 움직이는가?’라는 하나의 질문에 대한 서로 다른 답이며, 그것을 세운 거장들을 각자의 대표 전략별로 묶어 보여줍니다.",
      explore: "이 유파 살펴보기 →",
      lessonCount: (n) => `강의 ${n}개`,
    },
    home: {
      heroTitle: "투자의 정석을 쓴 거장들에게서 직접 배웁니다.",
      heroIntro:
        "첫 차트부터 전문가의 도구함까지 — 각 기법을 개척한 전설적인 투자자들과 그들이 남긴 도구를 통해 배웁니다. 모든 강의는 초심자도 이해할 만큼 쉽고, 전문가에게도 충분할 만큼 깊습니다.",
      heroQuizCta: "내 전략 찾기 →",
      heroBrowseCta: "학습 경로 둘러보기",
      statStrategies: { prefix: "전략 경로 ", suffix: "개" },
      statLessons: { prefix: "심화 강의 ", suffix: "편" },
      statSchools: { prefix: "투자 유파 ", suffix: "개" },
      schoolsHeading: "시장을 읽는 네 가지 방법",
      schoolsSub:
        "모든 기법은 네 유파 중 하나에 속합니다 — 각 유파는 ‘무엇이 진짜 가격을 움직이는가?’라는 질문에 대한 서로 다른 답입니다. 끌리는 곳에서 시작하세요.",
      strategiesHeading: "목표를 고르고, 경로를 따라가세요",
      strategiesSub:
        "각 전략은 그것을 개척한 거장들로부터 만들어진, 완결되고 순서가 잡힌 학습 경로입니다 — 당신의 사고방식, 투자 시간, 위험 성향에 맞춰 고르세요.",
      strategiesAll: (n) => `전략 ${n}개 모두 보기 →`,
      gurusHeading: "거장들을 만나다",
      gurusSub:
        "모든 강의는 그 아이디어가 통한다는 것을 증명한 투자자나 트레이더를 중심으로 구성됩니다 — 그들의 이야기, 방법, 그리고 오늘 그것을 활용하는 법까지.",
      gurusAll: "거장 전체 둘러보기 →",
      toolsHeading: "지표 & 도구 레퍼런스",
      toolsSub:
        "거래의 도구들을 검색할 수 있는 라이브러리 — 각 지표가 무엇을 측정하고, 어떻게 읽으며, 어디에서 당신을 오도하는지.",
      toolsCta: "레퍼런스 열기 →",
      howHeading: "이용 방법",
      howSteps: [
        {
          title: "내 전략 찾기",
          body: "2분짜리 퀴즈를 풀거나, 당신의 사고방식에 맞는 유파를 고르세요.",
        },
        {
          title: "경로 따라가기",
          body: "그 전략을 개척한 거장들로부터 만들어진, 순서가 잡힌 강의를 차례로 학습하세요.",
        },
        {
          title: "튜터에게 질문하기",
          body: "막히는 부분이 있나요? 화면 구석의 AI 튜터는 바로 이 강의들에 근거해 답합니다.",
        },
      ],
    },
    path: {
      title: "학습 경로",
      intro:
        "이 순서를 처음부터 끝까지 따라가면 “차트가 무엇인가?”에서 시작해 전문가처럼 시장을 읽는 단계까지 나아갑니다. 각 단계는 앞 단계 위에 쌓입니다.",
      soon: "강의가 곧 추가됩니다.",
    },
    gurusIndex: {
      title: "거장들",
      intro:
        "기술적 분석을 세운 인물들 — 그들의 아이디어가 이 분야에 등장한 순서대로 정리했습니다.",
      soon: "거장 강의가 곧 추가됩니다.",
    },
    indicatorsIndex: {
      title: "지표 & 도구",
      intro:
        "거래의 도구들 — 각 지표가 무엇을 측정하고, 어떻게 읽으며, 어디에서 당신을 오도하는지.",
      soon: "지표 강의가 곧 추가됩니다.",
    },
    lesson: {
      recommendedFirst: "먼저 보면 좋은 강의:",
      prev: "← 이전",
      next: "다음 →",
      backToPath: "← 학습 경로로 돌아가기",
      onThisPage: "이 페이지 목차",
      translationNote:
        "이 강의는 아직 한국어로 번역되지 않아 영어 원문을 표시합니다.",
    },
    chat: {
      open: "튜터에게 질문하기",
      close: "닫기",
      title: "FinGuru 튜터",
      placeholder: "RSI 다이버전스가 무엇인가요?",
      send: "보내기",
      empty:
        "기술적 분석에 관해 무엇이든 물어보세요 — 거장, 지표, 역사까지. 저는 매매 추천이 아니라 개념을 가르칩니다.",
      unreachable: "튜터에 연결할 수 없습니다:",
    },
    notFound: {
      title: "강의를 찾을 수 없습니다",
      body: "그 페이지는 (아직) 가이드에 없습니다.",
      cta: "학습 경로로 이동",
    },
    levels: {
      beginner: "입문",
      intermediate: "중급",
      advanced: "고급",
    },
    kinds: { guru: "거장", indicator: "지표" },
  },
};

export function getStrings(locale: Locale): Dict {
  return STRINGS[locale] ?? STRINGS[DEFAULT_LOCALE];
}
