// Regenerates components/coverManifest.ts from the SVG files in public/covers.
// Run after adding/removing any cover: node scripts/gen-cover-manifest.mjs
import fs from "node:fs";

const kinds = ["guru", "indicator", "school", "strategy"];
const set = [];
for (const k of kinds) {
  const dir = `public/covers/${k}`;
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir).filter((f) => f.endsWith(".svg"))) {
    set.push(`${k}/${f.replace(/\.svg$/, "")}`);
  }
}
set.sort();

const body =
  `// AUTO-GENERATED — do not edit by hand.\n` +
  `// Lists every bespoke cover that exists under /public/covers/<kind>/<slug>.svg.\n` +
  `// Regenerate with: node scripts/gen-cover-manifest.mjs\n` +
  `export const COVERS = new Set<string>([\n` +
  set.map((s) => `  ${JSON.stringify(s)},`).join("\n") +
  `\n]);\n\n` +
  `export function coverExists(kind: string, slug: string): boolean {\n` +
  `  return COVERS.has(\`\${kind}/\${slug}\`);\n}\n`;

fs.writeFileSync("components/coverManifest.ts", body);
console.log(`wrote components/coverManifest.ts with ${set.length} entries`);
