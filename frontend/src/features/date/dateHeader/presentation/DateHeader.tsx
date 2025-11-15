import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES } from '@entities/date/constants'
import { LuCalendar, LuCalendarArrowUp } from 'react-icons/lu'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Switcher } from '../../switcher/presentation/Switcher'
import styles from './DateHeader.module.scss'
import type {
  CalendarViewDate,
  DatePart,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'
import { themeColors } from '@shared/config/theme/themeColors'

interface DateHeaderProps {
  currentDate: {
    currentYear: number
    currentMonth: number
    currentDay: number
  }
  calendarViewDate: CalendarViewDate
  activeSwitcher?: typeSwitcher
  formattedSelectedDate: string | null
  isCurrentMonth: () => boolean
  onDecrement: () => void
  onIncrement: () => void
  onToggleSwitcher: (part: DatePart) => void
  onGoToToday: () => void
  onGoToSelected: () => void
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  currentDate,
  calendarViewDate,
  activeSwitcher,
  formattedSelectedDate,
  isCurrentMonth,
  onDecrement,
  onIncrement,
  onToggleSwitcher,
  onGoToToday,
  onGoToSelected,
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
          {`${currentDate.currentYear} ${MONTH_NAMES[currentDate.currentMonth]} ${currentDate.currentDay}`}
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
            onToggleSwitcher={onToggleSwitcher}
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
