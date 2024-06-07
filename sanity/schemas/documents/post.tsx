import { DocumentTextIcon } from "@sanity/icons"
import { format, parseISO } from "date-fns"
import { defineField, defineType } from "sanity"

import authorType from "./author"
import { CSSProperties } from "react"

/**
 * This file is the schema definition for a post.
 *
 * Here you'll be able to edit the different fields that appear when you 
 * create or edit a post in the studio.
 * 
 * Here you can see the different schema types that are available:

  https://www.sanity.io/docs/schema-types

 */

const HighlightIcon = ({
  styles,
  icon,
}: {
  styles: CSSProperties | undefined
  icon: React.ReactNode
}) => <span style={styles}>H</span>
const HighlightDecorator = ({
  children,
  styles,
}: {
  children: React.ReactNode
  styles: CSSProperties | undefined
}) => <span style={styles}>{children}</span>

export default defineType({
  name: "post",
  title: "Post",
  icon: DocumentTextIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "A slug is required for the post to show up in the preview",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
              { title: "Underline", value: "underline" },
              { title: "Strike", value: "strike-through" },
              {
                title: "Highlight",
                value: "highlight",
                icon: (
                  <HighlightIcon
                    styles={{ backgroundColor: "yellow" }}
                    icon="H"
                  />
                ),
                component: ({ children }: { children: React.ReactNode }) => (
                  <HighlightDecorator styles={{ backgroundColor: "yellow" }}>
                    {children}
                  </HighlightDecorator>
                ),
              },
              {
                title: "BlueText",
                value: "blueText",
                icon: <HighlightIcon styles={{ color: "blue" }} icon="T" />,
                component: ({ children }: { children: React.ReactNode }) => (
                  <HighlightDecorator styles={{ color: "blue" }}>
                    {children}
                  </HighlightDecorator>
                ),
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
    }),
    defineField({
      name: "coverImage",
      title: "Cover Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessiblity.",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return "Required"
              }
              return true
            })
          },
        },
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "date",
      title: "Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: authorType.name }],
    }),
  ],
  preview: {
    select: {
      title: "title",
      author: "author.name",
      date: "date",
      media: "coverImage",
    },
    prepare({ title, media, author, date }) {
      const subtitles = [
        author && `by ${author}`,
        date && `on ${format(parseISO(date), "LLL d, yyyy")}`,
      ].filter(Boolean)

      return { title, media, subtitle: subtitles.join(" ") }
    },
  },
})
