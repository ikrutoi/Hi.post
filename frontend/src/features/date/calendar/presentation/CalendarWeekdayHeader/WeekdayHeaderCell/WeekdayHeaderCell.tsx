import React from 'react'
import clsx from 'clsx'
import styles from './WeekdayHeaderCell.module.scss'
import type { DaysOfWeek } from '@entities/date/domain/types'
import type { FirstDay } from '@entities/date/domain/types'

interface WeekdayHeaderCellProps {
  weekday: DaysOfWeek
  isFirstDay?: boolean
  firstDayTitle?: FirstDay
  handleFirstDay?: (day: FirstDay) => void
  onWeekdayClick?: (weekday: DaysOfWeek) => void
}

export const WeekdayHeaderCell: React.FC<WeekdayHeaderCellProps> = ({
  weekday,
  isFirstDay = false,
  firstDayTitle,
  handleFirstDay,
  onWeekdayClick,
}) => {
  const handleClick = () => {
    if (isFirstDay && handleFirstDay && firstDayTitle) {
      handleFirstDay(firstDayTitle === 'Sun' ? 'Mon' : 'Sun')
    } else if (onWeekdayClick) {
      onWeekdayClick(weekday)
    }
  }

  const hasClick = (isFirstDay && handleFirstDay) || onWeekdayClick

  return (
    <div
      className={clsx(
        styles.cell,
        isFirstDay && styles.firstDayToggle,
        onWeekdayClick && !isFirstDay && styles.weekdayClickable,
      )}
      onClick={hasClick ? handleClick : undefined}
      role={onWeekdayClick && !isFirstDay ? 'button' : undefined}
      aria-label={
        onWeekdayClick && !isFirstDay
          ? `Open or close cards panel (${weekday})`
          : undefined
      }
    >
      {isFirstDay ? (
        <span className={styles.firstDayToggleInner}>{weekday}</span>
      ) : (
        weekday
      )}
    </div>
  )
}
