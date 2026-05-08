import { createAction } from '@reduxjs/toolkit'
import type { DateStripSection } from '@date/presentation/dateStripSection.types'

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
