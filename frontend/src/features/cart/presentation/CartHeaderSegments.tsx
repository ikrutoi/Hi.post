import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectCartItems,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import {
  setCartListStatusSegment,
} from '@cart/infrastructure/state'
import { setCartCalendarDatePickMode } from '@date/calendar/infrastructure/state'
import styles from './CartListPanel.module.scss'

export const CartHeaderSegments: React.FC<{
  factoryToolbar?: boolean
}> = ({ factoryToolbar = false }) => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const listSegment = useAppSelector(selectCartListStatusSegment)

  const handleSelectCartSegment = useCallback(() => {
    if (listSegment === 'cartBlocked') {
      dispatch(setCartCalendarDatePickMode(false))
    }
    dispatch(setCartListStatusSegment('cart'))
  }, [dispatch, listSegment])

  const cartSegmentCounts = useMemo(() => {
    const cart = cartItems.filter((p) => p.status === 'cart').length
    const cartBlocked = cartItems.filter(
      (p) => p.status === 'cartBlocked',
    ).length
    return { cart, cartBlocked }
  }, [cartItems])

  return (
    <div
      className={clsx(
        styles.cartHeaderSegments,
        factoryToolbar && styles.cartHeaderSegmentsFactoryToolbar,
      )}
      role="group"
      aria-label="Cart list header actions"
    >
      <button
        type="button"
        className={clsx(styles.cartHeaderSegmentButton, styles.cart)}
        aria-label={
          cartSegmentCounts.cart > 0
            ? `Cart, ${cartSegmentCounts.cart} postcards`
            : 'Cart'
        }
        aria-pressed={listSegment === 'cart'}
        onClick={handleSelectCartSegment}
      />
      {cartSegmentCounts.cart > 0 ? (
        <span
          className={clsx(
            styles.cartHeaderSegmentCount,
            styles.cartHeaderSegmentCountCart,
          )}
          aria-hidden
        >
          {cartSegmentCounts.cart}
        </span>
      ) : null}
      <button
        type="button"
        className={clsx(styles.cartHeaderSegmentButton, styles.cartBlocked)}
        aria-label={
          cartSegmentCounts.cartBlocked > 0
            ? `Cart blocked, ${cartSegmentCounts.cartBlocked} postcards`
            : 'Cart blocked'
        }
        aria-pressed={listSegment === 'cartBlocked'}
        onClick={() => dispatch(setCartListStatusSegment('cartBlocked'))}
      />
      {cartSegmentCounts.cartBlocked > 0 ? (
        <span
          className={clsx(
            styles.cartHeaderSegmentCount,
            styles.cartHeaderSegmentCountBlocked,
          )}
          aria-hidden
        >
          {cartSegmentCounts.cartBlocked}
        </span>
      ) : null}
    </div>
  )
}
