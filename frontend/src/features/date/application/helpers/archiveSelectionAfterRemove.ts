import type { RootState } from '@app/state'
import type { CartListStatusSegment } from '@cart/domain/types'
import {
  selectCartItems,
  selectCartListSelectedLocalIdsBySegment,
} from '@cart/infrastructure/selectors'
import { orderedStripPostcardsByDispatchDate } from '@date/application/helpers/calendarStripMonthCycle'
import {
  sortedHistoryListPanelEntriesFromState,
} from '@date/application/helpers/historyListPanelEntries'
import { cartListStatusSegmentForLocalId } from '@date/calendar/application/logic/cartStripDayPostcardSelection'
import {
  readDisplayedRightListArchivePostcardLocalId,
  selectHistoryListSelectedLocalId,
} from '@date/calendar/infrastructure/selectors'
import { selectIsMobileLayout } from '@layout/infrastructure/selectors'

export type ArchiveSelectionAdvance = {
  cart?: { segment: CartListStatusSegment; localId: number | null }
  historyLocalId?: number | null
  archiveSource?: 'cart' | 'history'
}

/** Следующая строка списка после удаления: тот же индекс; последняя → первая. */
export function nextLocalIdAfterRemoval(
  orderedLocalIds: readonly number[],
  removedLocalId: number,
): number | null {
  const idx = orderedLocalIds.indexOf(removedLocalId)
  if (idx < 0) return null

  const remaining = orderedLocalIds.filter((id) => id !== removedLocalId)
  if (remaining.length === 0) return null

  if (idx === orderedLocalIds.length - 1) {
    return remaining[0] ?? null
  }
  return remaining[Math.min(idx, remaining.length - 1)] ?? null
}

export function resolveArchiveSelectionAdvance(
  state: RootState,
  removedLocalId: number,
): ArchiveSelectionAdvance | null {
  const items = selectCartItems(state)
  const postcard = items.find((item) => item.localId === removedLocalId)
  if (postcard == null) return null

  const result: ArchiveSelectionAdvance = {}
  const cartBySegment = selectCartListSelectedLocalIdsBySegment(state)

  for (const segment of ['cart', 'cartBlocked'] as const) {
    if (cartBySegment[segment] !== removedLocalId) continue
    const orderedIds = orderedStripPostcardsByDispatchDate(items, segment).map(
      (item) => item.localId,
    )
    result.cart = {
      segment,
      localId: nextLocalIdAfterRemoval(orderedIds, removedLocalId),
    }
    result.archiveSource ??= 'cart'
  }

  if (selectHistoryListSelectedLocalId(state) === removedLocalId) {
    const orderedIds = sortedHistoryListPanelEntriesFromState(state)
      .map((entry) => entry.postcardLocalId)
      .filter((id): id is number => id != null)
    result.historyLocalId = nextLocalIdAfterRemoval(orderedIds, removedLocalId)
    result.archiveSource ??= 'history'
  }

  const displayedBeforeRemove = readDisplayedRightListArchivePostcardLocalId(
    state,
    {
      isMobileLayout: selectIsMobileLayout(state),
      /** Peek archive не в Redux — при удалении смотрим с peek. */
      activePieSideRight: true,
      pinnedLocalId: null,
    },
  )

  if (
    displayedBeforeRemove === removedLocalId &&
    result.cart == null &&
    result.historyLocalId === undefined
  ) {
    if (postcard.status === 'cart' || postcard.status === 'cartBlocked') {
      const segment = cartListStatusSegmentForLocalId(items, removedLocalId)
      const orderedIds = orderedStripPostcardsByDispatchDate(items, segment).map(
        (item) => item.localId,
      )
      result.cart = {
        segment,
        localId: nextLocalIdAfterRemoval(orderedIds, removedLocalId),
      }
      result.archiveSource = 'cart'
    } else {
      const orderedIds = sortedHistoryListPanelEntriesFromState(state)
        .map((entry) => entry.postcardLocalId)
        .filter((id): id is number => id != null)
      result.historyLocalId = nextLocalIdAfterRemoval(orderedIds, removedLocalId)
      result.archiveSource = 'history'
    }
  }

  if (
    result.cart == null &&
    result.historyLocalId === undefined &&
    result.archiveSource == null
  ) {
    return null
  }

  return result
}
