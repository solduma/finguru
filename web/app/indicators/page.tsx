import Link from "next/link";
import { getLessons } from "@/lib/content";

export default function IndicatorsIndex() {
  const indicators = getLessons("indicator");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Indicators &amp; Tools</h1>
      <p className="text-gray-300">
        The instruments of the trade — what each one measures, how to read it,
        and where it misleads you.
      </p>
      <div className="space-y-3">
        {indicators.map((l) => (
          <Link
            key={l.frontmatter.slug}
            href={`/indicators/${l.frontmatter.slug}`}
            className="block rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
          >
            <div className="font-semibold text-teal-300">
              {l.frontmatter.title}
            </div>
            <div className="text-sm text-gray-400">{l.frontmatter.summary}</div>
          </Link>
        ))}
        {indicators.length === 0 && (
          <p className="text-gray-500">Indicator lessons coming soon.</p>
        )}
      </div>
    </div>
  );
}
