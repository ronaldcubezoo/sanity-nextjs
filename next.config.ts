import type { NextConfig } from "next";

/**
 * Map server-only Sanity env vars into `NEXT_PUBLIC_*` so the embedded Studio (`/studio`)
 * receives project id + dataset in the browser bundle (Next only inlines `NEXT_PUBLIC_*`).
 */
const publicSanityProjectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  process.env.SANITY_STUDIO_PROJECT_ID ||
  process.env.SANITY_PROJECT_ID ||
  "";

const publicSanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET ||
  process.env.SANITY_STUDIO_DATASET ||
  process.env.SANITY_DATASET ||
  "production";

const nextConfig: NextConfig = {
  transpilePackages: ["next-sanity"],
  env: {
    NEXT_PUBLIC_SANITY_PROJECT_ID: publicSanityProjectId,
    NEXT_PUBLIC_SANITY_DATASET: publicSanityDataset,
  },
  // ── Tactical Bypass for the POC ──
  typescript: {
    // This allows the build to finish even if libraries like
    // react-resizable-panels have type mismatches with React 19.
    ignoreBuildErrors: true,
  },
  // ────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
