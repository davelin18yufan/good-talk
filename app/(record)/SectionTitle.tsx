import { useDock } from "@/components/Dock"
import { BsFillCloudPlusFill, BsCloudMinus } from "react-icons/bs"

const icons = [
  {
    icon: BsFillCloudPlusFill,
    iconSize: "h-5 w-5",
  },
  {
    icon: BsCloudMinus,
    iconSize: "h-5 w-5",
  },
]

export default function SectionTitle({ title }: { title: string }) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {useDock(icons, "p-0 border-none m-0 h-auto", 50)}
    </div>
  )
}
