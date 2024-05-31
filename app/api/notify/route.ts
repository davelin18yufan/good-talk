import { NextResponse, type NextRequest } from "next/server"
import { toPlainText } from "next-sanity"
import { parseBody } from "next-sanity/webhook"

// request comes from sanity webhook if an new post created
// line-notify
export async function POST(request: NextRequest) {
  // TODO:transfer request content to formData
  const { isValidSignature, body } = await parseBody(
    request,
    process.env.SANITY_WEBHOOK_CREATE_SECRET
  )

  if(!isValidSignature) return NextResponse.json({message:'Bad Request'})

  console.log(body)
  // const formData = await request.formData()
  
  // const res = await fetch("https://notify-api.line.me/api/notify", {
  //   method: "POST",
  //   headers: {
  //     //* unnecessary content configuration, cause browser will automatically set a boundary parameter for data split
  //     // "Content-Type": "multipart/form-data",
  //     Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_NOTIFY_TOKEN!}`,
  //   },
  //   body: formData,
  // })

  // const data = await res.json()
  // return NextResponse.json(data)
}
