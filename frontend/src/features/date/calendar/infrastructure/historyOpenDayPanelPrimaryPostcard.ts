import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@/entities/postcard/domain/types'
import { flattenOpenDayPanelItems } from '@date/infrastructure/selectors/dateSelectors'
import { postcardLocalIdFromCalendarCardItem } from './postcardLocalIdFromCalendarCardItem'

/**
 * Первая открытка дня для панели дня истории / правого CardPie / подсветки строки списка
 * (тот же порядок и фильтр легенды, что в `selectHistoryOpenDayPanelArchiveLocalId`).
 */
export function getHistoryOpenDayPanelPrimaryPostcardLocalId(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
): number | null {
  for (const item of flattenOpenDayPanelItems(dayData)) {
    if (!postcardStatuses[item.status]) continue
    const lid = postcardLocalIdFromCalendarCardItem(item, cartItems)
    if (lid != null) return lid
  }
  return null
}
