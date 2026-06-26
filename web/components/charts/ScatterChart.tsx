"use client";

import { Chart } from "react-chartjs-2";
import { ensureRegistered } from "./register";
import { COLORS } from "./theme";
import ChartFrame from "./ChartFrame";

ensureRegistered();

interface ScatterPoint {
  x: number;
  y: number;
  label?: string; // optional per-point annotation (e.g. an asset name)
}
interface ScatterSeries {
  label: string;
  data: ScatterPoint[];
  color?: string;
  /** Draw as a connected line (e.g. the efficient frontier curve). */
  line?: boolean;
  dashed?: boolean;
}

export interface ScatterChartProps {
  series: ScatterSeries[];
  caption?: string;
  height?: number;
  xLabel?: string; // e.g. "Risk (volatility, %)"
  yLabel?: string; // e.g. "Expected return (%)"
  xMin?: number;
  xMax?: number;
  yMin?: number;
  yMax?: number;
  hideLegend?: boolean;
}

const PALETTE = [COLORS.accent, COLORS.blue, COLORS.amber, COLORS.purple];

/**
 * Risk/return scatter for the quant lessons: the efficient frontier, the
 * Capital Market Line, value-vs-momentum planes, factor scatter. Points may
 * carry a label; a series may render as a connected line (the frontier curve).
 */
export default function ScatterChart({
  series,
  caption,
  height = 320,
  xLabel,
  yLabel,
  xMin,
  xMax,
  yMin,
  yMax,
  hideLegend,
}: ScatterChartProps) {
  const datasets = series.map((s, i) => {
    const color = s.color ?? PALETTE[i % PALETTE.length];
    return {
      label: s.label,
      data: s.data,
      backgroundColor: color,
      borderColor: color,
      borderDash: s.dashed ? [6, 4] : undefined,
      showLine: !!s.line,
      borderWidth: s.line ? 2 : 0,
      pointRadius: s.line ? 0 : 5,
      pointHoverRadius: 6,
      tension: s.line ? 0.3 : 0,
    };
  });

  // Point labels (asset names) become annotation labels.
  const annotations: Record<string, unknown> = {};
  series.forEach((s, si) => {
    if (s.line) return;
    s.data.forEach((p, pi) => {
      if (!p.label) return;
      annotations[`lbl${si}_${pi}`] = {
        type: "label" as const,
        xValue: p.x,
        yValue: p.y,
        content: [p.label],
        color: s.color ?? PALETTE[si % PALETTE.length],
        backgroundColor: "rgba(0,0,0,0.55)",
        font: { size: 10, weight: "bold" as const },
        padding: 3,
        borderRadius: 4,
        yAdjust: -14,
      };
    });
  });

  const axis = (
    label: string | undefined,
    min: number | undefined,
    max: number | undefined,
  ) => ({
    type: "linear" as const,
    min,
    max,
    grid: { color: COLORS.grid },
    ticks: { color: COLORS.axis, font: { size: 10 } },
    title: label
      ? { display: true, text: label, color: COLORS.axis, font: { size: 11 } }
      : undefined,
  });

  const data = { datasets };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !hideLegend && series.length > 1,
        labels: { boxWidth: 12, font: { size: 11 } },
        position: "top" as const,
        align: "end" as const,
      },
      tooltip: { enabled: true },
      annotation: { annotations },
    },
    scales: {
      x: axis(xLabel, xMin, xMax),
      y: axis(yLabel, yMin, yMax),
    },
  };

  return (
    <ChartFrame caption={caption} height={height}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Chart type="scatter" data={data as any} options={options as any} />
    </ChartFrame>
  );
}
