"use client";

import { Chart } from "react-chartjs-2";
import { ensureRegistered } from "./register";
import { COLORS, levelLine, zoneBox, pointLabel, CHART_PADDING, legendConfig } from "./theme";
import ChartFrame from "./ChartFrame";

ensureRegistered();

interface Series {
  label: string;
  data: (number | null)[];
  color?: string;
  dashed?: boolean;
  fill?: boolean;
  width?: number;
}

interface Point {
  x: number; // x index
  y: number;
  text: string;
  color?: string;
}
interface Level {
  y: number;
  label: string;
  color?: string;
}
interface Zone {
  yMin: number;
  yMax: number;
  color?: string;
  label?: string;
}
interface Trendline {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  label?: string;
  dashed?: boolean;
}

export interface LineChartProps {
  series: Series[];
  labels?: (string | number)[];
  caption?: string;
  height?: number;
  yMin?: number;
  yMax?: number;
  hideLegend?: boolean;
  hideXTicks?: boolean;
  points?: Point[];
  levels?: Level[];
  zones?: Zone[];
  trendlines?: Trendline[];
}

const PALETTE = [COLORS.accent, COLORS.blue, COLORS.amber, COLORS.purple];

export default function LineChart({
  series,
  labels,
  caption,
  height = 300,
  yMin,
  yMax,
  hideLegend,
  hideXTicks = true,
  points = [],
  levels = [],
  zones = [],
  trendlines = [],
}: LineChartProps) {
  const n = series[0]?.data.length ?? 0;
  const xLabels = labels ?? Array.from({ length: n }, (_, i) => i + 1);

  const datasets = series.map((s, i) => {
    const color = s.color ?? PALETTE[i % PALETTE.length];
    return {
      label: s.label,
      data: s.data,
      borderColor: color,
      backgroundColor: s.fill ? color + "22" : color,
      borderDash: s.dashed ? [6, 4] : undefined,
      borderWidth: s.width ?? 2,
      fill: s.fill ? "origin" : false,
      pointRadius: 0,
      tension: 0.25,
      spanGaps: true,
    };
  });

  // Build annotation map from the declarative props.
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
  trendlines.forEach((t, i) => {
    annotations[`trend${i}`] = {
      type: "line",
      xMin: t.x1,
      xMax: t.x2,
      yMin: t.y1,
      yMax: t.y2,
      borderColor: t.color ?? COLORS.purple,
      borderWidth: 2,
      borderDash: t.dashed ? [6, 4] : undefined,
      label: t.label
        ? {
            content: t.label,
            display: true,
            color: t.color ?? COLORS.purple,
            backgroundColor: "rgba(0,0,0,0.55)",
            font: { size: 10 },
            padding: 3,
          }
        : undefined,
    };
  });
  // Resolve the visible value ranges so edge points can anchor their labels
  // inward (toward the plot center) instead of spilling off the canvas.
  const lastIndex = Math.max(n - 1, 1);
  const yValues = series.flatMap((s) => s.data).filter((v): v is number => v != null);
  const dataYMin = yMin ?? (yValues.length ? Math.min(...yValues) : 0);
  const dataYMax = yMax ?? (yValues.length ? Math.max(...yValues) : 1);
  const ySpan = dataYMax - dataYMin || 1;
  points.forEach((p, i) => {
    // Near an edge, anchor the label box so it grows inward (and so stays on
    // canvas). position.x:"start" puts the box's LEFT edge at the point (box
    // grows right) — what a left-edge point needs; "end" mirrors it. For y,
    // "start" anchors the box top at the point (box grows DOWN) — what a
    // top-of-range point needs so its label sits below the dot.
    const xFrac = p.x / lastIndex;
    const xAnchor =
      xFrac <= 0.12 ? "start" : xFrac >= 0.88 ? "end" : "center";
    const yFrac = (p.y - dataYMin) / ySpan;
    const yAnchor =
      yFrac >= 0.85 ? "start" : yFrac <= 0.15 ? "end" : "center";
    // index annotations on the category axis use the data index (0-based)
    annotations[`pt${i}`] = pointLabel(p.x, p.y, p.text, p.color, {
      x: xAnchor,
      y: yAnchor,
    });
  });

  const data = { labels: xLabels, datasets };
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: reduceMotion
      ? (false as const)
      : { duration: 1200, easing: "easeInOutQuart" as const },
    interaction: { intersect: false, mode: "index" as const },
    layout: { padding: CHART_PADDING },
    plugins: {
      legend: legendConfig(!hideLegend && series.length > 1),
      tooltip: { enabled: true },
      annotation: { annotations },
    },
    scales: {
      x: {
        grid: { color: COLORS.grid },
        ticks: { display: !hideXTicks, color: COLORS.axis, font: { size: 10 } },
      },
      y: {
        min: yMin,
        max: yMax,
        grid: { color: COLORS.grid },
        ticks: { color: COLORS.axis, font: { size: 10 } },
      },
    },
  };

  return (
    <ChartFrame caption={caption} height={height}>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Chart type="line" data={data as any} options={options as any} />
    </ChartFrame>
  );
}
