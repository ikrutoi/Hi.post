import React, { useCallback, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CalendarWeekdayHeader } from './CalendarWeekdayHeader/CalendarWeekdayHeader'
import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@entities/date/constants'
import { closeDayPanel, openDayPanel, EMPTY_DAY_DATA } from '../infrastructure/state/calendar.slice'
import { useCalendarConstruction } from '../application/hooks'
import styles from './Calendar.module.scss'
import type {
  DispatchDate,
  SelectedDispatchDate,
  CalendarViewDate,
  DaysOfWeek,
  Switcher,
} from '@entities/date/domain/types'

interface CalendarProps {
  selectedDate: SelectedDispatchDate
  calendarViewDate: CalendarViewDate
  chooseDate: (date: DispatchDate) => void
  triggerFlash: (part: Switcher) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  calendarViewDate,
  chooseDate,
  triggerFlash,
}) => {
  const [firstDayOfWeek, setFirstDayOfWeek] = useState<'Sun' | 'Mon'>('Sun')
  const [daysOfWeek, setDaysOfWeek] = useState<DaysOfWeek[]>(
    daysOfWeekStartFromSun,
  )

  // const { sizeItemCalendar } = useSizeFacade()

  const dispatch = useAppDispatch()
  const openDayPanelState = useAppSelector((state) => state.calendar.openDayPanel)

  const handleFirstDay = (firstDay: 'Sun' | 'Mon') => {
    setFirstDayOfWeek(firstDay)
    setDaysOfWeek(
      firstDay === 'Sun' ? daysOfWeekStartFromSun : daysOfWeekStartFromMon,
    )
  }

  const handleWeekdayClick = useCallback(
    (weekday: DaysOfWeek) => {
      if (openDayPanelState?.openedByWeekday === weekday) {
        dispatch(closeDayPanel())
      } else {
        dispatch(
          openDayPanel({
            dateKey: 'preview',
            dayData: EMPTY_DAY_DATA,
            openedByWeekday: weekday,
          }),
        )
      }
    },
    [dispatch, openDayPanelState?.openedByWeekday],
  )

  const calendarCells = useCalendarConstruction({
    selectedDate,
    firstDayOfWeek,
    calendarViewDate,
    chooseDate,
    triggerFlash,
    // handleClickCell,
  })

  return (
    <div className={styles.calendar}>
      <CalendarWeekdayHeader
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeek}
        handleFirstDay={handleFirstDay}
        onWeekdayClick={handleWeekdayClick}
      />
      {/* <div className={styles.calendarMonth}> */}
      <div className={styles.calendarDays}>{calendarCells}</div>
      {/* </div> */}
    </div>
  )
}
