/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* to the FastAPI service so the browser hits a same-origin path
  // in dev (avoids CORS) and we can swap the upstream via env in prod.
  async rewrites() {
    const apiBase = process.env.API_PROXY_TARGET || "http://localhost:8000";
    // /api/chat is handled by a streaming route handler (app/api/chat/route.ts)
    // — the rewrite buffers SSE, so we must NOT proxy it here. Everything else
    // under /api still proxies straight to the backend.
    return [
      {
        source: "/api/:path((?!chat$).*)",
        destination: `${apiBase}/:path*`,
      },
    ];
  },
};
export default nextConfig;
