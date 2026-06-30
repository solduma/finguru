// Regenerates components/photoManifest.ts from the image files in public/photos.
// photoExists(kind, slug) returns the file extension (truthy) or "" if absent.
// Run after downloading/removing photos: node scripts/gen-photo-manifest.mjs
import fs from "node:fs";

const kinds = ["guru", "indicator", "school", "strategy"];
const map = {};
for (const k of kinds) {
  const dir = `public/photos/${k}`;
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) {
    const m = f.match(/^(.+)\.(jpg|jpeg|png|webp|gif|svg)$/i);
    if (!m) continue;
    map[`${k}/${m[1]}`] = m[2].toLowerCase();
  }
}
const entries = Object.entries(map).sort(([a], [b]) => a.localeCompare(b));

const body =
  `// AUTO-GENERATED — do not edit by hand.\n` +
  `// Maps "<kind>/<slug>" -> file extension for each web-sourced photo under\n` +
  `// /public/photos/<kind>/<slug>.<ext>. Regenerate: node scripts/gen-photo-manifest.mjs\n` +
  `const PHOTOS: Record<string, string> = {\n` +
  entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`).join("\n") +
  (entries.length ? "\n" : "") +
  `};\n\n` +
  `/** Returns the photo's file extension (truthy) if one exists, else "". */\n` +
  `export function photoExists(kind: string, slug: string): string {\n` +
  `  return PHOTOS[\`\${kind}/\${slug}\`] ?? "";\n}\n`;

fs.writeFileSync("components/photoManifest.ts", body);
console.log(`wrote components/photoManifest.ts with ${entries.length} entries`);
