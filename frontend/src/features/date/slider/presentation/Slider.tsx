import React from 'react'
import clsx from 'clsx'
import styles from './Slider.module.scss'
import { getCurrentDate } from '@shared/utils/date'
import type {
  DatePart,
  SelectedDispatchDate,
  Switcher,
} from '@entities/date/domain/types'

interface SliderProps {
  selectedDispatchDate: SelectedDispatchDate
  activeSwitcher?: Switcher
  // onChange: (role: DatePart, value: number) => void
}

export const Slider: React.FC<SliderProps> = ({
  selectedDispatchDate,
  activeSwitcher,
  // onChange,
}) => {
  const currentDate = getCurrentDate()

  if (!activeSwitcher || !selectedDispatchDate) {
    return <span className={styles['date-slider__default']} />
  }

  const { year, month } = selectedDispatchDate

  const renderSlider = (
    role: DatePart,
    value: number,
    min: number,
    max: number,
    modifier: 'year' | 'month'
  ) => (
    <input
      type="range"
      className={clsx(
        styles['date-slider__line'],
        styles[`date-slider__line--${modifier}`]
      )}
      min={min}
      max={max}
      value={value}
      // onChange={(e) => onChange(role, Number(e.target.value))}
    />
  )

  switch (activeSwitcher) {
    case 'year':
      return renderSlider(
        'year',
        year,
        currentDate.currentYear,
        currentDate.currentYear + 100,
        'year'
      )
    case 'month':
      return renderSlider('month', month, 0, 11, 'month')
    default:
      return null
  }
}
