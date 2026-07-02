import type { DateStripSection } from '@date/presentation/dateStripSection.types'
import type { CardSection } from '@shared/config/constants'

export function isHistoryCalendarStrip(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): boolean {
  return activeSection === 'history' || notebookStripTab === 'history'
}

export function isCartCalendarStrip(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): boolean {
  return activeSection === 'date' && notebookStripTab === 'cart'
}

export function resolveCardPreviewSection(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): CardSection | 'cart' | null {
  if (isHistoryCalendarStrip(activeSection, notebookStripTab)) return 'history'
  if (isCartCalendarStrip(activeSection, notebookStripTab)) return 'cart'
  return activeSection
}
