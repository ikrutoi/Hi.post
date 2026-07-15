import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { buildNotebookHistoryTabCommandsMobile } from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { HISTORY_LIST_FACTORY_LOWER_TOOLBAR } from '@toolbar/domain/types/historyList.types'
import { PostcardIndicator } from '@toolbar/presentation/PostcardIndictor'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './HistoryListMobileFactoryToolbar.module.scss'

/** Mobile factory: нижний ряд — historyList toolbar в общем shell. */
export const HistoryListMobileFactoryLowerToolbar: React.FC = () => {
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileHistoryListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    historyListPanelOpen &&
    showMobileHistoryListFactoryChrome

  const content = useMemo(
    () =>
      enabled ? (
        <Toolbar
          section="historyList"
          groupsOverride={HISTORY_LIST_FACTORY_LOWER_TOOLBAR}
        />
      ) : null,
    [enabled],
  )

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — calendar слева, индикаторы по центру. */
export const HistoryListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  const openHistoryCalendar = useCallback(() => {
    for (const command of buildNotebookHistoryTabCommandsMobile()) {
      dispatch(command)
    }
  }, [dispatch])

  return (
    <div className={styles.upperRow}>
      <div className={styles.sideLeft}>
        <button
          type="button"
          className={styles.calendarIcon}
          aria-label="Open history calendar"
          onClick={openHistoryCalendar}
        >
          {getToolbarIcon({ key: 'date' })}
        </button>
      </div>
      <div className={styles.upperIndicator}>
        <div className={styles.upperIndicatorChrome}>
          <PostcardIndicator interactive />
        </div>
      </div>
    </div>
  )
}
