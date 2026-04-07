import type { ComponentDefinitionOption } from "@/lib/profile-types";
import {
  getStaticBuilderPalette,
  type BuilderPaletteEntry,
} from "@/lib/themarque-builder-defaults";

export type { BuilderPaletteEntry };

function parseJsonRecord(json: string | undefined): Record<string, unknown> {
  if (!json?.trim()) return {};
  try {
    const v = JSON.parse(json) as unknown;
    if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  } catch {
    /* ignore */
  }
  return {};
}

/**
 * Full palette: Marque homepage-style blocks + simple blocks + one row per Sanity `componentDefinition`.
 */
export function buildProfileBuilderPalette(
  componentDefinitions: ComponentDefinitionOption[]
): BuilderPaletteEntry[] {
  const staticPalette = getStaticBuilderPalette();
  const withoutBareCustom = staticPalette.filter(
    (e) => !(e.blockKey === "custom" && !e.sanityComponentDefinitionId)
  );
  const bareCustom = staticPalette.find(
    (e) => e.blockKey === "custom" && !e.sanityComponentDefinitionId
  );

  const fromSanity: BuilderPaletteEntry[] = componentDefinitions.map((d) => ({
    blockKey: "custom",
    label: `Sanity: ${d.name || d.componentKey || d._id.slice(0, 8)}`,
    category: "sanity",
    description: d.componentKey ? `componentKey: ${d.componentKey}` : undefined,
    sanityComponentDefinitionId: d._id,
    defaultProps: parseJsonRecord(d.defaultConfigJson),
  }));

  return [...withoutBareCustom, ...fromSanity, ...(bareCustom ? [bareCustom] : [])];
}

export function paletteLabelLookup(palette: BuilderPaletteEntry[]): Map<string, string> {
  const m = new Map<string, string>();
  for (const e of palette) {
    if (!m.has(e.blockKey)) m.set(e.blockKey, e.label);
  }
  return m;
}
