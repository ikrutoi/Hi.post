import React, { useEffect, useMemo, useRef, useState } from 'react'
import clsx from 'clsx'
import { getCurrentDate } from '@shared/utils/date'
import { DateHeader } from '../dateHeader/presentation/DateHeader'
import { Calendar } from '../calendar/presentation/Calendar'
import { Slider } from '../slider/presentation/Slider'
import { useDateFacade } from '../application/facades/useDateFacade'
import { useCalendarFacade } from '../calendar/application/facades'
import { useDateSwitcherController } from '../application/hooks'
import {
  useInitializeCalendarViewDate,
  useFormattedSelectedDate,
  useAutoActivateDateSection,
} from '../application/hooks'
import { useFlashEffect } from '@shared/hooks'
import styles from './Date.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

export const Date: React.FC = () => {
  const currentDate = useMemo(() => getCurrentDate(), [])
  const { flashParts, triggerFlash } = useFlashEffect()

  const { state: stateDate, actions: actionsDate } = useDateFacade()
  const { selectedDispatchDate } = stateDate
  const { setSelectedDispatchDate } = actionsDate

  const { state: stateCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar

  useInitializeCalendarViewDate()

  const {
    state: stateSwitcher,
    actions: actionsSwitcher,
    derived: derivedSwitcher,
  } = useDateSwitcherController({ triggerFlash })
  const { activeSwitcher } = stateSwitcher
  const {
    handleDecrementArrow,
    handleIncrementArrow,
    goToTodayDate,
    goToSelectedDate,
    // handleSliderChange,
  } = actionsSwitcher
  const { isCurrentMonth } = derivedSwitcher

  const formattedSelectedDate = useFormattedSelectedDate()

  useAutoActivateDateSection()

  const calendarViewDate: CalendarViewDate = lastViewedCalendarDate ?? {
    year: currentDate.currentYear,
    month: currentDate.currentMonth,
  }

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
          onGoToToday={goToTodayDate}
          onGoToSelected={goToSelectedDate}
          flashParts={flashParts}
          // triggerFlash={triggerFlash}
        />

        <div className={styles.slider}>
          <Slider
            selectedDispatchDate={selectedDispatchDate}
            activeSwitcher={activeSwitcher}
            // onChange={handleSliderChange}
          />
        </div>

        <div className={styles.calendar}>
          <Calendar
            selectedDispatchDate={selectedDispatchDate}
            calendarViewDate={calendarViewDate}
            setSelectedDispatchDate={setSelectedDispatchDate}
            triggerFlash={triggerFlash}
          />
        </div>
      </form>
    </div>
  )
}
