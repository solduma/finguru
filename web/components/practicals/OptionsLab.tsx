"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import {
  syntheticChain,
  coveredCall,
  coveredCallPayoff,
  type ChainRow,
} from "@/lib/options";
import spyData from "@/lib/data/prices/SPY.json";
import bxmData from "@/lib/data/bxm.json";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

// Default underlying assumptions (illustrative; the learner can move IV/DTE).
const R = 0.04;
const Q = 0.013;

function pct(x: number, dp = 1): string {
  return (x * 100).toFixed(dp) + "%";
}

// Build the BXM-vs-SPY monthly comparison once (both rebased to $1 over the
// common window). SPY daily → take month-end; BXM is already monthly.
function buyWriteComparison() {
  const spyCandles = (spyData as { candles: { t: string; c: number }[] }).candles;
  const spyMonthly = new Map<string, number>();
  for (const c of spyCandles) spyMonthly.set(c.t.slice(0, 7), c.c);
  const bxm = (bxmData as { monthly: { t: string; c: number }[] }).monthly;
  const labels: string[] = [];
  const spy: number[] = [];
  const bx: number[] = [];
  let spy0 = 0;
  let bx0 = 0;
  for (const b of bxm) {
    const mk = b.t.slice(0, 7);
    const s = spyMonthly.get(mk);
    if (s == null) continue;
    if (!spy0) {
      spy0 = s;
      bx0 = b.c;
    }
    labels.push(mk);
    spy.push(s / spy0);
    bx.push(b.c / bx0);
  }
  const years = labels.length / 12;
  const cagr = (series: number[]) =>
    years > 0 ? Math.pow(series[series.length - 1], 1 / years) - 1 : 0;
  return { labels, spy, bx, spyCagr: cagr(spy), bxCagr: cagr(bx) };
}

export default function OptionsLab({
  t,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  strategyLabel: string;
  strategyHref: string;
}) {
  const o = t.options;
  const [spot, setSpot] = useState(100);
  const [iv, setIv] = useState(0.2);
  const [dte, setDte] = useState(30);
  const [strikeIdx, setStrikeIdx] = useState(4); // default ~+2.5% OTM

  const chain: ChainRow[] = useMemo(
    () => syntheticChain({ spot, t: dte / 365, r: R, iv, q: Q }),
    [spot, iv, dte],
  );
  const picked = chain[Math.min(strikeIdx, chain.length - 1)];
  const cc = coveredCall(spot, picked.strike, picked.quote.call, dte);

  const payoff = useMemo(() => {
    const prices: number[] = [];
    for (let p = spot * 0.8; p <= spot * 1.2; p += spot * 0.01) prices.push(+p.toFixed(2));
    return coveredCallPayoff(cc, prices);
  }, [cc, spot]);

  const bw = useMemo(buyWriteComparison, []);

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link href={strategyHref} className="text-sm text-gray-400 no-underline hover:text-teal-300">
            {t.back.replace("{strategy}", strategyLabel)}
          </Link>
          <h1 className="text-3xl font-bold text-white">{o.title}</h1>
          <p className="max-w-2xl text-gray-300">{o.intro}</p>
        </div>
      </Reveal>

      {/* Inputs */}
      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-5 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {o.spot}: <span className="text-teal-300">${spot}</span>
            <input type="range" min={20} max={500} step={5} value={spot} onChange={(e) => setSpot(+e.target.value)} className="accent-teal-400" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {o.iv}: <span className="text-teal-300">{pct(iv, 0)}</span>
            <input type="range" min={0.1} max={0.6} step={0.05} value={iv} onChange={(e) => setIv(+e.target.value)} className="accent-teal-400" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {o.dte}: <span className="text-teal-300">{dte}</span>
            <input type="range" min={7} max={90} step={7} value={dte} onChange={(e) => setDte(+e.target.value)} className="accent-teal-400" />
          </label>
        </div>
      </Reveal>

      {/* Chain + strike picker */}
      <Reveal>
        <h2 className="mb-2 text-lg font-semibold text-white">{o.chainHeading}</h2>
        <div className="overflow-hidden rounded-lg border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-[#131722] text-gray-400">
              <tr>
                <th className="px-3 py-2 text-left">{o.strike}</th>
                <th className="px-3 py-2 text-right">{o.callPremium}</th>
                <th className="px-3 py-2 text-right">{o.delta}</th>
                <th className="px-3 py-2 text-right">{o.pickStrike}</th>
              </tr>
            </thead>
            <tbody>
              {chain.map((row, i) => (
                <tr key={i} className={i === strikeIdx ? "bg-teal-400/10" : ""}>
                  <td className="px-3 py-1.5 text-left text-gray-200">
                    ${row.strike} {row.moneyness > 1 ? "(OTM)" : row.moneyness < 1 ? "(ITM)" : "(ATM)"}
                  </td>
                  <td className="px-3 py-1.5 text-right text-teal-300">${row.quote.call.toFixed(2)}</td>
                  <td className="px-3 py-1.5 text-right text-gray-400">{row.quote.callDelta.toFixed(2)}</td>
                  <td className="px-3 py-1.5 text-right">
                    <button onClick={() => setStrikeIdx(i)} className="text-xs text-teal-400 underline">
                      {o.pickStrike}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      {/* Covered-call plan + payoff */}
      <Reveal>
        <h2 className="mb-3 text-lg font-semibold text-white">{o.planHeading}</h2>
        <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <Stat label={o.callPremium} value={"$" + cc.premium.toFixed(2)} />
          <Stat label={o.maxProfit} value={pct(cc.maxProfitPct)} />
          <Stat label={o.breakeven} value={"$" + cc.breakeven.toFixed(2)} />
          <Stat label={o.annPremium} value={pct(cc.annualizedReturnOnPremium)} />
        </div>
        <LineChart
          caption={o.payoffCaption}
          labels={payoff.prices}
          height={280}
          hideXTicks={false}
          series={[
            { label: o.stockLine, data: payoff.stock, color: "#f59e0b", dashed: true },
            { label: o.coveredLine, data: payoff.covered, color: "#2dd4bf" },
          ]}
          levels={[{ y: 0, label: "" }]}
        />
      </Reveal>

      {/* BXM vs SPY */}
      <Reveal>
        <h2 className="mb-3 text-lg font-semibold text-white">{o.bxmHeading}</h2>
        <div className="mb-3 grid grid-cols-2 gap-3">
          <Stat label={o.bxmStat} value={pct(bw.bxCagr)} />
          <Stat label={o.spyStat} value={pct(bw.spyCagr)} />
        </div>
        <LineChart
          caption={o.bxmCaption}
          labels={bw.labels}
          height={280}
          series={[
            { label: o.bxmLine, data: bw.bx, color: "#2dd4bf" },
            { label: o.spyLine, data: bw.spy, color: "#f59e0b", dashed: true },
          ]}
        />
      </Reveal>

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{o.lesson}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-500">
          <p>{o.assignmentNote}</p>
          <p>{t.disclaimer}</p>
        </div>
      </Reveal>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#131722] p-3 text-center">
      <div className="text-lg font-bold text-teal-300">{value}</div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}
