import { useEffect, useMemo, useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
  shiftMonth,
} from '../../utils'
import { buildMonthCells } from '../logic'
import { cartAdapter } from '@db/adapters/storeAdapters'
import { useCalendarCellController } from '@date/cell/application/hooks'
import type {
  DispatchDate,
  SelectedDispatchDate,
  CalendarViewDate,
  Switcher,
} from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'

interface UseCalendarConstructionParams {
  selectedDate: SelectedDispatchDate
  firstDayOfWeek: 'Sun' | 'Mon'
  calendarViewDate: CalendarViewDate
  chooseDate: (date: DispatchDate) => void
  triggerFlash: (part: Switcher) => void
}

const currentDate = getCurrentDate()

export const useCalendarConstruction = ({
  selectedDate,
  firstDayOfWeek,
  calendarViewDate,
  chooseDate,
  triggerFlash,
}: UseCalendarConstructionParams) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const loadCartItems = async () => {
      const items = await cartAdapter.getAll()
      setCartItems(items)
    }
    loadCartItems()
  }, [])

  const { year, month } = calendarViewDate

  const daysInPrevMonth = getDaysInPreviousMonth(year, month)
  const daysInCurrMonth = getDaysInCurrentMonth(year, month)

  const offset = getFirstDayOfWeekFromDispatch(firstDayOfWeek, calendarViewDate)

  const { handleCellClickLogic } = useCalendarCellController({ triggerFlash })

  const handleClickCell = (params: HandleCellClickParams) => {
    handleCellClickLogic(params)
  }

  const prevDays = Array.from(
    { length: offset },
    (_, i) => daysInPrevMonth - i
  ).reverse()
  const currDays = Array.from({ length: daysInCurrMonth }, (_, i) => i + 1)
  const nextDays = Array.from(
    { length: 42 - offset - daysInCurrMonth },
    (_, i) => i + 1
  )

  const previousCells = buildMonthCells({
    days: prevDays,
    direction: 'before',
    calendarViewDate,
    selectedDate,
    currentDate,
    handleClickCell,
  })

  const currentCells = buildMonthCells({
    days: currDays,
    direction: 'current',
    calendarViewDate,
    selectedDate,
    currentDate,
    handleClickCell,
    chooseDate,
    cartItems,
  })

  const nextCells = buildMonthCells({
    days: nextDays,
    direction: 'after',
    calendarViewDate,
    selectedDate,
    currentDate,
    handleClickCell,
  })

  return useMemo(
    () => [...previousCells, ...currentCells, ...nextCells],
    [
      year,
      month,
      selectedDate,
      chooseDate,
      handleClickCell,
      cartItems,
      firstDayOfWeek,
    ]
  )
}
