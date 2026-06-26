import Link from "next/link";
import { notFound } from "next/navigation";
import { findLesson } from "@/lib/content";
import { LOCALES, getStrings, isLocale, type Locale } from "@/lib/i18n";
import { STRATEGIES, getStrategy, riskLabel } from "@/lib/strategies";
import { getSchool } from "@/lib/schools";

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

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Link
          href={`/${locale}/strategies`}
          className="text-sm text-gray-400 no-underline hover:text-teal-300"
        >
          {t.strategyPage.back}
        </Link>
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
        </p>
      </div>

      <div>
        <h2 className="mb-4 text-xl font-semibold text-white">
          {t.strategyPage.pathHeading}
        </h2>
        <ol className="space-y-3">
          {strategy.steps.map((step, i) => {
            const lesson = findLesson(step.kind, step.slug, locale);
            const sub = step.kind === "guru" ? "gurus" : "indicators";
            const title =
              lesson?.frontmatter.title ?? step.newTitle?.[locale] ?? step.slug;
            const numberBadge = (
              <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black">
                {i + 1}
              </span>
            );
            const body = (
              <>
                {numberBadge}
                <span className="min-w-0">
                  <span className="font-semibold text-teal-300">{title}</span>
                  {!lesson && (
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
                {lesson ? (
                  <Link
                    href={`/${locale}/${sub}/${step.slug}`}
                    className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
                  >
                    {body}
                  </Link>
                ) : (
                  <div className="flex items-start gap-4 rounded-lg border border-dashed border-white/10 bg-[#131722]/50 p-4 opacity-70">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <Link
        href={`/${locale}/path`}
        className="inline-block text-sm text-teal-400 no-underline hover:text-teal-300"
      >
        {t.strategyPage.takeQuiz}
      </Link>
    </div>
  );
}
