"use server"

import { User } from "@/types/fugle.t"
import { sql } from "@vercel/postgres"

export async function getUserInfo(userId: string): Promise<User> {
  const { rows } = await sql`
    SELECT id, username, email, available_capital, current_capital,leverage, fee_discount, min_fee, created_at
    FROM users WHERE id=${userId}`

  return {
    id: rows[0].id,
    username: rows[0].username,
    email: rows[0].email,
    availableCapital: rows[0].available_capital,
    currentCapital: rows[0].current_capital,
    minFee: rows[0].min_fee,
    feeDiscount: rows[0].feeDiscount,
    leverage: rows[0].leverage,
    createdAt: rows[0].created_at,
    updatedAt: rows[0].updated_at
  }
}
