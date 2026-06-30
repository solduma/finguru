// Registry of practical "labs" — the hands-on capstone at the end of a strategy
// learning path (see docs/practical-modules-2026-07.md). A strategy opts in by
// setting `practical: <labId>` in lib/strategies.ts. The lab itself is an
// interactive client component rendered at /[locale]/practice/[id].
//
// Labs are intentionally few and shared: they all sit on one client-side
// backtest engine (lib/backtest.ts) over one static dataset. Phase 0+1 ship the
// three allocation labs — preset comparison, cost-drag, and glide path — each a
// different front-end on the same engine.

export type LabId = "portfolio" | "cost-drag" | "glide-path";

export interface LabMeta {
  id: LabId;
  /** i18n key under `practical` for this lab's strings. */
  i18nKey: "portfolio" | "costDrag" | "glidePath";
}

export const LABS: Record<LabId, LabMeta> = {
  portfolio: { id: "portfolio", i18nKey: "portfolio" },
  "cost-drag": { id: "cost-drag", i18nKey: "costDrag" },
  "glide-path": { id: "glide-path", i18nKey: "glidePath" },
};

export function isLabId(x: string): x is LabId {
  return x in LABS;
}
