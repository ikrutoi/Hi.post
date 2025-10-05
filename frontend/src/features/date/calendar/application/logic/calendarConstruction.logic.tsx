import { useMemo } from 'react'

import { getCurrentDate } from '@shared/utils/date'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
  shiftMonth,
} from '../../utils'
import { isCompleteDate } from '@entities/date/utils/guard'
import type { DispatchDate } from '@entities/date/domain/types'
import type { Cart } from '@cart/domain/types'
import { buildPreviousMonthCells } from './buildPreviousMonthCells'
import { buildCurrentMonthCells } from './buildCurrentMonthCells'
import { buildNextMonthCells } from './buildNextMonthCells'

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
  isCountCart?: Cart[]
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
  if (!dispatchDateTitle.isSelected) return []

  const {
    year: titleYear,
    month: titleMonth,
    day: titleDay,
  } = dispatchDateTitle

  const daysInPreviousMonth = getDaysInPreviousMonth(titleYear, titleMonth)
  const daysInCurrentMonth = getDaysInCurrentMonth(titleYear, titleMonth)
  const offset = getFirstDayOfWeekFromDispatch(
    firstDayOfWeekTitle,
    dispatchDateTitle
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
    ? shiftMonth(dispatchDate.year, dispatchDate.month, +1)
    : { year: 0, month: 0 }

  const dateSelectedAfter = isCompleteDate(dispatchDate)
    ? shiftMonth(dispatchDate.year, dispatchDate.month, -1)
    : { year: 0, month: 0 }

  const previousCells = buildPreviousMonthCells(
    offset,
    daysInPreviousMonth,
    dispatchDate,
    dispatchDateTitle,
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
    dispatchDateTitle,
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
    dispatchDateTitle,
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
      dispatchDateTitle,
      dispatchDate,
      handleDispatchDate,
      handleClickCell,
      isCountCart,
      firstDayOfWeekTitle,
    ]
  )
}
