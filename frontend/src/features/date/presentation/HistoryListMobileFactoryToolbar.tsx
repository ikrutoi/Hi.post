import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
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

/**
 * After peek chrome drops, this calendar control can mount under the same
 * gesture as postcardEdit. Swallow that ghost click, then arm.
 */
const CALENDAR_ICON_GESTURE_SAFETY_MS = 350

/** Mobile factory: нижний ряд — historyList toolbar в общем shell. */
export const HistoryListMobileFactoryLowerToolbar: React.FC = () => {
  const historyListPanelOpen = useAppSelector(selectIsHistoryListPanelOpen)
  const { isMobileLayout } = useSizeFacade()
  const { showMobileHistoryListFactoryChrome } = useMobileFactoryListChrome()

  const enabled =
    isMobileLayout &&
    historyListPanelOpen &&
    showMobileHistoryListFactoryChrome

  const content = useMemo(() => {
    if (!enabled) return null
    return (
      <div className={styles.historyListToolbarRow} data-history-list-toolbar>
        <Toolbar
          section="historyList"
          groupsOverride={HISTORY_LIST_FACTORY_LOWER_TOOLBAR}
        />
      </div>
    )
  }, [enabled])

  useMobileScenarioToolbar(content)

  return null
}

/** Mobile factory: верхний ряд — calendar слева, индикаторы по центру. */
export const HistoryListMobileFactoryUpperToolbar: React.FC = () => {
  const dispatch = useAppDispatch()
  const calendarButtonRef = useRef<HTMLButtonElement>(null)
  const [calendarIconArmed, setCalendarIconArmed] = useState(false)

  useLayoutEffect(() => {
    setCalendarIconArmed(false)
    let settled = false
    let safetyTimer = 0

    const settle = () => {
      if (settled) return
      settled = true
      setCalendarIconArmed(true)
      window.removeEventListener('pointerup', onPointerEnd, true)
      window.removeEventListener('pointercancel', onPointerEnd, true)
      window.removeEventListener('click', onClickCapture, true)
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
    }

    const onClickCapture = (event: MouseEvent) => {
      const node = calendarButtonRef.current
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
      safetyTimer = window.setTimeout(settle, CALENDAR_ICON_GESTURE_SAFETY_MS)
    }

    window.addEventListener('pointerup', onPointerEnd, true)
    window.addEventListener('pointercancel', onPointerEnd, true)
    window.addEventListener('click', onClickCapture, true)
    safetyTimer = window.setTimeout(settle, CALENDAR_ICON_GESTURE_SAFETY_MS)

    return () => {
      settled = true
      window.removeEventListener('pointerup', onPointerEnd, true)
      window.removeEventListener('pointercancel', onPointerEnd, true)
      window.removeEventListener('click', onClickCapture, true)
      if (safetyTimer !== 0) window.clearTimeout(safetyTimer)
    }
  }, [])

  const openHistoryCalendar = useCallback(() => {
    for (const command of buildNotebookHistoryTabCommandsMobile()) {
      dispatch(command)
    }
  }, [dispatch])

  const onCalendarClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!calendarIconArmed) {
        event.preventDefault()
        event.stopPropagation()
        return
      }
      openHistoryCalendar()
    },
    [calendarIconArmed, openHistoryCalendar],
  )

  return (
    <div className={styles.upperRow}>
      <div className={styles.sideLeft}>
        <button
          ref={calendarButtonRef}
          type="button"
          className={styles.calendarIcon}
          aria-label="Open history calendar"
          aria-disabled={!calendarIconArmed}
          tabIndex={calendarIconArmed ? 0 : -1}
          onClick={onCalendarClick}
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
