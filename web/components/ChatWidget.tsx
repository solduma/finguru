"use client";

import { useRef, useState } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

export default function ChatWidget() {
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
        body: JSON.stringify({ message: question, history }),
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
              next[next.length - 1] = {
                role: "assistant",
                content: next[next.length - 1].content + data.text,
              };
              return next;
            });
            scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
          } else if (event === "error") {
            setMessages((prev) => {
              const next = [...prev];
              next[next.length - 1] = {
                role: "assistant",
                content: `⚠️ ${data.message}`,
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
          content: `⚠️ Could not reach the tutor: ${String(e)}`,
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
        {open ? "Close" : "Ask the Tutor"}
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-[32rem] w-96 flex-col rounded-xl border border-white/10 bg-[#131722] shadow-2xl">
          <div className="border-b border-white/10 px-4 py-3 font-semibold text-teal-300">
            FinGuru Tutor
          </div>
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <p className="text-gray-400">
                Ask anything about technical analysis — the gurus, the
                indicators, the history. I teach concepts, not trades.
              </p>
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
              </div>
            ))}
          </div>
          <div className="flex gap-2 border-t border-white/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="What is RSI divergence?"
              className="flex-1 rounded-md bg-black/30 px-3 py-2 text-sm outline-none"
            />
            <button
              onClick={send}
              disabled={streaming}
              className="rounded-md bg-teal-500 px-3 py-2 text-sm font-semibold text-black disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
