import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated, PostcardStatus } from '@entities/postcard'

export type LegendStatusCounts = Record<PostcardStatus, number>

export function computeCartLegendStatusCounts(
  cartItems: Pick<PostcardHydrated, 'status'>[],
): { legendStatusCounts: LegendStatusCounts; cartUnderlyingPostcardCount: number } {
  const legendStatusCounts: LegendStatusCounts = {
    cart: 0,
    cartBlocked: 0,
    ready: 0,
    sent: 0,
    delivered: 0,
    error: 0,
  }
  let cartUnderlyingPostcardCount = 0

  cartItems.forEach((item) => {
    if (item.status !== 'cart' && item.status !== 'cartBlocked') return
    legendStatusCounts[item.status] += 1
    cartUnderlyingPostcardCount += 1
  })

  return { legendStatusCounts, cartUnderlyingPostcardCount }
}

/** История: счётчики из `cartItems` — тот же источник, что у цикла месяцев в футере. */
export function computeHistoryLegendStatusCounts(
  cartItems: Pick<PostcardHydrated, 'status'>[],
): {
  legendStatusCounts: LegendStatusCounts
  historyUnderlyingPostcardCount: number
} {
  const legendStatusCounts: LegendStatusCounts = {
    cart: 0,
    cartBlocked: 0,
    ready: 0,
    sent: 0,
    delivered: 0,
    error: 0,
  }
  let historyUnderlyingPostcardCount = 0

  cartItems.forEach((item) => {
    if (item.status === 'cartBlocked') return
    legendStatusCounts[item.status] += 1
    historyUnderlyingPostcardCount += 1
  })

  return { legendStatusCounts, historyUnderlyingPostcardCount }
}

export function computeLegendStatusCountsFromCalendarMap(
  cardsByDateMap: Record<string, CardCalendarIndex>,
): { legendStatusCounts: LegendStatusCounts; historyUnderlyingPostcardCount: number } {
  const legendStatusCounts: LegendStatusCounts = {
    cart: 0,
    cartBlocked: 0,
    ready: 0,
    sent: 0,
    delivered: 0,
    error: 0,
  }
  let historyUnderlyingPostcardCount = 0

  Object.values(cardsByDateMap).forEach((day) => {
    const postcardItems = [
      ...day.cart,
      ...day.ready,
      ...day.sent,
      ...day.delivered,
      ...day.error,
    ]
    postcardItems.forEach((item) => {
      if (item.status === 'cartBlocked') return
      legendStatusCounts[item.status] += 1
      historyUnderlyingPostcardCount += 1
    })
  })

  return { legendStatusCounts, historyUnderlyingPostcardCount }
}
