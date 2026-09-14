import React, { useCallback, useMemo, useRef } from 'react'
import clsx from 'clsx'
import { IconDateNext } from '@shared/ui/icons'
import { useAppSelector } from '@app/hooks'
import { useCalendarFacade } from '@date/calendar/application/facades'
import { selectDraftDispatchDates, selectMergedDispatchDates } from '@date/infrastructure/selectors'
import {
  nextUniqueSelectedCalendarMonth,
  uniqueSelectedCalendarMonths,
} from '@date/application/helpers/selectedDatesMonthCycle'
import { getCurrentDate } from '@shared/utils/date'
import type { CalendarViewDate } from '@entities/date/domain/types'
import toolbarStyles from '@toolbar/presentation/Toolbar.module.scss'
import styles from './AddressNextCycleButton.module.scss'

type DateNextCycleButtonProps = {
  count: number
}

export const DateNextCycleButton: React.FC<DateNextCycleButtonProps> = ({
  count,
}) => {
  const lastFireAtRef = useRef(0)
  const { lastViewedCalendarDate, setCalendarViewDate } = useCalendarFacade()
  const draftDispatchDates = useAppSelector(selectDraftDispatchDates)
  const appliedDispatchDates = useAppSelector(selectMergedDispatchDates)
  const cycleDates =
    draftDispatchDates.length > 1 ? draftDispatchDates : appliedDispatchDates
  const currentDate = useMemo(() => getCurrentDate(), [])
  const fallbackView = useMemo<CalendarViewDate>(
    () => ({ year: currentDate.year, month: currentDate.month }),
    [currentDate.year, currentDate.month],
  )
  const calendarViewDate = lastViewedCalendarDate ?? fallbackView
  const selectedMonths = useMemo(
    () => uniqueSelectedCalendarMonths(cycleDates),
    [cycleDates],
  )

  const fire = useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault()
      event.stopPropagation()
      const now = Date.now()
      if (now - lastFireAtRef.current < 280) return
      lastFireAtRef.current = now
      const next = nextUniqueSelectedCalendarMonth(
        selectedMonths,
        calendarViewDate,
      )
      if (next == null) return
      if (
        next.year === calendarViewDate.year &&
        next.month === calendarViewDate.month
      ) {
        return
      }
      setCalendarViewDate(next)
    },
    [calendarViewDate, selectedMonths, setCalendarViewDate],
  )

  return (
    <div className={clsx(toolbarStyles.toolbar, styles.wrap)}>
      <button
        type="button"
        className={clsx(
          toolbarStyles.toolbarKey,
          toolbarStyles.toolbarKeyEnabled,
        )}
        data-icon-key="dateNext"
        aria-label="Next selected send day"
        onPointerDown={fire}
        onClick={fire}
      >
        <IconDateNext aria-hidden />
        {count > 1 ? (
          <span className={styles.badge} aria-hidden>
            {count}
          </span>
        ) : null}
      </button>
    </div>
  )
}
