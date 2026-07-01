"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import type { Locale } from "@/lib/i18n";
import { pick, type Walkthrough as WT, type WalkStep, type SourceRef } from "@/lib/walkthroughs";

// The guided-walkthrough shell (실습). Renders a walkthrough's steps as a
// stepper; the "tool" step slots in the strategy's analyzer (passed by the
// server page so this stays generic). Teaching + a live tool + the learner's
// own judgment + a checklist — the loop an Analyzer alone doesn't teach.

const UI = {
  step: { en: "Step", ko: "단계" },
  of: { en: "of", ko: "/" },
  next: { en: "Next →", ko: "다음 →" },
  prev: { en: "← Back", ko: "← 이전" },
  backToStrategy: { en: "Back to {s}", ko: "{s}(으)로 돌아가기" },
  goal: { en: "Your goal", ko: "목표" },
  openTool: { en: "Open the standalone tool ↗", ko: "분석 도구 단독으로 열기 ↗" },
  yourNotes: { en: "Write your answer", ko: "당신의 답을 적으세요" },
  notesPlaceholder: {
    en: "Type your reasoning here — the act of writing it is the point.",
    ko: "여기에 근거를 적어 보세요 — 적는 행위 자체가 핵심입니다.",
  },
  done: { en: "You've completed the walkthrough.", ko: "실습을 완료했습니다." },
} as const;

function u(key: keyof typeof UI, locale: Locale) {
  return pick(UI[key], locale);
}

/** Render body text: lines beginning "- " become a bullet list; **bold** and
 *  `code` get light inline styling. Kept deliberately small — content is
 *  trusted (authored in lib/walkthroughs.ts), not user input. */
function Body({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (bullets.length) {
      blocks.push(
        <ul key={blocks.length} className="ml-1 list-disc space-y-1 pl-5 text-gray-300">
          {bullets.map((b, i) => (
            <li key={i}>{inline(b)}</li>
          ))}
        </ul>,
      );
      bullets = [];
    }
  };
  for (const line of text.split("\n")) {
    if (line.startsWith("- ")) bullets.push(line.slice(2));
    else if (line.trim()) {
      flush();
      blocks.push(
        <p key={blocks.length} className="text-gray-300">
          {inline(line)}
        </p>,
      );
    }
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

/** Minimal inline formatter for **bold** and `code`. */
function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**"))
      return (
        <strong key={i} className="font-semibold text-white">
          {tok.slice(2, -2)}
        </strong>
      );
    if (tok.startsWith("`") && tok.endsWith("`"))
      return (
        <code key={i} className="rounded bg-white/10 px-1 text-teal-200">
          {tok.slice(1, -1)}
        </code>
      );
    return tok;
  });
}

// A source: name/what/why, plus either an annotated screenshot (ShotGuide) or a
// written navigation guide (numbered steps) when a screenshot isn't available.
function SourceCard({ s, locale }: { s: SourceRef; locale: Locale }) {
  return (
    <div className="rounded-lg border border-white/10 bg-[#131722] p-4">
      <a
        href={s.url}
        target="_blank"
        rel="noopener noreferrer"
        className="font-semibold text-teal-300 underline"
      >
        {pick(s.name, locale)} ↗
      </a>
      <p className="mt-2 text-sm text-gray-300">{pick(s.what, locale)}</p>
      <p className="mt-1 text-sm text-gray-500">{pick(s.why, locale)}</p>

      {s.shot && <ShotGuide shot={s.shot} locale={locale} />}

      {!s.shot && s.steps && (
        <ol className="mt-3 space-y-2">
          {s.steps.map((st, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-300">
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-teal-500 text-[11px] font-bold text-black">
                {i + 1}
              </span>
              <span>{pick(st, locale)}</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

// Renders a real screenshot with numbered markers + highlight boxes overlaid at
// percentage coordinates (so the overlay stays aligned at any width), and lists
// the same numbered steps beneath it as a legend.
function ShotGuide({ shot, locale }: { shot: SourceRef["shot"] & {}; locale: Locale }) {
  return (
    <figure className="mt-3">
      <div className="relative overflow-hidden rounded-lg border border-white/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={shot.img} alt={pick(shot.alt, locale)} className="block w-full" />
        {/* Highlight boxes: sized in % of the image, so they track any width. */}
        {shot.markers
          .filter((m) => m.w != null && m.h != null)
          .map((m) => (
            <div
              key={`box-${m.n}`}
              className="pointer-events-none absolute rounded border-2 border-amber-400 bg-amber-400/15"
              style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.w}%`, height: `${m.h}%` }}
            />
          ))}
        {/* Numbered badges: anchored at (x,y); for a box, at its top-left corner. */}
        {shot.markers.map((m) => (
          <span
            key={`badge-${m.n}`}
            className="pointer-events-none absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black shadow"
            style={{ left: `${m.x}%`, top: `${m.y}%` }}
          >
            {m.n}
          </span>
        ))}
      </div>
      <ol className="mt-3 space-y-2">
        {shot.markers.map((m) => (
          <li key={m.n} className="flex gap-3 text-sm text-gray-300">
            <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-amber-400 text-[11px] font-bold text-black">
              {m.n}
            </span>
            <span>{pick(m.label, locale)}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function StepView({
  step,
  locale,
  analyzer,
  toolHref,
  note,
  setNote,
  checked,
  toggle,
}: {
  step: WalkStep;
  locale: Locale;
  analyzer: ReactNode;
  toolHref: string;
  note: string;
  setNote: (v: string) => void;
  checked: boolean[];
  toggle: (i: number) => void;
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{pick(step.title, locale)}</h2>
      <Body text={pick(step.body, locale)} />

      {step.kind === "source" && step.sources && (
        <div className="space-y-4">
          {step.sources.map((s, i) => (
            <SourceCard key={i} s={s} locale={locale} />
          ))}
        </div>
      )}

      {step.kind === "tool" && (
        <div className="space-y-2">
          <div className="rounded-lg border border-teal-400/20 bg-[#0f131c] p-4">{analyzer}</div>
          <Link
            href={toolHref}
            className="inline-block text-sm text-teal-400 underline hover:text-teal-300"
          >
            {u("openTool", locale)}
          </Link>
        </div>
      )}

      {step.kind === "judge" && step.prompt && (
        <div className="space-y-2 rounded-lg border border-amber-400/30 bg-amber-400/5 p-4">
          <p className="font-medium text-amber-100">{pick(step.prompt, locale)}</p>
          <label className="block text-sm text-gray-400">
            {u("yourNotes", locale)}
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder={u("notesPlaceholder", locale)}
              className="mt-1 w-full rounded border border-white/10 bg-[#0f131c] px-3 py-2 text-white"
            />
          </label>
        </div>
      )}

      {step.kind === "conclude" && step.checklist && (
        <ul className="space-y-2">
          {step.checklist.map((item, i) => (
            <li key={i}>
              <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-[#131722] p-3 text-gray-200">
                <input
                  type="checkbox"
                  checked={checked[i] ?? false}
                  onChange={() => toggle(i)}
                  className="mt-1 h-4 w-4 accent-teal-500"
                />
                <span className={checked[i] ? "text-gray-400 line-through" : ""}>
                  {pick(item, locale)}
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Walkthrough({
  locale,
  walk,
  analyzer,
  toolHref,
  strategyLabel,
  strategyHref,
  disclaimer,
}: {
  locale: Locale;
  walk: WT;
  analyzer: ReactNode;
  toolHref: string;
  strategyLabel: string;
  strategyHref: string;
  disclaimer: string;
}) {
  const [i, setI] = useState(0);
  const [note, setNote] = useState("");
  const [checked, setChecked] = useState<boolean[]>([]);
  const step = walk.steps[i];
  const last = walk.steps.length - 1;

  return (
    <div className="space-y-8">
      <Reveal index={0}>
        <div className="space-y-2">
          <Link
            href={strategyHref}
            className="text-sm text-gray-400 no-underline hover:text-teal-300"
          >
            {u("backToStrategy", locale).replace("{s}", strategyLabel)}
          </Link>
          <h1 className="text-3xl font-bold text-white">{pick(walk.title, locale)}</h1>
          <div className="rounded-lg border border-teal-400/20 bg-teal-400/5 p-3 text-sm">
            <span className="font-semibold text-teal-300">{u("goal", locale)}: </span>
            <span className="text-gray-200">{pick(walk.goal, locale)}</span>
          </div>
        </div>
      </Reveal>

      {/* Progress */}
      <div className="flex items-center gap-2">
        {walk.steps.map((_, n) => (
          <button
            key={n}
            onClick={() => setI(n)}
            aria-label={`${u("step", locale)} ${n + 1}`}
            className={`h-1.5 flex-1 rounded-full transition ${
              n <= i ? "bg-teal-500" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className="text-xs uppercase tracking-wide text-gray-500">
        {u("step", locale)} {i + 1} {u("of", locale)} {walk.steps.length}
      </p>

      <Reveal key={i}>
        <StepView
          step={step}
          locale={locale}
          analyzer={analyzer}
          toolHref={toolHref}
          note={note}
          setNote={setNote}
          checked={checked}
          toggle={(n) =>
            setChecked((c) => {
              const next = [...c];
              next[n] = !next[n];
              return next;
            })
          }
        />
      </Reveal>

      {/* Nav */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <button
          onClick={() => setI((n) => Math.max(0, n - 1))}
          disabled={i === 0}
          className="rounded px-4 py-2 text-sm text-gray-300 transition enabled:hover:text-white disabled:opacity-30"
        >
          {u("prev", locale)}
        </button>
        {i < last ? (
          <button
            onClick={() => setI((n) => Math.min(last, n + 1))}
            className="rounded bg-teal-500 px-5 py-2 font-semibold text-black transition hover:bg-teal-400"
          >
            {u("next", locale)}
          </button>
        ) : (
          <span className="text-sm font-medium text-teal-300">{u("done", locale)}</span>
        )}
      </div>

      <p className="border-t border-white/10 pt-4 text-xs text-gray-500">{disclaimer}</p>
    </div>
  );
}
