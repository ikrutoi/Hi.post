import { Cell } from '../../presentation/Calendar/Cell/Cell'
import type { DispatchDate } from '@entities/date/domain/types'

export const buildPreviousMonthCells = (
  offset: number,
  daysInPreviousMonth: number,
  selectedDate: DispatchDate,
  selectedDateTitle: DispatchDate,
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
      today={day === currentDay && titleMonth === dateTodayBefore.month && titleYear === dateTodayBefore.year}
      dayBefore={day}
      isTaboo={false}
      selected={
        selectedDate.isSelected &&
        titleMonth === dateSelectedBefore.month &&
        titleYear === dateSelectedBefore.year &&
        titleDay === day
      }
      selectedDateTitle={selectedDateTitle}
      handleClickCell={handleClickCell}
    />
  ))
}
