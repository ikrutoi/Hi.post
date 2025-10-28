import React from 'react'
import clsx from 'clsx'
import styles from '../Switcher.module.scss'
import { formatDispatchDate } from '@entities/date/utils'
import type { DateNumericTitle, DateRole } from '@entities/date/domain/types'

interface SwitcherButtonProps {
  role: DateRole
  dispatchDateTitle: DateNumericTitle
  activeDateTitleRole?: DateRole
  onToggleRole: (role: DateRole) => void
}

export const SwitcherButton: React.FC<SwitcherButtonProps> = ({
  role,
  dispatchDateTitle,
  activeDateTitleRole,
  onToggleRole,
}) => {
  const isActive = activeDateTitleRole === role

  return (
    <span
      className={clsx(
        styles.switcher__button,
        styles[`switcher__button--${role}`],
        isActive && styles['switcher__button--active']
      )}
      onClick={() => onToggleRole(role)}
    >
      {formatDispatchDate(dispatchDateTitle, role)}
    </span>
  )
}
