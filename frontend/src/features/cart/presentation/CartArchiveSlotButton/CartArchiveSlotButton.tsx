import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import {
  selectActiveCartPostcardCount,
  selectBlockedCartPostcardCount,
  selectCartListPanelOpen,
} from '@cart/infrastructure/selectors'
import { isCartOwnedNotebookStrip } from '@date/calendar/application/logic/calendarStripSection'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { toolbarAction } from '@toolbar/application/helpers'
import styles from './CartArchiveSlotButton.module.scss'

type CartArchiveSlotButtonProps = {
  layout: 'sidebar'
  /** Keep pressed while a cart postcard is pinned in the right pie. */
  pinned?: boolean
}

export const CartArchiveSlotButton: React.FC<CartArchiveSlotButtonProps> = ({
  layout,
  pinned = false,
}) => {
  const dispatch = useAppDispatch()
  const cartListPanelOpen = useAppSelector(selectCartListPanelOpen)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const activeCartPostcardCount = useAppSelector(selectActiveCartPostcardCount)
  const blockedCartPostcardCount = useAppSelector(
    selectBlockedCartPostcardCount,
  )

  const cartStripActive =
    pinned || cartListPanelOpen || isCartOwnedNotebookStrip(notebookStripTab)

  const visualMode = useMemo(() => {
    if (activeCartPostcardCount > 0 && blockedCartPostcardCount > 0) {
      return 'mixed' as const
    }
    if (activeCartPostcardCount === 0 && blockedCartPostcardCount > 0) {
      return 'blockedOnly' as const
    }
    return 'activeOnly' as const
  }, [activeCartPostcardCount, blockedCartPostcardCount])

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation()
      dispatch(toolbarAction({ section: 'rightSidebar', key: 'cart' }))
    },
    [dispatch],
  )

  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        layout === 'sidebar' && styles.sidebar,
        visualMode === 'activeOnly' && styles.modeActiveOnly,
        visualMode === 'mixed' && styles.modeMixed,
        visualMode === 'blockedOnly' && styles.modeBlockedOnly,
      )}
      aria-label="Cart postcards"
      aria-pressed={cartStripActive}
      onClick={handleClick}
    >
      <span className={clsx(styles.half, styles.halfActive)} />
      <span className={clsx(styles.half, styles.halfBlocked)} />
      {activeCartPostcardCount > 0 ? (
        <span className={clsx(styles.count, styles.countActive)} aria-hidden>
          {activeCartPostcardCount}
        </span>
      ) : null}
      {blockedCartPostcardCount > 0 ? (
        <span className={clsx(styles.count, styles.countBlocked)} aria-hidden>
          {blockedCartPostcardCount}
        </span>
      ) : null}
    </button>
  )
}
