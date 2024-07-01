import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { HiOutlineExclamationCircle } from "react-icons/hi"


export default function TooltipCard({
  content,
  badgeClassName = "bg-slate-100",
  badgeVariant = "default",
  tooltipSide = "bottom",
  tooltipClassName = "bg-white rounded-lg p-1",
}: {
  content: { trigger: string | number | React.ReactNode; tooltip: string }
  badgeVariant?: "default" | "secondary" | "destructive" | "outline" | null
  badgeClassName?: string
  tooltipSide?: "bottom" | "top" | "right" | "left"
  tooltipClassName?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge variant={badgeVariant} className={badgeClassName}>
          {content.trigger}
        </Badge>
      </TooltipTrigger>
      <TooltipContent
        side={tooltipSide}
        sideOffset={1}
        className={tooltipClassName}
      >
        <p>{content.tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}
// TODO:extract
export function NoteTooltip({tooltip}: {tooltip:string}){
  return (
    <TooltipCard
      content={{
        trigger: <HiOutlineExclamationCircle className="h-4 w-4 cursor-help" />,
        tooltip,
      }}
      badgeClassName="bg-transparent"
    />
  )
}