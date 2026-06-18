import { notFound } from "next/navigation";
import { getLesson, getLessons } from "@/lib/content";
import LessonLayout from "@/components/LessonLayout";

export function generateStaticParams() {
  return getLessons("indicator").map((l) => ({ slug: l.frontmatter.slug }));
}

export default async function IndicatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson("indicator", slug);
  if (!lesson) notFound();
  return <LessonLayout lesson={lesson} />;
}
