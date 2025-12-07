import type { RootState } from '@app/state'
import type { CalendarViewDate } from '@entities/date/domain/types'

export const selectLastCalendarViewDate = (
  state: RootState
): CalendarViewDate => state.calendar.lastViewedCalendarDate
