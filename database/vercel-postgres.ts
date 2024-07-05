"use server"

import { Asset } from "@/types/fugle.t"
import { sql, db } from "@vercel/postgres"

export async function getPosition(userId: string):Promise<Asset[]>  {
  const { rows } = await sql`SELECT * FROM assets WHERE user_id=${userId}`
  return rows.map(row => ({
        id: row.id,
        user_id: row.user_id,
        target: row.target,
        target_name: row.target_name,
        cost: row.cost,
        quantity: row.quantity,
        buy_date: row.buy_date,
        created_at: row.created_at,
        updated_at: row.updated_at
    }));
}

 