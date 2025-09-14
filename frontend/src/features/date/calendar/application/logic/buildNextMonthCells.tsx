import { Cell } from '../../presentation/Calendar/Cell/Cell'
import type { DispatchDate } from '@entities/date/domain/types'

interface BuildNextMonthCellsParams {
  count: number
  selectedDate: DispatchDate
  selectedDateTitle: DispatchDate
  titleYear: number
  titleMonth: number
  titleDay: number
  dateTodayAfter: { year: number; month: number }
  dateSelectedAfter: { year: number; month: number }
  currentDay: number
  handleClickCell: (direction: 'before' | 'after') => void
}

export const buildNextMonthCells = ({
  count,
  selectedDate,
  selectedDateTitle,
  titleYear,
  titleMonth,
  titleDay,
  dateTodayAfter,
  dateSelectedAfter,
  currentDay,
  handleClickCell,
}: BuildNextMonthCellsParams) => {
  return Array.from({ length: count }, (_, i) => {
    const day = i + 1
    const isToday =
      day === currentDay &&
      titleMonth === dateTodayAfter.month &&
      titleYear === dateTodayAfter.year

    const isSelected =
      selectedDate.isSelected &&
      titleMonth === dateSelectedAfter.month &&
      titleYear === dateSelectedAfter.year &&
      titleDay === day

    return (
      <Cell
        key={`day-after-${day}`}
        today={isToday}
        isTaboo={false}
        dayAfter={day}
        selected={isSelected}
        selectedDateTitle={selectedDateTitle}
        handleClickCell={handleClickCell}
      />
    )
  })
}
