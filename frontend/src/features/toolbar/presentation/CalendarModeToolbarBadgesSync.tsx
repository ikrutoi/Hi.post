import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCartItems,
  selectCartListPanelOpen,
} from '@cart/infrastructure/selectors'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

/**
 * Syncs badges for calendar mode toolbars:
 * - cart toolbar: cart postcards count
 * - history toolbar: total postcards count
 */
export const CalendarModeToolbarBadgesSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const currentDate = getCurrentDate()
  const activeCartCount = cartItems.filter(
    (item) =>
      (item.status === 'cart' || item.status === 'cartBlocked') &&
      !isDispatchDateDisabledForOrder(item.date, currentDate),
  ).length
  const blockedCartCount = cartItems.filter(
    (item) =>
      (item.status === 'cart' || item.status === 'cartBlocked') &&
      isDispatchDateDisabledForOrder(item.date, currentDate),
  ).length
  const cartBadgeValue =
    blockedCartCount > 0
      ? `${activeCartCount}/${blockedCartCount}`
      : activeCartCount > 0
        ? String(activeCartCount)
        : null
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const postcardsCount = cartItems.filter((item) => {
    if (item.status === 'cartBlocked') return false
    if (item.status !== 'cart') return true
    return !isDispatchDateDisabledForOrder(item.date, currentDate)
  }).length
  const prevCartCount = useRef<number | undefined>(undefined)
  const prevBlockedCartCount = useRef<number | undefined>(undefined)
  const prevCartOpen = useRef<boolean | undefined>(undefined)
  const prevPostcardsCount = useRef<number | undefined>(undefined)
  const prevHistoryOpen = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    if (
      prevCartCount.current === activeCartCount &&
      prevBlockedCartCount.current === blockedCartCount &&
      prevCartOpen.current === cartListPanelOpen
    ) {
      return
    }
    prevCartCount.current = activeCartCount
    prevBlockedCartCount.current = blockedCartCount
    prevCartOpen.current = cartListPanelOpen
    dispatch(
      updateToolbarIcon({
        section: 'cart',
        key: 'cart',
        value: {
          state: cartListPanelOpen ? 'active' : 'enabled',
          options: { badge: cartBadgeValue },
        },
      }),
    )
  }, [activeCartCount, blockedCartCount, cartBadgeValue, cartListPanelOpen, dispatch])

  useEffect(() => {
    if (
      prevPostcardsCount.current === postcardsCount &&
      prevHistoryOpen.current === historyListPanelOpen
    ) {
      return
    }
    prevPostcardsCount.current = postcardsCount
    prevHistoryOpen.current = historyListPanelOpen
    dispatch(
      updateToolbarIcon({
        section: 'history',
        key: 'history',
        value: {
          state: historyListPanelOpen ? 'active' : 'enabled',
          options: { badge: postcardsCount > 0 ? postcardsCount : null },
        },
      }),
    )
  }, [postcardsCount, historyListPanelOpen, dispatch])

  return null
}
