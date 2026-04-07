import { defineField, defineType } from "sanity";

/**
 * Unified section: text, list (items), or components row for the profile page builder.
 */
export const section = defineType({
  name: "section",
  title: "Section",
  type: "object",
  fieldsets: [
    { name: "identity", title: "Type & title", options: { columns: 2 } },
    { name: "order", title: "Order" },
    { name: "appearance", title: "Layout & appearance" },
    { name: "body", title: "Content" },
    { name: "integrations", title: "Integrations", options: { collapsed: true } },
  ],
  fields: [
    defineField({
      name: "type",
      title: "Section kind",
      type: "string",
      fieldset: "identity",
      options: {
        list: [
          { title: "Text — single body block", value: "text" },
          { title: "List — timeline / entries", value: "list" },
          { title: "Components — registered blocks + JSON", value: "components" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "title",
      title: "Section heading",
      type: "string",
      fieldset: "identity",
      description: "Shown on the public profile (e.g. “About”, “Experience”).",
    }),
    defineField({
      name: "id",
      title: "Stable id (optional)",
      type: "string",
      fieldset: "identity",
      description: "e.g. section-about — useful for analytics or deep links.",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      fieldset: "order",
      description: "Lower numbers appear first (with Display order as fallback).",
      validation: (r) => r.integer(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order (legacy)",
      type: "number",
      fieldset: "order",
      description: "Used if Order is empty; matches Salesforce ordering.",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: "content",
      title: "Body text",
      type: "text",
      fieldset: "body",
      rows: 6,
      description: "Used when Section kind is **Text**.",
      hidden: ({ parent }) => parent?.type !== "text",
    }),
    defineField({
      name: "items",
      title: "List items",
      type: "array",
      fieldset: "body",
      of: [{ type: "sectionItem" }],
      options: { sortable: true },
      hidden: ({ parent }) => parent?.type !== "list",
    }),
    defineField({
      name: "components",
      title: "Components",
      type: "array",
      fieldset: "body",
      of: [{ type: "pageComponent" }],
      options: { sortable: true },
      hidden: ({ parent }) => parent?.type !== "components",
    }),
    defineField({
      name: "style",
      title: "Theme tokens (text / bg / accent)",
      type: "sectionStyle",
      fieldset: "appearance",
    }),
    defineField({
      name: "layout",
      title: "Responsive grid",
      type: "sectionLayout",
      fieldset: "appearance",
    }),
    defineField({
      name: "gridColumns",
      title: "Grid columns",
      type: "number",
      fieldset: "appearance",
      initialValue: 12,
      validation: (r) => r.integer().min(1).max(24),
    }),
    defineField({
      name: "isHidden",
      title: "Hidden on site",
      type: "boolean",
      fieldset: "appearance",
      initialValue: false,
    }),
    defineField({
      name: "backgroundColor",
      title: "Background (CSS)",
      type: "string",
      fieldset: "appearance",
    }),
    defineField({
      name: "padding",
      title: "Padding (CSS)",
      type: "string",
      fieldset: "appearance",
    }),
    defineField({
      name: "heightMode",
      title: "Height mode",
      type: "string",
      fieldset: "appearance",
    }),
    defineField({
      name: "salesforceId",
      title: "Salesforce ID",
      type: "string",
      fieldset: "integrations",
    }),
    defineField({
      name: "componentsJson",
      title: "Components JSON (Salesforce)",
      type: "text",
      rows: 4,
      fieldset: "body",
      hidden: ({ parent }) => parent?.type === "components",
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
  ],
  preview: {
    select: {
      title: "title",
      order: "order",
      displayOrder: "displayOrder",
      sectionType: "type",
    },
    prepare({
      title,
      order,
      displayOrder,
      sectionType,
    }: {
      title?: string;
      order?: number;
      displayOrder?: number;
      sectionType?: string;
    }) {
      const ord = order ?? displayOrder;
      const kind =
        sectionType === "text"
          ? "Text"
          : sectionType === "list"
            ? "List"
            : sectionType === "components"
              ? "Components"
              : sectionType || "Section";
      return {
        title: title || "Untitled section",
        subtitle: [kind, ord != null ? `#${ord}` : null].filter(Boolean).join(" · "),
      };
    },
  },
});
