import Link from "next/link";
import type { Lesson } from "@/lib/content";
import Mdx from "./Mdx";

export default function LessonLayout({ lesson }: { lesson: Lesson }) {
  const fm = lesson.frontmatter;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-teal-400">
          <span>{fm.kind}</span>
          <span>•</span>
          <span>{fm.level}</span>
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
            Recommended first: {fm.prereqs.join(", ")}
          </p>
        )}
      </div>

      <hr className="border-white/10" />

      <Mdx source={lesson.content} />

      <hr className="border-white/10" />
      <Link href="/path" className="text-sm no-underline">
        ← Back to the Learning Path
      </Link>
    </div>
  );
}
