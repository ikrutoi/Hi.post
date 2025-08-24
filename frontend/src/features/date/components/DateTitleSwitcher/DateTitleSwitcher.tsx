import React from 'react'
import './DateTitleSwitcher.scss'
import { DateNumericTitle, DateField } from '@features/date/types'
import { DateSwitcherButton } from './DateSwitcherButton/DateSwitcherButton'

interface CurrentDateTimeProps {
  selectedDateTitle: DateNumericTitle
  isActiveDateTitle?: DateField
  handleChangeTitle: (field: DateField) => void
}

export const DateTitleSwitcher: React.FC<CurrentDateTimeProps> = ({
  selectedDateTitle,
  isActiveDateTitle,
  handleChangeTitle,
}) => {
  const titleBtns: DateField[] = ['year', 'month']

  return (
    <>
      {titleBtns.map((btn, i) => (
        <DateSwitcherButton
          selectedDateTitle={selectedDateTitle}
          isActiveDateTitle={isActiveDateTitle}
          handleChangeTitle={handleChangeTitle}
          nameBtn={btn}
        />
      ))}
    </>
  )
}
