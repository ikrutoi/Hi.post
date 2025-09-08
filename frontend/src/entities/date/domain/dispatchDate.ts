export type DispatchDate =
  | { isSelected: false }
  | { isSelected: true; year: number; month: number; day: number }

export interface DateTitleNumeric {
  year: number
  month: number
}

export type DateNumericTitle = DispatchDate

export type DateTextTitle = {
  year: string
  month: string
}

export type DateRole = keyof DateTextTitle
export const DATE_ROLES: DateRole[] = ['year', 'month']

export type MonthDirection = 'before' | 'after'
export const MONTH_DIRECTIONS: MonthDirection[] = ['before', 'after']
