"use client"

import { cn } from "@/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { useState } from "react"
import { PnLChartData, PnLChartDataKeys } from "@/types/data.t"

const data: PnLChartData[] = [
  {
    week: "June/1",
    成交筆數: 118,
    報酬率: 3,
    獲利筆數: 78,
  },
  {
    week: "June/2",
    成交筆數: 11,
    報酬率: 16.2,
    獲利筆數: 4,
  },
  {
    week: "June/3",
    成交筆數: 10,
    報酬率: -2,
    獲利筆數: 1,
  },
  {
    week: "June/4",
    成交筆數: 20,
    報酬率: 0.21,
    獲利筆數: 10,
  },
]
const dataKeys: PnLChartDataKeys[] = ["成交筆數", "報酬率", "獲利筆數"]

const renderTooltipContent = ({ payload = [] }: any) => {
  if (!payload || !payload.length) return null

  const compareData = (data: any, label1: string, label2: string) => {
    const comparisonNameMapping: Record<string, string> = {
      "成交筆數:報酬率": "準確率",
      "報酬率:成交筆數": "準確率",
      "成交筆數:獲利筆數": "勝率",
      "獲利筆數:成交筆數": "勝率",
      "獲利筆數:報酬率": "平均報酬率",
      "報酬率:獲利筆數": "平均報酬率",
    }

    // order of labels might switched after interaction
    const comparisonKey = `${label1}:${label2}`
    const reversedComparisonKey = `${label2}:${label1}`
    const comparisonName =
      comparisonNameMapping[comparisonKey] ||
      comparisonNameMapping[reversedComparisonKey] ||
      "比較結果"

    // calculate result
    const result = data.map((entry: any) => {
      const { payload: p } = entry
      const value1 = p[label1]
      const value2 = p[label2]
      let comparison: string

      switch (comparisonName) {
        case "準確率":
          // 準確率 = 報酬率 / 成交筆數
          const accuracy =
            (label1 === "報酬率" ? value1 / value2 : value2 / value1) * 100
          comparison = `準確率: ${accuracy.toFixed(2)}%`
          break
        case "勝率":
          // 勝率 = 獲利筆數 / 成交筆數
          const winRate =
            (label1 === "獲利筆數" ? value1 / value2 : value2 / value1) * 100
          comparison = `勝率: ${winRate.toFixed(2)}%`
          break
        case "平均報酬率":
          // 平均報酬率 = 報酬率 / 獲利筆數
          const avgReturnRate =
            (label1 === "報酬率" ? value1 / value2 : value2 / value1) * 100
          comparison = `平均報酬率: ${avgReturnRate.toFixed(2)}%`
          break
        default:
          comparison = `${comparisonName}: ${((value1 / value2) * 100).toFixed(2)}%`
          break
      }

      return comparison
    })

    return result[0]
  }

  return (
    <div className="p-2 bg-white border flex flex-col gap-2">
      <ul className="list">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.name === "報酬率" ? "%" : ""}`}
          </li>
        ))}
      </ul>
      <hr />
      <p className="text-rose-400 font-semibold">
        {compareData(payload, payload[0].name, payload[1].name)}
      </p>
    </div>
  )
}

function AccuracyChart({ layout }: { layout?: string }) {
  const [labelA, setLabelA] = useState<string>("報酬率")
  const [labelB, setLabelB] = useState<string>("成交筆數")
  return (
    <div
      className={cn("py-4 pr-4 bg-white rounded-md shadow-md relative", layout)}
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="block absolute top-1 right-1 z-10"
          >
            更改參數
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white ">
          <DropdownMenuLabel>參數1</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={labelA}
            onValueChange={setLabelA}
            className="*:dropdownList"
          >
            {dataKeys.map((value) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                disabled={labelB === value}
              >
                {value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <hr />
          <DropdownMenuLabel>參數2</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={labelB}
            onValueChange={setLabelB}
            className="*:dropdownList"
          >
            {["報酬率", "獲利筆數", "成交筆數"].map((value) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                disabled={labelA === value}
              >
                {value}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <ResponsiveContainer width="100%" height={360}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 10, left: 0, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="week" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip content={renderTooltipContent} />
          <Legend />
          <Area
            type="monotone"
            dataKey={labelA}
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey={labelB}
            stroke="#82ca9d"
            fillOpacity={1}
            fill="url(#colorPv)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AccuracyChart
