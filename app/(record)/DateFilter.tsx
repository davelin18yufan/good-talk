"use client"
import { cn } from "@/utils"
import React, { useEffect, useState, useRef, memo, useCallback } from "react"
import { useDate } from "@/store/date"
import { useShallow } from "zustand/react/shallow"

const DateButton = memo(
  ({ date, isSelected }: { date: string; isSelected: boolean }) => {
    const selectDate = useDate((store) => store.selectDate)
    const handleClick = useCallback(async () => {
      selectDate(date)
      //TODO: fetch history data
    }, [date])

    const formatDate = (dateString: string): string => {
      const date = new Date(dateString)
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const day = String(date.getDate()).padStart(2, "0")
      return `${month}/${day}`
    }
    return (
      <button
        id={date}
        className={cn("dateBtn", isSelected && "bg-white text-black")}
        onClick={handleClick}
      >
        {formatDate(date)}
      </button>
    )
  }
)

const DateFilter = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const containerRef = useRef<HTMLDivElement>(null)
  // prevent unnecessary rerenders when the selector output does not change according to shallow equal.
  const { today, selectedDate } = useDate(
    useShallow((state) => ({
      today: state.today,
      selectedDate: state.selectedDate,
    }))
  )

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

  // let today scroll into view
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
        {dates.map((date) => {
          const isSelected = selectedDate === date // default = today

          return <DateButton {...{ date, isSelected }} key={date} />
        })}
      </div>
    </div>
  )
}

export default DateFilter
