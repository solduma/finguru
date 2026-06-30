"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import DrawdownChart from "@/components/charts/DrawdownChart";
import {
  backtestTrend,
  atr,
  planTrade,
  resolveTrade,
  type Candle,
  type TrendSystem,
} from "@/lib/ta";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];
type TT = Dict["practical"]["trade"];

const TREND_SYMBOLS = ["SPY", "QQQ", "IWM", "EEM", "GLD", "TLT", "NVDA", "AAPL"];
const ACTIVE_SYMBOLS = ["AAPL", "MSFT", "NVDA", "SPY", "QQQ"];

async function loadCandles(symbol: string): Promise<Candle[]> {
  const mod = await import(`@/lib/data/prices/${symbol}.json`);
  return (mod.default ?? mod).candles as Candle[];
}

function pct(x: number, dp = 1): string {
  return (x * 100).toFixed(dp) + "%";
}

export default function TradeLab({
  t,
  mode,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  mode: "trend" | "active";
  strategyLabel: string;
  strategyHref: string;
}) {
  const tt = t.trade;
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
          <h1 className="text-3xl font-bold text-white">{tt.titles[mode]}</h1>
          <p className="max-w-2xl text-gray-300">{tt.intros[mode]}</p>
        </div>
      </Reveal>

      {mode === "active" && (
        <Reveal>
          <div className="rounded-lg border border-red-400/40 bg-red-400/5 p-4 text-sm text-red-100">
            ⚠ {tt.oddsWarning}
          </div>
        </Reveal>
      )}

      {mode === "trend" ? <TrendMode tt={tt} /> : <ActiveMode tt={tt} />}

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{tt.lessons[mode]}</p>
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

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div
      className={`rounded-lg border p-3 text-center ${
        accent ? "border-red-400/40 bg-red-400/5" : "border-white/10 bg-[#131722]"
      }`}
    >
      <div className={`text-lg font-bold ${accent ? "text-red-300" : "text-teal-300"}`}>
        {value}
      </div>
      <div className="mt-1 text-[11px] uppercase tracking-wide text-gray-500">{label}</div>
    </div>
  );
}

function TrendMode({ tt }: { tt: TT }) {
  const [symbol, setSymbol] = useState("SPY");
  const [system, setSystem] = useState<TrendSystem>("sma200");
  const [candles, setCandles] = useState<Candle[] | null>(null);

  useEffect(() => {
    let live = true;
    loadCandles(symbol).then((c) => live && setCandles(c));
    return () => {
      live = false;
    };
  }, [symbol]);

  const r = useMemo(
    () => (candles ? backtestTrend(candles, system) : null),
    [candles, system],
  );

  // Downsample the equity curves for the chart (daily → ~monthly) to keep it light.
  const sampled = useMemo(() => {
    if (!r) return null;
    const step = Math.max(1, Math.floor(r.dates.length / 300));
    const idx: number[] = [];
    for (let i = 0; i < r.dates.length; i += step) idx.push(i);
    return {
      labels: idx.map((i) => r.dates[i]),
      eq: idx.map((i) => r.equity[i]),
      bh: idx.map((i) => r.buyHold[i]),
      dd: idx.map((i) => r.drawdown[i]),
    };
  }, [r]);

  return (
    <div className="space-y-6">
      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {tt.symbolLabel}
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {TREND_SYMBOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {tt.systemLabel}
            <select
              value={system}
              onChange={(e) => setSystem(e.target.value as TrendSystem)}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {(["sma200", "mom12", "donchian"] as const).map((s) => (
                <option key={s} value={s}>
                  {tt.systems[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Reveal>

      {r && sampled && (
        <>
          <Reveal>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Stat label={tt.cagr} value={pct(r.cagr)} />
              <Stat label={tt.buyHold} value={pct(r.buyHoldCagr)} />
              <Stat label={tt.maxDd} value={pct(r.maxDrawdown, 0)} />
              <Stat label={tt.exposure} value={pct(r.exposure, 0)} />
              <Stat label={tt.trades} value={String(r.trades)} />
            </div>
          </Reveal>
          <Reveal>
            <LineChart
              caption={tt.equityCaption}
              labels={sampled.labels}
              height={320}
              series={[
                { label: tt.stratLine, data: sampled.eq, color: "#2dd4bf" },
                { label: tt.bhLine, data: sampled.bh, color: "#f59e0b", dashed: true },
              ]}
            />
          </Reveal>
          <Reveal>
            <DrawdownChart
              caption={tt.drawdownCaption}
              labels={sampled.labels}
              data={sampled.dd}
              height={200}
            />
          </Reveal>
        </>
      )}
    </div>
  );
}

function ActiveMode({ tt }: { tt: TT }) {
  const [symbol, setSymbol] = useState("AAPL");
  const [candles, setCandles] = useState<Candle[] | null>(null);
  const [equity, setEquity] = useState(25000);
  const [riskPct, setRiskPct] = useState(0.01);

  useEffect(() => {
    let live = true;
    loadCandles(symbol).then((c) => live && setCandles(c));
    return () => {
      live = false;
    };
  }, [symbol]);

  // Use a fixed historical "entry" near the middle of the data so the trade can
  // resolve forward without lookahead. The learner sees a real, frozen example.
  const result = useMemo(() => {
    if (!candles || candles.length < 300) return null;
    const entryIdx = Math.floor(candles.length * 0.7);
    const atrSeries = atr(candles, 14);
    const a = atrSeries[entryIdx];
    if (a == null) return null;
    const entry = candles[entryIdx].c;
    const plan = planTrade({ entry, atr: a, equity, riskPct });
    const fwd = candles.slice(entryIdx + 1, entryIdx + 1 + 120); // up to ~6mo
    const res = resolveTrade(fwd, plan);
    return { plan, res, entryDate: candles[entryIdx].t };
  }, [candles, equity, riskPct]);

  return (
    <div className="space-y-6">
      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {tt.symbolLabel}
            <select
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {ACTIVE_SYMBOLS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {tt.equityInput}
            <select
              value={equity}
              onChange={(e) => setEquity(Number(e.target.value))}
              className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            >
              {[10000, 25000, 50000, 100000].map((v) => (
                <option key={v} value={v}>
                  ${v.toLocaleString()}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {tt.riskPct}: <span className="text-teal-300">{pct(riskPct)}</span>
            <input
              type="range"
              min={0.005}
              max={0.03}
              step={0.005}
              value={riskPct}
              onChange={(e) => setRiskPct(parseFloat(e.target.value))}
              className="accent-teal-400"
            />
          </label>
        </div>
      </Reveal>

      {result && (
        <>
          <Reveal>
            <h2 className="text-lg font-semibold text-white">{tt.planHeading}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-5">
              <Stat label={tt.entryLabel} value={"$" + result.plan.entry.toFixed(2)} />
              <Stat label={tt.stop} value={"$" + result.plan.stop.toFixed(2)} />
              <Stat label={tt.target} value={"$" + result.plan.target.toFixed(2)} />
              <Stat label={tt.shares} value={result.plan.shares.toFixed(0)} />
              <Stat label={tt.rr} value={`${result.plan.rMultipleToTarget} : 1`} />
            </div>
          </Reveal>
          <Reveal>
            <h2 className="text-lg font-semibold text-white">{tt.resolveHeading}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Stat
                label={tt.outcome}
                value={result.res.hitStop ? tt.hitStop : result.res.rMultiple >= result.plan.rMultipleToTarget ? tt.hitTarget : "—"}
                accent={result.res.hitStop}
              />
              <Stat
                label={tt.rMultiple}
                value={(result.res.rMultiple >= 0 ? "+" : "") + result.res.rMultiple.toFixed(2) + "R"}
                accent={result.res.rMultiple < 0}
              />
            </div>
          </Reveal>
        </>
      )}
    </div>
  );
}
