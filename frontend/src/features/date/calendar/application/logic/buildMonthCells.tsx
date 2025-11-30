import { Cell } from '@date/cell/presentation/Cell'
import { CartDatePreview } from '../../presentation/CalendarWeekdayHeader/CartDatePreview/CartDatePreview'
import { isSameDate } from '../helpers'
import { isDisabledDate } from '@entities/date/utils'
import type {
  SelectedDispatchDate,
  CalendarViewDate,
  DispatchDate,
} from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { MonthDirection } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'

interface BuildMonthCellsParams {
  days: number[]
  direction: MonthDirection
  calendarViewDate: CalendarViewDate
  selectedDispatchDate: SelectedDispatchDate
  currentDate: { currentDay: number; currentMonth: number; currentYear: number }
  handleClickCell: (params: HandleCellClickParams) => void
  setSelectedDispatchDate?: (date: DispatchDate) => void
  cartItems?: CartItem[]
}

export const buildMonthCells = ({
  days,
  direction,
  calendarViewDate,
  selectedDispatchDate,
  currentDate,
  handleClickCell,
  setSelectedDispatchDate,
  cartItems,
}: BuildMonthCellsParams) => {
  if (!calendarViewDate) return []

  const { year: viewYear, month: viewMonth } = calendarViewDate

  return days.map((day) => {
    const isToday =
      day === currentDate.currentDay &&
      viewMonth === currentDate.currentMonth &&
      viewYear === currentDate.currentYear

    const isSelectedDispatchDate = isSameDate(direction, selectedDispatchDate, {
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
        isSelectedDispatchDate={isSelectedDispatchDate}
        onClickCell={handleClickCell}
      >
        {/* {direction === 'current' && cartItems && (
          <CartDatePreview
            day={day}
            cartItem={cartItems[0]}
            countCartCards={cartItems.length}
            handleImageCartDateClick={() => {}}
            handleCellCartDateClick={() =>
              setSelectedDispatchDate?.({
                year: calendarViewDate.year,
                month: calendarViewDate.month,
                day,
              })
            }
          />
        )} */}
      </Cell>
    )
  })
}
