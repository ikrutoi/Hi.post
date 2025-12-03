import { getCurrentDate } from './getCurrentDate'
import type {
  SelectedDispatchDate,
  CalendarViewDate,
  LastCalendarViewDate,
} from '@entities/date/domain/types'

export const getInitialCalendarDate = (
  selected: SelectedDispatchDate,
  lastViewed: LastCalendarViewDate
): CalendarViewDate => {
  const { month, year } = getCurrentDate()
  return selected
    ? { year: selected.year, month: selected.month }
    : lastViewed
      ? { year: lastViewed.year, month: lastViewed.month }
      : { year, month }
}
