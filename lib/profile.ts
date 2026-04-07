import type {
  Profile,
  ProfileBuilderBlock,
  ComponentDefinitionOption,
  ProfileSection,
  SectionItem,
} from "./profile-types";
import { getSanityService, isSanityConfigured } from "./sanity-service";

export type {
  Profile,
  ProfileBuilderBlock,
  ComponentDefinitionOption,
  ProfileSection,
  SectionItem,
};

export async function getProfiles(): Promise<Profile[]> {
  if (!isSanityConfigured()) return [];
  return getSanityService().fetchProfiles();
}

export async function getProfileBySlug(slug: string): Promise<Profile | null> {
  if (!isSanityConfigured()) return null;
  return getSanityService().fetchProfileBySlug(slug);
}

export async function getComponentDefinitionsForBuilder(): Promise<ComponentDefinitionOption[]> {
  if (!isSanityConfigured()) return [];
  return getSanityService().fetchComponentDefinitionsForBuilder();
}

export {
  migrateLegacyProfileToBuilderBlocks,
  resolveProfileBuilderBlocks,
} from "@/lib/resolve-profile-builder-blocks";
