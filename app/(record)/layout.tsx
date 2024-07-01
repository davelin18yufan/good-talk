import "../globals.css"

import { Inter } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

export { metadata, viewport } from "next-sanity/studio"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen">
        <nav className="bg-gray-100 p-4">
          <div className="container mx-auto">
            <h1 className="text-2xl font-bold text-center">Dashboard</h1>
          </div>
        </nav>
        <TooltipProvider delayDuration={500}>{children}</TooltipProvider>
      </body>
    </html>
  )
}
