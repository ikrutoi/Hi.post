import {
  PostcardStatuses,
  PostcardStatusesCount,
} from '@/entities/postcard/domain/types'
import type { RootState } from '@app/state'
import type { CalendarViewDate } from '@entities/date/domain/types'
import type { DayPanelPayload } from '../state/calendar.slice'

export const selectLastCalendarViewDate = (
  state: RootState,
): CalendarViewDate => state.calendar.lastViewedCalendarDate

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
