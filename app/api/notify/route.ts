import { NextResponse } from "next/server"

// line-notify
export async function POST(request: Request) {
  const formData = await request.formData()
  
  const res = await fetch("https://notify-api.line.me/api/notify", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_LINE_NOTIFY_TOKEN!}`,
    },
    body: formData,
  })

  const data = await res.json()
  return NextResponse.json(data)
}
