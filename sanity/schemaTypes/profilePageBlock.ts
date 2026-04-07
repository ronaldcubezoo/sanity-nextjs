import { defineField, defineType } from "sanity";

/**
 * Blocks for the Next.js page builder (not edited in Studio by default).
 * Stored on `profile.builderBlocks`; order is array order.
 */
export const profilePageBlock = defineType({
  name: "profilePageBlock",
  title: "Page builder block",
  type: "object",
  fields: [
    defineField({
      name: "blockKey",
      title: "Block type key",
      type: "string",
      description: "Matches the app registry (e.g. hero, text, cta, custom).",
      validation: (r) => r.required(),
    }),
    defineField({
      name: "propsJson",
      title: "Props (JSON)",
      type: "text",
      rows: 8,
      description: "Serialized props for this block instance.",
      validation: (r) =>
        r.custom((value) => {
          if (!value || !String(value).trim()) return true;
          try {
            JSON.parse(String(value));
            return true;
          } catch {
            return "Must be valid JSON";
          }
        }),
    }),
    defineField({
      name: "componentDefinition",
      title: "Custom component",
      type: "reference",
      to: [{ type: "componentDefinition" }],
      description: "For block type **custom**: registered component + config JSON.",
    }),
  ],
  preview: {
    select: {
      blockKey: "blockKey",
      refName: "componentDefinition.name",
      refKey: "componentDefinition.componentKey",
    },
    prepare({
      blockKey,
      refName,
      refKey,
    }: {
      blockKey?: string;
      refName?: string;
      refKey?: string;
    }) {
      const sub = [refName, refKey].filter(Boolean).join(" · ");
      return {
        title: blockKey || "Block",
        subtitle: sub || undefined,
      };
    },
  },
});
