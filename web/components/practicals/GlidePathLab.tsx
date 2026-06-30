"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import StackedAreaChart from "@/components/charts/StackedAreaChart";
import LineChart from "@/components/charts/LineChart";
import { glidePath, sequenceRiskDemo, dataRange } from "@/lib/backtest";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

function money(x: number): string {
  return "$" + Math.round(x).toLocaleString("en-US");
}

// lifecycle lab: the target-date glide path (StackedAreaChart) + the sequence-of-
// returns demo, on real history. The sequence demo uses a fixed, deliberately
// stark window (2000-2024, 6% withdrawal) where return-order dominates outcome.
const SEQ_START = 2000;
const SEQ_END = 2024;

export default function GlidePathLab({
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
  const { last } = dataRange();
  const g = t.glidePath;
  const [retireYear, setRetireYear] = useState(2015);

  const glide = useMemo(
    () => glidePath({ startYear: 1980, targetYear: retireYear, endYear: last }),
    [retireYear, last],
  );

  const seq = useMemo(
    () =>
      sequenceRiskDemo({
        weights: { usStocks: 0.7, tBond: 0.3 },
        startYear: SEQ_START,
        endYear: SEQ_END,
        initial: 100000,
        withdrawalRate: 0.06,
      }),
    [],
  );

  const retireOptions: number[] = [];
  for (let y = 1995; y <= last; y += 5) retireOptions.push(y);

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
          <h1 className="text-3xl font-bold text-white">{g.title}</h1>
          <p className="max-w-2xl text-gray-300">{g.intro}</p>
        </div>
      </Reveal>

      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {g.retireYear}
            <select
              value={retireYear}
              onChange={(e) => setRetireYear(Number(e.target.value))}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {retireOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Reveal>

      <Reveal>
        <StackedAreaChart
          caption={g.allocCaption}
          labels={glide.points.map((p) => p.year)}
          height={300}
          yMax={1}
          series={[
            { label: "Stocks", data: glide.points.map((p) => p.usStocks), color: "#2dd4bf" },
            { label: "Bonds", data: glide.points.map((p) => p.tBond), color: "#38bdf8" },
            { label: "Cash", data: glide.points.map((p) => p.tBill), color: "#a78bfa" },
          ]}
        />
      </Reveal>

      {/* Sequence-of-returns risk */}
      <Reveal>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">{g.seqHeading}</h2>
          <p className="max-w-2xl text-sm text-gray-400">{g.seqIntro}</p>
        </div>
      </Reveal>

      <Reveal>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-red-400/40 bg-red-400/5 p-3 text-center">
            <div className="text-lg font-bold text-red-300">
              {money(seq.normal[seq.normal.length - 1])}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
              {g.seqNormalEnd}
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-[#131722] p-3 text-center">
            <div className="text-lg font-bold text-teal-300">
              {money(seq.reversed[seq.reversed.length - 1])}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">
              {g.seqReversedEnd}
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal>
        <LineChart
          caption={g.seqCaption}
          labels={seq.years}
          height={300}
          series={[
            { label: g.seqNormal, data: seq.normal, color: "#ef4444" },
            { label: g.seqReversed, data: seq.reversed, color: "#2dd4bf" },
          ]}
        />
      </Reveal>

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{g.lesson}</p>
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
