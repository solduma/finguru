import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessons } from "@/lib/content";
import { getStrings, isLocale } from "@/lib/i18n";

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
      <div className="space-y-3">
        {gurus.map((l) => (
          <Link
            key={l.frontmatter.slug}
            href={`/${locale}/gurus/${l.frontmatter.slug}`}
            className="block rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
          >
            <div className="font-semibold text-teal-300">
              {l.frontmatter.title}
            </div>
            {l.frontmatter.contribution && (
              <div className="text-xs uppercase tracking-wide text-gray-500">
                {l.frontmatter.contribution}
              </div>
            )}
            <div className="text-sm text-gray-400">{l.frontmatter.summary}</div>
          </Link>
        ))}
        {gurus.length === 0 && (
          <p className="text-gray-500">{t.gurusIndex.soon}</p>
        )}
      </div>
    </div>
  );
}
