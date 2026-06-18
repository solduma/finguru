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
