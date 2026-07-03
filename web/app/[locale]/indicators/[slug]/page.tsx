import { notFound } from "next/navigation";
import { getLesson, getLessons } from "@/lib/content";
import LessonLayout from "@/components/LessonLayout";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    getLessons("indicator", DEFAULT_LOCALE).map((l) => ({
      locale,
      slug: l.frontmatter.slug,
    })),
  );
}

export default async function IndicatorPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ path?: string }>;
}) {
  const { locale, slug } = await params;
  const { path } = await searchParams;
  if (!isLocale(locale)) notFound();
  const lesson = getLesson("indicator", slug, locale);
  if (!lesson) notFound();
  return <LessonLayout lesson={lesson} locale={locale} pathId={path} />;
}
