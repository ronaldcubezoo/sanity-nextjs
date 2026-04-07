import { createClient, type SanityClient } from "@sanity/client";

import { buildSanityProfilePageBlocksForSeed } from "@/lib/seed-profile-builder-blocks";

function required(name: string, value: string | undefined): string {
  const v = value?.trim();
  if (!v) throw new Error(`Missing ${name}`);
  return v;
}

/** Same resolution order as `sanity/env.ts` so one `.env.local` can drive Studio + seed. */
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

/**
 * If project id is not in env, list projects authorized by the write token
 * (same idea as `npx sanity projects list` when logged in).
 */
async function resolveProjectIdFromToken(writeToken: string): Promise<string | undefined> {
  const res = await fetch("https://api.sanity.io/v2021-06-07/projects", {
    headers: { Authorization: `Bearer ${writeToken}` },
  });
  if (!res.ok) {
    const body = await res.text();
    console.warn("Sanity projects API error:", res.status, body.slice(0, 200));
    return undefined;
  }
  const data = (await res.json()) as unknown;
  const rows = Array.isArray(data)
    ? data
    : (data as { projects?: { id: string }[] }).projects ?? [];
  const ids = rows.map((p: { id: string }) => p.id).filter(Boolean);
  if (ids.length === 0) return undefined;
  if (ids.length === 1) {
    console.log("Using Sanity project id from token (only project available):", ids[0]);
    return ids[0];
  }
  console.warn(
    `Multiple Sanity projects: ${ids.join(", ")}. Using ${ids[0]}. Set SANITY_PROJECT_ID in .env.local to choose another.`
  );
  return ids[0];
}

async function createSanityClient(): Promise<SanityClient> {
  let pid = projectId;
  const tok = required("SANITY_API_WRITE_TOKEN (or SANITY_API_TOKEN)", token);
  if (!pid) {
    pid = await resolveProjectIdFromToken(tok);
  }
  return createClient({
    projectId: required(
      "SANITY_PROJECT_ID (or add token-only discovery failed — set SANITY_PROJECT_ID manually; see .env.example)",
      pid
    ),
    dataset,
    apiVersion: process.env.SANITY_API_VERSION?.trim() || "2024-01-01",
    token: tok,
    useCdn: false,
  });
}

const THEME_ID = "brandTheme.default";
const COMPONENT_HERO_ID = "componentDefinition.hero";
const COMPONENT_RICHTEXT_ID = "componentDefinition.richText";
const PAGE_HOME_ID = "page.home";

type ProfileSeed = {
  _id: string;
  name: string;
  slug: string;
  salesforceId?: string;
  current_role: string;
  location: string;
  headline: string;
  biography: string;
  portraitImageUrl?: string;
  coverImageUrl?: string;
  logo?: string;
  socials: { type: string; value: string }[];
};

const PROFILE_SEEDS: ProfileSeed[] = [
  {
    _id: "profile.demo",
    name: "Demo Profile",
    slug: "demo",
    salesforceId: "a0X000000000001",
    current_role: "Product lead",
    location: "Remote",
    headline: "Building thoughtful products with data and design.",
    biography:
      "Seeded profile for local development. Sections below mix sanity-check `section` blocks and Salesforce-style `profileSection` rows.",
    portraitImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=400&fit=crop",
    socials: [
      { type: "linkedin", value: "https://linkedin.com" },
      { type: "github", value: "https://github.com" },
    ],
  },
  {
    _id: "profile.jane-wu",
    name: "Jane Wu",
    slug: "jane-wu",
    salesforceId: "a0X000000000002",
    current_role: "Principal Engineer",
    location: "Singapore",
    headline: "Infrastructure, reliability, and developer experience.",
    biography:
      "Jane focuses on platform engineering and mentoring engineers. Previously at several growth-stage startups.",
    portraitImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=400&fit=crop",
    socials: [
      { type: "twitter", value: "https://twitter.com" },
      { type: "linkedin", value: "https://linkedin.com" },
    ],
  },
  {
    _id: "profile.alex-rivera",
    name: "Alex Rivera",
    slug: "alex-rivera",
    salesforceId: "a0X000000000003",
    current_role: "Design Director",
    location: "Barcelona",
    headline: "Brand systems, product design, and creative direction.",
    biography:
      "Alex leads design orgs for B2B SaaS. Interested in accessibility and design ops.",
    portraitImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop",
    socials: [{ type: "linkedin", value: "https://linkedin.com" }],
  },
  {
    _id: "profile.morgan-lee",
    name: "Morgan Lee",
    slug: "morgan-lee",
    salesforceId: "a0X000000000004",
    current_role: "Independent Advisor",
    location: "Toronto",
    headline: "Board advisory, GTM, and diligence for climate tech.",
    biography:
      "Former operator and investor. Works with founders on narrative, fundraising, and hiring.",
    portraitImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    coverImageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&h=400&fit=crop",
    socials: [
      { type: "linkedin", value: "https://linkedin.com" },
      { type: "web", value: "https://example.com" },
    ],
  },
];

function portableTextParagraph(text: string, keyPrefix: string) {
  return [
    {
      _type: "block",
      _key: `${keyPrefix}-bio-block`,
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: `${keyPrefix}-bio-span`,
          text,
          marks: [],
        },
      ],
    },
  ];
}

function buildProfileDocument(seed: ProfileSeed, themeRef: string) {
  return {
    _id: seed._id,
    _type: "profile" as const,
    salesforceId: seed.salesforceId,
    name: seed.name,
    slug: { _type: "slug" as const, current: seed.slug },
    current_role: seed.current_role,
    location: seed.location,
    headline: seed.headline,
    biography: portableTextParagraph(seed.biography, seed.slug),
    portraitImageUrl: seed.portraitImageUrl,
    coverImageUrl: seed.coverImageUrl,
    logo: seed.logo,
    publishedAt: new Date().toISOString(),
    brandTheme: { _type: "reference" as const, _ref: themeRef },
    theme_fix: {
      _type: "themeFix",
      primary: "#111827",
      secondary: "#4B5563",
      accent: "#2563EB",
      text_on_primary: "#F9FAFB",
      text_on_secondary: "#F9FAFB",
      text_on_accent: "#FFFFFF",
    },
    socials: seed.socials.map((s, i) => ({
      _type: "socialLink",
      _key: `social-${i}`,
      type: s.type,
      value: s.value,
    })),
    /** Canonical page layout for `/profiles/[slug]` — edit in the Next.js page builder. */
    builderBlocks: buildSanityProfilePageBlocksForSeed({
      slug: seed.slug,
      name: seed.name,
      current_role: seed.current_role,
      location: seed.location,
      headline: seed.headline,
      biography: seed.biography,
      portraitImageUrl: seed.portraitImageUrl,
      socials: seed.socials,
    }),
    /** Legacy field kept empty; all seeded content lives in `builderBlocks`. */
    sections: [],
  };
}

async function seedSharedDocs(client: SanityClient) {
  await client.createIfNotExists({
    _id: THEME_ID,
    _type: "brandTheme",
    name: "Default Theme",
    primaryColor: "#111827",
    secondaryColor: "#374151",
    accentColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSizeBase: "16px",
    borderRadius: "12px",
    buttonStyle: "solid",
    customCss: "",
  });

  await client.createIfNotExists({
    _id: COMPONENT_HERO_ID,
    _type: "componentDefinition",
    name: "Hero",
    componentKey: "hero",
    category: "layout",
    sortOrder: 1,
    isActive: true,
    defaultColSpan: 12,
    defaultConfigJson: JSON.stringify(
      {
        title: "Hello from Sanity",
        subtitle: "Seeded componentDefinition",
        cta: { label: "Contact", href: "/contact" },
      },
      null,
      2
    ),
  });

  await client.createIfNotExists({
    _id: COMPONENT_RICHTEXT_ID,
    _type: "componentDefinition",
    name: "Rich Text",
    componentKey: "richText",
    category: "content",
    sortOrder: 2,
    isActive: true,
    defaultColSpan: 12,
    defaultConfigJson: JSON.stringify(
      {
        body: [
          { _type: "block", children: [{ _type: "span", text: "Seeded content." }] },
        ],
      },
      null,
      2
    ),
  });
}

async function seedPage(client: SanityClient) {
  await client.createOrReplace({
    _id: PAGE_HOME_ID,
    _type: "page",
    title: "Home",
    slug: { _type: "slug", current: "home" },
    publishedAt: new Date().toISOString(),
    brandTheme: { _type: "reference", _ref: THEME_ID },
    sections: [
      {
        _type: "section",
        _key: "hero",
        type: "components",
        id: "page-hero",
        order: 1,
        title: "Home — page builder",
        style: {
          _type: "sectionStyle",
          color_background: "primary",
        },
        components: [
          {
            _type: "pageComponent",
            _key: "hero-1",
            component: { _type: "reference", _ref: COMPONENT_HERO_ID },
            colSpan: 12,
          },
          {
            _type: "pageComponent",
            _key: "rt-1",
            component: { _type: "reference", _ref: COMPONENT_RICHTEXT_ID },
            colSpan: 12,
            configJson: JSON.stringify(
              { body: "Optional per-instance config JSON." },
              null,
              2
            ),
          },
        ],
      },
    ],
  });
}

async function seedProfiles(client: SanityClient) {
  const tx = client.transaction();
  for (const seed of PROFILE_SEEDS) {
    tx.createOrReplace(buildProfileDocument(seed, THEME_ID));
  }
  await tx.commit();
}

async function main() {
  const client = await createSanityClient();
  await seedSharedDocs(client);
  await seedProfiles(client);
  await seedPage(client);

  console.log("Seeded brand theme:", THEME_ID);
  console.log("Seeded component definitions:", COMPONENT_HERO_ID, COMPONENT_RICHTEXT_ID);
  console.log(
    "Seeded profiles (full page builder blocks):",
    PROFILE_SEEDS.map((p) => `${p.name} (${p.slug})`).join(", ")
  );
  console.log("Seeded page:", PAGE_HOME_ID);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
