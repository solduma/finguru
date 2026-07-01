// Capture real, annotatable screenshots of each data source's key views, so the
// walkthroughs can SHOW the learner where to click and what to read — not just
// link out. Run manually (sites change): `node scripts/capture-source-shots.mjs`.
// Output → web/public/walkthroughs/<name>.png. Playwright is a devDependency;
// nothing here ships to the client (the PNGs do).
//
// NOTE on SEC EDGAR: it actively blocks automated/headless access ("Your
// Request Originates from an Undeclared Automated Tool" / rate-threshold pages),
// regardless of User-Agent. Capturing it would fight SEC's stated access
// policy, so the EDGAR source step uses a written navigation guide instead of a
// screenshot. All other sources capture cleanly.
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "walkthroughs");
const VIEWPORT = { width: 1280, height: 900 };
const CHROME_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

/** Each entry: a source that produces one screenshot. `run(page)` navigates and
 *  leaves the page on the view to shoot. Optional `clip` restricts the region. */
const SHOTS = [
  {
    name: "dart-home",
    ua: CHROME_UA,
    async run(page) {
      await page.goto("https://dart.fss.or.kr", { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(2500);
    },
  },
  {
    name: "fred-spread",
    ua: CHROME_UA,
    async run(page) {
      await page.goto("https://fred.stlouisfed.org/series/T10Y3M", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(3500);
    },
  },
  {
    name: "yahoo-history",
    ua: CHROME_UA,
    async run(page) {
      await page.goto("https://finance.yahoo.com/quote/SPY/history", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(3500);
      // Dismiss the consent dialog if present (EU-style).
      const consent = page.locator('button:has-text("Accept all"), button[name="agree"]');
      if (await consent.first().isVisible().catch(() => false)) {
        await consent.first().click().catch(() => {});
        await page.waitForTimeout(1500);
      }
    },
  },
  {
    name: "french-library",
    ua: CHROME_UA,
    async run(page) {
      await page.goto(
        "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html",
        { waitUntil: "domcontentloaded" },
      );
      await page.waitForTimeout(2000);
    },
  },
  {
    name: "cboe-bxm",
    ua: CHROME_UA,
    async run(page) {
      await page.goto("https://www.cboe.com/us/indices/dashboard/bxm/", {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(3500);
    },
  },
];

const only = process.argv[2]; // optional: capture just one by name
const browser = await chromium.launch();
let ok = 0;
for (const shot of SHOTS) {
  if (only && shot.name !== only) continue;
  const ctx = await browser.newContext({ viewport: VIEWPORT, userAgent: shot.ua });
  const page = await ctx.newPage();
  try {
    await shot.run(page);
    await page.screenshot({ path: join(OUT, `${shot.name}.png`), clip: shot.clip });
    console.log(`✓ ${shot.name}`);
    ok++;
  } catch (e) {
    console.log(`✗ ${shot.name}: ${e.message.split("\n")[0]}`);
  }
  await ctx.close();
}
await browser.close();
console.log(`\n${ok}/${only ? 1 : SHOTS.length} captured → ${OUT}`);
