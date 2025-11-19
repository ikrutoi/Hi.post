import React, { useEffect, useState } from 'react'
import { SwitcherButton } from './SwitcherButton/SwitcherButton'
import { VISIBLE_CALENDAR_DATE } from '@entities/date/domain/types'
import { useSwitcherLogic } from '../application/hooks'
// import { useFlashEffect } from '@shared/hooks'
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
  const pats = VISIBLE_CALENDAR_DATE
  const { handleSwitcherClick } = useSwitcherLogic()

  return (
    <div className={styles.switcher}>
      {pats.map((part) => (
        <SwitcherButton
          key={part}
          part={part}
          calendarViewPart={calendarViewDate[part]}
          activeSwitcher={activeSwitcher}
          onSwitcherClick={handleSwitcherClick}
          isFlashing={(flashParts ?? []).includes(part)}
        />
      ))}
    </div>
  )
}
