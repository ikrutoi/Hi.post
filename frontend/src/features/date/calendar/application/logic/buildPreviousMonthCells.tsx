import { Cell } from '@date/cell/presentation/Cell'
import type {
  SelectedDispatchDate,
  CalendarViewDate,
} from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'

export const buildPreviousMonthCells = (
  offset: number,
  daysInPreviousMonth: number,
  selectedDispatchDate: SelectedDispatchDate,
  calendarViewDate: CalendarViewDate,
  dateTodayBefore: { year: number; month: number },
  dateSelectedBefore: { year: number; month: number },
  currentDay: number,
  handleClickCell: (params: HandleCellClickParams) => void
) => {
  const previousMonth: number[] = []
  for (let day = 0; day < offset; day++) {
    previousMonth.unshift(daysInPreviousMonth - day)
  }

  return previousMonth.map((day) => (
    <Cell
      key={`day-before-${day}`}
      dayBefore={day}
      calendarViewDate={calendarViewDate}
      direction={'before'}
      isToday={
        !!selectedDispatchDate &&
        day === currentDay &&
        selectedDispatchDate.month === dateTodayBefore.month &&
        selectedDispatchDate.year === dateTodayBefore.year
      }
      isDisabledDate={false}
      isSelectedDispatchDate={
        !!selectedDispatchDate &&
        selectedDispatchDate.year === dateSelectedBefore.year &&
        selectedDispatchDate.month === dateSelectedBefore.month &&
        selectedDispatchDate.day === day
      }
      onClickCell={handleClickCell}
    />
  ))
}
