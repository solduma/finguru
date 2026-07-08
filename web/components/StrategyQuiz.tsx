"use client";

import { useState } from "react";
import Link from "next/link";
import { QUESTIONS, scoreQuiz, type StrategyId } from "@/lib/quiz";
import type { Locale } from "@/lib/i18n";
import Reveal from "@/components/Reveal";

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
  startHere: string;
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
  foundationNote: string;
  experienceNote: string;
  suitabilityLabel: string;
  suitabilityShort: string;
  seeAll: string;
  hideAll: string;
  allTitle: string;
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
  const [showAll, setShowAll] = useState(false);

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
    setShowAll(false);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <div className="space-y-6 anim-fade-up">
        <h1 className="text-3xl font-bold text-white">{t.title}</h1>
        <p className="max-w-2xl text-gray-300">{t.intro}</p>
        <button
          type="button"
          onClick={() => setPhase("quiz")}
          className="rounded-md bg-teal-500 px-5 py-2 font-semibold text-black"
        >
          {t.start}
        </button>
        {/* Never-invested on-ramp: send absolute beginners to the primer first. */}
        <Link
          href={`/${locale}/indicators/investing-basics`}
          className="block max-w-2xl text-sm text-amber-200/90 no-underline hover:text-amber-100"
        >
          {t.startHere}
        </Link>
      </div>
    );
  }

  if (phase === "quiz") {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-teal-500 progress-fill"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
          <p className="text-xs uppercase tracking-wide text-gray-500">
            {t.of.replace("{a}", String(step + 1)).replace("{b}", String(total))}
          </p>
        </div>
        <div key={step} className="anim-fade-up" style={{ ['--reveal-delay' as string]: '120ms' }}>
          <h2 className="text-2xl font-semibold text-white">
            {q.prompt[locale]}
          </h2>
          <div className="space-y-3">
            {q.options.map((opt, oi) => {
              const selected = answers[q.id] === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => choose(opt.id)}
                  className={`block w-full rounded-lg border p-4 text-left transition-colors duration-200 transition duration-[var(--motion-duration-fast)] ease-[var(--motion-ease)] active:scale-[0.98] anim-scale-in ${
                    selected
                      ? "border-teal-400 bg-teal-500/10 anim-select-pulse"
                      : "border-white/10 bg-[#131722] hover:border-teal-400/50"
                  }`}
                >
                  <span className="text-gray-200">{opt.label[locale]}</span>
                </button>
              );
            })}
          </div>
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
  // Suitability score (0–100) per strategy id, from the engine's top-three ranking.
  const suitabilityOf = (id: string) =>
    result.ranked.find((r) => r.id === id)?.suitability;
  const primaryScore = suitabilityOf(result.primary);
  const runners = result.runnersUp
    .map((id) => ({ meta: strategies[id], suitability: suitabilityOf(id) }))
    .filter((r) => r.meta);
  const isDay = result.primary === "active-trading";
  const isActive = [
    "value", "growth", "factor-quant", "global-macro",
    "trend-momentum", "event-driven", "options-income",
  ].includes(result.primary);

  return (
    <div className="space-y-6 anim-fade-up">
      <p className="text-sm uppercase tracking-wide text-gray-500">
        {t.resultTitle}
      </p>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-3xl font-bold text-teal-300 anim-scale-in">{primary.label}</h1>
        {primaryScore !== undefined && (
          <span className="rounded-full border border-teal-400/40 bg-teal-500/10 px-3 py-1 text-sm font-semibold text-teal-200 anim-scale-in">
            {t.suitabilityLabel.replace("{score}", String(primaryScore))}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm uppercase tracking-wide text-gray-500">
          {t.whyFits}
        </p>
        <p className="max-w-2xl text-gray-200">{primary.blurb}</p>
      </div>

      {result.buildFoundationFirst && (
        <Reveal delayMs={360}>
          <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            {t.foundationNote}
          </p>
        </Reveal>
      )}
      {result.dayTradingGated && (
        <Reveal delayMs={400}>
          <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            {t.dayGatedNote}
          </p>
        </Reveal>
      )}
      {result.flooredToPassive && (
        <Reveal delayMs={470}>
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
            {t.floorNote}
          </p>
        </Reveal>
      )}
      {isDay && (
        <Reveal delayMs={540}>
          <p className="rounded-lg border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-200">
            {t.dayWarning}
          </p>
        </Reveal>
      )}
      {result.experienceCaution && (
        <Reveal delayMs={580}>
          <p className="rounded-lg border border-amber-400/40 bg-amber-500/10 p-4 text-sm text-amber-200">
            {t.experienceNote}
          </p>
        </Reveal>
      )}
      {isActive && !result.flooredToPassive && (
        <Reveal delayMs={640}>
          <p className="rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-gray-300">
            {t.activeNote}
          </p>
        </Reveal>
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
            {runners.map((r, i) => (
              <Reveal key={r.meta.id} index={i}>
                <Link
                  href={`/${locale}/strategies/${r.meta.id}`}
                  className="block h-full rounded-lg border border-white/10 bg-[#131722] p-4 no-underline transition hover:border-teal-400/50 hover-lift"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="font-semibold text-teal-300">
                      {r.meta.label}
                    </span>
                    {r.suitability !== undefined && (
                      <span className="flex-none text-xs font-semibold text-teal-200/80">
                        {t.suitabilityShort.replace("{score}", String(r.suitability))}
                      </span>
                    )}
                  </div>
                  {r.suitability !== undefined && (
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-teal-500/70 progress-fill"
                        style={{ width: `${r.suitability}%` }}
                      />
                    </div>
                  )}
                  <div className="mt-2 text-sm text-gray-400">{r.meta.blurb}</div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}

      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowAll((v) => !v)}
          className="text-sm font-medium text-teal-300 hover:text-teal-200"
          aria-expanded={showAll}
        >
          {showAll ? t.hideAll : t.seeAll}
        </button>
        {showAll && (
          <div className="mt-3 space-y-2 anim-fade-up">
            <p className="text-sm uppercase tracking-wide text-gray-500">
              {t.allTitle}
            </p>
            <ul className="space-y-2">
              {result.ranked.map((r) => {
                const meta = strategies[r.id];
                if (!meta) return null;
                return (
                  <li key={r.id}>
                    <Link
                      href={`/${locale}/strategies/${r.id}`}
                      className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#131722] px-3 py-2 no-underline transition hover:border-teal-400/50"
                    >
                      <span className="flex-1 text-sm text-gray-200">
                        {meta.label}
                      </span>
                      <span className="h-1.5 w-24 flex-none overflow-hidden rounded-full bg-white/10">
                        <span
                          className="block h-full rounded-full bg-teal-500/70 progress-fill"
                          style={{ width: `${r.suitability}%` }}
                        />
                      </span>
                      <span className="w-10 flex-none text-right text-xs font-semibold tabular-nums text-teal-200/80">
                        {r.suitability}%
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>

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
