import { Cell } from '@date/cell/presentation/Cell'
import type { DispatchDate } from '@entities/date/domain/types'

interface BuildNextMonthCellsParams {
  count: number
  dispatchDate: DispatchDate
  dispatchDateTitle: DispatchDate
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
  dispatchDate,
  dispatchDateTitle,
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
      dispatchDate.isSelected &&
      titleMonth === dateSelectedAfter.month &&
      titleYear === dateSelectedAfter.year &&
      titleDay === day

    return (
      <Cell
        key={`day-after-${day}`}
        today={isToday}
        isTaboo={false}
        dayAfter={day}
        dispatchDate={isSelected}
        dispatchDateTitle={dispatchDateTitle}
        handleClickCell={handleClickCell}
      />
    )
  })
}
