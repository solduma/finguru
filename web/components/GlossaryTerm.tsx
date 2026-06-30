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
      {/* Mobile-first: a bottom-anchored sheet pinned to safe viewport insets so
          it can NEVER overflow the right edge (a right-margin term's centered
          popover used to widen the layout viewport, zooming the whole page out).
          From `sm:` up it reverts to the classic centered popover above the term. */}
      <span
        role="tooltip"
        className="pointer-events-none fixed inset-x-3 bottom-3 z-50 w-auto rounded-lg border border-teal-400/30 bg-[#0b0e14] px-3 py-2 text-left text-sm font-normal not-italic leading-snug text-gray-200 opacity-0 shadow-xl transition-opacity duration-[var(--motion-duration-fast)] group-hover:opacity-100 group-focus-within:opacity-100 sm:absolute sm:inset-x-auto sm:bottom-full sm:left-1/2 sm:mb-2 sm:w-64 sm:max-w-[80vw] sm:-translate-x-1/2"
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
