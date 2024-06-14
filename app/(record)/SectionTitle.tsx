import { BsFillCloudPlusFill, BsCloudMinus } from "react-icons/bs"
import { Dock, DockIcon } from "@/components/Dock"

export default function SectionTitle({
  title,
  dockClasses = "p-0 border-none m-0 h-auto",
  magnification = 50,
  icons = [
    {icon:<BsFillCloudPlusFill className="h-5 w-5" />, name:"plus"},
    {icon:<BsCloudMinus className="h-5 w-5" />, name:"minus"},
  ],
}: {
  title: string
  dockClasses?: string
  magnification?: number
  icons?: {icon:React.ReactNode, name:string}[]
}) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <Dock className={dockClasses} magnification={magnification}>
        {icons.map((item) => (
          <DockIcon key={item.name}>{item.icon}</DockIcon>
        ))}
      </Dock>
    </div>
  )
}
