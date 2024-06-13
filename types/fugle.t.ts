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