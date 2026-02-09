import React, { useEffect, useRef, useState } from 'react'
import clsx from 'clsx'
import { getCurrentDate } from '@shared/utils/date'
import { MONTH_NAMES_UPPER } from '@entities/date/constants'
import { useCalendarFacade } from '../../calendar/application/facades'
import { useSwitcherFacade } from '../../switcher/application/facades'
import styles from './Slider.module.scss'
import type { DatePart } from '@entities/date/domain/types'

export const Slider: React.FC = () => {
  const { state: stateCalendar, actions: actionsCalendar } = useCalendarFacade()
  const { lastViewedCalendarDate } = stateCalendar
  const { setCalendarViewDate } = actionsCalendar

  const { state: stateSwitcher } = useSwitcherFacade()
  const { position } = stateSwitcher

  const currentDate = getCurrentDate()

  const handleChange = (role: 'year' | 'month', newValue: number) => {
    setCalendarViewDate({
      year: role === 'year' ? newValue : lastViewedCalendarDate.year,
      month: role === 'month' ? newValue : lastViewedCalendarDate.month,
    })
  }

  const renderSlider = (
    role: 'year' | 'month',
    value: number,
    min: number,
    max: number,
  ) => {
    const percent = ((value - min) / (max - min)) * 100
    const labelOffset = `calc(${percent}% + (${0.5 - percent / 100}rem))`

    const monthText =
      role === 'month'
        ? MONTH_NAMES_UPPER[value]
        : MONTH_NAMES_UPPER[lastViewedCalendarDate.month]

    const yearText = role === 'year' ? value : lastViewedCalendarDate.year

    return (
      <div className={styles.sliderContainer}>
        <div className={clsx(styles.sliderLabel)} style={{ left: labelOffset }}>
          <span
            className={clsx(styles.labelPart, {
              [styles.active]: role === 'month',
            })}
          >
            {monthText}
          </span>

          <span className={styles.labelSeparator}>&nbsp;</span>

          <span
            className={clsx(styles.labelPart, {
              [styles.active]: role === 'year',
            })}
          >
            {yearText}
          </span>
        </div>
        <input
          type="range"
          className={clsx(
            styles.dateSliderLine,
            styles[`dateSliderLine${role}`],
          )}
          min={min}
          max={max}
          value={value}
          onChange={(e) => handleChange(role, Number(e.target.value))}
        />
      </div>
    )
  }

  switch (position) {
    case 'year':
      return renderSlider(
        'year',
        lastViewedCalendarDate.year,
        currentDate.year,
        currentDate.year + 100,
      )
    case 'month':
      return renderSlider('month', lastViewedCalendarDate.month, 0, 11)
    default:
      return null
  }
}
