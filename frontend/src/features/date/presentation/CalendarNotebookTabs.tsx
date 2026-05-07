import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
} from '@cart/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
  setCardPieListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripDateOverCart,
  setNotebookStripTab,
  setHistoryListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import styles from './CalendarNotebookTabs.module.scss'
import type { DateStripSection } from './dateStripSection.types'

type Props = {
  /** Какой режим полосы календаря активен — соответствующая закладка выше на 50%. */
  section: DateStripSection
}

/**
 * Закладки: слева Date, центр Cart, справа History — клик переключает режим календаря.
 */
export const CalendarNotebookTabs: React.FC<Props> = ({ section }) => {
  const dispatch = useAppDispatch()
  const { activePieSide } = useRightListArchiveMini()
  const factorySidebarSection = useAppSelector(selectActiveSection)
  /**
   * Левый режим + секции не календарной полосы — без общей подсветки.
   * Если полоса уже «Корзина» или «История» (клик по сектору правого CardPie при списке),
   * подсвечиваем соответствующую закладку.
   */
  const stripTabsNoneActive =
    activePieSide === 'left' &&
    factorySidebarSection !== 'date' &&
    factorySidebarSection !== 'history' &&
    section !== 'cart' &&
    section !== 'history'

  const goDate = useCallback(() => {
    dispatch(setNotebookStripDateOverCart(true))
    dispatch(setCartListSelectedLocalId(null))
    dispatch(setHistoryListSelectedLocalId(null))
    dispatch(closeDayPanel())
    dispatch(setCardPieListPanelOpen(true))
    dispatch(setNotebookStripTab('date'))
    dispatch(setActiveSection('date'))
  }, [dispatch])

  const goCart = useCallback(() => {
    dispatch(setHistoryListPanelOpen(false))
    dispatch(closeDayPanel())
    dispatch(
      updateToolbarIcon({
        section: 'history',
        key: 'listHistory',
        value: 'enabled',
      }),
    )
    dispatch(setCartListPanelOpen(true))
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: 'active',
      }),
    )
    dispatch(setNotebookStripTab('cart'))
    dispatch(setActiveSection('date'))
  }, [dispatch])

  const goHistory = useCallback(() => {
    dispatch(setCartListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: 'enabled',
      }),
    )
    dispatch(setNotebookStripTab('history'))
    dispatch(setActiveSection('history'))
  }, [dispatch])

  const tab1Active = !stripTabsNoneActive && section === 'date'
  const tab2Active = !stripTabsNoneActive && section === 'cart'
  const tab3Active = !stripTabsNoneActive && section === 'history'

  return (
    <div className={styles.track}>
      <ul className={styles.list} role="tablist" aria-label="Calendar strip mode">
        <li
          role="tab"
          aria-selected={tab1Active}
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab1,
            tab1Active && styles.tabActive,
          )}
          onClick={goDate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              goDate()
            }
          }}
        />
        <li
          role="tab"
          aria-selected={tab2Active}
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab2,
            tab2Active && styles.tabActive,
          )}
          onClick={goCart}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              goCart()
            }
          }}
        />
        <li
          role="tab"
          aria-selected={tab3Active}
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab3,
            tab3Active && styles.tabActive,
          )}
          onClick={goHistory}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              goHistory()
            }
          }}
        />
      </ul>
    </div>
  )
}
