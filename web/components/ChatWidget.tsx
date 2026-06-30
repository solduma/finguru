"use client";

import { useRef, useState } from "react";
import { getStrings, type Locale } from "@/lib/i18n";
import ChatMarkdown from "./ChatMarkdown";
import Reveal from "@/components/Reveal";

interface Citation {
  title: string;
  slug?: string;
  kind: "guru" | "indicator" | "web";
  section?: string;
  url?: string;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  suggestions?: string[];
}

// Read the lesson the user is currently viewing, straight from the DOM, so the
// tutor can answer "what does this mean?" about the open page.
function readCurrentPage(): { title: string; text: string } {
  if (typeof document === "undefined") return { title: "", text: "" };
  const h1 = document.querySelector("main h1");
  const article = document.querySelector("main article");
  const title = h1?.textContent?.trim() || "";
  const text = (article?.textContent || "").replace(/\s+/g, " ").trim().slice(0, 6000);
  return { title, text };
}

function citationHref(c: Citation, locale: Locale): string {
  if (c.kind === "web") return c.url || "#";
  return `/${locale}/${c.kind === "guru" ? "gurus" : "indicators"}/${c.slug}`;
}

export default function ChatWidget({ locale }: { locale: Locale }) {
  const t = getStrings(locale).chat;
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollDown = () =>
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);

  async function ask(rawQuestion: string) {
    const question = rawQuestion.trim();
    if (!question || streaming) return;
    setInput("");
    // Drop any prior suggestion chips once a new turn starts.
    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((prev) => [
      ...prev.map((m) => ({ ...m, suggestions: undefined })),
      { role: "user", content: question },
      { role: "assistant", content: "" },
    ]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history,
          locale,
          page: readCurrentPage(),
        }),
      });
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      const patchLast = (patch: Partial<Msg> | ((m: Msg) => Msg)) =>
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          next[next.length - 1] =
            typeof patch === "function" ? patch(last) : { ...last, ...patch };
          return next;
        });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const eventLine = frame.split("\n").find((l) => l.startsWith("event:"));
          const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const event = eventLine?.slice(6).trim();
          const data = JSON.parse(dataLine.slice(5).trim());
          if (event === "token") {
            patchLast((m) => ({ ...m, role: "assistant", content: m.content + data.text }));
            scrollDown();
          } else if (event === "citations") {
            patchLast({ citations: data.items });
          } else if (event === "suggestions") {
            patchLast({ suggestions: data.items });
            scrollDown();
          } else if (event === "error") {
            patchLast((m) => ({
              ...m,
              role: "assistant",
              content: m.content + `\n\n⚠️ ${data.message}`,
            }));
          }
        }
      }
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: `⚠️ ${t.unreachable} ${String(e)}`,
        };
        return next;
      });
    } finally {
      setStreaming(false);
    }
  }

  const lastIndex = messages.length - 1;

  return (
    <>
      <button
        onClick={() => {
          if (open) setClosing(true);
          else setOpen(true);
        }}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-teal-500 px-5 py-3 font-semibold text-black shadow-lg hover-lift"
      >
        {open && !closing ? t.close : t.open}
      </button>

      {(open || closing) && (
        <div
          className="fixed inset-x-3 bottom-20 z-50 flex h-[70vh] max-h-[32rem] flex-col rounded-xl border border-white/10 bg-[#131722] shadow-2xl sm:inset-x-auto sm:right-5 sm:h-[32rem] sm:w-96 chat-panel-enter"
          style={closing ? { animationDirection: "reverse" } : undefined}
          onAnimationEnd={() => {
            if (closing) {
              setOpen(false);
              setClosing(false);
            }
          }}
        >
          <div className="border-b border-white/10 px-4 py-3 font-semibold text-teal-300">
            {t.title}
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && <p className="text-gray-400">{t.empty}</p>}
            {messages.map((m, i) => (
              // Messages arrive one at a time, so each fades up on mount with no
              // index-based delay — an absolute-index stagger would make later
              // messages wait progressively longer (msg 10 → 700ms) before showing.
              <Reveal key={i}>
              <div className={m.role === "user" ? "text-right" : "text-left"}>
                <span
                  className={
                    "inline-block rounded-lg px-3 py-2 text-left " +
                    (m.role === "user"
                      ? "whitespace-pre-wrap bg-teal-600 text-black"
                      : "bg-white/5 text-gray-100")
                  }
                >
                  {m.role === "assistant" ? (
                    m.content ? (
                      <ChatMarkdown content={m.content} />
                    ) : streaming && i === lastIndex ? (
                      <span className="inline-flex items-center gap-1" aria-label="typing" role="status" aria-live="polite"><span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-current" /><span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-current" /><span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-current" /></span>
                    ) : (
                      ""
                    )
                  ) : (
                    m.content
                  )}
                </span>

                {m.role === "assistant" && m.citations && m.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 anim-fade-in">
                    {m.citations.map((c, j) => (
                      <Reveal key={j} delayMs={Math.min(50 * j, 200)}>
                      <a
                        href={citationHref(c, locale)}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-teal-400/40 bg-teal-400/10 px-2 py-0.5 text-xs text-teal-200 no-underline hover:bg-teal-400/20 hover-lift transition-colors duration-200"
                        title={c.section || c.url}
                      >
                        {c.kind === "web" ? "🔗" : "📖"} {c.title}
                      </a>
                      </Reveal>
                    ))}
                  </div>
                )}

                {/* Suggested follow-up questions — click to ask. */}
                {m.role === "assistant" &&
                  i === lastIndex &&
                  !streaming &&
                  m.suggestions &&
                  m.suggestions.length > 0 && (
                    <div className="mt-2 flex flex-col items-start gap-1.5 anim-fade-in">
                      {m.suggestions.map((s, j) => (
                        <Reveal key={j} delayMs={Math.min(50 * j, 200)}>
                        <button
                          onClick={() => ask(s)}
                          className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-left text-xs text-gray-200 hover:border-teal-400/50 hover:text-teal-200 hover-lift transition-colors duration-200"
                        >
                          {s}
                        </button>
                        </Reveal>
                      ))}
                    </div>
                  )}
              </div>
              </Reveal>
            ))}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask(input)}
              placeholder={t.placeholder}
              // min-h-11 (44px) keeps the field a comfortable touch target;
              // text-base avoids iOS Safari's zoom-on-focus for <16px inputs.
              className="min-h-11 flex-1 rounded-md bg-black/30 px-3 py-2 text-base outline-none transition focus:ring-2 focus:ring-teal-500/50 focus:ring-offset-2 focus:ring-offset-[#131722] sm:text-sm"
            />
            <button
              onClick={() => ask(input)}
              disabled={streaming}
              className="min-h-11 rounded-md bg-teal-500 px-4 py-2 text-sm font-semibold text-black transition active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {t.send}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
