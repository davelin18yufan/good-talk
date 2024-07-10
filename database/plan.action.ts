"use server"
import { Plan } from "@/types/fugle.t"
import { sql } from "@vercel/postgres"

// *Get trade plans
export async function getPlans(userId: string, date: string): Promise<Plan[]> {
  try {
    const { rows } = await sql`
        SELECT plans.*,targets.symbol AS target_symbol,targets.name AS target_name 
        FROM plans 
        LEFT JOIN targets 
        ON plans.target_id = targets.id 
        WHERE plans.user_id = ${userId}
        AND DATE(created_at) = ${date}
        ORDER BY created_at;`

    return rows.map((row) => ({
      id: row.id,
      type: row.plan_type,
      action: row.action,
      target: {
        symbol: row.target_symbol,
        name: row.target_name,
      },
      entryPrice: row.entry_price,
      targetPrice: row.target_price,
      expectation:
        (row.target_price - row.entry_price) /
        Math.abs(row.entry_price - row.stop_price),
      stop: {
        type: row.stop_type,
        price: row.stop_price,
      },
      isExecuted: row.is_executed,
      comment: row.comment,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }))
  } catch (error) {
    console.error("get plans error", error)
    throw error
  }
}

// TODO: 新增時要先去檢查代號是否正確，再去檢查有沒有在表中，沒有就新增
