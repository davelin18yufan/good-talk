"use client"

import {
  ComposedChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { cn } from "@/utils"

const data = [
  {
    month: "Jan",
    TWSE: 23,
    Me: 8,
    相對表現: ((8 / 23) * 100).toFixed(1),
  },
  {
    month: "Feb",
    TWSE: 27,
    Me: 10,
    相對表現: ((10 / 27) * 100).toFixed(1),
  },
  {
    month: "Mar",
    TWSE: 32,
    Me: 18,
    相對表現: ((18 / 32) * 100).toFixed(1),
  },
  {
    month: "Apr",
    TWSE: 35,
    Me: 20,
    相對表現: ((20 / 35) * 100).toFixed(1),
  },
  {
    month: "May",
    TWSE: 30,
    Me: 22,
    相對表現: ((22 / 30) * 100).toFixed(1),
  },
  {
    month: "Jun",
    TWSE: 28,
    Me: 24,
    相對表現: ((24 / 28) * 100).toFixed(1),
  },
]

export default function ProfitChart({ layout }: { layout: string }) {
  return (
    <div className={cn("py-4 bg-white rounded-md shadow-md relative", layout)}>
      <ResponsiveContainer width="100%" height={360}>
        <ComposedChart
          data={data}
          margin={{
            top: 20,
            right: 10,
            bottom: 20,
            left: 0,
          }}
        >
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis dataKey="month" />
          <YAxis label={{ value: "％", position: "insideBottom" }} />
          <Tooltip />
          <Legend />
          {/* 大盤 */}
          <Area
            type="monotone"
            dataKey="TWSE"
            fill="#8884d8"
            stroke="#8884d8"
          />
          {/* relative */}
          <Bar dataKey="相對表現" barSize={20} fill="#413ea0" />
          {/* performance */}
          <Line type="natural" dataKey="Me" stroke="#ff7300" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  )
}
