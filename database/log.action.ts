"use server"
import { validateSymbol } from "@/actions/fugle"
import { AssetType, Log } from "@/types/fugle.t"
import { sql, db, VercelPoolClient } from "@vercel/postgres"
import { LogForm, PlanType, LogType } from "@/types/fugle.t"
import {
  calculateProfitLoss,
  calculateDailyProfitLossChange,
  calculateActualCost,
} from "@/utils/data"

// *Get all logs
// TODO:options
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
    fee: row.fee,
    comment: row.comment,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }))
}

/**
 * Add a new trade log to database
 *
 * @param {Object} formData - The form data for the new log entry.
 * @param {string} formData.type - The type of the log entry (e.g., '多單', '空單').
 * @param {string} formData.action - The action of the log entry (e.g., '現股買進', '現股賣出').
 * @param {string} formData.symbol - The stock symbol of the log.
 * @param {string} formData.name - The stock name of the log.
 * @param {string} formData.date - The exact date of the log executed.
 * @param {number} formData.price - The dealt price of the stock.
 * @param {number} formData.quantity - The quantity of the stock.
 * @param {string} [formData.comment] - An optional comment for the log entry.
 * @throws Will throw an error if the stock symbol is invalid or transaction failed.
 *
 * 1. Check symbol validation
 *
 * 2. Check targets table if symbol existed, add new one if not.
 *
 * 3. Insert log
 *
 * 4. Update assets
 *
 * 5. Update daily summary
 */
export async function addLog(formData: FormData, userId: string) {
  const logForm: LogForm = {
    type: formData.get("type") as PlanType,
    action: formData.get("action") as LogType,
    name: formData.get("name") as string,
    symbol: formData.get("symbol") as string,
    date: formData.get("date") as string,
    price: formData.get("price") as string,
    fee: formData.get("fee") as string,
    quantity: formData.get("quantity") as string,
    comment: formData.get("comment") as string,
  }
  const { action, symbol, name, date, price, quantity } = logForm

  // Step 1: Check symbol validity using getStockInfo
  const {
    isValid,
    symbol: targetSymbolValid,
    name: targetNameValid,
    message,
  } = await validateSymbol(symbol)
  if (!isValid) {
    throw new Error(`Invalid symbol ${symbol}: ${message}`)
  }
  if (symbol !== targetSymbolValid || name !== targetNameValid)
    throw new Error(`輸入的代號(${symbol})或名稱(${name})有誤`)

  const client = await db.connect()

  try {
    // Step 2: Start transaction
    await client.query("BEGIN")

    // Step 3: Check if target exists in database, if not, insert it
    const { rows: targetRows, rowCount: targetRowCount } =
      await client.sql`SELECT id FROM targets WHERE symbol = ${symbol}`
    let targetId: string | number // get target id for further query

    if (targetRowCount === 0) {
      const { rows } = await client.sql`
        INSERT INTO targets (symbol, name)
        VALUES (${targetSymbolValid}, ${targetNameValid})
        ON CONFLICT (symbol) DO NOTHING
        RETURNING id;
      `
      targetId = rows[0].id
    } else {
      targetId = targetRows[0].id
    }

    // Step 4: Insert log into logs table
    await insertLog(client, userId, logForm, targetId)
    
    // Step 5: Update assets based on action type
    if (
      action === "現股買進" ||
      action === "融資買進" ||
      action === "融券賣出"
    ) {
      // Condition has to add new asset
      // leverage cost depends on user input
      await handleBuyAction(client, userId, targetId, logForm)
    } else if (
      action === "現股賣出" ||
      action === "融資賣出" ||
      action === "融券買進"
    ) {
      await handleSellAction(client, userId, targetId, logForm)
    } else {
      // 沖買 || 沖賣
      const oppositeAction = action === "沖買" ? "沖賣" : "沖買"

      // Query opposite logs 查找可以沖銷的對向記錄
      const { rows: oppositeRows, rowCount: oppositeRowsCount } =
        await client.sql`
        SELECT id, price, quantity, date
        FROM logs
        WHERE user_id = ${userId} 
        AND target_id = ${targetId} 
        AND action = ${oppositeAction}
        AND DATE(date) = DATE(${date}) -- psql只比較日期，忽略時間
        ORDER BY date ASC
      `
      if (oppositeRowsCount === 0) {
        await client.query("COMMIT")
        return
      }

      // Calculate profit
      let profitLoss: number
      let quantityToClose = Number(quantity)
      let totalProfitLoss = 0
      let closedQuantity = 0

      for (const oppositeLog of oppositeRows) {
        if (quantityToClose <= 0) break

        const availableQuantity = oppositeLog.quantity
        const actualClosedQuantity = Math.min(
          quantityToClose,
          availableQuantity
        )
        profitLoss =
          (Number(price) - oppositeLog.entry_price) * actualClosedQuantity
        totalProfitLoss += profitLoss
        quantityToClose -= actualClosedQuantity
        closedQuantity += actualClosedQuantity
      }
      // TODO:李用closedQuantity來檢查當日是否有未沖銷紀錄

      // update daily_summary and capital
      if (totalProfitLoss !== 0) {
        await updateDailySummary(client, userId, date, totalProfitLoss)
      }
    }

    // Commit transaction
    await client.query("COMMIT")
  } catch (error) {
    // Rollback transaction in case of error
    await client.query("ROLLBACK")
    console.error("Update Log Error: ", error)
    throw error
  } finally {
    // Release the client
    client.release()
  }
}

/**
 * Insert log into database using Vercel Client API which requires configure connection at first.
 *
 * @param client - VercelPoolClient
 * @param userId - Current user id
 * @param logForm - FormData sent by user.
 * @param targetId - The commodity of transaction.
 */
async function insertLog(
  client: VercelPoolClient,
  userId: string,
  logForm: LogForm,
  targetId: string | number
) {
  const { type, action, date, price, quantity, fee, comment } = logForm
  await client.sql`
    INSERT INTO logs (user_id, log_type, action, target_id, date, price, quantity, fee, comment)
    VALUES (${userId}, ${type}, ${action}, ${targetId}, ${date}, ${price}, ${quantity}, ${fee}, ${comment || null})
  `
}

/**
 * Buying action which might increase assets in @constant assetType
 *
 * @param client - VercelPoolClient
 * @param userId - Current user id
 * @param targetId - The commodity of transaction.
 * @param logForm - FormData sent by user.
 */
async function handleBuyAction(
  client: VercelPoolClient,
  userId: string,
  targetId: string | number,
  logForm: LogForm
) {
  const { quantity, price, fee, action, date } = logForm
  const actualCost = calculateActualCost(
    Number(price),
    Number(quantity),
    Number(fee),
    action
  )
   
  const assetType = action.slice(0, 2) as AssetType
  await client.sql`
    INSERT INTO assets (user_id, target_id, quantity, entry_price, entry_date, cost, asset_type)
    VALUES (${userId}, ${targetId}, ${Number(quantity)}, ${Number(price)}, ${date}, ${Number(actualCost) || Number(price)}, ${assetType}) 
  `
}

/**
 * Seeling action which will decrease assets and update daily_summary.
 *
 * @param client - VercelPoolClient
 * @param userId - Current user id
 * @param targetId - The commodity of transaction.
 * @param logForm - FormData sent by user.
 */
async function handleSellAction(
  client: VercelPoolClient,
  userId: string,
  targetId: string | number,
  logForm: LogForm
) {
  const { quantity, fee, action, date, price } = logForm
  const actualCost = calculateActualCost(
    Number(price),
    Number(quantity),
    Number(fee),
    action
  )
  const assetType = action.slice(0, 2) as AssetType

  // get current assets order by entry_date
  const { rows: existingAsset } = await client.sql`
    SELECT assets.id, assets.quantity, assets.cost, assets.entry_date, targets.name AS target_name
    FROM assets
    LEFT JOIN targets 
    ON assets.target_id = ${targetId} 
    WHERE user_id = ${userId} AND target_id = ${targetId} AND asset_type = ${assetType}
    ORDER BY entry_date ASC
  `

  if (existingAsset.length === 0)
    throw new Error(`無此 ${existingAsset[0].target_name} 庫存`)

  const inventory = existingAsset.map((row) => ({
    id: row.id,
    actualCost: row.cost,
    quantity: row.quantity,
    date: row.entry_date,
  }))

  const totalAssetQuantity = inventory.reduce(
    (acc, cur) => acc + cur.quantity,
    0
  )
  if (totalAssetQuantity < Number(quantity))
    throw new Error(`${existingAsset[0].target_name} 沖銷的數量大於庫存數量`)

  // calculate profit
  const { totalProfit } = calculateProfitLoss(
    inventory,
    actualCost,
    Number(quantity)
  )

  // update assets
  let remainingSellQuantity = Number(quantity)
  for (const asset of inventory) {
    if (remainingSellQuantity === 0) break

    const quantityToSell = Math.min(asset.quantity, remainingSellQuantity)

    if (quantityToSell === asset.quantity) {
      await client.sql`
        DELETE FROM assets
        WHERE id = ${asset.id}
      `
    } else {
      const newQuantity = asset.quantity - quantityToSell
      const newCost = asset.actualCost * (newQuantity / asset.quantity)
      await client.sql`
        UPDATE assets
        SET quantity = ${newQuantity}, cost = ${newCost}
        WHERE id = ${asset.id}
      `
    }

    remainingSellQuantity -= quantityToSell
  }

  // Update daily summary and capital
  await updateDailySummary(client, userId, date, totalProfit)
}

/**
 * Update daily_summary based on userId and date.
 *
 * @param client - VercelPoolClient
 * @param userId - Current user id.
 * @param date - The date transaction happened and will update profit.
 * @param profitLoss - The outcome of transaction.
 */
async function updateDailySummary(
  client: VercelPoolClient,
  userId: string,
  date: string,
  profitLoss: number
) {
  const {
    rows: [{ available_capital: capital }],
  } = await client.sql`
    SELECT available_capital FROM users WHERE id = ${userId}
  `

  const { rows: existingSummary } = await client.sql`
    SELECT daily_profit_loss
    FROM daily_summary
    WHERE user_id = ${userId} AND date = ${date}
  `

  let previousTotalProfitLoss = 0
  // if there is previous summary
  if (existingSummary.length > 0) {
    previousTotalProfitLoss = existingSummary[0].daily_profit_loss
    const newProfitLoss = Number(previousTotalProfitLoss) + profitLoss
    const newChange = calculateDailyProfitLossChange(
      Number(capital),
      Number(previousTotalProfitLoss),
      newProfitLoss
    )

    await client.sql`
      UPDATE daily_summary
      SET daily_profit_loss = ${newProfitLoss}, change = ${newChange}
      WHERE user_id = ${userId} AND date = ${date}
    `
  } else {
    const { rows: prevSummaryRows } = await client.sql`
      SELECT daily_profit_loss
      FROM daily_summary
      WHERE user_id = ${userId}
      ORDER BY date DESC
      LIMIT 1
    `
    previousTotalProfitLoss = prevSummaryRows[0]?.daily_profit_loss || 0
    const newChange = calculateDailyProfitLossChange(
      Number(capital),
      Number(previousTotalProfitLoss),
      profitLoss
    )
    await client.sql`
      INSERT INTO daily_summary (user_id, date, daily_profit_loss, change)
      VALUES (${userId}, ${date}, ${profitLoss}, ${newChange})
    `
  }

  // update user current capital
  await client.sql`UPDATE users SET current_capital = current_capital + ${profitLoss} WHERE id = ${userId}`
}
