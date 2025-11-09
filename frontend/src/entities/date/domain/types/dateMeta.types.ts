export type FirstDay = 'Sun' | 'Mon'

export const DAYS_OF_WEEK = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
] as const

export type DaysOfWeek = (typeof DAYS_OF_WEEK)[number]
