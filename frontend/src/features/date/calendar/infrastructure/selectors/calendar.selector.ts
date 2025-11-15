import type { RootState } from '@app/state'
import type { LastCalendarViewDate } from '@entities/date/domain/types'

export const selectLastCalendarViewDate = (
  state: RootState
): LastCalendarViewDate => state.calendar.lastViewedCalendarDate
