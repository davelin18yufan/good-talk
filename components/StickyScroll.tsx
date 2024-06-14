"use client"
import React, { useEffect, useRef, useState } from "react"
import { useMotionValueEvent, useScroll } from "framer-motion"
import { motion } from "framer-motion"
import { cn } from "@/utils"
import Link from "next/link"

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string
    description: string
    content: React.ReactNode
    author: React.ReactNode | null
    date: React.ReactNode
    slug: string | null
  }[]
  contentClassName?: string
}) => {
  const [activeCard, setActiveCard] = React.useState(0)
  const ref = useRef<any>(null)
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  })
  const cardLength = content.length + 1 // add 1 empty item so the last item can be detected, since the breakpoint stop before reach end

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength)
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint)
        // console.log(
        //   `Latest: ${latest}, Breakpoint: ${breakpoint}, Distance: ${distance}`
        // )
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index
        }
        return acc
      },
      0
    )
    setActiveCard(closestBreakpointIndex)
  })

  const backgroundColors = [
    "var(--slate-200)",
    "var(--gray-200)",
    "var(--neutral-200)",
  ]
  const linearGradients = [
    "linear-gradient(to bottom right, var(--cyan-400), var(--emerald-400))",
    "linear-gradient(to bottom right, var(--pink-400), var(--indigo-400))",
    "linear-gradient(to bottom right, var(--orange-400), var(--yellow-400))",
  ]

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  )

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length])
  }, [activeCard, linearGradients])

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="h-[30rem] overflow-y-auto w-full flex justify-center relative space-x-10 rounded-md py-10 px-8"
      ref={ref}
    >
      <div className="relative flex items-start px-4 text-pretty">
        <div className="">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-2xl font-bold text-slate-900"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                className="text-slate-800 max-w-sm mt-10 "
              >
                {item.description}
              </motion.p>
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <Link
        href={`/posts/${content[activeCard].slug}`}
        style={{ background: backgroundGradient }}
        className={cn(
          "hidden md:flex flex-col rounded-md h-fit bg-white max-w-[540px] sticky top-10 overflow-hidden",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
        <div className="flex flex-col md:flex-row items-center justify-between mt-6 lg:mt-2 gap-4">
          {content[activeCard].author}
          {content[activeCard].date}
        </div>
      </Link>
    </motion.div>
  )
}
