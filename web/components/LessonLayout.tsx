import Link from "next/link";
import {
  getToc,
  getNeighbors,
  readingMinutes,
  lessonHref,
  type Lesson,
} from "@/lib/content";
import { placeInStrategy } from "@/lib/strategies";
import { getStrings, type Locale } from "@/lib/i18n";
import Mdx from "./Mdx";
import LessonProgress from "./LessonProgress";
import Reveal from "@/components/Reveal";
import CoverArt, { HUE, schoolHue, coverInitials } from "@/components/CoverArt";

export default function LessonLayout({
  lesson,
  locale,
  pathId,
}: {
  lesson: Lesson;
  locale: Locale;
  /** Optional strategy id the learner is following (from ?path=), so Prev/Next
   *  track the chosen path instead of the global biographical order. */
  pathId?: string;
}) {
  const fm = lesson.frontmatter;
  const t = getStrings(locale);
  const toc = getToc(lesson.content);
  const minutes = readingMinutes(lesson.content);

  // Strategy-aware navigation when we know the path; otherwise the global order.
  const placement = pathId
    ? placeInStrategy(pathId, fm.kind, fm.slug)
    : null;
  const q = placement ? `?path=${placement.strategyId}` : "";
  const global = getNeighbors(fm.kind, fm.slug, locale);
  const prev = placement
    ? placement.prev
      ? {
          href: `/${locale}/${placement.prev.kind === "guru" ? "gurus" : "indicators"}/${placement.prev.slug}${q}`,
          title: placement.prev.newTitle?.[locale] ?? placement.prev.slug,
        }
      : null
    : global.prev
      ? { href: lessonHref(global.prev, locale), title: global.prev.frontmatter.title }
      : null;
  const next = placement
    ? placement.next
      ? {
          href: `/${locale}/${placement.next.kind === "guru" ? "gurus" : "indicators"}/${placement.next.slug}${q}`,
          title: placement.next.newTitle?.[locale] ?? placement.next.slug,
        }
      : placement.atLastStep && placement.hasPractical
        ? { href: `/${locale}/practice/${placement.strategyId}`, title: t.strategyPage.practiceHeading }
        : null
    : global.next
      ? { href: lessonHref(global.next, locale), title: global.next.frontmatter.title }
      : null;

  const kindLabel = (t.kinds as Record<string, string>)[fm.kind] ?? fm.kind;
  const levelLabel = (t.levels as Record<string, string>)[fm.level] ?? fm.level;
  // Indicators read as teal "chart" art; gurus take their school's hue.
  const coverHue = fm.kind === "indicator" ? HUE.indicator : schoolHue(fm.school);
  // A stable key for progress tracking (kind:slug) — see LessonProgress.
  const progressKey = `${fm.kind}:${fm.slug}`;

  return (
    <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div className="min-w-0 space-y-6">
          <div className="space-y-2">
            <Reveal delayMs={0}>
              <CoverArt
                kind={fm.kind === "indicator" ? "indicator" : "guru"}
                slug={fm.slug}
                hue={coverHue}
                initials={coverInitials(fm.title)}
                className="mb-4 aspect-[8/5] w-full max-w-md rounded-lg border border-white/10"
              />
            </Reveal>
            <Reveal delayMs={0}>
              <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-teal-400">
                <span>{kindLabel}</span>
                <span>•</span>
                <span>{levelLabel}</span>
                <span>•</span>
                <span>{t.lesson.minRead.replace("{min}", String(minutes))}</span>
                {fm.era && (
                  <>
                    <span>•</span>
                    <span>{fm.era}</span>
                  </>
                )}
              </div>
            </Reveal>
            {placement && (
              <Reveal delayMs={20}>
                <Link
                  href={`/${locale}/strategies/${placement.strategyId}`}
                  className="inline-block rounded-md border border-teal-400/30 bg-teal-400/5 px-3 py-1 text-xs font-medium text-teal-200 no-underline transition hover:border-teal-400/60"
                >
                  {t.lesson.stepInPath
                    .replace("{n}", String(placement.index + 1))
                    .replace("{total}", String(placement.total))
                    .replace("{strategy}", placement.strategyLabel[locale])}
                </Link>
              </Reveal>
            )}
            <Reveal delayMs={40}>
              <h1 className="text-3xl font-bold text-white">{fm.title}</h1>
            </Reveal>
            <Reveal delayMs={80}>
              <p className="text-lg text-gray-300">{fm.summary}</p>
            </Reveal>
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

        <Reveal index={1}>
          <Mdx source={lesson.content} locale={locale} />
        </Reveal>

        <hr className="border-white/10" />

        <Reveal>
          <LessonProgress
            lessonKey={progressKey}
            strategyId={placement?.strategyId}
            t={t.lesson}
          />
        </Reveal>

        <Reveal>
          <nav className="flex items-stretch justify-between gap-4">
            {prev ? (
              <Link
                href={prev.href}
                className="flex-1 rounded-lg border border-white/10 bg-[#131722] p-3 no-underline transition hover:border-teal-400/50 hover-lift"
              >
                <div className="text-xs text-gray-500">{t.lesson.prev}</div>
                <div className="text-sm font-semibold text-teal-300">
                  {prev.title}
                </div>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link
                href={next.href}
                className="flex-1 rounded-lg border border-white/10 bg-[#131722] p-3 text-right no-underline transition hover:border-teal-400/50 hover-lift"
              >
                <div className="text-xs text-gray-500">{t.lesson.next}</div>
                <div className="text-sm font-semibold text-teal-300">
                  {next.title}
                </div>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </nav>
        </Reveal>

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
                  <Reveal index={i}>
                    <a
                      href={`#${entry.id}`}
                      className="block text-gray-400 no-underline hover:text-teal-300"
                    >
                      {entry.text}
                    </a>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
