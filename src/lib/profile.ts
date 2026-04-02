import type { Profile, ProfileSection, SectionItem } from "./profile-types";
import { getSanityService, isSanityConfigured } from "./sanity-service";

export type { Profile, ProfileSection, SectionItem };

export async function getProfiles(): Promise<Profile[]> {
  if (!isSanityConfigured()) return [];
  return getSanityService().fetchProfiles();
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  if (!isSanityConfigured()) return null;
  return getSanityService().fetchProfileBySlug(slug);
}
