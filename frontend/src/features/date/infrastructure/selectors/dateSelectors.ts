import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { CalendarCardItem } from '@entities/card/domain/types'
import {
  DateState,
  FirstDayOfWeekPreference,
  SelectedDispatchDate,
} from '@entities/date/domain/types'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'

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
 * Ключи веток получателя для списка дат / бейджа — как `recipientSlots` в `useDispatchPlanListEntries`
 * (только `recipient.applied` / `appliedData`, без «зависших» pending из envelope selection).
 */
export const selectRecipientBranchSlotKeys = createSelector(
  [selectRecipientState],
  (recipient): string[] => {
    const applied = recipient.applied ?? []
    if (applied.length > 0) return [...applied]
    if (recipient.appliedData != null) return ['session']
    return ['session']
  },
)

function dispatchDateKey(d: DispatchDate): string {
  return `${d.year}-${d.month}-${d.day}`
}

export function flattenOpenDayPanelItems(
  dayData: CardCalendarIndex,
): CalendarCardItem[] {
  const list: CalendarCardItem[] = []
  if (dayData.processed) list.push(dayData.processed)
  list.push(...dayData.cart)
  list.push(...dayData.ready)
  list.push(...dayData.sent)
  list.push(...dayData.delivered)
  list.push(...dayData.error)
  return list
}

/**
 * Число строк плана отправки (даты × ветки) — как `useDispatchPlanListEntries({ activeModeOnly: true })`.
 * Не зависит от `openDayPanel`: drill-down по дню не должен подменять счётчик списка дат / бейджа.
 */
export const selectDateListPlanRowCount = createSelector(
  [
    selectIsMultiDateMode,
    selectSelectedDates,
    selectSelectedDate,
    selectExcludedDispatchBranchSet,
    selectRecipientBranchSlotKeys,
  ],
  (isMulti, selectedDates, selectedDate, excluded, slotKeys) => {
    if (isMulti) {
      let c = 0
      for (const d of selectedDates) {
        const dk = dispatchDateKey(d)
        for (const slotKey of slotKeys) {
          if (!excluded.has(`${dk}|${slotKey}`)) c += 1
        }
      }
      return c
    }
    if (selectedDate) {
      const dk = dispatchDateKey(selectedDate)
      let c = 0
      for (const slotKey of slotKeys) {
        if (!excluded.has(`${dk}|${slotKey}`)) c += 1
      }
      return c
    }
    return 0
  },
)

/**
 * CardPie list badge: при drill-down по дню в календаре — число карточек в панели дня, иначе как план отправки.
 */
export const selectCardPieListPanelRowCount = createSelector(
  [
    (s: RootState) => s.calendar.openDayPanel,
    selectDateListPlanRowCount,
  ],
  (openDayPanel, planRowCount) => {
    if (openDayPanel) {
      return flattenOpenDayPanelItems(openDayPanel.dayData).length
    }
    return planRowCount
  },
)

/** Бейдж listDate в тулбаре секции «Дата». */
export const selectDateListToolbarBadgeCount = selectDateListPlanRowCount

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
