import React from 'react'
import { SwitcherSlider } from './SwitcherSlider/SwitcherSlider'
import { VISIBLE_CALENDAR_DATE } from '@entities/date/domain/types'
import { useSwitcherLogic } from '../application/hooks'
import styles from './Switcher.module.scss'
import type {
  CalendarViewDate,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'

interface Props {
  activeSwitcher?: typeSwitcher
  calendarViewDate: CalendarViewDate
  flashParts: typeSwitcher[]
}

export const Switcher: React.FC<Props> = ({
  activeSwitcher,
  calendarViewDate,
  flashParts,
}) => {
  const parts = VISIBLE_CALENDAR_DATE
  const { handleSwitcherClick } = useSwitcherLogic()

  return (
    <div className={styles.switcher}>
      <SwitcherSlider
        parts={parts}
        activeSwitcher={activeSwitcher}
        calendarViewDate={calendarViewDate}
        onSwitcherClick={handleSwitcherClick}
        // flashParts={flashParts}
      />
    </div>
  )
}
