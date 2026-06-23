import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES_UPPER } from '@entities/date/constants'
import { useSwitcherFacade } from '../../application/facades'
import styles from './SwitcherSlider.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

type SwitcherSliderVariant = 'default' | 'toolbar'

interface SwitcherSliderProps {
  calendarViewDate: CalendarViewDate
  variant?: SwitcherSliderVariant
}

export const SwitcherSlider: React.FC<SwitcherSliderProps> = ({
  calendarViewDate,
  variant = 'default',
}) => {
  const {
    state: { position },
    actions: { changePosition },
  } = useSwitcherFacade()

  const isMonth = position === 'month'
  const isToolbar = variant === 'toolbar'

  return (
    <div
      className={clsx(
        styles.segmented,
        isToolbar && styles.segmentedToolbar,
      )}
      role="tablist"
      aria-label="Scroll mode: month or year"
    >
      <div
        className={clsx(
          styles.thumb,
          isToolbar && styles.thumbToolbar,
          isMonth ? styles.thumbMonth : styles.thumbYear,
        )}
        aria-hidden
      />
      <button
        type="button"
        role="tab"
        aria-selected={isMonth}
        aria-label="Browse by month"
        className={clsx(styles.segment, styles.segmentMonth, {
          [styles.segmentActive]: isMonth,
        })}
        onClick={() => changePosition('month')}
      >
        <span className={styles.segmentValue}>
          {MONTH_NAMES_UPPER[calendarViewDate.month]}
        </span>
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={!isMonth}
        aria-label="Browse by year"
        className={clsx(styles.segment, styles.segmentYear, {
          [styles.segmentActive]: !isMonth,
        })}
        onClick={() => changePosition('year')}
      >
        <span className={styles.segmentValue}>{calendarViewDate.year}</span>
      </button>
    </div>
  )
}
