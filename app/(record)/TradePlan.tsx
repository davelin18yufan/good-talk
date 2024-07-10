import React from "react"
import SectionTitle from "./SectionTitle"
import { cn } from "@/utils"
import { Plan } from "@/types/fugle.t"
import { CheckIcon, CheckCheck } from "lucide-react"
import ShineBorder from "@/components/ShineBorder"
import { AnimatedSubscribeButton } from "@/components/SubscribeButton"
import { getPlans } from "@/database/plan.action"
import { useDate } from "@/store/date"

function ExpectationBar({
  entryPrice,
  targetPrice,
  stopPrice,
}: {
  entryPrice: number
  targetPrice: number
  stopPrice: number
}) {
  const potentialProfit = targetPrice - entryPrice
  const potentialLoss = entryPrice - stopPrice
  const denominator = potentialLoss + potentialProfit
  const expectation = ((potentialProfit / denominator) * 100).toFixed(1)
  return (
    <div className="centerAll font-bold text-center align-middle text-sm gap-2 p-0.5">
      <div className="flex items-center w-24 md:w-28 rounded-md overflow-hidden">
        <div
          className={"bg-rose-400 py-1"}
          style={{ flexGrow: `${potentialProfit / denominator}` }}
        >
          賺
        </div>
        <div
          className="bg-green-400 py-1"
          style={{ flexGrow: `${potentialLoss / denominator}` }}
        >
          賠
        </div>
      </div>
      <p>比：{expectation}%</p>
    </div>
  )
}

function PlanCard({
  plan: {
    type,
    target,
    action,
    targetPrice,
    entryPrice,
    stop,
    isExecuted,
    comment,
  },
}: {
  plan: Plan
}) {
  return (
    <ShineBorder
      className={cn("p-4 w-full", {
        "!bg-rose-200": type === "多單",
        "!bg-green-200": type === "空單",
      })}
      borderWidth={4}
      duration={10}
      color={`${type === "多單" ? ["rgb(251 113 133)", "rgb(225 29 72)"] : ["rgb(74 222 128)", "rgb(22 163 74)"]}`}
    >
      <div className="flex justify-between items-center">
        <h2 className="lg:text-lg font-bold">
          {target.name} ({target.symbol})
        </h2>
        <span
          className={cn("text-sm text-slate-600", {
            "text-rose-600": type === "多單",
            "text-green-600": type === "空單",
          })}
        >
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
        <p>進場價: {entryPrice}</p>
        <p>目標價: {targetPrice}</p>
        <p>
          {stop.type}: {stop.price}
        </p>
        <ExpectationBar
          {...{ entryPrice, targetPrice, stopPrice: stop.price }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <button
          className={`text-sm cursor-pointer hover:bg-transparent ${comment ? "text-sky-700" : "text-slate-700"}`}
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
}

async function TradePlan({ layout }: { layout?: string }) {
  // const { selectedDate } = useDate((store) => store.selectedDate)
  const plans = await getPlans("1", "2023-07-04")
  
  return (
    <div
      className={cn(
        "section p-4 overflow-y-auto",
        layout
      )}
    >
      <SectionTitle title="進出場規劃" formType='plan'/>
      <div className="centerAll flex-col gap-2">
        {plans.map((plan) => (
          <PlanCard plan={plan} key={plan.id} />
        ))}
      </div>
    </div>
  )
}

export default TradePlan
