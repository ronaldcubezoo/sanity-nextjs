import { UsersIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

/**
 * Desk: “Profile page builder” first, then other document types.
 * Open any profile to add/reorder **Sections** (text, list, components, or legacy blocks).
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Profile page builder")
        .id("profile-page-builder")
        .icon(UsersIcon)
        .child(
          S.documentTypeList("profile")
            .title("Profiles — sections & content")
            .defaultOrdering([{ field: "name", direction: "asc" }])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (item) => item.getId() !== "profile"
      ),
    ]);
