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
  selectedDispatchDate: SelectedDispatchDate
  firstDayOfWeek: 'Sun' | 'Mon'
  calendarViewDate: CalendarViewDate
  setSelectedDispatchDate: (date: DispatchDate) => void
  triggerFlash: (part: Switcher) => void
}

const currentDate = getCurrentDate()

export const useCalendarConstruction = ({
  selectedDispatchDate,
  firstDayOfWeek,
  calendarViewDate,
  setSelectedDispatchDate,
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
    selectedDispatchDate,
    currentDate,
    handleClickCell,
  })

  const currentCells = buildMonthCells({
    days: currDays,
    direction: 'current',
    calendarViewDate,
    selectedDispatchDate,
    currentDate,
    handleClickCell,
    setSelectedDispatchDate,
    cartItems,
  })

  const nextCells = buildMonthCells({
    days: nextDays,
    direction: 'after',
    calendarViewDate,
    selectedDispatchDate,
    currentDate,
    handleClickCell,
  })

  return useMemo(
    () => [...previousCells, ...currentCells, ...nextCells],
    [
      year,
      month,
      selectedDispatchDate,
      setSelectedDispatchDate,
      handleClickCell,
      cartItems,
      firstDayOfWeek,
    ]
  )
}
