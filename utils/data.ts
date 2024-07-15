import { Asset, AssetType, CurrentPrice, LogType } from "@/types/fugle.t"

// Position profit 計算持股損益
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
 * 計算股票交易的每股實際成本和總獲利
 *
 * @param {Array<{ actualCost: number, quantity: number }>} inventory - 當前庫存(依照時間ASC排列)
 * @param {number} sellActualCost - 賣出實際成本（包含手續費）
 * @param {number} sellQuantity - 賣出數量
 * @returns {object} 包含每股實際成本、每股實際收入、每股利潤和總獲利的對象
 */
export function calculateProfitLoss(
  inventory: Array<{ actualCost: number, quantity: number }>,
  sellActualCost: number,
  sellQuantity: number
) {
  let remainingSellQuantity = sellQuantity;
  let totalBuyActualCost = 0;
  let totalQuantity = 0;

  // 遍歷庫存並根據先進先出原則計算買入實際成本
  for (const stock of inventory) {
    if (remainingSellQuantity === 0) break;

    const quantityToUse = Math.min(stock.quantity, remainingSellQuantity);
    totalBuyActualCost += (stock.actualCost / stock.quantity) * quantityToUse;
    totalQuantity += quantityToUse;
    remainingSellQuantity -= quantityToUse;
  }

  if (remainingSellQuantity > 0) {
    throw new Error("庫存不足以賣出指定數量");
  }

  // 計算買入每股實際成本
  const buyActualCostPerShare = totalBuyActualCost / totalQuantity;

  // 計算賣出每股實際收入
  const sellActualCostPerShare = sellActualCost / sellQuantity;

  // 計算每股利潤
  const profitPerShare = sellActualCostPerShare - buyActualCostPerShare;

  // 計算總獲利
  const totalProfit = profitPerShare * sellQuantity;

  return {
    buyActualCostPerShare,
    sellActualCostPerShare,
    profitPerShare,
    totalProfit,
  };
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

  return parseFloat((changePercentage * 100).toFixed(2))
}

type TradeType = AssetType | "沖買" | "沖賣"
/**
 * 計算股票交易的手續費和證券交易稅，賣出時統一扣除
 * 等於手續費*2+證交稅
 *
 * @param {number} transactionAmount - 交易金額
 * @param {number} feeDiscount - 手續費折扣（例如：0.8 表示 80% 的折扣）
 * @param {number} minimumFee - 最低手續費
 * @param {TradeType} tradeType - 交易類型（'normal': 一般交易, 'dayTrade': 當沖交易, 'ETF': ETF交易）
 * @returns {number} 手續費和證券交易稅的總和（新台幣，四捨五入到整數）
 */
export function calculateFee(
  transactionAmount: number,
  feeDiscount: number,
  minimumFee: number,
  tradeType: TradeType
): number {
  const standardFeeRate = 0.1425 / 100

  /**
   * 根據交易類型計算證券交易稅稅率
   * @returns {number} 證券交易稅稅率
   */
  const securitiesTransactionTaxRate = (): number => {
    switch (tradeType) {
      case "沖買":
        return 0.15 / 100
      case "沖賣":
        return 0.15 / 100 // 當沖交易稅率為0.15%
      case "ETF":
        return 0.1 / 100 // ETF交易稅率為0.1%
      default:
        return 0.3 / 100 // 一般交易稅率為0.3%
    }
  }

  const originalFee = transactionAmount * standardFeeRate * feeDiscount

  const actualFee = Math.round(
    originalFee < minimumFee ? minimumFee : originalFee
  )

  const securitiesTransactionTax = Math.round(
    transactionAmount * securitiesTransactionTaxRate()
  )

  return actualFee + securitiesTransactionTax
}

/**
 * Calculate actual cost by integrating amount and fee
 * 
 * @param {number} price - Target entry_price
 * @param {number} quantity - Transaction quantity
 * @param {number} fee - Tax + fee
 * @param {LogType} action - Based on assetType
 * @returns {number}
 */
export function calculateActualCost(
  price: number,
  quantity: number,
  fee: number,
  action: LogType
): number {
  const totalPrice = price * quantity
  if (action.includes("買") || action === "融券賣出") {
    return totalPrice + fee
  } else {
    return totalPrice - fee
  }
}