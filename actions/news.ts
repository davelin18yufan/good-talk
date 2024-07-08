import { News } from "@/types/data.t"
import * as cheerio from "cheerio"

const baseUrl = "https://news.cnyes.com" as const
const url = "https://news.cnyes.com/news/cat/headline" as const
const DEFAULT_NEWS_IMG = 3 as const // default news image in local

// Get headlines from 鉅亨網
export async function getNewsInfo(): Promise<News[]> {
  let output: News[] = []
  try {
    const res = await fetch(url, { next: { revalidate: 300 } })
    const body = new Response(res.body)
    const parseBody = await body.text()
    const $ = cheerio.load(parseBody)

    $("a[href*='/news/id']").each(function (index, element) {
      const title = $(element).find("h3").text()
      const href = $(element).attr("href")
      const category = $(element).parent("div").find("button").text()
      const rawImageUrl = $(element).find("div[style*='url']").attr("style")
      const imageUrlMatch = rawImageUrl?.match(/url\((.*?)\)/)
      const imageUrl = imageUrlMatch ? imageUrlMatch[1] : ""

      const defaultImageUrl = `/newsImg-${Math.floor(Math.random() * DEFAULT_NEWS_IMG)}.jpeg`

      const news = {
        title: category || "鉅亨網",
        quote: title,
        href: baseUrl + href,
        imageUrl: imageUrl.startsWith("https:")
          ? `url(${imageUrl})`
          : `url(${defaultImageUrl})`,
        name: "",
      }
      output.push(news)
    })

    return output
  } catch (err) {
    console.error(err)
    throw err
  }
}
