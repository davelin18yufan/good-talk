"use client"

import DateFilter from "../DateFilter"
import TradeLog from "../TradeLog"
import TradePlan from "../TradePlan"
import TradeSummary from "../TradeSummary"
import HistoryTradeSummary from "../HistoryTradeSummary"
import ProfitChart from "../ProfitChart"

// TODO: 架設資料庫
// TODO: 建立Schema
// TODO: 定義可能使用的CRUD
  // 1. 庫存 2. 交易紀錄 3. 規劃 4. 標的如果不存在自動新增

const dummyData = {
  user_id : '123',
  username: "Dave",
  email: 'test@example.com',
  asset: {
    _id: '123',
    totalCost: 200000,
    totalMarketPrice: 213214,
    position: [
      {
        asset_id: '3306',
        asset_name: '晶豪科期',
        quantity: 3000,
        cost: 91,
        current: 94.3
      },
      {
        asset_id: '3443',
        asset_name: '創意期',
        quantity: 2000,
        cost: 1437.5,
        current: 1575
      }
    ]
  }
}

export default function TradeRecord() {
  return (
    <div className="flex flex-col">
      <nav className="bg-gray-100 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold text-center">Dashboard</h1>
        </div>
      </nav>

      <main className="container mx-auto my-4 grid grid-cols-1  md:grid-cols-3 gap-4 px-2 md:px-4">
        {/* 庫存 */}
        <TradeSummary asset={dummyData.asset}/>

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


