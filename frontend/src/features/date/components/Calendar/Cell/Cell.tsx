import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import './Cell.scss'
import { Toolbar } from './Toolbar/Toolbar'

import { Cart } from '@features/cart/publicApi'
import { parseDateString } from '@shared/lib/date'
import {
  setChoiceClip,
  setDateCartCards,
  setLockDateCartCards,
} from '@features/layout'

import { CellProps } from '@features/date/publicApi.ts'

export const Cell: React.FC<CellProps> = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  today,
  isTaboo,
  handleSelectedDate,
  selected,
  selectedDateTitle,
  handleClickCell,
  cartDay,
}) => {
  const [toolbarCart, setToolbarCart] = useState(false)
  const dispatch = useDispatch()
  const [countCart, setCountCart] = useState<number | false | null>(null)

  useEffect(() => {
    if (!cartDay) return

    if (cartDay.length > 1) {
      setCountCart(cartDay.length)
    } else if (cartDay.length === 1) {
      setCountCart(false)
    }
  }, [cartDay])

  useEffect(() => {
    const allMatch = cartDay?.every((card) => {
      const parsed = parseDateString(card.date)
      return (
        parsed.year === selectedDateTitle.year &&
        parsed.month === selectedDateTitle.month
      )
    })

    if (!allMatch) {
      setToolbarCart(false)
    }
  }, [cartDay, selectedDateTitle])

  const addSelectedDate = () => {
    if (handleSelectedDate) {
      handleSelectedDate(
        !!isTaboo,
        selectedDateTitle.year,
        selectedDateTitle.month,
        dayCurrent!
      )
    }
  }

  const handleImgCartClick = (evt: React.MouseEvent, day: number) => {
    dispatch(setLockDateCartCards(true))
    dispatch(setChoiceClip(toolbarCart ? 'date' : null))
    dispatch(
      setDateCartCards({
        year: selectedDateTitle.year,
        month: selectedDateTitle.month,
        day,
      })
    )
  }

  const renderDay = () => {
    if (title) return <div className="cell cell-title">{title}</div>

    if (dayCurrent) {
      return (
        <div
          className={`cell cell-day day-current ${today ? 'today' : ''} day-${dayCurrent} ${
            selected ? 'selected' : ''
          } ${isTaboo ? 'isTaboo' : ''} ${cartDay ? 'cart' : ''}`}
          onClick={() => !cartDay && addSelectedDate()}
        >
          {cartDay ? (
            <div
              className="cell-cart-container"
              onClick={() => setToolbarCart((s) => !s)}
            >
              <span
                className={`cell-cart-filter ${selected ? 'selected' : ''}`}
              >
                <span className="cell-cart-shadow">{dayCurrent}</span>
              </span>
              <img
                className="cell-cart-img"
                alt="cart-day"
                src={cartDay?.[0]?.preview}
              />
              {countCart && !toolbarCart && (
                <span className="toolbar-cart-count toolbar-cart-container-count">
                  {cartDay.length}
                </span>
              )}
              {toolbar && (
                <Toolbar
                  day={dayCurrent}
                  cartDay={cartDay}
                  handleImgCartClick={handleImgCartClick}
                  handleCellCartClick={addSelectedDate}
                  countCart={countCart}
                />
              )}
            </div>
          ) : (
            dayCurrent
          )}
        </div>
      )
    }

    if (dayBefore) {
      return (
        <div
          className={`cell cell-day ${today ? 'today' : ''} day-before day-${dayBefore} ${
            selected ? 'selected' : ''
          }`}
          onClick={() => handleClickCell('before')}
        >
          {dayBefore}
        </div>
      )
    }

    return (
      <div
        className={`cell cell-day ${today ? 'today' : ''} day-after day-${dayAfter} ${
          selected ? 'selected' : ''
        }`}
        onClick={() => handleClickCell('after')}
      >
        {dayAfter}
      </div>
    )
  }

  return renderDay()
}
