// Registry of practical "labs" — the hands-on capstone at the end of a strategy
// learning path (see docs/practical-modules-2026-07.md). A strategy opts in by
// setting `practical: <labId>` in lib/strategies.ts. The lab itself is an
// interactive client component rendered at /[locale]/practice/[id].
//
// Labs are intentionally few and shared: they all sit on one client-side
// backtest engine (lib/backtest.ts) over one static dataset. Phase 0 ships the
// portfolio backtester.

export type LabId = "portfolio";

export interface LabMeta {
  id: LabId;
  /** i18n key under `practical` for this lab's strings. */
  i18nKey: "portfolio";
}

export const LABS: Record<LabId, LabMeta> = {
  portfolio: { id: "portfolio", i18nKey: "portfolio" },
};

export function isLabId(x: string): x is LabId {
  return x in LABS;
}
