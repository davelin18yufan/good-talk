"use server"

import { Asset } from "@/types/fugle.t"
import { sql, db } from "@vercel/postgres"

// *Get current positions
export async function getPosition(userId: string): Promise<Asset[]> {
  const { rows } = await sql`SELECT * FROM assets WHERE user_id=${userId}`
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    target: row.target,
    targetName: row.target_name,
    cost: row.cost,
    entryPrice: row.entry_price,
    type:
      row.cost === row.entry_price
        ? "現股"
        : row.entry_price / row.cost >= 1.5
          ? "融資"
          : "融券",
    quantity: row.quantity,
    entryDate: row.buy_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}
