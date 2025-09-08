import React from 'react'
import './Switcher.scss'

import type {
  DateNumericTitle,
  DateRole,
} from '@entities/date/domain/dispatchDate'
import { SwitcherButton } from './SwitcherButton/SwitcherButton'

interface SwitcherProps {
  selectedDateTitle: DateNumericTitle
  activeDateTitleRole?: DateRole
  onToggleRole: (role: DateRole) => void
}

export const Switcher: React.FC<SwitcherProps> = ({
  selectedDateTitle,
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
          selectedDateTitle={selectedDateTitle}
          activeDateTitleRole={activeDateTitleRole}
          onToggleRole={onToggleRole}
        />
      ))}
    </div>
  )
}
