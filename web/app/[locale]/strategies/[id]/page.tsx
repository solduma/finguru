import Link from "next/link";
import { notFound } from "next/navigation";
import { findLesson, readingMinutes } from "@/lib/content";
import { LOCALES, getStrings, isLocale, type Locale } from "@/lib/i18n";
import { STRATEGIES, getStrategy, riskLabel } from "@/lib/strategies";
import { getCheatsheet } from "@/lib/cheatsheets";
import { getSchool } from "@/lib/schools";
import Reveal from "@/components/Reveal";
import StrategyProgress from "@/components/StrategyProgress";
import CoverArt, { riskHue, coverInitials } from "@/components/CoverArt";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    STRATEGIES.map((s) => ({ locale, id: s.id })),
  );
}

export default async function StrategyPathPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const strategy = getStrategy(id);
  if (!strategy) notFound();
  const t = getStrings(locale);

  // Resolve each step once: does its lesson exist, its title, reading minutes,
  // and a stable progress id. Reused by the list render and the progress bar.
  const resolved = strategy.steps.map((step) => {
    const lesson = findLesson(step.kind, step.slug, locale);
    return {
      step,
      lesson,
      title: lesson?.frontmatter.title ?? step.newTitle?.[locale] ?? step.slug,
      minutes: lesson ? readingMinutes(lesson.content) : 0,
      progressId: `lesson:${step.kind}:${step.slug}`,
    };
  });
  // Progress ids for the steps that actually have a lesson, plus the lab.
  const progressIds = [
    ...resolved.filter((r) => r.lesson).map((r) => r.progressId),
    ...(strategy.practical ? [`lab:${strategy.id}`] : []),
  ];
  const totalMinutes = resolved.reduce((sum, r) => sum + r.minutes, 0);

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link
            href={`/${locale}/strategies`}
            className="text-sm text-gray-400 no-underline hover:text-teal-300"
          >
            {t.strategyPage.back}
          </Link>
          <CoverArt
            kind="strategy"
            slug={strategy.id}
            hue={riskHue(strategy.riskRank)}
            initials={coverInitials(strategy.label.en, 2)}
            className="mb-2 aspect-[8/5] w-full max-w-md rounded-lg border border-white/10"
          />
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="text-3xl font-bold text-white">
              {strategy.label[locale]}
            </h1>
            <span className="flex-none text-xs uppercase tracking-wide text-gray-500">
              {riskLabel(strategy.riskRank)[locale]}
            </span>
          </div>
          <p className="max-w-2xl text-gray-300">{strategy.blurb[locale]}</p>
          <p className="text-sm text-gray-500">
            {t.strategyPage.drawsFrom}:{" "}
            {strategy.schools
              .map((sid) => getSchool(sid)?.label[locale] ?? sid)
              .join(" · ")}
            {" · "}
            {t.strategyPage.totalTime.replace("{min}", String(totalMinutes))}
          </p>
        </div>
      </Reveal>

      {progressIds.length > 0 && (
        <Reveal>
          <StrategyProgress ids={progressIds} t={t.strategyPage} />
        </Reveal>
      )}

      <div>
        <Reveal>
          <h2 className="mb-4 text-xl font-semibold text-white">
            {t.strategyPage.pathHeading}
          </h2>
        </Reveal>
        <ol className="space-y-3">
          {resolved.map(({ step, lesson, title, minutes }, i) => {
            const sub = step.kind === "guru" ? "gurus" : "indicators";
            const numberBadge = (
              <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black anim-scale-in">
                {i + 1}
              </span>
            );
            const body = (
              <>
                {numberBadge}
                <span className="min-w-0">
                  <span className="font-semibold text-teal-300">{title}</span>
                  {lesson ? (
                    <span className="ml-2 text-[10px] uppercase tracking-wide text-gray-500">
                      {t.lesson.minRead.replace("{min}", String(minutes))}
                    </span>
                  ) : (
                    <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-gray-400">
                      {t.strategyPage.comingSoon}
                    </span>
                  )}
                  <span className="block text-sm text-gray-400">
                    {step.why[locale]}
                  </span>
                </span>
              </>
            );
            return (
              <li key={`${step.kind}-${step.slug}-${i}`}>
                <Reveal index={i}>
                  {lesson ? (
                    <Link
                      href={`/${locale}/${sub}/${step.slug}?path=${strategy.id}`}
                      className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50 hover-lift"
                    >
                      {body}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-4 rounded-lg border border-dashed border-white/10 bg-[#131722]/50 p-4 opacity-70">
                      {body}
                    </div>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>

      {strategy.practical && (
        <Reveal>
          <Link
            href={`/${locale}/practice/${strategy.id}`}
            className="flex items-center justify-between gap-4 rounded-lg border border-teal-400/30 bg-teal-400/5 p-5 no-underline transition hover:border-teal-400/60 hover-lift"
          >
            <span>
              <span className="block text-lg font-semibold text-teal-300">
                {t.strategyPage.practiceHeading}
              </span>
              <span className="mt-1 block text-sm text-gray-400">
                {t.strategyPage.practiceCta}
              </span>
            </span>
            <span className="flex-none text-2xl text-teal-300" aria-hidden>
              →
            </span>
          </Link>
        </Reveal>
      )}

      {getCheatsheet(strategy.id) && (
        <Reveal>
          <Link
            href={`/${locale}/cheatsheet/${strategy.id}`}
            className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#131722] p-5 no-underline transition hover:border-teal-400/50 hover-lift"
          >
            <span>
              <span className="block text-lg font-semibold text-teal-300">
                {t.strategyPage.cheatsheetHeading}
              </span>
              <span className="mt-1 block text-sm text-gray-400">
                {t.strategyPage.cheatsheetCta}
              </span>
            </span>
            <span className="flex-none text-2xl text-teal-300" aria-hidden>
              ↗
            </span>
          </Link>
        </Reveal>
      )}

      <Link
        href={`/${locale}/path`}
        className="inline-block text-sm text-teal-400 no-underline hover:text-teal-300"
      >
        {t.strategyPage.takeQuiz}
      </Link>
    </div>
  );
}
