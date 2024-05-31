import { NextResponse, type NextRequest } from "next/server"
import { parseBody } from "next-sanity/webhook"
import { revalidatePath } from "next/cache"
import { SanityDocument, toPlainText } from "next-sanity"

// request comes from sanity webhook if an new post created
// line-notify
export async function POST(request: NextRequest) {
  // TODO:transfer request content to formData
  try {
    //* Webhook
    // parse body from sanity webhook
    const { body, isValidSignature } = await parseBody<SanityDocument>(
      request,
      process.env.NEXT_PUBLIC_SANITY_HOOK_SECRET
    )

    if (!isValidSignature) {
      return new Response("Invalid Signature", { status: 401 })
    }

    if (!body?._type) { // every successful sanity request has _type
      return new Response("Bad Request", { status: 400 })
    }

    //* Line Notify 
    const { title, content, slug } = body
    const formData = new FormData()

    formData.append(
      "message",
      `${title} \n ${toPlainText(content)} \n https://good-talk.vercel.app/posts/${slug.current}`
    )

    const res = await fetch("https://notify-api.line.me/api/notify", {
      method: "POST",
      headers: {
        // unnecessary content configuration, cause browser will automatically set a boundary parameter for data split
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_NOTIFY_TOKEN!}`,
      },
      body: formData,
    })

    const data = await res.json()

    revalidatePath("/")
    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      data,
    })
  } catch (error: any) {
    console.error(error)
    return new Response(error.message, { status: 500 })
  }
}
