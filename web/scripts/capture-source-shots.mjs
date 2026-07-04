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
//
// EDGAR statement pages: the human-facing browse/search HTML blocks headless
// chromium, but the ARCHIVED filing statement pages (the XBRL R-*.htm renders)
// serve fine to the firefox engine. We capture ONE such page (a real 10-K cash-
// flow statement) at low volume with a descriptive, contactable User-Agent, per
// SEC's fair-access guidance. Keep it that way — one page, rarely, declared UA.
import { chromium, firefox } from "playwright";
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
    // INSIDE a filing: navigate the document TOC to the consolidated cash-flow
    // statement, where FCF (영업활동현금흐름 − 유형자산의 취득) and dividends paid
    // (배당금의 지급) actually live. Uses a real, public Samsung 2023 사업보고서.
    // Tall viewport so the operating + investing + financing lines all fit.
    name: "dart-cashflow",
    ua: CHROME_UA,
    viewport: { width: 1280, height: 1500 },
    async run(page) {
      await page.goto(
        "https://dart.fss.or.kr/dsaf001/main.do?rcpNo=20240312000736",
        { waitUntil: "domcontentloaded" },
      );
      await page.waitForTimeout(3500);
      await page.locator('a:has-text("연결 현금흐름표")').first().click();
      await page.waitForTimeout(3500);
    },
  },
  {
    // The US counterpart of dart-cashflow: a real 10-K Consolidated Statements
    // of Cash Flows (Apple FY2023 XBRL R-page). Uses the firefox engine + a
    // descriptive UA because SEC blocks headless chromium on its human pages.
    // Low volume, declared UA — respect SEC fair access.
    name: "edgar-cashflow",
    engine: "firefox",
    ua: "finguru-educational-capture contact@example.com",
    viewport: { width: 1280, height: 1000 },
    async run(page) {
      await page.goto(
        "https://www.sec.gov/Archives/edgar/data/320193/000032019323000106/R8.htm",
        { waitUntil: "domcontentloaded" },
      );
      await page.waitForTimeout(1200);
      const h = await page.evaluate(() => document.documentElement.scrollHeight);
      await page.setViewportSize({ width: 1280, height: Math.min(h + 20, 1000) });
      await page.waitForTimeout(300);
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
const ENGINES = { chromium, firefox }; // most shots use chromium; EDGAR uses firefox
const launched = {}; // lazily launch each engine once
let ok = 0;
for (const shot of SHOTS) {
  if (only && shot.name !== only) continue;
  const engineName = shot.engine ?? "chromium";
  const engine = ENGINES[engineName];
  launched[engineName] ??= await engine.launch();
  const ctx = await launched[engineName].newContext({ viewport: shot.viewport ?? VIEWPORT, userAgent: shot.ua });
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
for (const b of Object.values(launched)) await b.close();
console.log(`\n${ok}/${only ? 1 : SHOTS.length} captured → ${OUT}`);
