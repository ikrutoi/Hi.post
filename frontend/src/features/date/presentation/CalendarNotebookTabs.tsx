import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  notebookTabCartClicked,
  notebookTabHistoryClicked,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
import styles from './CalendarNotebookTabs.module.scss'
import type { DateStripSection } from './dateStripSection.types'

type Props = {
  /** Какой режим полосы календаря активен — соответствующая закладка выше на 50%. */
  section: DateStripSection
  /** peek: над секцией, растут вверх; header: в шапке, растут вниз. */
  variant?: 'peek' | 'header'
  /** Ни одна закладка не подсвечена (мобильные списки корзины/истории у CardPie). */
  suppressTabHighlight?: boolean
}

/**
 * Закладки над секцией: календарь корзины и истории.
 * Календарь сборки включается секцией Date в сайдбаре, не закладкой.
 */
export const CalendarNotebookTabs: React.FC<Props> = ({
  section,
  variant = 'peek',
  suppressTabHighlight = false,
}) => {
  const dispatch = useAppDispatch()
  const { activePieSide } = useRightListArchiveMini()
  const factorySidebarSection = useAppSelector(selectActiveSection)
  /**
   * Левый режим + секции не календарной полосы — без общей подсветки.
   * Если полоса уже «Корзина» или «История» (клик по сектору правого CardPie при списке),
   * подсвечиваем соответствующую закладку.
   */
  const stripTabsNoneActive =
    suppressTabHighlight ||
    (activePieSide === 'left' &&
      factorySidebarSection !== 'date' &&
      factorySidebarSection !== 'history' &&
      section !== 'cart' &&
      section !== 'history' &&
      section !== 'cartdate')

  const goCart = useCallback(() => {
    dispatch(notebookTabCartClicked())
  }, [dispatch])

  const goHistory = useCallback(() => {
    dispatch(notebookTabHistoryClicked())
  }, [dispatch])

  /**
   * `cartdate`: chrome календаря как date, но закладка Cart остаётся active —
   * режим принадлежит корзине, не сборке.
   */
  const tab2Active =
    !stripTabsNoneActive &&
    (section === 'cart' || section === 'cartdate')
  const tab3Active = !stripTabsNoneActive && section === 'history'

  return (
    <div
      className={clsx(styles.track, variant === 'header' && styles.trackHeader)}
    >
      <ul
        className={clsx(styles.list, variant === 'header' && styles.listHeader)}
        role="tablist"
        aria-label="Cart and history calendar"
      >
        <li
          role="tab"
          aria-selected={tab2Active}
          aria-label="Cart"
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab2,
            variant === 'header' && styles.tabHeader,
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
          aria-label="History"
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab3,
            variant === 'header' && styles.tabHeader,
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
