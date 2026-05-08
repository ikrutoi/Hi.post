import React, { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'

/**
 * Keeps the right-sidebar `history` badge in sync with total postcards count.
 */
export const RightSidebarHistoryBadgeSync: React.FC = () => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const currentDate = getCurrentDate()
  const postcardsCount = cartItems.filter((item) => {
    if (item.status === 'cartBlocked') return false
    if (item.status !== 'cart') return true
    return !isDispatchDateDisabledForOrder(item.date, currentDate)
  }).length
  const prevCount = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (prevCount.current === postcardsCount) return
    prevCount.current = postcardsCount
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'history',
        value: {
          options: { badge: postcardsCount > 0 ? postcardsCount : null },
        },
      }),
    )
  }, [postcardsCount, dispatch])

  return null
}
