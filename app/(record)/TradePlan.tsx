import React from "react"
import SectionTitle from "./SectionTitle"
import { cn } from "@/utils"
import { Plan } from "@/types/fugle.t"
import { CheckIcon, CheckCheck } from "lucide-react"
import ShineBorder from "@/components/ShineBorder"
import { AnimatedSubscribeButton } from "@/components/SubscribeButton"

const TradePlan = ({ layout }: { layout?: string }) => {
  const plans: Plan[] = [
    {
      _id: "123456789",
      type: "多單",
      target: {
        symbol: "AAPL",
        name: "Apple Inc.",
      },
      action: "建倉",
      targetPrice: 150,
      stop: {
        type: "停損",
        price: 100,
      },
      expectation: 150 / 100,
      isExecuted: false,
    },
    {
      _id: "987654321",
      type: "空單",
      target: {
        symbol: "TSLA",
        name: "Tesla, Inc.",
      },
      action: "建倉",
      targetPrice: 1194,
      stop: {
        type: "停損",
        price: 900,
      },
      expectation: 1194 / 900,
      isExecuted: false,
      comment: "some comment",
    },
    {
      _id: "123456789",
      type: "多單",
      target: {
        symbol: "AAPL",
        name: "Apple Inc.",
      },
      action: "出場",
      targetPrice: 180,
      stop: { type: "停利", price: 150 },
      expectation: 180 / 150,
      isExecuted: true,
    },
  ]

  return (
    <div
      className={cn(
        "p-4 rounded-md shadow-md bg-white overflow-y-auto",
        layout
      )}
    >
      <SectionTitle title="進出場規劃" />
      <div className="centerAll flex-col gap-2">
        {plans.map(
          ({
            _id,
            type,
            target,
            action,
            targetPrice,
            expectation,
            stop,
            isExecuted,
            comment,
          }) => (
            <ShineBorder
              key={_id}
              className={cn("p-4 w-full", {
                "bg-rose-200": type === "多單",
                "bg-green-200": type === "空單",
              })}
              borderWidth={4}
              duration={10}
              color={`${type === "多單" ? ["rgb(251 113 133)", "rgb(225 29 72)"] : ["rgb(74 222 128)", "rgb(22 163 74)"]}`}
            >
              <div className="flex justify-between items-center">
                <h2 className="lg:text-lg font-bold">
                  {target.name} ({target.symbol})
                </h2>
                <span className="text-sm text-slate-600">
                  {type}
                  {action}
                </span>
              </div>

              <div
                className={cn(
                  "mt-2 pl-2 flex items-center justify-start flex-wrap border-l-2 gap-2 text-slate-800",
                  {
                    "border-l-rose-400": type === "多單",
                    "border-l-green-400": type === "空單",
                  }
                )}
              >
                <p>目標價: {targetPrice}</p>
                <p>
                  {stop.type}: {stop.price}
                </p>
                <p className="font-bold">期望值: {expectation.toFixed(2)}</p>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <button
                  className={`text-sm ${comment ? "text-sky-700" : "text-slate-700"}`}
                  disabled={!comment}
                >
                  備註
                </button>
                <AnimatedSubscribeButton
                  buttonColor="transparent"
                  buttonTextColor="#000000"
                  subscribeStatus={isExecuted}
                  initialText={
                    <span className="group inline-flex items-center">
                      未執行{" "}
                      <CheckIcon className="ml-1 h-4 w-4 !transition-opacity duration-300 group-hover:translate-x-1" />
                    </span>
                  }
                  changeText={
                    <span className="group inline-flex items-center text-slate-600">
                      <CheckCheck className="mr-2 h-4 w-4" />
                      已執行{" "}
                    </span>
                  }
                />
              </div>
            </ShineBorder>
          )
        )}
      </div>
    </div>
  )
}

export default TradePlan
