"use client";

import { NextStudio } from "next-sanity/studio";

import config from "@/sanity.config";

/**
 * Embedded Sanity Studio (client-only). Env: `sanity/env.ts` + `next.config.ts` `env` map
 * server vars → `NEXT_PUBLIC_*` for the browser.
 */
export default function StudioPage() {
  return <NextStudio config={config} />;
}
