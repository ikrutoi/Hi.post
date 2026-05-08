import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCartCount, selectCartItems } from '@cart/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'

/**
 * Syncs badges for calendar mode toolbars:
 * - cart toolbar: cart postcards count
 * - history toolbar: total postcards count
 */
export const CalendarModeToolbarBadgesSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const cartCount = useAppSelector(selectCartCount)
  const postcardsCount = useAppSelector(selectCartItems).length
  const prevCartCount = useRef<number | undefined>(undefined)
  const prevPostcardsCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prevCartCount.current === cartCount) return
    prevCartCount.current = cartCount
    dispatch(
      updateToolbarIcon({
        section: 'cart',
        key: 'cart',
        value: {
          options: { badge: cartCount > 0 ? cartCount : null },
        },
      }),
    )
  }, [cartCount, dispatch])

  useEffect(() => {
    if (prevPostcardsCount.current === postcardsCount) return
    prevPostcardsCount.current = postcardsCount
    dispatch(
      updateToolbarIcon({
        section: 'history',
        key: 'history',
        value: {
          options: { badge: postcardsCount > 0 ? postcardsCount : null },
        },
      }),
    )
  }, [postcardsCount, dispatch])

  return null
}
