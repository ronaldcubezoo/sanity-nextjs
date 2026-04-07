import { defineField, defineType } from "sanity";

/** From sanity-check/schemaTypes/sectionItemMeta.js */
export const sectionItemMeta = defineType({
  name: "sectionItemMeta",
  title: "Item metadata",
  type: "object",
  fields: [
    defineField({
      name: "read_time_minutes",
      title: "Read time (minutes)",
      type: "number",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),
  ],
});
