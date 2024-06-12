import { useDock } from "@/components/Dock"
import { IconType } from "react-icons"
import { BsFillCloudPlusFill, BsCloudMinus } from "react-icons/bs"

// const icons = [
//   {
//     icon: BsFillCloudPlusFill,
//     iconSize: "h-5 w-5",
//     name: "cloudPlus",
//   },
//   {
//     icon: BsCloudMinus,
//     iconSize: "h-5 w-5",
//     name: "cloudMinus",
//   },
// ]

export default function SectionTitle({
  title,
  icons = [
    {
      icon: BsFillCloudPlusFill,
      iconSize: "h-5 w-5",
      name: "cloudPlus",
    },
    {
      icon: BsCloudMinus,
      iconSize: "h-5 w-5",
      name: "cloudMinus",
    },
  ],
}: {
  title: string
  icons?: {
    icon: IconType
    iconSize: string
    name: string
  }[]
}) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {useDock(icons, "p-0 border-none m-0 h-auto", 50)}
    </div>
  )
}
