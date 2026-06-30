/**
 * Build-time OHLCV ingestion (Phase 3 — D2 daily prices).
 *
 * Fetches daily candles for a small, curated basket of liquid ETFs/large-caps
 * from Yahoo's chart JSON (no key) and writes one compact JSON per symbol into
 * web/lib/data/prices/. The TradeLab backtests run client-side on these static
 * files — no runtime data dependency, no licensing exposure (we ship derived
 * candles for education; Yahoo data is personal/research use, fetched at build).
 *
 * Stooq is no longer usable (JS proof-of-work gate); Yahoo's chart API still
 * serves true daily history when queried with explicit period1/period2.
 *
 * Run: cd web && npx tsx scripts/ingest-prices.mts
 */

import { writeFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(HERE, "..", "lib", "data", "prices");

// Curated basket: broad market, sectors, bonds, gold — enough for trend systems
// and a cross-asset momentum ranker, plus a few liquid large-caps for the
// swing/active-trading annotator.
const SYMBOLS = [
  "SPY", "QQQ", "IWM", "EFA", "EEM", "TLT", "IEF", "GLD", "DBC", "VNQ",
  "AAPL", "MSFT", "NVDA",
  // Factor ETFs (for the factor-quant tilt backtest). MTUM/QUAL/USMV/VLUE
  // launched ~2013; VTV is older. Common window starts ~2013.
  "VTI", "VTV", "MTUM", "QUAL", "USMV", "VLUE",
];

// ~21 years of daily data — spans 2008, 2020, 2022 (the instructive drawdowns).
const START = "2005-01-01";

interface Candle {
  t: string; // ISO date
  o: number;
  h: number;
  l: number;
  c: number; // adjusted close (split+div adjusted)
  v: number;
}

async function fetchSymbol(symbol: string): Promise<Candle[]> {
  const p1 = Math.floor(new Date(START).getTime() / 1000);
  const p2 = Math.floor(Date.now() / 1000);
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}` +
    `?period1=${p1}&period2=${p2}&interval=1d`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`${symbol}: HTTP ${res.status}`);
  const j = await res.json();
  const r = j?.chart?.result?.[0];
  if (!r?.timestamp) throw new Error(`${symbol}: no data`);
  const q = r.indicators.quote[0];
  const adj = r.indicators.adjclose?.[0]?.adjclose;
  const out: Candle[] = [];
  for (let i = 0; i < r.timestamp.length; i++) {
    const o = q.open[i], h = q.high[i], l = q.low[i], c = q.close[i];
    if (o == null || h == null || l == null || c == null) continue;
    // Scale OHLC by the adj-close ratio so the whole candle is split/div adjusted.
    const ratio = adj?.[i] != null && c ? adj[i] / c : 1;
    out.push({
      t: new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10),
      o: +(o * ratio).toFixed(4),
      h: +(h * ratio).toFixed(4),
      l: +(l * ratio).toFixed(4),
      c: +((adj?.[i] ?? c)).toFixed(4),
      v: q.volume[i] ?? 0,
    });
  }
  return out;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  const manifest: { symbol: string; from: string; to: string; points: number }[] = [];
  for (const symbol of SYMBOLS) {
    try {
      const candles = await fetchSymbol(symbol);
      await writeFile(
        join(OUT_DIR, `${symbol}.json`),
        JSON.stringify({
          symbol,
          _note:
            "Daily adjusted OHLCV for education (Yahoo Finance, fetched at build). Past performance is not indicative of future results.",
          candles,
        }),
      );
      manifest.push({
        symbol,
        from: candles[0].t,
        to: candles[candles.length - 1].t,
        points: candles.length,
      });
      console.log(`  ${symbol}: ${candles.length} candles ${candles[0].t}→${candles[candles.length - 1].t}`);
    } catch (e) {
      console.error(`  ${symbol} FAILED:`, (e as Error).message);
    }
    // Be polite between requests.
    await new Promise((r) => setTimeout(r, 400));
  }
  await writeFile(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`Wrote ${manifest.length}/${SYMBOLS.length} symbols → lib/data/prices/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
