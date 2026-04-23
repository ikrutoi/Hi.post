import React from 'react'
import clsx from 'clsx'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import styles from './Cell.module.scss'
import type {
  SelectedDispatchDate,
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'
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
  dateKey?: string
  dayData?: CardCalendarIndex | null
  /** Соседний месяц + только плейсхолдер cardphoto: стрелка по hover вместо наложения. */
  adjacentSessionPlaceholderNavSwap?: boolean
  /** Соседний месяц + выбрана картинка cardphoto: превью с пониженной непрозрачностью. */
  adjacentMonthCardphotoDim?: boolean
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
  dateKey,
  dayData,
  adjacentSessionPlaceholderNavSwap = false,
  adjacentMonthCardphotoDim = false,
  children,
}) => {
  const hasPostcards = Boolean(
    dayData &&
    (dayData.cart.length ||
      dayData.ready.length ||
      dayData.sent.length ||
      dayData.delivered.length ||
      dayData.error.length),
  )

  const dynamicClass = clsx(
    styles.cell,
    isToday && styles.today,
    isDisabledDate && styles.disabled,
    (dayBefore != null || dayAfter != null) && styles.adjacentMonth,
    dayCurrent != null && styles.current,
    isSelectedDate && styles.dispatch,
    hasPostcards && styles.withPostcards,
  )

  const clickParams: HandleCellClickParams = {
    isDisabledDate,
    dayBefore,
    dayCurrent,
    dayAfter,
    calendarViewDate,
    direction,
    dateKey,
    dayData,
  }

  const handleClickCapture = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClickCell(clickParams)
  }

  return (
    <div
      className={dynamicClass}
      onClickCapture={handleClickCapture}
      data-adjacent-session-nav-swap={
        adjacentSessionPlaceholderNavSwap ? 'true' : undefined
      }
      data-adjacent-cardphoto-dim={
        adjacentMonthCardphotoDim ? 'true' : undefined
      }
    >
      <span className={styles.dayNumber}>
        {dayCurrent ?? dayBefore ?? dayAfter}
      </span>
      {dayBefore != null ? (
        <div className={styles.navArrowWrap} aria-hidden>
          <FaChevronLeft className={styles.navArrowIcon} />
        </div>
      ) : null}
      {dayAfter != null ? (
        <div className={styles.navArrowWrap} aria-hidden>
          <FaChevronRight className={styles.navArrowIcon} />
        </div>
      ) : null}
      <div className={styles.cellContent}>{children}</div>
    </div>
  )
}
