import type { CalendarCardItem } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatus } from '@entities/postcard/domain/types'

const POSTCARD_ROW_KEY_STATUSES = [
  'cartBlocked',
  'cart',
  'ready',
  'sent',
  'delivered',
  'error',
] as const satisfies readonly PostcardStatus[]

/** `postcard:{slot}:{postcardId}:{status}` — `postcardId` может содержать `:`. */
function postcardIdFromPostcardRowKey(
  rowKey: string,
): string | undefined {
  if (!rowKey.startsWith('postcard:')) return undefined
  for (const status of POSTCARD_ROW_KEY_STATUSES) {
    const suffix = `:${status}`
    if (!rowKey.endsWith(suffix)) continue
    const prefix = rowKey.slice(0, -suffix.length)
    const slotSeparator = prefix.indexOf(':')
    if (slotSeparator < 0) continue
    const idSeparator = prefix.indexOf(':', slotSeparator + 1)
    if (idSeparator < 0) continue
    return prefix.slice(idSeparator + 1)
  }
  return undefined
}

function localIdFromCalendarCardItemByCardId(
  item: CalendarCardItem,
  cartItems: readonly PostcardHydrated[],
): number | undefined {
  if (!item.cardId) return undefined
  const byCardId = cartItems.find((x) => x.card.id === item.cardId)
  if (byCardId != null) return byCardId.localId
  const byPostcardId = cartItems.find((x) => x.id === item.cardId)
  return byPostcardId?.localId
}

/** `rowKey` вида `postcard:{slot}:{postcardId}:{status}` → `localId` из `cart.items`. */
export function postcardLocalIdFromCalendarCardItem(
  item: CalendarCardItem,
  cartItems: readonly PostcardHydrated[],
): number | undefined {
  const postcardId = postcardIdFromPostcardRowKey(item.rowKey)
  if (postcardId != null) {
    const byRowKey = cartItems.find((x) => x.id === postcardId)
    if (byRowKey != null) return byRowKey.localId
  }
  return localIdFromCalendarCardItemByCardId(item, cartItems)
}
