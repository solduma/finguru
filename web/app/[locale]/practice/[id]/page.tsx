import { notFound } from "next/navigation";
import PortfolioLab from "@/components/practicals/PortfolioLab";
import { LOCALES, getStrings, isLocale } from "@/lib/i18n";
import { STRATEGIES, getStrategy } from "@/lib/strategies";

// A strategy's hands-on capstone lab lives at /[locale]/practice/[id], where id
// is the strategy id. The strategy declares which lab via its `practical` field
// (lib/strategies.ts → lib/practicals.ts). Phase 0 ships the portfolio lab.
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
  switch (strategy.practical) {
    case "portfolio":
      return <PortfolioLab {...common} />;
    default:
      notFound();
  }
}
