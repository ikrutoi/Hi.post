import type { PostcardHydrated } from '@entities/postcard'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

/** `localId` открыток сегмента «Корзина» с актуальной датой (чекбокс в строке). */
export function cartListBillableLocalIds(
  items: PostcardHydrated[],
): number[] {
  const currentDate = getCurrentDate()
  return items
    .filter(
      (p) =>
        p.status === 'cart' &&
        !isDispatchDateDisabledForOrder(p.date, currentDate),
    )
    .map((p) => p.localId)
}
