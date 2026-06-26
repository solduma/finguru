// Central Chart.js registration. Imported once by chart components.
import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarController,
  BarElement,
  ScatterController,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import annotationPlugin from "chartjs-plugin-annotation";
import {
  CandlestickController,
  CandlestickElement,
} from "chartjs-chart-financial";

let registered = false;

export function ensureRegistered() {
  if (registered) return;
  ChartJS.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    BarController,
    BarElement,
    ScatterController,
    CandlestickController,
    CandlestickElement,
    Tooltip,
    Legend,
    Filler,
    annotationPlugin,
  );
  ChartJS.defaults.color = "rgba(255,255,255,0.55)";
  ChartJS.defaults.font.family =
    'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
  registered = true;
}
