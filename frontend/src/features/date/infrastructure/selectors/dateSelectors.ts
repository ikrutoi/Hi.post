import { RootState } from '@app/state'
import { DateState, SelectedDispatchDate } from '@entities/date/domain/types'

export const selectDateState = (state: RootState): DateState => state.date

export const selectSelectedDate = (state: RootState): SelectedDispatchDate =>
  state.date.selectedDate

export const selectIsDateComplete = (state: RootState): boolean =>
  state.date.isComplete
