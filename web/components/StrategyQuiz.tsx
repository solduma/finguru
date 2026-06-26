"use client";

import { useState } from "react";
import Link from "next/link";
import { QUESTIONS, scoreQuiz, type StrategyId } from "@/lib/quiz";
import type { Locale } from "@/lib/i18n";

// Minimal serializable strategy metadata passed from the server page.
export interface StrategyMeta {
  id: StrategyId;
  label: string;
  blurb: string;
}

interface QuizStrings {
  title: string;
  intro: string;
  start: string;
  of: string;
  back: string;
  next: string;
  seeResult: string;
  retake: string;
  resultTitle: string;
  whyFits: string;
  alsoExplore: string;
  startPath: string;
  floorNote: string;
  activeNote: string;
  dayGatedNote: string;
  dayWarning: string;
}

type Phase = "intro" | "quiz" | "result";

export default function StrategyQuiz({
  locale,
  strategies,
  t,
}: {
  locale: Locale;
  strategies: Record<string, StrategyMeta>;
  t: QuizStrings;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  function choose(optionId: string) {
    const next = { ...answers, [q.id]: optionId };
    setAnswers(next);
    if (step < total - 1) {
      setStep(step + 1);
    } else {
      setPhase("result");
    }
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <p className="max-w-2xl text-gray-300">{t.intro}</p>
        <button
          type="button"
          onClick={() => setPhase("quiz")}
          className="rounded-md bg-teal-500 px-5 py-2 font-semibold text-black"
        >
          {t.start}
        </button>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-teal-500 transition-all"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {t.of.replace("{a}", String(step + 1)).replace("{b}", String(total))}
          </p>
        </div>
        <h2 className="text-2xl font-semibold text-white">
          {q.prompt[locale]}
        </h2>
        <div className="space-y-3">
          {q.options.map((opt) => {
            const selected = answers[q.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => choose(opt.id)}
                className={`block w-full rounded-lg border p-4 text-left transition ${
                  selected
                    ? "border-teal-400 bg-teal-500/10"
                    : "border-white/10 bg-[#131722] hover:border-teal-400/50"
                }`}
              >
                <span className="text-gray-200">{opt.label[locale]}</span>
              </button>
            );
          })}
        </div>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="text-sm text-gray-400 hover:text-teal-300"
          >
            {t.back}
          </button>
        )}
      </div>
    );
  }

  // Result.
  const result = scoreQuiz(answers);
  const primary = strategies[result.primary];
  const runners = result.runnersUp
    .map((id) => strategies[id])
    .filter(Boolean);
  const isDay = result.primary === "day-trading";
  const isActive = [
    "value", "growth", "factor-quant", "global-macro",
    "trend-momentum", "event-driven", "swing-trading",
  ].includes(result.primary);

  return (
    <div className="space-y-6">
      <p className="text-sm uppercase tracking-wide text-gray-500">
        {t.resultTitle}
      </p>
      <h1 className="text-3xl font-bold text-teal-300">{primary.label}</h1>

      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          {t.whyFits}
        </p>
        <p className="max-w-2xl text-gray-200">{primary.blurb}</p>
      </div>

      {result.dayTradingGated && (
        <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-200">
          {t.dayGatedNote}
        </p>
      )}
      {result.flooredToPassive && (
        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          {t.floorNote}
        </p>
      )}
      {isDay && (
        <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
          {t.dayWarning}
        </p>
      )}
      {isActive && !result.flooredToPassive && (
        <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
          {t.activeNote}
        </p>
      )}

      <Link
        href={`/${locale}/strategies/${result.primary}`}
        className="inline-block rounded-md bg-teal-500 px-5 py-2 font-semibold text-black no-underline"
      >
        {t.startPath}
      </Link>

      {runners.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-sm uppercase tracking-wide text-gray-500">
            {t.alsoExplore}
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {runners.map((r) => (
              <Link
                key={r.id}
                href={`/${locale}/strategies/${r.id}`}
                className="rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50"
              >
                <div className="font-semibold text-teal-300">{r.label}</div>
                <div className="text-sm text-gray-400">{r.blurb}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={restart}
        className="text-sm text-gray-400 hover:text-teal-300"
      >
        {t.retake}
      </button>
    </div>
  );
}
