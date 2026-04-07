import { defineField, defineType } from "sanity";

/** From sanity-check/schemaTypes/gridBreakpoint.js */
export const gridBreakpoint = defineType({
  name: "gridBreakpoint",
  title: "Grid breakpoint",
  type: "object",
  fields: [
    defineField({
      name: "col_span",
      title: "Column span",
      type: "number",
      validation: (r) => r.integer().positive(),
    }),
    defineField({
      name: "row_span",
      title: "Row span",
      type: "number",
      validation: (r) => r.integer().positive(),
    }),
  ],
});
