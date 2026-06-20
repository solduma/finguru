import type { ReactNode } from "react";

/**
 * An inline glossary term with a hover/focus dictionary popover.
 *
 * Pure-CSS: the popover shows on `group-hover` / `group-focus-within` and
 * closes automatically when the pointer leaves (or focus blurs) — no client
 * JS, so this stays a server component even when a page has hundreds of them.
 * `tabIndex` + `focus-within` make it work for keyboard and touch (tap) too.
 *
 * Props are injected at build time by the remarkGlossary plugin, so the
 * correct-language definition is baked into the static HTML.
 */
export default function GlossaryTerm({
  def,
  label,
  children,
}: {
  def: string;
  label?: string;
  children: ReactNode;
}) {
  return (
    <span
      tabIndex={0}
      className="gloss group relative inline cursor-help border-b border-dotted border-teal-400/70 outline-none"
    >
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 w-64 max-w-[80vw] -translate-x-1/2 rounded-lg border border-teal-400/30 bg-[#0b0e14] px-3 py-2 text-left text-sm font-normal not-italic leading-snug text-gray-200 opacity-0 shadow-xl transition-opacity duration-150 group-hover:opacity-100 group-focus-within:opacity-100"
      >
        {label && (
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-teal-300">
            {label}
          </span>
        )}
        {def}
      </span>
    </span>
  );
}
