import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  /** Single-package root: stabilizes output file tracing when multiple lockfiles exist up-tree. */
  outputFileTracingRoot: projectRoot,
  output: "standalone",
  reactStrictMode: true,
  compress: true,
  poweredByHeader: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["better-sqlite3"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /** Allow slower static generation on constrained VPS without failing the build. */
  staticPageGenerationTimeout: 180,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    cpus: 1,
    workerThreads: false,
    memoryBasedWorkersCount: false,
  },
  async redirects() {
    return [
      {
        source: "/loan-calculator-:amount(\\d+)",
        destination: "/loan-calculator/p/:amount",
        permanent: true,
      },
      {
        source: "/salary-after-tax-:amount(\\d+)",
        destination: "/salary-after-tax/p/:amount",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/tool-art/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/logo-toollabz.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/hero-toollabz-hub.webp",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=()",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://www.google.com https://www.gstatic.com https://widget.trustpilot.com https://invitejs.trustpilot.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob: https://www.trustpilot.com https://*.googleapis.com https://*.gstatic.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com https://pagead2.googlesyndication.com https://api.frankfurter.app https://*.api.mailchimp.com https://vitals.vercel-insights.com https://widget.trustpilot.com https://api.anthropic.com https://serpapi.com",
              "frame-src 'self' https://googleads.g.doubleclick.net https://widget.trustpilot.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              // Intentionally omit upgrade-insecure-requests: with it, browsers rewrite
              // http://localhost subresource URLs to https://, so next dev (HTTP-only) fails
              // to load /_next CSS & JS and the app renders completely unstyled.
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
