"use client"

import { cn } from "@/utils"
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

const data = [
  {
    week: "June/1",
    成交筆數: 118,
    報酬率: 3,
  },
  {
    week: "June/2",
    成交筆數: 11,
    報酬率: 16.2,
  },
  {
    week: "June/3",
    成交筆數: 10,
    報酬率: -2,
  },
  {
    week: "June/4",
    成交筆數: 20,
    報酬率: 0.21,
  },
]

const renderTooltipContent = ({ payload = [] }: any) => {
  if (!payload || !payload.length) return null
  // 成交筆數 / 獲利率
  const accuracy = (payload[1].value / payload[0].value).toFixed(2)

  return (
    <div className="p-2 bg-white border flex flex-col gap-2">
      <ul className="list">
        {payload.map((entry: any, index: number) => (
          <li key={`item-${index}`} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}${entry.name !== "成交筆數" ? "%" : ""}`}
          </li>
        ))}
      </ul>
      <hr />
      <p className="text-rose-400 font-semibold">準確率：{accuracy}%</p>
    </div>
  )
}

function AccuracyChart({ layout }: { layout?: string }) {
  return (
    <div className={cn("py-4 bg-white rounded-md shadow-md", layout)}>
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
            dataKey="成交筆數"
            stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorUv)"
          />
          <Area
            type="monotone"
            dataKey="報酬率"
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
