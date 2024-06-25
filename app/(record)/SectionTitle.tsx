"use client"
import { BsFillCloudPlusFill, BsCloudMinus } from "react-icons/bs"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import MainForm from "./forms/MainForm"
import { FormTypes } from "@/types/data.t"
import LogForm from "./forms/LogForm"
import PlanForm from "./forms/PlanForm"

export default function SectionTitle({
  title,
  icon = { icon: <BsFillCloudPlusFill className="h-5 w-5" />, name: "plus" },
  formType,
}: {
  title: string
  icon?: { icon: React.ReactNode; name: string }
  formType: (typeof FormTypes)[number]
}) {
  return (
    <div className="flex justify-between items-center mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      <Dialog>
        <div className="flex items-center justify-end">
          <DialogTrigger asChild key={icon.name}>
            <Button
              variant="secondary"
              className="hover:scale-110 transition-transform btn-primary rounded-full"
            >
              {icon.icon}
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent className="sm:max-w-[425px] border-none">
          {formType === "main" && (
            <MainForm title="主設定" description="庫存、資金、成本" />
          )}
          {formType === "log" && <LogForm title="交易紀錄設定" />}
          {formType === "plan" && <PlanForm title="規劃設定" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
