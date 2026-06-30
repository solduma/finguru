"use client";

import { Chart } from "react-chartjs-2";
import { ensureRegistered } from "./register";
import { COLORS, levelLine, zoneBox, pointLabel } from "./theme";
import ChartFrame from "./ChartFrame";

ensureRegistered();

export interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
}

export interface CandleChartProps {
  candles: Candle[];
  labels?: (string | number)[];
  caption?: string;
  height?: number;
  points?: { x: number; y: number; text: string; color?: string }[];
  levels?: { y: number; label: string; color?: string }[];
  zones?: { yMin: number; yMax: number; color?: string; label?: string }[];
}

export default function CandleChart({
  candles,
  labels,
  caption,
  height = 300,
  points = [],
  levels = [],
  zones = [],
}: CandleChartProps) {
  const xLabels =
    labels ?? candles.map((_, i) => i + 1);

  const data = {
    labels: xLabels,
    datasets: [
      {
        label: "Price",
        data: candles.map((c, i) => ({
          x: i,
          o: c.o,
          h: c.h,
          l: c.l,
          c: c.c,
        })),
        color: {
          up: COLORS.up,
          down: COLORS.down,
          unchanged: COLORS.axis,
        },
        borderColor: {
          up: COLORS.up,
          down: COLORS.down,
          unchanged: COLORS.axis,
        },
      },
    ],
  };

  const annotations: Record<string, unknown> = {};
  zones.forEach((z, i) => {
    annotations[`zone${i}`] = zoneBox(
      z.yMin,
      z.yMax,
      z.color ?? COLORS.zoneNeutral,
      z.label,
    );
  });
  levels.forEach((l, i) => {
    annotations[`level${i}`] = levelLine(l.y, l.label, l.color ?? COLORS.axis);
  });
  points.forEach((p, i) => {
    annotations[`pt${i}`] = pointLabel(p.x, p.y, p.text, p.color);
  });

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: reduceMotion
      ? (false as const)
      : { duration: 1200, easing: "easeInOutQuart" as const },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
      annotation: { annotations },
    },
    scales: {
      x: {
        type: "category" as const,
        grid: { color: COLORS.grid },
        ticks: { display: false },
        offset: true,
      },
      y: {
        grid: { color: COLORS.grid },
        ticks: { color: COLORS.axis, font: { size: 10 } },
      },
    },
  };

  return (
    <ChartFrame caption={caption} height={height}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Chart type="candlestick" data={data as any} options={options as any} />
    </ChartFrame>
  );
}
