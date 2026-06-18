import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

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
}

export interface Lesson {
  frontmatter: LessonFrontmatter;
  content: string; // raw MDX body
}

const CONTENT_DIR = path.join(process.cwd(), "content");

function readDir(kind: LessonKind): Lesson[] {
  const dir = path.join(CONTENT_DIR, kind === "guru" ? "gurus" : "indicators");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return { frontmatter: data as LessonFrontmatter, content };
    });
}

export function getLessons(kind: LessonKind): Lesson[] {
  return readDir(kind).sort(
    (a, b) => a.frontmatter.order - b.frontmatter.order,
  );
}

export function getLesson(kind: LessonKind, slug: string): Lesson | null {
  return getLessons(kind).find((l) => l.frontmatter.slug === slug) ?? null;
}

/** All lessons across kinds, ordered as the full beginner->pro learning path. */
export function getLearningPath(): Lesson[] {
  return [...getLessons("guru"), ...getLessons("indicator")].sort(
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
 * TOC anchors line up with the rendered heading ids. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
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
export function getNeighbors(kind: LessonKind, slug: string): PathNeighbors {
  const path = getLearningPath();
  const i = path.findIndex(
    (l) => l.frontmatter.kind === kind && l.frontmatter.slug === slug,
  );
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? path[i - 1] : null,
    next: i < path.length - 1 ? path[i + 1] : null,
  };
}

export function lessonHref(l: Lesson): string {
  return `/${l.frontmatter.kind === "guru" ? "gurus" : "indicators"}/${l.frontmatter.slug}`;
}
