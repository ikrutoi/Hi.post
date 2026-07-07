import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { CART_LIST_TOOLBAR } from '@toolbar/domain/types/cartList.types'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { CartHeaderSegments } from './CartHeaderSegments'
import {
  selectCartItems,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import type { PostcardHydrated } from '@entities/postcard'
import type { CartListStatusSegment } from '@cart/domain/types'
import styles from './CartListMobileFactoryToolbar.module.scss'

const CART_LIST_FACTORY_UPPER_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

function cartHasVisibleRows(
  cartItems: PostcardHydrated[],
  listSegment: CartListStatusSegment,
): boolean {
  return cartItems.some((p) => p.status === listSegment)
}

/** Mobile factory: нижний ряд — cartList toolbar в общем shell. */
export const CartListMobileFactoryLowerToolbar: React.FC = () => {
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const cartItems = useAppSelector(selectCartItems)
  const listSegment = useAppSelector(selectCartListStatusSegment)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCartListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    cartListPanelOpen &&
    showMobileCartListFactoryChrome

  const hasRows = cartHasVisibleRows(cartItems, listSegment)

  const cartListToolbarGroupsOverride = useMemo(() => {
    if (listSegment !== 'cartBlocked') return undefined
    return CART_LIST_TOOLBAR.filter((group) => group.group !== 'cartList')
  }, [listSegment])

  const content = useMemo(
    () =>
      enabled && hasRows ? (
        <Toolbar
          section="cartList"
          groupsOverride={cartListToolbarGroupsOverride}
          justifyGroupsEnd={cartListToolbarGroupsOverride != null}
        />
      ) : null,
    [enabled, hasRows, cartListToolbarGroupsOverride],
  )

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — сегменты по центру, return справа. */
export const CartListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  const closeList = useCallback(() => {
    dispatch(setCartListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'cart',
        key: 'cart',
        value: 'enabled',
      }),
    )
  }, [dispatch])

  const handleAction = useCallback(
    (key: IconKey) => {
      if (key !== 'return') return
      closeList()
      return false
    },
    [closeList],
  )

  return (
    <div className={styles.upperRow}>
      <div className={styles.upperSegments}>
        <CartHeaderSegments factoryToolbar />
      </div>
      <div className={styles.upperToolbar}>
        <Toolbar
          section="cart"
          groupsOverride={CART_LIST_FACTORY_UPPER_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
