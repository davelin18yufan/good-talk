"use server"

import { sql } from "@vercel/postgres"

export async function getTarget(symbol:string){
  return sql`
    SELECT * FROM targets WHERE symbol=${symbol}
  `
}

export async function insertTarget(symbol: string, name: string) {
  return sql`
  INSERT INTO targets (symbol, name)
  VALUES (${symbol}, ${name})
  ON CONFLICT (symbol) DO NOTHING;`
}
