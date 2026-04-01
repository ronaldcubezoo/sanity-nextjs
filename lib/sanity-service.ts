/**
 * Single place for Sanity reads: GROQ fetch + JSON → {@link Profile}.
 *
 * Expected `profile` documents (defaults via env):
 * - `title` or `name`, `slug` (slug type), optional `headline`, `biography` (string or basic portable text blocks)
 * - `sections[]` objects: `title`, `displayOrder`, `gridColumns`, `type`, `items[]` with the usual item fields
 *
 * Env: SANITY_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID), SANITY_DATASET,
 * optional SANITY_API_READ_TOKEN (or SANITY_API_WRITE_TOKEN), SANITY_API_VERSION, SANITY_TYPE_PROFILE (default `profile`).
 */

import { createClient, type SanityClient } from "@sanity/client";
import type { Profile, ProfileSection, SectionItem } from "./profile-types";

type SanitySlug = { current?: string } | null;

type RawItem = {
  _key?: string;
  _id?: string;
  title?: unknown;
  type?: unknown;
  role?: unknown;
  date?: unknown;
  description?: unknown;
  organization?: unknown;
  location?: unknown;
  displayOrder?: unknown;
};

type RawSection = {
  _key?: string;
  _id?: string;
  title?: unknown;
  displayOrder?: unknown;
  gridColumns?: unknown;
  type?: unknown;
  items?: RawItem[] | null;
};

type RawProfileDoc = {
  _id: string;
  name?: unknown;
  slug?: SanitySlug;
  headline?: unknown;
  biography?: unknown;
  sections?: RawSection[] | null;
};

export function isSanityConfigured(): boolean {
  return Boolean(
    process.env.SANITY_PROJECT_ID?.trim() ||
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
  );
}

function envProjectId(): string | undefined {
  return (
    process.env.SANITY_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
  );
}

function envDataset(): string | undefined {
  return (
    process.env.SANITY_DATASET?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    "production"
  );
}

function envToken(): string | undefined {
  return (
    process.env.SANITY_API_WRITE_TOKEN?.trim() ||
    process.env.SANITY_API_READ_TOKEN?.trim() ||
    process.env.SANITY_TOKEN?.trim() ||
    process.env.SANITY_API_TOKEN?.trim() ||
    undefined
  );
}

function num(v: unknown): number | undefined {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "number" && !Number.isNaN(v)) return v;
  const n = Number(v);
  return Number.isNaN(n) ? undefined : n;
}

function str(v: unknown): string | undefined {
  if (v === null || v === undefined) return undefined;
  if (typeof v === "string") return v || undefined;
  return undefined;
}

function biographyToPlain(value: unknown): string | undefined {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return value || undefined;
  if (!Array.isArray(value)) return undefined;
  const parts: string[] = [];
  for (const block of value) {
    if (typeof block !== "object" || !block || (block as { _type?: string })._type !== "block") {
      continue;
    }
    const children = (block as { children?: { text?: string; _type?: string }[] }).children ?? [];
    for (const span of children) {
      if (span?.text) parts.push(span.text);
    }
  }
  const out = parts.join(" ").trim();
  return out || undefined;
}

function sortByDisplayOrder<T extends { displayOrder?: number }>(rows: T[]): T[] {
  return rows.slice().sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
}

export class SanityService {
  private readonly client: SanityClient;
  private readonly profileType: string;

  constructor() {
    const projectId = envProjectId();
    const dataset = envDataset();
    if (!projectId) {
      throw new Error(
        "Missing SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID"
      );
    }
    this.profileType = process.env.SANITY_TYPE_PROFILE?.trim() || "profile";
    const apiVersion =
      process.env.SANITY_API_VERSION?.trim() || "2024-01-01";
    const token = envToken();
    // When using an API token, do not use the CDN (auth + fresher data).
    const useCdn = token ? false : process.env.SANITY_USE_CDN !== "false";

    this.client = createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      token: token || undefined,
      perspective: "published",
    });
  }

  private profileProjection(): string {
    return `{
      _id,
      "name": coalesce(name, title),
      slug,
      headline,
      biography,
      sections[]{
        _key,
        _id,
        title,
        displayOrder,
        gridColumns,
        type,
        items[]{
          _key,
          _id,
          title,
          type,
          role,
          date,
          description,
          organization,
          location,
          displayOrder
        }
      }
    }`;
  }

  private deserializeItem(raw: RawItem, sectionType?: string): SectionItem {
    const itemType = str(raw.type);
    return {
      _key: str(raw._key) ?? str(raw._id),
      title: str(raw.title),
      type: itemType ?? sectionType,
      role: str(raw.role),
      date: str(raw.date),
      description: str(raw.description),
      organization: str(raw.organization),
      location: str(raw.location),
      displayOrder: num(raw.displayOrder),
    };
  }

  private deserializeSection(raw: RawSection): ProfileSection {
    const sectionType = str(raw.type);
    const key = str(raw._key) ?? str(raw._id);
    const itemsRaw = Array.isArray(raw.items) ? raw.items : [];
    const items = sortByDisplayOrder(
      itemsRaw.map((it) => this.deserializeItem(it, sectionType))
    );
    return {
      _key: key,
      title: str(raw.title),
      displayOrder: num(raw.displayOrder),
      gridColumns: num(raw.gridColumns),
      type: sectionType,
      items,
    };
  }

  deserializeProfile(raw: unknown): Profile {
    const doc = raw as RawProfileDoc;
    if (!doc || typeof doc._id !== "string") {
      throw new Error("Invalid profile document");
    }
    const sectionsRaw = Array.isArray(doc.sections) ? doc.sections : [];
    const sections = sortByDisplayOrder(sectionsRaw.map((s) => this.deserializeSection(s)));
    return {
      _id: doc._id,
      name: str(doc.name),
      slug:
        doc.slug && typeof doc.slug === "object"
          ? { current: doc.slug.current ?? undefined }
          : undefined,
      headline: str(doc.headline),
      biography: biographyToPlain(doc.biography),
      sections,
    };
  }

  async fetchProfiles(): Promise<Profile[]> {
    const q = `*[_type == $t && defined(slug.current)] | order(coalesce(name, title) asc) ${this.profileProjection()}`;
    const rows = await this.client.fetch<unknown[]>(q, { t: this.profileType });
    if (!Array.isArray(rows)) return [];
    return rows.map((row) => this.deserializeProfile(row));
  }

  async fetchProfileBySlug(slug: string): Promise<Profile | null> {
    const safe = slug.trim();
    if (!safe) return null;
    const q = `*[_type == $t && lower(slug.current) == lower($slug)][0] ${this.profileProjection()}`;
    const row = await this.client.fetch<unknown | null>(q, {
      t: this.profileType,
      slug: safe,
    });
    if (!row) return null;
    return this.deserializeProfile(row);
  }
}

let singleton: SanityService | null = null;

export function getSanityService(): SanityService {
  if (!isSanityConfigured()) {
    throw new Error(
      "Sanity is not configured. Set SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_PROJECT_ID."
    );
  }
  if (!singleton) {
    singleton = new SanityService();
  }
  return singleton;
}
