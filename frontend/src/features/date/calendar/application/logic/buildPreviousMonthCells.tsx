import { Cell } from '@date/cell/presentation/Cell'
import type { DispatchDate } from '@entities/date/domain/types'

export const buildPreviousMonthCells = (
  offset: number,
  daysInPreviousMonth: number,
  dispatchDate: DispatchDate,
  dispatchDateTitle: DispatchDate,
  dateTodayBefore: { year: number; month: number },
  dateSelectedBefore: { year: number; month: number },
  titleYear: number,
  titleMonth: number,
  titleDay: number,
  currentDay: number,
  handleClickCell: (direction: 'before' | 'after') => void
) => {
  const previousMonth: number[] = []
  for (let day = 0; day < offset; day++) {
    previousMonth.unshift(daysInPreviousMonth - day)
  }

  return previousMonth.map((day) => (
    <Cell
      key={`day-before-${day}`}
      today={
        day === currentDay &&
        titleMonth === dateTodayBefore.month &&
        titleYear === dateTodayBefore.year
      }
      dayBefore={day}
      isTaboo={false}
      dispatchDate={
        dispatchDate.isSelected &&
        titleMonth === dateSelectedBefore.month &&
        titleYear === dateSelectedBefore.year &&
        titleDay === day
      }
      dispatchDateTitle={dispatchDateTitle}
      handleClickCell={handleClickCell}
    />
  ))
}
