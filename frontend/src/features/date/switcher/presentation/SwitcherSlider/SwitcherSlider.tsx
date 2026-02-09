import React from 'react'
import clsx from 'clsx'
import { MONTH_NAMES_UPPER } from '@entities/date/constants'
import { useSwitcherLogic } from '../../application/hooks'
import { useSwitcherFacade } from '../../application/facades'
import styles from './SwitcherSlider.module.scss'
import type { CalendarViewDate } from '@entities/date/domain/types'

interface SwitcherSliderProps {
  calendarViewDate: CalendarViewDate
}

export const SwitcherSlider: React.FC<SwitcherSliderProps> = ({
  calendarViewDate,
}) => {
  // const { state: stateSwitcher, actions: actionsSwitcher } = useSwitcherFacade()
  // const { position } = stateSwitcher
  // const { toggle } = actionsSwitcher
  const {
    state: { position },
    actions: { toggle },
  } = useSwitcherFacade()

  const { handleSwitcherClick } = useSwitcherLogic()

  return (
    <div className={styles.slider} onClick={() => toggle()}>
      <div
        className={clsx(styles.sliderTextLayer, styles.sliderTextLayerMonth, {
          [styles.sliderRight]: position === 'month',
          [styles.sliderLeft]: position === 'year',
        })}
      >
        <span className={clsx(styles.sliderText, styles.sliderTextMonth)}>
          {MONTH_NAMES_UPPER[calendarViewDate.month]}
        </span>
      </div>

      <div
        className={clsx(styles.sliderTextLayer, styles.sliderTextLayerYear, {
          [styles.sliderRight]: position === 'month',
          [styles.sliderLeft]: position === 'year',
        })}
      >
        <span className={clsx(styles.sliderText, styles.sliderTextYear)}>
          {calendarViewDate.year}
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
