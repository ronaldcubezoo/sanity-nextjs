import { defineField, defineType } from "sanity";

/** From sanity-check/schemaTypes/socialLink.js */
export const socialLink = defineType({
  name: "socialLink",
  title: "Social link",
  type: "object",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      description: "e.g. twitter, linkedin, github",
    }),
    defineField({
      name: "value",
      title: "Handle or URL",
      type: "string",
    }),
  ],
  preview: {
    select: { type: "type", value: "value" },
    prepare({ type, value }: { type?: string; value?: string }) {
      return {
        title: value || "Empty link",
        subtitle: type,
      };
    },
  },
});
