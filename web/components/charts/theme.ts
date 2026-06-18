// Shared dark-theme palette + Chart.js defaults for all lesson charts.
export const COLORS = {
  price: "#e6e9ef",
  accent: "#2dd4bf", // teal
  up: "#22c55e",
  down: "#ef4444",
  blue: "#38bdf8",
  amber: "#f59e0b",
  purple: "#a78bfa",
  grid: "rgba(255,255,255,0.08)",
  axis: "rgba(255,255,255,0.45)",
  zoneGood: "rgba(34,197,94,0.12)",
  zoneBad: "rgba(239,68,68,0.12)",
  zoneNeutral: "rgba(45,212,191,0.10)",
};

// A reusable annotation-line helper (threshold/level lines with a label).
export function levelLine(
  value: number,
  label: string,
  color = COLORS.axis,
  dash: number[] = [4, 4],
) {
  return {
    type: "line" as const,
    yMin: value,
    yMax: value,
    borderColor: color,
    borderWidth: 1,
    borderDash: dash,
    label: {
      content: label,
      display: true,
      position: "start" as const,
      backgroundColor: "rgba(0,0,0,0.6)",
      color,
      font: { size: 10 },
      padding: 3,
    },
  };
}

// A horizontal shaded zone between two y-values.
export function zoneBox(
  yMin: number,
  yMax: number,
  color: string,
  label?: string,
) {
  return {
    type: "box" as const,
    yMin,
    yMax,
    backgroundColor: color,
    borderWidth: 0,
    label: label
      ? {
          content: label,
          display: true,
          position: { x: "end" as const, y: "center" as const },
          color: COLORS.axis,
          font: { size: 10 },
        }
      : undefined,
  };
}

// A labeled point marker (e.g. "HH", "HL", wave "3").
export function pointLabel(
  xValue: number | string,
  yValue: number,
  text: string,
  color = COLORS.accent,
) {
  return {
    type: "label" as const,
    xValue,
    yValue,
    content: [text],
    color,
    backgroundColor: "rgba(0,0,0,0.55)",
    font: { size: 11, weight: "bold" as const },
    padding: 4,
    borderRadius: 4,
  };
}
