"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import DrawdownChart from "@/components/charts/DrawdownChart";
import BarChart from "@/components/charts/BarChart";
import { backtest, dataRange, type Weights } from "@/lib/backtest";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

// Preset portfolios for the diversified / allocation strategies. Weights are
// asset-class targets the backtest engine understands. All-Weather/Permanent are
// simplified, individual-investor versions (see the lesson copy).
const PRESETS: Record<string, Weights> = {
  "100-stocks": { usStocks: 1 },
  "60-40": { usStocks: 0.6, tBond: 0.4 },
  "all-weather": { usStocks: 0.3, tBond: 0.4, tBill: 0.15, gold: 0.075, realEstate: 0.075 },
  permanent: { usStocks: 0.25, tBond: 0.25, gold: 0.25, tBill: 0.25 },
};

const ASSET_COLORS: Record<string, string> = {
  usStocks: "#2dd4bf",
  tBond: "#38bdf8",
  tBill: "#a78bfa",
  gold: "#f59e0b",
  realEstate: "#22c55e",
};

const PRESET_IDS = Object.keys(PRESETS);

function pct(x: number): string {
  return (x * 100).toFixed(1) + "%";
}
function money(x: number): string {
  return "$" + Math.round(x).toLocaleString("en-US");
}

export default function PortfolioLab({
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
  const [preset, setPreset] = useState<string>("60-40");
  const [rebalance, setRebalance] = useState(true);
  const [startYear, setStartYear] = useState(1972);

  const p = t.portfolio;

  const { result, benchmark } = useMemo(() => {
    const weights = PRESETS[preset];
    return {
      result: backtest({ weights, startYear, rebalance }),
      benchmark: backtest({ weights: { usStocks: 1 }, startYear, rebalance }),
    };
  }, [preset, startYear, rebalance]);

  const weights = PRESETS[preset];
  const allocLabels = Object.keys(weights);

  const stats = [
    { label: p.cagr, value: pct(result.cagr) },
    { label: p.realCagr, value: pct(result.realCagr) },
    { label: p.vol, value: pct(result.volatility) },
    { label: p.sharpe, value: result.sharpe.toFixed(2) },
    { label: p.maxDd, value: pct(result.maxDrawdown) },
    { label: p.finalValue, value: money(result.finalValue) },
  ];

  // Year options: every 4th year keeps the dropdown short but useful.
  const yearOptions: number[] = [];
  for (let y = first; y <= last - 5; y += 4) yearOptions.push(y);

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
          <h1 className="text-3xl font-bold text-white">{p.title}</h1>
          <p className="max-w-2xl text-gray-300">{p.intro}</p>
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {p.presetLabel}
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {PRESET_IDS.map((id) => (
                <option key={id} value={id}>
                  {p.presets[id]}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {p.startYear}
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
              checked={rebalance}
              onChange={(e) => setRebalance(e.target.checked)}
              className="h-4 w-4 accent-teal-400"
            />
            {p.rebalance}
          </label>
        </div>
      </Reveal>

      {/* Stat grid */}
      <Reveal index={2}>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-lg border border-white/10 bg-[#131722] p-3 text-center"
            >
              <div className="text-lg font-bold text-teal-300">{s.value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      {/* Growth: portfolio vs. 100% stocks */}
      <Reveal>
        <LineChart
          caption={p.growthCaption}
          labels={result.years}
          height={320}
          series={[
            { label: p.presets[preset], data: result.equity, color: "#2dd4bf", fill: true },
            {
              label: p.presets["100-stocks"],
              data: benchmark.equity,
              color: "#f59e0b",
              dashed: true,
            },
          ]}
        />
      </Reveal>

      {/* Drawdown */}
      <Reveal>
        <DrawdownChart
          caption={p.drawdownCaption}
          labels={result.years}
          data={result.drawdown}
          height={200}
        />
      </Reveal>

      {/* Allocation */}
      <Reveal>
        <BarChart
          caption={p.allocCaption}
          horizontal
          yMax={1}
          labels={allocLabels}
          series={[
            {
              label: p.allocCaption,
              data: allocLabels.map((k) => weights[k as keyof Weights] ?? 0),
              color: allocLabels.map((k) => ASSET_COLORS[k] ?? "#38bdf8"),
            },
          ]}
        />
      </Reveal>

      {/* The lesson + disclaimers */}
      <Reveal>
        <div className="space-y-3 rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{p.lesson}</p>
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
