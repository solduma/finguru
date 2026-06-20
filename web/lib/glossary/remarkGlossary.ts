import { visitParents } from "unist-util-visit-parents";
import type { Locale } from "@/lib/i18n";
import { GLOSSARY } from "./entries";
import type { GlossaryEntry } from "./types";

// Node types whose text must NOT be touched: headings, code, links (already
// interactive), and anything already inside a JSX element (chart captions,
// callouts authored as JSX, and our own injected terms).
const SKIP_PARENTS = new Set([
  "heading",
  "code",
  "inlineCode",
  "link",
  "linkReference",
  "mdxJsxTextElement",
  "mdxJsxFlowElement",
  "mdxFlowExpression",
  "mdxTextExpression",
]);

interface Compiled {
  entry: GlossaryEntry;
  // case-insensitive matcher for one surface form
  regex: RegExp;
}

/** Build the matcher list for a locale, longest surface form first so that
 *  e.g. "moving average" wins over "average". */
function compile(locale: Locale): Compiled[] {
  const out: Compiled[] = [];
  for (const entry of GLOSSARY) {
    const forms = locale === "ko" ? entry.matchKo ?? [] : entry.match;
    for (const form of forms) {
      out.push({ entry, regex: formRegex(form, locale) });
    }
  }
  // longest raw form first
  return out.sort((a, b) => b.regex.source.length - a.regex.source.length);
}

function escape(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Whole-word, case-insensitive match. Korean has no spaces between words and
 *  no case, so we match the bare form there; English uses \b word boundaries. */
function formRegex(form: string, locale: Locale): RegExp {
  const body = escape(form);
  if (locale === "ko") return new RegExp(body, "g");
  // \b doesn't behave for forms with leading/trailing non-word chars (e.g.
  // "+DM"), so guard with lookarounds on alphanumerics instead.
  return new RegExp(`(?<![A-Za-z0-9])${body}(?![A-Za-z0-9])`, "gi");
}

function makeTermNode(entry: GlossaryEntry, surface: string, locale: Locale) {
  return {
    type: "mdxJsxTextElement",
    name: "GlossaryTerm",
    attributes: [
      { type: "mdxJsxAttribute", name: "def", value: entry.def[locale] },
      { type: "mdxJsxAttribute", name: "label", value: entry.label[locale] },
    ],
    children: [{ type: "text", value: surface }],
  };
}

/**
 * remark plugin: wrap every occurrence of a known glossary term (per locale)
 * in a <GlossaryTerm> JSX node carrying the localized definition. Runs at
 * build time; the content MDX files are never modified.
 */
export function remarkGlossary(options: { locale: Locale }) {
  const matchers = compile(options.locale);

  return (tree: unknown) => {
    // collect first to avoid mutating while visiting
    const jobs: { node: any; parent: any }[] = [];

    visitParents(tree as any, "text", (node: any, ancestors: any[]) => {
      if (ancestors.some((a) => SKIP_PARENTS.has(a.type))) return;
      const parent = ancestors[ancestors.length - 1];
      if (!parent || !Array.isArray(parent.children)) return;
      jobs.push({ node, parent });
    });

    for (const { node, parent } of jobs) {
      const replacement = splitText(node.value, matchers, options.locale);
      if (replacement.length === 1 && replacement[0] === node) continue;
      const idx = parent.children.indexOf(node);
      if (idx === -1) continue;
      parent.children.splice(idx, 1, ...replacement);
    }
  };
}

/** Split one text string into a mix of plain text nodes and GlossaryTerm
 *  nodes. Each character position is claimed at most once (longest match
 *  first), so terms never overlap or double-wrap. */
function splitText(value: string, matchers: Compiled[], locale: Locale): any[] {
  // claimed[i] = entry that owns the span starting at i (with its length)
  type Hit = { start: number; end: number; entry: GlossaryEntry; surface: string };
  const hits: Hit[] = [];
  const taken = new Array(value.length).fill(false);

  for (const { entry, regex } of matchers) {
    regex.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = regex.exec(value))) {
      const start = m.index;
      const end = start + m[0].length;
      // skip if any char in this span is already claimed
      let free = true;
      for (let i = start; i < end; i++) if (taken[i]) { free = false; break; }
      if (free) {
        for (let i = start; i < end; i++) taken[i] = true;
        hits.push({ start, end, entry, surface: m[0] });
      }
      if (m[0].length === 0) regex.lastIndex++;
    }
  }

  if (hits.length === 0) return [{ type: "text", value }];
  hits.sort((a, b) => a.start - b.start);

  const out: any[] = [];
  let cursor = 0;
  for (const h of hits) {
    if (h.start > cursor) {
      out.push({ type: "text", value: value.slice(cursor, h.start) });
    }
    out.push(makeTermNode(h.entry, h.surface, locale));
    cursor = h.end;
  }
  if (cursor < value.length) {
    out.push({ type: "text", value: value.slice(cursor) });
  }
  return out;
}
