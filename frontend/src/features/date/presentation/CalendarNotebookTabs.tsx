import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch } from '@app/hooks'
import { setCartListPanelOpen } from '@cart/infrastructure/state'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
import {
  closeDayPanel,
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

  const goDate = useCallback(() => {
    dispatch(setHistoryListPanelOpen(false))
    dispatch(closeDayPanel())
    dispatch(
      updateToolbarIcon({
        section: 'history',
        key: 'listHistory',
        value: 'enabled',
      }),
    )
    dispatch(setCartListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'rightSidebar',
        key: 'cart',
        value: 'enabled',
      }),
    )
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
    dispatch(setActiveSection('history'))
  }, [dispatch])

  return (
    <div className={styles.track}>
      <ul className={styles.list} role="tablist" aria-label="Calendar strip mode">
        <li
          role="tab"
          aria-selected={section === 'date'}
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab1,
            section === 'date' && styles.tabActive,
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
          aria-selected={section === 'cart'}
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab2,
            section === 'cart' && styles.tabActive,
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
          aria-selected={section === 'history'}
          tabIndex={0}
          className={clsx(
            styles.tab,
            styles.tab3,
            section === 'history' && styles.tabActive,
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
