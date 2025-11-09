import { useEffect, useMemo, useState } from 'react'
import { getCurrentDate } from '@shared/utils/date'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
  shiftMonth,
} from '../../utils'
import { isCompleteDate } from '@entities/date/utils/guard'
import { buildPreviousMonthCells } from './buildPreviousMonthCells'
import { buildCurrentMonthCells } from './buildCurrentMonthCells'
import { buildNextMonthCells } from './buildNextMonthCells'
import { cartAdapter } from '@db/adapters/storeAdapters'
import type {
  DispatchDate,
  SelectedDispatchDate,
} from '@entities/date/domain/types'
import type { CartItem } from '@entities/cart/domain/types'

interface UseCalendarConstructionParams {
  dispatchDate: SelectedDispatchDate
  handleDispatchDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  firstDayOfWeekTitle: 'Sun' | 'Mon'
}

const currentDate = getCurrentDate()

export const useCalendarConstruction = ({
  dispatchDate,
  handleDispatchDate,
  handleClickCell,
  firstDayOfWeekTitle,
}: UseCalendarConstructionParams) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const loadCartItems = async () => {
      const items = await cartAdapter.getAll()
      setCartItems(items)
    }
    loadCartItems()
  }, [])

  if (!dispatchDate) return useMemo(() => [], [])

  const { year, month, day } = dispatchDate

  const daysInPreviousMonth = getDaysInPreviousMonth(year, month)
  const daysInCurrentMonth = getDaysInCurrentMonth(year, month)
  const offset = getFirstDayOfWeekFromDispatch(
    firstDayOfWeekTitle,
    dispatchDate
  )

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

  const dateSelectedBefore = isCompleteDate(dispatchDate)
    ? shiftMonth(year, month, +1)
    : { year: 0, month: 0 }

  const dateSelectedAfter = isCompleteDate(dispatchDate)
    ? shiftMonth(year, month, -1)
    : { year: 0, month: 0 }

  const previousCells = buildPreviousMonthCells(
    offset,
    daysInPreviousMonth,
    dispatchDate,
    dateTodayBefore,
    dateSelectedBefore,
    currentDate.currentDay,
    handleClickCell
  )

  const currentCells = buildCurrentMonthCells({
    daysInCurrentMonth,
    dispatchDate,
    currentDate,
    handleDispatchDate,
    handleClickCell,
    cartItems,
  })

  const nextCells = buildNextMonthCells({
    count: 42 - offset - daysInCurrentMonth,
    dispatchDate,
    year,
    month,
    day,
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
      day,
      dispatchDate,
      handleDispatchDate,
      handleClickCell,
      cartItems,
      firstDayOfWeekTitle,
    ]
  )
}
