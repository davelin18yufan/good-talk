"use client"

export default function NotifyButton() {
  const formData = new FormData()
  formData.append("message", "test")

  return (
    <button
      className="border bg-slate-200 mb-8"
      onClick={async () =>
        await fetch("/api/notify", { method: "POST", body: formData })
      }
    >
      notify
    </button>
  )
}
