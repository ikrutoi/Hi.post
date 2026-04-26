import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES } from '@entities/date/constants'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Switcher } from '../../switcher/presentation/Switcher'
import { themeColors } from '@shared/config/theme/themeColors'
import styles from './DateHeader.module.scss'
import type {
  CalendarViewDate,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'
import { IconCalendarReturn } from '@/shared/ui/icons'
import { getToolbarIcon } from '@shared/utils/icons'

interface DateHeaderProps {
  /** Active Date strip: calendar by dispatch date vs history archive. */
  dateSection: 'date' | 'history'
  currentDate: {
    year: number
    month: number
    day: number
  }
  calendarViewDate: CalendarViewDate
  // activeSwitcher?: typeSwitcher
  formattedSelectedDate: string | null
  isCurrentMonth: () => boolean
  onDecrement: () => void
  onIncrement: () => void
  onGoToToday: () => void
  onGoToSelected: () => void
  flashParts: typeSwitcher[]
}

export const DateHeader: React.FC<DateHeaderProps> = ({
  dateSection,
  currentDate,
  calendarViewDate,
  // activeSwitcher,
  formattedSelectedDate: _formattedSelectedDate,
  isCurrentMonth,
  onDecrement,
  onIncrement,
  onGoToToday,
  onGoToSelected: _onGoToSelected,
  flashParts,
}) => {
  const modeIconKey = dateSection === 'history' ? 'history' : 'date'
  const modeAriaLabel =
    dateSection === 'history'
      ? 'Calendar: history archive mode'
      : 'Calendar: dispatch dates mode'

  return (
    <div className={styles.header}>
      <div className={styles.headerSide}>
        <div
          className={styles.dateSectionMode}
          aria-label={modeAriaLabel}
          data-icon-state="disabled"
        >
          {getToolbarIcon({ key: modeIconKey })}
        </div>
      </div>

      <div className={styles.headerCenter}>
        <div className={clsx(styles.arrowButton)} onClick={onDecrement}>
          <FaChevronLeft className={styles.iconArrow} />
        </div>

        <div className={styles.switcher}>
          <Switcher
            calendarViewDate={calendarViewDate}
            flashParts={flashParts}
          />
        </div>

        <div className={clsx(styles.arrowButton)} onClick={onIncrement}>
          <FaChevronRight className={styles.iconArrow} />
        </div>
      </div>

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
          {`${currentDate.year} ${MONTH_NAMES[currentDate.month]} ${currentDate.day}`}
          <IconCalendarReturn className={styles.iconTitle} />
        </div>
      </div>
    </div>
  )
}
