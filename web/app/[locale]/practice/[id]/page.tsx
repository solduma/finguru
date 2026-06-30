import { notFound } from "next/navigation";
import PortfolioLab from "@/components/practicals/PortfolioLab";
import CostDragLab from "@/components/practicals/CostDragLab";
import GlidePathLab from "@/components/practicals/GlidePathLab";
import CompanyLab from "@/components/practicals/CompanyLab";
import TradeLab from "@/components/practicals/TradeLab";
import MacroLab from "@/components/practicals/MacroLab";
import { LOCALES, getStrings, isLocale } from "@/lib/i18n";
import { STRATEGIES, getStrategy } from "@/lib/strategies";
import { companyModeFor, tradeModeFor } from "@/lib/practicals";

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
    case "cost-drag":
      return <CostDragLab {...common} />;
    case "glide-path":
      return <GlidePathLab {...common} />;
    case "company-dividend":
    case "company-value":
    case "company-growth":
    case "company-reit": {
      const cmode = companyModeFor(strategy.practical);
      if (!cmode) notFound();
      return <CompanyLab {...common} mode={cmode} />;
    }
    case "trend-backtest":
    case "active-trading": {
      const tmode = tradeModeFor(strategy.practical);
      if (!tmode) notFound();
      return <TradeLab {...common} mode={tmode} />;
    }
    case "macro":
      return <MacroLab {...common} />;
    default:
      notFound();
  }
}
