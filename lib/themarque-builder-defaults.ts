/**
 * Page builder palette defaults. Profile blocks mirror the live Marque profile layout
 * (e.g. themarque.com/profile/peter-arnell). Basic blocks are simple primitives.
 */
import {
  DEFAULT_MARQUE_PROFILE_AWARDS,
  DEFAULT_MARQUE_PROFILE_BACKGROUND,
  DEFAULT_MARQUE_PROFILE_BIOGRAPHY,
  DEFAULT_MARQUE_PROFILE_BOARDS,
  DEFAULT_MARQUE_PROFILE_FEATURES,
  DEFAULT_MARQUE_PROFILE_GALLERY,
  DEFAULT_MARQUE_PROFILE_HEADER,
  DEFAULT_MARQUE_PROFILE_INTERVIEWS,
  DEFAULT_MARQUE_PROFILE_MEDIA,
  DEFAULT_MARQUE_PROFILE_NEWSFEED,
  DEFAULT_MARQUE_PROFILE_PUBLICATIONS,
  DEFAULT_MARQUE_PROFILE_SPEAKING,
} from "@/lib/marque-profile-page-defaults";

export type BuilderPaletteCategory = "themarque" | "basic" | "sanity";

export type BuilderPaletteEntry = {
  blockKey: string;
  label: string;
  description?: string;
  category: BuilderPaletteCategory;
  sanityComponentDefinitionId?: string;
  defaultProps: Record<string, unknown>;
};

function entry(
  blockKey: string,
  label: string,
  category: BuilderPaletteCategory,
  defaultProps: Record<string, unknown>,
  options?: { description?: string; sanityComponentDefinitionId?: string }
): BuilderPaletteEntry {
  return {
    blockKey,
    label,
    category,
    defaultProps,
    description: options?.description,
    sanityComponentDefinitionId: options?.sanityComponentDefinitionId,
  };
}

/** Re-export for tests or seeds */
export {
  DEFAULT_MARQUE_PROFILE_HEADER,
  DEFAULT_MARQUE_PROFILE_BIOGRAPHY,
  DEFAULT_MARQUE_PROFILE_NEWSFEED,
  DEFAULT_MARQUE_PROFILE_BACKGROUND,
} from "@/lib/marque-profile-page-defaults";

/**
 * Static palette: Marque **profile** sections (Peter Arnell–style structure) + basic blocks.
 */
export function getStaticBuilderPalette(): BuilderPaletteEntry[] {
  return [
    entry("marqueProfileHeader", "Profile — name & headline", "themarque", { ...DEFAULT_MARQUE_PROFILE_HEADER }, {
      description: "Name, roles, company, location, tags — top of profile page.",
    }),
    entry("marqueProfileBiography", "Biography", "themarque", { ...DEFAULT_MARQUE_PROFILE_BIOGRAPHY }, {
      description: "Long-form bio section with heading.",
    }),
    entry("marqueProfileNewsfeed", "Newsfeed", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_NEWSFEED.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_NEWSFEED.items.map((i) => ({ ...i })),
    }, { description: "Publication cards with headline links." }),
    entry("marqueProfileBackground", "Background / experience", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_BACKGROUND.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_BACKGROUND.items.map((i) => ({ ...i })),
    }, { description: "Timeline of roles and organisations." }),
    entry("marqueProfileGallery", "Gallery", "themarque", { ...DEFAULT_MARQUE_PROFILE_GALLERY }, {
      description: "Media grid: each item needs a URL and type (Image, Video, or Audio).",
    }),
    entry("marqueProfileBoards", "Board positions", "themarque", {
      sectionTitleCurrent: DEFAULT_MARQUE_PROFILE_BOARDS.sectionTitleCurrent,
      current: DEFAULT_MARQUE_PROFILE_BOARDS.current.map((i) => ({ ...i })),
      sectionTitlePrevious: DEFAULT_MARQUE_PROFILE_BOARDS.sectionTitlePrevious,
      previous: DEFAULT_MARQUE_PROFILE_BOARDS.previous.map((i) => ({ ...i })),
    }, { description: "Current and previous board roles." }),
    entry("marqueProfileMedia", "Media", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_MEDIA.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_MEDIA.items.map((i) => ({ ...i })),
    }, { description: "Press and clips: URL, media type (Image / Video / Audio), title, date, description." }),
    entry("marqueProfileInterviews", "Interviews", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_INTERVIEWS.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_INTERVIEWS.items.map((i) => ({ ...i })),
    }),
    entry("marqueProfileFeatures", "Features", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_FEATURES.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_FEATURES.items.map((i) => ({ ...i })),
    }),
    entry("marqueProfilePublications", "Publications", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_PUBLICATIONS.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_PUBLICATIONS.items.map((i) => ({ ...i })),
    }),
    entry("marqueProfileAwards", "Awards & recognition", "themarque", {
      sectionTitle: DEFAULT_MARQUE_PROFILE_AWARDS.sectionTitle,
      items: DEFAULT_MARQUE_PROFILE_AWARDS.items.map((i) => ({ ...i })),
    }),
    entry("marqueProfileSpeaking", "Speaking engagements", "themarque", { ...DEFAULT_MARQUE_PROFILE_SPEAKING }, {
      description: "e.g. speakers bureau representation.",
    }),
    entry("hero", "Simple hero", "basic", { headline: "", subheadline: "", align: "left" }),
    entry("text", "Simple text", "basic", { heading: "", body: "" }),
    entry("cta", "Simple button", "basic", { label: "Contact", url: "#" }),
    entry("custom", "Custom (Sanity definition)", "basic", {}, {
      description: "Pick a component definition in the inspector.",
    }),
  ];
}
