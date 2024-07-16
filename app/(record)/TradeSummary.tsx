import { RiHomeGearLine } from "react-icons/ri"
import SectionTitle from "./SectionTitle"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { CurrentPrice, UnrealizedAsset } from "@/types/fugle.t"
import { cn, formatNumber } from "@/utils"

const TradeSummary = ({
  assets,
  currentPrices,
  layout,
}: {
  assets: UnrealizedAsset[]
  currentPrices: CurrentPrice[]
  layout?: string
}) => {
  // calculate position profit
  const unrealizedProfit = assets.reduce((acc, cur) => acc + cur.profit, 0)

  return (
    <div className={cn("section p-4", layout)}>
      <SectionTitle
        title="我的庫存"
        icon={{ icon: <RiHomeGearLine className="h-5 w-5" />, name: "gear" }}
        formType="main"
      />

      {/* using wrapper for scrolling and max-height */}
      <div className="max-h-[30vh] overflow-y-scroll overscroll-contain relative">
        <Table>
          <TableHeader>
            <TableRow className="*:lg:px-0">
              <TableHead>ID</TableHead>
              <TableHead>標的</TableHead>
              <TableHead>成本</TableHead>
              <TableHead>現價</TableHead>
              <TableHead>數量</TableHead>
              <TableHead className="text-right">損益</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assets.map((a) => {
              const marketPrice = currentPrices.find(
                (price) => price.symbol === a.target
              )

              return (
                <TableRow
                  className="text-xs text-slate-500 *:lg:px-0"
                  key={a.target}
                >
                  <TableCell>{a.target}</TableCell>
                  <TableCell>{a.targetName}({a.type})</TableCell>
                  <TableCell>{a.entryPrice}</TableCell>
                  <TableCell>
                    {marketPrice
                      ? formatNumber(marketPrice?.closePrice)
                      : "N/A"}
                  </TableCell>
                  <TableCell>{formatNumber(a.quantity)}</TableCell>
                  <TableCell className="text-right">
                    {formatNumber(a.profit)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <Table>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="text-lg">
              未實現損益
            </TableCell>
            <TableCell className="text-right text-red-500">
              {formatNumber(unrealizedProfit)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  )
}

export default TradeSummary
