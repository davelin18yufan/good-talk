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
  currentCapital:number
  minFee: number
  feeDiscount: number
  leverage: boolean // 是否使用融資
}

const assetType = ["融資", "融券", "現股", "ETF"] as const
export type AssetType = (typeof assetType)[number]
export interface Asset extends BaseDatabaseType {
  userId: string
  target: string
  targetName: string
  quantity: number
  cost: number // entry_price * quantity + fee
  entryPrice: number
  entryDate: Date
  type: AssetType
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

export type ActionType = (typeof actions)[number]
export type PlanType = (typeof planTypes)[number]
export type StopType = (typeof stopTypes)[number]
export type LogType = (typeof logTypes)[number]

export interface Plan extends BaseDatabaseType {
  type: PlanType
  target: Target
  action: ActionType
  entryPrice: number
  targetPrice: number
  expectation: number
  stop: {
    type: StopType
    price: number
  }
  isExecuted: boolean
  comment?: string
}

export interface Log extends BaseDatabaseType {
  id: string
  type: PlanType
  action: LogType
  target: Target
  date: Date
  price: number
  fee: number
  quantity: number
  comment?: string
}

export type LogForm = Omit<
  {
    [K in keyof Log]: K extends "date"
      ? string
      : K extends "price" | "quantity" | "fee" | "profitLoss"
        ? string | number
        : K extends keyof Target
          ? Target[K]
          : Log[K]
  },
  "id" | "createdAt" | "updatedAt" | "target"
> & Target

export interface DailySummary extends BaseDatabaseType{
  userId: string,
  date: Date,
  dailyProfitLoss: number
  change: number
}