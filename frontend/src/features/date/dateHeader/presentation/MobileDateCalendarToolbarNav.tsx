import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCalendarFacade } from '@date/calendar/application/facades'
import {
  selectCartCalendarDatePickMode,
  selectCartDatePickSessionActive,
  selectNotebookStripTab,
} from '@date/calendar/infrastructure/selectors'
import { selectCanApplyDispatchDates } from '@date/infrastructure/selectors'
import { endCartCalendarDatePick } from '@date/calendar/infrastructure/state'
import { releaseCartDatePickListEntryOwnership } from '@date/calendar/application/logic/cartDatePickListEntryOwnership'
import {
  buildMobileCartSlotOpenCommands,
  buildMobileHistorySlotOpenCommands,
} from '@date/calendar/application/orchestration/notebookOrchestration.rules'
import { useInitializeCalendarViewDate } from '@date/application/hooks/useInitializeCalendarViewDate'
import { useDateSwitcherController } from '@date/switcher/application/hooks/useDateSwitcherController'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import toolbarStyles from '@toolbar/presentation/Toolbar.module.scss'
import type { ToolbarConfig } from '@toolbar/domain/types'
import { useFlashEffect } from '@shared/hooks'
import { getCurrentDate } from '@shared/utils/date'
import { getToolbarIcon } from '@shared/utils/icons'
import { DateHeaderNavigation } from './DateHeaderNavigation'
import headerStyles from './DateHeader.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'
import styles from './MobileDateCalendarToolbarNav.module.scss'

/**
 * After peek→edit the cart icon mounts under the same gesture. Swallow the
 * ghost click on that control, then arm. Safety covers delayed touch→click
 * when the ghost never hits the button (iOS ~300ms).
 */
const MODE_LIST_ICON_GESTURE_SAFETY_MS = 350

export const MobileDateCalendarToolbarNav: React.FC = () => {
  const dispatch = useAppDispatch()
  const { triggerFlash } = useFlashEffect()
  const { lastViewedCalendarDate } = useCalendarFacade()
  const notebookStripTab = useAppSelector(selectNotebookStripTab)
  const canApplyDispatchDates = useAppSelector(selectCanApplyDispatchDates)
  const cartCalendarDatePickMode = useAppSelector(selectCartCalendarDatePickMode)
  const cartDatePickSessionActive = useAppSelector(
    selectCartDatePickSessionActive,
  )
  const modeListButtonRef = useRef<HTMLButtonElement>(null)
  const [modeListIconArmed, setModeListIconArmed] = useState(true)
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

  /**
   * Only while date-pick is active (peek/list edit): the list icon replaced
   * postcardEdit. Normal cart calendar stays armed immediately.
   */
  useLayoutEffect(() => {
    const guardGhostClick =
      cartCalendarDatePickMode || cartDatePickSessionActive
    if (!guardGhostClick) {
      setModeListIconArmed(true)
      return
    }

    setModeListIconArmed(false)
    let settled = false
    let safetyTimer = 0

    const settle = () => {
      if (settled) return
      settled = true
      setModeListIconArmed(true)
      window.removeEventListener('pointerup', onPointerEnd, true)
      window.removeEventListener('pointercancel', onPointerEnd, true)
      window.removeEventListener('click', onClickCapture, true)
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
    }

    const onClickCapture = (event: MouseEvent) => {
      const node = modeListButtonRef.current
      if (
        node == null ||
        !(event.target instanceof Node) ||
        !node.contains(event.target)
      ) {
        return
      }
      event.preventDefault()
      event.stopImmediatePropagation()
      settle()
    }

    const onPointerEnd = () => {
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
      /** pointerup → click follows; keep capture listener, then safety-arm. */
      safetyTimer = window.setTimeout(settle, MODE_LIST_ICON_GESTURE_SAFETY_MS)
    }

    window.addEventListener('pointerup', onPointerEnd, true)
    window.addEventListener('pointercancel', onPointerEnd, true)
    window.addEventListener('click', onClickCapture, true)
    /**
     * Often we mount inside postcardEdit's click — pointer already up.
     * Wait for a ghost click on this button, or safety timeout.
     */
    safetyTimer = window.setTimeout(settle, MODE_LIST_ICON_GESTURE_SAFETY_MS)

    return () => {
      settled = true
      window.removeEventListener('pointerup', onPointerEnd, true)
      window.removeEventListener('pointercancel', onPointerEnd, true)
      window.removeEventListener('click', onClickCapture, true)
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
    }
  }, [cartCalendarDatePickMode, cartDatePickSessionActive])

  const openModeList = useCallback(() => {
    releaseCartDatePickListEntryOwnership()
    dispatch(endCartCalendarDatePick())
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

  const onModeListClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!modeListIconArmed) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      openModeList()
    },
    [modeListIconArmed, openModeList],
  )

  const onCurrentMonth = isCurrentMonth()

  const modeIcon =
    notebookStripTab === 'cart' || notebookStripTab === 'history' ? (
      <button
        ref={modeListButtonRef}
        type="button"
        className={styles.modeIcon}
        aria-label={
          notebookStripTab === 'cart' ? 'Open cart list' : 'Open history list'
        }
        aria-disabled={!modeListIconArmed}
        tabIndex={modeListIconArmed ? 0 : -1}
        onClick={onModeListClick}
      >
        {getToolbarIcon({
          key: notebookStripTab === 'cart' ? 'cart' : 'historyV2',
        })}
      </button>
    ) : null

  /** `unblocked` — chrome как date (Apply), контекст корзины. */
  const showDateApplyChrome =
    notebookStripTab === 'date' || notebookStripTab === 'unblocked'

  const dateApplyToolbar = useMemo((): ToolbarConfig => {
    return [
      {
        group: 'date',
        icons: [
          {
            key: 'apply',
            state: canApplyDispatchDates ? 'enabled' : 'disabled',
          },
        ],
        status: 'enabled',
      },
    ]
  }, [canApplyDispatchDates])

  return (
    <div
      className={clsx(
        styles.root,
        showDateApplyChrome && styles.rootDateTint,
        notebookStripTab === 'cart' && styles.rootCartTint,
        notebookStripTab === 'history' && styles.rootHistoryTint,
      )}
    >
      <div className={styles.sideLeft}>
        {showDateApplyChrome ? (
          <Toolbar
            section="date"
            groupsOverride={dateApplyToolbar}
            className={toolbarStyles.toolbarAromaUpperApply}
          />
        ) : (
          modeIcon
        )}
      </div>
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
