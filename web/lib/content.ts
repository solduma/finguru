import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { DEFAULT_LOCALE, type Locale } from "./i18n";

export type LessonKind = "guru" | "indicator";

export interface LessonFrontmatter {
  title: string;
  slug: string;
  kind: LessonKind;
  level: "beginner" | "intermediate" | "advanced";
  order: number; // position in the learning path
  summary: string;
  tags?: string[];
  prereqs?: string[]; // slugs of recommended prior lessons
  // Guru-specific (optional)
  era?: string;
  contribution?: string;
  // Investment-school taxonomy (optional; see lib/schools.ts). Lessons without
  // these still appear in /gurus and /path — they're just absent from /schools.
  school?: string; // SchoolId: "technical" | "fundamental" | "quant" | "macro"
  strategy?: string; // sub-strategy id within that school
}

export interface Lesson {
  frontmatter: LessonFrontmatter;
  content: string; // raw MDX body
  // True when a non-default locale was requested but only English exists,
  // so the page can show a "not translated yet" notice.
  fellBackToDefault?: boolean;
}

const CONTENT_ROOT = path.join(process.cwd(), "content");

// English lives at content/<sub>; other locales at content/<locale>/<sub>.
function localeDir(locale: Locale): string {
  return locale === DEFAULT_LOCALE
    ? CONTENT_ROOT
    : path.join(CONTENT_ROOT, locale);
}

function subFor(kind: LessonKind): string {
  return kind === "guru" ? "gurus" : "indicators";
}

function parseFile(file: string): Lesson {
  const raw = fs.readFileSync(file, "utf-8");
  const { data, content } = matter(raw);
  return { frontmatter: data as LessonFrontmatter, content };
}

function readDir(kind: LessonKind, locale: Locale): Lesson[] {
  // Canonical set of lessons is defined by the English tree, so ordering and
  // availability stay consistent across locales.
  const enDir = path.join(localeDir(DEFAULT_LOCALE), subFor(kind));
  if (!fs.existsSync(enDir)) return [];
  const locDir = path.join(localeDir(locale), subFor(kind));

  return fs
    .readdirSync(enDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const localized = path.join(locDir, file);
      if (locale !== DEFAULT_LOCALE && fs.existsSync(localized)) {
        return parseFile(localized);
      }
      const lesson = parseFile(path.join(enDir, file));
      if (locale !== DEFAULT_LOCALE) lesson.fellBackToDefault = true;
      return lesson;
    });
}

export function getLessons(kind: LessonKind, locale: Locale): Lesson[] {
  return readDir(kind, locale).sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );
}

export function getLesson(
  kind: LessonKind,
  slug: string,
  locale: Locale,
): Lesson | null {
  return getLessons(kind, locale).find((l) => l.frontmatter.slug === slug) ?? null;
}

/** All lessons across kinds, ordered as the full beginner->pro learning path. */
export function getLearningPath(locale: Locale): Lesson[] {
  return [...getLessons("guru", locale), ...getLessons("indicator", locale)].sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );
}

export interface TocEntry {
  depth: number; // 2 = h2, 3 = h3
  text: string;
  id: string; // slugified anchor (matches rehype-slug)
}

/** Slugify a heading to match rehype-slug (github-slugger).
 * github-slugger strips special chars then replaces EACH whitespace char with a
 * dash (using /\s/g, not /\s+/g), so "a — b" -> "a--b". We mirror that exactly so
 * TOC anchors line up with the rendered heading ids. Note: github-slugger keeps
 * non-ASCII word characters (incl. Hangul), so \w with the unicode-aware strip
 * below preserves Korean headings. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s/g, "-");
}

/** Extract h2/h3 headings from MDX body for an on-page table of contents. */
export function getToc(content: string): TocEntry[] {
  const toc: TocEntry[] = [];
  let inFence = false;
  for (const line of content.split("\n")) {
    if (line.trim().startsWith("```")) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.*)$/.exec(line);
    if (m) {
      const text = m[2].replace(/[*`]/g, "").trim();
      toc.push({ depth: m[1].length, text, id: slugify(text) });
    }
  }
  return toc;
}

export interface PathNeighbors {
  prev: Lesson | null;
  next: Lesson | null;
}

/** The previous/next lesson in the learning path for prev/next navigation. */
export function getNeighbors(
  kind: LessonKind,
  slug: string,
  locale: Locale,
): PathNeighbors {
  const order = getLearningPath(locale);
  const i = order.findIndex(
    (l) => l.frontmatter.kind === kind && l.frontmatter.slug === slug,
  );
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? order[i - 1] : null,
    next: i < order.length - 1 ? order[i + 1] : null,
  };
}

export function lessonHref(l: Lesson, locale: Locale): string {
  const sub = l.frontmatter.kind === "guru" ? "gurus" : "indicators";
  return `/${locale}/${sub}/${l.frontmatter.slug}`;
}

/** Every lesson (gurus + indicators) that declares the given school, in path
 * order. Used by the /schools pages, which group these by `strategy`. */
export function getLessonsForSchool(school: string, locale: Locale): Lesson[] {
  return getLearningPath(locale).filter(
    (l) => l.frontmatter.school === school,
  );
}
