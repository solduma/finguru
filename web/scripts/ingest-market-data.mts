/**
 * Build-time market-data ingestion (Phase 0 — D1 asset-class returns).
 *
 * Fetches two free, redistribution-friendly long-run datasets, merges them by
 * calendar year, and writes web/lib/data/asset-returns.json — the static dataset
 * the client-side backtest engine (lib/backtest.ts) runs on. No runtime API
 * dependency, no licensing exposure (we ship derived annual returns, not raw feeds).
 *
 *   - Aswath Damodaran's "Historical Returns" (annual total returns 1928→, NYU Stern):
 *     S&P 500, US small-cap, 3-mo T-Bill, 10-yr T-Bond, Baa corporate, real estate, gold.
 *   - Minneapolis Fed Consumer Price Index (annual CPI level + inflation, 1913→).
 *
 * Run: cd web && npx tsx scripts/ingest-market-data.mts
 * Re-run when refreshing the data (commit the updated JSON, same spirit as RAG ingest).
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "lib", "data", "asset-returns.json");

const DAMODARAN_URL =
  "https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/histretSP.html";
const CPI_URL =
  "https://www.minneapolisfed.org/about-us/monetary-policy/inflation-calculator/consumer-price-index-1913-";

// Asset keys, in the column order Damodaran's return table exposes them.
// These keys are the contract the backtest engine + PortfolioLab presets use.
const ASSET_KEYS = [
  "usStocks", // S&P 500 (incl. dividends)
  "usSmallCap", // US small cap (bottom decile)
  "tBill", // 3-month T-Bill (≈ cash / risk-free)
  "tBond", // US 10-year Treasury bond
  "baaCorp", // Baa corporate bond
  "realEstate", // Real estate
  "gold", // Gold
] as const;
type AssetKey = (typeof ASSET_KEYS)[number];

interface YearRow {
  year: number;
  /** Total return for the year as a decimal (0.1 = +10%). */
  returns: Partial<Record<AssetKey, number>>;
  /** CPI inflation for the year as a decimal, when available. */
  inflation?: number;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "finguru-ingest/0.1 (educational)" },
  });
  if (!res.ok) throw new Error(`fetch ${url} → HTTP ${res.status}`);
  return res.text();
}

/** Strip tags, unescape a handful of entities, collapse whitespace. */
function clean(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&#36;/g, "$")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function rows(html: string): string[] {
  return html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) ?? [];
}

function cells(row: string): string[] {
  return (row.match(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi) ?? []).map((c) =>
    clean(c.replace(/^<t[dh][^>]*>/i, "").replace(/<\/t[dh]>$/i, "")),
  );
}

/** Parse "43.81%" / "2.9%" / "(1.2%)" → 0.4381 / 0.029 / -0.012. Blank → null. */
function pct(s: string | undefined): number | null {
  if (!s) return null;
  const neg = /^\(.*\)$/.test(s.trim());
  const m = s.replace(/[(),$\s]/g, "").match(/-?\d+(\.\d+)?/);
  if (!m) return null;
  const v = parseFloat(m[0]) / 100;
  return neg ? -v : v;
}

async function parseDamodaran(): Promise<Map<number, Partial<Record<AssetKey, number>>>> {
  const html = await fetchText(DAMODARAN_URL);
  const out = new Map<number, Partial<Record<AssetKey, number>>>();
  for (const r of rows(html)) {
    const c = cells(r);
    if (!/^(19|20)\d\d$/.test(c[0] ?? "")) continue;
    const year = parseInt(c[0], 10);
    const rec: Partial<Record<AssetKey, number>> = {};
    // Columns 1..7 are the per-year returns (cols 8+ are cumulative-value columns).
    ASSET_KEYS.forEach((key, i) => {
      const v = pct(c[i + 1]);
      if (v != null) rec[key] = v;
    });
    if (rec.usStocks != null) out.set(year, rec);
  }
  return out;
}

async function parseCpi(): Promise<Map<number, number>> {
  const html = await fetchText(CPI_URL);
  const out = new Map<number, number>();
  for (const r of rows(html)) {
    const c = cells(r);
    if (!/^(19|20)\d\d$/.test(c[0] ?? "")) continue;
    const infl = pct(c[2]); // 3rd column is the annual inflation %
    if (infl != null) out.set(parseInt(c[0], 10), infl);
  }
  return out;
}

async function main() {
  console.log("Fetching Damodaran historical returns …");
  const returns = await parseDamodaran();
  console.log(`  → ${returns.size} year-rows of asset returns`);

  console.log("Fetching Minneapolis Fed CPI …");
  const cpi = await parseCpi();
  console.log(`  → ${cpi.size} year-rows of inflation`);

  const years = [...returns.keys()].sort((a, b) => a - b);
  const data: YearRow[] = years.map((year) => ({
    year,
    returns: returns.get(year)!,
    ...(cpi.has(year) ? { inflation: cpi.get(year) } : {}),
  }));

  if (data.length < 50) throw new Error(`only ${data.length} rows parsed — aborting`);

  const payload = {
    _meta: {
      description:
        "Annual total returns by asset class (decimal) + CPI inflation, for the practical-module backtest engine.",
      assetKeys: ASSET_KEYS,
      coverage: `${data[0].year}–${data[data.length - 1].year}`,
      sources: {
        returns: `Aswath Damodaran, Historical Returns (NYU Stern) — ${DAMODARAN_URL}`,
        inflation: `Minneapolis Fed Consumer Price Index — ${CPI_URL}`,
      },
      note: "Derived annual returns, redistributed for education. Past performance is not indicative of future results.",
    },
    data,
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n");
  console.log(
    `Wrote ${data.length} rows (${payload._meta.coverage}) → lib/data/asset-returns.json`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
