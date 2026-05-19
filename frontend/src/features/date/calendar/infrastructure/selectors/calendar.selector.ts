import { POSTCARD_DISPATCH_DATE_FALLBACK } from '@entities/postcard'
import type {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'
import type { RootState } from '@app/state'
import type { CalendarViewDate, DispatchDate } from '@entities/date/domain/types'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import { createSelector } from '@reduxjs/toolkit'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { selectCartListSelectedLocalId } from '@cart/infrastructure/selectors/cartSelectors'
import { getHistoryOpenDayPanelPrimaryPostcardLocalId } from '../historyOpenDayPanelPrimaryPostcard'
import type { DayPanelPayload } from '../state/calendar.slice'
import type { PanelDensity2Size } from '@shared/ui/icons'

export const selectLastCalendarViewDate = (
  state: RootState,
): CalendarViewDate => state.calendar.lastViewedCalendarDate

export const computeNotebookStripTabFromState = (
  state: RootState,
): DateStripSection => {
  const activeSection = state.sectionEditorMenu.activeSection
  if (state.cart.isActive && state.calendar.notebookStripDateOverCart) {
    return 'date'
  }
  if (state.cart.isActive) return 'cart'
  if (
    activeSection === 'date' &&
    state.calendar.notebookStripTab === 'cart' &&
    !state.calendar.notebookStripDateOverCart
  ) {
    return 'cart'
  }
  if (activeSection === 'history') return 'history'
  if (
    state.calendar.historyListPanelOpen &&
    (state.calendar.historyListSelectedLocalId != null ||
      state.calendar.openDayPanel != null)
  ) {
    return 'history'
  }
  if (activeSection === 'date') return 'date'
  return 'date'
}

export const selectNotebookStripTab = (state: RootState): DateStripSection =>
  state.calendar.notebookStripTab

export const selectCartCalendarDatePickMode = (state: RootState): boolean =>
  state.calendar.cartCalendarDatePickMode

export const selectCartCalendarDatePickLocalId = (
  state: RootState,
): number | null => state.calendar.cartCalendarDatePickLocalId

export const selectNotebookDateTabPeekClearTick = (state: RootState): number =>
  state.calendar.notebookDateTabPeekClearTick

export const selectIsDateListPanelOpen = (state: RootState): boolean =>
  state.calendar.dateListPanelOpen

export const selectOpenDayPanel = (state: RootState): DayPanelPayload | null =>
  state.calendar.openDayPanel

export const selectIsCardPieListPanelOpen = (state: RootState): boolean =>
  state.calendar.cardPieListPanelOpen

export const selectIsHistoryListPanelOpen = (state: RootState): boolean =>
  state.calendar.historyListPanelOpen

export const selectHistoryListSelectedLocalId = (
  state: RootState,
): number | null => state.calendar.historyListSelectedLocalId ?? null

export const selectDateListSortDirection = (state: RootState): 'asc' | 'desc' =>
  state.calendar.dateListSortDirection ?? 'asc'

export const selectHistoryListSortDirection = (
  state: RootState,
): 'asc' | 'desc' => state.calendar.historyListSortDirection ?? 'desc'

export const selectHistoryListPanelDensity = (
  state: RootState,
): PanelDensity2Size => state.calendar.historyListPanelDensity ?? 1

export const selectCardPieListSortDirection = (
  state: RootState,
): 'asc' | 'desc' => state.calendar.cardPieListSortDirection ?? 'asc'

export const selectPostcardStatusesCount = (
  state: RootState,
): PostcardStatusesCount => state.calendar.postcardStatusesCount

export const selectPostcardStatuses = (state: RootState): PostcardStatuses =>
  state.calendar.postcardStatuses

export const selectHistoryOpenDayPanelArchiveLocalId = createSelector(
  [
    (s: RootState) => s.calendar.openDayPanel,
    (s: RootState) => s.sectionEditorMenu.activeSection,
    selectCartItems,
    selectPostcardStatuses,
  ],
  (openDayPanel, activeSection, cartItems, postcardStatuses) => {
    if (activeSection !== 'history' || openDayPanel == null) return null
    return getHistoryOpenDayPanelPrimaryPostcardLocalId(
      openDayPanel.dayData,
      cartItems,
      postcardStatuses,
    )
  },
)

function isPostcardDispatchFallbackDate(d: DispatchDate): boolean {
  return (
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

/**
 * Дата отправки открытки, для которой показан правый CardPie из списка корзины / истории
 * (та же приоритизация `localId`, что в `App.tsx` для `rightListArchiveLocalId`).
 */
export const selectRightListArchiveCardPieHighlightDispatchDate = createSelector(
  [
    selectNotebookStripTab,
    selectCartListSelectedLocalId,
    selectHistoryOpenDayPanelArchiveLocalId,
    selectIsHistoryListPanelOpen,
    selectHistoryListSelectedLocalId,
    selectCartItems,
  ],
  (
    notebookStripTab,
    cartListSelectedLocalId,
    historyDayPanelArchiveLocalId,
    historyListPanelOpen,
    historyListSelectedLocalId,
    cartItems,
  ): DispatchDate | null => {
    const localId =
      notebookStripTab === 'cart' && cartListSelectedLocalId != null
        ? cartListSelectedLocalId
        : historyListPanelOpen && historyListSelectedLocalId != null
          ? historyListSelectedLocalId
          : historyDayPanelArchiveLocalId != null
            ? historyDayPanelArchiveLocalId
            : null
    if (localId == null) return null
    const postcard = cartItems.find((p) => p.localId === localId)
    if (!postcard) return null
    const d = postcard.date
    if (isPostcardDispatchFallbackDate(d)) return null
    return d
  },
)
