import { defineField, defineType } from "sanity";

/** From sanity-check/schemaTypes/sectionStyle.js */
export const sectionStyle = defineType({
  name: "sectionStyle",
  title: "Section style",
  type: "object",
  fields: [
    defineField({
      name: "color_text",
      title: "Text color",
      type: "string",
      description: "Theme token (e.g. primary, secondary)",
    }),
    defineField({
      name: "color_background",
      title: "Background color",
      type: "string",
      description: "Theme token",
    }),
    defineField({
      name: "color_accent",
      title: "Accent color",
      type: "string",
      description: "Theme token",
    }),
  ],
});
