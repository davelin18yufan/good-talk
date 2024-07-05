export interface CurrentPrice {
  symbol: string
  name: string
  closePrice: number
}

interface BaseDatabaseType {
  id: string
  created_at: Date
  updated_at: Date
}

export interface User extends BaseDatabaseType {
  username: string
  email: string
  total_cost: number // 總投入資金
}

export interface Asset extends BaseDatabaseType {
  user_id: string
  target: string
  target_name: string
  cost: number
  quantity: number
  buy_date: Date
}

export interface UnrealizedAsset extends Asset {
  profit: number
}

export type Target = {
  symbol: string
  name: string
}

const actions = ["建倉", "加碼", "平倉", "出場"] as const
const planTypes = ["多單", "空單"] as const
const stopTypes = ["停損", "停利"] as const

export type Plan = {
  _id: string
  type: (typeof planTypes)[number]
  target: Target
  action: (typeof actions)[number]
  entryPrice: number
  targetPrice: number // 目標價
  expectation: number // 期望值
  stop: {
    type: (typeof stopTypes)[number]
    price: number
  } // 停損｜停利
  isExecuted: boolean
  comment?: string
}

const logTypes = [
  "現股買進",
  "現股賣出",
  "融資買進",
  "融資賣出",
  "沖買",
  "沖賣",
] as const

export type Log = {
  _id: string
  type: (typeof planTypes)[number]
  action: (typeof logTypes)[number]
  target: Target
  date: string // get time
  price: number
  quantity: number
  comment?: string
}
