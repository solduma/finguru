import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CoverArt, { HUE, coverInitials } from "@/components/CoverArt";
import { getLessons } from "@/lib/content";
import { getStrings, isLocale } from "@/lib/i18n";

export default async function IndicatorsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);
  const indicators = getLessons("indicator", locale);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{t.indicatorsIndex.title}</h1>
      <p className="text-gray-300">{t.indicatorsIndex.intro}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {indicators.map((l, i) => (
          <Reveal key={l.frontmatter.slug} index={i}>
            <Link
              href={`/${locale}/indicators/${l.frontmatter.slug}`}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#131722] no-underline transition hover:border-teal-400/50 hover-lift"
            >
              <CoverArt
                kind="indicator"
                slug={l.frontmatter.slug}
                hue={HUE.indicator}
                initials={coverInitials(l.frontmatter.title)}
                className="aspect-[8/5] w-full"
              />
              <div className="min-w-0 p-4">
                <div className="font-semibold text-teal-300">
                  {l.frontmatter.title}
                </div>
                <div className="mt-1 text-sm text-gray-400">
                  {l.frontmatter.summary}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
        {indicators.length === 0 && (
          <p className="text-gray-500">{t.indicatorsIndex.soon}</p>
        )}
      </div>
    </div>
  );
}
