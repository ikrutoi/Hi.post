import React from 'react'
import clsx from 'clsx'
import styles from './Slider.module.scss'
import { getCurrentDate } from '@shared/utils/date'
import type { DateNumericTitle, DateRole } from '@entities/date/domain/types'

interface SliderProps {
  dispatchDateTitle: DateNumericTitle
  activeDateTitleRole?: DateRole
  onChange: (role: DateRole, value: number) => void
}

export const Slider: React.FC<SliderProps> = ({
  dispatchDateTitle,
  activeDateTitleRole,
  onChange,
}) => {
  const currentDate = getCurrentDate()

  if (!activeDateTitleRole || !dispatchDateTitle.isSelected) {
    return <span className={styles['date-slider__default']} />
  }

  const { year, month } = dispatchDateTitle

  const renderSlider = (
    role: DateRole,
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
      onChange={(e) => onChange(role, Number(e.target.value))}
    />
  )

  switch (activeDateTitleRole) {
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
