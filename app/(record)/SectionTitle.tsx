import { BsFillCloudPlusFill, BsCloudMinus } from "react-icons/bs"
import { Dock, DockIcon } from "@/components/Dock"

export default function SectionTitle({
  title,
  dockClasses = "p-0 border-none m-0 h-auto",
  magnification = 50,
  icons = [
    <BsFillCloudPlusFill className="h-5 w-5" />,
    <BsCloudMinus className="h-5 w-5" />,
  ],
}: {
  title: string
  dockClasses?: string
  magnification?: number
  icons?: React.ReactNode[]
}) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <Dock className={dockClasses} magnification={magnification}>
        {icons.map((item, i) => (
          <DockIcon key={i}>{item}</DockIcon>
        ))}
      </Dock>
    </div>
  )
}
