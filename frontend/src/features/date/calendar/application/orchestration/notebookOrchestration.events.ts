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
 * Пользователь выбрал день в календаре в режиме `cartCalendarDatePickMode`:
 * сага обновляет дату открытки `localId`, выключает режим и переводит сегмент списка на `cart`.
 */
export const cartCalendarDatePickApplied = createAction<{
  localId: number
  date: DispatchDate
}>('calendar/cartCalendarDatePickApplied')
