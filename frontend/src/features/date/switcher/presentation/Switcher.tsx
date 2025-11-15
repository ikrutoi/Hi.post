import React from 'react'
import { SwitcherButton } from './SwitcherButton/SwitcherButton'
import { VISIBLE_CALENDAR_DATE } from '@entities/date/domain/types'
import styles from './Switcher.module.scss'
import type {
  SelectedDispatchDate,
  DatePart,
  CalendarViewDate,
  Switcher as typeSwitcher,
} from '@entities/date/domain/types'

interface Props {
  // selectedDispatchDate: SelectedDispatchDate
  activeSwitcher?: typeSwitcher
  calendarViewDate: CalendarViewDate
  onTogglePart: (part: DatePart) => void
}

export const Switcher: React.FC<Props> = ({
  // selectedDispatchDate,
  activeSwitcher,
  calendarViewDate,
  onTogglePart,
}) => {
  const pats = VISIBLE_CALENDAR_DATE

  return (
    <div className={styles.switcher}>
      {pats.map((part) => (
        <SwitcherButton
          key={part}
          part={part}
          calendarViewPart={calendarViewDate[part]}
          // selectedDispatchDate={selectedDispatchDate}
          activeSwitcher={activeSwitcher}
          onTogglePart={onTogglePart}
        />
      ))}
    </div>
  )
}
