"use client";

import { useEffect, useState } from "react";
import { isDone, setDone } from "@/lib/progress";

// A single "mark this lesson complete" control, persisted to localStorage. Kept
// deliberately small and dependency-free. Hydration-safe: renders the same
// unchecked shell on server and first client paint, then reads storage in an
// effect (so SSR/CSR markup matches and React doesn't warn).
export default function LessonProgress({
  lessonKey,
  strategyId,
  t,
}: {
  /** "<kind>:<slug>", e.g. "guru:charles-dow". */
  lessonKey: string;
  /** Present when arrived via a strategy path — recorded for future per-path %. */
  strategyId?: string;
  t: {
    markComplete: string;
    completed: string;
  };
}) {
  const id = `lesson:${lessonKey}`;
  const [done, setDoneState] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setDoneState(isDone(id));
    setReady(true);
  }, [id]);

  function toggle() {
    const next = !done;
    setDoneState(next);
    setDone(id, next, Date.now());
    // Record the lab id namespace touch so a path page can compute completion
    // even before the lab is done (no-op today; keeps the API forward-looking).
    void strategyId;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={done}
      // Invisible until hydrated so the pre-hydration shell can't show a wrong state.
      className={
        "flex w-full items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition " +
        (done
          ? "border-teal-400/50 bg-teal-400/10 text-teal-200"
          : "border-white/10 bg-[#131722] text-gray-300 hover:border-teal-400/40 hover:text-teal-200") +
        (ready ? "" : " opacity-0")
      }
    >
      <span
        aria-hidden
        className={
          "flex h-5 w-5 flex-none items-center justify-center rounded-full border text-xs " +
          (done ? "border-teal-400 bg-teal-500 text-black" : "border-gray-500 text-transparent")
        }
      >
        ✓
      </span>
      {done ? t.completed : t.markComplete}
    </button>
  );
}
