"use server"

import { sql } from "@vercel/postgres"
import { MarketSummary } from "../types/fugle.t"
import { getHistoricalPrice } from "@/actions/fugle"
import { calculateReturnPercentage } from "@/utils/data"

/**
 * Get latest month market_summary
 * 
 * @param {string} symbol 
 * @returns 
 */
export async function getLatestMarketSummary(
  symbol: string
): Promise<MarketSummary> {
  const result = await sql`
    SELECT * FROM market_summary
    WHERE symbol = ${symbol}
    ORDER BY date DESC
    LIMIT 1
  `
  return {
    id: result.rows[0].id,
    symbol: result.rows[0].symbol,
    date: result.rows[0].date,
    month: Number(result.rows[0].month),
    closePrice: Number(result.rows[0].closePrice),
    yearToDateReturn: Number(result.rows[0].yearToDateReturn),
    createdAt: result.rows[0].created_at,
    updatedAt: result.rows[0].updated_at,
  }
}

/**
 * Update monthly_summary table or insert an new one if not exist.
 * 
 * @param {Omit<MarketSummary, "id" | "createdAt" | "updatedAt">} summary 
 */
export async function updateMarketSummary(
  summary: Omit<MarketSummary, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await sql`
    INSERT INTO market_summary (symbol, date, month, closePrice, yearToDateReturn)
    VALUES (${summary.symbol}, ${summary.date}, ${summary.month}, ${summary.closePrice}, ${summary.yearToDateReturn})
    ON CONFLICT (symbol, date) DO UPDATE
    SET closePrice = ${summary.closePrice}, yearToDateReturn = ${summary.yearToDateReturn}
  `
}

/**
 * Get monthly summary array by year.
 * 
 * @param {string} symbol 
 * @param {number} year 
 * @returns 
 */
export async function getMonthlyMarketSummaries(
  symbol: string,
  year: number
):Promise<MarketSummary[]> {
  const result = await sql`
    SELECT * FROM market_summary
    WHERE symbol = ${symbol} AND EXTRACT(YEAR FROM date) = ${year}
    ORDER BY date
  `
  return result.rows.map((row) => ({
    id: row.id,
    symbol: row.symbol,
    date: row.date,
    month: Number(row.month),
    closePrice: Number(row.close_price),
    yearToDateReturn: Number(row.year_to_date_return),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Update market_summary table by month.
 * 
 * @param {string} symbol 
 */
export async function updateMarketSummaryDaily(symbol: string): Promise<void> {
  const today = new Date()
  const startOfYear = new Date(today.getFullYear(), 0, 1)

  const latestSummary = await getLatestMarketSummary(symbol)
  const startDate = latestSummary ? new Date(latestSummary.date) : startOfYear

  const { data } = await getHistoricalPrice(symbol, {
    from: startDate.toISOString().split("T")[0],
    to: today.toISOString().split("T")[0],
  })

  for (const item of data) {
    const itemDate = new Date(item.date)
    const yearToDateReturn = calculateReturnPercentage(
      data[0].close,
      item.close
    )

    await updateMarketSummary({
      symbol,
      date: itemDate.toISOString(),
      month: itemDate.getMonth() + 1,
      closePrice: item.close,
      yearToDateReturn,
    })
  }
}
