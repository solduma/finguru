"use client";

import LineChart from "./LineChart";
import { COLORS } from "./theme";

export interface DrawdownChartProps {
  /** Drawdown values, each ≤ 0 (e.g. -0.32 = −32% from the prior peak). */
  data: number[];
  labels: (string | number)[];
  caption?: string;
  height?: number;
  color?: string;
}

// The "pain chart": how far a portfolio sat below its running peak over time.
// A filled-to-origin LineChart of the (≤0) drawdown series — reuses LineChart's
// fill + axis handling rather than re-deriving Chart.js config.
export default function DrawdownChart({
  data,
  labels,
  caption,
  height = 200,
  color = COLORS.down,
}: DrawdownChartProps) {
  const min = data.length ? Math.min(...data) : 0;
  return (
    <LineChart
      series={[{ label: "Drawdown", data, color, fill: true }]}
      labels={labels}
      caption={caption}
      height={height}
      yMin={Math.min(min * 1.1, -0.05)}
      yMax={0}
      hideLegend
      hideXTicks={false}
    />
  );
}
