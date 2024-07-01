import { News } from "@/types/data.t"
import * as cheerio from "cheerio"
import { NextResponse } from "next/server"

const baseUrl = "https://news.cnyes.com"
const url = "https://news.cnyes.com/news/cat/headline"

// Get headlines from 鉅亨網
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
      const imageUrl = $(element).css("--l6okjhz-2")?.replace(/^url\("|"\)$/g, "")

      const obj = {
        title: title,
        category: category,
        href: baseUrl + href,
        imageUrl: imageUrl,
      }
      output.push(obj)
    })
    return NextResponse.json(output)
  } catch (err:any) {
    NextResponse.json({ error: err.message })
  }
}
