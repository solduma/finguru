"use client";

import { useRef, useState } from "react";
import { getStrings, type Locale } from "@/lib/i18n";

interface Citation {
  title: string;
  slug: string;
  kind: "guru" | "indicator";
  section?: string;
}

interface Msg {
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
}

export default function ChatWidget({ locale }: { locale: Locale }) {
  const t = getStrings(locale).chat;
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send() {
    const question = input.trim();
    if (!question || streaming) return;
    setInput("");
    const history = messages;
    setMessages([...history, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question, history, locale }),
      });
      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        // SSE frames are separated by a blank line.
        const frames = buffer.split("\n\n");
        buffer = frames.pop() ?? "";
        for (const frame of frames) {
          const eventLine = frame.split("\n").find((l) => l.startsWith("event:"));
          const dataLine = frame.split("\n").find((l) => l.startsWith("data:"));
          if (!dataLine) continue;
          const event = eventLine?.slice(6).trim();
          const data = JSON.parse(dataLine.slice(5).trim());
          if (event === "token") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = {
                ...last,
                role: "assistant",
                content: last.content + data.text,
              };
              return next;
            });
            scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
          } else if (event === "citations") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = { ...last, citations: data.items };
              return next;
            });
          } else if (event === "error") {
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              next[next.length - 1] = {
                ...last,
                role: "assistant",
                content: last.content + `\n\n⚠️ ${data.message}`,
              };
              return next;
            });
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

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-50 rounded-full bg-teal-500 px-5 py-3 font-semibold text-black shadow-lg"
      >
        {open ? t.close : t.open}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[32rem] w-96 flex-col rounded-xl border border-white/10 bg-[#131722] shadow-2xl">
          <div className="border-b border-white/10 px-4 py-3 font-semibold text-teal-300">
            {t.title}
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <p className="text-gray-400">{t.empty}</p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={m.role === "user" ? "text-right" : "text-left"}
              >
                <span
                  className={
                    "inline-block whitespace-pre-wrap rounded-lg px-3 py-2 " +
                    (m.role === "user"
                      ? "bg-teal-600 text-black"
                      : "bg-white/5 text-gray-100")
                  }
                >
                  {m.content || "…"}
                </span>
                {m.role === "assistant" &&
                  m.citations &&
                  m.citations.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {m.citations.map((c) => (
                        <a
                          key={c.slug}
                          href={`/${locale}/${c.kind === "guru" ? "gurus" : "indicators"}/${c.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full border border-teal-400/40 bg-teal-400/10 px-2 py-0.5 text-xs text-teal-200 no-underline hover:bg-teal-400/20"
                          title={c.section}
                        >
                          📖 {c.title}
                        </a>
                      ))}
                    </div>
                  )}
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder={t.placeholder}
              className="flex-1 rounded-md bg-black/30 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={send}
              disabled={streaming}
              className="rounded-md bg-teal-500 px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              {t.send}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
