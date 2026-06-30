import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import CoverArt, { SCHOOL_HUE } from "@/components/CoverArt";
import { getLessonsForSchool } from "@/lib/content";
import { getStrings, isLocale } from "@/lib/i18n";
import { SCHOOL_LIST, type SchoolId } from "@/lib/schools";

// Short codes are the watermark on each school banner; hues come from CoverArt.
const SCHOOL_CODE: Record<SchoolId, string> = {
  technical: "TA",
  fundamental: "FA",
  quant: "Q",
  macro: "M",
};

export default async function SchoolsIndex({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getStrings(locale);

  const schools = SCHOOL_LIST.map((school) => ({
    school,
    count: getLessonsForSchool(school.id, locale).length,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">{t.schoolsIndex.title}</h1>
      <p className="max-w-2xl text-gray-300">{t.schoolsIndex.intro}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {schools.map(({ school, count }, i) => (
          <Reveal key={school.id} index={i}>
          <Link
            href={`/${locale}/schools/${school.id}`}
            className="flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-[#131722] no-underline transition hover:border-teal-400/50 hover-lift"
          >
            <CoverArt
              kind="school"
              slug={school.id}
              hue={SCHOOL_HUE[school.id]}
              initials={SCHOOL_CODE[school.id]}
              className="aspect-[8/5] w-full"
            />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xl font-semibold text-teal-300">
                  {school.label[locale]}
                </span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {t.schoolsIndex.lessonCount(count)}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm text-gray-400">
                {school.tagline[locale]}
              </p>
              <span className="mt-3 text-sm text-teal-400">
                {t.schoolsIndex.explore}
              </span>
            </div>
          </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
