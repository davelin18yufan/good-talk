import DateFilter from "../DateFilter"
import TradeLog from "../TradeLog"
import TradePlan from "../TradePlan"
import TradeSummary from "../TradeSummary"
import RealizedPnLChart from "../RealizedPnLChart"
import ProfitChart from "../ProfitChart"
import TradeFundBase from "../TradeFundBase"

import { getPositionCurrentPrices } from "@/actions/fugle.action"
import { cn } from "@/utils"
import { getPosition } from "@/database/vercel-postgres"
import { Asset } from "@/types/fugle.t"

const dummyData = {
  user_id: "1",
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
  // get positions 庫存
  const assets = await getPosition(dummyData.user_id)

  // get current position market price 庫存現價
  const symbols = assets?.map((item) => item.target)
  const currentPrices = await getPositionCurrentPrices(symbols)

  // Total market value 庫存總市值
  const totalMarketValue = currentPrices?.reduce((acc, cur) => {
    const asset = assets?.find((a) => a.target === cur.symbol)
    const quantity = asset?.quantity ?? 0 // type safe
    return acc + cur.closePrice * quantity
  }, 0)

  // unrealized profit 庫存損益
  const calculateProfit = (asset: Asset) => {
    const { target, quantity, cost } = asset
    const marketValue = currentPrices.find((c) => c.symbol === target)
    return marketValue ? quantity * (marketValue.closePrice - cost) : 0
  }
  const unrealizedAssets = assets.map((a) => ({
    ...a,
    profit: calculateProfit(a),
  }))

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
          assets={unrealizedAssets}
          currentPrices={currentPrices}
          layout="col-span-1 md:col-span-2 lg:col-span-1"
        />

        {/* 已實現紀錄 */}

        {/* 資金水位圓餅圖 */}
        <TradeFundBase layout="col-span-1 md:col-span-2" />

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
