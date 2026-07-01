/**
 * Build-time ingestion of the Fama-French 3-factor MONTHLY series from the Ken
 * French Data Library (free, keyless ZIP). Written to web/lib/data/ff-factors.json
 * for the FactorLab regression (a factor ETF's excess return regressed on
 * Mkt-RF / SMB / HML → alpha + betas). Returns are in percent in the source; we
 * store them as decimals.
 *
 * License: attribute Eugene F. Fama & Kenneth R. French; we ship derived monthly
 * factor returns for education, not the raw file.
 *
 * Run: cd web && npx tsx scripts/ingest-factors.mts
 */
import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { inflateRawSync } from "node:zlib";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "lib", "data", "ff-factors.json");
const URL =
  "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/F-F_Research_Data_Factors_CSV.zip";

// Minimal ZIP reader: the archive holds a single deflated CSV member. Node has
// no stdlib unzip, but the member is raw-deflate — inflate it after locating it.
function extractCsv(buf: Buffer): string {
  // Local file header signature 0x04034b50; name length at offset 26, extra at 28.
  if (buf.readUInt32LE(0) !== 0x04034b50) throw new Error("not a zip");
  const nameLen = buf.readUInt16LE(26);
  const extraLen = buf.readUInt16LE(28);
  const method = buf.readUInt16LE(8);
  const dataStart = 30 + nameLen + extraLen;
  // Compressed size may be in the header or the data descriptor; use the central
  // dir when the header size is 0. Simpler: inflate from dataStart to EOF-ish.
  const compressed = buf.subarray(dataStart);
  if (method === 0) return compressed.toString("latin1"); // stored
  // ZIP method 8 = raw DEFLATE (no zlib header).
  return inflateRawSync(compressed).toString("latin1");
}

async function main() {
  const res = await fetch(URL, { headers: { "User-Agent": "finguru-ingest/0.1" } });
  if (!res.ok) throw new Error(`FF: HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const csv = extractCsv(buf);

  const rows: { month: string; mktRf: number; smb: number; hml: number; rf: number }[] = [];
  for (const line of csv.split("\n")) {
    const m = line.match(/^\s*(\d{6})\s*,\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)/);
    if (!m) continue; // stops naturally at the "Annual Factors" section (YYYY only)
    const ym = m[1];
    rows.push({
      month: `${ym.slice(0, 4)}-${ym.slice(4, 6)}`,
      mktRf: +(parseFloat(m[2]) / 100).toFixed(6),
      smb: +(parseFloat(m[3]) / 100).toFixed(6),
      hml: +(parseFloat(m[4]) / 100).toFixed(6),
      rf: +(parseFloat(m[5]) / 100).toFixed(6),
    });
  }
  if (rows.length < 500) throw new Error(`only ${rows.length} FF rows parsed`);

  await writeFile(
    OUT,
    JSON.stringify({
      _meta: {
        description:
          "Fama-French 3 factors, monthly, decimal returns. Source: Ken French Data Library. Attribute Fama & French; education use.",
        coverage: `${rows[0].month}–${rows[rows.length - 1].month}`,
      },
      data: rows,
    }),
  );
  console.log(`Wrote ${rows.length} FF monthly rows (${rows[0].month}→${rows[rows.length - 1].month})`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
