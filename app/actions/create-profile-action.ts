"use server";

import { randomUUID } from "node:crypto";

import { getSanityWriteClient } from "@/lib/sanity-write-client";
import { slugifyProfileName, uniqueProfileSlug } from "@/lib/profile-builder-identity";

export type CreateProfileResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

/**
 * Creates a new `profile` document in Sanity (published id, not drafts.*).
 * After this, the profile appears in the directory (published perspective) and
 * can be edited in `/profiles/[slug]/edit` or in embedded Studio `/studio`.
 */
export async function createProfileDocument(
  formData: FormData
): Promise<CreateProfileResult> {
  const name = String(formData.get("name") ?? "").trim();
  const slugOverride = String(formData.get("slug") ?? "").trim();

  if (!name) {
    return { ok: false, error: "Profile name is required." };
  }

  try {
    const client = getSanityWriteClient();
    const profileType = process.env.SANITY_TYPE_PROFILE?.trim() || "profile";
    const docId = `profile-${randomUUID().replace(/-/g, "").slice(0, 20)}`;
    const base = slugOverride
      ? slugifyProfileName(slugOverride)
      : slugifyProfileName(name);
    if (!base) {
      return {
        ok: false,
        error: "Could not derive a URL slug. Use letters or numbers in the name or slug.",
      };
    }
    const slugCurrent = await uniqueProfileSlug(client, profileType, base, docId);

    await client.create({
      _type: profileType,
      _id: docId,
      name,
      slug: { _type: "slug", current: slugCurrent },
    });

    return { ok: true, slug: slugCurrent };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create profile";
    return { ok: false, error: message };
  }
}
