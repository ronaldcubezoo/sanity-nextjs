/**
 * When `profile.builderBlocks` is unset in Sanity, derive blocks from legacy fields
 * (`sections`, biography, headline, etc.) so the public profile and editor use one model.
 * An explicit empty array `[]` means the page was intentionally cleared — do not remigrate.
 */

import { ensureLayoutProps } from "@/lib/profile-builder-layout";
import type { Profile, ProfileBuilderBlock, ProfileSection, SectionItem } from "@/lib/profile-types";

function newKey(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `k_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

function mapItemToBackgroundRow(it: SectionItem) {
  return {
    org: it.organization || it.title || "",
    role: it.role || "",
    dateRange: it.date || "",
    location: it.location || "",
    description: it.description || "",
    logoUrl: "",
  };
}

function blocksForSection(section: ProfileSection, index: number): ProfileBuilderBlock[] {
  const out: ProfileBuilderBlock[] = [];
  const title = section.title?.trim() || `Section ${index + 1}`;
  const hasContent = Boolean(section.content?.trim());
  const hasItems = Boolean(section.items && section.items.length > 0);

  if (hasContent) {
    out.push({
      _key: newKey(),
      blockKey: "text",
      props: ensureLayoutProps({
        heading: title,
        body: section.content!.trim(),
      }),
    });
  }

  if (hasItems) {
    const items = section.items!.map((it) => mapItemToBackgroundRow(it));
    out.push({
      _key: newKey(),
      blockKey: "marqueProfileBackground",
      props: ensureLayoutProps({
        sectionTitle: title,
        items,
      }),
    });
  }

  return out;
}

/**
 * Build page-builder blocks from legacy Sanity fields (identity + `sections[]`).
 * Used only when the document has no stored `builderBlocks` yet.
 */
export function migrateLegacyProfileToBuilderBlocks(profile: Profile): ProfileBuilderBlock[] {
  const blocks: ProfileBuilderBlock[] = [];
  const name = profile.name?.trim() || "Profile";

  blocks.push({
    _key: newKey(),
    blockKey: "marqueProfileHeader",
    props: ensureLayoutProps({
      name,
      roleLine1: profile.headline?.trim() || "",
      roleLine2: profile.currentRole?.trim() || "",
      location: profile.location?.trim() || "",
      tags: [],
    }),
  });

  const bio = profile.biography?.trim();
  if (bio) {
    blocks.push({
      _key: newKey(),
      blockKey: "marqueProfileBiography",
      props: ensureLayoutProps({
        sectionTitle: "Biography",
        body: bio,
      }),
    });
  }

  const sections = profile.sections ?? [];
  sections.forEach((sec, i) => {
    blocks.push(...blocksForSection(sec, i));
  });

  return blocks;
}

/**
 * Stored blocks when the author has saved layout in the app; otherwise migrate legacy content.
 */
export function resolveProfileBuilderBlocks(profile: Profile): ProfileBuilderBlock[] {
  const stored = profile.builderBlocks;
  if (stored !== undefined) {
    return stored;
  }
  return migrateLegacyProfileToBuilderBlocks(profile);
}
