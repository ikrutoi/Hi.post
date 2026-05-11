import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import { flattenOpenDayPanelItems } from '@date/infrastructure/selectors/dateSelectors'
import { postcardLocalIdFromCalendarCardItem } from './postcardLocalIdFromCalendarCardItem'

/** Полоса «Корзина»: порядок `dayData.cart` → `localId` (без дублей). */
export function orderedCartStripLocalIdsForDay(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
): number[] {
  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of dayData.cart) {
    const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
    if (lid == null || seen.has(lid)) continue
    seen.add(lid)
    lids.push(lid)
  }
  return lids
}

/** Секция «История»: порядок как у панели дня / легенды (`flattenOpenDayPanelItems` + фильтр статусов). */
export function orderedHistoryDayLocalIds(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
): number[] {
  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of flattenOpenDayPanelItems(dayData)) {
    if (!postcardStatuses[item.status]) continue
    const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
    if (lid == null || seen.has(lid)) continue
    seen.add(lid)
    lids.push(lid)
  }
  return lids
}

/** Следующий `localId` в цикле; при `current` вне списка — с индекса 0. */
export function nextCyclicLocalId(
  orderedLocalIds: number[],
  current: number | null,
): number | null {
  if (orderedLocalIds.length === 0) return null
  if (orderedLocalIds.length === 1) return orderedLocalIds[0]
  const idx =
    current != null ? orderedLocalIds.indexOf(current) : -1
  const nextIdx = idx < 0 ? 0 : (idx + 1) % orderedLocalIds.length
  return orderedLocalIds[nextIdx] ?? null
}
