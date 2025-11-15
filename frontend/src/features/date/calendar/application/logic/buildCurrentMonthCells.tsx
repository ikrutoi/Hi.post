import { isDisabledDate } from '@entities/date/utils'
import { changeCartDay } from './changeCartDay'
import { Cell } from '../../../cell/presentation/Cell'
import { CartDatePreview } from '../../presentation/CalendarWeekdayHeader/CartDatePreview/CartDatePreview'
import { isSameDate } from '../helpers'
import { currentDate } from '@features/date/calendar/domain/models'
import type {
  DispatchDate,
  SelectedDispatchDate,
  CalendarViewDate,
  MonthDirection,
} from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'

interface BuildCurrentMonthCellsParams {
  daysInCurrentMonth: number
  selectedDispatchDate: SelectedDispatchDate
  calendarViewDate: CalendarViewDate
  currentDate: {
    currentDay: number
    currentMonth: number
    currentYear: number
  }
  setSelectedDispatchDate: (date: DispatchDate) => void
  handleClickCell: (params: HandleCellClickParams) => void
  cartItems?: CartItem[]
}

export const buildCurrentMonthCells = ({
  daysInCurrentMonth,
  selectedDispatchDate,
  calendarViewDate,
  currentDate,
  setSelectedDispatchDate,
  handleClickCell,
  cartItems,
}: BuildCurrentMonthCellsParams) => {
  if (!calendarViewDate) return []

  const { year: viewYear, month: viewMonth } = calendarViewDate

  return Array.from({ length: daysInCurrentMonth }, (_, i) => {
    const day = i + 1
    const isToday =
      day === currentDate.currentDay &&
      viewMonth === currentDate.currentMonth &&
      viewYear === currentDate.currentYear

    const isSelectedDispatchDate = isSameDate(selectedDispatchDate, {
      year: viewYear,
      month: viewMonth,
      day,
    })

    const cellDate: DispatchDate = {
      year: viewYear,
      month: viewMonth,
      day,
    }

    const cartItemsForDay =
      cartItems?.filter(
        (item) => item.card.date && isSameDate(item.card.date, cellDate)
      ) ?? []

    const cartItem = cartItemsForDay[0]
    const cartItemCount = cartItemsForDay.length

    return (
      <Cell
        key={`day-${day}`}
        dayCurrent={day}
        calendarViewDate={calendarViewDate}
        direction={'current'}
        isToday={isToday}
        isDisabledDate={isDisabledDate(day, calendarViewDate, currentDate)}
        // setSelectedDispatchDate={setSelectedDispatchDate}
        isSelectedDispatchDate={isSelectedDispatchDate}
        // selectedDispatchDate={selectedDispatchDate}
        handleClickCell={handleClickCell}
      >
        {cartItem && (
          <CartDatePreview
            day={day}
            cartItem={cartItem}
            countCartCards={cartItemCount}
            handleImageCartDateClick={(evt) => {
              // можно вынести в отдельную функцию
            }}
            handleCellCartDateClick={() => {
              setSelectedDispatchDate({ year: viewYear, month: viewMonth, day })
            }}
          />
        )}
      </Cell>
    )
  })
}
