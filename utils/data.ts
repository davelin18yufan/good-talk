import { Asset, CurrentPrice, LogType } from "@/types/fugle.t"

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

/**
 * Calculates the cost based on leverage type.
 * @param {LogType} action - The type of executed transaction.
 * @param {number} cost - The price of transaction dealt.
 * @returns {number} The cost after leveraged.
 */
export function calculateCost(action: LogType, cost: number): number {
  if (action === "融資買進") {
    return cost * 0.4
  }
  if (action === "融券賣出") {
    return cost * 0.9
  }
  return cost
}

/**
 * Calculates the profit or loss for a given transaction.
 * @param {number} entryPrice - The price at which the stock was bought.
 * @param {number} exitPrice - The price at which the stock was sold.
 * @param {number} quantity - The quantity of stock bought or sold.
 * @returns {number} The profit or loss for the transaction.
 */
export function calculateProfitLoss(
  entryPrice: number,
  exitPrice: number,
  quantity: number
): number {
  return (exitPrice - entryPrice) * quantity
}

/**
 * Calculate total profit change.
 *
 * @param {number} initialCapital - Available capital
 * @param {number} previousTotalProfitLoss - Former change ratio
 * @param {number} todayProfitLoss - Current profit
 * @returns {number} current profit change. To precision 4
 *
 */
export function calculateDailyProfitLossChange(
  initialCapital: number,
  previousTotalProfitLoss: number,
  todayProfitLoss: number
): number {
  const previousTotalAsset = initialCapital + previousTotalProfitLoss

  const todayTotalAsset = previousTotalAsset + todayProfitLoss

  const changePercentage =
    (todayTotalAsset - previousTotalAsset) / previousTotalAsset

  return Math.round(changePercentage * 10000) / 10000
}
