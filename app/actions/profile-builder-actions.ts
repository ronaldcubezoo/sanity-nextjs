"use server";

import { getSanityWriteClient } from "@/lib/sanity-write-client";

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
  | { ok: true }
  | { ok: false; error: string };

export async function saveProfileBuilderBlocks(
  profileId: string,
  blocks: BuilderBlockSaveInput[]
): Promise<SaveProfileBuilderResult> {
  const id = profileId?.trim();
  if (!id) {
    return { ok: false, error: "Missing profile id" };
  }
  try {
    const client = getSanityWriteClient();
    const payload = blocks.map(toSanityBlock);
    await client.patch(id).set({ builderBlocks: payload }).commit();
    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Save failed";
    return { ok: false, error: message };
  }
}
