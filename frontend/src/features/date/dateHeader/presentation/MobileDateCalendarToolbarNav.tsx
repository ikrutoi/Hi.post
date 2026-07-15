import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCalendarFacade } from '@date/calendar/application/facades'
import { selectNotebookStripTab } from '@date/calendar/infrastructure/selectors'
import { setCartCalendarDatePickMode } from '@date/calendar/infrastructure/state'
import {
  buildMobileCartSlotOpenCommands,
  buildMobileHistorySlotOpenCommands,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { useInitializeCalendarViewDate } from '@date/application/hooks/useInitializeCalendarViewDate'
import { useDateSwitcherController } from '@date/switcher/application/hooks/useDateSwitcherController'
import { useFlashEffect } from '@shared/hooks'
import { getCurrentDate } from '@shared/utils/date'
import { getToolbarIcon } from '@shared/utils/icons'
import { DateHeaderNavigation } from './DateHeaderNavigation'
import headerStyles from './DateHeader.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'
import styles from './MobileDateCalendarToolbarNav.module.scss'

export const MobileDateCalendarToolbarNav: React.FC = () => {
  const dispatch = useAppDispatch()
  const { triggerFlash } = useFlashEffect()
  const { lastViewedCalendarDate } = useCalendarFacade()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const currentDate = useMemo(() => getCurrentDate(), [])
  const fallbackCalendarViewDate = useMemo<CalendarViewDate>(
    () => ({ year: currentDate.year, month: currentDate.month }),
    [currentDate.year, currentDate.month],
  )
  const calendarViewDate = lastViewedCalendarDate ?? fallbackCalendarViewDate
  const {
    actions: { handleDecrementArrow, handleIncrementArrow, goToTodayDate },
    derived: { isCurrentMonth },
  } = useDateSwitcherController({ triggerFlash })

  useInitializeCalendarViewDate()

  const openModeList = useCallback(() => {
    dispatch(setCartCalendarDatePickMode(false))
    const commands =
      notebookStripTab === 'cart'
        ? buildMobileCartSlotOpenCommands()
        : notebookStripTab === 'history'
          ? buildMobileHistorySlotOpenCommands()
          : []
    for (const command of commands) {
      dispatch(command)
    }
  }, [dispatch, notebookStripTab])

  const onCurrentMonth = isCurrentMonth()

  const modeIcon =
    notebookStripTab === 'cart' ? (
      <button
        type="button"
        className={styles.modeIcon}
        aria-label="Open cart list"
        onClick={openModeList}
      >
        {getToolbarIcon({ key: 'cart' })}
      </button>
    ) : notebookStripTab === 'history' ? (
      <button
        type="button"
        className={styles.modeIcon}
        aria-label="Open history list"
        onClick={openModeList}
      >
        {getToolbarIcon({ key: 'historyV2' })}
      </button>
    ) : null

  return (
    <div className={styles.root}>
      <div className={styles.sideLeft}>{modeIcon}</div>
      <div className={styles.center}>
        <DateHeaderNavigation
          className={headerStyles.headerCenterToolbarSwitcherOnly}
          switcherVariant="toolbar"
          calendarViewDate={calendarViewDate}
          onDecrement={handleDecrementArrow}
          onIncrement={handleIncrementArrow}
          showArrows={false}
        />
      </div>
      <div className={styles.sideRight}>
        <button
          type="button"
          className={styles.modeIcon}
          aria-label="Go to current month"
          disabled={onCurrentMonth}
          onClick={goToTodayDate}
        >
          {getToolbarIcon({ key: 'calendarReturn' })}
        </button>
      </div>
    </div>
  )
}
