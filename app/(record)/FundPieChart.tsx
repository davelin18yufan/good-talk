"use client"
import React, { useState } from "react"
import { PieChart, Pie, Sector, ResponsiveContainer } from "recharts"
import { cn, formatNumber } from "@/utils"
import NumberTicker from "@/components/NumberTicker"
import { TiLightbulb } from "react-icons/ti"
import { NoteTooltip } from "@/components/TooltipCard"

const data = [
  { name: "現金水位", value: 200000 },
  { name: "持倉部位", value: 800000 },
]

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props
  const sin = Math.sin(-RADIAN * midAngle)
  const cos = Math.cos(-RADIAN * midAngle)
  const sx = cx + (outerRadius + 10) * cos
  const sy = cy + (outerRadius + 10) * sin
  const mx = cx + (outerRadius + 30) * cos
  const my = cy + (outerRadius + 30) * sin
  const ex = mx + (cos >= 0 ? 1 : -1) * 22
  const ey = my
  const textAnchor = cos >= 0 ? "start" : "end"

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
      >{`Total ${formatNumber(value)}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  )
}

const getGradientClassForValue = (value: number) => {
  if (value <= 25) return "from-slate-500 to-sky-500"
  if (value <= 50) return "from-sky-500 to-teal-500"
  if (value <= 75) return "from-teal-500 to-green-500"
  if (value <= 100) return "from-green-500 to-yellow-500"
  if (value <= 150) return "from-yellow-500 to-orange-500"
  if (value <= 200) return "from-orange-500 to-pink-500"
  if (value <= 250) return "from-pink-500 to-rose-500"
  return "from-rose-500 to-red-700"
}

export default function FundPieChart({ layout }: { layout?: string }) {
  const [activeIndex, setActiveIndex] = useState(1)
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index)
  }
  // TODO: Calculate level => 持股總成本/資金
  const level = 70

  return (
    <div
      className={cn(
        "section p-4 flex justify-around items-center gap-4",
        layout
      )}
    >
      <div className="">
        <h2 className="text-xl font-medium mb-2 text-center centerAll">
          積極度
          <NoteTooltip tooltip="0 ~ 250%" />
        </h2>
        <div className="centerAll gap-1 mb-2">
          {[0, 50, 100, 150, 200].map((value, index) => (
            <TiLightbulb
              key={index}
              className={cn("h-5 w-5", level >= value && "text-yellow-600")}
            />
          ))}
        </div>
        <p
          className={cn(
            "whitespace-pre-wrap text-6xl font-medium tracking-tighter  center-all",
            "bg-clip-text text-transparent bg-gradient-to-r",
            getGradientClassForValue(level)
          )}
        >
          <NumberTicker
            value={level}
            className={cn("px-2 text-inherit bg-inherit")}
            // delay={500}
          />
          <span>%</span>
        </p>
      </div>
      <ResponsiveContainer width="100%" height={360}>
        <PieChart>
          <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            onMouseEnter={onPieEnter}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
