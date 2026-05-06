import { useAppSelector } from '@app/hooks'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import type { DateStripSection } from './dateStripSection.types'

/**
 * Режим закладок Date / Cart / History в центральной полосе (фабрика + peek).
 * Хранится в Redux (`calendar.notebookStripTab`), сага держит в согласованности с секцией и панелями.
 */
export function useDateStripSectionForNotebookTabs(): DateStripSection {
  return useAppSelector(selectNotebookStripTab)
}
