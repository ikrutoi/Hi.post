import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@/entities/postcard/domain/types'
import { orderedHistoryDayLocalIds } from './calendarDayPostcardCycle'
import { postcardLocalIdFromCalendarCardItem } from './postcardLocalIdFromCalendarCardItem'

/**
 * Первая открытка дня для панели дня истории / правого CardPie / подсветки строки списка
 * (cart → ready → sent → delivered → error).
 */
export function getHistoryOpenDayPanelPrimaryPostcardLocalId(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
): number | null {
  const lids = orderedHistoryDayLocalIds(dayData, cartItems, postcardStatuses)
  return lids[0] ?? null
}
