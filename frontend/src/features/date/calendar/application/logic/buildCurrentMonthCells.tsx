import { Cell } from '../../presentation/Calendar/Cell/Cell'
import { isTabooDate } from '@entities/date/utils/isTabooDate'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartPostcard } from '@features/cart/publicApi'
import { changeCartDay } from './changeCartDay'

interface BuildCurrentMonthCellsParams {
  daysInCurrentMonth: number
  selectedDate: DispatchDate
  selectedDateTitle: DispatchDate
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
  isCountCart?: CartPostcard[]
}

export const buildCurrentMonthCells = ({
  daysInCurrentMonth,
  selectedDate,
  selectedDateTitle,
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
      selectedDate.isSelected &&
      selectedDate.year === titleYear &&
      selectedDate.month === titleMonth &&
      selectedDate.day === day

    const cartDay = isCountCart
      ? changeCartDay(day, titleMonth, titleYear, isCountCart)
      : undefined

    return (
      <Cell
        key={`day-${day}`}
        today={isToday}
        isTaboo={isTabooDate(day, selectedDateTitle, currentDate)}
        dayCurrent={day}
        handleSelectedDate={handleSelectedDate}
        selected={isSelected}
        selectedDateTitle={selectedDateTitle}
        cartDay={cartDay}
        handleClickCell={handleClickCell}
      />
    )
  })
}
