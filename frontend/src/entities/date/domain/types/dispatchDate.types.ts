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

export type MonthDirection = 'before' | 'after'

// export type DateState = {
//   year: number
//   month: number
//   day: number
// }
