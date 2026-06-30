/**
 * Build-time macro ingestion (Phase 4 — D3 FRED series).
 *
 * Pulls a handful of free, public-domain macro series from FRED's keyless CSV
 * download endpoint (fredgraph.csv — the JSON API needs a key, this doesn't),
 * aligns everything to a monthly grid, and writes web/lib/data/macro.json for
 * the client-side MacroLab. We ship derived monthly series for education.
 *
 * REQUIRED on any page using this data: the FRED notice "This product uses the
 * FRED® API but is not endorsed or certified by the Federal Reserve Bank of St.
 * Louis." (rendered in MacroLab). FRED data must never be used to train a model.
 *
 * Run: cd web && npx tsx scripts/ingest-macro.mts
 */

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "lib", "data", "macro.json");

// series key -> FRED id. Keys are the contract lib/macro.ts reads.
const SERIES: Record<string, string> = {
  yieldCurve: "T10Y3M", // 10y − 3m spread (daily)
  unemployment: "UNRATE", // %
  cpi: "CPIAUCSL", // index level → we compute YoY
  fedFunds: "FEDFUNDS", // %
  m2: "M2SL", // $bn → we compute YoY
  recession: "USREC", // 0/1 NBER indicator
  dgs10: "DGS10", // 10y yield (daily)
};

const START = "1976-01-01"; // covers the modern rate era + several cycles

async function fetchSeries(id: string): Promise<Map<string, number>> {
  const url = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${id}&cosd=${START}`;
  const res = await fetch(url, { headers: { "User-Agent": "finguru-ingest/0.1" } });
  if (!res.ok) throw new Error(`${id}: HTTP ${res.status}`);
  const text = await res.text();
  const out = new Map<string, number>();
  for (const line of text.split("\n").slice(1)) {
    const [date, raw] = line.split(",");
    if (!date || raw == null) continue;
    const v = parseFloat(raw.trim());
    if (Number.isNaN(v)) continue; // FRED uses "." for missing
    // Align to month key YYYY-MM; last observation in the month wins (daily series).
    out.set(date.trim().slice(0, 7), v);
  }
  return out;
}

interface MacroRow {
  month: string; // YYYY-MM
  yieldCurve?: number;
  unemployment?: number;
  cpi?: number;
  fedFunds?: number;
  m2?: number;
  recession?: number;
  dgs10?: number;
}

async function main() {
  const maps: Record<string, Map<string, number>> = {};
  for (const [key, id] of Object.entries(SERIES)) {
    maps[key] = await fetchSeries(id);
    console.log(`  ${key} (${id}): ${maps[key].size} months`);
    await new Promise((r) => setTimeout(r, 300));
  }

  // Union of all month keys, sorted.
  const months = [
    ...new Set(Object.values(maps).flatMap((m) => [...m.keys()])),
  ].sort();

  const rows: MacroRow[] = months.map((month) => {
    const row: MacroRow = { month };
    for (const key of Object.keys(SERIES)) {
      const v = maps[key].get(month);
      if (v != null) (row as Record<string, number | string>)[key] = v;
    }
    return row;
  });

  const payload = {
    _meta: {
      description:
        "Monthly-aligned US macro series for the MacroLab. Derived from FRED, redistributed for education.",
      coverage: `${months[0]}–${months[months.length - 1]}`,
      fredNotice:
        "This product uses the FRED® API but is not endorsed or certified by the Federal Reserve Bank of St. Louis.",
      seriesIds: SERIES,
    },
    data: rows,
  };
  await writeFile(OUT, JSON.stringify(payload) + "\n");
  console.log(`Wrote ${rows.length} monthly rows (${payload._meta.coverage}) → lib/data/macro.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
