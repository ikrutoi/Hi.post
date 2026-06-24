import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES } from '@entities/date/constants'
import { themeColors } from '@shared/config/theme/themeColors'
import { IconCalendarReturn } from '@/shared/ui/icons'
import styles from './DateHeader.module.scss'

type DateHeaderTodayProps = {
  currentDate: {
    year: number
    month: number
    day: number
  }
  isCurrentMonth: () => boolean
  onGoToToday: () => void
  className?: string
}

export const DateHeaderToday: React.FC<DateHeaderTodayProps> = ({
  currentDate,
  isCurrentMonth,
  onGoToToday,
  className,
}) => {
  const currentMonthSelected = isCurrentMonth()

  return (
    <div
      className={clsx(
        styles.todaySelected,
        currentMonthSelected && styles.todaySelectedDisabled,
        className,
      )}
      onClick={onGoToToday}
      style={{
        color: themeColors.color.font,
        cursor: currentMonthSelected ? 'default' : 'pointer',
      }}
    >
      {`${currentDate.year} ${MONTH_NAMES[currentDate.month]} ${currentDate.day}`}
      <IconCalendarReturn className={styles.iconTitle} />
    </div>
  )
}
