import { defineField, defineType } from "sanity";

/**
 * Merged section line item: sanity-check (`sectionItem.js`) + Salesforce resume fields
 * used by `lib/sanity-service.ts`.
 */
export const sectionItem = defineType({
  name: "sectionItem",
  title: "Section item",
  type: "object",
  fields: [
    defineField({
      name: "salesforceId",
      title: "Salesforce ID",
      type: "string",
    }),
    defineField({
      name: "id",
      title: "Id",
      type: "string",
      description: "Stable id for this item (e.g. item-001)",
    }),
    defineField({
      name: "order",
      title: "Order",
      type: "number",
      description: "Sort order (sanity-check)",
      validation: (r) => r.integer(),
    }),
    defineField({
      name: "displayOrder",
      title: "Display order (Salesforce)",
      type: "number",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
    }),
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      description: "Optional item type key (fallback is section type).",
    }),
    defineField({
      name: "role",
      title: "Role",
      type: "string",
    }),
    defineField({
      name: "date_start",
      title: "Start date",
      type: "date",
    }),
    defineField({
      name: "date_end",
      title: "End date",
      type: "date",
    }),
    defineField({
      name: "date",
      title: "Date (label)",
      type: "string",
      description: "Freeform date label for the app (e.g. 2025–Present).",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "organization",
      title: "Organization",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "icon",
      title: "Icon URL",
      type: "url",
    }),
    defineField({
      name: "imageUrl",
      title: "Image URL",
      type: "url",
    }),
    defineField({
      name: "url",
      title: "Link URL",
      type: "url",
    }),
    defineField({
      name: "meta",
      title: "Metadata",
      type: "sectionItemMeta",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "subtitle",
      id: "id",
    },
    prepare({
      title,
      subtitle,
      id,
    }: {
      title?: string;
      subtitle?: string;
      id?: string;
    }) {
      return {
        title: title || "Untitled item",
        subtitle: [id, subtitle].filter(Boolean).join(" · "),
      };
    },
  },
});
