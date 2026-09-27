import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { selectCartListPanelOpen } from '@cart/infrastructure/selectors'
import { buildNotebookCartTabCommandsMobile } from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { cartListBillableLocalIds } from '@cart/application/logic/cartListBillableLocalIds'
import { cartListToolbarGroups } from '@cart/application/logic/cartListToolbarGroups'
import { selectCartListCheckedLocalIds } from '@cart/infrastructure/selectors'
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
  const checkedLocalIds = useAppSelector(selectCartListCheckedLocalIds)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileCartListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    cartListPanelOpen &&
    showMobileCartListFactoryChrome

  const hasRows = cartHasVisibleRows(cartItems, listSegment)

  const cartListToolbarGroupsOverride = useMemo(() => {
    const billable = new Set(cartListBillableLocalIds(cartItems))
    const checkedCount = checkedLocalIds.filter((id) => billable.has(id)).length
    return cartListToolbarGroups({
      listSegment,
      checkedCount,
      hasRows,
    })
  }, [cartItems, checkedLocalIds, hasRows, listSegment])

  const content = useMemo(() => {
    if (!enabled) return null
    return (
      <div className={styles.cartListToolbarRow} data-cart-list-toolbar>
        {hasRows ? (
          <Toolbar
            section="cartList"
            groupsOverride={cartListToolbarGroupsOverride}
            justifyGroupsEnd={listSegment === 'cartBlocked'}
          />
        ) : null}
      </div>
    )
  }, [enabled, hasRows, cartListToolbarGroupsOverride, listSegment])

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
          {getToolbarIcon({ key: 'date' })}
        </button>
      </div>
      <div className={styles.upperSegments}>
        <CartHeaderSegments factoryToolbar />
      </div>
    </div>
  )
}
