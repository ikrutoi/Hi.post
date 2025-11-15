import React from 'react'
import clsx from 'clsx'
import styles from '../Switcher.module.scss'
import { MONTH_NAMES_UPPER } from '@entities/date/constants/months'
import type {
  SelectedDispatchDate,
  DatePart,
  Switcher,
} from '@entities/date/domain/types'

interface SwitcherButtonProps {
  part: DatePart
  calendarViewPart: number
  activeSwitcher?: Switcher
  onTogglePart: (part: DatePart) => void
}

export const SwitcherButton: React.FC<SwitcherButtonProps> = ({
  part,
  calendarViewPart,
  activeSwitcher,
  onTogglePart,
}) => {
  const isActive = activeSwitcher === part

  const label =
    part === 'month' ? MONTH_NAMES_UPPER[calendarViewPart] : calendarViewPart

  return (
    <div
      className={clsx(styles.buttonWrapper, {
        [styles.buttonWrapperMonth]: part === 'month',
        [styles.buttonWrapperYear]: part === 'year',
      })}
    >
      <div
        className={clsx(styles.button, styles[`button${capitalize(part)}`], {
          [styles.buttonActive]: isActive,
        })}
        onClick={() => onTogglePart(part)}
      >
        {label}
      </div>
    </div>
  )
}

function capitalize(part: string): string {
  return part.charAt(0).toUpperCase() + part.slice(1)
}
