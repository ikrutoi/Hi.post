import { createAction } from '@reduxjs/toolkit'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import type { DispatchDate } from '@entities/date/domain/types'

export const notebookTabDateClicked = createAction(
  'calendar/notebookTabDateClicked',
)

export const notebookTabCartClicked = createAction(
  'calendar/notebookTabCartClicked',
)

export const notebookTabHistoryClicked = createAction(
  'calendar/notebookTabHistoryClicked',
)

export const notebookActiveSectionChanged = createAction<{
  activeSection: string | null
}>('calendar/notebookActiveSectionChanged')

export const notebookCartPanelOpenChanged = createAction<{
  isOpen: boolean
}>('calendar/notebookCartPanelOpenChanged')

export const notebookHistoryPanelOpenChanged = createAction<{
  isOpen: boolean
}>('calendar/notebookHistoryPanelOpenChanged')

export const notebookSessionRestored = createAction<{
  tab: DateStripSection | null
}>('calendar/notebookSessionRestored')

/**
 * Календарь корзины/истории только что открыт (список закрыт).
 * Сага якорит месяц/год на открытку в центральном CardPie, если она выбрана.
 */
export const archiveCalendarViewEntered = createAction<'cart' | 'history'>(
  'calendar/archiveCalendarViewEntered',
)

/**
 * Применить дату к открытке `localId` (полоса `cart`: клик по дню;
 * `unblocked`: только после Apply по черновику).
 * Сага обновляет дату и переводит сегмент списка на `cart`.
 * Режим pick остаётся включённым, пока пользователь не выйдет из edit.
 */
export const cartCalendarDatePickApplied = createAction<{
  localId: number
  date: DispatchDate
}>('calendar/cartCalendarDatePickApplied')
