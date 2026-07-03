// Content-integrity guard. Fails (exit 1) if any invariant that a live re-audit
// found silently violated is broken again. Run: `npm run check:content`.
//
// Invariants:
//   1. Every strategy PathStep slug resolves to a real MDX lesson file — no
//      dead "coming soon" cards (a rename/typo would otherwise ship a dead card).
//   2. Every strategy path starts with the beginner primer (investing-basics)
//      and ends with the last-mile lesson (placing-your-first-trade).
//   3. Every <Quiz> in a lesson (EN and KO) has exactly one <Option correct>.
//      (A missing `correct` marks the intended answer wrong — the exact bug the
//      re-audit caught on options-basics.)
//
// Pure string parsing on purpose: no build, no TS toolchain, runs anywhere.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const STRATEGIES = path.join(ROOT, "lib", "strategies.ts");

const errors = [];
const err = (m) => errors.push(m);

// --- lesson file existence (English tree is canonical) ---
function lessonExists(kind, slug) {
  const sub = kind === "guru" ? "gurus" : "indicators";
  return fs.existsSync(path.join(CONTENT, sub, `${slug}.mdx`));
}

// --- parse strategy paths from strategies.ts ---
const src = fs.readFileSync(STRATEGIES, "utf8");

// Split into per-strategy blocks by the `id: "..."` + `rank:` header.
const idRe = /id:\s*"([^"]+)",\s*\n\s*rank:\s*\d+/g;
const heads = [...src.matchAll(idRe)].map((m) => ({ id: m[1], at: m.index }));
if (heads.length < 13) err(`Expected >=13 strategies, found ${heads.length}`);

const stepRe = /\b(guru|concept)\("([^"]+)"/g;

heads.forEach((h, i) => {
  const block = src.slice(h.at, i + 1 < heads.length ? heads[i + 1].at : src.length);
  const steps = [...block.matchAll(stepRe)].map((m) => ({
    kind: m[1] === "guru" ? "guru" : "indicator",
    slug: m[2],
  }));
  if (steps.length === 0) { err(`[${h.id}] no steps parsed`); return; }

  // 1. every step resolves
  for (const s of steps) {
    if (!lessonExists(s.kind, s.slug)) {
      err(`[${h.id}] dead step: ${s.kind}:${s.slug} — no content/${s.kind === "guru" ? "gurus" : "indicators"}/${s.slug}.mdx`);
    }
  }
  // 2. primer first, last-mile last
  if (steps[0].slug !== "investing-basics") {
    err(`[${h.id}] first step is "${steps[0].slug}", expected "investing-basics" (primer)`);
  }
  if (steps[steps.length - 1].slug !== "placing-your-first-trade") {
    err(`[${h.id}] last step is "${steps[steps.length - 1].slug}", expected "placing-your-first-trade" (last mile)`);
  }
});

// --- 3. every <Quiz> has exactly one <Option correct> ---
function checkQuizzes(dir, label) {
  if (!fs.existsSync(dir)) return;
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith(".mdx")) continue;
    const text = fs.readFileSync(path.join(dir, file), "utf8");
    // Split on <Quiz ...> ... </Quiz> blocks.
    const quizzes = text.match(/<Quiz[\s\S]*?<\/Quiz>/g) || [];
    quizzes.forEach((q, i) => {
      const correct = (q.match(/<Option\s+correct[\s>]/g) || []).length;
      const options = (q.match(/<Option[\s>]/g) || []).length;
      if (correct !== 1) {
        err(`[${label}/${file}] quiz #${i + 1} has ${correct} correct option(s) (need exactly 1; ${options} options total)`);
      }
    });
  }
}
checkQuizzes(path.join(CONTENT, "indicators"), "en/indicators");
checkQuizzes(path.join(CONTENT, "ko", "indicators"), "ko/indicators");

if (errors.length) {
  console.error(`✗ content-integrity: ${errors.length} problem(s)\n`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log("✓ content-integrity: strategy paths resolve, primer/last-mile in place, every quiz has one correct option.");
