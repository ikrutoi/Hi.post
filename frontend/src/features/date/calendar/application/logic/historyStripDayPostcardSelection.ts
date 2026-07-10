import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import {
  orderedStripPostcardsByDispatchDate,
  type StripMonthCycleStatus,
} from '@date/application/helpers/calendarStripMonthCycle'
import { HISTORY_STRIP_STATUS_PRIORITY } from '@date/application/helpers/stripDefaultSelection'
import {
  nextCyclicLocalId,
  orderedHistoryDayLocalIds,
} from '../../infrastructure/calendarDayPostcardCycle'

export type HistoryStripDayPostcardSelectionResult =
  | { kind: 'cycle'; localId: number }
  | { kind: 'openDay'; localId: number | null }

function orderedHistoryStripLocalIdsByDispatchDate(
  cartItems: readonly PostcardHydrated[],
  postcardStatuses: PostcardStatuses,
): number[] {
  const collected: PostcardHydrated[] = []
  for (const status of HISTORY_STRIP_STATUS_PRIORITY) {
    if (!postcardStatuses[status]) continue
    collected.push(
      ...orderedStripPostcardsByDispatchDate(
        cartItems,
        status as StripMonthCycleStatus,
      ),
    )
  }
  collected.sort((a, b) => {
    const timeDelta =
      new Date(a.date.year, a.date.month, a.date.day).getTime() -
      new Date(b.date.year, b.date.month, b.date.day).getTime()
    if (timeDelta !== 0) return timeDelta
    return a.localId - b.localId
  })

  const lids: number[] = []
  const seen = new Set<number>()
  for (const item of collected) {
    if (seen.has(item.localId)) continue
    seen.add(item.localId)
    lids.push(item.localId)
  }
  return lids
}

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
  )
  const sameHistoryDay =
    input.notebookStripTabIsHistory &&
    input.openDayPanelDateKey === input.dateKey &&
    lids.length > 1

  if (sameHistoryDay) {
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
}): number | null {
  const lids = orderedHistoryDayLocalIds(
    input.dayData,
    input.cartItems,
    input.postcardStatuses,
  )
  if (lids.length <= 1) return null
  return nextCyclicLocalId(lids, input.listSelectedLocalId)
}

export function resolveHistoryStripPostcardCycle(input: {
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  listSelectedLocalId: number | null
}): number | null {
  const lids = orderedHistoryStripLocalIdsByDispatchDate(
    input.cartItems,
    input.postcardStatuses,
  )
  if (lids.length <= 1) return null
  return nextCyclicLocalId(lids, input.listSelectedLocalId)
}

/** Центр CardPie: сначала цикл по дню, затем по всей полосе «История». */
export function resolveHistoryCenterPostcardCycle(input: {
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  listSelectedLocalId: number | null
}): number | null {
  const dayNext = resolveHistoryCalendarCenterPostcardCycle(input)
  if (dayNext != null) return dayNext
  return resolveHistoryStripPostcardCycle(input)
}

/** Список истории открыт: сначала цикл по дню, затем по всей полосе. */
export function resolveHistoryListCenterPostcardCycle(input: {
  dateKey: string
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  postcardStatuses: PostcardStatuses
  openDayPanelDateKey: string | null | undefined
  listSelectedLocalId: number | null
}): number | null {
  const dayResult = resolveHistoryStripDayPostcardSelection({
    ...input,
    notebookStripTabIsHistory: true,
  })
  if (dayResult.kind === 'cycle') return dayResult.localId
  return resolveHistoryStripPostcardCycle(input)
}
