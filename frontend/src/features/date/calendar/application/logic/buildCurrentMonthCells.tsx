import { isTabooDate } from '@entities/date/utils/isTabooDate'
import { changeCartDay } from './changeCartDay'
import { Cell } from '../../../cell/presentation/Cell'
import { CartDatePreview } from '../../presentation/CalendarWeekTitle/CartDatePreview/CartDatePreview'
import { isSameDispatchDate } from '../../../application/helpers'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'

interface BuildCurrentMonthCellsParams {
  daysInCurrentMonth: number
  dispatchDate: DispatchDate
  currentDate: {
    currentDay: number
    currentMonth: number
    currentYear: number
  }
  handleDispatchDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  cartItems?: CartItem[]
}

export const buildCurrentMonthCells = ({
  daysInCurrentMonth,
  dispatchDate,
  currentDate,
  handleDispatchDate,
  handleClickCell,
  cartItems,
}: BuildCurrentMonthCellsParams) => {
  if (!dispatchDate.isSelected) return []

  const { year: viewYear, month: viewMonth, day: viewDay } = dispatchDate

  return Array.from({ length: daysInCurrentMonth }, (_, i) => {
    const day = i + 1
    const isToday =
      day === currentDate.currentDay &&
      viewMonth === currentDate.currentMonth &&
      viewYear === currentDate.currentYear

    const isSelected =
      dispatchDate.isSelected &&
      dispatchDate.year === viewYear &&
      dispatchDate.month === viewMonth &&
      dispatchDate.day === viewDay

    const cellDate: DispatchDate = {
      isSelected: true,
      year: viewYear,
      month: viewMonth,
      day,
    }

    const cartItemsForDay =
      cartItems?.filter(
        (item) =>
          item.card.date.isComplete &&
          isSameDispatchDate(item.card.date.data, cellDate)
      ) ?? []

    const cartItem = cartItemsForDay[0]
    const cartItemCount = cartItemsForDay.length

    return (
      <Cell
        key={`day-${day}`}
        today={isToday}
        isTaboo={isTabooDate(day, dispatchDate, currentDate)}
        dayCurrent={day}
        handleDispatchDate={handleDispatchDate}
        isSelected={isSelected}
        dispatchDate={dispatchDate}
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
              handleDispatchDate(
                isTabooDate(day, dispatchDate, currentDate),
                viewYear,
                viewMonth,
                day
              )
            }}
          />
        )}
      </Cell>
    )
  })
}
