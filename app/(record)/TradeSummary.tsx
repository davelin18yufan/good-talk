import { RiHomeGearLine } from "react-icons/ri"
import SectionTitle from "./SectionTitle"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CurrentPrices } from "@/types/fugle.t"
import { Suspense } from "react"
import { cn } from "@/utils"

const TradeSummary = ({
  asset,
  currentPrices,
  layout
}: {
  asset: {
    _id: string
    totalCost: number
    totalMarketPrice: number
    position: {
      asset_id: string
      asset_name: string
      quantity: number
      cost: number
      current: number
    }[]
  }
  currentPrices: CurrentPrices
  layout?:string
}) => {
  const { totalCost, totalMarketPrice, position } = asset
  const unrealizedProfit = (totalMarketPrice - totalCost).toLocaleString(
    "en-US",
    {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }
  )

  return (
    <div className={cn("p-4 bg-white rounded-md shadow-md relative", layout)}>
      <SectionTitle
        title="我的庫存"
        icons={[
          {
            icon: RiHomeGearLine,
            iconSize: "h-5 w-5",
            name: "gear",
          },
        ]}
      />
      <p className="text-xl text-red-500 mb-4">
        未實現損益: {unrealizedProfit}
      </p>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="">ID</TableHead>
            <TableHead>標的</TableHead>
            <TableHead>成本</TableHead>
            <TableHead>現價</TableHead>
            <TableHead className="text-right">損益</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {position.map((p) => {
            let profit = ""
            const marketPrice = currentPrices.find(
              (price) => price.symbol === p.asset_id
            )
            if (marketPrice) {
              profit = (
                (marketPrice?.closePrice - p.cost) *
                p.quantity
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              })
            }

            return (
              <TableRow className="text-xs text-slate-600" key={p.asset_id}>
                <TableCell>{p.asset_id}</TableCell>
                <TableCell>{p.asset_name}</TableCell>
                <TableCell>{p.cost}</TableCell>
                <TableCell>{marketPrice?.closePrice}</TableCell>
                <Suspense
                  fallback={
                    <TableCell className="text-right">Calculating..</TableCell>
                  }
                >
                  <TableCell className="text-right">{profit}</TableCell>
                </Suspense>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default TradeSummary
