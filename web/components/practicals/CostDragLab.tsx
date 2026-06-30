"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import { backtest, dataRange } from "@/lib/backtest";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

const FEES = [0.001, 0.005, 0.01, 0.015, 0.02];

function money(x: number): string {
  return "$" + Math.round(x).toLocaleString("en-US");
}
function pct(x: number): string {
  return (x * 100).toFixed(2) + "%";
}

// index-passive lab: the cost of fees + lump-sum vs DCA, on real S&P 500 history.
export default function CostDragLab({
  locale,
  t,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  strategyLabel: string;
  strategyHref: string;
}) {
  const { first, last } = dataRange();
  const c = t.costDrag;
  const [fee, setFee] = useState(0.01);
  const [dca, setDca] = useState(false);
  const [startYear, setStartYear] = useState(1985);

  const { low, high } = useMemo(() => {
    // DCA mode spreads the same $10,000 evenly across the window instead of a
    // lump sum at the start, so the two curves share an identical contribution base.
    const span = last - startYear + 1;
    const common = dca
      ? { initial: 0, annualContribution: 10000 / span }
      : { initial: 10000 };
    return {
      low: backtest({ weights: { usStocks: 1 }, startYear, fee: 0.0003, ...common }),
      high: backtest({ weights: { usStocks: 1 }, startYear, fee, ...common }),
    };
  }, [fee, dca, startYear, last]);

  const lostToFees = low.finalValue - high.finalValue;

  const yearOptions: number[] = [];
  for (let y = first; y <= last - 10; y += 5) yearOptions.push(y);

  const stats = [
    { label: c.highFinal, value: money(high.finalValue), accent: false },
    { label: c.lowFinal, value: money(low.finalValue), accent: false },
    { label: c.lostToFees, value: money(lostToFees), accent: true },
    { label: c.cagrHigh, value: pct(high.cagr), accent: false },
  ];

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link
            href={strategyHref}
            className="text-sm text-gray-400 no-underline hover:text-teal-300"
          >
            {t.back.replace("{strategy}", strategyLabel)}
          </Link>
          <h1 className="text-3xl font-bold text-white">{c.title}</h1>
          <p className="max-w-2xl text-gray-300">{c.intro}</p>
        </div>
      </Reveal>

      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-5 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex min-w-[220px] flex-col gap-1 text-sm text-gray-400">
            {c.feeLabel}: <span className="text-teal-300">{pct(fee)}</span>
            <input
              type="range"
              min={0}
              max={FEES.length - 1}
              step={1}
              value={FEES.indexOf(fee) === -1 ? 2 : FEES.indexOf(fee)}
              onChange={(e) => setFee(FEES[Number(e.target.value)])}
              className="accent-teal-400"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {c.startYear}
            <select
              value={startYear}
              onChange={(e) => setStartYear(Number(e.target.value))}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-300">
            <input
              type="checkbox"
              checked={dca}
              onChange={(e) => setDca(e.target.checked)}
              className="h-4 w-4 accent-teal-400"
            />
            {dca ? c.dca : c.lump}
          </label>
        </div>
      </Reveal>

      <Reveal index={2}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className={`rounded-lg border p-3 text-center ${
                s.accent
                  ? "border-red-400/40 bg-red-400/5"
                  : "border-white/10 bg-[#131722]"
              }`}
            >
              <div
                className={`text-lg font-bold ${s.accent ? "text-red-300" : "text-teal-300"}`}
              >
                {s.value}
              </div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal>
        <LineChart
          caption={c.growthCaption}
          labels={low.years}
          height={320}
          series={[
            { label: c.lowFinal, data: low.equity, color: "#2dd4bf", fill: true },
            { label: c.highFinal, data: high.equity, color: "#ef4444", dashed: true },
          ]}
        />
      </Reveal>

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{c.lesson}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-500">
          <p>{t.disclaimer}</p>
          <p>{t.sourceNote}</p>
        </div>
      </Reveal>
    </div>
  );
}
