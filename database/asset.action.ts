"use server"

import { Asset, Plan } from "@/types/fugle.t"
import { sql, db } from "@vercel/postgres"

// *Get current positions
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
      cost: row.cost,
      entryPrice: row.entry_price,
      type: row.asset_type,
      quantity: row.quantity,
      entryDate: row.buy_date,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  } catch (error) {
    console.error("get positions error", error)
    throw error
  }
}
