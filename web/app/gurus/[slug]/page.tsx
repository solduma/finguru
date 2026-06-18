import { notFound } from "next/navigation";
import { getLesson, getLessons } from "@/lib/content";
import LessonLayout from "@/components/LessonLayout";

export function generateStaticParams() {
  return getLessons("guru").map((l) => ({ slug: l.frontmatter.slug }));
}

export default async function GuruPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLesson("guru", slug);
  if (!lesson) notFound();
  return <LessonLayout lesson={lesson} />;
}
