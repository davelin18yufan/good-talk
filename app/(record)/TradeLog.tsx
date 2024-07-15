import SectionTitle from "./SectionTitle"
import { Tabs } from "@/components/Tabs"

import { cn, formatNumber, formatDateTime } from "@/utils"
import { useDate } from "@/store/date"
import { Log as LogType } from "@/types/fugle.t"
import { Badge, badgeVariants } from "@/components/ui/badge"
import TooltipCard from "@/components/TooltipCard"
import { addLog, getTradeLogs } from "@/database/log.action"

function Log({ log }: { log: LogType }) {
  return (
    <div
      className={cn(
        "rounded-lg border-l-8 shadow-md overflow-hidden flex items-center justify-between",
        log.type === "多單" ? "border-rose-400" : "border-green-400"
      )}
    >
      <div className="p-2 text-slate-400 text-center">
        {formatDateTime(log.date)}
      </div>
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
            content={{
              trigger: `$${formatNumber(log.price)}`,
              tooltip: "成交價",
            }}
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

function AllLogs({ logs }: { logs: LogType[] }) {
  const tabs = [
    {
      title: "全部",
      value: "all",
      content: logs.map((log) => <Log key={log.id} log={log} />),
    },
    {
      title: "多單",
      value: "多單",
      content: logs
        .filter((log) => log.type === "多單")
        .map((log) => <Log key={log.id} log={log} />),
    },
    {
      title: "空單",
      value: "空單",
      content: logs
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
  // const { selectedDate } = useDate((store) => store.selectedDate)
  const logs = await getTradeLogs("1", "2023-07-04")

  const formData = new FormData()
  formData.append("type", "多單")
  formData.append("action", "現股賣出")
  formData.append("symbol", "2330")
  formData.append("name", "台積電")
  formData.append("date", new Date().toISOString())
  formData.append("price", "1025")
  formData.append("fee", "200")
  formData.append("quantity", "300")
  formData.append("comment", "")

  await addLog(formData, "1")

  return (
    <div className={cn("section p-4", className)}>
      <SectionTitle title="交易紀錄" formType="log" />
      <AllLogs logs={logs} />
    </div>
  )
}

export default TradeLog
