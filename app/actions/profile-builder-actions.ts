"use server";

import { getSanityWriteClient } from "@/lib/sanity-write-client";
import {
  extractProfileIdentityFromBuilderBlocks,
  slugifyProfileName,
  uniqueProfileSlug,
} from "@/lib/profile-builder-identity";

export type BuilderBlockSaveInput = {
  _key: string;
  blockKey: string;
  propsJson: string;
  componentDefinitionRef?: string | null;
};

function toSanityBlock(b: BuilderBlockSaveInput): Record<string, unknown> {
  const row: Record<string, unknown> = {
    _type: "profilePageBlock",
    _key: b._key,
    blockKey: b.blockKey,
    propsJson: b.propsJson?.trim() ? b.propsJson.trim() : "{}",
  };
  if (b.componentDefinitionRef) {
    row.componentDefinition = {
      _type: "reference",
      _ref: b.componentDefinitionRef,
    };
  }
  return row;
}

export type SaveProfileBuilderResult =
  | { ok: true; slug: string }
  | { ok: false; error: string };

export async function saveProfileBuilderBlocks(
  profileId: string,
  blocks: BuilderBlockSaveInput[]
): Promise<SaveProfileBuilderResult> {
  const id = profileId?.trim();
  if (!id) {
    return { ok: false, error: "Missing profile id" };
  }
  const profileType = process.env.SANITY_TYPE_PROFILE?.trim() || "profile";
  try {
    const client = getSanityWriteClient();
    const payload = blocks.map(toSanityBlock);
    const identity = extractProfileIdentityFromBuilderBlocks(blocks);

    const patch = client.patch(id).set({ builderBlocks: payload });

    if (identity) {
      const baseSlug = slugifyProfileName(identity.name);
      const slugCurrent = await uniqueProfileSlug(client, profileType, baseSlug, id);
      patch.set({
        name: identity.name,
        headline: identity.headline,
        current_role: identity.current_role,
        location: identity.location,
        slug: { _type: "slug" as const, current: slugCurrent },
      });
      if (identity.portraitImageUrl) {
        patch.set({ portraitImageUrl: identity.portraitImageUrl });
      } else {
        patch.unset(["portraitImageUrl"]);
      }
      await patch.commit();
      return { ok: true, slug: slugCurrent };
    }

    await patch.commit();
    const doc = await client.fetch<{ slug?: { current?: string } } | null>(
      `*[_id == $id][0]{ slug }`,
      { id }
    );
    const slug = doc?.slug?.current?.trim() || "";
    return { ok: true, slug };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return { ok: false, error: message };
  }
}
