export type CurrentPrices = {
  symbol: string
  name: string
  closePrice: number
}[]

export type Asset = {
  _id: string
  totalCost: number
  totalMarketPrice: number
  position: {
    asset_id: string
    asset_name: string
    quantity: number
    cost: number
  }[]
}

const actions = ["建倉" , "加碼" , "平倉" , "出場"] as const
const planTypes = ["多單" , "空單"] as const
const stopTypes = ["停損" , "停利"] as const

export type Plan = {
  _id: string
  type: (typeof planTypes)[number]
  target: {
    symbol: string
    name: string
  }
  action: (typeof actions)[number]
  targetPrice: number // 目標價
  expectation: number // 期望值
  stop: {
    type: (typeof stopTypes)[number]
    price: number
  } // 停損｜停利
  isExecuted: boolean
  comment?: string
}
