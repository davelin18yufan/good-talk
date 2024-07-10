"use server"
import { Log } from "@/types/fugle.t"
import { sql } from "@vercel/postgres"

export async function getTradeLogs(
  userId: string,
  date: string
): Promise<Log[]> {
  const { rows } = await sql`
    SELECT logs.*,targets.symbol AS target_symbol,targets.name AS target_name
    FROM logs
    LEFT JOIN targets
    ON logs.target_id = targets.id 
    WHERE logs.user_id = ${userId}
    AND DATE(date) = ${date}
    ORDER BY date;`

  return rows.map((row) => ({
    id: row.id,
    type: row.log_type,
    action: row.action,
    target: {
      symbol: row.target_symbol,
      name: row.target_name,
    },
    date: row.date,
    price: row.price,
    quantity: row.quantity,
    comment: row.comment,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  }))
}

// 1. 