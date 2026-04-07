import { getStaticBuilderPalette } from "@/lib/themarque-builder-defaults";
import type { ComponentDefinitionOption } from "@/lib/profile-types";

const defaultsCache = new Map<string, Record<string, unknown>>();

function refreshDefaultsCache(): void {
  defaultsCache.clear();
  for (const e of getStaticBuilderPalette()) {
    defaultsCache.set(e.blockKey, { ...e.defaultProps });
  }
}

refreshDefaultsCache();

/** Default props for a `blockKey` (Marque + basic blocks). */
export function defaultPropsForBlock(blockKey: string): Record<string, unknown> {
  const d = defaultsCache.get(blockKey);
  if (d) return { ...d };
  return {};
}

/** Label for basic / Marque keys (not Sanity-specific custom rows). */
export function labelForBlockKey(blockKey: string): string {
  const e = getStaticBuilderPalette().find((x) => x.blockKey === blockKey);
  if (e) return e.label;
  switch (blockKey) {
    case "custom":
      return "Custom component";
    default:
      return blockKey;
  }
}

export function resolveBlockLabel(
  block: { blockKey: string; componentDefinitionRef?: string | null },
  componentDefinitions: ComponentDefinitionOption[]
): string {
  if (block.blockKey === "custom" && block.componentDefinitionRef) {
    const d = componentDefinitions.find((x) => x._id === block.componentDefinitionRef);
    if (d) return d.name || d.componentKey || "Custom";
  }
  return labelForBlockKey(block.blockKey);
}
