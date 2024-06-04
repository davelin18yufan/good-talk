import Link from "next/link"

import Avatar from "./avatar"
import CoverImage from "./cover-image"
import DateComponent from "./date"

import type { MoreStoriesQueryResult } from "@/sanity.types"
import { sanityFetch } from "@/sanity/lib/fetch"
import { moreStoriesQuery } from "@/sanity/lib/queries"
import { StickyScroll } from "@/components/StickyScroll"

export default async function MoreStories(params: {
  skip: string
  limit: number
}) {
  const data = await sanityFetch<MoreStoriesQueryResult>({
    query: moreStoriesQuery,
    params,
  })

  const content = data.map((item) => ({
    id: item._id,
    title: item.title,
    description: item.excerpt || "",
    content: <CoverImage image={item.coverImage} priority={false} />,
    author: item.author && (
      <Avatar name={item.author.name} picture={item.author.picture} />
    ),
    date: <DateComponent dateString={item.date} />,
    slug: item.slug
  }))

  return (
    <div className="mb-32 ">
      <StickyScroll content={content} contentClassName="p-2 lg:p-4" />
    </div>
  )
}
