import { notFound } from "next/navigation";
import { LOCALES, getStrings, isLocale } from "@/lib/i18n";
import { STRATEGIES, getStrategy } from "@/lib/strategies";
import { renderAnalyzer } from "@/components/practicals/renderAnalyzer";

// Standalone Analyzer tool at /[locale]/tools/[id] (id = strategy id). This is
// the calculator on its own — the walkthrough (/practice/[id]) embeds the same
// tool inside its teaching flow, but power users can jump straight here.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    STRATEGIES.filter((s) => s.practical).map((s) => ({ locale, id: s.id })),
  );
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const strategy = getStrategy(id);
  if (!strategy?.practical) notFound();
  const t = getStrings(locale);

  const analyzer = renderAnalyzer(strategy.practical, {
    locale,
    t: t.practical,
    strategyLabel: strategy.label[locale],
    strategyHref: `/${locale}/strategies/${strategy.id}`,
  });
  if (!analyzer) notFound();
  return analyzer;
}
