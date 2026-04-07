import { defineField, defineType } from "sanity";

export const componentDefinition = defineType({
  name: "componentDefinition",
  title: "Component Definition",
  type: "document",
  fields: [
    defineField({
      // Salesforce: Component_Definition__c.Name (Component Name)
      name: "name",
      title: "Component Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      // Salesforce: Component_Key__c (Text, required, unique, externalId)
      name: "componentKey",
      title: "Component Key",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      // Salesforce: Category__c (Text)
      name: "category",
      title: "Category",
      type: "string",
    }),
    defineField({
      // Salesforce: Sort_Order__c (Number)
      name: "sortOrder",
      title: "Sort Order",
      type: "number",
      validation: (r) => r.integer().min(0),
    }),
    defineField({
      // Salesforce: Is_Active__c (Checkbox, default true)
      name: "isActive",
      title: "Active",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      // Salesforce: Thumbnail_URL__c (Url)
      name: "thumbnailUrl",
      title: "Thumbnail URL",
      type: "url",
    }),
    defineField({
      // Salesforce: Min_Col_Span__c (Number)
      name: "minColSpan",
      title: "Min Col Span",
      type: "number",
      validation: (r) => r.integer().min(1).max(24),
    }),
    defineField({
      // Salesforce: Default_Col_Span__c (Number, default 4)
      name: "defaultColSpan",
      title: "Default Col Span",
      type: "number",
      initialValue: 4,
      validation: (r) => r.integer().min(1).max(24),
    }),
    defineField({
      // Salesforce: Max_Col_Span__c (Number)
      name: "maxColSpan",
      title: "Max Col Span",
      type: "number",
      validation: (r) => r.integer().min(1).max(24),
    }),
    defineField({
      // Salesforce: Default_Config_JSON__c (LongTextArea)
      name: "defaultConfigJson",
      title: "Default Config JSON",
      type: "text",
      rows: 8,
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
    select: { title: "name", subtitle: "componentKey" },
  },
});

