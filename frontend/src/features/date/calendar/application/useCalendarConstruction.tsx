import { useMemo } from 'react'
import { Cell } from '../../presentation/Calendar/Cell/Cell'
import { currentDate } from '../../domain/currentDate'
import {
  getDaysInPreviousMonth,
  getDaysInCurrentMonth,
  getFirstDayOfWeekFromDispatch,
  shiftMonth,
} from '../utils'
import { isCompleteDate } from '@entities/date/utils/guard'
import { isTabooDate } from '@entities/date/utils/isTabooDate'
import type { DispatchDate } from '@entities/date/domain/dispatchDate'
import type { CartPostcard } from '@features/cart/publicApi'

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

  const changeCartDay = (
    day: number,
    month: number,
    year: number
  ): CartPostcard[] => {
    const targetDate = { year, month, day }
    return (
      isCountCart?.filter((card) => {
        const [y, m, d] = card.date.split('-').map(Number)
        return (
          y === targetDate.year &&
          m === targetDate.month &&
          d === targetDate.day
        )
      }) ?? []
    )
  }

  const calendarCells = useMemo(() => {
    const previousMonth: number[] = []
    const offset = getFirstDayOfWeekFromDispatch(
      firstDayOfWeekTitle,
      selectedDateTitle
    )

    for (let day = 0; day < offset; day++) {
      previousMonth.unshift(daysInPreviousMonth - day)
    }

    const cells = [
      ...previousMonth.map((day) => (
        <Cell
          key={`day-before-${day}`}
          today={
            day === currentDate.currentDay &&
            titleMonth === dateTodayBefore.month &&
            titleYear === dateTodayBefore.year
          }
          dayBefore={day}
          isTaboo={false}
          selected={
            selectedDate.isSelected &&
            titleMonth === dateSelectedBefore.month &&
            titleYear === dateSelectedBefore.year &&
            titleDay === day
          }
          selectedDateTitle={selectedDateTitle}
          handleClickCell={handleClickCell}
        />
      )),

      ...Array.from({ length: daysInCurrentMonth }, (_, i) => {
        const day = i + 1
        return (
          <Cell
            key={`day-${day}`}
            today={
              day === currentDate.currentDay &&
              titleMonth === currentDate.currentMonth &&
              titleYear === currentDate.currentYear
            }
            isTaboo={isTabooDate(day, selectedDateTitle, currentDate)}
            dayCurrent={day}
            handleSelectedDate={handleSelectedDate}
            selected={
              selectedDate.isSelected &&
              selectedDate.year === titleYear &&
              selectedDate.month === titleMonth &&
              selectedDate.day === day
            }
            selectedDateTitle={selectedDateTitle}
            cartDay={
              isCountCart
                ? changeCartDay(day, titleMonth, titleYear)
                : undefined
            }
            handleClickCell={handleClickCell}
          />
        )
      }),

      ...Array.from(
        { length: 42 - previousMonth.length - daysInCurrentMonth },
        (_, i) => {
          const day = i + 1
          return (
            <Cell
              key={`day-after-${day}`}
              today={
                day === currentDate.currentDay &&
                titleMonth === dateTodayAfter.month &&
                titleYear === dateTodayAfter.year
              }
              isTaboo={false}
              dayAfter={day}
              selected={
                selectedDate.isSelected &&
                titleMonth === dateSelectedAfter.month &&
                titleYear === dateSelectedAfter.year &&
                titleDay === day
              }
              selectedDateTitle={selectedDateTitle}
              handleClickCell={handleClickCell}
            />
          )
        }
      ),
    ]

    return cells
  }, [
    selectedDateTitle,
    selectedDate,
    handleSelectedDate,
    handleClickCell,
    isCountCart,
    firstDayOfWeekTitle,
  ])

  return calendarCells
}
