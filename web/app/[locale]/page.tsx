import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessons } from "@/lib/content";
import { getStrings, isLocale } from "@/lib/i18n";

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

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-white">{t.home.title}</h1>
        <p className="max-w-2xl text-lg text-gray-300">{t.home.intro}</p>
        <div className="flex gap-4 pt-2">
          <Link
            href={`/${locale}/strategies`}
            className="rounded-md bg-teal-500 px-5 py-2 font-semibold text-black no-underline"
          >
            {t.home.startPath}
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          {t.home.gurusHeading}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {gurus.map((l) => (
            <Link
              key={l.frontmatter.slug}
              href={`/${locale}/gurus/${l.frontmatter.slug}`}
              className="rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
            >
              <div className="font-semibold text-teal-300">
                {l.frontmatter.title}
              </div>
              <div className="text-sm text-gray-400">
                {l.frontmatter.summary}
              </div>
            </Link>
          ))}
          {gurus.length === 0 && (
            <p className="text-gray-500">{t.home.gurusSoon}</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          {t.home.indicatorsHeading}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {indicators.map((l) => (
            <Link
              key={l.frontmatter.slug}
              href={`/${locale}/indicators/${l.frontmatter.slug}`}
              className="rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
            >
              <div className="font-semibold text-teal-300">
                {l.frontmatter.title}
              </div>
              <div className="text-sm text-gray-400">
                {l.frontmatter.summary}
              </div>
            </Link>
          ))}
          {indicators.length === 0 && (
            <p className="text-gray-500">{t.home.indicatorsSoon}</p>
          )}
        </div>
      </section>
    </div>
  );
}
