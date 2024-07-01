// target
export interface Asset {
  _id: number
  symbol: string
  name: string
}
// CREATE TABLE assets (
//     asset_id SERIAL PRIMARY KEY,
//     symbol VARCHAR(10) NOT NULL UNIQUE,
//     name VARCHAR(100) NOT NULL UNIQUE
// );

export interface User {
  _id: number
  username: string
  email: string
  password: string
  created_at: Date
}
// CREATE TABLE users (
//     user_id SERIAL PRIMARY KEY,
//     username VARCHAR(50) NOT NULL UNIQUE,
//     email VARCHAR(100) NOT NULL UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// 持倉
export interface Position {
  _id: number
  user_id: number // reference user
  totalCost: number
  totalMarketPrice: number
  position: {
    asset_id: number // reference asset
    quantity: number
    cost: number
  }[]
}

// CREATE TABLE positions (
//     position_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     total_cost NUMERIC(20, 8) NOT NULL,
//     total_market_price NUMERIC(20, 8) NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(user_id)
// );

// CREATE TABLE position_details (
//     position_detail_id SERIAL PRIMARY KEY,
//     position_id INT NOT NULL,
//     asset_id INT NOT NULL,
//     quantity NUMERIC(20, 8) NOT NULL,
//     cost NUMERIC(20, 8) NOT NULL,
//     asset_symbol VARCHAR(10) NOT NULL,
//     asset_name VARCHAR(100) NOT NULL,
//     FOREIGN KEY (position_id) REFERENCES positions(position_id),
//     FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
//     UNIQUE (position_id, asset_id)
// );

export interface TradePlan {
  _id: string
  user_id: string // reference user
  asset_id: string //reference asset
  plan_type: TransactionType
  quantity: number
  stop_loss: number
  entry_price: number
  plan_date: Date
  target_price: number
}

// CREATE TABLE trade_plans (
//     plan_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     asset_id INT NOT NULL,
//     plan_type VARCHAR(4) NOT NULL CHECK (plan_type IN ('buy', 'sell')),
//     quantity NUMERIC(20, 8) NOT NULL,
//     entry_price NUMERIC(20, 8) NOT NULL,
//     stop_loss NUMERIC(20, 8) NOT NULL,
//     target_price NUMERIC(20, 8) NOT NULL, -- 修改目標價格欄位名稱
//     plan_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     FOREIGN KEY (user_id) REFERENCES users(user_id),
//     FOREIGN KEY (asset_id) REFERENCES assets(asset_id)
// );

type TransactionType = "buy" | "sell"

export interface Transaction {
  _id: number
  user_id: number // reference user
  asset_id: number // reference asset
  transaction_type: TransactionType
  quantity: number
  price: number
  transaction_date: Date
}

// CREATE TABLE transactions (
//     transaction_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     asset_id INT NOT NULL,
//     transaction_type VARCHAR(4) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
//     quantity NUMERIC(20, 8) NOT NULL,
//     price NUMERIC(20, 8) NOT NULL,
//     transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     asset_symbol VARCHAR(10) NOT NULL,
//     asset_name VARCHAR(100) NOT NULL,
//     FOREIGN KEY (user_id) REFERENCES users(user_id),
//     FOREIGN KEY (asset_id) REFERENCES assets(asset_id)
// );

export interface Performance {
  _id: string
  user_id: string
  month: string
  TWSE: number
  me: number
  relativePerformance: number
}

