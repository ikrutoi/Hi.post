import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch } from '@app/hooks'
import { setActiveSection } from '@entities/sectionEditorMenu/infrastructure/state/sectionEditorMenuSlice'
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
  useAutoActivateDateSection,
} from '../application/hooks'
import { useFlashEffect } from '@shared/hooks'
import { PostcardStatusLegend } from './postcardStatusLegend/PostcardStatusLegend'
import { Toggle } from '@shared/ui/Toggle/Toggle'
import { IconHistory } from '@shared/ui/icons'
import styles from './Date.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

export const Date: React.FC<{ section: 'date' | 'history' }> = ({
  section,
}) => {
  const dispatch = useAppDispatch()
  const currentDate = useMemo(() => getCurrentDate(), [])
  const { flashParts, triggerFlash } = useFlashEffect()

  const {
    // isHistoryMode,
    chooseDate,
    // toggleHistoryMode,
  } = useDateFacade()

  // console.log('date', selectedDates)
  // const { sizeItemCalendar } = useSizeFacade()

  const { lastViewedCalendarDate } = useCalendarFacade()

  const handleCalendarModeToggle = useCallback(
    (historyOn: boolean) => {
      dispatch(setActiveSection(historyOn ? 'history' : 'date'))
    },
    [dispatch],
  )

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
          dateSection={section}
          currentDate={currentDate}
          calendarViewDate={calendarViewDate}
          formattedSelectedDate={null}
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
            calendarVariant={section}
          />
        </div>

        <div
          className={clsx(
            styles.dateBottomToggle,
            section === 'history' && styles.dateBottomToggleHistory,
          )}
        >
          <div
            className={styles.dateBottomToggleIndicators}
          >
            <PostcardStatusLegend
              spot="calendar"
              isHistoryEmpty={false}
              calendarDispatchDimmed={section === 'date'}
            />
          </div>
          <div
            className={clsx(
              styles.dateBottomToggleGroup,
              styles.dateBottomToggleHistoryGroup,
              section === 'history' &&
                styles.dateBottomToggleGroupHistoryActive,
            )}
            role="group"
            aria-label="Calendar: dispatch dates or history"
          >
            <IconHistory
              className={clsx(
                styles.dateBottomToggleIcon,
                styles.dateBottomToggleHistoryIconShift,
              )}
              aria-hidden
            />
            <Toggle
              label=""
              checked={section === 'history'}
              onChange={handleCalendarModeToggle}
              size="default"
              variant="dateHistory"
            />
          </div>
        </div>

      </form>
    </div>
  )
}
