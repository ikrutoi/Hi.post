import { Cell } from '@date/cell/presentation/Cell'
import type {
  DispatchDate,
  SelectedDispatchDate,
  CalendarViewDate,
} from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'

interface BuildNextMonthCellsParams {
  count: number
  selectedDispatchDate: SelectedDispatchDate
  calendarViewDate: CalendarViewDate
  dateTodayAfter: { year: number; month: number }
  dateSelectedAfter: { year: number; month: number }
  currentDay: number
  handleClickCell: (params: HandleCellClickParams) => void
}

export const buildNextMonthCells = ({
  count,
  selectedDispatchDate,
  calendarViewDate,
  dateTodayAfter,
  dateSelectedAfter,
  currentDay,
  handleClickCell,
}: BuildNextMonthCellsParams) => {
  return Array.from({ length: count }, (_, i) => {
    const day = i + 1
    const isToday =
      day === currentDay &&
      selectedDispatchDate?.month === dateTodayAfter.month &&
      selectedDispatchDate.year === dateTodayAfter.year

    const isSelectedDispatchDate =
      !!selectedDispatchDate &&
      selectedDispatchDate.month === dateSelectedAfter.month &&
      selectedDispatchDate.year === dateSelectedAfter.year &&
      selectedDispatchDate.day === day

    return (
      <Cell
        key={`day-after-${day}`}
        dayAfter={day}
        calendarViewDate={calendarViewDate}
        direction={'after'}
        isToday={isToday}
        isDisabledDate={false}
        isSelectedDispatchDate={isSelectedDispatchDate}
        // selectedDispatchDate={selectedDispatchDate}
        handleClickCell={handleClickCell}
      />
    )
  })
}
