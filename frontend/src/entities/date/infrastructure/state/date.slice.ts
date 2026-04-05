import type { DateState } from '../../domain/types'

/** Согласовано с `features/date/infrastructure/state/dateSlice` (редактор). */
export const initialState: DateState = {
  selectedDate: null,
  selectedDates: [],
  isMultiDateMode: false,
  multiGroupId: null,
  isComplete: false,
  firstDayOfWeek: 'Sun',
  cachedSingleDate: null,
  cachedMultiDates: [],
}
