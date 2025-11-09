export type DispatchDate = {
  year: number
  month: number
  day: number
}

export type SelectedDispatchDate = DispatchDate | null

export type CardDispatchDate = DispatchDate | null

export type DateTextTitle = {
  year: string
  month: string
}

export type DatePart = keyof DateTextTitle

export type MonthDirection = 'before' | 'after'
