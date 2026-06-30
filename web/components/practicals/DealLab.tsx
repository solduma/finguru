"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import BarChart from "@/components/charts/BarChart";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

// Curated illustrative deals (one closed cleanly, one that broke) so the lesson
// lands without scraping unstructured M&A filings. Numbers are rounded/teaching
// values — the learner can edit any field for a live deal.
interface Deal {
  id: string;
  target: string;
  acquirer: string;
  dealPrice: number;
  currentPrice: number;
  preAnnounce: number;
  closeDays: number;
}
const DEALS: Deal[] = [
  // Tight spread, low break risk — the typical "nickels" trade.
  { id: "clean", target: "Target Co (clean cash deal)", acquirer: "BigCo", dealPrice: 100, currentPrice: 98.5, preAnnounce: 72, closeDays: 90 },
  // Wide spread = market doubts it closes (regulatory/antitrust risk).
  { id: "risky", target: "ContestedCo (antitrust risk)", acquirer: "RivalCo", dealPrice: 80, currentPrice: 66, preAnnounce: 55, closeDays: 180 },
];

function money(x: number): string {
  return "$" + x.toLocaleString("en-US", { maximumFractionDigits: 2 });
}
function pct(x: number, dp = 1): string {
  return (x * 100).toFixed(dp) + "%";
}

export default function DealLab({
  t,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  strategyLabel: string;
  strategyHref: string;
}) {
  const d = t.deal;
  const [dealId, setDealId] = useState("clean");
  const base = DEALS.find((x) => x.id === dealId)!;
  const [deal, setDeal] = useState<Deal>(base);

  // Reset fields when the preset changes.
  function selectDeal(id: string) {
    setDealId(id);
    setDeal(DEALS.find((x) => x.id === id)!);
  }

  const grossSpread = deal.dealPrice - deal.currentPrice;
  const spreadPct = deal.currentPrice > 0 ? grossSpread / deal.currentPrice : 0;
  const annualized = deal.closeDays > 0 ? spreadPct * (365 / deal.closeDays) : 0;
  const breakDownside = deal.currentPrice - deal.preAnnounce; // loss if it breaks

  const field = (label: string, key: keyof Deal) =>
    typeof deal[key] === "number" ? (
      <label className="flex flex-col gap-1 text-sm text-gray-400">
        {label}
        <input
          type="number"
          value={deal[key] as number}
          onChange={(e) => setDeal({ ...deal, [key]: parseFloat(e.target.value) || 0 })}
          className="w-32 rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
        />
      </label>
    ) : null;

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link href={strategyHref} className="text-sm text-gray-400 no-underline hover:text-teal-300">
            {t.back.replace("{strategy}", strategyLabel)}
          </Link>
          <h1 className="text-3xl font-bold text-white">{d.title}</h1>
          <p className="max-w-2xl text-gray-300">{d.intro}</p>
        </div>
      </Reveal>

      <Reveal index={1}>
        <div className="space-y-4 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {d.pickDeal}
            <select value={dealId} onChange={(e) => selectDeal(e.target.value)} className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white">
              {DEALS.map((x) => (
                <option key={x.id} value={x.id}>
                  {x.target} → {x.acquirer}
                </option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-4">
            {field(d.dealPrice, "dealPrice")}
            {field(d.currentPrice, "currentPrice")}
            {field(d.preAnnounce, "preAnnounce")}
            {field(d.closeDays, "closeDays")}
          </div>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label={d.grossSpread} value={money(grossSpread)} />
          <Stat label={d.spreadPct} value={pct(spreadPct)} />
          <Stat label={d.annualized} value={pct(annualized)} />
          <Stat label={d.breakDownside} value={money(breakDownside)} accent />
        </div>
      </Reveal>

      <Reveal>
        <BarChart
          caption={d.asymmetryNote}
          labels={[d.annualized, d.breakDownside]}
          height={240}
          yLabel="$ / share"
          series={[
            {
              label: d.asymmetryNote,
              // Upside per share if it closes vs. downside per share if it breaks.
              data: [grossSpread, breakDownside],
              color: ["#22c55e", "#ef4444"],
            },
          ]}
          levels={[{ y: 0, label: "" }]}
        />
      </Reveal>

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{d.lesson}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-500">
          <p>{d.manualNote}</p>
          <p>{t.disclaimer}</p>
        </div>
      </Reveal>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border p-3 text-center ${accent ? "border-red-400/40 bg-red-400/5" : "border-white/10 bg-[#131722]"}`}>
      <div className={`text-lg font-bold ${accent ? "text-red-300" : "text-teal-300"}`}>{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}
