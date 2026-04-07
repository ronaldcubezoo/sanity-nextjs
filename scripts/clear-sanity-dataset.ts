/**
 * Deletes **all user documents** in the configured Sanity dataset (hosted + local Studio use the same API).
 *
 * Does not delete the dataset itself. System paths (`_.**`) are excluded from the main query.
 * Image/file assets (`sanity.imageAsset`, `sanity.fileAsset`) are deleted in a second pass.
 *
 * Usage:
 *   CONFIRM_CLEAR_SANITY=DELETE npm run sanity:clear-dataset
 *
 * Requires: SANITY_API_WRITE_TOKEN, project id (same env resolution as `scripts/seed-sanity.ts`).
 */
import { createClient, type SanityClient } from "@sanity/client";

function required(name: string, value: string | undefined): string {
  const v = value?.trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

const projectId =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.SANITY_PROJECT_ID?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();

const dataset =
  process.env.SANITY_STUDIO_DATASET?.trim() ||
  process.env.SANITY_DATASET?.trim() ||
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
  "production";

const token =
  process.env.SANITY_API_WRITE_TOKEN?.trim() ||
  process.env.SANITY_API_TOKEN?.trim() ||
  process.env.SANITY_TOKEN?.trim();

async function resolveProjectIdFromToken(writeToken: string): Promise<string | undefined> {
  const res = await fetch("https://api.sanity.io/v2021-06-07/projects", {
    headers: { Authorization: `Bearer ${writeToken}` },
  });
  if (!res.ok) return undefined;
  const data = (await res.json()) as unknown;
  const rows = Array.isArray(data)
    ? data
    : (data as { projects?: { id: string }[] }).projects ?? [];
  const ids = rows.map((p: { id: string }) => p.id).filter(Boolean);
  return ids[0];
}

async function createClientInstance(): Promise<SanityClient> {
  let pid = projectId;
  const tok = required("SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN)", token);
  if (!pid) {
    pid = await resolveProjectIdFromToken(tok);
  }
  return createClient({
    projectId: required(
      "SANITY_PROJECT_ID — set in .env.local when using multiple projects",
      pid
    ),
    dataset,
    apiVersion: process.env.SANITY_API_VERSION?.trim() || "2024-01-01",
    token: tok,
    useCdn: false,
  });
}

const BATCH = 200;

async function deleteByQuery(client: SanityClient, query: string): Promise<number> {
  let total = 0;
  for (;;) {
    const ids = await client.fetch<string[]>(`${query}[0...${BATCH}]._id`);
    if (!ids.length) break;
    const tx = client.transaction();
    for (const id of ids) {
      tx.delete(id);
    }
    await tx.commit();
    total += ids.length;
    if (ids.length < BATCH) break;
  }
  return total;
}

async function main() {
  if (process.env.CONFIRM_CLEAR_SANITY !== "DELETE") {
    console.error(
      "Refusing to run: set CONFIRM_CLEAR_SANITY=DELETE to wipe the dataset (this deletes documents and assets)."
    );
    process.exit(1);
  }

  const client = await createClientInstance();

  console.log(`Dataset: ${dataset}`);
  console.log("Deleting non-system documents (*[!(_id in path('_.**'))]) …");
  const nDocs = await deleteByQuery(client, `*[!(_id in path("_.**"))]`);
  console.log(`Deleted ${nDocs} document(s).`);

  console.log("Deleting image assets …");
  const nImg = await deleteByQuery(client, `*[_type == "sanity.imageAsset"]`);
  console.log(`Deleted ${nImg} image asset(s).`);

  console.log("Deleting file assets …");
  const nFile = await deleteByQuery(client, `*[_type == "sanity.fileAsset"]`);
  console.log(`Deleted ${nFile} file asset(s).`);

  console.log("Done. Re-seed with: npm run sanity:seed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
