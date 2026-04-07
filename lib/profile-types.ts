/** Domain shape used by the app UI (decoupled from Sanity document JSON). */

export type SectionItem = {
  _key?: string;
  title?: string;
  type?: string;
  role?: string;
  date?: string;
  description?: string;
  organization?: string;
  location?: string;
  displayOrder?: number;
};

export type ProfileSection = {
  _key?: string;
  title?: string;
  displayOrder?: number;
  gridColumns?: number;
  type?: string;
  /** Text sections (`section` with `type: "text"`) store body here instead of `items`. */
  content?: string;
  items?: SectionItem[];
};

/** Options for the “custom” block type (references `componentDefinition`). */
export type ComponentDefinitionOption = {
  _id: string;
  name?: string;
  componentKey?: string;
  defaultConfigJson?: string;
};

/** One block from the Next.js drag-and-drop page builder (`profile.builderBlocks`). */
export type ProfileBuilderBlock = {
  _key?: string;
  blockKey: string;
  props: Record<string, unknown>;
  componentDefinition?: {
    _id: string;
    name?: string;
    componentKey?: string;
    defaultConfigJson?: string;
  };
};

export type Profile = {
  _id: string;
  name?: string;
  slug?: { current?: string };
  headline?: string;
  biography?: string;
  currentRole?: string;
  location?: string;
  portraitImageUrl?: string;
  coverImageUrl?: string;
  sections?: ProfileSection[];
  /**
   * Page builder layout from the Next app.
   * - `undefined`: not saved yet — app derives blocks from legacy `sections` + biography + headline until first save.
   * - `[]`: explicit empty canvas (no migration).
   * - non-empty: canonical layout; legacy `sections` are ignored on the public site until re-imported.
   */
  builderBlocks?: ProfileBuilderBlock[];
};
