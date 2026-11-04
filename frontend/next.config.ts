import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── Strict mode for React ──────────────────────────────────────────────────
  reactStrictMode: true,

  // ── TypeScript ─────────────────────────────────────────────────────────────
  typescript: {
    ignoreBuildErrors: false,
  },

  // ── ESLint ─────────────────────────────────────────────────────────────────
  eslint: {
    ignoreDuringBuilds: false,
  },

  // ── Environment variables exposed to the browser ───────────────────────────
  // Only NEXT_PUBLIC_* vars are sent to the browser.
  // Server-side env vars are accessed directly via process.env.

  // ── API rewrites (proxy to NestJS backend) ─────────────────────────────────
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000/api'}/:path*`,
      },
    ];
  },
};

export default nextConfig;
