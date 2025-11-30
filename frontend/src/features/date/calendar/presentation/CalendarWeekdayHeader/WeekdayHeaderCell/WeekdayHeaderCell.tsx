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
}

export const WeekdayHeaderCell: React.FC<WeekdayHeaderCellProps> = ({
  weekday,
  isFirstDay = false,
  firstDayTitle,
  handleFirstDay,
}) => {
  const handleClick = () => {
    if (isFirstDay && handleFirstDay && firstDayTitle) {
      handleFirstDay(firstDayTitle === 'Sun' ? 'Mon' : 'Sun')
    }
  }

  return (
    <div
      className={clsx(styles.cell, isFirstDay && styles.firstDayToggle)}
      onClick={isFirstDay ? handleClick : undefined}
    >
      {weekday}
    </div>
  )
}
