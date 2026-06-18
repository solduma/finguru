import Link from "next/link";
import { getLearningPath } from "@/lib/content";

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

export default function PathPage() {
  const path = getLearningPath();
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">The Learning Path</h1>
      <p className="max-w-2xl text-gray-300">
        Follow this sequence start to finish and you&apos;ll move from
        &ldquo;what is a chart?&rdquo; to reading markets like the
        professionals. Each step builds on the last.
      </p>
      <ol className="space-y-3">
        {path.map((l, i) => (
          <li key={`${l.frontmatter.kind}-${l.frontmatter.slug}`}>
            <Link
              href={`/${l.frontmatter.kind === "guru" ? "gurus" : "indicators"}/${l.frontmatter.slug}`}
              className="flex items-start gap-4 rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
            >
              <span className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-teal-500 text-sm font-bold text-black">
                {i + 1}
              </span>
              <span>
                <span className="font-semibold text-teal-300">
                  {l.frontmatter.title}
                </span>
                <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">
                  {LEVEL_LABEL[l.frontmatter.level] ?? l.frontmatter.level}
                </span>
                <span className="block text-sm text-gray-400">
                  {l.frontmatter.summary}
                </span>
              </span>
            </Link>
          </li>
        ))}
        {path.length === 0 && (
          <p className="text-gray-500">Lessons coming soon.</p>
        )}
      </ol>
    </div>
  );
}
