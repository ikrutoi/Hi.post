import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { useMobileFactoryListChrome } from '@features/cardSectionEditor/application/hooks/useMobileFactoryListChrome'
import { useMobileScenarioToolbar } from '@features/cardSectionEditor/presentation/MobileFactoryToolbar'
import { setHistoryListPanelOpen } from '@date/calendar/infrastructure/state'
import { selectIsHistoryListPanelOpen } from '@date/calendar/infrastructure/selectors'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { HISTORY_LIST_FACTORY_LOWER_TOOLBAR } from '@toolbar/domain/types/historyList.types'
import { PostcardIndicator } from '@toolbar/presentation/PostcardIndictor'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import type { IconKey } from '@shared/config/constants'
import type { ToolbarConfig } from '@toolbar/domain/types'
import styles from './HistoryListMobileFactoryToolbar.module.scss'

const HISTORY_LIST_FACTORY_UPPER_TOOLBAR: ToolbarConfig = [
  {
    group: 'close',
    icons: [{ key: 'return', state: 'enabled' }],
    status: 'enabled',
  },
]

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

/** Mobile factory: верхний ряд — индикаторы по центру, return справа. */
export const HistoryListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()

  const closeList = useCallback(() => {
    dispatch(setHistoryListPanelOpen(false))
    dispatch(
      updateToolbarIcon({
        section: 'history',
        key: 'listHistory',
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
      <div className={styles.upperIndicator}>
        <div className={styles.upperIndicatorChrome}>
          <PostcardIndicator interactive />
        </div>
      </div>
      <div className={styles.upperToolbar}>
        <Toolbar
          section="history"
          groupsOverride={HISTORY_LIST_FACTORY_UPPER_TOOLBAR}
          onActionClick={handleAction}
        />
      </div>
    </div>
  )
}
