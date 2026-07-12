import type { CalendarCardItem } from '@entities/card/domain/types'
import type { CalendarDayStatusIndicator } from '@cardphoto/domain/types'
import type { PostcardStatus } from '@entities/postcard'

type CalendarDayStatusBuckets = {
  cart: CalendarCardItem[]
  ready: CalendarCardItem[]
  sent: CalendarCardItem[]
  delivered: CalendarCardItem[]
  error: CalendarCardItem[]
}

function pushIndicator(
  indicators: CalendarDayStatusIndicator[],
  status: PostcardStatus,
  count: number,
) {
  if (count > 0) indicators.push({ status, count })
}

function cartSlotIndicators(
  cart: CalendarCardItem[],
): CalendarDayStatusIndicator[] {
  const indicators: CalendarDayStatusIndicator[] = []
  const plainCartCount = cart.filter((item) => item.status === 'cart').length
  const blockedCount = cart.filter((item) => item.status === 'cartBlocked').length
  if (plainCartCount > 0) {
    pushIndicator(indicators, 'cart', plainCartCount)
  } else if (blockedCount > 0) {
    pushIndicator(indicators, 'cartBlocked', blockedCount)
  }
  return indicators
}

/** Календарь «История»: стек индикаторов по статусам дня (cart → ready → sent → delivered → error). */
export function historyCalendarDayStatusIndicators(
  data: CalendarDayStatusBuckets,
): CalendarDayStatusIndicator[] {
  const indicators = cartSlotIndicators(data.cart)
  pushIndicator(indicators, 'ready', data.ready.length)
  pushIndicator(indicators, 'sent', data.sent.length)
  pushIndicator(indicators, 'delivered', data.delivered.length)
  pushIndicator(indicators, 'error', data.error.length)
  return indicators
}

/** Календарь «Корзина»: индикаторы только по открыткам корзины на день. */
export function cartCalendarDayStatusIndicators(
  cart: CalendarCardItem[],
): CalendarDayStatusIndicator[] {
  return cartSlotIndicators(cart)
}

/** Статус индикатора, соответствующий открытке в центральном CardPie. */
export function resolveActiveCalendarIndicatorStatus(
  itemStatus: PostcardStatus,
  indicators: readonly CalendarDayStatusIndicator[],
): PostcardStatus | null {
  const keys = new Set(indicators.map((indicator) => indicator.status))
  if (keys.has(itemStatus)) return itemStatus
  if (
    (itemStatus === 'cart' || itemStatus === 'cartBlocked') &&
    keys.has('cart')
  ) {
    return 'cart'
  }
  if (itemStatus === 'cartBlocked' && keys.has('cartBlocked')) {
    return 'cartBlocked'
  }
  return null
}
