import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { CartListStatusSegment } from '@cart/domain/types'
import { orderedStripPostcardsByDispatchDate } from '@date/application/helpers/calendarStripMonthCycle'
import {
  nextCyclicLocalId,
  orderedCartStripLocalIdsForDay,
} from '../../infrastructure/calendarDayPostcardCycle'

export type CartListSelectedLocalIdsBySegment = Record<
  CartListStatusSegment,
  number | null
>

export function cartListStatusSegmentForLocalId(
  cartItems: readonly PostcardHydrated[],
  localId: number | null | undefined,
): CartListStatusSegment {
  if (localId == null) return 'cart'
  const postcard = cartItems.find((item) => item.localId === localId)
  return postcard?.status === 'cartBlocked' ? 'cartBlocked' : 'cart'
}

/** Текущая выбранная открытка strip «Корзина» с учётом обоих сегментов списка. */
export function resolveCartStripContextLocalId(input: {
  listStatusSegment: CartListStatusSegment
  bySegment: CartListSelectedLocalIdsBySegment
  fallbackLocalId?: number | null
  cartItems?: readonly PostcardHydrated[]
}): number | null {
  const segmentLocalId = input.bySegment[input.listStatusSegment]
  if (segmentLocalId != null) return segmentLocalId

  if (input.fallbackLocalId != null) {
    if (input.cartItems != null) {
      const fallbackSegment = cartListStatusSegmentForLocalId(
        input.cartItems,
        input.fallbackLocalId,
      )
      if (fallbackSegment === input.listStatusSegment) {
        return input.fallbackLocalId
      }
    } else {
      return input.fallbackLocalId
    }
  }

  return input.bySegment.cartBlocked ?? input.bySegment.cart ?? null
}

function cartStripCycleStatusFilter(
  cartItems: readonly PostcardHydrated[],
  listSelectedLocalId: number | null,
  listStatusSegment: CartListStatusSegment,
): CartListStatusSegment {
  if (listSelectedLocalId != null) {
    return cartListStatusSegmentForLocalId(cartItems, listSelectedLocalId)
  }
  return listStatusSegment
}

export type CartStripDayPostcardSelectionResult =
  | { kind: 'cycle'; localId: number }
  | { kind: 'openDay'; localId: number | null }

/** Та же логика, что у клика по дню календаря в strip «Корзина». */
export function resolveCartStripDayPostcardSelection(input: {
  dateKey: string
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  openDayPanelDateKey: string | null | undefined
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
  notebookStripTabIsCart: boolean
}): CartStripDayPostcardSelectionResult {
  const statusFilter = cartStripCycleStatusFilter(
    input.cartItems,
    input.listSelectedLocalId,
    input.listStatusSegment,
  )
  const lids = orderedCartStripLocalIdsForDay(
    input.dayData,
    input.cartItems,
    statusFilter,
  )
  const sameCartDay =
    input.notebookStripTabIsCart &&
    input.openDayPanelDateKey === input.dateKey &&
    lids.length > 1

  if (sameCartDay) {
    const next = nextCyclicLocalId(lids, input.listSelectedLocalId)
    if (next != null) return { kind: 'cycle', localId: next }
    return { kind: 'openDay', localId: lids[0] ?? null }
  }

  return {
    kind: 'openDay',
    localId: lids.length > 0 ? lids[0]! : null,
  }
}

/** Листание по всем открыткам сегмента (cart / cartBlocked) по дате отправки. */
export function resolveCartStripSegmentPostcardCycle(input: {
  cartItems: readonly PostcardHydrated[]
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
}): number | null {
  const statusFilter = cartStripCycleStatusFilter(
    input.cartItems,
    input.listSelectedLocalId,
    input.listStatusSegment,
  )
  const items = orderedStripPostcardsByDispatchDate(
    input.cartItems,
    statusFilter,
  )
  if (items.length <= 1) return null
  const lids = items.map((item) => item.localId)
  return nextCyclicLocalId(lids, input.listSelectedLocalId)
}

/** Центр CardPie в режиме календаря корзины: только цикл по дню, без списка и day panel. */
export function resolveCartCalendarCenterPostcardCycle(input: {
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
}): number | null {
  const statusFilter = cartStripCycleStatusFilter(
    input.cartItems,
    input.listSelectedLocalId,
    input.listStatusSegment,
  )
  const lids = orderedCartStripLocalIdsForDay(
    input.dayData,
    input.cartItems,
    statusFilter,
  )
  if (lids.length <= 1) return null
  return nextCyclicLocalId(lids, input.listSelectedLocalId)
}

/** Центр CardPie: сначала цикл по дню, затем по всему сегменту списка. */
export function resolveCartCenterPostcardCycle(input: {
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
}): number | null {
  const dayNext = resolveCartCalendarCenterPostcardCycle(input)
  if (dayNext != null) return dayNext
  return resolveCartStripSegmentPostcardCycle(input)
}

/** Список корзины открыт: сначала цикл по дню, затем по всему сегменту. */
export function resolveCartListCenterPostcardCycle(input: {
  dateKey: string
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  openDayPanelDateKey: string | null | undefined
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
}): number | null {
  const dayResult = resolveCartStripDayPostcardSelection({
    ...input,
    notebookStripTabIsCart: true,
  })
  if (dayResult.kind === 'cycle') return dayResult.localId
  return resolveCartStripSegmentPostcardCycle(input)
}

export function dispatchDateKeyFromPostcard(
  postcard: Pick<PostcardHydrated, 'date'>,
): string {
  const { year, month, day } = postcard.date
  return `${year}-${month}-${day}`
}
