import React from 'react'
import { SwitcherButton } from './SwitcherButton/SwitcherButton'
import styles from './Switcher.module.scss'
import type { DateNumericTitle, DateRole } from '@entities/date/domain/types'

interface Props {
  dispatchDateTitle: DateNumericTitle
  activeDateTitleRole?: DateRole
  onToggleRole: (role: DateRole) => void
}

export const Switcher: React.FC<Props> = ({
  dispatchDateTitle,
  activeDateTitleRole,
  onToggleRole,
}) => {
  const roles: DateRole[] = ['year', 'month']

  return (
    <div className={styles.switcher}>
      {roles.map((role) => (
        <SwitcherButton
          key={role}
          role={role}
          dispatchDateTitle={dispatchDateTitle}
          activeDateTitleRole={activeDateTitleRole}
          onToggleRole={onToggleRole}
        />
      ))}
    </div>
  )
}
