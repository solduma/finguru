import Link from "next/link";
import { getLessons } from "@/lib/content";

export default function GurusIndex() {
  const gurus = getLessons("guru");
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">The Gurus</h1>
      <p className="text-gray-300">
        The people who built technical analysis — in roughly the order their
        ideas entered the field.
      </p>
      <div className="space-y-3">
        {gurus.map((l) => (
          <Link
            key={l.frontmatter.slug}
            href={`/gurus/${l.frontmatter.slug}`}
            className="block rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
          >
            <div className="font-semibold text-teal-300">
              {l.frontmatter.title}
            </div>
            {l.frontmatter.contribution && (
              <div className="text-xs uppercase tracking-wide text-gray-500">
                {l.frontmatter.contribution}
              </div>
            )}
            <div className="text-sm text-gray-400">{l.frontmatter.summary}</div>
          </Link>
        ))}
        {gurus.length === 0 && (
          <p className="text-gray-500">Guru lessons coming soon.</p>
        )}
      </div>
    </div>
  );
}
