import { notFound } from "next/navigation";
import { getLesson, getLessons } from "@/lib/content";
import LessonLayout from "@/components/LessonLayout";
import { LOCALES, DEFAULT_LOCALE, isLocale } from "@/lib/i18n";

export function generateStaticParams() {
  // Slugs come from the canonical English tree; every locale shares them.
  return LOCALES.flatMap((locale) =>
    getLessons("guru", DEFAULT_LOCALE).map((l) => ({
      locale,
      slug: l.frontmatter.slug,
    })),
  );
}

export default async function GuruPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const lesson = getLesson("guru", slug, locale);
  if (!lesson) notFound();
  return <LessonLayout lesson={lesson} locale={locale} />;
}
