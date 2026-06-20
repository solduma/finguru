import type { Locale } from "@/lib/i18n";

/** One glossary entry. `match` lists every surface form (case-insensitive,
 *  whole-word) that should trigger the tooltip for this term. The first form
 *  is also the canonical display label used in the popover header. */
export interface GlossaryEntry {
  /** stable id, kebab-case */
  id: string;
  /** surface forms to match in EN prose (longest-first matching is applied) */
  match: string[];
  /** surface forms to match in KO prose */
  matchKo?: string[];
  /** short label shown in the popover header (per locale) */
  label: Record<Locale, string>;
  /** plain-language definition shown in the popover (per locale) */
  def: Record<Locale, string>;
}
