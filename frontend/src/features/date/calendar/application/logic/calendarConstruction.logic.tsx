import { useMemo } from 'react'
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
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartItem } from '@cart/domain/types'

interface UseCalendarConstructionParams {
  dispatchDateTitle: DispatchDate
  dispatchDate: DispatchDate
  handleDispatchDate: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  handleClickCell: (direction: 'before' | 'after') => void
  isCountCart?: CartItem[]
  firstDayOfWeekTitle: 'Sun' | 'Mon'
}

const currentDate = getCurrentDate()

export const useCalendarConstruction = ({
  dispatchDateTitle,
  dispatchDate,
  handleDispatchDate,
  handleClickCell,
  isCountCart,
  firstDayOfWeekTitle,
}: UseCalendarConstructionParams) => {
  const isTitleSelected = dispatchDateTitle?.isSelected
  if (!isTitleSelected) return useMemo(() => [], [])

  const title = dispatchDateTitle
  const { year: titleYear, month: titleMonth, day: titleDay } = title

  const daysInPreviousMonth = getDaysInPreviousMonth(titleYear, titleMonth)
  const daysInCurrentMonth = getDaysInCurrentMonth(titleYear, titleMonth)
  const offset = getFirstDayOfWeekFromDispatch(firstDayOfWeekTitle, title)

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
    ? shiftMonth(dispatchDate.year, dispatchDate.month, +1)
    : { year: 0, month: 0 }

  const dateSelectedAfter = isCompleteDate(dispatchDate)
    ? shiftMonth(dispatchDate.year, dispatchDate.month, -1)
    : { year: 0, month: 0 }

  const previousCells = buildPreviousMonthCells(
    offset,
    daysInPreviousMonth,
    dispatchDate,
    title,
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
    dispatchDate,
    dispatchDateTitle: title,
    titleYear,
    titleMonth,
    titleDay,
    currentDate,
    handleDispatchDate,
    handleClickCell,
    isCountCart,
  })

  const nextCells = buildNextMonthCells({
    count: 42 - offset - daysInCurrentMonth,
    dispatchDate,
    dispatchDateTitle: title,
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
      titleYear,
      titleMonth,
      titleDay,
      dispatchDate,
      handleDispatchDate,
      handleClickCell,
      isCountCart,
      firstDayOfWeekTitle,
    ]
  )
}
