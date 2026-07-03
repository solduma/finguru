import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessons } from "@/lib/content";
import { getStrings, isLocale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";
import CoverArt, { schoolHue, coverInitials } from "@/components/CoverArt";

export default async function GurusIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);
  const gurus = getLessons("guru", locale);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{t.gurusIndex.title}</h1>
      <p className="text-gray-300">{t.gurusIndex.intro}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {gurus.map((l, i) => {
          return (
            <Reveal key={l.frontmatter.slug} index={i}>
              <Link
                href={`/${locale}/gurus/${l.frontmatter.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#131722] no-underline transition hover:border-teal-400/50 hover-lift"
              >
                <CoverArt
                  kind="guru"
                  slug={l.frontmatter.slug}
                  hue={schoolHue(l.frontmatter.school)}
                  initials={coverInitials(l.frontmatter.title)}
                  className="aspect-[8/5] w-full"
                />
                <div className="min-w-0 p-4">
                  <div className="mb-1 text-[10px] uppercase tracking-wide text-gray-500">
                    {(t.levels as Record<string, string>)[l.frontmatter.level] ??
                      l.frontmatter.level}
                  </div>
                  <div className="font-semibold text-teal-300">
                    {l.frontmatter.title}
                  </div>
                  {l.frontmatter.contribution && (
                    <div className="text-xs uppercase tracking-wide text-gray-500">
                      {l.frontmatter.contribution}
                    </div>
                  )}
                  <div className="mt-1 text-sm text-gray-400">
                    {l.frontmatter.summary}
                  </div>
                </div>
              </Link>
            </Reveal>
          );
        })}
        {gurus.length === 0 && (
          <p className="text-gray-500">{t.gurusIndex.soon}</p>
        )}
      </div>
    </div>
  );
}
