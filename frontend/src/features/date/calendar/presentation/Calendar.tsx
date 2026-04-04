import React, { useCallback, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { CalendarWeekdayHeader } from './CalendarWeekdayHeader/CalendarWeekdayHeader'
import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@entities/date/constants'
import { setFirstDayOfWeek } from '@date/infrastructure/state'
import { selectFirstDayOfWeek } from '@date/infrastructure/selectors'
import { closeDayPanel } from '../infrastructure/state/calendar.slice'
import { useCalendarConstruction } from '../application/hooks'
import styles from './Calendar.module.scss'
import type {
  DispatchDate,
  CalendarViewDate,
  DaysOfWeek,
  Switcher,
} from '@entities/date/domain/types'

interface CalendarProps {
  calendarViewDate: CalendarViewDate
  chooseDate: (date: DispatchDate) => void
  triggerFlash: (part: Switcher) => void
}

export const Calendar: React.FC<CalendarProps> = ({
  calendarViewDate,
  chooseDate,
  triggerFlash,
}) => {
  const dispatch = useAppDispatch()
  const firstDayOfWeek = useAppSelector(selectFirstDayOfWeek)
  const daysOfWeek = useMemo<DaysOfWeek[]>(
    () =>
      firstDayOfWeek === 'Sun'
        ? daysOfWeekStartFromSun
        : daysOfWeekStartFromMon,
    [firstDayOfWeek],
  )
  const openDayPanelState = useAppSelector((state) => state.calendar.openDayPanel)

  const handleFirstDay = (firstDay: 'Sun' | 'Mon') => {
    dispatch(setFirstDayOfWeek(firstDay))
  }

  const handleWeekdayClick = useCallback(
    (weekday: DaysOfWeek) => {
      // Закрываем только панель, открытую с заголовка этого дня недели (старая заглушка с preview/EMPTY).
      // Открытие агрегата по дню недели — отдельная задача; пустая панель перекрывала список дат и выглядела как «дата + строка без тулбара».
      if (openDayPanelState?.openedByWeekday === weekday) {
        dispatch(closeDayPanel())
      }
    },
    [dispatch, openDayPanelState?.openedByWeekday],
  )

  const calendarCells = useCalendarConstruction({
    firstDayOfWeek,
    calendarViewDate,
    chooseDate,
    triggerFlash,
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
