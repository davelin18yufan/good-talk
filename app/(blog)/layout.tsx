import "../globals.css"

import { SpeedInsights } from "@vercel/speed-insights/next"
import type { Metadata } from "next"
import { VisualEditing, toPlainText, type PortableTextBlock } from "next-sanity"
import { Inter } from "next/font/google"
import { draftMode } from "next/headers"
import { Suspense } from "react"

import AlertBanner from "./alert-banner"
import PortableText from "./portable-text"

import type { SettingsQueryResult } from "@/sanity.types"
import * as demo from "@/sanity/lib/demo"
import { sanityFetch } from "@/sanity/lib/fetch"
import { settingsQuery } from "@/sanity/lib/queries"
import { resolveOpenGraphImage } from "@/sanity/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { socialMedias } from "@/constants"

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
    // Metadata should never contain stega
    stega: false,
  })
  const title = settings?.title || demo.title
  const description = settings?.description || demo.description

  const ogImage = resolveOpenGraphImage(settings?.ogImage)
  let metadataBase: URL | undefined = undefined
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined
  } catch {
    // ignore
  }
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description: toPlainText(description),
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  }
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

async function Footer() {
  const data = await sanityFetch<SettingsQueryResult>({
    query: settingsQuery,
  })
  const value = data?.footer || []

  return (
    <footer className="bg-accent-1 border-accent-2 border-t">
      <div className="mx-auto lg:px-8">
        {value.length > 0 ? (
          <div className="flex h-80 gap-4 lg:gap-8">
            <div className="relative min-w-80 h-full">
              <Image src="/footer.png" alt="footer" fill />
            </div>
            <PortableText
              className="prose-sm text-pretty bottom-0 w-fit max-w-none bg-white text-start place-content-center md:py-4"
              value={value as PortableTextBlock[]}
            />
          </div>
        ) : (
          <div className="flex flex-col items-center py-28 lg:flex-row">
            <h3 className="mb-10 text-center text-4xl font-bold leading-tight tracking-tighter lg:mb-0 lg:w-1/2 lg:pr-4 lg:text-left lg:text-5xl">
              Built with Next.js.
            </h3>
            <div className="flex flex-col items-center justify-center lg:w-1/2 lg:flex-row lg:pl-4">
              <a
                href="https://nextjs.org/docs"
                className="mx-3 mb-6 border border-black bg-black py-3 px-12 font-bold text-white transition-colors duration-200 hover:bg-white hover:text-black lg:mb-0 lg:px-8"
              >
                Read Documentation
              </a>
              <a
                href="https://github.com/davelin18yufan"
                className="mx-3 font-bold hover:underline"
              >
                Check Dave out on GitHub
              </a>
            </div>
          </div>
        )}
      </div>
      <div className="flex gap-8 lg:gap-12 justify-center items-center bg-slate-200/50 mx-auto">
        <p className="md:text-base text-sm md:font-normal font-light">
          Copyright © 2024 Dave Lin
        </p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedias.map((info) => (
            <Link
              href={info.href}
              key={info.id}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              {/* <Image src={info.img} alt="icons" width={20} height={20} /> */}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} bg-white text-black`}>
      <body>
        <section className="min-h-screen">
          {draftMode().isEnabled && <AlertBanner />}
          <main>{children}</main>
          <Suspense>
            <Footer />
          </Suspense>
        </section>
        {draftMode().isEnabled && <VisualEditing />}
        <SpeedInsights />
      </body>
    </html>
  )
}
