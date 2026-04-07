/**
 * Single place for Sanity reads: GROQ fetch + JSON → {@link Profile}.
 *
 * Expected `profile` documents (defaults via env):
 * - `title` or `name`, `slug` (slug type), optional `headline`, `biography` (string or basic portable text blocks)
 * - `sections[]` may be `section` (sanity-check: `order`, `items`, dates) or `profileSection` (Salesforce: `displayOrder`, etc.)
 * - Items support both shapes: `order`/`displayOrder`, `date` or `date_start`/`date_end`, `role` or `subtitle`
 *
 * Env: SANITY_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID), SANITY_DATASET,
 * optional SANITY_API_READ_TOKEN (or SANITY_API_WRITE_TOKEN), SANITY_API_VERSION, SANITY_TYPE_PROFILE (default `profile`).
 */

import { createClient, type SanityClient } from "@sanity/client";
import type {
  ComponentDefinitionOption,
  Profile,
  ProfileBuilderBlock,
  ProfileSection,
  SectionItem,
} from "./profile-types";

type SanitySlug = { current?: string } | null;

type RawItem = {
  _key?: string;
  _id?: string;
  title?: unknown;
  type?: unknown;
  role?: unknown;
  subtitle?: unknown;
  date?: unknown;
  date_start?: unknown;
  date_end?: unknown;
  description?: unknown;
  organization?: unknown;
  location?: unknown;
  order?: unknown;
  displayOrder?: unknown;
};

type RawSection = {
  _key?: string;
  _id?: string;
  _type?: unknown;
  title?: unknown;
  displayOrder?: unknown;
  order?: unknown;
  gridColumns?: unknown;
  type?: unknown;
  content?: unknown;
  items?: RawItem[] | null;
};

type RawBuilderBlock = {
  _key?: string;
  _type?: unknown;
  blockKey?: unknown;
  propsJson?: unknown;
  componentDefinition?: {
    _id?: string;
    name?: unknown;
    componentKey?: unknown;
    defaultConfigJson?: unknown;
  } | null;
};

type RawProfileDoc = {
  _id: string;
  name?: unknown;
  slug?: SanitySlug;
  headline?: unknown;
  biography?: unknown;
  current_role?: unknown;
  location?: unknown;
  portraitImageUrl?: unknown;
  coverImageUrl?: unknown;
  sections?: RawSection[] | null;
  builderBlocks?: RawBuilderBlock[] | null;
};

/** Match `sanity/env.ts` / seed script so Studio-only `.env` keys still enable the Next app. */
export function isSanityConfigured(): boolean {
  return Boolean(envProjectId());
}

function envProjectId(): string | undefined {
  return (
    process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim() ||
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim()
  );
}

function envDataset(): string | undefined {
  return (
    process.env.SANITY_STUDIO_DATASET?.trim() ||
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

function sortKey(row: { displayOrder?: number; order?: number }): number {
  const a = row.displayOrder;
  const b = row.order;
  if (typeof a === "number" && !Number.isNaN(a)) return a;
  if (typeof b === "number" && !Number.isNaN(b)) return b;
  return 0;
}

function sortByDisplayOrder<T extends { displayOrder?: number; order?: number }>(
  rows: T[]
): T[] {
  return rows.slice().sort((a, b) => sortKey(a) - sortKey(b));
}

function parsePropsJson(value: unknown): Record<string, unknown> {
  if (value === null || value === undefined) return {};
  if (typeof value !== "string" || !value.trim()) return {};
  try {
    const parsed: unknown = JSON.parse(value);
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

function deserializeBuilderBlock(raw: RawBuilderBlock): ProfileBuilderBlock {
  const ref = raw.componentDefinition;
  const componentDefinition =
    ref && typeof ref._id === "string"
      ? {
          _id: ref._id,
          name: str(ref.name),
          componentKey: str(ref.componentKey),
          defaultConfigJson: str(ref.defaultConfigJson),
        }
      : undefined;
  return {
    _key: str(raw._key),
    blockKey: str(raw.blockKey) ?? "text",
    props: parsePropsJson(raw.propsJson),
    componentDefinition,
  };
}

export class SanityService {
  private readonly client: SanityClient;
  private readonly profileType: string;

  constructor() {
    const projectId = envProjectId();
    const dataset = envDataset();
    if (!projectId) {
      throw new Error(
        "Missing SANITY_STUDIO_PROJECT_ID, SANITY_PROJECT_ID, or NEXT_PUBLIC_SANITY_PROJECT_ID"
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
      current_role,
      location,
      portraitImageUrl,
      coverImageUrl,
      sections[]{
        _key,
        _id,
        _type,
        title,
        displayOrder,
        order,
        gridColumns,
        type,
        content,
        items[]{
          _key,
          _id,
          title,
          subtitle,
          type,
          role,
          date,
          date_start,
          date_end,
          description,
          organization,
          location,
          order,
          displayOrder
        }
      },
      builderBlocks[]{
        _key,
        _type,
        blockKey,
        propsJson,
        componentDefinition->{
          _id,
          name,
          componentKey,
          defaultConfigJson
        }
      }
    }`;
  }

  private itemDateLabel(raw: RawItem): string | undefined {
    const direct = str(raw.date);
    if (direct) return direct;
    const start = raw.date_start;
    const end = raw.date_end;
    const s =
      typeof start === "string"
        ? start
        : start && typeof start === "object" && start !== null && "split" in start
          ? String(start)
          : undefined;
    const e =
      typeof end === "string"
        ? end
        : end && typeof end === "object" && end !== null && "split" in end
          ? String(end)
          : undefined;
    if (s && e) return `${s} – ${e}`;
    return s ?? e;
  }

  private deserializeItem(raw: RawItem, sectionType?: string): SectionItem {
    const itemType = str(raw.type);
    const role = str(raw.role) ?? str(raw.subtitle);
    return {
      _key: str(raw._key) ?? str(raw._id),
      title: str(raw.title),
      type: itemType ?? sectionType,
      role,
      date: this.itemDateLabel(raw),
      description: str(raw.description),
      organization: str(raw.organization),
      location: str(raw.location),
      displayOrder: num(raw.displayOrder) ?? num(raw.order),
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
      displayOrder: num(raw.displayOrder) ?? num(raw.order),
      gridColumns: num(raw.gridColumns),
      type: sectionType,
      content: str(raw.content),
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
    const rawBuilder = doc.builderBlocks;
    const builderBlocksUnset = rawBuilder === undefined || rawBuilder === null;
    const builderRaw = Array.isArray(rawBuilder) ? rawBuilder : [];
    const builderBlocks = builderRaw.map((b) => deserializeBuilderBlock(b));
    return {
      _id: doc._id,
      name: str(doc.name),
      slug:
        doc.slug && typeof doc.slug === "object"
          ? { current: doc.slug.current ?? undefined }
          : undefined,
      headline: str(doc.headline),
      biography: biographyToPlain(doc.biography),
      currentRole: str(doc.current_role),
      location: str(doc.location),
      portraitImageUrl: str(doc.portraitImageUrl),
      coverImageUrl: str(doc.coverImageUrl),
      sections,
      /** `undefined` = field absent → app may migrate legacy `sections` into builder blocks. `[]` = explicit empty page. */
      builderBlocks: builderBlocksUnset ? undefined : builderBlocks,
    };
  }

  async fetchComponentDefinitionsForBuilder(): Promise<ComponentDefinitionOption[]> {
    const q = `*[_type == "componentDefinition" && coalesce(isActive, true) == true] | order(coalesce(sortOrder, 999) asc) {
      _id,
      name,
      componentKey,
      defaultConfigJson
    }`;
    const rows = await this.client.fetch<unknown[]>(q);
    if (!Array.isArray(rows)) return [];
    const out: ComponentDefinitionOption[] = [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const r = row as Record<string, unknown>;
      const id = str(r._id);
      if (!id) continue;
      out.push({
        _id: id,
        name: str(r.name),
        componentKey: str(r.componentKey),
        defaultConfigJson: str(r.defaultConfigJson),
      });
    }
    return out;
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
