"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import {
  dividendSafety,
  twoStageDcf,
  marginOfSafety,
  magicFormula,
  garp,
  type Fundamentals,
} from "@/lib/fundamentals";
import type { CompanyMode } from "@/lib/practicals";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];

// Example tickers per market to seed the input (real, liquid names).
const EXAMPLES: Record<string, string[]> = {
  us: ["AAPL", "KO", "JNJ", "O"],
  kr: ["005930", "005380", "035420"],
};

function pct(x: number | null, dp = 1): string {
  return x == null ? "—" : (x * 100).toFixed(dp) + "%";
}
function num(x: number | null, dp = 2): string {
  return x == null ? "—" : x.toLocaleString("en-US", { maximumFractionDigits: dp });
}

export default function CompanyLab({
  t,
  mode,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  mode: CompanyMode;
  strategyLabel: string;
  strategyHref: string;
}) {
  const c = t.company;
  const [market, setMarket] = useState<"us" | "kr">("us");
  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState("");
  const [data, setData] = useState<Fundamentals | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "notfound" | "error">("idle");

  // DCF assumption sliders (value mode).
  const [growth, setGrowth] = useState(0.08);
  const [terminal, setTerminal] = useState(0.025);
  const [discount, setDiscount] = useState(0.09);

  async function analyze() {
    if (!ticker.trim()) return;
    setStatus("loading");
    setData(null);
    try {
      const res = await fetch(
        `/api/market-data/fundamentals?ticker=${encodeURIComponent(ticker.trim())}&market=${market}`,
      );
      if (res.status === 404) return setStatus("notfound");
      if (!res.ok) return setStatus("error");
      setData((await res.json()) as Fundamentals);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  const priceNum = parseFloat(price) || 0;

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
          <h1 className="text-3xl font-bold text-white">{c.titles[mode]}</h1>
          <p className="max-w-2xl text-gray-300">{c.intros[mode]}</p>
        </div>
      </Reveal>

      {/* Inputs */}
      <Reveal index={1}>
        <div className="space-y-3 rounded-lg border border-white/10 bg-[#131722] p-4">
          <div className="flex flex-wrap items-end gap-4">
            <label className="flex flex-col gap-1 text-sm text-gray-400">
              {c.marketLabel}
              <select
                value={market}
                onChange={(e) => setMarket(e.target.value as "us" | "kr")}
                className="rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
              >
                <option value="us">{c.marketUs}</option>
                <option value="kr">{c.marketKr}</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-400">
              {c.tickerLabel}
              <input
                value={ticker}
                onChange={(e) => setTicker(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                placeholder={market === "us" ? "AAPL" : "005930"}
                className="w-32 rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-400">
              {c.priceLabel}
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                inputMode="decimal"
                placeholder="0"
                className="w-32 rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
              />
            </label>
            <button
              onClick={analyze}
              className="rounded bg-teal-500 px-4 py-2 font-semibold text-black transition hover:bg-teal-400"
            >
              {c.analyze}
            </button>
          </div>
          <div className="text-xs text-gray-500">
            {c.examples}:{" "}
            {EXAMPLES[market].map((ex) => (
              <button
                key={ex}
                onClick={() => setTicker(ex)}
                className="mr-2 underline hover:text-teal-300"
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      {status === "loading" && <p className="text-gray-400">{c.loading}</p>}
      {status === "notfound" && <p className="text-amber-300">{c.notFound}</p>}
      {status === "error" && <p className="text-red-300">{c.error}</p>}

      {data && status === "idle" && (
        <Reveal>
          <div className="space-y-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xl font-semibold text-white">
                {data.name}{" "}
                <span className="text-sm font-normal text-gray-500">
                  ({data.ticker} · {data.currency})
                </span>
              </h2>
              {data.sources[0] && (
                <a
                  href={data.sources[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-teal-400 underline"
                >
                  {c.sourceLink} →
                </a>
              )}
            </div>

            {mode === "dividend" && <DividendCard data={data} price={priceNum} c={c} />}
            {mode === "reit" && (
              <>
                <div className="rounded-lg border border-amber-400/30 bg-amber-400/5 p-3 text-sm text-amber-100">
                  {c.reitNote}
                </div>
                <DividendCard data={data} price={priceNum} c={c} />
              </>
            )}
            {mode === "value" && (
              <ValueCard
                data={data}
                price={priceNum}
                c={c}
                growth={growth}
                terminal={terminal}
                discount={discount}
                setGrowth={setGrowth}
                setTerminal={setTerminal}
                setDiscount={setDiscount}
              />
            )}
            {mode === "growth" && <GrowthCard data={data} price={priceNum} c={c} />}
          </div>
        </Reveal>
      )}

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{c.lessons[mode]}</p>
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

type CT = Dict["practical"]["company"];

function DividendCard({ data, price, c }: { data: Fundamentals; price: number; c: CT }) {
  const d = dividendSafety(data);
  const yld = d.latestDps != null && price > 0 ? d.latestDps / price : null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={c.yield} value={pct(yld)} />
        <Stat
          label={c.payoutEarnings}
          value={pct(d.payoutOnEarnings)}
          accent={(d.payoutOnEarnings ?? 0) > 1}
        />
        <Stat
          label={c.payoutFcf}
          value={pct(d.payoutOnFcf)}
          accent={(d.payoutOnFcf ?? 0) > 1}
        />
        <Stat label={`${c.growthStreak} (${c.years})`} value={String(d.growthStreak)} />
      </div>
      {d.cut && (
        <p className="rounded border border-red-400/40 bg-red-400/5 p-2 text-sm text-red-200">
          ⚠ {c.cutWarning}
        </p>
      )}
      {data.dividendsPerShare.length > 1 && (
        <LineChart
          caption={c.dpsCaption}
          labels={data.dividendsPerShare.map((p) => p.year)}
          height={240}
          series={[
            {
              label: c.dpsCaption,
              data: data.dividendsPerShare.map((p) => p.value),
              color: "#2dd4bf",
              fill: true,
            },
          ]}
        />
      )}
    </div>
  );
}

function ValueCard({
  data,
  price,
  c,
  growth,
  terminal,
  discount,
  setGrowth,
  setTerminal,
  setDiscount,
}: {
  data: Fundamentals;
  price: number;
  c: CT;
  growth: number;
  terminal: number;
  discount: number;
  setGrowth: (n: number) => void;
  setTerminal: (n: number) => void;
  setDiscount: (n: number) => void;
}) {
  const dcf = twoStageDcf(data, {
    growth,
    terminalGrowth: terminal,
    discountRate: discount,
  });
  const mf = magicFormula(data, price);
  const mos =
    dcf.intrinsicPerShare != null && price > 0
      ? marginOfSafety(dcf.intrinsicPerShare, price)
      : null;

  const slider = (
    label: string,
    val: number,
    set: (n: number) => void,
    min: number,
    max: number,
    step: number,
  ) => (
    <label className="flex flex-col gap-1 text-sm text-gray-400">
      {label}: <span className="text-teal-300">{(val * 100).toFixed(1)}%</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={(e) => set(parseFloat(e.target.value))}
        className="accent-teal-400"
      />
    </label>
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-5 rounded-lg border border-white/10 bg-[#131722] p-4">
        {slider(c.growthRate, growth, setGrowth, 0, 0.25, 0.005)}
        {slider(c.terminalGrowth, terminal, setTerminal, 0, 0.05, 0.0025)}
        {slider(c.discountRate, discount, setDiscount, 0.04, 0.15, 0.0025)}
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Stat label={c.intrinsic} value={num(dcf.intrinsicPerShare)} />
        <Stat
          label={c.marginOfSafety}
          value={pct(mos)}
          accent={mos != null && mos < 0}
        />
        <Stat label={c.earningsYield} value={pct(mf.earningsYield)} />
        <Stat label={c.returnOnCapital} value={pct(mf.returnOnCapital)} />
      </div>
      {dcf.terminalShare != null && (
        <>
          <BarChart
            caption={c.dcfCaption}
            labels={[c.intrinsic, c.terminalShare]}
            height={220}
            yMax={1}
            series={[
              {
                label: c.dcfCaption,
                data: [1 - dcf.terminalShare, dcf.terminalShare],
                color: ["#2dd4bf", "#f59e0b"],
              },
            ]}
          />
          {dcf.terminalShare > 0.6 && (
            <p className="text-sm text-amber-200">⚠ {c.terminalWarn}</p>
          )}
        </>
      )}
    </div>
  );
}

function GrowthCard({ data, price, c }: { data: Fundamentals; price: number; c: CT }) {
  const g = garp(data, price);
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        <Stat label={c.pe} value={num(g.pe, 1)} />
        <Stat label={c.peg} value={num(g.pegFromHistory, 2)} accent={(g.pegFromHistory ?? 0) > 2} />
        <Stat label={c.epsCagr} value={pct(g.epsCagr)} />
        <Stat label={c.roe} value={pct(g.roe)} />
        <Stat label={c.netMargin} value={pct(g.netMargin)} />
        <Stat
          label={c.fcfConversion}
          value={pct(g.fcfConversion)}
          accent={g.fcfConversion != null && g.fcfConversion < 0.8}
        />
      </div>
      {data.revenue.length > 1 && (
        <LineChart
          caption={c.revenueCaption}
          labels={data.revenue.map((p) => p.year)}
          height={240}
          series={[
            {
              label: c.revenueCaption,
              data: data.revenue.map((p) => p.value),
              color: "#38bdf8",
              fill: true,
            },
          ]}
        />
      )}
    </div>
  );
}
