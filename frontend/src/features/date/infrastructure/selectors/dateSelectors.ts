import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'
import {
  DateState,
  FirstDayOfWeekPreference,
  SelectedDispatchDate,
} from '@entities/date/domain/types'

export const selectDateState = (state: RootState): DateState => state.date

export const selectSelectedDate = (state: RootState): SelectedDispatchDate =>
  state.date.selectedDate

export const selectSelectedDates = (state: RootState): DispatchDate[] =>
  state.date.selectedDates

export const selectIsMultiDateMode = (state: RootState): boolean =>
  state.date.isMultiDateMode

export const selectCachedSingleDate = (state: RootState): SelectedDispatchDate =>
  state.date.cachedSingleDate

/** Для мини-карточки и CardPie: несколько дат только при включённом multi и непустом списке. */
export const selectMergedDispatchDates = createSelector(
  [
    selectSelectedDate,
    selectSelectedDates,
    selectIsMultiDateMode,
  ],
  (single, list, multi): DispatchDate[] => {
    if (!multi) return single ? [single] : []
    return list
  },
)

export const selectIsDateComplete = (state: RootState): boolean =>
  state.date.isComplete

export const selectFirstDayOfWeek = (
  state: RootState,
): FirstDayOfWeekPreference => state.date.firstDayOfWeek
