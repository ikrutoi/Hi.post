import { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { getCurrentDate } from '@shared/utils/date'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
} from '../../utils'
import { buildMonthCells } from '../logic'
import { useCalendarCellController } from '@date/cell/application/hooks'
import type { DispatchDate, CalendarViewDate, Switcher } from '@entities/date/domain/types'
import type { HandleCellClickParams } from '../../../cell/domain/types'
import { selectCardsByDateMap } from '@entities/card/infrastructure/selectors'
import { selectMergedDispatchDates } from '@date/infrastructure/selectors'

interface UseCalendarConstructionParams {
  firstDayOfWeek: 'Sun' | 'Mon'
  calendarViewDate: CalendarViewDate
  chooseDate: (date: DispatchDate) => void
  triggerFlash: (part: Switcher) => void
}

const currentDate = getCurrentDate()

export const useCalendarConstruction = ({
  firstDayOfWeek,
  calendarViewDate,
  chooseDate,
  triggerFlash,
}: UseCalendarConstructionParams) => {
  const cardsMap = useAppSelector(selectCardsByDateMap)
  const highlightDates = useAppSelector(selectMergedDispatchDates)
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
    (_, i) => daysInPrevMonth - i,
  ).reverse()
  const currDays = Array.from({ length: daysInCurrMonth }, (_, i) => i + 1)
  const nextDays = Array.from(
    { length: 42 - offset - daysInCurrMonth },
    (_, i) => i + 1,
  )

  const previousCells = buildMonthCells({
    days: prevDays,
    direction: 'before',
    calendarViewDate,
    highlightDates,
    currentDate,
    handleClickCell,
    cardsMap,
  })

  const currentCells = buildMonthCells({
    days: currDays,
    direction: 'current',
    calendarViewDate,
    highlightDates,
    currentDate,
    handleClickCell,
    chooseDate,
    cardsMap,
  })

  const nextCells = buildMonthCells({
    days: nextDays,
    direction: 'after',
    calendarViewDate,
    highlightDates,
    currentDate,
    handleClickCell,
    cardsMap,
  })

  return useMemo(
    () => [...previousCells, ...currentCells, ...nextCells],
    [
      year,
      month,
      highlightDates,
      chooseDate,
      handleClickCell,
      cardsMap,
      firstDayOfWeek,
    ],
  )
}
