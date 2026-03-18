import { defineField, defineType } from "sanity";

export const tag = defineType({
  name: "tag",
  title: "Tag",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required().max(40),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 40 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "color",
      title: "Color (optional hex)",
      type: "string",
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/),
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "slug.current" },
  },
});
