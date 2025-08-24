import React from 'react'
import './DateSwitcherButton.scss'
import { MONTH_NAMES } from '@features/date/constants/months'
import { theme } from '@shared/theme/themeColors'
import { DateNumericTitle, DateField } from '@features/date/types'
import { findParentByClass } from '@shared/lib/date'

interface DateSwitcherButtonProps {
  selectedDateTitle: DateNumericTitle
  isActiveDateTitle?: DateField
  handleChangeTitle: (field: DateField) => void
  nameBtn: DateField
}

export const DateSwitcherButton: React.FC<DateSwitcherButtonProps> = ({
  selectedDateTitle,
  isActiveDateTitle,
  handleChangeTitle,
  nameBtn,
}) => {
  const isActive = isActiveDateTitle === nameBtn

  return (
    <span
      className={`date-title date-title-${nameBtn}`}
      data-name={nameBtn}
      onClick={(evt) => {
        const parentElement = findParentByClass(
          evt.target as HTMLElement,
          'date-title'
        )
        const name = parentElement?.dataset.name as DateField
        if (name === 'year' || name === 'month') {
          handleChangeTitle(name)
        }
      }}
      style={{
        backgroundColor: isActive
          ? theme.colors.background.active
          : theme.colors.background.default,
        color: isActive
          ? theme.colors.text.inverted
          : theme.colors.text.primary,
      }}
    >
      {nameBtn === 'month'
        ? MONTH_NAMES[selectedDateTitle.month]
        : selectedDateTitle.year}
    </span>
  )
}
