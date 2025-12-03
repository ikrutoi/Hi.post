import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES } from '@entities/date/constants'
import { LuCalendar, LuCalendarArrowUp } from 'react-icons/lu'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Switcher } from '../../switcher/presentation/Switcher'
import { themeColors } from '@shared/config/theme/themeColors'
import styles from './DateHeader.module.scss'
import type {
  CalendarViewDate,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'

interface DateHeaderProps {
  currentDate: {
    year: number
    month: number
    day: number
  }
  calendarViewDate: CalendarViewDate
  activeSwitcher?: typeSwitcher
  formattedSelectedDate: string | null
  isCurrentMonth: () => boolean
  onDecrement: () => void
  onIncrement: () => void
  onGoToToday: () => void
  onGoToSelected: () => void
  flashParts: typeSwitcher[]
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  currentDate,
  calendarViewDate,
  activeSwitcher,
  formattedSelectedDate,
  isCurrentMonth,
  onDecrement,
  onIncrement,
  onGoToToday,
  onGoToSelected,
  flashParts,
}) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerSide}>
        <div
          className={clsx(styles.todaySelected, {
            [styles.todaySelectedDisabled]: isCurrentMonth(),
          })}
          onClick={onGoToToday}
          style={{
            color: isCurrentMonth()
              ? themeColors.color.font
              : themeColors.color.font,
            cursor: isCurrentMonth() ? 'default' : 'pointer',
          }}
        >
          <LuCalendar className={styles.iconTitle} />
          {`${currentDate.year} ${MONTH_NAMES[currentDate.month]} ${currentDate.day}`}
        </div>
      </div>

      <div className={styles.headerCenter}>
        <div
          className={clsx(styles.arrowButton, {
            [styles.arrowButtonInactive]: !activeSwitcher,
          })}
          onClick={onDecrement}
          style={{
            backgroundColor: themeColors.color.disabled,
          }}
        >
          <FaChevronLeft className={styles.iconArrow} />
        </div>

        <div className={styles.switcher}>
          <Switcher
            activeSwitcher={activeSwitcher}
            calendarViewDate={calendarViewDate}
            flashParts={flashParts}
          />
        </div>

        <div
          className={clsx(styles.arrowButton, {
            [styles.arrowButtonInactive]: !activeSwitcher,
          })}
          onClick={onIncrement}
          style={{
            backgroundColor: themeColors.color.disabled,
          }}
        >
          <FaChevronRight className={styles.iconArrow} />
        </div>
      </div>

      <div className={styles.headerSide}>
        <div className={styles.selected} onClick={onGoToSelected}>
          {formattedSelectedDate && (
            <>
              {formattedSelectedDate}
              <LuCalendarArrowUp className={styles.iconTitle} />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
