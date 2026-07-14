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
  switcherVariant?: 'default' | 'toolbar'
  /** Mobile upper toolbar: month/year only; arrows live in the lower slider row. */
  showArrows?: boolean
}

export const DateHeaderNavigation: React.FC<DateHeaderNavigationProps> = ({
  calendarViewDate,
  onDecrement,
  onIncrement,
  className,
  switcherVariant = 'default',
  showArrows = true,
}) => (
  <div className={className ?? styles.headerCenter}>
    {showArrows ? (
      <div
        className={styles.arrowButton}
        onClick={onDecrement}
        role="button"
        tabIndex={0}
      >
        <FaChevronLeft className={styles.iconArrow} />
      </div>
    ) : null}

    <div className={styles.switcher}>
      <Switcher
        calendarViewDate={calendarViewDate}
        flashParts={[]}
        variant={switcherVariant}
      />
    </div>

    {showArrows ? (
      <div
        className={styles.arrowButton}
        onClick={onIncrement}
        role="button"
        tabIndex={0}
      >
        <FaChevronRight className={styles.iconArrow} />
      </div>
    ) : null}
  </div>
)
