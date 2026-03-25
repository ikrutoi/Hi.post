import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES_UPPER } from '@entities/date/constants'
import { useSwitcherFacade } from '../../application/facades'
import styles from './SwitcherSlider.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

interface SwitcherSliderProps {
  calendarViewDate: CalendarViewDate
}

export const SwitcherSlider: React.FC<SwitcherSliderProps> = ({
  calendarViewDate,
}) => {
  const {
    state: { position },
    actions: { changePosition },
  } = useSwitcherFacade()

  const isMonth = position === 'month'

  return (
    <div
      className={styles.segmented}
      role="tablist"
      aria-label="Scroll mode: month or year"
    >
      <div
        className={clsx(styles.bg, styles.bgMonth, {
          [styles.bgActive]: isMonth,
          [styles.bgInactive]: !isMonth,
        })}
        aria-hidden
      />
      <div
        className={clsx(styles.bg, styles.bgYear, {
          [styles.bgActive]: !isMonth,
          [styles.bgInactive]: isMonth,
        })}
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
