import { defineField, defineType } from "sanity";

export const brandTheme = defineType({
  name: "brandTheme",
  title: "Brand Theme",
  type: "document",
  fields: [
    defineField({
      // Salesforce: Brand_Theme__c.Name (Theme Name)
      name: "name",
      title: "Theme Name",
      type: "string",
      validation: (r) => r.required(),
    }),
    defineField({
      // Salesforce: Primary_Color__c (Text)
      name: "primaryColor",
      title: "Primary Color",
      type: "string",
    }),
    defineField({
      // Salesforce: Secondary_Color__c (Text)
      name: "secondaryColor",
      title: "Secondary Color",
      type: "string",
    }),
    defineField({
      // Salesforce: Accent_Color__c (Text)
      name: "accentColor",
      title: "Accent Color",
      type: "string",
    }),
    defineField({
      // Salesforce: Background_Color__c (Text)
      name: "backgroundColor",
      title: "Background Color",
      type: "string",
    }),
    defineField({
      // Salesforce: Heading_Font__c (Text)
      name: "headingFont",
      title: "Heading Font",
      type: "string",
    }),
    defineField({
      // Salesforce: Body_Font__c (Text)
      name: "bodyFont",
      title: "Body Font",
      type: "string",
    }),
    defineField({
      // Salesforce: Font_Size_Base__c (Text)
      name: "fontSizeBase",
      title: "Font Size Base",
      type: "string",
      description: "CSS size (ex: 16px, 1rem).",
    }),
    defineField({
      // Salesforce: Border_Radius__c (Text)
      name: "borderRadius",
      title: "Border Radius",
      type: "string",
      description: "CSS radius (ex: 12px, 0.75rem).",
    }),
    defineField({
      // Salesforce: Button_Style__c (Text)
      name: "buttonStyle",
      title: "Button Style",
      type: "string",
    }),
    defineField({
      // Salesforce: Custom_CSS__c (LongTextArea)
      name: "customCss",
      title: "Custom CSS",
      type: "text",
      rows: 8,
    }),
  ],
  preview: {
    select: { title: "name" },
  },
});

