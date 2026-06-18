import Link from "next/link";
import {
  getToc,
  getNeighbors,
  lessonHref,
  type Lesson,
} from "@/lib/content";
import Mdx from "./Mdx";

export default function LessonLayout({ lesson }: { lesson: Lesson }) {
  const fm = lesson.frontmatter;
  const toc = getToc(lesson.content);
  const { prev, next } = getNeighbors(fm.kind, fm.slug);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_16rem] lg:gap-10">
      <div className="min-w-0 space-y-6">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-wide text-teal-400">
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

        <nav className="flex items-stretch justify-between gap-4">
          {prev ? (
            <Link
              href={lessonHref(prev)}
              className="flex-1 rounded-lg border border-white/10 bg-[#131722] p-3 no-underline transition hover:border-teal-400/50"
            >
              <div className="text-xs text-gray-500">← Previous</div>
              <div className="text-sm font-semibold text-teal-300">
                {prev.frontmatter.title}
              </div>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={lessonHref(next)}
              className="flex-1 rounded-lg border border-white/10 bg-[#131722] p-3 text-right no-underline transition hover:border-teal-400/50"
            >
              <div className="text-xs text-gray-500">Next →</div>
              <div className="text-sm font-semibold text-teal-300">
                {next.frontmatter.title}
              </div>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>

        <Link href="/path" className="block text-sm no-underline">
          ← Back to the Learning Path
        </Link>
      </div>

      {toc.length > 0 && (
        <aside className="hidden lg:block">
          <div className="sticky top-6 space-y-2 text-sm">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              On this page
            </div>
            <ul className="space-y-1">
              {toc.map((t, i) => (
                <li key={i} className={t.depth === 3 ? "pl-3" : ""}>
                  <a
                    href={`#${t.id}`}
                    className="block text-gray-400 no-underline hover:text-teal-300"
                  >
                    {t.text}
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
