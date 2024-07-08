import SectionTitle from "./SectionTitle"
import { Tabs } from "@/components/Tabs"

import { cn, formatNumber } from "@/utils"
import { useDate } from "@/store/date"
import { Log as LogType} from "@/types/fugle.t"
import { Badge, badgeVariants } from "@/components/ui/badge"
import TooltipCard from "@/components/TooltipCard"

const fakeLogs: LogType[] = [
  {
    id: "1",
    type: "多單",
    action: "現股買進",
    target: {
      symbol: "AAPL",
      name: "Apple. Inc",
    },
    date: "12:09",
    price: 150.25,
    quantity: 1000,
    comment: "在開盤時買入",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    type: "多單",
    action: "現股賣出",
    target: {
      symbol: "AAPL",
      name: "Apple. Inc",
    },
    date: "09:10",
    price: 155.75,
    quantity: 100,
    comment: "在高點賣出",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "3",
    type: "多單",
    action: "融資買進",
    target: { symbol: "GOOGL", name: "Google. corp" },
    date: "11:20",
    price: 2700.5,
    quantity: 50,
    comment: "使用保證金進行買進",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "4",
    type: "多單",
    action: "融資賣出",
    target: { symbol: "GOOGL", name: "Google. corp" },
    date: "12:32",
    price: 2725.0,
    quantity: 50,
    comment: "持有一天後賣出",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "5",
    type: "空單",
    action: "沖買",
    target: { symbol: "TSLA", name: "Tsela. Inc" },
    date: "09:55",
    price: 900.0,
    quantity: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "6",
    type: "空單",
    action: "沖賣",
    target: { symbol: "TSLA", name: "Tsela. Inc" },
    date: "09:50",
    price: 910.0,
    quantity: 20,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

function Log({ log }: { log: LogType }) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-8 shadow-md overflow-hidden flex items-center justify-between",
        log.type === "多單" ? "border-rose-400" : "border-green-400"
      )}
    >
      <div className="p-2 text-slate-400 text-center">{log.date}</div>
      <div className="p-2.5 flex-1 text-start">
        <Badge variant="default">
          <h3
            className={cn(
              "text-lg font-semibold",
              log.type === "多單" ? "text-rose-600" : "text-green-600"
            )}
          >
            {log.action}
          </h3>
        </Badge>
        <div className="flex items-center mt-2 gap-4 w-full">
          <TooltipCard
            content={{ trigger: log.target.name, tooltip: log.target.symbol }}
            badgeVariant="secondary"
          />
          <TooltipCard
            content={{ trigger: `$${formatNumber(log.price)}`, tooltip: "成交價" }}
            badgeVariant="secondary"
          />
          <TooltipCard
            content={{
              trigger: formatNumber(log.quantity),
              tooltip: "成交數量",
            }}
            badgeVariant="secondary"
          />
          <button
            className={cn(
              badgeVariants({ variant: "outline" }),
              "px-2.5 text-md active:bg-slate-100 ml-auto text-slate-800"
            )}
          >
            復盤
          </button>
        </div>
      </div>
    </div>
  )
}

function AllLogs() {
  const tabs = [
    {
      title: "全部",
      value: "all",
      content: fakeLogs.map((log) => <Log key={log.id} log={log} />),
    },
    {
      title: "多單",
      value: "多單",
      content: fakeLogs
        .filter((log) => log.type === "多單")
        .map((log) => <Log key={log.id} log={log} />),
    },
    {
      title: "空單",
      value: "空單",
      content: fakeLogs
        .filter((log) => log.type === "空單")
        .map((log) => <Log key={log.id} log={log} />),
    },
  ]

  return (
    <div className="h-80">
      <Tabs
        tabs={tabs}
        // activeTabClassName="bg-gray-200 dark:bg-zinc-800 rounded-full"
        contentClassName="mt-2"
        containerClassName="gap-2"
      />
    </div>
  )
}

const TradeLog = async ({ className }: { className?: string }) => {
  // TODO: fetch log by selectDate
  // const { selectDate } = useDate((store) => store.selectDate)
  // const trades = await getTradeLog(selectDate)
  return (
    <div className={cn("section p-4", className)}>
      <SectionTitle title="交易紀錄" formType='log'/>
      <AllLogs />
    </div>
  )
}

export default TradeLog
