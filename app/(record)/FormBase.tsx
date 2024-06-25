"use client"
import React from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input"
import { cn } from "@/utils"
import { BaseForm } from "@/types/data.t"

export function FormBase({
  title,
  description,
  formClass,
  onSubmit,
  children,
}: BaseForm) {
  return (
    <div
      className={cn(
        "max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-neutral-100 dark:bg-black",
        formClass
      )}
    >
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        {title}
      </h2>
      {description && (
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          {description}
        </p>
      )}

      <form className="my-8" onSubmit={onSubmit}>
        {children}

        <Button className="btn-form" type="submit">
          完成 &rarr;
          <BottomGradient />
        </Button>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />
      </form>
    </div>
  )
}

function BottomGradient() {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  )
}

export function LabelInputContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  )
}

export function CustomInput({
  label,
  labelName,
  placeholder,
  type = "text",
  containerClass,
}: {
  label: string
  labelName: string
  placeholder?: string
  type?: string
  containerClass?: string
}) {
  return (
    <LabelInputContainer className={containerClass}>
      <Label htmlFor={label}>{labelName}</Label>
      <Input id={label} placeholder={placeholder} type={type} />
    </LabelInputContainer>
  )
}
