export type DispatchDate = {
  year: number
  month: number
  day: number
}

export type SelectedDispatchDate = DispatchDate | null

export interface DateState {
  selectedDate: SelectedDispatchDate
  isComplete: boolean
}

export type CardDispatchDate = DispatchDate | null

export type DateTextTitle = {
  year: string
  month: string
}

export type DatePart = keyof DateTextTitle

export const MONTH_DIRECTION = ['before', 'after', 'current'] as const

export type MonthDirection = (typeof MONTH_DIRECTION)[number]

export type CalendarViewDate = {
  year: number
  month: number
}

export type LastCalendarViewDate = CalendarViewDate | null

export const VISIBLE_CALENDAR_DATE = ['year', 'month'] as const

export type VisibleCalendarDate = (typeof VISIBLE_CALENDAR_DATE)[number]

export type Switcher = (typeof VISIBLE_CALENDAR_DATE)[number]
