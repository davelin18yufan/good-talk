"use client"
import { cn } from "@/utils"
import React, { useEffect, useState, useRef } from "react"

export function DateContainer({
  layout,
  children,
}: {
  layout: string
  children: React.ReactNode
}) {
  const today = new Date(Date.now()).toISOString().split("T")[0]
  const [selectedDate, setSelectedDate] = useState<string | null>(today)
  
  return (
    <div className={layout}>
      <DateFilter today={today} />
      {children}
    </div>
  )
}

const DateFilter = ({ today }: { today: string }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const containerRef = useRef<HTMLDivElement>(null)

  const generateDatesForMonth = (month: number, year: number): string[] => {
    let date = new Date(year, month, 1)
    const dates = []
    while (date.getMonth() === month) {
      date = new Date(year, month, date.getDate() + 1)
      dates.push(new Date(date).toISOString().split("T")[0])
    }

    return dates
  }

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const dates = generateDatesForMonth(currentMonth, currentYear)

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${month}/${day}`
  }

  useEffect(() => {
    const todayButton = document.getElementById(today)
    const container = containerRef.current

    if (todayButton && container) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = todayButton.getBoundingClientRect()
      const scrollOffset =
        buttonRect.left +
        buttonRect.width / 2 -
        containerRect.left -
        containerRect.width / 2

      container.scrollTo({
        left: scrollOffset,
        behavior: "smooth",
      })
    }
  }, [today])

  return (
    <div className="p-4 bg-white rounded-md shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <button onClick={handlePrevMonth} className="dateBtn py-1">
          上月
        </button>
        <span className="text-lg font-semibold">{`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`}</span>
        <button onClick={handleNextMonth} className="dateBtn py-1">
          下月
        </button>
      </div>
      <div className="flex space-x-2 overflow-x-auto" ref={containerRef}>
        {dates.map((date, index) => {
          const isToday = today === date

          return (
            <button
              key={index}
              id={date}
              className={cn("dateBtn", isToday && "bg-white text-black")}
            >
              {formatDate(date)}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default DateFilter
