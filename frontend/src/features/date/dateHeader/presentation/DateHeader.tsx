import React from 'react'
import clsx from 'clsx'
import { useAppSelector } from '@app/hooks'
import { selectIsMobileLayout } from '@features/layout/infrastructure/selectors/size.selectors'
import { DateHeaderNavigation } from './DateHeaderNavigation'
import { DateHeaderToday } from './DateHeaderToday'
import styles from './DateHeader.module.scss'
import type {
  CalendarViewDate,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'
import { getToolbarIcon } from '@shared/utils/icons'

interface DateHeaderProps {
  /** Active Date strip: dispatch date, history archive, or cart list + calendar. */
  dateSection: 'date' | 'history' | 'cart'
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
  flashParts: _flashParts,
}) => {
  const isMobileLayout = useAppSelector(selectIsMobileLayout)
  const modeIconKey =
    dateSection === 'history'
      ? 'history'
      : dateSection === 'cart'
        ? 'cart'
        : 'date'
  const modeAriaLabel =
    dateSection === 'history'
      ? 'Calendar: history archive mode'
      : dateSection === 'cart'
        ? 'Calendar: cart mode'
        : 'Calendar: dispatch dates mode'

  return (
    <div className={styles.header}>
      <div className={styles.headerSide}>
        <div
          className={clsx(
            styles.dateSectionMode,
            dateSection === 'date' && styles.dateSectionModeDispatch,
            dateSection === 'cart' && styles.dateSectionModeCart,
            dateSection === 'history' && styles.dateSectionModeHistory,
          )}
          aria-label={modeAriaLabel}
          data-icon-state="disabled"
        >
          {getToolbarIcon({ key: modeIconKey })}
        </div>
      </div>

      <DateHeaderNavigation
        calendarViewDate={calendarViewDate}
        onDecrement={onDecrement}
        onIncrement={onIncrement}
      />

      <div className={styles.headerSide}>
        <DateHeaderToday
          currentDate={currentDate}
          isCurrentMonth={isCurrentMonth}
          onGoToToday={onGoToToday}
        />
      </div>
    </div>
  )
}
