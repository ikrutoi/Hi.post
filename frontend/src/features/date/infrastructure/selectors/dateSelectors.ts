import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '@app/state'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CardCalendarIndex, CalendarCardItem } from '@entities/card/domain/types'
import {
  DateState,
  FirstDayOfWeekPreference,
  SelectedDispatchDate,
} from '@entities/date/domain/types'
import { selectRecipientState } from '@envelope/recipient/infrastructure/selectors'
import {
  selectEnvelopeSessionRecord,
  selectIsEnvelopeReady,
} from '@envelope/infrastructure/selectors'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCardphotoIsComplete } from '@cardphoto/infrastructure/selectors'
import { selectCardtextIsComplete } from '@cardtext/infrastructure/selectors'
import { selectIsAromaComplete } from '@aroma/infrastructure/selectors'
import {
  dispatchBranchKeyFromPostcard,
  dispatchDateKeyFromDispatchDate,
  recipientBranchKeyFromEnvelope,
} from '@date/domain/dispatchBranchKey'

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

export const selectIsDateComplete = (state: RootState): boolean =>
  state.date.isComplete

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

/** Как `branchKey` у `recipientSlots` в `useDispatchPlanListEntries` (CardPie / план отправки). */
export const selectRecipientPlanBranchSlotKeys = createSelector(
  [selectRecipientState, selectEnvelopeSessionRecord],
  (recipient, envelope): string[] => {
    const applied = recipient.applied ?? []
    if (applied.length > 0) return applied.map(String)
    return [recipientBranchKeyFromEnvelope(envelope)]
  },
)

function countPlanRowsForDispatchDate(
  d: DispatchDate,
  slotKeys: string[],
  excluded: Set<string>,
  cartBranchKeys: Set<string>,
  hideBranchesInCart: boolean,
): number {
  const dk = dispatchDateKeyFromDispatchDate(d)
  let count = 0
  for (const slotKey of slotKeys) {
    const branchKey = `${dk}|${slotKey}`
    if (excluded.has(branchKey)) continue
    if (hideBranchesInCart && cartBranchKeys.has(branchKey)) continue
    count += 1
  }
  return count
}

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
    selectRecipientPlanBranchSlotKeys,
  ],
  (isMulti, selectedDates, selectedDate, excluded, slotKeys) => {
    const cartBranchKeys = new Set<string>()
    if (isMulti) {
      let c = 0
      for (const d of selectedDates) {
        c += countPlanRowsForDispatchDate(
          d,
          slotKeys,
          excluded,
          cartBranchKeys,
          false,
        )
      }
      return c
    }
    if (selectedDate) {
      return countPlanRowsForDispatchDate(
        selectedDate,
        slotKeys,
        excluded,
        cartBranchKeys,
        false,
      )
    }
    return 0
  },
)

/**
 * Строки списка CardPie слева (editorPie): activeModeOnly, все ветки получателей,
 * showUndatedWhenAnySectionSelected — без drill-down `openDayPanel` календаря.
 */
export const selectEditorPieCardPieListRowCount = createSelector(
  [
    selectIsMultiDateMode,
    selectSelectedDates,
    selectSelectedDate,
    selectExcludedDispatchBranchSet,
    selectRecipientPlanBranchSlotKeys,
    selectCartItems,
    selectCardphotoIsComplete,
    selectCardtextIsComplete,
    selectIsEnvelopeReady,
    selectIsAromaComplete,
    selectIsDateComplete,
  ],
  (
    isMulti,
    selectedDates,
    selectedDate,
    excluded,
    slotKeys,
    cartItems,
    cardphoto,
    cardtext,
    envelope,
    aroma,
    date,
  ) => {
    const hasAnySectionFilled =
      cardphoto || cardtext || envelope || aroma || date
    const cartBranchKeys = new Set<string>()
    for (const p of cartItems) {
      if (p.status !== 'cart' && p.status !== 'cartBlocked') continue
      const key = dispatchBranchKeyFromPostcard(p)
      if (key) cartBranchKeys.add(key)
    }

    let count = 0
    if (isMulti) {
      for (const d of selectedDates) {
        count += countPlanRowsForDispatchDate(
          d,
          slotKeys,
          excluded,
          cartBranchKeys,
          false,
        )
      }
    } else if (selectedDate) {
      count = countPlanRowsForDispatchDate(
        selectedDate,
        slotKeys,
        excluded,
        cartBranchKeys,
        false,
      )
    }

    if (count === 0 && hasAnySectionFilled) {
      count = slotKeys.length
    }
    return count
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

const EMPTY_DISPATCH_DATES: DispatchDate[] = []

export const selectMergedDispatchDates = createSelector(
  [selectSelectedDate, selectSelectedDates, selectIsMultiDateMode],
  (single, list, multi): DispatchDate[] => {
    if (!multi) return single ? [single] : EMPTY_DISPATCH_DATES
    return [...list]
  },
)

export const selectFirstDayOfWeek = (
  state: RootState,
): FirstDayOfWeekPreference => state.date.firstDayOfWeek

// export const selectIsHistoryListPanelOpen = (state: RootState): boolean =>
//   state.date.historyListPanelOpen

// export const selectIsDateListPanelOpen = (state: RootState): boolean =>
//   state.date.dateListPanelOpen
