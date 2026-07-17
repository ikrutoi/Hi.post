import type { CardCalendarIndex } from '@entities/card/domain/types'
import type { PostcardHydrated } from '@entities/postcard'
import type { CartListStatusSegment } from '@cart/domain/types'
import { orderedStripPostcardsByDispatchDate } from '@date/application/helpers/calendarStripMonthCycle'
import {
  nextCyclicLocalId,
  nextSequentialLocalId,
  orderedCartCenterCycleLocalIds,
  orderedCartStripLocalIdsForDay,
  resolveDayThenGlobalPostcardCycle,
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

/**
 * ID открыток дня для strip «Корзина».
 * Если в текущем сегменте пусто (например выбран `cart`, а на дне только `cartBlocked`) —
 * берём другой сегмент, иначе клик по превью не открывает CardPie.
 */
function orderedCartStripLocalIdsForDayPreferringSegment(
  dayData: CardCalendarIndex,
  cartItems: readonly PostcardHydrated[],
  statusFilter: CartListStatusSegment,
  dateKey: string,
): number[] {
  const primary = orderedCartStripLocalIdsForDay(
    dayData,
    cartItems,
    statusFilter,
    dateKey,
  )
  if (primary.length > 0) return primary
  const other: CartListStatusSegment =
    statusFilter === 'cart' ? 'cartBlocked' : 'cart'
  return orderedCartStripLocalIdsForDay(dayData, cartItems, other, dateKey)
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
  const lids = orderedCartStripLocalIdsForDayPreferringSegment(
    input.dayData,
    input.cartItems,
    statusFilter,
    input.dateKey,
  )
  const sameCartDay =
    input.notebookStripTabIsCart &&
    input.openDayPanelDateKey === input.dateKey &&
    lids.length > 1
  const currentInDayList =
    input.listSelectedLocalId == null ||
    lids.includes(input.listSelectedLocalId)

  if (sameCartDay && currentInDayList) {
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
  return nextSequentialLocalId(lids, input.listSelectedLocalId)
}

/** Центр CardPie в режиме календаря корзины: только цикл по дню, без списка и day panel. */
export function resolveCartCalendarCenterPostcardCycle(input: {
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
  dateKey: string
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
    input.dateKey,
  )
  if (lids.length <= 1) return null
  return nextSequentialLocalId(lids, input.listSelectedLocalId)
}

/** Центр CardPie: сначала цикл по дню, затем по всему сегменту списка. */
export function resolveCartCenterPostcardCycle(input: {
  cardsByDateMap: Record<string, CardCalendarIndex>
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
  dateKey: string
}): number | null {
  const statusFilter = cartStripCycleStatusFilter(
    input.cartItems,
    input.listSelectedLocalId,
    input.listStatusSegment,
  )
  const dayLids = orderedCartStripLocalIdsForDay(
    input.dayData,
    input.cartItems,
    statusFilter,
    input.dateKey,
  )
  const allLids = orderedCartCenterCycleLocalIds(
    input.cardsByDateMap,
    input.cartItems,
    statusFilter,
  )

  return resolveDayThenGlobalPostcardCycle({
    current: input.listSelectedLocalId,
    dayLocalIds: dayLids,
    globalLocalIds: allLids,
  })
}

/** Список корзины открыт: цикл по всем открыткам текущего сегмента списка. */
export function resolveCartListCenterPostcardCycle(input: {
  dateKey: string
  dayData: CardCalendarIndex
  cartItems: readonly PostcardHydrated[]
  openDayPanelDateKey: string | null | undefined
  listSelectedLocalId: number | null
  listStatusSegment: CartListStatusSegment
}): number | null {
  void input.dateKey
  void input.dayData
  void input.openDayPanelDateKey
  return resolveCartStripSegmentPostcardCycle(input)
}

export { dispatchDateKeyFromPostcard } from '../../infrastructure/calendarDayPostcardCycle'
