"use client";

import { Chart } from "react-chartjs-2";
import { ensureRegistered } from "./register";
import { COLORS, CHART_PADDING, legendConfig } from "./theme";
import ChartFrame from "./ChartFrame";

ensureRegistered();

interface AreaSeries {
  label: string;
  data: number[];
  color?: string;
}

export interface StackedAreaChartProps {
  /** Series stacked bottom-to-top; values are typically shares summing to 1 (or %). */
  series: AreaSeries[];
  labels: (string | number)[];
  caption?: string;
  height?: number;
  /** Stacked max — e.g. 1 for fractions, 100 for percent. Default 1. */
  yMax?: number;
  hideLegend?: boolean;
  hideXTicks?: boolean;
}

const PALETTE = [COLORS.accent, COLORS.blue, COLORS.amber, COLORS.purple, COLORS.up];

// Allocation-over-time visual (the lifecycle glide path: stock/bond/cash shares
// shifting across the years). A stacked, filled area chart — distinct from
// LineChart, which overlays transparent series without stacking.
export default function StackedAreaChart({
  series,
  labels,
  caption,
  height = 300,
  yMax = 1,
  hideLegend,
  hideXTicks = false,
}: StackedAreaChartProps) {
  const datasets = series.map((s, i) => {
    const color = s.color ?? PALETTE[i % PALETTE.length];
    return {
      label: s.label,
      data: s.data,
      borderColor: color,
      backgroundColor: color + "55",
      borderWidth: 1,
      fill: i === 0 ? "origin" : "-1",
      pointRadius: 0,
      tension: 0.2,
    };
  });

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: reduceMotion
      ? (false as const)
      : { duration: 900, easing: "easeInOutQuart" as const },
    interaction: { intersect: false, mode: "index" as const },
    layout: { padding: CHART_PADDING },
    plugins: {
      legend: legendConfig(!hideLegend && series.length > 1),
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        stacked: true,
        grid: { color: COLORS.grid },
        ticks: { display: !hideXTicks, color: COLORS.axis, font: { size: 10 } },
      },
      y: {
        stacked: true,
        min: 0,
        max: yMax,
        grid: { color: COLORS.grid },
        ticks: { color: COLORS.axis, font: { size: 10 } },
      },
    },
  };

  const data = { labels, datasets };
  return (
    <ChartFrame caption={caption} height={height}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Chart type="line" data={data as any} options={options as any} />
    </ChartFrame>
  );
}
