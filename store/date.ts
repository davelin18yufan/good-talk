import { create } from "zustand"

interface DateState {
  today: string
  selectedDate: string | null
  selectDate: (date: string) => void
}

export const useDate = create<DateState>()((set, get) => ({
  today: new Date(Date.now()).toISOString().split("T")[0],
  selectedDate: new Date(Date.now()).toISOString().split("T")[0],
  selectDate: (date: string) => set({ selectedDate: date }),
}))
