"use client"
import React, { useState } from "react"

const DateFilter = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())

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

  return (
    <div className="p-4 bg-white rounded-md shadow-md mb-4">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          上月
        </button>
        <span className="text-lg font-semibold">{`${currentYear}-${String(currentMonth + 1).padStart(2, "0")}`}</span>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          下月
        </button>
      </div>
      <div className="flex space-x-2 overflow-x-auto">
        {dates.map((date, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            {formatDate(date)}
          </button>
        ))}
      </div>
    </div>
  )
}

export default DateFilter
