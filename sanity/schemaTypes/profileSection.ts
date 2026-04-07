import { defineField, defineType } from "sanity";

export const profileSection = defineType({
  name: "profileSection",
  title: "Profile Section",
  type: "object",
  fieldsets: [
    { name: "main", title: "Section" },
    { name: "layout", title: "Layout" },
  ],
  fields: [
    defineField({
      // Salesforce: Profile_Section__c.Title__c (Text)
      name: "title",
      title: "Title",
      type: "string",
      fieldset: "main",
    }),
    defineField({
      // Salesforce: Profile_Section__c.Type__c (Text 80)
      name: "type",
      title: "Type",
      type: "string",
      fieldset: "main",
      description:
        "Freeform section type key (matches your Salesforce `Type__c`).",
    }),
    defineField({
      // Salesforce: Display_Order__c (Number)
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      fieldset: "main",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      // Not present in Salesforce fields list, but app expects `gridColumns`.
      name: "gridColumns",
      title: "Grid Columns",
      type: "number",
      fieldset: "layout",
      initialValue: 12,
      validation: (r) => r.integer().min(1).max(24),
    }),
    defineField({
      // Salesforce: Is_Hidden__c (Checkbox)
      name: "isHidden",
      title: "Hidden",
      type: "boolean",
      fieldset: "layout",
      initialValue: false,
    }),
    defineField({
      // Salesforce: Background_Color__c (Text)
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
      fieldset: "layout",
      description: "CSS color value (ex: #111827, rgb(), hsl(), etc).",
    }),
    defineField({
      // Salesforce: Padding__c (Text)
      name: "padding",
      title: "Padding",
      type: "string",
      fieldset: "layout",
      description: "CSS padding shorthand (ex: 24px 16px).",
    }),
    defineField({
      // Salesforce: Height_Mode__c (Text)
      name: "heightMode",
      title: "Height Mode",
      type: "string",
      fieldset: "layout",
      description: "Freeform key (ex: auto, full, screen).",
    }),
    defineField({
      // Salesforce: Components_JSON__c (LongTextArea)
      name: "componentsJson",
      title: "Components JSON",
      type: "text",
      rows: 6,
      fieldset: "layout",
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
      // Salesforce: child Section_Item__c records.
      name: "items",
      title: "Items",
      type: "array",
      fieldset: "main",
      of: [{ type: "sectionItem" }],
      options: { sortable: true },
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "type" },
  },
});

