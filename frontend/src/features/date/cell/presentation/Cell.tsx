import React from 'react'
import clsx from 'clsx'
import styles from './Cell.module.scss'
import type {
  SelectedDispatchDate,
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { HandleCellClickParams } from '../domain/types'

interface CellProps {
  dayCurrent?: number
  dayBefore?: number
  dayAfter?: number
  calendarViewDate: CalendarViewDate
  direction: MonthDirection
  isToday?: boolean
  isDisabledDate?: boolean
  isSelectedDate?: boolean
  selectedDispatchDate?: SelectedDispatchDate
  onClickCell: (params: HandleCellClickParams) => void
  children?: React.ReactNode
}

export const Cell: React.FC<CellProps> = ({
  dayBefore,
  dayCurrent,
  dayAfter,
  calendarViewDate,
  direction,
  isToday,
  isDisabledDate,
  isSelectedDate,
  onClickCell,
  children,
}) => {
  const dynamicClass = clsx(
    styles.cell,
    isToday && styles.today,
    isDisabledDate && styles.disabled,
    dayBefore != null && styles.before,
    dayAfter != null && styles.after,
    dayCurrent != null && styles.current,
    isSelectedDate && styles.dispatch
  )

  const handleClick = () => {
    onClickCell({
      isDisabledDate,
      dayBefore,
      dayCurrent,
      dayAfter,
      calendarViewDate,
      direction,
      // cartItem,
    })
  }

  return (
    <div className={dynamicClass} onClick={handleClick}>
      <span className={styles.dayNumber}>
        {dayCurrent ?? dayBefore ?? dayAfter}
      </span>
      <div className={styles.cellContent}>{children}</div>
    </div>
  )
}
