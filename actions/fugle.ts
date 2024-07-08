'use server'

import { CurrentPrice } from "@/types/fugle.t"

const BASE_URL = "https://api.fugle.tw/marketdata/v1.0/stock"
const API_KEY = process.env.FUGLE_GET_API_KEY
const headers = {
  "X-API-KEY": API_KEY!,
  caches: "force-cache",
}

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

// transform stock data array
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
