/** @type {import('next').NextConfig} */
const nextConfig = {
  // Build output directory. Defaults to ".next". The dev launcher (run.sh) sets
  // NEXT_DIST_DIR=.next-dev so `next dev` writes to its own directory and never
  // clobbers the production build in .next that start-prod.sh's `next start`
  // serves — letting dev and prod run side by side on the same checkout.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  // Allow loading the dev server from non-localhost origins (LAN IP, 0.0.0.0)
  // without the cross-origin /_next/* warning. Dev-only; ignored in production.
  allowedDevOrigins: ["0.0.0.0", "127.0.0.1", "192.168.0.13", "*.local"],

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
