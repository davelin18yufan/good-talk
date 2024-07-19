"use server"

import { getHistoricalPrice, getNearestTradingDay, getYearToDateReturn } from "@/actions/fugle"
import { Asset } from "@/types/fugle.t"
import { sql, db } from "@vercel/postgres"

/**
 * Get all assets without processed.
 *
 * @param {string} userId
 * @returns {Asset}
 */
export async function getPosition(userId: string): Promise<Asset[]> {
  try {
    const { rows } = await sql`
      SELECT assets.*,targets.symbol AS target_symbol,targets.name AS target_name 
      FROM assets 
      LEFT JOIN targets 
      ON assets.target_id = targets.id 
      WHERE assets.user_id = ${userId}`
    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      target: row.target_symbol,
      targetName: row.target_name,
      cost: Number(row.cost),
      entryPrice: Number(row.entry_price),
      type: row.asset_type,
      quantity: row.quantity,
      entryDate: row.entry_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  } catch (error) {
    console.error("get positions error", error)
    throw error
  }
}

/**
 * Get positions and process into displayable list.
 *
 * @param {string} userId - All non-processed assets.
 * @returns {Promise<Asset[]>}
 */
export async function getAggregatedPosition(userId: string): Promise<Asset[]> {
  const assets = await getPosition(userId)
  function parsePosition(assets: Asset[]): Asset[] {
    const assetMap = new Map<string, Asset>()

    assets.forEach((asset) => {
      const key = `${asset.type}-${asset.target}`
      if (assetMap.has(key)) {
        // update price, quantity, cost
        const existingAsset = assetMap.get(key)!

        const newTotalQuantity = existingAsset.quantity + asset.quantity
        const newEntryPrice = Number(
          (
            (existingAsset.quantity * existingAsset.entryPrice +
              asset.quantity * asset.entryPrice) /
            newTotalQuantity
          ).toFixed(2)
        )
        // update existing asset
        existingAsset.quantity = newTotalQuantity
        existingAsset.cost += asset.cost
        existingAsset.entryPrice = newEntryPrice
      } else {
        assetMap.set(key, {
          ...asset,
        })
      }
    })
    return Array.from(assetMap.values())
  }

  return parsePosition(assets)
}

