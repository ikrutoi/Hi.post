import React from 'react'
import './SwitcherButton.scss'

import { theme } from '@/shared/config/theme/themeColors'
import { formatDispatchDatePart } from '@features/date/switcher/application'
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
      {formatDispatchDatePart(dispatchDateTitle, role)}
    </span>
  )
}
