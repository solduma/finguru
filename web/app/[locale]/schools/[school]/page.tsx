import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CoverArt, { SCHOOL_HUE } from "@/components/CoverArt";
import { getLessonsForSchool, lessonHref, type Lesson } from "@/lib/content";
import { LOCALES, getStrings, isLocale, type Locale } from "@/lib/i18n";
import { SCHOOL_LIST, getSchool } from "@/lib/schools";

const SCHOOL_CODE: Record<string, string> = {
  technical: "TA",
  fundamental: "FA",
  quant: "Q",
  macro: "M",
};

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    SCHOOL_LIST.map((s) => ({ locale, school: s.id })),
  );
}

export default async function SchoolPage({
  params,
}: {
  params: Promise<{ locale: string; school: string }>;
}) {
  const { locale, school: schoolId } = await params;
  if (!isLocale(locale)) notFound();
  const school = getSchool(schoolId);
  if (!school) notFound();
  const t = getStrings(locale);

  const lessons = getLessonsForSchool(school.id, locale);
  // Group by strategy id, preserving path order within each group.
  const byStrategy = new Map<string, Lesson[]>();
  for (const l of lessons) {
    const key = l.frontmatter.strategy ?? "_";
    (byStrategy.get(key) ?? byStrategy.set(key, []).get(key)!).push(l);
  }

  // Render strategies in their declared order; skip empty ones. Any lessons
  // whose strategy id isn't in the taxonomy fall into a trailing "More" group.
  const known = new Set(school.strategies.map((s) => s.id));
  const orphans = lessons.filter(
    (l) => !l.frontmatter.strategy || !known.has(l.frontmatter.strategy),
  );

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link
            href={`/${locale}/schools`}
            className="text-sm text-gray-400 no-underline hover:text-teal-300"
          >
            ← {t.schoolsIndex.title}
          </Link>
          <CoverArt
            kind="school"
            slug={school.id}
            hue={SCHOOL_HUE[school.id]}
            initials={SCHOOL_CODE[school.id]}
            className="mb-2 aspect-[8/5] w-full max-w-md rounded-lg border border-white/10"
          />
          <h1 className="text-3xl font-bold text-white">
            {school.label[locale]}
          </h1>
          <p className="max-w-2xl text-gray-300">{school.tagline[locale]}</p>
        </div>
      </Reveal>

      {school.strategies
        .filter((strat) => (byStrategy.get(strat.id)?.length ?? 0) > 0)
        .map((strat) => (
          <section key={strat.id} className="space-y-3">
            <Reveal>
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {strat.label[locale]}
                </h2>
                <p className="text-sm text-gray-400">{strat.blurb[locale]}</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {byStrategy.get(strat.id)!.map((l, i) => (
                <Reveal key={l.frontmatter.slug} index={i}>
                  <LessonCard lesson={l} locale={locale} />
                </Reveal>
              ))}
            </div>
          </section>
        ))}

      {orphans.length > 0 && (
        <section className="space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {orphans.map((l, i) => (
              <Reveal key={l.frontmatter.slug} index={i}>
                <LessonCard lesson={l} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {lessons.length === 0 && (
        <p className="text-gray-500">{t.gurusIndex.soon}</p>
      )}
    </div>
  );
}

function LessonCard({ lesson, locale }: { lesson: Lesson; locale: Locale }) {
  const fm = lesson.frontmatter;
  return (
    <Link
      href={lessonHref(lesson, locale)}
      className="block h-full rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50 hover-lift"
    >
      <div className="font-semibold text-teal-300">{fm.title}</div>
      {fm.contribution && (
        <div className="text-xs uppercase tracking-wide text-gray-500">
          {fm.contribution}
        </div>
      )}
      <div className="text-sm text-gray-400">{fm.summary}</div>
    </Link>
  );
}
