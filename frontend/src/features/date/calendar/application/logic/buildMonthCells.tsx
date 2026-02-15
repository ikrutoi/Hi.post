import { Cell } from '@date/cell/presentation/Cell'
import { CardPreview } from '@features/date/cardPreview/presentation/CardPreview'
import { CartDatePreview } from '../../presentation/CalendarWeekdayHeader/CartDatePreview/CartDatePreview'
import { isSameDate, shiftMonth } from '../helpers'
import { isDisabledDate } from '@entities/date/utils'
import type {
  SelectedDispatchDate,
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { MonthDirection } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import {
  CalendarCardItem,
  CardCalendarIndex,
} from '@entities/card/domain/types'

interface BuildMonthCellsParams {
  days: number[]
  direction: MonthDirection
  calendarViewDate: CalendarViewDate
  selectedDate: SelectedDispatchDate
  currentDate: { day: number; month: number; year: number }
  handleClickCell: (params: HandleCellClickParams) => void
  chooseDate?: (date: DispatchDate) => void
  cartItems?: CartItem[]
  cardsMap: Record<string, CardCalendarIndex>
}

export const buildMonthCells = ({
  days,
  direction,
  calendarViewDate,
  selectedDate,
  currentDate,
  handleClickCell,
  chooseDate,
  cartItems,
  cardsMap,
}: BuildMonthCellsParams) => {
  if (!calendarViewDate) return []

  const { year: viewYear, month: viewMonth } = calendarViewDate

  const { year: currentViewYear, month: currentViewMonth } = shiftMonth(
    calendarViewDate,
    direction,
  )

  return days.map((day) => {
    const dateKey = `${currentViewYear}-${currentViewMonth}-${day}`
    const dayData = cardsMap[dateKey]
    console.log('dayData', dayData)

    const isToday =
      day === currentDate.day &&
      currentViewMonth === currentDate.month &&
      currentViewYear === currentDate.year

    const isSelectedDate = isSameDate(direction, selectedDate, {
      year: viewYear,
      month: viewMonth,
      day,
    })

    return (
      <Cell
        key={`${direction}-${day}`}
        {...(direction === 'before' ? { dayBefore: day } : {})}
        {...(direction === 'current' ? { dayCurrent: day } : {})}
        {...(direction === 'after' ? { dayAfter: day } : {})}
        calendarViewDate={calendarViewDate}
        direction={direction}
        isToday={isToday}
        isDisabledDate={isDisabledDate(day, calendarViewDate, currentDate)}
        isSelectedDate={isSelectedDate}
        onClickCell={handleClickCell}
      >
        {dayData && <CardPreview data={dayData} />}
      </Cell>
    )
  })
}
