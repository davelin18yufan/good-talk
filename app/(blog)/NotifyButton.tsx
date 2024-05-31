"use client"

type NotifyOption = {
  message: string
  imageThumbnail?: string
  imageFullsize?: string
  imageFile?: File
  stickerPackageId?: number
  stickerId?: number
}

export default function NotifyButton() {
  const formData = new FormData()
  formData.append("message", "test")

  async function onClick() {
    await fetch("/api/notify", { method: "POST", body: formData })
  }

  return (
    <button className="border bg-slate-200 mb-8" onClick={onClick}>
      notify
    </button>
  )
}
