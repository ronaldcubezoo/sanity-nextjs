import { defineArrayMember, defineField, defineType } from "sanity";

export const profile = defineType({
  name: "profile",
  title: "Profile",
  type: "document",
  groups: [
    { name: "pageBuilder", title: "Page builder", default: true },
    { name: "basics", title: "Identity & bio" },
    { name: "media", title: "Media" },
    { name: "branding", title: "Theme & social" },
    { name: "system", title: "Integrations" },
  ],
  fields: [
    defineField({
      name: "sections",
      title: "Page sections",
      type: "array",
      group: "pageBuilder",
      of: [
        defineArrayMember({
          type: "section",
          title: "Section (text, list, or components)",
        }),
        defineArrayMember({
          type: "profileSection",
          title: "Timeline block (Salesforce-style)",
        }),
      ],
      options: {
        sortable: true,
      },
      description:
        "Legacy page sections (Salesforce / rich text). The public site uses the **Custom page builder** below when set; if builder blocks are not saved yet, content here is imported automatically into the page builder.",
    }),
    defineField({
      name: "builderBlocks",
      title: "Page builder (Next app)",
      type: "array",
      group: "pageBuilder",
      of: [{ type: "profilePageBlock" }],
      options: {
        sortable: true,
      },
      description:
        "Canonical layout for `/profiles/[slug]`. Edited in **Page builder** (`/profiles/[slug]/edit`). Leave empty to auto-build from legacy sections + biography until the first save.",
    }),
    defineField({
      name: "salesforceId",
      title: "Salesforce ID",
      type: "string",
      group: "system",
    }),
    defineField({
      name: "name",
      title: "Profile name",
      type: "string",
      group: "basics",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "URL slug",
      type: "slug",
      group: "basics",
      options: { source: "name", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "current_role",
      title: "Current role",
      type: "string",
      group: "basics",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      group: "basics",
    }),
    defineField({
      name: "headline",
      title: "Headline",
      type: "string",
      group: "basics",
    }),
    defineField({
      name: "biography",
      title: "Biography",
      type: "array",
      group: "basics",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "basics",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "portraitImageUrl",
      title: "Portrait image URL",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "coverImageUrl",
      title: "Cover image URL",
      type: "url",
      group: "media",
    }),
    defineField({
      name: "theme_fix",
      title: "Theme (inline)",
      type: "themeFix",
      group: "branding",
    }),
    defineField({
      name: "brandTheme",
      title: "Brand theme",
      type: "reference",
      group: "branding",
      to: [{ type: "brandTheme" }],
    }),
    defineField({
      name: "socials",
      title: "Social links",
      type: "array",
      group: "branding",
      of: [{ type: "socialLink" }],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title: title || "Untitled profile",
        subtitle,
      };
    },
  },
});
