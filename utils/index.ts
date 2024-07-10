import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// format number into 999,999,999.00
export function formatNumber(amount:number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

// get time in day
// 00:00:00
export function formatDateTime(date: Date): string {
  // const year = date.getFullYear()
  // const month = (date.getMonth() + 1).toString().padStart(2, "0")
  // const day = date.getDate().toString().padStart(2, "0")
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${hours}:${minutes}`
}
