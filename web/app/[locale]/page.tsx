import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CountUp from "@/components/CountUp";
import { getLessons } from "@/lib/content";
import { getStrings, isLocale, type Locale } from "@/lib/i18n";
import { SCHOOL_LIST, type SchoolId } from "@/lib/schools";
import { STRATEGIES, riskLabel } from "@/lib/strategies";

// Per-school accent classes. Static strings (no interpolation) so Tailwind v4's
// JIT keeps them. Each school gets a distinct hue used on its card's rule,
// label, and hover border — color-coding the taxonomy without extra chrome.
const SCHOOL_STYLE: Record<
  SchoolId,
  { dot: string; label: string; hover: string }
> = {
  technical: {
    dot: "bg-teal-400",
    label: "text-teal-300",
    hover: "hover:border-teal-400/50",
  },
  fundamental: {
    dot: "bg-amber-400",
    label: "text-amber-300",
    hover: "hover:border-amber-400/50",
  },
  quant: {
    dot: "bg-violet-400",
    label: "text-violet-300",
    hover: "hover:border-violet-400/50",
  },
  macro: {
    dot: "bg-rose-400",
    label: "text-rose-300",
    hover: "hover:border-rose-400/50",
  },
};

// Four iconic masters — one per school — to show the site's breadth at a glance
// rather than dumping the full roster. Curated, not algorithmic.
const FEATURED_GURUS = [
  "charles-dow",
  "warren-buffett",
  "jim-simons",
  "george-soros",
];

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);

  const gurus = getLessons("guru", locale);
  const indicators = getLessons("indicator", locale);
  const lessonCount = gurus.length + indicators.length;

  const featured = FEATURED_GURUS.map((slug) =>
    gurus.find((g) => g.frontmatter.slug === slug),
  ).filter((g): g is NonNullable<typeof g> => Boolean(g));

  const topStrategies = [...STRATEGIES]
    .sort((a, b) => a.rank - b.rank)
    .slice(0, 6);

  return (
    <div className="space-y-16">
      {/* Hero */}
      <section className="space-y-5 pt-2">
        <Reveal index={0}>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t.home.heroTitle}
          </h1>
        </Reveal>
        <Reveal index={1}>
          <p className="max-w-2xl text-lg text-gray-300">{t.home.heroIntro}</p>
        </Reveal>
        <Reveal index={2}>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              href={`/${locale}/path`}
              className="rounded-md bg-teal-500 px-5 py-2.5 font-semibold text-black no-underline transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-teal-400"
            >
              {t.home.heroQuizCta}
            </Link>
            <Link
              href={`/${locale}/strategies`}
              className="rounded-md border border-white/15 px-5 py-2.5 font-medium text-gray-200 no-underline transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-white/30 hover:text-white"
            >
              {t.home.heroBrowseCta}
            </Link>
          </div>
        </Reveal>
        <Reveal index={3}>
          <ul className="flex flex-wrap gap-x-6 gap-y-1 pt-3 text-sm text-gray-400">
            <Reveal as="li" index={0}>
              <CountUp
                value={STRATEGIES.length}
                prefix={t.home.statStrategies.prefix}
                suffix={t.home.statStrategies.suffix}
              />
            </Reveal>
            <li aria-hidden className="text-gray-600">·</li>
            <Reveal as="li" index={1}>
              <CountUp
                value={lessonCount}
                prefix={t.home.statLessons.prefix}
                suffix={t.home.statLessons.suffix}
              />
            </Reveal>
            <li aria-hidden className="text-gray-600">·</li>
            <Reveal as="li" index={2}>
              <CountUp
                value={SCHOOL_LIST.length}
                prefix={t.home.statSchools.prefix}
                suffix={t.home.statSchools.suffix}
              />
            </Reveal>
          </ul>
        </Reveal>
      </section>

      {/* The four schools */}
      <section className="space-y-5">
        <Reveal>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">
              {t.home.schoolsHeading}
            </h2>
            <p className="max-w-2xl text-gray-400">{t.home.schoolsSub}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SCHOOL_LIST.map((school, i) => {
            const s = SCHOOL_STYLE[school.id];
            return (
              <Reveal key={school.id} delayMs={200 + i * 70}>
                <Link
                  href={`/${locale}/schools/${school.id}`}
                  className={`flex h-full flex-col rounded-lg border border-white/10 bg-[#131722] p-5 no-underline transition ${s.hover} hover-lift`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 flex-none rounded-full ${s.dot}`} />
                    <span className={`text-lg font-semibold ${s.label}`}>
                      {school.label[locale]}
                    </span>
                  </span>
                  <p className="mt-2 text-sm text-gray-400">
                    {school.tagline[locale]}
                  </p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* Strategy paths */}
      <section className="space-y-5">
        <Reveal>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold text-white">
              {t.home.strategiesHeading}
            </h2>
            <p className="max-w-2xl text-gray-400">{t.home.strategiesSub}</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topStrategies.map((s, i) => (
            <Reveal key={s.id} delayMs={200 + i * 70}>
              <Link
                href={`/${locale}/strategies/${s.id}`}
                className="flex h-full flex-col rounded-lg border border-white/10 bg-[#131722] p-5 no-underline transition hover:border-teal-400/50 hover-lift"
              >
                <span className="text-base font-semibold text-teal-300">
                  {s.label[locale]}
                </span>
                <p className="mt-2 flex-1 text-sm text-gray-400">
                  {s.blurb[locale]}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{t.strategiesIndex.steps(s.steps.length)}</span>
                  <span>{riskLabel(s.riskRank)[locale]}</span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Link
          href={`/${locale}/strategies`}
          className="inline-block text-sm font-medium text-teal-400 no-underline transition-colors duration-200 hover:text-teal-300"
        >
          {t.home.strategiesAll(STRATEGIES.length)}
        </Link>
      </section>

      {/* Featured gurus */}
      {featured.length > 0 && (
        <section className="space-y-5">
          <Reveal>
            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-white">
                {t.home.gurusHeading}
              </h2>
              <p className="max-w-2xl text-gray-400">{t.home.gurusSub}</p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featured.map((g, i) => (
              <Reveal key={g.frontmatter.slug} delayMs={200 + i * 70}>
                <Link
                  href={`/${locale}/gurus/${g.frontmatter.slug}`}
                  className="flex h-full flex-col rounded-lg border border-white/10 bg-[#131722] p-5 no-underline transition hover:border-teal-400/50 hover-lift"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-semibold text-teal-300">
                      {g.frontmatter.title}
                    </span>
                    {g.frontmatter.era && (
                      <span className="flex-none text-xs text-gray-500">
                        {g.frontmatter.era}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-3 text-sm text-gray-400">
                    {g.frontmatter.summary}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
          <Link
            href={`/${locale}/gurus`}
            className="inline-block text-sm font-medium text-teal-400 no-underline transition-colors duration-200 hover:text-teal-300"
          >
            {t.home.gurusAll}
          </Link>
        </section>
      )}

      {/* Tools / indicators reference */}
      <section>
        <Reveal>
          <Link
            href={`/${locale}/indicators`}
            className="flex flex-col rounded-lg border border-white/10 bg-[#131722] p-6 no-underline transition hover:border-teal-400/50 hover-lift"
          >
            <h2 className="text-xl font-semibold text-white">
              {t.home.toolsHeading}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-400">
              {t.home.toolsSub}
            </p>
            <span className="mt-3 text-sm font-medium text-teal-400">
              {t.home.toolsCta}{" "}
              <span className="text-gray-500">
                ({indicators.length})
              </span>
            </span>
          </Link>
        </Reveal>
      </section>

      {/* How it works */}
      <section className="space-y-5">
        <Reveal>
          <h2 className="text-2xl font-semibold text-white">
            {t.home.howHeading}
          </h2>
        </Reveal>
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {t.home.howSteps.map((step, i) => (
            <Reveal
              as="li"
              key={i}
              delayMs={200 + i * 70}
              className="rounded-lg border border-white/10 bg-[#131722] p-5"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black">
                {i + 1}
              </span>
              <h3 className="mt-3 font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-400">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>
    </div>
  );
}
