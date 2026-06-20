import Link from "next/link";
import {
  getToc,
  getNeighbors,
  lessonHref,
  type Lesson,
} from "@/lib/content";
import { getStrings, type Locale } from "@/lib/i18n";
import Mdx from "./Mdx";

export default function LessonLayout({
  lesson,
  locale,
}: {
  lesson: Lesson;
  locale: Locale;
}) {
  const fm = lesson.frontmatter;
  const t = getStrings(locale);
  const toc = getToc(lesson.content);
  const { prev, next } = getNeighbors(fm.kind, fm.slug, locale);
  const kindLabel = (t.kinds as Record<string, string>)[fm.kind] ?? fm.kind;
  const levelLabel = (t.levels as Record<string, string>)[fm.level] ?? fm.level;

  return (
    <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div className="min-w-0 space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-teal-400">
            <span>{kindLabel}</span>
            <span>•</span>
            <span>{levelLabel}</span>
            {fm.era && (
              <>
                <span>•</span>
                <span>{fm.era}</span>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">{fm.title}</h1>
          <p className="text-lg text-gray-300">{fm.summary}</p>
          {fm.prereqs && fm.prereqs.length > 0 && (
            <p className="text-sm text-gray-400">
              {t.lesson.recommendedFirst} {fm.prereqs.join(", ")}
            </p>
          )}
          {lesson.fellBackToDefault && (
            <p className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-200">
              {t.lesson.translationNote}
            </p>
          )}
        </div>

        <hr className="border-white/10" />

        <Mdx source={lesson.content} locale={locale} />

        <hr className="border-white/10" />

        <nav className="flex items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={lessonHref(prev, locale)}
              className="flex-1 rounded-lg border border-white/10 bg-[#131722] p-3 no-underline transition hover:border-teal-400/50"
            >
              <div className="text-xs text-gray-500">{t.lesson.prev}</div>
              <div className="text-sm font-semibold text-teal-300">
                {prev.frontmatter.title}
              </div>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={lessonHref(next, locale)}
              className="flex-1 rounded-lg border border-white/10 bg-[#131722] p-3 text-right no-underline transition hover:border-teal-400/50"
            >
              <div className="text-xs text-gray-500">{t.lesson.next}</div>
              <div className="text-sm font-semibold text-teal-300">
                {next.frontmatter.title}
              </div>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>

        <Link href={`/${locale}/path`} className="block text-sm no-underline">
          {t.lesson.backToPath}
        </Link>
      </div>

      {toc.length > 0 && (
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-2 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t.lesson.onThisPage}
            </div>
            <ul className="space-y-1">
              {toc.map((entry, i) => (
                <li key={i} className={entry.depth === 3 ? "pl-3" : ""}>
                  <a
                    href={`#${entry.id}`}
                    className="block text-gray-400 no-underline hover:text-teal-300"
                  >
                    {entry.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
