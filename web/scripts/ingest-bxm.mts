/**
 * Build-time ingestion of the CBOE BXM index (S&P 500 BuyWrite — the covered-
 * call benchmark) from CBOE's free CSV, downsampled to monthly. Used by the
 * OptionsLab to show the honest buy-write-vs-buy-hold trade-off.
 *
 * Run: cd web && npx tsx scripts/ingest-bxm.mts
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "lib", "data", "bxm.json");
const URL =
  "https://cdn.cboe.com/api/global/us_indices/daily_prices/BXM_History.csv";

async function main() {
  const res = await fetch(URL, { headers: { "User-Agent": "finguru-ingest/0.1" } });
  if (!res.ok) throw new Error(`BXM: HTTP ${res.status}`);
  const text = await res.text();
  const daily: { t: string; c: number }[] = [];
  for (const line of text.split("\n").slice(1)) {
    const [d, v] = line.split(",");
    if (!d || v == null) continue;
    const val = parseFloat(v);
    if (Number.isNaN(val)) continue;
    const [mm, dd, yyyy] = d.trim().split("/");
    if (!yyyy) continue;
    daily.push({ t: `${yyyy}-${mm}-${dd}`, c: +val.toFixed(2) });
  }
  // Monthly: keep the last observation in each calendar month.
  const monthly: { t: string; c: number }[] = [];
  let cur = "";
  for (const r of daily) {
    const mk = r.t.slice(0, 7);
    if (mk !== cur) {
      monthly.push(r);
      cur = mk;
    } else monthly[monthly.length - 1] = r;
  }
  await writeFile(
    OUT,
    JSON.stringify({
      symbol: "BXM",
      _note:
        "CBOE S&P 500 BuyWrite Index (covered-call benchmark), monthly. Education use; not endorsed by Cboe.",
      monthly,
    }),
  );
  console.log(`BXM ${monthly.length} monthly points ${monthly[0].t}→${monthly[monthly.length - 1].t}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
