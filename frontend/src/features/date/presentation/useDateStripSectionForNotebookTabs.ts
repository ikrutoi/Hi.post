import { useAppSelector } from '@app/hooks'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import type { DateStripSection } from './dateStripSection.types'

export function useDateStripSectionForNotebookTabs(): DateStripSection {
  return useAppSelector(selectNotebookStripTab)
}
