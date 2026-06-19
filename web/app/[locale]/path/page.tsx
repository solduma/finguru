import Link from "next/link";
import { notFound } from "next/navigation";
import { getLearningPath } from "@/lib/content";
import { getStrings, isLocale, type Locale } from "@/lib/i18n";

export default async function PathPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);
  const order = getLearningPath(locale);
  const levelLabel = (lvl: string) =>
    (t.levels as Record<string, string>)[lvl] ?? lvl;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{t.path.title}</h1>
      <p className="max-w-2xl text-gray-300">{t.path.intro}</p>
      <ol className="space-y-3">
        {order.map((l, i) => (
          <li key={`${l.frontmatter.kind}-${l.frontmatter.slug}`}>
            <Link
              href={`/${locale}/${l.frontmatter.kind === "guru" ? "gurus" : "indicators"}/${l.frontmatter.slug}`}
              className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
            >
              <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black">
                {i + 1}
              </span>
              <span>
                <span className="font-semibold text-teal-300">
                  {l.frontmatter.title}
                </span>
                <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">
                  {levelLabel(l.frontmatter.level)}
                </span>
                <span className="block text-sm text-gray-400">
                  {l.frontmatter.summary}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {order.length === 0 && <p className="text-gray-500">{t.path.soon}</p>}
      </ol>
    </div>
  );
}
