import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { CartDatePreview } from '../../calendar/presentation/CalendarWeekTitle/CartDatePreview/CartDatePreview'
import { useLayoutFacade } from '@layout/application/facades'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import styles from './Cell.module.scss'

interface CellProps {
  title?: string
  dayCurrent?: number
  dayBefore?: number
  dayAfter?: number
  today?: boolean
  isTaboo?: boolean
  isSelected?: boolean
  dispatchDate?: DispatchDate
  handleDispatchDate?: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell?: (direction: 'before' | 'after') => void
  children?: React.ReactNode // для CartDatePreview
}

export const Cell: React.FC<CellProps> = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  today,
  isTaboo,
  isSelected,
  dispatchDate,
  handleDispatchDate,
  handleClickCell,
  children,
}) => {
  const dynamicClass = clsx(
    styles.cell,
    today && styles['cell--today'],
    dispatchDate && styles['cell--dispatch'],
    isTaboo && styles['cell--taboo'],
    dayBefore != null && styles['cell--before'],
    dayAfter != null && styles['cell--after'],
    dayCurrent != null && styles['cell--current'],
    isSelected && styles['cell--selected']
  )

  if (title) {
    return (
      <div className={clsx(styles.cell, styles['cell--title'])}>{title}</div>
    )
  }

  const handleClick = () => {
    if (
      dayCurrent != null &&
      !children &&
      dispatchDate?.isSelected &&
      handleDispatchDate
    ) {
      handleDispatchDate(
        !!isTaboo,
        dispatchDate.year!,
        dispatchDate.month!,
        dayCurrent
      )
    }
  }

  return (
    <div className={dynamicClass} onClick={handleClick}>
      {children ?? dayCurrent ?? dayBefore ?? dayAfter}
    </div>
  )
}
