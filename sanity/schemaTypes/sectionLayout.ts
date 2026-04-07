import { defineField, defineType } from "sanity";

/** From sanity-check/schemaTypes/sectionLayout.js */
export const sectionLayout = defineType({
  name: "sectionLayout",
  title: "Section layout",
  type: "object",
  fields: [
    defineField({
      name: "grid",
      title: "Grid",
      type: "object",
      fields: [
        defineField({ name: "lg", title: "Large", type: "gridBreakpoint" }),
        defineField({ name: "md", title: "Medium", type: "gridBreakpoint" }),
        defineField({ name: "sm", title: "Small", type: "gridBreakpoint" }),
      ],
    }),
  ],
});
