"use client";

import { useState } from "react";

// An in-lesson knowledge-check. Authored inline in MDX:
//
//   <Quiz question="Payout of FCF is 130%. Is the dividend safe?">
//     <Option>Yes — 130% is normal</Option>
//     <Option correct explain="Paying out more cash than it generates isn't sustainable; it's funded by debt or reserves.">
//       No — it's paying out more than it earns
//     </Option>
//   </Quiz>
//
// Multiple <Option> children; mark the right one(s) with `correct`. The learner
// picks, gets immediate right/wrong feedback plus the explanation. Purely
// client-side, no scoring persisted — it's a comprehension check, not a grade.

interface OptionProps {
  children: React.ReactNode;
  correct?: boolean;
  explain?: string;
}

// <Option> is a marker component: it never renders itself. <Quiz> reads its
// props from React children. Rendering it directly (outside Quiz) yields null.
export function Option(_props: OptionProps) {
  return null;
}

interface OptionData {
  label: React.ReactNode;
  correct: boolean;
  explain?: string;
}

function extractOptions(children: React.ReactNode): OptionData[] {
  const out: OptionData[] = [];
  const arr = Array.isArray(children) ? children : [children];
  for (const child of arr) {
    if (
      child &&
      typeof child === "object" &&
      "props" in child &&
      (child as { type?: unknown }).type === Option
    ) {
      const p = (child as { props: OptionProps }).props;
      out.push({ label: p.children, correct: Boolean(p.correct), explain: p.explain });
    }
  }
  return out;
}

export default function Quiz({
  question,
  children,
  checkLabel = "Check answer",
  correctLabel = "Correct",
  incorrectLabel = "Not quite",
}: {
  question: string;
  children: React.ReactNode;
  checkLabel?: string;
  correctLabel?: string;
  incorrectLabel?: string;
}) {
  const options = extractOptions(children);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  const chosen = picked != null ? options[picked] : null;
  const isCorrect = chosen?.correct ?? false;

  return (
    <div className="not-prose my-6 rounded-lg border border-teal-400/25 bg-teal-400/5 p-4">
      <p className="font-semibold text-white">{question}</p>
      <ul className="mt-3 space-y-2" role="radiogroup" aria-label={question}>
        {options.map((o, i) => {
          const selected = picked === i;
          const showState = revealed && selected;
          return (
            <li key={i}>
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setPicked(i);
                  setRevealed(false);
                }}
                className={
                  "flex w-full items-center gap-3 rounded-md border px-3 py-2 text-left text-sm transition " +
                  (showState
                    ? o.correct
                      ? "border-teal-400 bg-teal-500/15 text-teal-100"
                      : "border-red-400/60 bg-red-500/10 text-red-100"
                    : selected
                      ? "border-teal-400/60 bg-white/5 text-white"
                      : "border-white/10 bg-[#131722] text-gray-300 hover:border-teal-400/40")
                }
              >
                <span
                  aria-hidden
                  className={
                    "flex h-4 w-4 flex-none items-center justify-center rounded-full border text-[10px] " +
                    (selected ? "border-teal-400" : "border-gray-500")
                  }
                >
                  {selected ? "●" : ""}
                </span>
                <span>{o.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        onClick={() => setRevealed(true)}
        disabled={picked == null}
        className="mt-3 rounded-md bg-teal-500 px-4 py-1.5 text-sm font-semibold text-black transition enabled:hover:bg-teal-400 disabled:opacity-30"
      >
        {checkLabel}
      </button>

      {revealed && chosen && (
        <div
          role="status"
          className={
            "mt-3 rounded-md border p-3 text-sm " +
            (isCorrect
              ? "border-teal-400/40 bg-teal-500/10 text-teal-100"
              : "border-amber-400/40 bg-amber-500/10 text-amber-100")
          }
        >
          <span className="font-semibold">
            {isCorrect ? `✓ ${correctLabel}` : `✕ ${incorrectLabel}`}
          </span>
          {/* Show the chosen option's explanation, and if wrong, the correct one's. */}
          {chosen.explain && <span className="ml-1">{chosen.explain}</span>}
          {!isCorrect &&
            options.find((o) => o.correct)?.explain &&
            !chosen.explain && (
              <span className="ml-1">
                {options.find((o) => o.correct)?.explain}
              </span>
            )}
        </div>
      )}
    </div>
  );
}
