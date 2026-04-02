import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ── Tactical Bypass for the POC ──
  typescript: {
    // This allows the build to finish even if libraries like 
    // react-resizable-panels have type mismatches with React 19.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Optional: Also ignores linting errors for faster deployment
    ignoreDuringBuilds: true, 
  },
  // ────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;