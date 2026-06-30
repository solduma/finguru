"use client";

import { useMemo } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import LineChart from "@/components/charts/LineChart";
import BarChart from "@/components/charts/BarChart";
import {
  rows,
  yoy,
  recessionSpans,
  recessionGauge,
  currentRegime,
  sahm,
  latest,
  type Quadrant,
} from "@/lib/macro";
import type { Locale, Dict } from "@/lib/i18n";

type T = Dict["practical"];
type MT = Dict["practical"]["macro"];

const QUADS: Quadrant[] = ["goldilocks", "reflation", "stagflation", "deflation"];

export default function MacroLab({
  t,
  strategyLabel,
  strategyHref,
}: {
  locale: Locale;
  t: T;
  strategyLabel: string;
  strategyHref: string;
}) {
  const m = t.macro;
  const R = rows();
  const labels = R.map((r) => r.month);
  const cpiYoY = useMemo(() => yoy("cpi").map((v) => (v == null ? null : v * 100)), []);
  const spans = useMemo(() => recessionSpans(), []);
  const xZones = spans.map((s) => ({ x1: s.start, x2: s.end }));
  const gauge = recessionGauge();
  const regime = currentRegime();
  const s = sahm();

  const ff = latest("fedFunds");
  const un = latest("unemployment");
  const cpiLatest = (() => {
    for (let i = cpiYoY.length - 1; i >= 0; i--) if (cpiYoY[i] != null) return cpiYoY[i];
    return null;
  })();

  const series = [
    { key: "yieldCurve" as const, label: m.yieldCurve, level: 0 },
    { key: "unemployment" as const, label: m.unemployment },
    { key: "cpiYoY" as const, label: m.cpiYoY, level: 2 },
    { key: "fedFunds" as const, label: m.fedFunds },
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
          <h1 className="text-3xl font-bold text-white">{m.title}</h1>
          <p className="max-w-2xl text-gray-300">{m.intro}</p>
        </div>
      </Reveal>

      {/* Right-now verdict */}
      <Reveal index={1}>
        <div className="rounded-lg border border-white/10 bg-[#131722] p-4">
          <h2 className="mb-2 text-sm uppercase tracking-wide text-gray-500">
            {m.verdictHeading}
          </h2>
          <p className="text-gray-200">
            {m.fedFunds}: <b className="text-teal-300">{ff?.value.toFixed(2)}%</b> ·{" "}
            {m.unemployment}: <b className="text-teal-300">{un?.value.toFixed(1)}%</b> ·{" "}
            {m.cpiYoY}: <b className="text-teal-300">{cpiLatest?.toFixed(1)}%</b> · Sahm:{" "}
            <b className="text-teal-300">{s.value?.toFixed(2)}</b>
          </p>
          <p className="mt-1 text-sm text-gray-400">
            {m.currentRegime}: <b className="text-amber-300">{m.quadrants[regime.quadrant]}</b>
          </p>
        </div>
      </Reveal>

      {/* Recession-risk gauge */}
      <Reveal>
        <h2 className="mb-3 text-xl font-semibold text-white">{m.gaugeHeading}</h2>
        <BarChart
          caption={m.gaugeScore}
          horizontal
          yMax={100}
          labels={[...gauge.parts.map((p) => p.label), m.gaugeScore]}
          series={[
            {
              label: m.gaugeScore,
              data: [...gauge.parts.map((p) => p.value), gauge.score],
              color: [
                ...gauge.parts.map(() => "#38bdf8"),
                gauge.score > 60 ? "#ef4444" : gauge.score > 35 ? "#f59e0b" : "#22c55e",
              ],
            },
          ]}
        />
      </Reveal>

      {/* Growth × inflation quadrant */}
      <Reveal>
        <h2 className="mb-3 text-xl font-semibold text-white">{m.regimeHeading}</h2>
        <div className="grid grid-cols-2 gap-3">
          {QUADS.map((q) => (
            <div
              key={q}
              className={`rounded-lg border p-4 ${
                q === regime.quadrant
                  ? "border-amber-400/60 bg-amber-400/10"
                  : "border-white/10 bg-[#131722]"
              }`}
            >
              <div className="font-semibold text-white">{m.quadrants[q]}</div>
              <div className="mt-1 text-sm text-gray-400">{m.quadrantTilts[q]}</div>
            </div>
          ))}
        </div>
        <p className="mt-2 text-sm text-gray-400">
          {m.growth}: <b className="text-teal-300">{regime.growthRising ? m.rising : m.falling}</b>{" "}
          · {m.inflation}:{" "}
          <b className="text-teal-300">{regime.inflationRising ? m.rising : m.falling}</b>
        </p>
      </Reveal>

      {/* Signal charts with recession shading */}
      <Reveal>
        <h2 className="mb-1 text-xl font-semibold text-white">{m.seriesHeading}</h2>
        <p className="mb-3 text-xs text-gray-500">{m.recessionShade}</p>
        <div className="space-y-6">
          {series.map((sd) => {
            const data =
              sd.key === "cpiYoY"
                ? cpiYoY
                : R.map((r) => (r[sd.key] as number | undefined) ?? null);
            return (
              <LineChart
                key={sd.key}
                caption={sd.label}
                labels={labels}
                height={200}
                hideXTicks={false}
                series={[{ label: sd.label, data, color: "#2dd4bf" }]}
                xZones={xZones}
                levels={sd.level != null ? [{ y: sd.level, label: "" }] : []}
              />
            );
          })}
        </div>
      </Reveal>

      <Reveal>
        <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-4">
          <p className="text-sm text-gray-200">{m.lesson}</p>
        </div>
      </Reveal>
      <Reveal>
        <div className="space-y-2 border-t border-white/10 pt-4 text-xs text-gray-500">
          <p>{t.disclaimer}</p>
          <p>{m.fredNotice}</p>
        </div>
      </Reveal>
    </div>
  );
}
