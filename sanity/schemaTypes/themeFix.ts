import { defineField, defineType } from "sanity";

/** From sanity-check/schemaTypes/themeFix.js */
export const themeFix = defineType({
  name: "themeFix",
  title: "Theme (fixed colors)",
  type: "object",
  fields: [
    defineField({ name: "primary", title: "Primary", type: "string" }),
    defineField({ name: "secondary", title: "Secondary", type: "string" }),
    defineField({ name: "accent", title: "Accent", type: "string" }),
    defineField({ name: "text_on_primary", title: "Text on primary", type: "string" }),
    defineField({ name: "text_on_secondary", title: "Text on secondary", type: "string" }),
    defineField({ name: "text_on_accent", title: "Text on accent", type: "string" }),
  ],
});
