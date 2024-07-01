import { News, NewsParsed } from "@/types/data.t"

export async function getNewsInfo(): Promise<NewsParsed[]> {
  try {
    // cached lifetime = 300s
    const res = await fetch(`http://localhost:3000/api/crawler`, {
      next: { revalidate: 300 },
    })
    const resJson = await res?.json()
    return resJson.map((item: News) => ({
      title: item.category,
      quote: item.title,
      href: item.href,
      imageUrl: item.imageUrl,
    }))
  } catch (err) {
    console.error(err)
    throw err
  }
}
