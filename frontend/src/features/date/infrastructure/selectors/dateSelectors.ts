import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'
import {
  DateState,
  FirstDayOfWeekPreference,
  SelectedDispatchDate,
} from '@entities/date/domain/types'
import {
  selectRecipientsPendingIds,
  selectSelectedRecipientEntriesInOrder,
} from '@envelope/infrastructure/selectors'
import { selectRecipientEnabled } from '@envelope/recipient/infrastructure/selectors'

export const selectDateState = (state: RootState): DateState => state.date

export const selectSelectedDate = (state: RootState): SelectedDispatchDate =>
  state.date.selectedDate

export const selectSelectedDates = (state: RootState): DispatchDate[] =>
  state.date.selectedDates

export const selectIsMultiDateMode = (state: RootState): boolean =>
  state.date.isMultiDateMode

export const selectMultiGroupId = (state: RootState): string | null =>
  state.date.multiGroupId

export const selectCachedSingleDate = (
  state: RootState,
): SelectedDispatchDate => state.date.cachedSingleDate

export const selectCachedMultiDates = (state: RootState): DispatchDate[] =>
  state.date.cachedMultiDates

/** Ключи веток «дата|получатель», убранные из списка дат (см. excludeDispatchBranch). */
export const selectExcludedDispatchBranches = (state: RootState): string[] =>
  state.date.excludedDispatchBranches ?? []

export const selectExcludedDispatchBranchSet = createSelector(
  [selectExcludedDispatchBranches],
  (list) => new Set(list),
)

/**
 * Ключи веток получателя для списка дат / бейджа календаря (как `recipientSlots` в DateRightSlot).
 */
export const selectRecipientBranchSlotKeys = createSelector(
  [
    selectRecipientEnabled,
    selectRecipientsPendingIds,
    selectSelectedRecipientEntriesInOrder,
  ],
  (recipientEnabled, pendingIds, selectedEntries): string[] => {
    if (recipientEnabled && pendingIds.length > 0) return pendingIds
    if (selectedEntries.length > 0) return selectedEntries.map((e) => e.id)
    return ['session']
  },
)

export const selectMergedDispatchDates = createSelector(
  [selectSelectedDate, selectSelectedDates, selectIsMultiDateMode],
  (single, list, multi): DispatchDate[] => {
    if (!multi) return single ? [single] : []
    return [...list]
  },
)

export const selectIsDateComplete = (state: RootState): boolean =>
  state.date.isComplete

export const selectFirstDayOfWeek = (
  state: RootState,
): FirstDayOfWeekPreference => state.date.firstDayOfWeek

// export const selectIsHistoryListPanelOpen = (state: RootState): boolean =>
//   state.date.historyListPanelOpen

// export const selectIsDateListPanelOpen = (state: RootState): boolean =>
//   state.date.dateListPanelOpen
