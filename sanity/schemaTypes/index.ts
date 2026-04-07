import { brandTheme } from "./brandTheme";
import { componentDefinition } from "./componentDefinition";
import { gridBreakpoint } from "./gridBreakpoint";
import { page, pageComponent } from "./page";
import { profile } from "./profile";
import { profilePageBlock } from "./profilePageBlock";
import { profileSection } from "./profileSection";
import { section } from "./section";
import { sectionItem } from "./sectionItem";
import { sectionItemMeta } from "./sectionItemMeta";
import { sectionLayout } from "./sectionLayout";
import { sectionStyle } from "./sectionStyle";
import { socialLink } from "./socialLink";
import { themeFix } from "./themeFix";

/** Order: primitives → items → pageComponent (referenced by section) → section → documents */
export const schemaTypes = [
  gridBreakpoint,
  sectionLayout,
  sectionStyle,
  sectionItemMeta,
  themeFix,
  socialLink,
  sectionItem,
  pageComponent,
  profilePageBlock,
  section,
  profileSection,
  brandTheme,
  componentDefinition,
  profile,
  page,
];
