import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useRightListArchiveMini } from '@cardPanel/presentation/RightListArchiveMiniContext'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  notebookTabCartClicked,
  notebookTabDateClicked,
  notebookTabHistoryClicked,
} from '@date/calendar/application/orchestration/notebookOrchestration.events'
import {
  IconCart,
  IconHistory,
  IconSectionMenuDate,
} from '@shared/ui/icons'
import styles from './CalendarNotebookTabs.module.scss'
import type { DateStripSection } from './dateStripSection.types'

type Props = {
  /** Какой режим полосы календаря активен — соответствующая закладка выше на 50%. */
  section: DateStripSection
  /** peek: над секцией, растут вверх; header: в шапке, растут вниз. */
  variant?: 'peek' | 'header'
}

/**
 * Закладки: слева Date, центр Cart, справа History — клик переключает режим календаря.
 */
export const CalendarNotebookTabs: React.FC<Props> = ({
  section,
  variant = 'peek',
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
    activePieSide === 'left' &&
    factorySidebarSection !== 'date' &&
    factorySidebarSection !== 'history' &&
    section !== 'cart' &&
    section !== 'history'

  const goDate = useCallback(() => {
    dispatch(notebookTabDateClicked())
  }, [dispatch])

  const goCart = useCallback(() => {
    dispatch(notebookTabCartClicked())
  }, [dispatch])

  const goHistory = useCallback(() => {
    dispatch(notebookTabHistoryClicked())
  }, [dispatch])

  const tab1Active = !stripTabsNoneActive && section === 'date'
  const tab2Active = !stripTabsNoneActive && section === 'cart'
  const tab3Active = !stripTabsNoneActive && section === 'history'

  return (
    <div
      className={clsx(styles.track, variant === 'header' && styles.trackHeader)}
    >
      <ul
        className={clsx(styles.list, variant === 'header' && styles.listHeader)}
        role="tablist"
        aria-label="Calendar strip mode"
      >
        <li
          role="tab"
          aria-selected={tab1Active}
          aria-label="Date"
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab1,
            variant === 'header' && styles.tabHeader,
            tab1Active && styles.tabActive,
          )}
          onClick={goDate}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              goDate()
            }
          }}
        >
          <IconSectionMenuDate className={styles.tabIcon} aria-hidden />
        </li>
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
        >
          <IconCart className={styles.tabIcon} aria-hidden />
        </li>
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
        >
          <IconHistory className={styles.tabIcon} aria-hidden />
        </li>
      </ul>
    </div>
  )
}
