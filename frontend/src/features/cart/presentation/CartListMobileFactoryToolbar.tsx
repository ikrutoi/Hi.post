import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { buildNotebookCartTabCommandsMobile } from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { CART_LIST_TOOLBAR } from '@toolbar/domain/types/cartList.types'
import { getToolbarIcon } from '@shared/utils/icons'
import { CartHeaderSegments } from './CartHeaderSegments'
import {
  selectCartItems,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import type { PostcardHydrated } from '@entities/postcard'
import type { CartListStatusSegment } from '@cart/domain/types'
import styles from './CartListMobileFactoryToolbar.module.scss'

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

/** Mobile factory: верхний ряд — calendar слева, сегменты по центру. */
export const CartListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  const openCartCalendar = useCallback(() => {
    for (const command of buildNotebookCartTabCommandsMobile()) {
      dispatch(command)
    }
  }, [dispatch])

  return (
    <div className={styles.upperRow}>
      <div className={styles.sideLeft}>
        <button
          type="button"
          className={styles.calendarIcon}
          aria-label="Open cart calendar"
          onClick={openCartCalendar}
        >
          {getToolbarIcon({ key: 'calendarReturn' })}
        </button>
      </div>
      <div className={styles.upperSegments}>
        <CartHeaderSegments factoryToolbar />
      </div>
    </div>
  )
}
