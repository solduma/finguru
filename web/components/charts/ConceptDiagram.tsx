"use client";

import { useEffect, useId, useRef, useState } from "react";
import ChartFrame from "./ChartFrame";

export interface ConceptDiagramProps {
  /** A Mermaid definition (flowchart, sequenceDiagram, etc.) as a string. */
  chart: string;
  caption?: string;
  height?: number;
}

/**
 * Renders a Mermaid diagram for conceptual (non-price) ideas the
 * fundamental/quant/macro lessons lean on — feedback loops (Soros's
 * reflexivity), process pipelines (a quant signal → backtest → sizing flow),
 * cause-and-effect chains (Dalio's economic machine, Minsky's progression).
 *
 * Text-based by design: it diffs cleanly in git, the content workflow can
 * author it like chart props, and the RAG chunker strips the definition so
 * Mermaid syntax never pollutes the embedding text (see api/app/rag/chunk.py).
 *
 * Mermaid is lazy-loaded so it never enters the server bundle, and rendered
 * imperatively (not via mermaid.run) so each diagram gets a unique id and
 * re-renders safely on the client.
 */
export default function ConceptDiagram({
  chart,
  caption,
  height = 320,
}: ConceptDiagramProps) {
  const rawId = useId();
  const id = "mmd" + rawId.replace(/[^a-zA-Z0-9]/g, "");
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          themeVariables: {
            background: "#0f131c",
            primaryColor: "#0f131c",
            primaryTextColor: "#e6e9ef",
            primaryBorderColor: "#2dd4bf",
            lineColor: "#7c8499",
            fontSize: "14px",
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          },
        });
        const { svg } = await mermaid.render(id, chart.trim());
        if (!cancelled && ref.current) ref.current.innerHTML = svg;
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <ChartFrame caption={caption} height={height}>
      {error ? (
        <div className="flex h-full items-center justify-center text-center text-xs text-red-400">
          Diagram failed to render: {error}
        </div>
      ) : (
        <div
          ref={ref}
          className="flex h-full items-center justify-center [&_svg]:!max-h-full [&_svg]:!max-w-full"
        />
      )}
    </ChartFrame>
  );
}
