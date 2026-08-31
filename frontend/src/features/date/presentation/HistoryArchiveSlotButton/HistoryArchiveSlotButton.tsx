import React, { useCallback } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { selectActiveSection } from '@entities/sectionEditorMenu/infrastructure/selectors'
import {
  selectIsHistoryListPanelOpen,
  selectLastHistoryArchiveView,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import {
  buildHistoryArchiveToggleCommands,
  resolveHistoryArchiveViewMode,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { useMobileArchiveSlotSecondClickHint } from '@layout/application/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { toolbarAction } from '@toolbar/application/helpers'
import { IconHistoryV2, IconSectionMenuDate } from '@shared/ui/icons'
import { store } from '@app/state/store'
import styles from './HistoryArchiveSlotButton.module.scss'

type HistoryArchiveSlotButtonProps = {
  layout: 'pieSlot' | 'sidebar'
  /** Keep pressed while a history postcard is pinned in the right pie. */
  pinned?: boolean
  archiveSectionPeekActive?: boolean
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const HistoryArchiveSlotButton: React.FC<
  HistoryArchiveSlotButtonProps
> = ({ layout, pinned = false, archiveSectionPeekActive = false, onClick }) => {
  const dispatch = useAppDispatch()
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const activeSection = useAppSelector(selectActiveSection)

  const historyStripActive =
    pinned || historyListPanelOpen || notebookStripTab === 'history'

  const historyArchiveViewMode = resolveHistoryArchiveViewMode({
    historyListPanelOpen,
    notebookStripTab,
    activeSection,
    archiveSectionPeekActive,
  })

  const showModeIcon = layout === 'pieSlot'
  const showHistoryIcon =
    showModeIcon &&
    historyStripActive &&
    historyArchiveViewMode === 'calendar'
  const showDateIcon =
    showModeIcon && historyStripActive && historyArchiveViewMode === 'list'
  const modeIconVisible = showHistoryIcon || showDateIcon
  const secondClickHint = useMobileArchiveSlotSecondClickHint(modeIconVisible)

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      secondClickHint.onUserClick()
      if (onClick) {
        onClick(event)
        return
      }
      event.stopPropagation()
      if (layout === 'sidebar' && !isMobileLayout) {
        dispatch(
          toolbarAction({ section: 'rightSidebar', key: 'history' }),
        )
        return
      }
      const state = store.getState()
      for (const command of buildHistoryArchiveToggleCommands({
        historyListPanelOpen: selectIsHistoryListPanelOpen(state),
        notebookStripTab: selectNotebookStripTab(state),
        activeSection: selectActiveSection(state),
        isMobileLayout,
        lastActiveView: selectLastHistoryArchiveView(state),
      })) {
        dispatch(command)
      }
    },
    [
      dispatch,
      isMobileLayout,
      layout,
      onClick,
      secondClickHint,
    ],
  )

  return (
    <button
      type="button"
      className={clsx(
        styles.button,
        layout === 'pieSlot' ? styles.pieSlot : styles.sidebar,
      )}
      aria-label="History postcards"
      aria-pressed={historyStripActive}
      onClick={handleClick}
    >
      {modeIconVisible ? (
        <span
          className={clsx(
            styles.indicator,
            secondClickHint.pulsing && styles.indicatorHint,
          )}
          aria-hidden
          onAnimationEnd={secondClickHint.onPulseEnd}
        >
          {showDateIcon ? <IconSectionMenuDate /> : <IconHistoryV2 />}
        </span>
      ) : null}
    </button>
  )
}
