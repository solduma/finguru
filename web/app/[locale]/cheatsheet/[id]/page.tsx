import Link from "next/link";
import { notFound } from "next/navigation";
import { LOCALES, getStrings, isLocale, type Locale } from "@/lib/i18n";
import { STRATEGIES, getStrategy } from "@/lib/strategies";
import { getCheatsheet } from "@/lib/cheatsheets";
import Reveal from "@/components/Reveal";

// A <=1-page recall card for someone who COMPLETED a strategy path: what it is,
// tool-free execution steps, metric->where-to-find on a real source, pass/fail
// rules, and the biggest pitfall. Deliberately dense and print-friendly.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    STRATEGIES.filter((s) => getCheatsheet(s.id)).map((s) => ({
      locale,
      id: s.id,
    })),
  );
}

function Section({
  heading,
  items,
}: {
  heading: string;
  items: string[];
}) {
  return (
    <div className="space-y-1.5">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-teal-300">
        {heading}
      </h2>
      <ul className="space-y-1 text-sm text-gray-200">
        {items.map((it, i) => (
          <li key={i} className="leading-snug">
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function CheatsheetPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const strategy = getStrategy(id);
  const cs = getCheatsheet(id);
  if (!strategy || !cs) notFound();
  const t = getStrings(locale);
  const cc = t.cheatsheet;
  const L = (r: Record<Locale, string>) => r[locale];
  const LA = (r: Record<Locale, string[]>) => r[locale];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <Reveal index={0}>
        <div className="space-y-1">
          <Link
            href={`/${locale}/strategies/${strategy.id}`}
            className="text-sm text-gray-400 no-underline hover:text-teal-300"
          >
            {cc.back.replace("{s}", strategy.label[locale])}
          </Link>
          <div className="flex items-baseline justify-between gap-3">
            <h1 className="text-2xl font-bold text-white">{cs.title}</h1>
            <span className="flex-none text-xs uppercase tracking-wide text-gray-500">
              {cc.badge}
            </span>
          </div>
          <p className="text-sm text-gray-300">{L(cs.what)}</p>
        </div>
      </Reveal>

      {/* Dense two-column card so it stays within a page when printed. */}
      <Reveal>
        <div className="grid gap-5 rounded-lg border border-white/10 bg-[#131722] p-5 sm:grid-cols-2">
          <div className="space-y-5 sm:col-span-2">
            <Section heading={cc.steps} items={LA(cs.steps)} />
          </div>
          <Section heading={cc.data} items={LA(cs.data)} />
          <Section heading={cc.rules} items={LA(cs.rules)} />
          <div className="sm:col-span-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-amber-300">
              {cc.pitfall}
            </h2>
            <p className="mt-1.5 rounded-md border border-amber-400/30 bg-amber-400/5 p-3 text-sm text-amber-100">
              {L(cs.pitfall)}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <p className="text-xs text-gray-500">{cc.disclaimer}</p>
      </Reveal>
    </div>
  );
}
