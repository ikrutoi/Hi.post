import { isTabooDate } from '@entities/date/utils/isTabooDate'
import { changeCartDay } from './changeCartDay'
import { Cell } from '../../../cell/presentation/Cell'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartItem } from '@cart/domain/types'

interface BuildCurrentMonthCellsParams {
  daysInCurrentMonth: number
  dispatchDate: DispatchDate
  dispatchDateTitle: DispatchDate
  titleYear: number
  titleMonth: number
  titleDay: number
  currentDate: {
    currentDay: number
    currentMonth: number
    currentYear: number
  }
  handleSelectedDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  isCountCart?: CartItem[]
}

export const buildCurrentMonthCells = ({
  daysInCurrentMonth,
  dispatchDate,
  dispatchDateTitle,
  titleYear,
  titleMonth,
  titleDay,
  currentDate,
  handleSelectedDate,
  handleClickCell,
  isCountCart,
}: BuildCurrentMonthCellsParams) => {
  return Array.from({ length: daysInCurrentMonth }, (_, i) => {
    const day = i + 1
    const isToday =
      day === currentDate.currentDay &&
      titleMonth === currentDate.currentMonth &&
      titleYear === currentDate.currentYear

    const isSelected =
      dispatchDate.isSelected &&
      dispatchDate.year === titleYear &&
      dispatchDate.month === titleMonth &&
      dispatchDate.day === day

    const cartDay = isCountCart
      ? changeCartDay(day, titleMonth, titleYear, isCountCart)
      : undefined

    return (
      <Cell
        key={`day-${day}`}
        today={isToday}
        isTaboo={isTabooDate(day, dispatchDateTitle, currentDate)}
        dayCurrent={day}
        handleSelectedDate={handleSelectedDate}
        selected={isSelected}
        dispatchDateTitle={dispatchDateTitle}
        cartDay={cartDay}
        handleClickCell={handleClickCell}
      />
    )
  })
}
