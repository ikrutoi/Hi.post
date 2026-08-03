import type {
  CartdateBranch,
  DateStripSection,
} from '@date/presentation/dateStripSection.types'
import type { CardSection } from '@shared/config/constants'
import type { PostcardStatus } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import { getCurrentDate } from '@shared/utils/date'

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

/**
 * Смена даты открытки из корзины: chrome как у date, apply — в корзину.
 * Две ветки: active `cart` и `cartBlocked` (см. `resolveCartdateBranch`).
 */
export function isCartdateCalendarStrip(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): boolean {
  return activeSection === 'date' && notebookStripTab === 'cartdate'
}

/** Только assembly `date` — без `cartdate` (тот отдельный cart-owned режим). */
export function isDateCalendarStrip(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): boolean {
  return activeSection === 'date' && notebookStripTab === 'date'
}

/** Полоса, где клик по дню пишет дату в cart / cartBlocked (date-pick). */
export function isCartDatePickStrip(notebookStripTab: DateStripSection): boolean {
  return notebookStripTab === 'cart' || notebookStripTab === 'cartdate'
}

/**
 * Визуальный chrome как у date (tint + Apply), не иконка корзины.
 * Включает `cartdate` — выглядит как дата, принадлежит корзине.
 */
export function isDateChromeStrip(notebookStripTab: DateStripSection): boolean {
  return notebookStripTab === 'date' || notebookStripTab === 'cartdate'
}

/** Контекст правого archive cart (список / cartdate pick), не assembly. */
export function isCartOwnedNotebookStrip(
  notebookStripTab: DateStripSection,
): boolean {
  return notebookStripTab === 'cart' || notebookStripTab === 'cartdate'
}

/**
 * Ветка `cartdate`:
 * - `cartBlocked` — просроченная / blocked: календарь с нуля, сектор date пустой до Apply;
 * - `cart` — активная открытка корзины: месяц открытки, превью сохраняется.
 */
export function resolveCartdateBranch(input: {
  status: PostcardStatus | null | undefined
  dates?: readonly DispatchDate[] | null
  currentDate?: { year: number; month: number; day: number }
}): CartdateBranch {
  const currentDate = input.currentDate ?? getCurrentDate()
  const dates = input.dates ?? []
  const orderDisabled =
    dates.length > 0 &&
    dates.every((d) => isDispatchDateDisabledForOrder(d, currentDate))
  if (input.status === 'cartBlocked' || orderDisabled) {
    return 'cartBlocked'
  }
  return 'cart'
}

export function resolveCardPreviewSection(
  activeSection: CardSection | null | undefined,
  notebookStripTab: DateStripSection,
): CardSection | 'cart' | null {
  if (isHistoryCalendarStrip(activeSection, notebookStripTab)) return 'history'
  /**
   * `cart` и `cartdate`: превью дня из корзины (в т.ч. cartBlocked + индикатор
   * blocked) — не assembly-date, пока листаем месяц до выбора новой даты.
   */
  if (
    activeSection === 'date' &&
    isCartOwnedNotebookStrip(notebookStripTab)
  ) {
    return 'cart'
  }
  return activeSection
}
