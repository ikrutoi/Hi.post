import {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'
import type { RootState } from '@app/state'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import { createSelector } from '@reduxjs/toolkit'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { getHistoryOpenDayPanelPrimaryPostcardLocalId } from '../historyOpenDayPanelPrimaryPostcard'
import type { DayPanelPayload } from '../state/calendar.slice'

export const selectLastCalendarViewDate = (
  state: RootState,
): CalendarViewDate => state.calendar.lastViewedCalendarDate

/** Ожидаемая закладка полосы по текущему Redux (источник для синхронизации `notebookStripTab`). */
export const computeNotebookStripTabFromState = (
  state: RootState,
): DateStripSection => {
  if (state.sectionEditorMenu.activeSection === 'history') return 'history'
  if (state.cart.isActive) return 'cart'
  if (state.calendar.historyListPanelOpen) return 'history'
  return 'date'
}

export const selectNotebookStripTab = (state: RootState): DateStripSection =>
  state.calendar.notebookStripTab

export const selectIsDateListPanelOpen = (state: RootState): boolean =>
  state.calendar.dateListPanelOpen

export const selectOpenDayPanel = (
  state: RootState,
): DayPanelPayload | null => state.calendar.openDayPanel

export const selectIsCardPieListPanelOpen = (state: RootState): boolean =>
  state.calendar.cardPieListPanelOpen

export const selectIsHistoryListPanelOpen = (state: RootState): boolean =>
  state.calendar.historyListPanelOpen

export const selectHistoryListSelectedLocalId = (
  state: RootState,
): number | null => state.calendar.historyListSelectedLocalId ?? null

export const selectDateListSortDirection = (state: RootState): 'asc' | 'desc' =>
  state.calendar.dateListSortDirection ?? 'asc'

export const selectCardPieListSortDirection = (state: RootState): 'asc' | 'desc' =>
  state.calendar.cardPieListSortDirection ?? 'asc'

export const selectPostcardStatusesCount = (
  state: RootState,
): PostcardStatusesCount => state.calendar.postcardStatusesCount

export const selectPostcardStatuses = (state: RootState): PostcardStatuses =>
  state.calendar.postcardStatuses

/**
 * Секция «История» + открыта панель дня календаря: первый открытка-айтем дня для правого CardPie (`localId`).
 */
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
