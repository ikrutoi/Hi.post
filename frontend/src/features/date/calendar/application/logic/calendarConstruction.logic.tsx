import { useMemo } from 'react'
import { currentDate } from '../../domain/currentDate'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
  shiftMonth,
} from '../utils'
import { isCompleteDate } from '@entities/date/utils/guard'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartPostcard } from '@features/cart/publicApi'
import { buildPreviousMonthCells } from './buildPreviousMonthCells'
import { buildCurrentMonthCells } from './buildCurrentMonthCells'
import { buildNextMonthCells } from './buildNextMonthCells'

interface UseCalendarConstructionParams {
  selectedDateTitle: DispatchDate
  selectedDate: DispatchDate
  handleSelectedDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  isCountCart?: CartPostcard[]
  firstDayOfWeekTitle: 'Sun' | 'Mon'
}

export const useCalendarConstruction = ({
  selectedDateTitle,
  selectedDate,
  handleSelectedDate,
  handleClickCell,
  isCountCart,
  firstDayOfWeekTitle,
}: UseCalendarConstructionParams) => {
  if (!selectedDateTitle.isSelected) return []

  const {
    year: titleYear,
    month: titleMonth,
    day: titleDay,
  } = selectedDateTitle

  const daysInPreviousMonth = getDaysInPreviousMonth(titleYear, titleMonth)
  const daysInCurrentMonth = getDaysInCurrentMonth(titleYear, titleMonth)
  const offset = getFirstDayOfWeekFromDispatch(
    firstDayOfWeekTitle,
    selectedDateTitle
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

  const dateSelectedBefore = isCompleteDate(selectedDate)
    ? shiftMonth(selectedDate.year, selectedDate.month, +1)
    : { year: 0, month: 0 }

  const dateSelectedAfter = isCompleteDate(selectedDate)
    ? shiftMonth(selectedDate.year, selectedDate.month, -1)
    : { year: 0, month: 0 }

  const previousCells = buildPreviousMonthCells(
    offset,
    daysInPreviousMonth,
    selectedDate,
    selectedDateTitle,
    dateTodayBefore,
    dateSelectedBefore,
    titleYear,
    titleMonth,
    titleDay,
    currentDate.currentDay,
    handleClickCell
  )

  const currentCells = buildCurrentMonthCells({
    daysInCurrentMonth,
    selectedDate,
    selectedDateTitle,
    titleYear,
    titleMonth,
    titleDay,
    currentDate,
    handleSelectedDate,
    handleClickCell,
    isCountCart,
  })

  const nextCells = buildNextMonthCells({
    count: 42 - offset - daysInCurrentMonth,
    selectedDate,
    selectedDateTitle,
    titleYear,
    titleMonth,
    titleDay,
    dateTodayAfter,
    dateSelectedAfter,
    currentDay: currentDate.currentDay,
    handleClickCell,
  })

  return useMemo(
    () => [...previousCells, ...currentCells, ...nextCells],
    [
      selectedDateTitle,
      selectedDate,
      handleSelectedDate,
      handleClickCell,
      isCountCart,
      firstDayOfWeekTitle,
    ]
  )
}
