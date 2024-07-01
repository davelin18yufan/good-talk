import { News } from "@/app/(record)/database"
import * as cheerio from "cheerio"
import { NextResponse } from "next/server"

const baseUrl = "https://news.cnyes.com"
const url = "https://news.cnyes.com/news/cat/tw_stock_news"

export async function GET(request: Request) {
  let output: News[] = []
  const res = await fetch(url)
  try {
    const body = new Response(res.body)
    const parseBody = await body.text()
    const $ = cheerio.load(parseBody)
    $(".l6okjhz").each(function (index, element) {
      const title = $(element).find(".list-title a").attr("title")
      const href = $(element).find(".list-title a").attr("href")
      const category = $(element).find(".c1m5ajah span").text()

      const obj = {
        title: title,
        category: category,
        href: baseUrl + href,
      }

      output.push(obj)
    })
    return NextResponse.json(output)
  } catch (err:any) {
    NextResponse.json({ error: err.message })
  }
}
