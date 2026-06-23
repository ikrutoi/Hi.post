import React from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import { Switcher } from '../../switcher/presentation/Switcher'
import styles from './DateHeader.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

type DateHeaderNavigationProps = {
  calendarViewDate: CalendarViewDate
  onDecrement: () => void
  onIncrement: () => void
  className?: string
}

export const DateHeaderNavigation: React.FC<DateHeaderNavigationProps> = ({
  calendarViewDate,
  onDecrement,
  onIncrement,
  className,
}) => (
  <div className={className ?? styles.headerCenter}>
    <div className={styles.arrowButton} onClick={onDecrement} role="button" tabIndex={0}>
      <FaChevronLeft className={styles.iconArrow} />
    </div>

    <div className={styles.switcher}>
      <Switcher calendarViewDate={calendarViewDate} flashParts={[]} />
    </div>

    <div className={styles.arrowButton} onClick={onIncrement} role="button" tabIndex={0}>
      <FaChevronRight className={styles.iconArrow} />
    </div>
  </div>
)
