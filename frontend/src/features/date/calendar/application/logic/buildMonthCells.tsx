import { Cell } from '@date/cell/presentation/Cell'
import { CardPreview } from '@features/date/cardPreview/presentation/CardPreview'
import { shiftMonth } from '../helpers'
import { isDisabledDate } from '@entities/date/utils'
import type { CalendarViewDate, DispatchDate } from '@entities/date/domain/types'
import type { MonthDirection } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import type { CardCalendarIndex } from '@entities/card/domain/types'

interface BuildMonthCellsParams {
  days: number[]
  direction: MonthDirection
  calendarViewDate: CalendarViewDate
  highlightDates: DispatchDate[]
  currentDate: { day: number; month: number; year: number }
  handleClickCell: (params: HandleCellClickParams) => void
  chooseDate?: (date: DispatchDate) => void
  cardsMap: Record<string, CardCalendarIndex>
}

export const buildMonthCells = ({
  days,
  direction,
  calendarViewDate,
  highlightDates,
  currentDate,
  handleClickCell,
  chooseDate,
  cardsMap,
}: BuildMonthCellsParams) => {
  if (!calendarViewDate) return []

  const { year: currentViewYear, month: currentViewMonth } = shiftMonth(
    calendarViewDate,
    direction,
  )

  return days.map((day) => {
    const dateKey = `${currentViewYear}-${currentViewMonth}-${day}`
    const dayData = cardsMap[dateKey]

    const isToday =
      day === currentDate.day &&
      currentViewMonth === currentDate.month &&
      currentViewYear === currentDate.year

    const isSelectedDate = highlightDates.some(
      (d) =>
        d.year === currentViewYear &&
        d.month === currentViewMonth &&
        d.day === day,
    )

    // Use actual cell date for disabled check (before/after are prev/next month)
    const cellDate = {
      year: currentViewYear,
      month: currentViewMonth,
    }

    return (
      <Cell
        key={`${direction}-${day}`}
        {...(direction === 'before' ? { dayBefore: day } : {})}
        {...(direction === 'current' ? { dayCurrent: day } : {})}
        {...(direction === 'after' ? { dayAfter: day } : {})}
        calendarViewDate={calendarViewDate}
        direction={direction}
        isToday={isToday}
        isDisabledDate={isDisabledDate(day, cellDate, currentDate)}
        isSelectedDate={isSelectedDate}
        onClickCell={handleClickCell}
        dateKey={dateKey}
        dayData={dayData}
      >
        {dayData && <CardPreview data={dayData} />}
      </Cell>
    )
  })
}
