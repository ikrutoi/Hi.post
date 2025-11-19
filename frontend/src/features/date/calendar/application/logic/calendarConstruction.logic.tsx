import { useEffect, useMemo, useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
  shiftMonth,
} from '../../utils'
import { buildPreviousMonthCells } from './buildPreviousMonthCells'
import { buildCurrentMonthCells } from './buildCurrentMonthCells'
import { buildNextMonthCells } from './buildNextMonthCells'
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

  const daysInPreviousMonth = getDaysInPreviousMonth(year, month)
  const daysInCurrentMonth = getDaysInCurrentMonth(year, month)

  const offset = getFirstDayOfWeekFromDispatch(firstDayOfWeek, calendarViewDate)

  const dateTodayBefore = shiftMonth(
    currentDate.currentYear,
    currentDate.currentMonth,
    +1
  )
  const dateTodayAfter = shiftMonth(
    currentDate.currentYear,
    currentDate.currentMonth,
    -1
  )

  const { handleCellClickLogic } = useCalendarCellController({ triggerFlash })
  const handleClickCell = (params: HandleCellClickParams) => {
    handleCellClickLogic(params)
  }

  const dateSelectedBefore = !!selectedDispatchDate
    ? shiftMonth(year, month, +1)
    : { year: 0, month: 0 }

  const dateSelectedAfter = !!selectedDispatchDate
    ? shiftMonth(year, month, -1)
    : { year: 0, month: 0 }

  const previousCells = buildPreviousMonthCells(
    offset,
    daysInPreviousMonth,
    selectedDispatchDate,
    calendarViewDate,
    dateTodayBefore,
    dateSelectedBefore,
    currentDate.currentDay,
    handleClickCell
  )

  const currentCells = buildCurrentMonthCells({
    daysInCurrentMonth,
    selectedDispatchDate,
    calendarViewDate,
    currentDate,
    setSelectedDispatchDate,
    handleClickCell,
    cartItems,
  })

  const nextCells = buildNextMonthCells({
    count: 42 - offset - daysInCurrentMonth,
    selectedDispatchDate,
    calendarViewDate,
    dateTodayAfter,
    dateSelectedAfter,
    currentDay: currentDate.currentDay,
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
