import React, { useState } from 'react'
import clsx from 'clsx'
import styles from './SwitcherSlider.module.scss'
import type {
  CalendarViewDate,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'
import { MONTH_NAMES } from '@entities/date/constants'

interface SwitcherSliderProps {
  parts: readonly typeSwitcher[]
  activeSwitcher?: typeSwitcher
  calendarViewDate: CalendarViewDate
  onSwitcherClick: (part: typeSwitcher) => void
}

export const SwitcherSlider: React.FC<SwitcherSliderProps> = ({
  parts,
  activeSwitcher,
  calendarViewDate,
  onSwitcherClick,
}) => {
  const [position, setPosition] = useState<'month' | 'year'>('month')

  return (
    <div
      className={styles.slider}
      onClick={() => {
        const next = position === 'month' ? 'year' : 'month'
        setPosition(next)
        onSwitcherClick(next)
      }}
    >
      <div
        className={clsx(styles.sliderTextLayer, styles.sliderTextLayerYear, {
          [styles.sliderLeft]: position === 'year',
          [styles.sliderRight]: position === 'month',
        })}
      >
        <span className={clsx(styles.sliderText, styles.sliderTextYear)}>
          {calendarViewDate.year}
        </span>
      </div>

      <div
        className={clsx(styles.sliderTextLayer, styles.sliderTextLayerMonth, {
          [styles.sliderLeft]: position === 'year',
          [styles.sliderRight]: position === 'month',
        })}
      >
        <span className={clsx(styles.sliderText, styles.sliderTextMonth)}>
          {MONTH_NAMES[calendarViewDate.month - 1]}
        </span>
      </div>

      <div
        className={clsx(styles.sliderBall, {
          [styles.sliderLeft]: position === 'year',
          [styles.sliderRight]: position === 'month',
        })}
      />
    </div>
  )
}
