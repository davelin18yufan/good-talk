import { CurrentPrice } from "@/types/fugle.t"
import { calculateReturnPercentage } from "@/utils/data"

const BASE_URL = "https://api.fugle.tw/marketdata/v1.0/stock"
const API_KEY = process.env.FUGLE_GET_API_KEY
const headers = {
  "X-API-KEY": API_KEY!,
  caches: "force-cache",
}

/**
 * Get current price of symbol.
 *
 * @param {string} symbol - symbol of target.
 * @returns
 */
export async function getStock(symbol: string) {
  try {
    const res = await fetch(`${BASE_URL}/intraday/quote/${symbol}`, {
      headers,
      next: {
        tags: ["position"],
        // revalidate: 500
      },
    })
    if (!res.ok) throw Error

    return res.json()
  } catch (error) {
    console.error(error)
    throw new Error(`Get Stock ${symbol} error: ${error}`)
  }
}

/**
 * Get stock information by symobl
 *
 * @param {string} s - symbol of target
 * @returns
 */
export async function getStockInfo(s: string): Promise<{
  market: string
  symbol: string
  name: string
  industry: string
  securityType: string
}> {
  try {
    const res = await fetch(`${BASE_URL}/intraday/ticker/${s}`, {
      headers,
      next: {
        tags: ["info"],
      },
    })
    if (!res.ok) throw Error

    const { market, symbol, name, industry, securityType } = await res.json()

    return { market, symbol, name, industry, securityType }
  } catch (error) {
    console.error(error)
    throw new Error(`Get Stock Info ${s} error: ${error}`)
  }
}

/**
 * Using getStockInfo to check if symbol is exist
 *
 * @param {string} s - symbol of target
 * @returns an object with isValid property.
 */
export async function validateSymbol(s: string) {
  try {
    const { symbol, name } = await getStockInfo(s)
    if (!symbol) return { isValid: false, message: "代號不存在" }

    return { symbol, name, isValid: true }
  } catch (error) {
    console.error(`Get Info ${s} Error: `, error)
    return { isValid: false, message: error }
  }
}

/**
 * Get current market price of assets
 *
 * @param {string[]} symbols - symbol array of assets
 * @returns
 */
export async function getPositionCurrentPrices(symbols: string[]) {
  const prices: CurrentPrice[] = []

  for (const s of symbols) {
    try {
      const price = await getStock(s)

      prices.push({
        symbol: price.symbol,
        name: price.name,
        closePrice: price.closePrice,
      })
    } catch (error) {
      console.error(error)
      throw new Error(`Get Stock ${s} error: ${error}`)
    }
  }

  return prices
}

type KBarFields =
  | "open" // Ｋ線開盤價
  | "high" // Ｋ線最高價
  | "low" // Ｋ線最低價
  | "close" // Ｋ線收盤價
  | "volume" // Ｋ線成交量（股）
  | "turnover" // Ｋ線成交金額（元）
  | "change" // Ｋ線漲跌

/**
 * Get history duration price
 *
 * @param {string} symbol - symbol of target.
 * @param {object} queryDate - start and end date
 * @param {KBarFields[]} fields
 * @returns
 */
export async function getHistoricalPrice(
  symbol: string,
  queryDate: {
    from: string
    to: string
  },
  fields?: Partial<KBarFields>[]
) {
  const { from, to } = queryDate
  const url = `${BASE_URL}/historical/candles/${symbol}?from=${from}&to=${to}&fields=${fields?.join(",")}`

  const res = await fetch(url, { headers })
  return res.json()
}

/**
 * Get date if it was non-trade day, move to previous date.
 *
 * @param {string} symbol - symbol of target.
 * @param date - query date.
 * @returns
 */
export async function getNearestTradingDay(
  symbol: string,
  date: string | Date
) {
  let adjustedDate = new Date(date)
  const url = (queryDate: string) =>
    `${BASE_URL}/historical/candles/${symbol}?from=${queryDate}&to=${queryDate}&fields=close`

  // prevent fetch failed
  while (true) {
    const dateString = adjustedDate.toISOString().split("T")[0]
    try {
      const response = await fetch(url(dateString), { headers })
      const { data } = await response.json()

      if (data) {
        return dateString
      }
    } catch (error) {
      console.error(`Error fetching data for ${dateString}:`, error)
      throw error
    }

    // if failed, Move to the previous day
    adjustedDate.setDate(adjustedDate.getDate() - 1)
  }
}

/**
 * Get specific duration change.
 * 
 * @param {string} symbol
 * @param {string} startDate 
 * @param endDate 
 * @returns 
 */
export async function getReturnPercentage(
  symbol: string = 'IX0001',
  startDate: string,
  endDate: string
): Promise<number> {
  try {
    const nearestStartDate = await getNearestTradingDay(symbol, startDate)
    const nearestEndDate = await getNearestTradingDay(symbol, endDate)

    const [startResponse, endResponse] = await Promise.all([
      getHistoricalPrice(symbol, { from: nearestStartDate, to: nearestStartDate }),
      getHistoricalPrice(symbol, { from: nearestEndDate, to: nearestEndDate }),
    ])

    const startPrice = startResponse.data[0].close
    const endPrice = endResponse.data[0].close

    return Number(calculateReturnPercentage(startPrice, endPrice).toFixed(2))
  } catch (error) {
    console.error("Error calculating return percentage:", error)
    throw error
  }
}

/**
 * Get year-to-date return
 * 
 * @param symbol
 */
export async function getYearToDateReturn(symbol: string = "IX0001"): Promise<number> {
  const currentYear = new Date().getFullYear()
  const startDate = `${currentYear}-01-01`
  const endDate = new Date().toISOString().split("T")[0]

  return getReturnPercentage(symbol, startDate, endDate)
}
