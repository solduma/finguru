import type { ReactNode } from "react";
import PortfolioLab from "@/components/practicals/PortfolioLab";
import CostDragLab from "@/components/practicals/CostDragLab";
import GlidePathLab from "@/components/practicals/GlidePathLab";
import CompanyLab from "@/components/practicals/CompanyLab";
import TradeLab from "@/components/practicals/TradeLab";
import MacroLab from "@/components/practicals/MacroLab";
import OptionsLab from "@/components/practicals/OptionsLab";
import FactorLab from "@/components/practicals/FactorLab";
import DealLab from "@/components/practicals/DealLab";
import type { Locale, Dict } from "@/lib/i18n";
import { companyModeFor, tradeModeFor, type LabId } from "@/lib/practicals";

// Single source of truth for "given a labId, render its analyzer tool". Used by
// both the standalone /tools/[id] page and the walkthrough's tool step, so the
// two never drift.
export function renderAnalyzer(
  labId: LabId,
  common: {
    locale: Locale;
    t: Dict["practical"];
    strategyLabel: string;
    strategyHref: string;
  },
): ReactNode {
  switch (labId) {
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
      const cmode = companyModeFor(labId);
      return cmode ? <CompanyLab {...common} mode={cmode} /> : null;
    }
    case "trend-backtest":
    case "active-trading": {
      const tmode = tradeModeFor(labId);
      return tmode ? <TradeLab {...common} mode={tmode} /> : null;
    }
    case "macro":
      return <MacroLab {...common} />;
    case "options":
      return <OptionsLab {...common} />;
    case "factor":
      return <FactorLab {...common} />;
    case "deal":
      return <DealLab {...common} />;
    default:
      return null;
  }
}
