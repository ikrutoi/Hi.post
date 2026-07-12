import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import {
  nextCyclicLocalId,
  nextSequentialLocalId,
  orderedHistoryCenterCycleLocalIds,
  orderedHistoryDayLocalIds,
  resolveDayThenGlobalPostcardCycle,
} from '../../infrastructure/calendarDayPostcardCycle'

export type HistoryStripDayPostcardSelectionResult =
  | { kind: 'cycle'; localId: number }
  | { kind: 'openDay'; localId: number | null }

/** Та же логика, что у клика по дню календаря в strip «История». */
export function resolveHistoryStripDayPostcardSelection(input: {
  dateKey: string
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  openDayPanelDateKey: string | null | undefined
  listSelectedLocalId: number | null
  notebookStripTabIsHistory: boolean
}): HistoryStripDayPostcardSelectionResult {
  const lids = orderedHistoryDayLocalIds(
    input.dayData,
    input.cartItems,
    input.postcardStatuses,
    input.dateKey,
  )
  const sameHistoryDay =
    input.notebookStripTabIsHistory &&
    input.openDayPanelDateKey === input.dateKey &&
    lids.length > 1
  const currentInDayList =
    input.listSelectedLocalId == null ||
    lids.includes(input.listSelectedLocalId)

  if (sameHistoryDay && currentInDayList) {
    const next = nextCyclicLocalId(lids, input.listSelectedLocalId)
    if (next != null) return { kind: 'cycle', localId: next }
    return { kind: 'openDay', localId: lids[0] ?? null }
  }

  return {
    kind: 'openDay',
    localId: lids.length > 0 ? lids[0]! : null,
  }
}

export function resolveHistoryCalendarCenterPostcardCycle(input: {
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  listSelectedLocalId: number | null
  dateKey: string
}): number | null {
  const lids = orderedHistoryDayLocalIds(
    input.dayData,
    input.cartItems,
    input.postcardStatuses,
    input.dateKey,
  )
  if (lids.length <= 1) return null
  return nextSequentialLocalId(lids, input.listSelectedLocalId)
}

export function resolveHistoryStripPostcardCycle(input: {
  cardsByDateMap: Record<string, CardCalendarIndex>
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  listSelectedLocalId: number | null
}): number | null {
  const lids = orderedHistoryCenterCycleLocalIds(
    input.cardsByDateMap,
    input.cartItems,
    input.postcardStatuses,
  )
  if (lids.length <= 1) return null
  return nextSequentialLocalId(lids, input.listSelectedLocalId)
}

/** Центр CardPie: сначала цикл по дню, затем по всей полосе «История». */
export function resolveHistoryCenterPostcardCycle(input: {
  cardsByDateMap: Record<string, CardCalendarIndex>
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  listSelectedLocalId: number | null
  dateKey: string
}): number | null {
  const dayLids = orderedHistoryDayLocalIds(
    input.dayData,
    input.cartItems,
    input.postcardStatuses,
    input.dateKey,
  )
  const allLids = orderedHistoryCenterCycleLocalIds(
    input.cardsByDateMap,
    input.cartItems,
    input.postcardStatuses,
  )

  return resolveDayThenGlobalPostcardCycle({
    current: input.listSelectedLocalId,
    dayLocalIds: dayLids,
    globalLocalIds: allLids,
  })
}

/** Список истории открыт: цикл по всем открыткам списка (как strip «История»). */
export function resolveHistoryListCenterPostcardCycle(input: {
  dateKey: string
  dayData: CardCalendarIndex
  cardsByDateMap: Record<string, CardCalendarIndex>
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  openDayPanelDateKey: string | null | undefined
  listSelectedLocalId: number | null
}): number | null {
  void input.dateKey
  void input.dayData
  void input.openDayPanelDateKey
  return resolveHistoryStripPostcardCycle(input)
}
