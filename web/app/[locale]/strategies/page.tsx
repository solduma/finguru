import Link from "next/link";
import { notFound } from "next/navigation";
import { getStrings, isLocale } from "@/lib/i18n";
import { STRATEGIES, riskLabel } from "@/lib/strategies";
import { getSchool } from "@/lib/schools";
import Reveal from "@/components/Reveal";
import CoverArt, { riskHue, coverInitials } from "@/components/CoverArt";

export default async function StrategiesIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {t.strategiesIndex.title}
        </h1>
        <p className="max-w-2xl text-gray-300">{t.strategiesIndex.intro}</p>
      </div>

      {/* Find My Strategy — the quiz entry, given top billing. */}
      <Reveal>
        <Link
          href={`/${locale}/path`}
          className="flex flex-col rounded-lg border border-teal-400/40 bg-teal-500/10 p-5 no-underline transition hover:border-teal-300 hover-lift"
        >
          <span className="text-xl font-semibold text-teal-200">
            {t.strategiesIndex.findTitle}
          </span>
          <span className="mt-1 max-w-2xl text-sm text-gray-300">
            {t.strategiesIndex.findBlurb}
          </span>
          <span className="mt-3 text-sm font-medium text-teal-300">
            {t.strategiesIndex.findCta}
          </span>
        </Link>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {[...STRATEGIES]
          .sort((a, b) => a.rank - b.rank)
          .map((s, i) => (
            <Reveal key={s.id} index={i}>
            <Link
              href={`/${locale}/strategies/${s.id}`}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#131722] no-underline transition hover:border-teal-400/50 hover-lift"
            >
              <CoverArt
                kind="strategy"
                slug={s.id}
                hue={riskHue(s.riskRank)}
                initials={coverInitials(s.label.en, 2)}
                className="aspect-[8/5] w-full"
              />
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-semibold text-teal-300">
                    {s.label[locale]}
                  </span>
                  <span className="flex-none text-xs uppercase tracking-wide text-gray-500">
                    {riskLabel(s.riskRank)[locale]}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-gray-400">
                  {s.blurb[locale]}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                  <span>{t.strategiesIndex.steps(s.steps.length)}</span>
                  <span>
                    {t.strategiesIndex.schoolsLabel}:{" "}
                    {s.schools
                      .map((id) => getSchool(id)?.label[locale] ?? id)
                      .join(", ")}
                  </span>
                </div>
              </div>
            </Link>
            </Reveal>
          ))}
      </div>

      <Reveal>
        <p className="max-w-2xl rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-400">
          {t.strategiesIndex.cryptoNote}
        </p>
      </Reveal>
    </div>
  );
}
