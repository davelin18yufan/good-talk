import React from "react"

const TradePlan = () => {
  const plans = [
    { id: 1, stock: "AAPL", action: "進場", target: 160, stop: 140 },
    { id: 2, stock: "TSLA", action: "出場", target: 680, stop: 710 },
  ]

  return (
    <div className="p-4 rounded-md shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">進出場規劃</h2>
      <div>
        {plans.map((plan) => (
          <div key={plan.id} className="p-2 border-b">
            <p>
              {plan.stock} - {plan.action} - 目標價: {plan.target} - 停損價:{" "}
              {plan.stop}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TradePlan
