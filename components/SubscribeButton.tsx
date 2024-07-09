"use client"

import { AnimatePresence, motion } from "framer-motion"
import React, { useState } from "react"

interface AnimatedSubscribeButtonProps {
  buttonColor: string
  buttonTextColor?: string
  subscribeStatus: boolean
  initialText: React.ReactElement | string
  changeText: React.ReactElement | string
}

export const AnimatedSubscribeButton: React.FC<
  AnimatedSubscribeButtonProps
> = ({
  buttonColor,
  subscribeStatus,
  buttonTextColor,
  changeText,
  initialText,
}) => {
  const [isSubscribed, setIsSubscribed] = useState<boolean>(subscribeStatus)

  return (
    <AnimatePresence mode="wait">
      {isSubscribed ? (
        <motion.button
          className="relative flex max-lg:w-[200px] items-center justify-center overflow-hidden rounded-md p-[10px] hover:bg-transparent"
          onClick={() => setIsSubscribed(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span
            key="action"
            className="relative block h-full w-full font-semibold"
            style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          >
            {changeText}
          </span>
        </motion.button>
      ) : (
        <motion.button
          className="relative flex max-lg:w-[200px] cursor-pointer items-center justify-center rounded-md border-none p-[10px]"
          style={{ backgroundColor: buttonColor, color: buttonTextColor }}
          onClick={() => setIsSubscribed(true)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <span
            key="reaction"
            className="relative block font-semibold"
          >
            {initialText}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
