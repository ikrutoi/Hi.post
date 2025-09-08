import React from 'react'
import './SwitcherButton.scss'

import { theme } from '@shared/theme/themeColors'
import { formatDispatchDatePart } from '@features/date/switcher/application'
import type { DateNumericTitle, DateRole } from '@entities/date/domain'

interface SwitcherButtonProps {
  role: DateRole
  selectedDateTitle: DateNumericTitle
  activeDateTitleRole?: DateRole
  onToggleRole: (role: DateRole) => void
}

export const SwitcherButton: React.FC<SwitcherButtonProps> = ({
  role,
  selectedDateTitle,
  activeDateTitleRole,
  onToggleRole,
}) => {
  const isActive = activeDateTitleRole === role

  const handleClick = () => {
    onToggleRole(role)
  }

  return (
    <span
      className={`switcher__button switcher__button--${role} ${
        isActive ? 'switcher__button--active' : ''
      }`}
      onClick={handleClick}
      style={{
        backgroundColor: isActive
          ? theme.colors.background.active
          : theme.colors.background.default,
        color: isActive
          ? theme.colors.text.inverted
          : theme.colors.text.primary,
      }}
    >
      {formatDispatchDatePart(selectedDateTitle, role)}
    </span>
  )
}
