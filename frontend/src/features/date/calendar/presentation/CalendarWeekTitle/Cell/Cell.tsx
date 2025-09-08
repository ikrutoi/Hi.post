import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import './Cell.scss'
import { Toolbar } from './Toolbar/Toolbar'
import {
  setChoiceClip,
  setDateShoppingCards,
  setLockDateShoppingCards,
} from '@shared/store/slices/layoutSlice'
import type { DispatchDate } from '@entities/date/domain/dispatchDate'

interface CellProps {
  title?: string
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  today?: boolean
  taboo?: boolean
  handleSelectedDate: (
    taboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  selectedDate?: boolean
  selectedDateTitle: DispatchDate
  handleClickCell: (direction: 'before' | 'after') => void
  shoppingDay?: { date?: DispatchDate; length: number; [key: string]: any }[]
}

export const Cell: React.FC<CellProps> = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  today,
  taboo,
  handleSelectedDate,
  selectedDate,
  selectedDateTitle,
  handleClickCell,
  shoppingDay,
}) => {
  const dispatch = useDispatch()
  const [toolbarShopping, setToolbarShopping] = useState(false)
  const [countShoppingCards, setCountShoppingCards] = useState<
    number | false | null
  >(null)

  useEffect(() => {
    if (!shoppingDay) return
    setCountShoppingCards(
      shoppingDay.length > 1
        ? shoppingDay.length
        : shoppingDay.length === 1
          ? false
          : null
    )
  }, [shoppingDay])

  useEffect(() => {
    if (!selectedDateTitle.isSelected || !shoppingDay?.[0]?.date?.isSelected) {
      setToolbarShopping(false)
      return
    }

    const match =
      shoppingDay[0].date.year === selectedDateTitle.year &&
      shoppingDay[0].date.month === selectedDateTitle.month

    if (!match) {
      setToolbarShopping(false)
    }
  }, [shoppingDay, selectedDateTitle])

  const addSelectedDate = () => {
    if (!selectedDateTitle.isSelected || dayCurrent == null) return
    handleSelectedDate(
      !!taboo,
      selectedDateTitle.year!,
      selectedDateTitle.month!,
      dayCurrent
    )
  }

  const handleImgShoppingClick = (_evt: React.MouseEvent, day: number) => {
    if (!selectedDateTitle.isSelected) return
    dispatch(setLockDateShoppingCards(true))
    dispatch(setChoiceClip(toolbarShopping ? 'date' : false))
    dispatch(
      setDateShoppingCards({
        year: selectedDateTitle.year!,
        month: selectedDateTitle.month!,
        day,
      })
    )
  }

  const renderDay = () => {
    if (title) {
      return <div className="calendar-cell calendar-cell__title">{title}</div>
    }

    const baseClass = [
      'calendar-cell',
      dayCurrent != null && 'calendar-cell--current',
      dayBefore != null && 'calendar-cell--before',
      dayAfter != null && 'calendar-cell--after',
      selectedDate && 'calendar-cell--selected',
      today && 'calendar-cell--today',
      taboo && 'calendar-cell--taboo',
      shoppingDay && 'calendar-cell--shopping',
      `day-${dayCurrent ?? dayBefore ?? dayAfter}`,
    ]
      .filter(Boolean)
      .join(' ')

    if (dayCurrent != null) {
      return (
        <div
          className={baseClass}
          onClick={() => !shoppingDay && addSelectedDate()}
        >
          {shoppingDay ? (
            <div
              className="calendar-cell__shopping-container"
              onClick={() => setToolbarShopping((s) => !s)}
            >
              <span
                className={`calendar-cell__shopping-filter ${
                  selectedDate ? 'calendar-cell__shopping-filter--selected' : ''
                }`}
              >
                <span className="calendar-cell__shopping-shadow">
                  {dayCurrent}
                </span>
              </span>
              <img
                className="calendar-cell__shopping-img"
                alt="shopping-day"
                src={shoppingDay?.[0]?.img}
              />
              {countShoppingCards && !toolbarShopping && (
                <span className="calendar-cell__shopping-count">
                  {shoppingDay.length}
                </span>
              )}
              {toolbarShopping && (
                <Toolbar
                  day={dayCurrent}
                  shoppingDay={shoppingDay}
                  handleImgShoppingClick={handleImgShoppingClick}
                  handleCellShoppingClick={addSelectedDate}
                  countShoppingCards={countShoppingCards}
                />
              )}
            </div>
          ) : (
            dayCurrent
          )}
        </div>
      )
    }

    if (dayBefore != null) {
      return (
        <div className={baseClass} onClick={() => handleClickCell('before')}>
          {dayBefore}
        </div>
      )
    }

    return (
      <div className={baseClass} onClick={() => handleClickCell('after')}>
        {dayAfter}
      </div>
    )
  }

  return renderDay()
}
