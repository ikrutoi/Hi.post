export type DispatchDate = {
  year: number
  month: number
  day: number
}

export type SelectedDispatchDate = DispatchDate | null

export type DispatchDateList = DispatchDate[]

export type FirstDayOfWeekPreference = 'Sun' | 'Mon'

export interface DateState {
  /** Черновик календаря (клики по дням) — не заполняет CardPie, пока нет Apply. */
  selectedDate: SelectedDispatchDate
  selectedDates: DispatchDateList
  /**
   * Зафиксированный выбор после Apply — секция даты CardPie / план отправки.
   * Пусто, пока пользователь не нажал apply.
   */
  appliedDates: DispatchDateList
  isMultiDateMode: boolean
  multiGroupId: string | null
  // isHistoryMode: boolean
  /** true, когда `appliedDates.length > 0`. */
  isComplete: boolean
  firstDayOfWeek: FirstDayOfWeekPreference
  cachedSingleDate: SelectedDispatchDate
  cachedMultiDates: DispatchDateList
  /**
   * Ветки отправки «дата|ключ получателя», убранные из списка дат (не весь день).
   * Ключ даты: `${year}-${month}-${day}` как в `dispatchDateKey` редактора.
   */
  excludedDispatchBranches: string[]
  // historyListPanelOpen: boolean
  // dateListPanelOpen: boolean
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
