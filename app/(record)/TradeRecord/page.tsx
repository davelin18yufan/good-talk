import DateFilter from "../DateFilter"
import TradeLog from "../TradeLog"
import TradePlan from "../TradePlan"
import TradeSummary from "../TradeSummary"
import RealizedPnLChart from "../RealizedPnLChart"
import ProfitChart from "../ProfitChart"

import { getPositionCurrentPrices } from "@/actions/fugle.action"
import { cn } from "@/utils"

// TODO: 架設資料庫
// TODO: 建立Schema
// TODO: 定義可能使用的CRUD
// 1. 庫存 2. 交易紀錄 3. 規劃 4. 標的如果不存在自動新增

const dummyData = {
  user_id: "123",
  username: "Dave",
  email: "test@example.com",
  asset: {
    _id: "123",
    totalCost: 200000,
    totalMarketPrice: 213214,
    position: [
      {
        asset_id: "3006",
        asset_name: "晶豪科",
        quantity: 3000,
        cost: 91,
      },
      {
        asset_id: "3443",
        asset_name: "創意",
        quantity: 2000,
        cost: 1437.5,
      },
    ],
  },
}

export default async function TradeRecord() {
  // get current position market price
  const symbols = dummyData.asset.position.map((item) => item.asset_id)
  const currentPrices = await getPositionCurrentPrices(symbols)

  return (
    <div className="flex flex-col">
      <main
        className={cn(
          "container mx-auto my-4",
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
          "gap-4 px-2 md:px-4"
        )}
      >
        {/* 庫存 */}
        <TradeSummary
          asset={dummyData.asset}
          currentPrices={currentPrices}
          layout="col-span-1 md:col-span-2 lg:col-span-1"
        />

        {/* 已實現紀錄 */}

        {/* 資金水位圓餅圖 */}

        {/* 已實現的績效紀錄線圖 */}
        <RealizedPnLChart layout="col-span-1" />

        {/* 大盤跟已實現比較的線圖 */}
        <ProfitChart layout="col-span-1" />

        {/* 日期和進出紀錄 */}
        <div className="md:col-span-2">
          <DateFilter />
          <TradeLog />
        </div>

        {/* 交易計劃 */}
        <TradePlan layout="md:col-span-2 lg:col-span-1 h-[597px]" />

        {/* //TODO: 暫定製作覆盤紀錄及心得紀錄 */}
      </main>
    </div>
  )
}
