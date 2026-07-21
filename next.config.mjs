/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    // ─────────────────────────────────────────────────────────────────────
    // Local Development: proxy all /api/* requests to the FastAPI backend
    // running on port 8000 (start it with: uvicorn backend.main:app --reload)
    //
    // Production (Vercel): /api/* is routed by vercel.json to the Python
    // Serverless Function (api/index.py) at the edge, so no rewrite needed.
    // ─────────────────────────────────────────────────────────────────────
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/:path*",
          destination: "http://127.0.0.1:8000/api/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
