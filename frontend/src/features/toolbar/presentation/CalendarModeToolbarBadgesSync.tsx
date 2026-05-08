import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCartCount,
  selectCartItems,
  selectCartListPanelOpen,
} from '@cart/infrastructure/selectors'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'

/**
 * Syncs badges for calendar mode toolbars:
 * - cart toolbar: cart postcards count
 * - history toolbar: total postcards count
 */
export const CalendarModeToolbarBadgesSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector(selectCartCount)
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const postcardsCount = useAppSelector(selectCartItems).length
  const prevCartCount = useRef<number | undefined>(undefined)
  const prevCartOpen = useRef<boolean | undefined>(undefined)
  const prevPostcardsCount = useRef<number | undefined>(undefined)
  const prevHistoryOpen = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    if (
      prevCartCount.current === cartCount &&
      prevCartOpen.current === cartListPanelOpen
    ) {
      return
    }
    prevCartCount.current = cartCount
    prevCartOpen.current = cartListPanelOpen
    dispatch(
      updateToolbarIcon({
        section: 'cart',
        key: 'cart',
        value: {
          state: cartListPanelOpen ? 'active' : 'enabled',
          options: { badge: cartCount > 0 ? cartCount : null },
        },
      }),
    )
  }, [cartCount, cartListPanelOpen, dispatch])

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
