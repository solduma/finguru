import Link from "next/link";
import { getLessons } from "@/lib/content";

export default function Home() {
  const gurus = getLessons("guru");
  const indicators = getLessons("indicator");

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold text-white">
          Technical Analysis, from Beginner to Pro
        </h1>
        <p className="max-w-2xl text-lg text-gray-300">
          Learn the craft the way it was built — through the masters who
          invented it and the tools they left behind. Every lesson is plain
          enough for a newcomer and thorough enough for a professional. Stuck?
          The tutor in the corner is grounded in these very lessons.
        </p>
        <div className="flex gap-4 pt-2">
          <Link
            href="/path"
            className="rounded-md bg-teal-500 px-5 py-2 font-semibold text-black no-underline"
          >
            Start the Learning Path
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">The Gurus</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {gurus.map((l) => (
            <Link
              key={l.frontmatter.slug}
              href={`/gurus/${l.frontmatter.slug}`}
              className="rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
            >
              <div className="font-semibold text-teal-300">
                {l.frontmatter.title}
              </div>
              <div className="text-sm text-gray-400">
                {l.frontmatter.summary}
              </div>
            </Link>
          ))}
          {gurus.length === 0 && (
            <p className="text-gray-500">Guru lessons coming soon.</p>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold text-white">
          The Indicators &amp; Tools
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {indicators.map((l) => (
            <Link
              key={l.frontmatter.slug}
              href={`/indicators/${l.frontmatter.slug}`}
              className="rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
            >
              <div className="font-semibold text-teal-300">
                {l.frontmatter.title}
              </div>
              <div className="text-sm text-gray-400">
                {l.frontmatter.summary}
              </div>
            </Link>
          ))}
          {indicators.length === 0 && (
            <p className="text-gray-500">Indicator lessons coming soon.</p>
          )}
        </div>
      </section>
    </div>
  );
}
