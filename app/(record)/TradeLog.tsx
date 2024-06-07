import { cn } from "@/utils"
import SectionTitle from "./SectionTitle"

const TradeLog = ({ className }: { className?: string }) => {
  const trades = [
    {
      id: 1,
      type: "買進",
      stock: "AAPL",
      date: "2024-06-01",
      price: 150,
      quantity: 100,
    },
    {
      id: 2,
      type: "賣出",
      stock: "TSLA",
      date: "2024-06-03",
      price: 700,
      quantity: 50,
    },
    {
      id: 3,
      type: "賣出",
      stock: "TSLA",
      date: "2024-06-03",
      price: 700,
      quantity: 50,
    },
    {
      id: 4,
      type: "賣出",
      stock: "TSLA",
      date: "2024-06-03",
      price: 700,
      quantity: 50,
    },
    {
      id: 5,
      type: "賣出",
      stock: "TSLA",
      date: "2024-06-03",
      price: 700,
      quantity: 50,
    },
    {
      id: 6,
      type: "賣出",
      stock: "TSLA",
      date: "2024-06-03",
      price: 700,
      quantity: 50,
    },
    {
      id: 7,
      type: "賣出",
      stock: "TSLA",
      date: "2024-06-03",
      price: 700,
      quantity: 50,
    },
  ]

  return (
    <div className={cn("p-4 bg-white rounded-md shadow-md ", className)}>
      <SectionTitle title="交易紀錄"/>
      <div className="overflow-y-auto max-h-60">
        {trades.map((trade) => (
          <div key={trade.id} className="p-2 border-b">
            <p>
              {trade.date} - {trade.stock} - {trade.type} - {trade.price} -{" "}
              {trade.quantity}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TradeLog
