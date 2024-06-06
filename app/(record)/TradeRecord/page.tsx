"use client"
import DateFilter from "../DateFilter"
import TradeLog from "../TradeLog"
import TradePlan from "../TradePlan"
import TradeSummary from "../TradeSummary"
import HistoryTradeSummary from "../HistoryTradeSummary"
import ProfitChart from "../ProfitChart"
export default function Component() {
  return (
    <div className="flex flex-col">
      <nav className="bg-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        </div>
      </nav>

      <main className="container mx-auto my-4 grid grid-cols-1  md:grid-cols-3 gap-4 px-2 md:px-4">
        {/* 庫存 */}
        <TradeSummary />

        {/* // TODO:暫定是歷史交易明細 */}
        <HistoryTradeSummary />

        {/* 大盤跟已實現的線圖 */}
        <ProfitChart />

        {/* 日期和進出紀錄 */}
        <div className="col-span-2">
          <DateFilter />
          <TradeLog />
        </div>

        {/* 交易計劃 */}
        <TradePlan />
      </main>
    </div>
  )
}


