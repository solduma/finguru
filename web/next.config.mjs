/** @type {import('next').NextConfig} */
const nextConfig = {
  // Proxy /api/* to the FastAPI service so the browser hits a same-origin path
  // in dev (avoids CORS) and we can swap the upstream via env in prod.
  async rewrites() {
    const apiBase = process.env.API_PROXY_TARGET || "http://localhost:8000";
    return [{ source: "/api/:path*", destination: `${apiBase}/:path*` }];
  },
};
export default nextConfig;
