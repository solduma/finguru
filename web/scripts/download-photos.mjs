// Downloads web-sourced cover images from a workflow results JSON into
// public/photos/<kind>/<slug>.<ext>, validating each is a real raster/SVG image.
// Usage:  node scripts/download-photos.mjs /tmp/photo-results.json
//   FORCE=1 ...  re-download even if a file already exists (e.g. replacing the
//                set with a different source). Default is idempotent (skip gaps).
import fs from "node:fs";
import { execFileSync } from "node:child_process";

const resultsPath = process.argv[2] || "/tmp/photo-results.json";
const FORCE = process.env.FORCE === "1";
const data = JSON.parse(fs.readFileSync(resultsPath, "utf-8"));
const items = data.results || data; // accept {results:[...]} or [...]

// Wikimedia's User-Agent policy blocks generic browser UAs (→ 429) but allows a
// descriptive bot UA with contact info. Send it both ways.
const UA = "FinGuruCoverBot/1.0 (educational site cover images; contact@finguru.local)";
const API_UA = "FinGuruCoverBot/1.0 (educational; contact@finguru.local)";
const CURL_HDR = ["-H", `Api-User-Agent: ${API_UA}`];
const extFromUrl = (u) => {
  const m = String(u).split("?")[0].match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
  return m ? m[1].toLowerCase().replace("jpeg", "jpg") : "";
};

const sleepMs = (ms) => { const e = Date.now() + ms; while (Date.now() < e) {} };

function httpCode(url) {
  try {
    return execFileSync("curl", ["-sL", "-o", "/dev/null", "-w", "%{http_code}", "--max-time", "20", "-A", UA, ...CURL_HDR, url], { encoding: "utf-8" }).trim();
  } catch { return "000"; }
}

function tryDownload(url, dest) {
  if (!url) return false;
  // Wikimedia rate-limits aggressive clients (HTTP 429). Probe, and back off
  // and retry on 429/5xx before giving up.
  let okStatus = false;
  for (let attempt = 0; attempt < 4; attempt++) {
    const code = httpCode(url);
    if (code === "429" || code.startsWith("5")) {
      const wait = 3000 * (attempt + 1);
      console.log(`  ${code} on ${url} — backing off ${wait}ms`);
      sleepMs(wait);
      continue;
    }
    okStatus = code === "200";
    break;
  }
  if (!okStatus) return false;
  try {
    execFileSync("curl", ["-sL", "--max-time", "30", "-A", UA, ...CURL_HDR, "-o", dest, url], { stdio: "ignore" });
  } catch { return false; }
  if (!fs.existsSync(dest) || fs.statSync(dest).size < 1024) return false;
  // Validate: real image bytes, not an HTML error page.
  let info = "";
  try { info = execFileSync("file", ["-b", dest], { encoding: "utf-8" }); } catch {}
  const ok = /image|bitmap|PNG|JPEG|SVG|Scalable|GIF|Web\/P|WebP/i.test(info);
  if (!ok) { fs.rmSync(dest, { force: true }); return false; }
  sleepMs(400); // be polite between successful downloads
  return true;
}

const existsAny = (dir, slug) =>
  ["jpg", "png", "webp", "gif", "svg"].some((e) => fs.existsSync(`${dir}/${slug}.${e}`));

let okCount = 0, failCount = 0, skipCount = 0;
const failures = [];
for (const it of items) {
  if (!it || !it.kind || !it.slug) continue;
  const dir = `public/photos/${it.kind}`;
  fs.mkdirSync(dir, { recursive: true });
  // Idempotent by default: skip slugs already present so re-runs only fetch
  // gaps. FORCE=1 re-downloads everything (e.g. swapping the whole image set).
  if (!FORCE && existsAny(dir, it.slug)) { skipCount++; continue; }
  const candidates = [it.imageUrl, it.fallbackUrl].filter(Boolean);
  let done = false;
  for (const url of candidates) {
    const ext = extFromUrl(url) || "jpg";
    const dest = `${dir}/${it.slug}.${ext}`;
    if (tryDownload(url, dest)) {
      // remove any other-extension duplicates for this slug
      for (const e of ["jpg","png","webp","gif","svg"]) {
        const other = `${dir}/${it.slug}.${e}`;
        if (e !== ext && fs.existsSync(other)) fs.rmSync(other);
      }
      okCount++; done = true;
      console.log(`OK   ${it.kind}/${it.slug} <- ${url}`);
      break;
    }
  }
  if (!done) { failCount++; failures.push(`${it.kind}/${it.slug}`); console.log(`FAIL ${it.kind}/${it.slug}`); }
}
console.log(`\nDownloaded ${okCount}, skipped ${skipCount} (already present), failed ${failCount}`);
if (failures.length) console.log("Missing:", failures.join(", "));
