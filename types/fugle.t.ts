export interface CurrentPrice {
  symbol: string
  name: string
  closePrice: number
}

interface BaseDatabaseType {
  id: string
  createdAt: Date
  updatedAt: Date
}

export interface User extends BaseDatabaseType {
  username: string
  email: string
  availableCapital: number // 總可用投入資金
  leverage: boolean // 是否使用融資
}

const assetType = ["融資", "融券", "現股"] as const
export interface Asset extends BaseDatabaseType {
  userId: string
  target: string
  targetName: string
  quantity: number
  cost: number
  entryPrice: number
  entryDate: Date
  type: (typeof assetType)[number]
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

export interface Plan extends BaseDatabaseType {
  type: (typeof planTypes)[number]
  target: Target
  action: (typeof actions)[number]
  entryPrice: number
  targetPrice: number // 目標價
  expectation: number // 期望值
  stop: {
    type: (typeof stopTypes)[number]
    price: number
  }
  isExecuted: boolean
  comment?: string
}

const logTypes = [
  "現股買進",
  "現股賣出",
  "融資買進",
  "融資賣出",
  "融券買進",
  "融券賣出",
  "沖買",
  "沖賣",
] as const

export interface Log extends BaseDatabaseType {
  id: string
  type: (typeof planTypes)[number]
  action: (typeof logTypes)[number]
  target: Target
  date: Date // get time
  price: number
  quantity: number
  comment?: string
}
