import type {
  DispatchDate,
  DispatchDateList,
  VisibleCalendarDate,
} from '@entities/date/domain/types'

export type { DispatchDate, DispatchDateList }

export interface SwitcherPosition {
  position: VisibleCalendarDate
  year: number | null
  month: number | null
}
