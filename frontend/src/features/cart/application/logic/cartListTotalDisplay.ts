import type { PostcardHydrated } from '@entities/postcard'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import { getCurrentDate } from '@shared/utils/date'
import { listEntryPriceLine } from '@shared/utils/listEntryPriceLine'

/** Leading amount in a list price string (aligned with row `priceLine`). */
function numericFromPriceLine(line: string): number {
  const m = line.match(/[\d]+(?:[.,]\d+)?/)
  if (!m) return 0
  return parseFloat(m[0].replace(',', '.')) || 0
}

/** Text after the first number (e.g. `USD` from `6.00 USD`). */
function currencySuffixFromPriceLine(line: string): string {
  const m = line.match(/[\d]+(?:[.,]\d+)?/)
  if (!m) return 'USD'
  const tail = line.slice(line.indexOf(m[0]) + m[0].length).trim()
  return tail || 'USD'
}

/** Активные открытки сегмента «Корзина» (дата отправки доступна для заказа). */
export function cartBillablePostcards(
  items: PostcardHydrated[],
): PostcardHydrated[] {
  const currentDate = getCurrentDate()
  return items.filter(
    (p) =>
      p.status === 'cart' &&
      !isDispatchDateDisabledForOrder(p.date, currentDate),
  )
}

export function cartListTotalNumeric(postcards: PostcardHydrated[]): number {
  let sum = 0
  for (const p of postcards) {
    sum += numericFromPriceLine(listEntryPriceLine(p))
  }
  return sum
}

export function cartListTotalDisplayFromPostcards(
  postcards: PostcardHydrated[],
): string {
  if (postcards.length === 0) {
    const emptyLine = listEntryPriceLine(undefined)
    return `0.00 ${currencySuffixFromPriceLine(emptyLine)}`
  }
  const sum = cartListTotalNumeric(postcards)
  const suffix = currencySuffixFromPriceLine(listEntryPriceLine(postcards[0]))
  return `${sum.toFixed(2)} ${suffix}`
}
