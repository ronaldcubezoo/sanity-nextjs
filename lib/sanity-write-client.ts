import { createClient, type SanityClient } from "@sanity/client";

/**
 * Server-only client with a write token. Use from Server Actions / Route Handlers only.
 */
export function getSanityWriteClient(): SanityClient {
  const projectId =
    process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset =
    process.env.SANITY_STUDIO_DATASET?.trim() ||
    process.env.SANITY_DATASET?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    "production";
  const token = process.env.SANITY_API_WRITE_TOKEN?.trim();
  if (!projectId) {
    throw new Error("Missing SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID");
  }
  if (!token) {
    throw new Error("SANITY_API_WRITE_TOKEN is required to save profile pages");
  }
  const apiVersion = process.env.SANITY_API_VERSION?.trim() || "2024-01-01";
  return createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });
}
