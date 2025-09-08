import { DispatchDate } from '@features/date/domain'

export type DateNumericTitle = DispatchDate

export type DateTextTitle = {
  year: string
  month: string
}

export type DateRole = keyof DateTextTitle
export const DATE_ROLES: DateRole[] = ['year', 'month']

export type MonthDirection = 'before' | 'after'
export const MONTH_DIRECTIONS: MonthDirection[] = ['before', 'after']
