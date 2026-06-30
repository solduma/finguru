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

// Canvas-edge breathing room. Annotation/point labels anchored near an axis
// edge spill outward; on narrow (mobile) canvases that overflow is sheared off.
// Reserving a few px of layout padding gives those labels room to render inside
// the canvas. Paired with `clip:false` on the labels themselves.
export const CHART_PADDING = { left: 8, right: 8, top: 8, bottom: 4 };

// Shared legend config. `align: "center"` (not "end") keeps a wide legend from
// running off the right edge of a narrow canvas; Chart.js wraps it across lines.
export const legendConfig = (display: boolean) => ({
  display,
  labels: { boxWidth: 12, font: { size: 11 } },
  position: "top" as const,
  align: "center" as const,
});

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
      // Don't clip the label box to the plot area: on narrow (mobile) canvases
      // a label anchored near an edge would otherwise be sheared off. The chart
      // layout padding (set per-chart) reserves canvas room for it to spill into.
      clip: false,
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
          clip: false,
        }
      : undefined,
  };
}

// How to anchor a point label relative to its marker, so a label near an edge
// is pushed *inward* (toward the plot center) instead of spilling off-canvas.
// "start"/"end" map to the annotation plugin's box-anchor positions: with
// position.x:"start" the box's left edge sits at the point and the box grows
// rightward — exactly what a left-edge point needs.
export interface LabelAnchor {
  x?: "start" | "center" | "end";
  y?: "start" | "center" | "end";
}

// A labeled point marker (e.g. "HH", "HL", wave "3"). `anchor` positions the
// label box around the point so edge labels stay on-canvas.
export function pointLabel(
  xValue: number | string,
  yValue: number,
  text: string,
  color = COLORS.accent,
  anchor?: LabelAnchor,
) {
  const xPos = anchor?.x ?? "center";
  const yPos = anchor?.y ?? "center";
  // Nudge the box off the marker so it doesn't sit on top of the dot. The sign
  // follows the anchor: a box growing right (x:"start") nudges right, etc.
  const xAdjust = xPos === "start" ? 8 : xPos === "end" ? -8 : 0;
  const yAdjust = yPos === "start" ? 12 : yPos === "end" ? -12 : -14;
  return {
    type: "label" as const,
    xValue,
    yValue,
    content: [text],
    color,
    position: { x: xPos, y: yPos },
    xAdjust,
    yAdjust,
    backgroundColor: "rgba(0,0,0,0.55)",
    font: { size: 11, weight: "bold" as const },
    padding: 4,
    borderRadius: 4,
    // Allow the marker label to render past the plot-area edge (see levelLine).
    clip: false,
  };
}
