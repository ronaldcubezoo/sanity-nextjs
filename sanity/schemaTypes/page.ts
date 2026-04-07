import { defineField, defineType } from "sanity";

/** Registered before `section` (see schema index). */
export const pageComponent = defineType({
  name: "pageComponent",
  title: "Page component",
  type: "object",
  fields: [
    defineField({
      name: "component",
      title: "Component",
      type: "reference",
      to: [{ type: "componentDefinition" }],
      validation: (r) => r.required(),
    }),
    defineField({
      name: "configJson",
      title: "Config JSON",
      type: "text",
      rows: 8,
      description:
        "Overrides `defaultConfigJson` on the component definition (must be valid JSON).",
      validation: (r) =>
        r.custom((value) => {
          if (!value) return true;
          try {
            JSON.parse(String(value));
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
    }),
    defineField({
      name: "colSpan",
      title: "Column span",
      type: "number",
      validation: (r) => r.integer().min(1).max(24),
    }),
  ],
  preview: {
    select: { title: "component.name", subtitle: "component.componentKey" },
  },
});

/**
 * CMS page: built from `section` objects (same model as sanity-check + `components` variant).
 */
export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
    }),
    defineField({
      name: "brandTheme",
      title: "Brand theme",
      type: "reference",
      to: [{ type: "brandTheme" }],
    }),
    defineField({
      name: "theme_fix",
      title: "Theme (inline)",
      type: "themeFix",
      description: "Optional inline palette override (sanity-check pattern).",
    }),
    defineField({
      name: "sections",
      title: "Sections",
      type: "array",
      of: [{ type: "section" }],
      options: { sortable: true },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
