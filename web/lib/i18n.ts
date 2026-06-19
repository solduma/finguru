// Locale configuration + UI string dictionary for the whole site.

export const LOCALES = ["en", "ko"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

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
  nav: { path: string; gurus: string; indicators: string };
  home: {
    title: string;
    intro: string;
    startPath: string;
    gurusHeading: string;
    indicatorsHeading: string;
    gurusSoon: string;
    indicatorsSoon: string;
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
    nav: { path: "Learning Path", gurus: "Gurus", indicators: "Indicators" },
    home: {
      title: "Technical Analysis, from Beginner to Pro",
      intro:
        "Learn the craft the way it was built — through the masters who invented it and the tools they left behind. Every lesson is plain enough for a newcomer and thorough enough for a professional. Stuck? The tutor in the corner is grounded in these very lessons.",
      startPath: "Start the Learning Path",
      gurusHeading: "The Gurus",
      indicatorsHeading: "The Indicators & Tools",
      gurusSoon: "Guru lessons coming soon.",
      indicatorsSoon: "Indicator lessons coming soon.",
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
    nav: { path: "학습 경로", gurus: "거장들", indicators: "지표 & 도구" },
    home: {
      title: "기술적 분석, 입문자에서 프로까지",
      intro:
        "기술적 분석을 만든 거장들과 그들이 남긴 도구를 통해, 이 기술이 세워진 그대로 배웁니다. 모든 강의는 초심자도 이해할 만큼 쉽고, 전문가에게도 충분할 만큼 깊습니다. 막히셨나요? 화면 구석의 튜터는 바로 이 강의들에 근거해 답합니다.",
      startPath: "학습 경로 시작하기",
      gurusHeading: "거장들",
      indicatorsHeading: "지표 & 도구",
      gurusSoon: "거장 강의가 곧 추가됩니다.",
      indicatorsSoon: "지표 강의가 곧 추가됩니다.",
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
