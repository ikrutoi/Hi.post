import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectCardPieCopyStripExpanded } from '@cart/infrastructure/selectors'
import {
  setCartListPanelOpen,
  setCartListSelectedLocalId,
} from '@cart/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
  setCardPieListPanelOpen,
  setHistoryListSelectedLocalId,
  setNotebookStripTab,
  setHistoryListPanelOpen,
} from '@date/calendar/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import type { CardSection } from '@shared/config/constants'
import styles from './CalendarNotebookTabs.module.scss'
import type { DateStripSection } from './dateStripSection.types'

/** Закладки гасим только на секциях карточки; «Дата» и «История» в сайдбаре оставляют полоску в рабочем режиме (в т.ч. после клика по 3-й закладке). */
const STRIP_TABS_DIM_FOR_SIDEBAR_SECTIONS = new Set<CardSection>([
  'cardphoto',
  'cardtext',
  'envelope',
  'aroma',
])

type Props = {
  /** Какой режим полосы календаря активен — соответствующая закладка выше на 50%. */
  section: DateStripSection
}

/**
 * Закладки: слева Date, центр Cart, справа History — клик переключает режим календаря.
 */
export const CalendarNotebookTabs: React.FC<Props> = ({ section }) => {
  const dispatch = useAppDispatch()
  const cardPieCopyStripExpanded = useAppSelector(selectCardPieCopyStripExpanded)
  const factorySidebarSection = useAppSelector(selectActiveSection)
  /**
   * На секциях карточки закладки обычно без активной высоты.
   * Исключение: если активен режим корзины или истории, оставляем соответствующую
   * закладку поднятой при просмотре секций открытки из правого CardPie.
   */
  const stripTabsInactive =
    factorySidebarSection != null &&
    STRIP_TABS_DIM_FOR_SIDEBAR_SECTIONS.has(factorySidebarSection) &&
    section !== 'cart' &&
    section !== 'history'

  const goDate = useCallback(() => {
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

  if (cardPieCopyStripExpanded) {
    return null
  }

  const tab1Active = !stripTabsInactive && section === 'date'
  const tab2Active = !stripTabsInactive && section === 'cart'
  const tab3Active = !stripTabsInactive && section === 'history'

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
