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
  category?: string
  imageUrl?: string
}

export interface NewsParsed {
  quote: string
  name: string
  title: string
  href: string
  imageUrl: string
}
