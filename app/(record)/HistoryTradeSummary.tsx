import { cn } from "@/utils"
import React from "react"

const HistoryTradeSummary = ({layout}: {layout?: string}) => {
  return (
    <div className={cn("p-4 bg-white rounded-md shadow-md", layout)}>
      <h2 className="text-xl font-bold mb-2">歷史交易明細</h2>
      <p className="text-2xl text-red-500 mb-4">買賣紀錄：38,000</p>
      {/* 交易紀錄圖表 */}
    </div>
  )
}

export default HistoryTradeSummary
