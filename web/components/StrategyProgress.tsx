"use client";

import { useEffect, useState } from "react";
import { doneCount } from "@/lib/progress";

// A per-path completion bar for the strategy page. Reads localStorage progress
// (lessons + the lab) and updates live as the learner marks things done in
// other tabs or on lesson pages. Hydration-safe: shows 0/N until mounted.
export default function StrategyProgress({
  ids,
  t,
}: {
  ids: string[];
  t: { progressLabel: string; progressComplete: string };
}) {
  const [done, setDone] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const refresh = () => setDone(doneCount(ids));
    refresh();
    setMounted(true);
    // Same-tab updates fire a CustomEvent; cross-tab fire the storage event.
    window.addEventListener("finguru:progress", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("finguru:progress", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [ids]);

  const total = ids.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const complete = mounted && done >= total && total > 0;

  return (
    <div
      className="rounded-lg border border-white/10 bg-[#131722] p-4"
      role="group"
      aria-label={t.progressLabel}
    >
      <div className="mb-2 flex items-baseline justify-between gap-3 text-sm">
        <span className="font-medium text-gray-200">
          {complete
            ? t.progressComplete
            : t.progressLabel
                .replace("{done}", String(mounted ? done : 0))
                .replace("{total}", String(total))}
        </span>
        <span className="text-xs text-gray-500">{mounted ? pct : 0}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-teal-500 transition-[width] duration-500"
          style={{ width: `${mounted ? pct : 0}%` }}
        />
      </div>
    </div>
  );
}
