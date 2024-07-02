import { News } from "@/types/data.t"
import * as cheerio from "cheerio"

const baseUrl = "https://news.cnyes.com" as const
const url = "https://news.cnyes.com/news/cat/headline" as const

// Get headlines from 鉅亨網
export async function getNewsInfo(): Promise<News[]> {
  let output: News[] = []
  try {
    const res = await fetch(url)
    const body = new Response(res.body)
    const parseBody = await body.text()
    const $ = cheerio.load(parseBody)

    $(".l6okjhz").each(function (index, element) {
      const title = $(element).find(".list-title a").attr("title")
      const href = $(element).find(".list-title a").attr("href")
      const category = $(element).find(".c1m5ajah span").text()
      const imageUrl = $(element)
        .css("--l6okjhz-2")
        ?.replace(/^url\("|"\)$/g, "")

      const news = {
        title: category,
        quote: title,
        href: baseUrl + href,
        imageUrl,
      }
      output.push(news)
    })

    return output
  } catch (err) {
    console.error(err)
    throw err
  }
}
