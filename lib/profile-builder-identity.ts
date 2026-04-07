import type { SanityClient } from "@sanity/client";

/** Matches blocks sent from the page builder save action (shape only). */
export type BuilderBlockIdentityInput = {
  blockKey: string;
  propsJson: string;
};

export type SyncedProfileIdentity = {
  name: string;
  headline: string;
  current_role: string;
  location: string;
  /** Trimmed URL; empty means clear `portraitImageUrl` on the document. */
  portraitImageUrl: string;
};

function parsePropsJson(json: string): Record<string, unknown> {
  try {
    const o = JSON.parse(json);
    return typeof o === "object" && o !== null && !Array.isArray(o) ? (o as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

/**
 * Slug segment from display name — aligned with Sanity slug field `maxLength: 96`.
 */
export function slugifyProfileName(raw: string): string {
  const s = raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  let slug = s.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  if (!slug) slug = "profile";
  /** Leave room for numeric suffixes (`-2`, …) on collision; schema max is 96. */
  return slug.slice(0, 80);
}

/**
 * If the page includes a Marque header block, map its props to top-level profile fields
 * (same mapping as {@link migrateLegacyProfileToBuilderBlocks} in reverse).
 */
export function extractProfileIdentityFromBuilderBlocks(
  blocks: BuilderBlockIdentityInput[]
): SyncedProfileIdentity | null {
  const header = blocks.find((b) => b.blockKey === "marqueProfileHeader");
  if (!header) return null;
  const props = parsePropsJson(header.propsJson);
  const name = String(props.name ?? "").trim();
  if (!name) return null;
  return {
    name,
    headline: String(props.roleLine1 ?? "").trim(),
    current_role: String(props.roleLine2 ?? "").trim(),
    location: String(props.location ?? "").trim(),
    portraitImageUrl: String(props.portraitImageUrl ?? "").trim(),
  };
}

export async function uniqueProfileSlug(
  client: SanityClient,
  profileType: string,
  base: string,
  excludeDocumentId: string
): Promise<string> {
  let n = 0;
  for (;;) {
    const suffix = n === 0 ? "" : `-${n}`;
    const prefixLen = Math.max(1, 96 - suffix.length);
    const candidate = `${base.slice(0, prefixLen)}${suffix}`;
    const count = await client.fetch<number>(
      `count(*[_type == $t && slug.current == $slug && _id != $id])`,
      { t: profileType, slug: candidate, id: excludeDocumentId }
    );
    if (!count) return candidate;
    n += 1;
  }
}
