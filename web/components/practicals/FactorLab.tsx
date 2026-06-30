"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import type { Candle } from "@/lib/ta";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

const FACTORS = ["VTV", "MTUM", "QUAL", "USMV", "VLUE"] as const;

async function loadCandles(symbol: string): Promise<Candle[]> {
  const mod = await import(`@/lib/data/prices/${symbol}.json`);
  return (mod.default ?? mod).candles as Candle[];
}

function pct(x: number, dp = 1): string {
  return (x * 100).toFixed(dp) + "%";
}

// Rebase two aligned close series to $1 over their common date window.
function compare(factor: Candle[], market: Candle[]) {
  const mByDate = new Map(market.map((c) => [c.t, c.c]));
  const labels: string[] = [];
  const f: number[] = [];
  const m: number[] = [];
  let f0 = 0;
  let m0 = 0;
  for (const c of factor) {
    const mc = mByDate.get(c.t);
    if (mc == null) continue;
    if (!f0) {
      f0 = c.c;
      m0 = mc;
    }
    labels.push(c.t);
    f.push(c.c / f0);
    m.push(mc / m0);
  }
  // monthly downsample for the chart
  const idx: number[] = [];
  const step = Math.max(1, Math.floor(labels.length / 240));
  for (let i = 0; i < labels.length; i += step) idx.push(i);
  if (idx[idx.length - 1] !== labels.length - 1) idx.push(labels.length - 1);

  const years = labels.length / 252;
  const cagr = (s: number[]) => (years > 0 ? Math.pow(s[s.length - 1], 1 / years) - 1 : 0);
  // factor max drawdown
  let peak = 0;
  let maxDd = 0;
  for (const v of f) {
    peak = Math.max(peak, v);
    maxDd = Math.min(maxDd, v / peak - 1);
  }
  return {
    labels: idx.map((i) => labels[i]),
    f: idx.map((i) => f[i]),
    m: idx.map((i) => m[i]),
    fCagr: cagr(f),
    mCagr: cagr(m),
    maxDd,
  };
}

export default function FactorLab({
  t,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  strategyLabel: string;
  strategyHref: string;
}) {
  const fr = t.factor;
  const [factor, setFactor] = useState<string>("VTV");
  const [factorC, setFactorC] = useState<Candle[] | null>(null);
  const [marketC, setMarketC] = useState<Candle[] | null>(null);

  useEffect(() => {
    let live = true;
    Promise.all([loadCandles(factor), loadCandles("VTI")]).then(([f, m]) => {
      if (live) {
        setFactorC(f);
        setMarketC(m);
      }
    });
    return () => {
      live = false;
    };
  }, [factor]);

  const r = useMemo(
    () => (factorC && marketC ? compare(factorC, marketC) : null),
    [factorC, marketC],
  );

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link href={strategyHref} className="text-sm text-gray-400 no-underline hover:text-teal-300">
            {t.back.replace("{strategy}", strategyLabel)}
          </Link>
          <h1 className="text-3xl font-bold text-white">{fr.title}</h1>
          <p className="max-w-2xl text-gray-300">{fr.intro}</p>
        </div>
      </Reveal>

      <Reveal index={1}>
        <div className="flex flex-wrap items-end gap-4 rounded-lg border border-white/10 bg-[#131722] p-4">
          <label className="flex flex-col gap-1 text-sm text-gray-400">
            {fr.factorLabel}
            <select value={factor} onChange={(e) => setFactor(e.target.value)} className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white">
              {FACTORS.map((s) => (
                <option key={s} value={s}>
                  {fr.factors[s]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </Reveal>

      {r && (
        <>
          <Reveal>
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <Stat label={fr.cagr} value={pct(r.fCagr)} />
              <Stat label={fr.marketCagr} value={pct(r.mCagr)} />
              <Stat label={fr.maxDd} value={pct(r.maxDd, 0)} />
              <Stat label={fr.excess} value={pct(r.fCagr - r.mCagr)} accent={r.fCagr < r.mCagr} />
            </div>
          </Reveal>
          <Reveal>
            <LineChart
              caption={fr.growthCaption}
              labels={r.labels}
              height={320}
              series={[
                { label: fr.factorLine, data: r.f, color: "#2dd4bf" },
                { label: fr.marketLine, data: r.m, color: "#f59e0b", dashed: true },
              ]}
            />
          </Reveal>
        </>
      )}

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{fr.lesson}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-500">
          <p>{fr.decayNote}</p>
          <p>{t.disclaimer}</p>
          <p>{t.sourceNote}</p>
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
