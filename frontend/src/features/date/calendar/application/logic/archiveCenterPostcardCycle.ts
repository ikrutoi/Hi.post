import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { PostcardStatuses } from '@entities/postcard/domain/types'
import {
  nextStripMonthCycleIndex,
  orderedStripPostcardsByDispatchDate,
  stripPostcardIndexByLocalId,
  type CartStripMonthCycleStatus,
  type HistoryStripMonthCycleStatus,
} from '@date/application/helpers/calendarStripMonthCycle'
import { orderedHistoryCenterCycleLocalIds } from '../../infrastructure/calendarDayPostcardCycle'

export type ArchiveCenterCycleSource = 'cart' | 'history'

const HISTORY_CENTER_CYCLE_STATUSES: PostcardStatuses = {
  cart: true,
  cartBlocked: false,
  ready: true,
  sent: true,
  delivered: true,
  error: true,
}

function stripCycleStatusForPostcard(
  postcard: Pick<PostcardHydrated, 'status'>,
): CartStripMonthCycleStatus | HistoryStripMonthCycleStatus {
  if (postcard.status === 'cart' || postcard.status === 'cartBlocked') {
    return postcard.status === 'cartBlocked' ? 'cartBlocked' : 'cart'
  }
  return postcard.status as HistoryStripMonthCycleStatus
}

function advanceCyclicInStripLocalIds(
  stripLocalIds: readonly number[],
  currentLocalId: number | null,
): number | null {
  if (stripLocalIds.length === 0) return null
  if (stripLocalIds.length === 1) {
    return stripLocalIds[0] === currentLocalId ? null : stripLocalIds[0]!
  }

  const stripIndex = stripPostcardIndexByLocalId(
    stripLocalIds.map((localId) => ({ localId })),
    currentLocalId,
  )
  if (stripIndex >= 0) {
    const nextIndex = nextStripMonthCycleIndex(stripIndex, stripLocalIds.length)
    return stripLocalIds[nextIndex] ?? null
  }

  return stripLocalIds.find((localId) => localId !== currentLocalId) ?? stripLocalIds[0]!
}

/**
 * Центр CardPie в календаре:
 * — история: все статусы кроме cartBlocked, один список по дате отправки, зацикливание;
 * — корзина: один сегмент (cart / cartBlocked) по дате, зацикливание (как футер).
 */
export function resolveArchiveCenterPostcardCycle(input: {
  archiveSource: ArchiveCenterCycleSource
  cardsByDateMap: Record<string, CardCalendarIndex>
  cartItems: readonly PostcardHydrated[]
  currentLocalId: number | null
}): number | null {
  if (input.currentLocalId == null) return null

  const postcard = input.cartItems.find(
    (item) => item.localId === input.currentLocalId,
  )
  if (postcard == null) return null

  const stripLocalIds =
    input.archiveSource === 'history'
      ? orderedHistoryCenterCycleLocalIds(
          input.cardsByDateMap,
          input.cartItems,
          HISTORY_CENTER_CYCLE_STATUSES,
        )
      : orderedStripPostcardsByDispatchDate(
          input.cartItems,
          stripCycleStatusForPostcard(postcard),
        ).map((item) => item.localId)

  return advanceCyclicInStripLocalIds(stripLocalIds, input.currentLocalId)
}
