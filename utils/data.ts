import { Asset, CurrentPrice } from "@/types/fugle.t"

// Postion profit 計算持股損益
export const calculateProfit = (
  asset: Asset,
  currentPrices: CurrentPrice[]
): number => {
  const { target, quantity, entryPrice } = asset
  const marketValue = currentPrices.find((c) => c.symbol === target)
  return marketValue ? quantity * (marketValue.closePrice - entryPrice) : 0
}

// Position market value 計算總市值
export const calculateTotalMarketValue = (
  assets: Asset[],
  currentPrices: CurrentPrice[]
): number => {
  return currentPrices.reduce((acc, cur) => {
    const asset = assets.find((a) => a.target === cur.symbol)
    const quantity = asset?.quantity ?? 0
    return acc + cur.closePrice * quantity
  }, 0)
}

// Position invest cost 計算總投資成本
export const calculateTotalInvestmentCost = (assets: Asset[]): number => {
  return assets.reduce((acc, cur) => acc + cur.cost * cur.quantity, 0)
}

// Position actual invest cost 計算實際總投入成本
export const calculateTotalActualInvestmentCost = (assets: Asset[]): number => {
  return assets.reduce((acc, cur) => cur.cost * cur.quantity + acc, 0)
}
