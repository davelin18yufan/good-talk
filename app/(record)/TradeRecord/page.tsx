import DateFilter from "../DateFilter"
import TradeLog from "../TradeLog"
import TradePlan from "../TradePlan"
import TradeSummary from "../TradeSummary"
import RealizedPnLChart from "../RealizedPnLChart"
import ProfitChart from "../ProfitChart"
import TradeFundBase from "../TradeFundBase"

import { getPositionCurrentPrices } from "@/actions/fugle"
import { cn } from "@/utils"
import { getAggregatedPosition } from "@/database/asset.action"
import { getUserInfo } from "@/database/user.action"
import { User } from "@/types/fugle.t"
import {
  calculateTotalMarketValue,
  calculateProfit,
  calculateTotalActualInvestmentCost,
} from "@/utils/data"


export default async function TradeRecord() {
  // TODO:Fetch User
  const user = await getUserInfo('1')
  /**
   * Get positions 庫存
   */
  const assets = await getAggregatedPosition("1")
  
  /**
   * Current position symbols array
   */
  const symbols = assets?.map((item) => item.target)
  /**
   * Get current position market price 庫存現價
   */
  const currentPrices = await getPositionCurrentPrices(symbols)

  /**
   * Total market value 庫存總市值
   */
  const totalMarketValue = calculateTotalMarketValue(assets, currentPrices)

  /**
   * Unrealized profit 庫存損益
   */
  const unrealizedAssets = assets.map((a) => ({
    ...a,
    profit: calculateProfit(a, currentPrices),
  }))

  /** 
   * Actual spending cost of holding assets.(leverage counted, for calculating capitalRatio)
   *
   * 實際總投入成本（包含槓桿,計算資金水位用）
   */
  const totalActualInvestmentCost = calculateTotalActualInvestmentCost(assets)

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
        <TradeFundBase
          layout="col-span-1 md:col-span-2"
          currentCapital={user.currentCapital}
          totalActualInvestmentCost={totalActualInvestmentCost}
          leverageUsed={user.leverage}
        />

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
