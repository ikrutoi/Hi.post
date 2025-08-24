import React, { useState } from 'react'

import './Calendar.scss'

import { Cell } from './Cell/Cell'
import { CalendarWeekTitle } from '../CalendarWeekTitle/CalendarWeekTitle'

import {
  daysOfWeekStartFromMon,
  daysOfWeekStartFromSun,
} from '@features/date/publicApi.ts'
import { parseDateString, isSameDate } from '@shared/lib/date'
import {
  numberDaysInPreviousMonth,
  numberDaysInCurrentMonth,
  firstDayOfWeek,
} from '@features/date/utils'
import { currentDate } from '@features/date/publicApi.ts'
import { CartPostcard } from '@features/cart/publicApi'

import type { CalendarProps } from '@features/date/publicApi.ts'

export const Calendar: React.FC<CalendarProps> = ({
  selectedDate,
  selectedDateTitle,
  handleSelectedDate,
  handleClickCell,
  cart,
}) => {
  const [firstDayOfWeekTitle, setFirstDayOfWeek] = useState<'Sun' | 'Mon'>(
    'Sun'
  )
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>(daysOfWeekStartFromSun)

  const handleFirstDay = (firstDay: 'Sun' | 'Mon') => {
    setFirstDayOfWeek(firstDay)
    setDaysOfWeek(
      firstDay === 'Sun' ? daysOfWeekStartFromSun : daysOfWeekStartFromMon
    )
  }

  const daysInPreviousMonth = numberDaysInPreviousMonth(
    selectedDateTitle.year,
    selectedDateTitle.month
  )

  const daysInCurrentMonth = numberDaysInCurrentMonth(
    selectedDateTitle.year,
    selectedDateTitle.month
  )

  const changeCartDay = (
    day: number,
    month: number,
    year: number
  ): CartPostcard[] => {
    const targetDate = { year, month, day }

    return (
      cart?.filter((card) => {
        const cardDate = parseDateString(card.date)
        return isSameDate(cardDate, targetDate)
      }) ?? []
    )
  }

  const constructionMonth = () => {
    const previousMonth: number[] = []
    for (
      let day = 0;
      day < firstDayOfWeek(firstDayOfWeekTitle, selectedDateTitle);
      day++
    ) {
      previousMonth.unshift(daysInPreviousMonth - day)
    }

    const dateTodayBefore = () => {
      return currentDate.currentMonth < 11
        ? { year: currentDate.currentYear, month: currentDate.currentMonth + 1 }
        : { year: currentDate.currentYear + 1, month: 0 }
    }

    const dateTodayAfter = () => {
      return currentDate.currentMonth > 0
        ? { year: currentDate.currentYear, month: currentDate.currentMonth - 1 }
        : { year: currentDate.currentYear - 1, month: 11 }
    }

    const dateSelectedBefore = () => {
      return selectedDate
        ? selectedDate.month < 11
          ? { year: selectedDate.year, month: selectedDate.month + 1 }
          : { year: selectedDate.year + 1, month: 0 }
        : { year: 0, month: 0 }
    }

    const dateSelectedAfter = () => {
      return selectedDate
        ? selectedDate.month > 0
          ? { year: selectedDate.year, month: selectedDate.month - 1 }
          : { year: selectedDate.year - 1, month: 11 }
        : { year: 0, month: 0 }
    }

    const getTabooDays = (day: number): boolean => {
      return (
        (selectedDateTitle.month === currentDate.currentMonth &&
          selectedDateTitle.year === currentDate.currentYear &&
          day <= currentDate.currentDay + 5) ||
        selectedDateTitle.year < currentDate.currentYear ||
        (selectedDateTitle.year === currentDate.currentYear &&
          selectedDateTitle.month < currentDate.currentMonth)
      )
    }

    const month = [
      ...previousMonth.map((day) => (
        <Cell
          key={`day-before-${day}`}
          today={
            day === currentDate.currentDay &&
            selectedDateTitle.month === dateTodayBefore().month &&
            selectedDateTitle.year === dateTodayBefore().year
          }
          dayBefore={day}
          isTaboo={false}
          selected={
            !!selectedDate &&
            selectedDateTitle.month === dateSelectedBefore().month &&
            selectedDateTitle.year === dateSelectedBefore().year &&
            selectedDateTitle.day === day
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
              selectedDateTitle.month === currentDate.currentMonth &&
              selectedDateTitle.year === currentDate.currentYear
            }
            isTaboo={getTabooDays(day)}
            dayCurrent={day}
            handleSelectedDate={handleSelectedDate}
            selected={
              !!selectedDate &&
              selectedDate.year === selectedDateTitle.year &&
              selectedDate.month === selectedDateTitle.month &&
              selectedDate.day === day
            }
            selectedDateTitle={selectedDateTitle}
            cartDay={
              cart
                ? changeCartDay(
                    day,
                    selectedDateTitle.month,
                    selectedDateTitle.year
                  )
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
                selectedDateTitle.month === dateTodayAfter().month &&
                selectedDateTitle.year === dateTodayAfter().year
              }
              isTaboo={false}
              dayAfter={day}
              selected={
                !!selectedDate &&
                selectedDateTitle.month === dateSelectedAfter().month &&
                selectedDateTitle.year === dateSelectedAfter().year &&
                selectedDateTitle.day === day
              }
              selectedDateTitle={selectedDateTitle}
              handleClickCell={handleClickCell}
            />
          )
        }
      ),
    ]

    return month
  }

  return (
    <div className="calendar">
      <CalendarWeekTitle
        daysOfWeek={daysOfWeek}
        firstDayTitle={firstDayOfWeekTitle}
        handleFirstDay={handleFirstDay}
      />
      <div className="calendar-month">
        <div className="month-days">{constructionMonth()}</div>
      </div>
    </div>
  )
}
