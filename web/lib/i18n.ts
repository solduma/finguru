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
export type Dict = {
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
    practiceHeading: string;
    practiceCta: string;
  };
  practical: {
    back: string; // "← Back to {strategy}" — {strategy} substituted client-side
    disclaimer: string;
    sourceNote: string;
    portfolio: {
      title: string;
      intro: string;
      presetLabel: string;
      presets: Record<string, string>;
      rebalance: string;
      startYear: string;
      cagr: string;
      realCagr: string;
      vol: string;
      sharpe: string;
      maxDd: string;
      finalValue: string;
      growthCaption: string;
      drawdownCaption: string;
      allocCaption: string;
      lesson: string;
    };
    costDrag: {
      title: string;
      intro: string;
      feeLabel: string;
      startYear: string;
      lumpVsDca: string;
      lump: string;
      dca: string;
      lowFinal: string;
      highFinal: string;
      lostToFees: string;
      cagrLow: string;
      cagrHigh: string;
      growthCaption: string;
      lesson: string;
    };
    glidePath: {
      title: string;
      intro: string;
      retireYear: string;
      allocCaption: string;
      seqHeading: string;
      seqIntro: string;
      seqCaption: string;
      seqNormal: string;
      seqReversed: string;
      seqNormalEnd: string;
      seqReversedEnd: string;
      lesson: string;
    };
    company: {
      // titles/intros per scorecard mode
      titles: Record<string, string>;
      intros: Record<string, string>;
      lessons: Record<string, string>;
      tickerLabel: string;
      marketLabel: string;
      marketUs: string;
      marketKr: string;
      priceLabel: string;
      priceAuto: string;
      analyze: string;
      loading: string;
      notFound: string;
      error: string;
      examples: string;
      sourceLink: string;
      // metric labels
      yield: string;
      payoutEarnings: string;
      payoutFcf: string;
      growthStreak: string;
      years: string;
      cutWarning: string;
      revenueCaption: string;
      dpsCaption: string;
      // value / dcf
      growthRate: string;
      terminalGrowth: string;
      discountRate: string;
      intrinsic: string;
      marginOfSafety: string;
      terminalShare: string;
      earningsYield: string;
      returnOnCapital: string;
      dcfCaption: string;
      terminalWarn: string;
      // garp
      pe: string;
      peg: string;
      pegForward: string;
      pegHistorical: string;
      growthUsed: string;
      epsCagr: string;
      roe: string;
      netMargin: string;
      fcfConversion: string;
      qualityCaption: string;
      // reit
      reitNote: string;
      reitTrapHook: string; // "{payout}" substituted
    };
    trade: {
      titles: Record<string, string>; // trend | active
      intros: Record<string, string>;
      lessons: Record<string, string>;
      symbolLabel: string;
      systemLabel: string;
      systems: Record<string, string>; // sma200 | mom12 | donchian
      cagr: string;
      buyHold: string;
      maxDd: string;
      exposure: string;
      trades: string;
      equityCaption: string;
      drawdownCaption: string;
      stratLine: string;
      bhLine: string;
      // active mode
      oddsWarning: string;
      entryLabel: string;
      equityInput: string;
      riskPct: string;
      planHeading: string;
      stop: string;
      target: string;
      shares: string;
      rr: string;
      resolveHeading: string;
      outcome: string;
      hitStop: string;
      hitTarget: string;
      rMultiple: string;
      nextSetup: string;
      setupLabel: string;
      entryDate: string;
    };
    macro: {
      title: string;
      intro: string;
      lesson: string;
      gaugeHeading: string;
      gaugeScore: string;
      regimeHeading: string;
      quadrants: Record<string, string>; // goldilocks|reflation|stagflation|deflation
      quadrantTilts: Record<string, string>;
      currentRegime: string;
      verdictHeading: string;
      seriesHeading: string;
      yieldCurve: string;
      unemployment: string;
      cpiYoY: string;
      fedFunds: string;
      recessionShade: string;
      growth: string;
      inflation: string;
      rising: string;
      falling: string;
      fredNotice: string;
    };
    options: {
      title: string;
      intro: string;
      lesson: string;
      spot: string;
      iv: string;
      dte: string;
      chainHeading: string;
      strike: string;
      callPremium: string;
      delta: string;
      pickStrike: string;
      planHeading: string;
      maxProfit: string;
      breakeven: string;
      annPremium: string;
      capped: string;
      payoffCaption: string;
      stockLine: string;
      coveredLine: string;
      bxmHeading: string;
      bxmCaption: string;
      bxmLine: string;
      spyLine: string;
      bxmStat: string;
      spyStat: string;
      assignmentNote: string;
    };
    factor: {
      title: string;
      intro: string;
      lesson: string;
      factorLabel: string;
      factors: Record<string, string>; // VTV|MTUM|QUAL|USMV|VLUE
      growthCaption: string;
      factorLine: string;
      marketLine: string;
      cagr: string;
      marketCagr: string;
      maxDd: string;
      excess: string;
      decayNote: string;
      regHeading: string;
      alpha: string;
      betaMkt: string;
      betaSmb: string;
      betaHml: string;
      rsq: string;
      regNote: string;
    };
    deal: {
      title: string;
      intro: string;
      lesson: string;
      pickDeal: string;
      targetLabel: string;
      acquirer: string;
      dealPrice: string;
      currentPrice: string;
      preAnnounce: string;
      closeDays: string;
      grossSpread: string;
      spreadPct: string;
      annualized: string;
      breakDownside: string;
      asymmetryNote: string;
      manualNote: string;
    };
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
      practiceHeading: "Put it into practice",
      practiceCta: "Open the hands-on lab →",
    },
    practical: {
      back: "← Back to {strategy}",
      disclaimer:
        "Educational only — not investment advice. Backtests use historical annual returns; past performance is not indicative of future results. A model is a tool for building intuition, never a buy decision.",
      sourceNote:
        "Data: annual asset-class total returns (Aswath Damodaran, NYU Stern) and CPI (Minneapolis Fed), redistributed for education.",
      portfolio: {
        title: "Portfolio Backtester",
        intro:
          "Build a mix of asset classes and test it against a century of market history. Compare a balanced portfolio to all-stocks and watch how diversification trades away some return for a far smoother ride.",
        presetLabel: "Choose a portfolio",
        presets: {
          "100-stocks": "100% Stocks",
          "60-40": "Classic 60/40",
          "all-weather": "All-Weather (balanced)",
          permanent: "Permanent Portfolio",
        },
        rebalance: "Rebalance yearly",
        startYear: "Start year",
        cagr: "Return (CAGR)",
        realCagr: "Real (after inflation)",
        vol: "Volatility",
        sharpe: "Sharpe ratio",
        maxDd: "Worst drawdown",
        finalValue: "Grew $10,000 to",
        growthCaption: "Growth of $10,000 (portfolio vs. 100% stocks)",
        drawdownCaption: "Drawdown — how far below the prior peak, year by year",
        allocCaption: "Your allocation",
        lesson:
          "The lesson: the balanced portfolio usually earns less than all-stocks, but its worst drop is far shallower. In 2008 bonds cushioned the crash; in 2022 stocks AND bonds fell together — diversification helps, but it is not a guarantee.",
      },
      costDrag: {
        title: "The Cost of Fees",
        intro:
          "The one thing you control in investing is cost. Drag a fund's annual fee up and down and watch how a seemingly tiny percentage quietly compounds into a huge chunk of your final wealth.",
        feeLabel: "Annual fee (expense ratio)",
        startYear: "Start year",
        lumpVsDca: "How you invest",
        lump: "Lump sum at the start",
        dca: "Spread evenly each year (DCA)",
        lowFinal: "With a near-zero fee",
        highFinal: "With your chosen fee",
        lostToFees: "Lost to fees",
        cagrLow: "Return — low cost",
        cagrHigh: "Return — your fee",
        growthCaption: "Growth of $10,000 — near-zero fee vs. your chosen fee",
        lesson:
          "The lesson: a 1% annual fee sounds trivial, but over decades it can quietly eat a quarter or more of your final balance. A low-cost index fund keeps that money compounding for you. Lump-sum usually beats spreading it out (markets rise more often than they fall), but DCA reduces the regret of buying right before a drop.",
      },
      glidePath: {
        title: "The Glide Path & Sequence Risk",
        intro:
          "A target-date fund automatically shifts from stock-heavy to safer as your retirement nears. See that glide path — then meet the risk it is built to manage: when a crash lands matters as much as how big it is.",
        retireYear: "Target retirement year",
        allocCaption: "Your automatic stock / bond / cash mix over time",
        seqHeading: "Why the order of returns matters",
        seqIntro:
          "Here is the unsettling part. Take the exact same set of yearly returns, withdrawing a fixed amount each year in retirement. Run them in their real order, then reversed. Same average return — very different outcome, because an early crash drains a portfolio you can't let recover.",
        seqCaption: "Same returns, two orders — $100,000 drawn down 6%/year",
        seqNormal: "Real order (crash early)",
        seqReversed: "Reversed (crash late)",
        seqNormalEnd: "Crash-early ending balance",
        seqReversedEnd: "Crash-late ending balance",
        lesson:
          "The lesson: near your target date the glide path shifts you toward bonds and cash precisely because a big loss just before or after you start withdrawing is the hardest to recover from. Sequence-of-returns risk — not the average return — is what de-risking protects against.",
      },
      company: {
        titles: {
          dividend: "Dividend Safety Check",
          value: "Intrinsic Value & Margin of Safety",
          growth: "Quality & Growth Scorecard",
          reit: "REIT Income Check",
        },
        intros: {
          dividend:
            "Enter a real company and judge whether its dividend is safe — not just high. We pull its filings and compare what it pays against what it earns and the cash it actually generates.",
          value:
            "Estimate what a business is worth with a simple discounted-cash-flow model, then see your margin of safety against the price. Move the assumptions and watch the answer swing — that is the whole lesson.",
          growth:
            "Score a company on growth AND quality together: PEG (are you overpaying for growth?), returns on equity, margins, and whether earnings turn into real cash.",
          reit: "Check a REIT's income the honest way. A REIT's net-income payout often looks impossible (>100%) because depreciation is non-cash — which is exactly why FFO exists.",
        },
        lessons: {
          dividend:
            "A safe dividend is necessary but not sufficient. A payout ratio above 100% — especially against free cash flow — or a past cut is a warning. A high yield is often the market pricing in a cut, not a gift. Always read the filing before trusting the number.",
          value:
            "Notice how much of the value comes from the terminal value — usually most of it. That means a DCF is mostly a guess about the far future. It is a tool for disciplined thinking, never a price target. Cheap can also be a value trap.",
          growth:
            "Fast growth is not the same as quality growth. PEG divides by a growth rate — a forward analyst estimate (US) or a company's own past EPS growth (KR) — so it inherits all the error in that number; a forward estimate can be too rosy, a historical rate may not repeat. Pair every growth figure with a quality check — returns on capital and whether earnings become cash.",
          reit:
            "Judge a REIT on FFO/AFFO, not net income, and respect its rate sensitivity (the 2022 drawdown). For most beginners a broad REIT fund beats single-name analysis; treat this as practice, not a pick.",
        },
        tickerLabel: "Ticker",
        marketLabel: "Market",
        marketUs: "US (SEC EDGAR)",
        marketKr: "Korea (DART)",
        priceLabel: "Current price (per share)",
        priceAuto: "Auto-filled from live data — edit to override.",
        analyze: "Analyze",
        loading: "Pulling filings…",
        notFound: "Couldn't find that ticker on the selected market.",
        error: "Data lookup failed. Try again, or another ticker.",
        examples: "Try",
        sourceLink: "Verify in the primary filing",
        yield: "Dividend yield",
        payoutEarnings: "Payout (of earnings)",
        payoutFcf: "Payout (of free cash flow)",
        growthStreak: "Dividend-growth streak",
        years: "yrs",
        cutWarning: "This company has cut its dividend within the data window.",
        revenueCaption: "Revenue by year",
        dpsCaption: "Dividend per share by year",
        growthRate: "FCF growth (next 5 yrs)",
        terminalGrowth: "Terminal growth",
        discountRate: "Discount rate",
        intrinsic: "Intrinsic value / share",
        marginOfSafety: "Margin of safety",
        terminalShare: "From terminal value",
        earningsYield: "Earnings yield (EBIT/EV)",
        returnOnCapital: "Return on capital",
        dcfCaption: "Where the value comes from",
        terminalWarn:
          "Most of the value sits in the terminal value — i.e. in assumptions about the distant future.",
        pe: "P/E",
        peg: "PEG",
        pegForward: "PEG (forward, analyst)",
        pegHistorical: "PEG (historical growth)",
        growthUsed: "Growth used",
        epsCagr: "EPS growth (trailing)",
        roe: "Return on equity",
        netMargin: "Net margin",
        fcfConversion: "FCF conversion",
        qualityCaption: "Quality metrics",
        reitNote:
          "Heads up: standard filings report net income, not FFO. A REIT's net-income payout will look alarmingly high because property depreciation is a non-cash charge — judge it on FFO/AFFO from the filing instead.",
        reitTrapHook:
          "This REIT appears to pay out {payout} of net income — seemingly impossible. It isn't: that's the FFO trap.",
      },
      trade: {
        titles: {
          trend: "Trend System Backtest",
          active: "Setup & Position-Sizing Lab",
        },
        intros: {
          trend:
            "Test a simple, fixed rules-based trend system on real price history — with no lookahead. See the honest trade-off: trend following usually earns a bit less than buy-and-hold but cuts the worst drawdown roughly in half. The price you pay is whipsaws.",
          active:
            "Plan a single trade the disciplined way: an ATR-based stop, position size set by a fixed fraction of risk, and a defined reward-to-risk target — then resolve it forward bar by bar, with no peeking. This is the highest-risk path on the site; read the odds first.",
        },
        lessons: {
          trend:
            "The lesson: a trend filter doesn't beat the market on return — it earns less, more often, in exchange for far shallower crashes (it sat out the worst of 2008/2020). The cost is whipsaws: many small losing switches in choppy markets. There are no tunable knobs here on purpose — the more you optimize a backtest, the more you're fitting noise.",
          active:
            "The lesson: survival is about sizing and stops, not picking tops. Risking a fixed small fraction per trade and pre-defining the exit is what keeps a string of losers from ending you. And the hard truth: roughly 90%+ of active day traders lose money over time. Most of the edge you think you see in a backtest is lookahead, survivorship, and ignored costs.",
        },
        symbolLabel: "Symbol",
        systemLabel: "Trend system",
        systems: {
          sma200: "200-day moving average",
          mom12: "12-1 momentum (monthly)",
          donchian: "Donchian 50-day breakout",
        },
        cagr: "Strategy CAGR",
        buyHold: "Buy & hold CAGR",
        maxDd: "Strategy worst drawdown",
        exposure: "Time in market",
        trades: "Switches",
        equityCaption: "Growth of $1 — strategy vs. buy & hold",
        drawdownCaption: "Strategy drawdown",
        stratLine: "Trend strategy",
        bhLine: "Buy & hold",
        oddsWarning:
          "Reality check: studies find ~90%+ of active day traders lose money over time, and the rare winners rarely beat a salary. Treat this as a discipline drill, not a money-making plan. Paper-trade first; risk tiny size.",
        entryLabel: "Entry price",
        equityInput: "Account size",
        riskPct: "Risk per trade",
        planHeading: "Your trade plan",
        stop: "Stop (2× ATR)",
        target: "Target (2R)",
        shares: "Position size (shares)",
        rr: "Reward : risk",
        resolveHeading: "Resolve it forward (no lookahead)",
        outcome: "Outcome",
        hitStop: "Stopped out",
        hitTarget: "Hit target",
        rMultiple: "Result (R multiple)",
        nextSetup: "Next setup →",
        setupLabel: "Setup",
        entryDate: "Entry date",
      },
      macro: {
        title: "Read the Cycle Dashboard",
        intro:
          "Macro investing starts by reading where the economy sits in its cycle. Here are the signals practitioners actually watch — the yield curve, unemployment, inflation, and policy rates — across five decades, with every past recession shaded.",
        lesson:
          "The lesson: these signals lead, but they lie too — the yield curve has inverted 6–24 months ahead of recessions (and once with no recession at all), and data gets revised after the fact. Read the cycle to size small tilts around a diversified core, never to make concentrated, leveraged bets. Macro timing is humbling.",
        gaugeHeading: "Recession-risk gauge",
        gaugeScore: "Composite risk (0–100)",
        regimeHeading: "Growth × Inflation regime",
        quadrants: {
          goldilocks: "Goldilocks (growth↑, inflation↓)",
          reflation: "Reflation (growth↑, inflation↑)",
          stagflation: "Stagflation (growth↓, inflation↑)",
          deflation: "Deflation / bust (growth↓, inflation↓)",
        },
        quadrantTilts: {
          goldilocks: "Historically favors: stocks (and bonds do fine too)",
          reflation: "Historically favors: stocks + commodities",
          stagflation: "Historically favors: commodities + inflation-linked bonds",
          deflation: "Historically favors: long government bonds, cash",
        },
        currentRegime: "Current regime",
        verdictHeading: "Right now",
        seriesHeading: "The signals (recessions shaded)",
        yieldCurve: "Yield curve (10y − 3m)",
        unemployment: "Unemployment rate (%)",
        cpiYoY: "Inflation (CPI, YoY %)",
        fedFunds: "Fed funds rate (%)",
        recessionShade: "Shaded = NBER recession",
        growth: "Growth",
        inflation: "Inflation",
        rising: "rising",
        falling: "falling",
        fredNotice:
          "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.",
      },
      options: {
        title: "Covered-Call & Premium Lab",
        intro:
          "Sell a call against shares you own and collect premium. Adjust the implied volatility and days to expiry to build a synthetic option chain, pick a strike, and see the income — and the capped upside — laid out as a payoff diagram.",
        lesson:
          "The lesson: a covered call trades away your big-rally upside for steady premium. It cushions flat and mild-down markets but badly lags a roaring bull (the CBOE BXM index returned ~8.5%/yr vs ~11% for the S&P since 1986, and trailed by 15+ points in 2013/2019). What you're really selling is implied volatility — and you can be assigned, including early, around dividends. This is income with a cap, not free money; never sell calls on shares you wouldn't be happy to part with.",
        spot: "Share price",
        iv: "Implied volatility",
        dte: "Days to expiry",
        chainHeading: "Synthetic option chain",
        strike: "Strike",
        callPremium: "Call premium",
        delta: "Delta",
        pickStrike: "Pick a strike to sell",
        planHeading: "Covered-call payoff",
        maxProfit: "Max profit (if called away)",
        breakeven: "Breakeven",
        annPremium: "Annualized return on premium",
        capped: "Upside capped above strike",
        payoffCaption: "Payoff at expiry — stock vs. covered call",
        stockLine: "Stock only",
        coveredLine: "Covered call",
        bxmHeading: "The honest track record (buy-write vs. S&P)",
        bxmCaption: "Growth of $1 — CBOE BuyWrite (BXM) vs. S&P 500 (SPY)",
        bxmLine: "BXM (covered calls)",
        spyLine: "SPY (buy & hold)",
        bxmStat: "BXM CAGR",
        spyStat: "SPY CAGR",
        assignmentNote:
          "Synthetic, illustrative prices (European Black-Scholes; real options are American and can be assigned early, especially before a dividend). Not live market data.",
      },
      factor: {
        title: "Factor-Tilt Backtest",
        intro:
          "Tilt toward a proven return driver — value, momentum, quality, low-volatility — using real factor ETFs, and test it against the total market. See both the promise and the long, painful stretches where a factor lags.",
        lesson:
          "The lesson: factor premia are real but they decay, crowd, and underperform for 5–10+ years at a stretch (value's 2010s were brutal). A single-factor ETF's excess return over the market is small and arrives unevenly — tilting only works if you hold through the drought. The more factors you test and cherry-pick, the more you're fitting noise, not finding edge.",
        factorLabel: "Factor ETF",
        factors: {
          VTV: "Value (VTV)",
          MTUM: "Momentum (MTUM)",
          QUAL: "Quality (QUAL)",
          USMV: "Low volatility (USMV)",
          VLUE: "Value, multifactor (VLUE)",
        },
        growthCaption: "Growth of $1 — factor ETF vs. total market (VTI)",
        factorLine: "Factor ETF",
        marketLine: "Total market (VTI)",
        cagr: "Factor CAGR",
        marketCagr: "Market CAGR",
        maxDd: "Factor worst drawdown",
        excess: "Excess vs. market (annualized)",
        decayNote:
          "Over the common window since the factor ETF launched. Past factor performance is especially prone to decay as capital crowds in — this is not a forecast.",
        regHeading: "Factor regression (Fama-French 3-factor)",
        alpha: "Alpha (annual)",
        betaMkt: "Market β",
        betaSmb: "Size β (SMB)",
        betaHml: "Value β (HML)",
        rsq: "R²",
        regNote:
          "The regression explains the ETF's excess return by its factor loadings. Notice the alpha is tiny and the value/size betas match what the fund advertises — you're buying factor exposure (a high R²), not manager skill. That's the point of a rules-based tilt.",
      },
      deal: {
        title: "Merger-Arbitrage Spread Calculator",
        intro:
          "When a company is acquired, its stock usually trades just below the deal price until the deal closes — that gap is the merger-arb spread. Compute the annualized return on a real or hypothetical deal, and weigh it against the cliff if the deal breaks.",
        lesson:
          "The lesson: merger arb is picking up nickels in front of a steamroller. Spreads are small, the annualized return looks tempting, but if the deal breaks the stock falls back toward its pre-announcement price — a loss many times the spread. The annualized figure also assumes a close date that can slip. Read the actual 8-K/merger agreement; this is not free money.",
        pickDeal: "Example deal",
        targetLabel: "Target",
        acquirer: "Acquirer",
        dealPrice: "Deal price (per share)",
        currentPrice: "Current price",
        preAnnounce: "Pre-announcement price",
        closeDays: "Days to expected close",
        grossSpread: "Gross spread",
        spreadPct: "Spread %",
        annualized: "Annualized return",
        breakDownside: "Downside if deal breaks",
        asymmetryNote:
          "Note the asymmetry: a small, capped upside against a large downside if the deal collapses.",
        manualNote:
          "Edit any field to model your own announced deal — find terms in the target's 8-K / merger proxy (DEFM14A) on SEC EDGAR.",
      },
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
      practiceHeading: "실전으로 옮기기",
      practiceCta: "실습 랩 열기 →",
    },
    practical: {
      back: "← {strategy}(으)로 돌아가기",
      disclaimer:
        "교육용일 뿐 투자 조언이 아닙니다. 백테스트는 과거 연간 수익률을 사용하며, 과거 성과는 미래를 보장하지 않습니다. 모델은 직관을 기르는 도구일 뿐, 결코 매수 결정이 아닙니다.",
      sourceNote:
        "데이터: 연간 자산군 총수익률(Aswath Damodaran, NYU Stern)과 CPI(미니애폴리스 연준), 교육 목적 재배포.",
      portfolio: {
        title: "포트폴리오 백테스터",
        intro:
          "자산군을 조합해 한 세기의 시장 역사로 검증해 보세요. 균형 포트폴리오를 전액 주식과 비교하면, 분산이 약간의 수익을 내주는 대신 훨씬 더 매끄러운 여정을 어떻게 만드는지 볼 수 있습니다.",
        presetLabel: "포트폴리오 선택",
        presets: {
          "100-stocks": "전액 주식 100%",
          "60-40": "고전 60/40",
          "all-weather": "올웨더(균형)",
          permanent: "영구 포트폴리오",
        },
        rebalance: "매년 리밸런싱",
        startYear: "시작 연도",
        cagr: "수익률 (CAGR)",
        realCagr: "실질(인플레 차감)",
        vol: "변동성",
        sharpe: "샤프 비율",
        maxDd: "최대 낙폭",
        finalValue: "$10,000의 결과",
        growthCaption: "$10,000의 성장 (포트폴리오 vs. 전액 주식)",
        drawdownCaption: "낙폭 — 직전 고점 대비 얼마나 떨어졌는지, 연도별",
        allocCaption: "나의 자산 배분",
        lesson:
          "교훈: 균형 포트폴리오는 보통 전액 주식보다 적게 벌지만, 최악의 하락은 훨씬 얕습니다. 2008년에는 채권이 폭락을 완충했지만, 2022년에는 주식과 채권이 함께 떨어졌습니다 — 분산은 도움이 되지만 보장은 아닙니다.",
      },
      costDrag: {
        title: "수수료의 비용",
        intro:
          "투자에서 당신이 통제할 수 있는 단 하나는 비용입니다. 펀드의 연간 보수를 올리고 내려 보며, 사소해 보이는 퍼센트가 어떻게 조용히 복리로 불어나 최종 자산의 큰 몫을 갉아먹는지 확인하세요.",
        feeLabel: "연간 보수(운용보수율)",
        startYear: "시작 연도",
        lumpVsDca: "투자 방식",
        lump: "처음에 일시 투자",
        dca: "매년 균등 분할 투자(DCA)",
        lowFinal: "보수가 거의 0일 때",
        highFinal: "선택한 보수일 때",
        lostToFees: "수수료로 잃은 금액",
        cagrLow: "수익률 — 저비용",
        cagrHigh: "수익률 — 선택한 보수",
        growthCaption: "$10,000의 성장 — 보수 거의 0 vs. 선택한 보수",
        lesson:
          "교훈: 연 1% 보수는 사소해 보이지만, 수십 년이 지나면 최종 잔액의 4분의 1 이상을 조용히 갉아먹을 수 있습니다. 저비용 인덱스 펀드는 그 돈이 계속 당신을 위해 복리로 불어나게 합니다. 일시 투자가 분할보다 대체로 유리하지만(시장은 떨어지기보다 오르는 때가 많음), DCA는 하락 직전에 사는 후회를 줄여 줍니다.",
      },
      glidePath: {
        title: "글라이드 패스 & 시퀀스 리스크",
        intro:
          "타깃데이트 펀드는 은퇴가 다가올수록 주식 중심에서 안전한 쪽으로 자동 전환합니다. 그 글라이드 패스를 보고 — 그것이 관리하려는 위험을 만나 보세요: 폭락이 '언제' 오느냐가 '얼마나 큰가'만큼 중요합니다.",
        retireYear: "목표 은퇴 연도",
        allocCaption: "시간에 따른 자동 주식 / 채권 / 현금 비중",
        seqHeading: "수익률의 순서가 왜 중요한가",
        seqIntro:
          "불편한 진실은 여기에 있습니다. 똑같은 연간 수익률 묶음을 두고, 은퇴 후 매년 고정 금액을 인출합니다. 실제 순서대로, 그리고 거꾸로 돌려 봅니다. 평균 수익률은 같지만 결과는 크게 다릅니다 — 초반의 폭락은 회복을 기다릴 수 없는 포트폴리오를 말려 버리기 때문입니다.",
        seqCaption: "같은 수익률, 두 가지 순서 — $100,000을 연 6%씩 인출",
        seqNormal: "실제 순서(초반 폭락)",
        seqReversed: "거꾸로(후반 폭락)",
        seqNormalEnd: "초반 폭락 시 최종 잔액",
        seqReversedEnd: "후반 폭락 시 최종 잔액",
        lesson:
          "교훈: 목표 시점이 가까워지면 글라이드 패스가 채권과 현금 쪽으로 옮겨 가는 이유는, 인출을 시작하기 직전이나 직후의 큰 손실이 가장 회복하기 어렵기 때문입니다. 평균 수익률이 아니라 시퀀스 리스크 — 이것이 위험 축소가 막아 주는 대상입니다.",
      },
      company: {
        titles: {
          dividend: "배당 안전성 점검",
          value: "내재가치 & 안전마진",
          growth: "우량성 & 성장 스코어카드",
          reit: "리츠 인컴 점검",
        },
        intros: {
          dividend:
            "실제 기업을 입력해 배당이 '높은지'가 아니라 '안전한지'를 판단해 보세요. 공시를 불러와 지급액을, 벌어들인 이익과 실제 창출한 현금과 비교합니다.",
          value:
            "간단한 현금흐름할인(DCF) 모델로 기업의 가치를 추정하고, 가격 대비 안전마진을 확인하세요. 가정을 움직이면 답이 크게 흔들립니다 — 그것이 핵심 교훈입니다.",
          growth:
            "성장과 우량성을 함께 채점합니다: PEG(성장에 과도한 값을 치르는가?), 자기자본이익률, 마진, 그리고 이익이 실제 현금으로 전환되는지.",
          reit: "리츠 인컴을 정직하게 점검합니다. 리츠의 순이익 기준 배당성향은 감가상각이 비현금 비용이라 흔히 100%를 넘어 보입니다 — 바로 그래서 FFO가 존재합니다.",
        },
        lessons: {
          dividend:
            "안전한 배당은 필요조건일 뿐 충분조건이 아닙니다. 배당성향이 100%를 넘거나(특히 잉여현금흐름 대비) 과거에 삭감 이력이 있다면 경고입니다. 높은 수익률은 선물이 아니라 시장이 삭감을 예상한 결과인 경우가 많습니다. 숫자를 믿기 전에 반드시 공시를 읽으세요.",
          value:
            "가치의 얼마나 많은 부분이 잔존가치(terminal value)에서 나오는지 보세요 — 대개 대부분입니다. 즉 DCF는 먼 미래에 대한 추측에 가깝습니다. 규율 있는 사고의 도구일 뿐, 결코 목표가가 아닙니다. 싼 것은 가치 함정일 수도 있습니다.",
          growth:
            "빠른 성장과 우량한 성장은 다릅니다. PEG는 성장률 — 선행 애널리스트 추정치(미국) 또는 기업의 과거 EPS 성장률(한국) — 로 나누므로 그 숫자의 오차를 그대로 물려받습니다. 선행 추정치는 지나치게 낙관적일 수 있고, 과거 성장률은 반복되지 않을 수 있습니다. 모든 성장 지표는 우량성 점검 — 자본수익률과 이익의 현금 전환 — 과 함께 보세요.",
          reit:
            "리츠는 순이익이 아니라 FFO/AFFO로 판단하고, 금리 민감도(2022년 하락)를 존중하세요. 대부분의 초심자에겐 광범위한 리츠 펀드가 개별 종목 분석보다 낫습니다 — 이것은 연습이지 추천이 아닙니다.",
        },
        tickerLabel: "종목 코드",
        marketLabel: "시장",
        marketUs: "미국 (SEC EDGAR)",
        marketKr: "한국 (DART)",
        priceLabel: "현재 주가 (주당)",
        priceAuto: "실시간 데이터로 자동 입력됨 — 수정해 덮어쓸 수 있습니다.",
        analyze: "분석",
        loading: "공시 불러오는 중…",
        notFound: "선택한 시장에서 해당 종목을 찾을 수 없습니다.",
        error: "데이터 조회에 실패했습니다. 다시 시도하거나 다른 종목을 입력하세요.",
        examples: "예시",
        sourceLink: "원문 공시에서 검증",
        yield: "배당수익률",
        payoutEarnings: "배당성향 (이익 대비)",
        payoutFcf: "배당성향 (잉여현금흐름 대비)",
        growthStreak: "배당 성장 연속",
        years: "년",
        cutWarning: "이 기업은 데이터 구간 내에 배당을 삭감한 적이 있습니다.",
        revenueCaption: "연도별 매출",
        dpsCaption: "연도별 주당배당금",
        growthRate: "FCF 성장률 (향후 5년)",
        terminalGrowth: "영구 성장률",
        discountRate: "할인율",
        intrinsic: "주당 내재가치",
        marginOfSafety: "안전마진",
        terminalShare: "잔존가치 비중",
        earningsYield: "이익수익률 (EBIT/EV)",
        returnOnCapital: "자본수익률",
        dcfCaption: "가치의 출처",
        terminalWarn:
          "가치의 대부분이 잔존가치 — 즉 먼 미래에 대한 가정 — 에서 나옵니다.",
        pe: "PER",
        peg: "PEG",
        pegForward: "PEG (선행, 애널리스트)",
        pegHistorical: "PEG (과거 성장 기준)",
        growthUsed: "적용 성장률",
        epsCagr: "EPS 성장률 (과거)",
        roe: "자기자본이익률",
        netMargin: "순이익률",
        fcfConversion: "FCF 전환율",
        qualityCaption: "우량성 지표",
        reitNote:
          "참고: 표준 공시는 FFO가 아니라 순이익을 보고합니다. 부동산 감가상각이 비현금 비용이라 리츠의 순이익 기준 배당성향은 놀랄 만큼 높게 보입니다 — 공시의 FFO/AFFO로 판단하세요.",
        reitTrapHook:
          "이 리츠는 순이익의 {payout}를 배당하는 것처럼 보입니다 — 불가능해 보이죠. 아닙니다: 그것이 바로 FFO 함정입니다.",
      },
      trade: {
        titles: {
          trend: "추세 시스템 백테스트",
          active: "셋업 & 비중 조절 랩",
        },
        intros: {
          trend:
            "단순하고 고정된 규칙 기반 추세 시스템을 실제 가격 역사로 — 미래 참조 없이 — 검증해 보세요. 정직한 트레이드오프가 보입니다: 추세추종은 보통 매수 후 보유보다 수익이 약간 적지만 최악의 낙폭을 대략 절반으로 줄입니다. 그 대가는 휩소(잦은 속임수 신호)입니다.",
          active:
            "단 한 번의 매매를 규율 있게 계획하세요: ATR 기반 손절, 위험의 고정 비율로 정한 비중, 그리고 정의된 손익비 목표 — 그런 다음 엿보지 않고 봉 단위로 결과를 풀어 봅니다. 사이트에서 가장 위험한 길이니 확률부터 읽으세요.",
        },
        lessons: {
          trend:
            "교훈: 추세 필터는 수익으로 시장을 이기지 않습니다 — 더 적게, 더 자주 벌되 훨씬 얕은 폭락을 받습니다(2008/2020 최악의 구간을 비켜갔습니다). 그 비용은 휩소: 횡보장에서 작은 손실 전환이 많아집니다. 여기에 조절 노브가 없는 건 의도적입니다 — 백테스트를 최적화할수록 소음에 맞추는 것이니까요.",
          active:
            "교훈: 생존은 고점을 맞히는 게 아니라 비중과 손절에 달렸습니다. 매매마다 작은 고정 비율만 위험에 노출하고 청산을 미리 정하는 것이, 연속된 손실이 당신을 끝내지 못하게 합니다. 그리고 냉정한 진실: 능동적 데이 트레이더의 약 90% 이상이 장기적으로 손실을 봅니다. 백테스트에서 보이는 우위의 대부분은 미래 참조, 생존 편향, 무시된 비용입니다.",
        },
        symbolLabel: "종목",
        systemLabel: "추세 시스템",
        systems: {
          sma200: "200일 이동평균",
          mom12: "12-1 모멘텀 (월간)",
          donchian: "돈치안 50일 돌파",
        },
        cagr: "전략 CAGR",
        buyHold: "매수 후 보유 CAGR",
        maxDd: "전략 최대 낙폭",
        exposure: "시장 노출 기간",
        trades: "전환 횟수",
        equityCaption: "$1의 성장 — 전략 vs. 매수 후 보유",
        drawdownCaption: "전략 낙폭",
        stratLine: "추세 전략",
        bhLine: "매수 후 보유",
        oddsWarning:
          "현실 점검: 연구에 따르면 능동적 데이 트레이더의 약 90% 이상이 장기적으로 손실을 보며, 드문 승자도 급여를 넘기 어렵습니다. 이것을 돈 버는 계획이 아니라 규율 훈련으로 여기세요. 먼저 모의 매매하고, 아주 작은 비중만 위험에 거세요.",
        entryLabel: "진입 가격",
        equityInput: "계좌 규모",
        riskPct: "매매당 위험",
        planHeading: "당신의 매매 계획",
        stop: "손절 (2×ATR)",
        target: "목표 (2R)",
        shares: "비중 (주식 수)",
        rr: "손익비",
        resolveHeading: "앞으로 풀어 보기 (미래 참조 없음)",
        outcome: "결과",
        hitStop: "손절 청산",
        hitTarget: "목표 도달",
        rMultiple: "결과 (R 멀티플)",
        nextSetup: "다음 셋업 →",
        setupLabel: "셋업",
        entryDate: "진입 날짜",
      },
      macro: {
        title: "사이클 읽기 대시보드",
        intro:
          "매크로 투자는 경제가 사이클의 어디에 있는지 읽는 데서 시작합니다. 실무가들이 실제로 보는 신호 — 수익률곡선, 실업률, 인플레이션, 정책금리 — 를 5개 십 년에 걸쳐 보여 주고, 과거의 모든 경기침체를 음영으로 표시했습니다.",
        lesson:
          "교훈: 이 신호들은 선행하지만 거짓말도 합니다 — 수익률곡선은 침체보다 6~24개월 앞서 역전됐고(한 번은 침체 없이도), 데이터는 사후에 수정됩니다. 사이클은 분산된 핵심 포트폴리오 주위에서 작은 기울임을 정하는 데 쓰세요 — 집중·레버리지 베팅이 아니라. 매크로 타이밍은 겸손을 가르칩니다.",
        gaugeHeading: "경기침체 위험 게이지",
        gaugeScore: "종합 위험 (0–100)",
        regimeHeading: "성장 × 인플레이션 국면",
        quadrants: {
          goldilocks: "골디락스 (성장↑, 인플레↓)",
          reflation: "리플레이션 (성장↑, 인플레↑)",
          stagflation: "스태그플레이션 (성장↓, 인플레↑)",
          deflation: "디플레이션 / 침체 (성장↓, 인플레↓)",
        },
        quadrantTilts: {
          goldilocks: "역사적으로 유리: 주식 (채권도 무난)",
          reflation: "역사적으로 유리: 주식 + 원자재",
          stagflation: "역사적으로 유리: 원자재 + 물가연동채",
          deflation: "역사적으로 유리: 장기 국채, 현금",
        },
        currentRegime: "현재 국면",
        verdictHeading: "지금 이 순간",
        seriesHeading: "신호들 (음영 = 침체)",
        yieldCurve: "수익률곡선 (10년 − 3개월)",
        unemployment: "실업률 (%)",
        cpiYoY: "인플레이션 (CPI, 전년比 %)",
        fedFunds: "연방기금금리 (%)",
        recessionShade: "음영 = NBER 경기침체",
        growth: "성장",
        inflation: "인플레이션",
        rising: "상승",
        falling: "하락",
        fredNotice:
          "본 제품은 FRED® API를 사용하지만, 세인트루이스 연방준비은행의 보증이나 인증을 받은 것은 아닙니다.",
      },
      options: {
        title: "커버드콜 & 프리미엄 랩",
        intro:
          "보유한 주식에 콜을 매도해 프리미엄을 받습니다. 내재변동성과 만기까지 일수를 조절해 합성 옵션 체인을 만들고, 행사가를 골라 인컴 — 그리고 제한된 상승 — 을 페이오프 다이어그램으로 확인하세요.",
        lesson:
          "교훈: 커버드콜은 큰 상승의 여력을 꾸준한 프리미엄과 맞바꿉니다. 횡보·소폭 하락장은 완충하지만 강한 상승장에서는 크게 뒤처집니다(CBOE BXM 지수는 1986년 이후 연 약 8.5% vs S&P 약 11%, 2013/2019년엔 15%p 이상 뒤짐). 당신이 실제로 파는 것은 내재변동성이며, 배당 직전 등 조기 배정도 당할 수 있습니다. 이것은 상한이 있는 인컴이지 공짜 돈이 아닙니다 — 기꺼이 넘겨줄 수 없는 주식엔 콜을 팔지 마세요.",
        spot: "주가",
        iv: "내재변동성",
        dte: "만기까지 일수",
        chainHeading: "합성 옵션 체인",
        strike: "행사가",
        callPremium: "콜 프리미엄",
        delta: "델타",
        pickStrike: "매도할 행사가 선택",
        planHeading: "커버드콜 페이오프",
        maxProfit: "최대 이익 (배정 시)",
        breakeven: "손익분기",
        annPremium: "프리미엄 연환산 수익률",
        capped: "행사가 위로는 상승 제한",
        payoffCaption: "만기 페이오프 — 주식 vs. 커버드콜",
        stockLine: "주식만 보유",
        coveredLine: "커버드콜",
        bxmHeading: "정직한 성과 기록 (바이라이트 vs. S&P)",
        bxmCaption: "$1의 성장 — CBOE 바이라이트(BXM) vs. S&P 500(SPY)",
        bxmLine: "BXM (커버드콜)",
        spyLine: "SPY (매수 후 보유)",
        bxmStat: "BXM CAGR",
        spyStat: "SPY CAGR",
        assignmentNote:
          "합성·예시 가격(유럽형 블랙숄즈; 실제 옵션은 미국형이라 특히 배당 전 조기 배정 가능). 실시간 시장 데이터가 아닙니다.",
      },
      factor: {
        title: "팩터 기울임 백테스트",
        intro:
          "검증된 수익 동인 — 가치·모멘텀·우량·저변동성 — 으로 실제 팩터 ETF를 사용해 기울이고, 전체 시장과 비교 검증하세요. 약속과, 팩터가 뒤처지는 길고 고통스러운 구간을 함께 봅니다.",
        lesson:
          "교훈: 팩터 프리미엄은 실재하지만 감쇠하고, 혼잡해지고, 한 번에 5~10년 이상 뒤처집니다(가치의 2010년대는 가혹했습니다). 단일 팩터 ETF의 시장 대비 초과수익은 작고 고르지 않게 옵니다 — 기울임은 가뭄을 견뎌야만 통합니다. 더 많은 팩터를 시험하고 골라낼수록 우위가 아니라 소음에 맞추는 것입니다.",
        factorLabel: "팩터 ETF",
        factors: {
          VTV: "가치 (VTV)",
          MTUM: "모멘텀 (MTUM)",
          QUAL: "우량 (QUAL)",
          USMV: "저변동성 (USMV)",
          VLUE: "가치·멀티팩터 (VLUE)",
        },
        growthCaption: "$1의 성장 — 팩터 ETF vs. 전체 시장(VTI)",
        factorLine: "팩터 ETF",
        marketLine: "전체 시장 (VTI)",
        cagr: "팩터 CAGR",
        marketCagr: "시장 CAGR",
        maxDd: "팩터 최대 낙폭",
        excess: "시장 대비 초과 (연환산)",
        decayNote:
          "팩터 ETF 출시 이후 공통 구간 기준. 과거 팩터 성과는 자본이 몰리며 특히 감쇠하기 쉽습니다 — 예측이 아닙니다.",
        regHeading: "팩터 회귀분석 (파마-프렌치 3팩터)",
        alpha: "알파 (연간)",
        betaMkt: "시장 β",
        betaSmb: "규모 β (SMB)",
        betaHml: "가치 β (HML)",
        rsq: "R²",
        regNote:
          "회귀분석은 ETF의 초과수익을 팩터 노출로 설명합니다. 알파는 미미하고 가치·규모 베타는 펀드가 표방하는 것과 일치합니다 — 당신이 사는 것은 팩터 노출(높은 R²)이지 매니저의 실력이 아닙니다. 그것이 규칙 기반 기울임의 핵심입니다.",
      },
      deal: {
        title: "합병 차익거래 스프레드 계산기",
        intro:
          "기업이 인수되면 그 주가는 보통 딜이 성사될 때까지 딜 가격보다 약간 아래에서 거래됩니다 — 그 차이가 합병 차익거래 스프레드입니다. 실제 또는 가상 딜의 연환산 수익률을 계산하고, 딜이 무산될 때의 절벽과 견줘 보세요.",
        lesson:
          "교훈: 합병 차익거래는 증기 롤러 앞에서 동전을 줍는 일입니다. 스프레드는 작고 연환산 수익률은 매혹적이지만, 딜이 깨지면 주가는 발표 전 가격으로 떨어집니다 — 스프레드의 몇 배에 달하는 손실. 연환산 수치는 미뤄질 수 있는 성사 시점을 가정합니다. 실제 8-K·합병계약서를 읽으세요; 공짜 돈이 아닙니다.",
        pickDeal: "예시 딜",
        targetLabel: "피인수 기업",
        acquirer: "인수 기업",
        dealPrice: "딜 가격 (주당)",
        currentPrice: "현재 가격",
        preAnnounce: "발표 전 가격",
        closeDays: "예상 성사까지 일수",
        grossSpread: "총 스프레드",
        spreadPct: "스프레드 %",
        annualized: "연환산 수익률",
        breakDownside: "딜 무산 시 하락폭",
        asymmetryNote:
          "비대칭에 주목: 작고 제한된 상승 vs. 딜이 붕괴할 때의 큰 하락.",
        manualNote:
          "아무 칸이나 수정해 직접 발표된 딜을 모델링하세요 — 조건은 SEC EDGAR의 피인수 기업 8-K·합병 위임장(DEFM14A)에서 찾을 수 있습니다.",
      },
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
