export type PnLChartData = {
  week: string
  成交筆數: number
  報酬率: number
  獲利筆數: number
}

export type PnLChartDataKeys = Exclude<keyof PnLChartData, "week">

export const FormTypes = ["main", "plan", "log"] as const
export type BaseForm = {
  title: string
  description?: string
  formClass?: string
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export interface News {
  title?: string
  href?: string
  quote?: string
  imageUrl?: string
  name?: string
}

export interface PerformanceComparison {
  month: string
  TWSE: number
  Me: number
  相對表現: string
}

export const monthAbbreviations = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const
export type MonthAbbreviations = (typeof monthAbbreviations)[number]
