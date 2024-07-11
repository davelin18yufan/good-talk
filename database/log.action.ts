"use server"
import { validateSymbol } from "@/actions/fugle"
import { AssetType, Log } from "@/types/fugle.t"
import { sql, db } from "@vercel/postgres"
import { LogForm, PlanType, LogType } from "@/types/fugle.t"
import {
  calculateCost,
  calculateProfitLoss,
  calculateDailyProfitLossChange,
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
    comment: row.comment,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
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
    quantity: formData.get("quantity") as string,
    comment: formData.get("comment") as string,
  }
  const { type, action, symbol, name, date, price, quantity, comment } = logForm
  const assetType = action.slice(0, 2) as AssetType

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
    await client.sql`
      INSERT INTO logs (user_id, log_type, action, target_id, date, price, quantity, comment)
      VALUES (${userId}, ${type}, ${action}, ${targetId}, ${date}, ${price}, ${quantity}, ${comment || null})
    `

    // Step 5: Update assets based on action type
    const { rows: assetRows, rowCount: existingAssetRowsCount } =
      await client.sql`SELECT * FROM assets WHERE target_id = ${targetId} AND user_id=${userId} AND asset_type=${assetType}`
    const existingAsset = assetRows[0]

    if (
      action === "現股買進" ||
      action === "融資買進" ||
      action === "融券賣出"
    ) {
      // Condition has to add new asset or update
      if (existingAssetRowsCount === 0) {
        // TODO:要計算融資的成本
        await client.sql`
          INSERT INTO assets (user_id, target_id, quantity, entry_price, buy_date, cost, asset_type)
          VALUES (${userId}, ${targetId}, ${Number(quantity)}, ${Number(price)}, ${date}, ${calculateCost(action, Number(price))}, ${assetType}) 
        `
      } else {
        const newQuantity = existingAsset.quantity + Number(quantity)
        const newCost =
          (existingAsset.cost + calculateCost(action, Number(price))) /
          newQuantity
        const newPrice =
          (existingAsset.entry_price + Number(price)) / newQuantity

        await client.sql`
          UPDATE assets
          SET quantity=${newQuantity}, cost=${newCost}, entry_price=${newPrice}
          WHERE target_id=${targetId} AND user_id=${userId} AND asset_type=${assetType}
        `
      }
    } else if (
      action === "現股賣出" ||
      action === "融資賣出" ||
      action === "融券買進"
    ) {
      if (existingAsset.quantity < quantity)
        throw new Error(`${targetNameValid} 沖銷的數量大於庫存數量`)
      if (existingAssetRowsCount === 0 || !existingAssetRowsCount)
        throw new Error(`無 ${targetNameValid} 此庫存`)

      // TODO:要計算先進先出，先扣掉清倉再去計算平均成本
      // 從記錄裡找出最前面的比數的成本出來計算
      const { rows: assetRows } = await client.sql`
        UPDATE assets
        SET quantity = quantity - ${quantity}
        WHERE target_id = ${targetId} AND user_id=${userId} AND asset_type=${assetType}
        RETURNING id, quantity, entry_price`
      const updatedAsset = assetRows[0]

      const profitLoss = calculateProfitLoss(
        updatedAsset.entry_price,
        Number(price),
        Number(quantity)
      )

      // Condition has to eliminate asset
      if (updatedAsset.quantity === 0) {
        await client.sql`
          DELETE FROM assets
          WHERE id = ${updatedAsset.id} AND user_id=${userId} AND asset_type=${assetType}
        `
      }

      // Step 6: Update daily summary
      // query user capital -> get previous profit -> calc change
      const { rows: userRows } = await client.sql`
        SELECT available_capital FROM users WHERE id = ${userId}`
      const capital = userRows[0].available_capital
      const { rows: prevSummaryRows, rowCount: PrevSummaryRowCount } =
        await client.sql`
          SELECT daily_profit_loss
          FROM daily_summary
          WHERE user_id = ${userId}
          ORDER BY date DESC
          LIMIT 1
        `

      if (PrevSummaryRowCount === 0) {
        const newChange = calculateDailyProfitLossChange(capital, 0, profitLoss)
        await client.sql`
          INSERT INTO daily_summary (user_id, date, daily_profit_loss, change)
          VALUES (${userId}, ${date}, ${profitLoss}, ${newChange})
        `
      } else {
        const previousTotalProfitLoss = prevSummaryRows[0]?.daily_profit_loss

        const newChange = calculateDailyProfitLossChange(
          capital,
          previousTotalProfitLoss,
          profitLoss
        )
        await client.sql`
            UPDATE daily_summary
            SET daily_profit_loss = daily_profit_loss + ${profitLoss}, change = ${newChange}
            WHERE user_id = ${userId} AND date = ${date}
          `
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
 * Deletes a trade log from the database.
 *
 * @param {string} logId - The ID of the log entry to delete.
 * @param {string} userId - The ID of the user who owns the log entry.
 * @throws Will throw an error if the transaction fails.
 * 
 * update daily_summary, plus or minus profit back, reset date to last transaction date.
 */
export async function deleteLog(logId: string, userId: string) {
  const client = await db.connect()

  try {
    // Step 1: Start transaction
    await client.query("BEGIN")

    // Step 2: Retrieve log entry to get details
    const { rows: logRows } = await client.sql`
      SELECT action, target_id, price, quantity
      FROM logs
      WHERE id = ${logId} AND user_id = ${userId}
    `
    const log = logRows[0]
    if (!log) {
      throw new Error("Log entry not found")
    }
    const { action, target_id: targetId, price, quantity } = log

    // Step 3: Delete log entry
    await client.sql`
      DELETE FROM logs
      WHERE id = ${logId} AND user_id = ${userId}
    `

    // Step 4: Update assets based on action type
    let profitLoss = 0
    const { rows: assetRows, rowCount: assetRowsCount } =
      await client.sql`SELECT * FROM assets WHERE target_id = ${targetId} AND user_id=${userId}`
    const existingAsset = assetRows[0]

    if (assetRowsCount && assetRowsCount > 0) {
      let newQuantity = existingAsset.quantity
      let newCost = existingAsset.cost
      let newPrice = existingAsset.entry_price

      if (
        action === "現股買進" ||
        action === "融資買進" ||
        action === "融券賣出"
      ) {
        newQuantity -= Number(quantity)
        if (newQuantity > 0) {
          newCost =
            (existingAsset.cost * existingAsset.quantity -
              Number(price) * Number(quantity)) /
            newQuantity
          newPrice =
            (existingAsset.entry_price * existingAsset.quantity -
              Number(price) * Number(quantity)) /
            newQuantity
        } else {
          newCost = 0
          newPrice = 0
        }
      } else if (
        action === "現股賣出" ||
        action === "融資賣出" ||
        action === "融券買進"
      ) {
        newQuantity += Number(quantity)
        newCost =
          (existingAsset.cost * existingAsset.quantity +
            Number(price) * Number(quantity)) /
          newQuantity
        newPrice =
          (existingAsset.entryPrice * existingAsset.quantity +
            Number(price) * Number(quantity)) /
          newQuantity
        profitLoss = calculateProfitLoss(
          existingAsset.entryPrice,
          Number(price),
          Number(quantity)
        )
      }

      if (newQuantity > 0) {
        await client.sql`
          UPDATE assets
          SET quantity=${newQuantity}, cost=${newCost}, entry_price=${newPrice}
          WHERE target_id=${targetId} AND user_id=${userId}
        `
      } else {
        await client.sql`
          DELETE FROM assets
          WHERE target_id=${targetId} AND user_id=${userId}
        `
      }
      // Step 5: Update daily summary
      await client.sql`
        UPDATE daily_summary
        SET daily_profit_loss = daily_profit_loss - ${profitLoss},
            change = change - ${profitLoss},
            date = COALESCE(
              (SELECT date
              FROM logs
              WHERE user_id = ${userId} 
              AND (action = '現股賣出' OR action = '融資賣出' OR action = '融券買進')
              ORDER BY date DESC
              LIMIT 1),
              date  
            )
        WHERE user_id = ${userId}
      `
    }


    // Commit transaction
    await client.query("COMMIT")
  } catch (error) {
    // Rollback transaction in case of error
    await client.query("ROLLBACK")
    console.error("Delete Log Error: ", error)
    throw error
  } finally {
    // Release the client
    client.release()
  }
}
