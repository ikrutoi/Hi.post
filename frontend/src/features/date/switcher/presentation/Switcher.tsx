import React from 'react'
import './Switcher.scss'

import type { DateNumericTitle, DateRole } from '@entities/date/domain/types'
import { SwitcherButton } from './SwitcherButton/SwitcherButton'

interface SwitcherProps {
  dispatchDateTitle: DateNumericTitle
  activeDateTitleRole?: DateRole
  onToggleRole: (role: DateRole) => void
}

export const Switcher: React.FC<SwitcherProps> = ({
  dispatchDateTitle,
  activeDateTitleRole,
  onToggleRole,
}) => {
  const roles: DateRole[] = ['year', 'month']

  return (
    <div className="switcher">
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
