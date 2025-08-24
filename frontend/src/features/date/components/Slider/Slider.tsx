import React from 'react'
import './Slider.scss'
import { currentDate } from '@features/date/publicApi.ts'
import type { DateNumericTitle, DateField } from '@features/date/types'

interface SliderProps {
  selectedDateTitle: DateNumericTitle
  isActiveDateTitle?: DateField
  handleChangeDateFromSlider: (field: DateField, value: number) => void
}

export const Slider: React.FC<SliderProps> = ({
  selectedDateTitle,
  isActiveDateTitle,
  handleChangeDateFromSlider,
}) => {
  const renderSlider = (
    field: 'year' | 'month',
    value: number,
    min: number,
    max: number,
    className: string
  ) => (
    <input
      type="range"
      className={`slider-line ${className}`}
      min={min}
      max={max}
      value={value}
      onChange={(e) =>
        handleChangeDateFromSlider(field, Number(e.target.value))
      }
    />
  )

  if (!isActiveDateTitle) return <span className="slider-default"></span>

  switch (isActiveDateTitle) {
    case 'year':
      return renderSlider(
        'year',
        selectedDateTitle.year,
        currentDate.currentYear,
        currentDate.currentYear + 100,
        'slider-line-year'
      )

    case 'month':
      return renderSlider(
        'month',
        selectedDateTitle.month,
        0,
        11,
        'slider-line-month'
      )

    default:
      return null
  }
}
