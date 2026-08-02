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

/** Смена даты заблокированной открытки: chrome как у date, apply — в корзину. */
export function isUnblockedCalendarStrip(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): boolean {
  return activeSection === 'date' && notebookStripTab === 'unblocked'
}

/** Только assembly `date` — без `unblocked` (тот отдельный cart-owned режим). */
export function isDateCalendarStrip(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): boolean {
  return activeSection === 'date' && notebookStripTab === 'date'
}

/** Полоса, где клик по дню пишет дату в cartBlocked (date-pick). */
export function isCartDatePickStrip(notebookStripTab: DateStripSection): boolean {
  return notebookStripTab === 'cart' || notebookStripTab === 'unblocked'
}

/**
 * Визуальный chrome как у date (tint + Apply), не иконка корзины.
 * Включает `unblocked` — выглядит как дата, принадлежит корзине.
 */
export function isDateChromeStrip(notebookStripTab: DateStripSection): boolean {
  return notebookStripTab === 'date' || notebookStripTab === 'unblocked'
}

/** Контекст правого archive cart (список / unblocked pick), не assembly. */
export function isCartOwnedNotebookStrip(
  notebookStripTab: DateStripSection,
): boolean {
  return notebookStripTab === 'cart' || notebookStripTab === 'unblocked'
}

export function resolveCardPreviewSection(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): CardSection | 'cart' | null {
  if (isHistoryCalendarStrip(activeSection, notebookStripTab)) return 'history'
  if (isCartCalendarStrip(activeSection, notebookStripTab)) return 'cart'
  return activeSection
}
