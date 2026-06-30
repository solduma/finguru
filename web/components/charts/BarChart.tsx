"use client";

import { Chart } from "react-chartjs-2";
import { ensureRegistered } from "./register";
import { COLORS, levelLine, CHART_PADDING, legendConfig } from "./theme";
import ChartFrame from "./ChartFrame";

ensureRegistered();

interface BarSeries {
  label: string;
  data: (number | null)[];
  /** A single fill color, or one color per bar for per-category emphasis. */
  color?: string | string[];
}
interface Level {
  y: number;
  label: string;
  color?: string;
}

export interface BarChartProps {
  /** Category labels along the x-axis (e.g. factor names, decades, companies). */
  labels: string[];
  /** One or more series. A single series gets per-bar palette colors. */
  series: BarSeries[];
  caption?: string;
  height?: number;
  yMin?: number;
  yMax?: number;
  /** Axis title for the value axis, e.g. "Annualized return (%)". */
  yLabel?: string;
  horizontal?: boolean;
  hideLegend?: boolean;
  /** Horizontal reference lines (e.g. a 0% line, or a benchmark). */
  levels?: Level[];
}

const PALETTE = [
  COLORS.accent,
  COLORS.blue,
  COLORS.amber,
  COLORS.purple,
  COLORS.up,
  COLORS.down,
];

/**
 * Categorical bar chart for the fundamental/quant lessons: factor premia,
 * valuation multiples, return comparisons, allocation weights. Mirrors
 * LineChart's declarative, theme-driven API so lesson authors stay consistent.
 */
export default function BarChart({
  labels,
  series,
  caption,
  height = 300,
  yMin,
  yMax,
  yLabel,
  horizontal = false,
  hideLegend,
  levels = [],
}: BarChartProps) {
  const datasets = series.map((s, i) => ({
    label: s.label,
    data: s.data,
    backgroundColor:
      s.color ??
      (series.length === 1
        ? labels.map((_, j) => PALETTE[j % PALETTE.length])
        : PALETTE[i % PALETTE.length]),
    borderWidth: 0,
    borderRadius: 4,
    maxBarThickness: 56,
  }));

  const annotations: Record<string, unknown> = {};
  levels.forEach((l, i) => {
    annotations[`level${i}`] = levelLine(l.y, l.label, l.color ?? COLORS.axis);
  });

  const valueAxis = {
    min: yMin,
    max: yMax,
    grid: { color: COLORS.grid },
    ticks: { color: COLORS.axis, font: { size: 10 } },
    title: yLabel
      ? { display: true, text: yLabel, color: COLORS.axis, font: { size: 11 } }
      : undefined,
  };
  const catAxis = {
    grid: { color: COLORS.grid },
    ticks: { color: COLORS.axis, font: { size: 11 } },
  };

  const data = { labels, datasets };
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const options = {
    indexAxis: horizontal ? ("y" as const) : ("x" as const),
    responsive: true,
    maintainAspectRatio: false,
    animation: reduceMotion
      ? (false as const)
      : { duration: 1200, easing: "easeInOutQuart" as const },
    layout: { padding: CHART_PADDING },
    plugins: {
      legend: legendConfig(!hideLegend && series.length > 1),
      tooltip: { enabled: true },
      annotation: { annotations },
    },
    scales: {
      x: horizontal ? valueAxis : catAxis,
      y: horizontal ? catAxis : valueAxis,
    },
  };

  return (
    <ChartFrame caption={caption} height={height}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Chart type="bar" data={data as any} options={options as any} />
    </ChartFrame>
  );
}
