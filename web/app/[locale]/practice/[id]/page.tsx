import { notFound } from "next/navigation";
import Walkthrough from "@/components/practicals/Walkthrough";
import { renderAnalyzer } from "@/components/practicals/renderAnalyzer";
import { LOCALES, getStrings, isLocale } from "@/lib/i18n";
import { STRATEGIES, getStrategy } from "@/lib/strategies";
import { getWalkthrough } from "@/lib/walkthroughs";

// A strategy's hands-on capstone at /[locale]/practice/[id] (id = strategy id).
// This is the guided WALKTHROUGH (실습) — teaching that embeds the analyzer tool
// inside a source→fetch→compute→judge→conclude flow. If a lab doesn't have a
// walkthrough authored yet, we fall back to its standalone analyzer so the page
// is never empty.
export function generateStaticParams() {
  return LOCALES.flatMap((locale) =>
    STRATEGIES.filter((s) => s.practical).map((s) => ({ locale, id: s.id })),
  );
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  if (!isLocale(locale)) notFound();
  const strategy = getStrategy(id);
  if (!strategy?.practical) notFound();
  const t = getStrings(locale);

  const common = {
    locale,
    t: t.practical,
    strategyLabel: strategy.label[locale],
    strategyHref: `/${locale}/strategies/${strategy.id}`,
  };
  const analyzer = renderAnalyzer(strategy.practical, common);
  if (!analyzer) notFound();

  const walk = getWalkthrough(strategy.practical);
  if (!walk) return analyzer; // no walkthrough yet → show the tool alone

  return (
    <Walkthrough
      locale={locale}
      walk={walk}
      analyzer={analyzer}
      toolHref={`/${locale}/tools/${strategy.id}`}
      strategyLabel={strategy.label[locale]}
      strategyHref={common.strategyHref}
      disclaimer={t.practical.disclaimer}
    />
  );
}
