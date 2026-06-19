import type { NextRequest } from "next/server";

// Stream the tutor's SSE response straight through from the FastAPI backend.
//
// We use an explicit route handler (not the next.config rewrite) because the
// dev-server rewrite BUFFERS the streamed response — it collects the whole SSE
// body and hands the browser one chunk, which kills token-by-token rendering.
// Returning the upstream ReadableStream body directly pipes it through
// unbuffered. Auth is still enforced by middleware before this runs.

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_PROXY_TARGET || "http://localhost:8000";

export async function POST(req: NextRequest) {
  const upstream = await fetch(`${API_BASE}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await req.text(),
    // @ts-expect-error - Node fetch needs duplex for streaming request bodies
    duplex: "half",
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
