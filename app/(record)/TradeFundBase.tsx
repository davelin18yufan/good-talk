import NumberTicker from "@/components/NumberTicker"
import { NoteTooltip } from "@/components/TooltipCard"
import { cn } from "@/utils"
import { TiLightbulb } from "react-icons/ti"
import FundPieChart from "./FundPieChart"
import { InfiniteMovingCards } from "@/components/InfiniteMovingCards"
import { getNewsInfo } from "./action"

const getGradientClassForValue = (value: number) => {
  if (value <= 25) return "from-slate-500 to-sky-500"
  if (value <= 50) return "from-sky-500 to-teal-500"
  if (value <= 75) return "from-teal-500 to-green-500"
  if (value <= 100) return "from-green-500 to-yellow-500"
  if (value <= 150) return "from-yellow-500 to-orange-500"
  if (value <= 200) return "from-orange-500 to-pink-500"
  if (value <= 250) return "from-pink-500 to-rose-500"
  return "from-rose-500 to-red-700"
}

const data = [
  { name: "現金水位", value: 200000 },
  { name: "持倉部位", value: 800000 },
]

export default async function TradeFundBase({ layout }: { layout?: string }) {
  // TODO: Calculate level => 持股總成本/資金
  const level = 70

  const news = await getNewsInfo()
  const Loading = () => (
    <div className="animate-pulse mt-auto text-gray-200 mx-auto p-2 text-center">
      Loading News...
    </div>
  )

  return (
    <div className={cn("section px-4 flex flex-col", layout)}>
      {news.length > 0 ? (
        <InfiniteMovingCards items={news} speed="slow" />
      ) : (
        <Loading />
      )}

      <div className="flex justify-around items-center gap-4">
        <div className="hidden sm:block">
          <h2 className="text-lg md:text-xl font-medium mb-2 text-center centerAll">
            積極度
            <NoteTooltip tooltip="0 ~ 250%" />
          </h2>
          <div className="centerAll gap-1 mb-2">
            {[0, 50, 100, 150, 200].map((value, index) => (
              <TiLightbulb
                key={index}
                className={cn(
                  "w-4 h-4 md:h-5 md:w-5 aspect-square",
                  level >= value && "text-yellow-600"
                )}
              />
            ))}
          </div>
          <p
            className={cn(
              "whitespace-pre-wrap text-2xl md:text-4xl lg:text-6xl font-medium tracking-tighter  center-all",
              "bg-clip-text text-transparent bg-gradient-to-r",
              getGradientClassForValue(level)
            )}
          >
            <NumberTicker
              value={level}
              className={cn("px-2 text-inherit bg-inherit")}
              // delay={500}
            />
            <span>%</span>
          </p>
        </div>

        <FundPieChart data={data} />
      </div>
    </div>
  )
}
