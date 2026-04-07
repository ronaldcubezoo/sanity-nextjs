/**
 * Studio + CLI config must not use `import.meta` here: `sanity.cli.ts` loads this file in a
 * CommonJS context where `import.meta` is unavailable.
 *
 * **Important for embedded Studio (`/studio`):** Next.js only injects `NEXT_PUBLIC_*` into the
 * **browser** bundle when you use direct property access, e.g.
 * `process.env.NEXT_PUBLIC_SANITY_PROJECT_ID`. Do not use `process.env[variableName]` — it will
 * stay undefined on the client.
 */
function required(name: string, value: string | undefined): string {
  const v = value?.trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

function projectIdFromEnv(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim()
  );
}

function datasetFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    process.env.SANITY_STUDIO_DATASET?.trim() ||
    process.env.SANITY_DATASET?.trim() ||
    "production"
  );
}

function apiVersionFromEnv(): string {
  return (
    process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() ||
    process.env.SANITY_STUDIO_API_VERSION?.trim() ||
    process.env.SANITY_API_VERSION?.trim() ||
    "2024-01-01"
  );
}

/**
 * Prefer `NEXT_PUBLIC_SANITY_PROJECT_ID` in `.env.local` (required for `/studio` in the browser).
 * `SANITY_STUDIO_PROJECT_ID` / `SANITY_PROJECT_ID` work on the server and in CLI.
 */
export const projectId = required(
  "SANITY project id: set NEXT_PUBLIC_SANITY_PROJECT_ID (and optionally SANITY_PROJECT_ID for scripts)",
  projectIdFromEnv()
);

export const dataset = datasetFromEnv();

export const apiVersion = apiVersionFromEnv();
