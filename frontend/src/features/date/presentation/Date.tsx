import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { getCurrentDate } from '@shared/utils/date'
import { DateHeader } from '../dateHeader/presentation/DateHeader'
import { Calendar } from '../calendar/presentation/Calendar'
import { Slider } from '../slider/presentation/Slider'
import { useDateFacade } from '../application/facades/useDateFacade'
import { useCalendarFacade } from '../calendar/application/facades'
// import { useSizeFacade } from '@layout/application/facades'
import { useDateSwitcherController } from '../application/hooks'
import {
  useInitializeCalendarViewDate,
  useFormattedSelectedDate,
  useAutoActivateDateSection,
} from '../application/hooks'
import { useFlashEffect } from '@shared/hooks'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { IconCalendarMulti } from '@shared/ui/icons'
import styles from './Date.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

export const Date: React.FC = () => {
  const currentDate = useMemo(() => getCurrentDate(), [])
  const { flashParts, triggerFlash } = useFlashEffect()

  const {
    selectedDate,
    selectedDates,
    chooseDate,
    isMultiDateMode,
    toggleMultiDateMode,
  } = useDateFacade()

  console.log('date', selectedDates)
  // const { sizeItemCalendar } = useSizeFacade()

  const { lastViewedCalendarDate } = useCalendarFacade()

  useInitializeCalendarViewDate()

  const { actions: actionsSwitcher, derived: derivedSwitcher } =
    useDateSwitcherController({ triggerFlash })
  const {
    handleDecrementArrow,
    handleIncrementArrow,
    goToTodayDate,
    goToSelectedDate,
    decrementMonth,
    incrementMonth,
    setCalendarViewDate,
  } = actionsSwitcher
  const { isCurrentMonth } = derivedSwitcher

  const formattedSelectedDate = useFormattedSelectedDate()

  useAutoActivateDateSection()

  const calendarViewDate: CalendarViewDate = lastViewedCalendarDate ?? {
    year: currentDate.year,
    month: currentDate.month,
  }

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!lastViewedCalendarDate) return
      const target = e.target as HTMLElement
      if (target.closest('input') || target.closest('button')) return

      const { year, month } = lastViewedCalendarDate
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          decrementMonth()
          break
        case 'ArrowRight':
          e.preventDefault()
          incrementMonth()
          break
        case 'ArrowUp':
          e.preventDefault()
          setCalendarViewDate({ year: year - 1, month })
          break
        case 'ArrowDown':
          e.preventDefault()
          setCalendarViewDate({ year: year + 1, month })
          break
      }
    },
    [
      lastViewedCalendarDate,
      decrementMonth,
      incrementMonth,
      setCalendarViewDate,
    ],
  )

  return (
    <div className={styles.date}>
      <form
        className={styles.form}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        aria-label="Calendar: left/right arrows - month, up/down - year"
      >
        <DateHeader
          currentDate={currentDate}
          calendarViewDate={calendarViewDate}
          formattedSelectedDate={formattedSelectedDate}
          isCurrentMonth={isCurrentMonth}
          onDecrement={handleDecrementArrow}
          onIncrement={handleIncrementArrow}
          onGoToToday={goToTodayDate}
          onGoToSelected={goToSelectedDate}
          flashParts={flashParts}
        />

        <div className={styles.slider}>
          <Slider />
        </div>

        <div className={styles.calendar}>
          <Calendar
            calendarViewDate={calendarViewDate}
            chooseDate={chooseDate}
            triggerFlash={triggerFlash}
          />
        </div>

        <div className={styles.dateBottomToggle}>
          <div
            className={clsx(
              styles.dateBottomToggleGroup,
              isMultiDateMode && styles.dateBottomToggleGroupActive,
            )}
          >
            <IconCalendarMulti className={styles.dateBottomToggleIcon} />
            <Toggle
              label=""
              checked={isMultiDateMode}
              onChange={toggleMultiDateMode}
              size="default"
              variant="date"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
