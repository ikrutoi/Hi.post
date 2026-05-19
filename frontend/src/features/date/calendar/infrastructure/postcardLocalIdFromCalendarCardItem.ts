import type { CalendarCardItem } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'

/** `rowKey` вида `postcard:{slot}:{postcardId}:{status}` → `localId` из `cart.items`. */
export function postcardLocalIdFromCalendarCardItem(
  item: CalendarCardItem,
  cartItems: readonly PostcardHydrated[],
): number | undefined {
  if (!item.rowKey.startsWith('postcard:')) return undefined
  const m = item.rowKey.match(
    /^postcard:\d+:(.+):(cartBlocked|cart|ready|sent|delivered|error)$/,
  )
  if (!m) return undefined
  const postcardId = m[1]
  const p = cartItems.find((x) => x.id === postcardId)
  return p?.localId
}
