import React, { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import { formatSelectedDispatchDate } from '@entities/date/utils'
import { useLayoutFacade } from '@layout/application/facades'
import { getCurrentDate, getInitialCalendarDate } from '@shared/utils/date'
import { DateHeader } from '../dateHeader/presentation/DateHeader'
import { Calendar } from '../calendar/presentation/Calendar'
import { Slider } from '../slider/presentation/Slider'
import { useDateFacade } from '../application/facades/useDateFacade'
import { useCalendarFacade } from '../calendar/application/facades'
import { useDateSwitcherController } from '../application/hooks'
import styles from './Date.module.scss'

export const Date: React.FC = () => {
  const currentDate = useMemo(() => getCurrentDate(), [])

  const {
    section: { activeSection },
    actions: { setActiveSection },
  } = useLayoutFacade()

  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate } = actionsDate

  const { state: stateCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar

  const initialDate = getInitialCalendarDate(
    selectedDispatchDate,
    lastViewedCalendarDate
  )
  const [calendarViewDate, setCalendarViewDate] = useState(initialDate)

  useEffect(() => {
    if (lastViewedCalendarDate) {
      setCalendarViewDate(lastViewedCalendarDate)
    }
  }, [lastViewedCalendarDate])

  const {
    state: stateSwitcher,
    actions: actionsSwitcher,
    derived: derivedSwitcher,
  } = useDateSwitcherController()
  const { activeSwitcher } = stateSwitcher
  const {
    handleDecrementArrow,
    handleIncrementArrow,
    toggleActiveSwitcher,
    goToTodayDate,
    goToSelectedDate,
    handleSliderChange,
    // handleCalendarCellClick,
  } = actionsSwitcher
  const { isCurrentMonth } = derivedSwitcher

  const formattedSelectedDate = selectedDispatchDate
    ? formatSelectedDispatchDate(selectedDispatchDate)
    : null

  useEffect(() => {}, [])

  // console.log('date calendarViewDate', calendarViewDate)

  useEffect(() => {
    if (selectedDispatchDate) {
      setActiveSection('date')
    }
  }, [selectedDispatchDate])

  return (
    <div className={styles.date}>
      <form className={styles.form}>
        <DateHeader
          currentDate={currentDate}
          calendarViewDate={calendarViewDate}
          activeSwitcher={activeSwitcher}
          formattedSelectedDate={formattedSelectedDate}
          isCurrentMonth={isCurrentMonth}
          onDecrement={handleDecrementArrow}
          onIncrement={handleIncrementArrow}
          onToggleSwitcher={toggleActiveSwitcher}
          onGoToToday={goToTodayDate}
          onGoToSelected={goToSelectedDate}
        />

        <div className={styles.slider}>
          <Slider
            selectedDispatchDate={selectedDispatchDate}
            activeSwitcher={activeSwitcher}
            onChange={handleSliderChange}
          />
        </div>

        <div className={styles.calendar}>
          <Calendar
            selectedDispatchDate={selectedDispatchDate}
            calendarViewDate={calendarViewDate}
            setSelectedDispatchDate={setSelectedDispatchDate}
          />
        </div>
      </form>
    </div>
  )
}
