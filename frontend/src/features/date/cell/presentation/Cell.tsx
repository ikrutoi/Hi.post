import React, { useEffect, useState } from 'react'
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
  isSelectedDispatchDate?: boolean
  selectedDispatchDate?: SelectedDispatchDate
  handleDispatchDate?: (
    isDisabledDate: boolean,
    year: number,
    month: number,
    day: number
  ) => void
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
  isSelectedDispatchDate,
  handleDispatchDate,
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
    isSelectedDispatchDate && styles.dispatch
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
      {children ?? dayCurrent ?? dayBefore ?? dayAfter}
    </div>
  )
}
