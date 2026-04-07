/**
 * Builds full `profile.builderBlocks` payloads for Sanity seeding — same shape as the page
 * builder (Marque profile sections + layout props). Keeps seeded profiles editable entirely
 * in `/profiles/[slug]/edit` without relying on legacy `sections[]`.
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

const LAYOUT = { gridColSpan: 12, gridRowSpan: 1 };

export type SeedProfileForBuilder = {
  slug: string;
  name: string;
  current_role: string;
  location: string;
  headline: string;
  biography: string;
  portraitImageUrl?: string;
  socials: { type: string; value: string }[];
};

function tagFromSocialType(t: string): string {
  const m: Record<string, string> = {
    linkedin: "LinkedIn",
    twitter: "Twitter",
    github: "GitHub",
    web: "Website",
  };
  return m[t] ?? t.charAt(0).toUpperCase() + t.slice(1);
}

export type SanityProfilePageBlockRow = {
  _type: "profilePageBlock";
  _key: string;
  blockKey: string;
  propsJson: string;
};

/**
 * One complete Marque-style page per seed: header through speaking, personalized where it matters.
 */
export function buildSanityProfilePageBlocksForSeed(seed: SeedProfileForBuilder): SanityProfilePageBlockRow[] {
  const { slug, name, headline, biography, current_role, location, portraitImageUrl, socials } = seed;

  const tags =
    socials.length > 0
      ? socials.map((s) => tagFromSocialType(s.type)).slice(0, 8)
      : [location].filter(Boolean);

  const header = {
    ...DEFAULT_MARQUE_PROFILE_HEADER,
    name,
    roleLine1: headline,
    roleLine2: current_role,
    location,
    tags: tags.length > 0 ? tags : ["Profile"],
  };

  const bio = {
    ...DEFAULT_MARQUE_PROFILE_BIOGRAPHY,
    sectionTitle: `${name}'s Biography`,
    body: biography,
  };

  const newsfeed = {
    ...DEFAULT_MARQUE_PROFILE_NEWSFEED,
    sectionTitle: `${name}'s Newsfeed`,
    items: [
      {
        source: "Industry Weekly",
        headline: `${name} on craft, teams, and delivery in ${location}`,
        href: "https://example.com/press/1",
      },
      {
        source: "The Chronicle",
        headline: `Inside the work of a ${current_role.split(/\s+/)[0]?.toLowerCase() ?? "leader"}: ${name}`,
        href: "https://example.com/press/2",
      },
      {
        source: "Podcast Notes",
        headline: headline.length > 72 ? `${headline.slice(0, 72)}…` : headline,
        href: "https://example.com/press/3",
      },
    ],
  };

  const background = {
    ...DEFAULT_MARQUE_PROFILE_BACKGROUND,
    sectionTitle: `${name}'s Background`,
    items: [
      {
        org: "Acme Corp",
        role: current_role,
        dateRange: "2021 - Present",
        location,
        description: `Leadership and delivery. ${headline}`,
        logoUrl: "",
      },
      {
        org: "Beta Labs",
        role: "Senior Individual Contributor",
        dateRange: "2018 - 2021",
        location,
        description: "Shipped core products and improved reliability and developer experience.",
        logoUrl: "",
      },
      {
        org: "Gamma Studio",
        role: "Engineer",
        dateRange: "2015 - 2018",
        location: "",
        description: "Early career across product, brand, and platform work.",
        logoUrl: "",
      },
    ],
  };

  const galleryItems = [...DEFAULT_MARQUE_PROFILE_GALLERY.items];
  galleryItems[0] = {
    title: "Portrait & presence",
    url:
      portraitImageUrl ||
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    mediaType: "image",
  };

  const gallery = {
    ...DEFAULT_MARQUE_PROFILE_GALLERY,
    sectionTitle: `${name}'s Gallery`,
    items: galleryItems,
  };

  const boards = {
    ...DEFAULT_MARQUE_PROFILE_BOARDS,
    sectionTitleCurrent: "Board Positions",
    current: [
      {
        org: `${location} Community Foundation`,
        role: "Board Member",
        dateRange: "2022 - Present",
        location,
        description: "Governance and fundraising for local programs (seed data).",
        logoUrl: "",
      },
    ],
    sectionTitlePrevious: "Previous Board Positions",
    previous: [
      {
        org: "Regional Alliance",
        role: "Advisor",
        dateRange: "2018 - 2021",
        location,
        description: "Strategic advisory on partnerships and programs (seed data).",
        logoUrl: "",
      },
    ],
  };

  const media = {
    ...DEFAULT_MARQUE_PROFILE_MEDIA,
    sectionTitle: "Media",
    items: [
      {
        title: `${name} — ${headline.slice(0, 52)}${headline.length > 52 ? "…" : ""}`,
        url: "https://example.com/media/feature",
        mediaType: "video" as const,
        date: "2025",
        description:
          biography.length > 220 ? `${biography.slice(0, 220)}…` : biography,
      },
      {
        title: `${name} on industry trends`,
        url: "https://example.com/media/2",
        mediaType: "image" as const,
        date: "2024",
        description: "Opinion and analysis (seed data).",
      },
      {
        title: `Q&A: ${current_role} in practice`,
        url: "https://example.com/media/3",
        mediaType: "image" as const,
        date: "2023",
        description: "A short-form interview (seed data).",
      },
    ],
  };

  const interviews = {
    ...DEFAULT_MARQUE_PROFILE_INTERVIEWS,
    sectionTitle: "Interviews",
    items: [
      {
        title: `In conversation with ${name}`,
        type: "Interview",
        date: "2025",
        description: `${headline} — career, craft, and what’s next.`,
      },
      {
        title: `${name} on building teams`,
        type: "Video",
        date: "2024",
        description: "Milestones, trade-offs, and lessons learned.",
      },
    ],
  };

  const features = {
    ...DEFAULT_MARQUE_PROFILE_FEATURES,
    sectionTitle: "Features",
    items: [
      {
        title: `Spotlight: ${name}`,
        type: "Profile",
        date: "2025",
        description:
          biography.length > 240 ? `${biography.slice(0, 240)}…` : biography,
      },
      {
        title: `${location} — voices in leadership`,
        type: "Article",
        date: "2024",
        description: "A feature on regional leadership and impact (seed data).",
      },
    ],
  };

  const publications = {
    ...DEFAULT_MARQUE_PROFILE_PUBLICATIONS,
    sectionTitle: "Publications",
    items: [
      {
        title: `${name}: notes on practice`,
        role: "Author",
        date: "2024",
        location,
        description: "Essays on leadership, systems, and craft (seed).",
      },
      {
        title: `Field notes from ${location}`,
        role: "Contributor",
        date: "2023",
        location,
        description: "Observations and frameworks (seed).",
      },
      {
        title:
          headline.length > 48
            ? `${headline.slice(0, 48)}…`
            : headline,
        role: "Author",
        date: "2022",
        location: "",
        description: "Ideas in progress (seed).",
      },
    ],
  };

  const awards = {
    ...DEFAULT_MARQUE_PROFILE_AWARDS,
    sectionTitle: "Awards & Recognition",
    items: [
      {
        org: "Professional Guild",
        award: "Excellence in practice",
        year: "2024",
        location,
        description: `Recognition for impact in ${current_role.toLowerCase()} work.`,
      },
      {
        org: "Regional Forum",
        award: "Honoree",
        year: "2022",
        location,
        description: "Community impact and mentorship (seed).",
      },
      {
        org: "Industry Council",
        award: "Leadership citation",
        year: "2020",
        location: "",
        description: "Early-career recognition (seed).",
      },
    ],
  };

  const speaking = {
    ...DEFAULT_MARQUE_PROFILE_SPEAKING,
    sectionTitle: "Speaking Engagements",
    body: `${name} is available for keynotes and panels aligned with ${headline.slice(0, 90)}${headline.length > 90 ? "…" : ""} Hosts include industry forums and university programs.`,
    locationLine: location,
  };

  const specs: [string, string, Record<string, unknown>][] = [
    ["header", "marqueProfileHeader", header],
    ["bio", "marqueProfileBiography", bio],
    ["news", "marqueProfileNewsfeed", newsfeed],
    ["bg", "marqueProfileBackground", background],
    ["gal", "marqueProfileGallery", gallery],
    ["boards", "marqueProfileBoards", boards],
    ["media", "marqueProfileMedia", media],
    ["int", "marqueProfileInterviews", interviews],
    ["feat", "marqueProfileFeatures", features],
    ["pub", "marqueProfilePublications", publications],
    ["aw", "marqueProfileAwards", awards],
    ["sp", "marqueProfileSpeaking", speaking],
  ];

  return specs.map(([key, blockKey, props]) => ({
    _type: "profilePageBlock" as const,
    _key: `${slug}-${key}`,
    blockKey,
    propsJson: JSON.stringify({ ...LAYOUT, ...props }),
  }));
}
