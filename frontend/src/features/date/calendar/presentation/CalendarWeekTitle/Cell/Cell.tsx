import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import styles from './Cell.module.scss'

import { Toolbar } from './Toolbar/Toolbar'
import { useLayoutFacade } from '@layout/application/facades'
import type { DispatchDate } from '@entities/date/domain/types'

interface CellProps {
  title?: string
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  today?: boolean
  taboo?: boolean
  handleDispatchDate?: (
    taboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  dispatchDate?: boolean
  dispatchDateTitle?: DispatchDate
  handleClickCell?: (direction: 'before' | 'after') => void
  cartDay?: { date?: DispatchDate; length: number; [key: string]: any }[]
}

export const Cell: React.FC<CellProps> = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  today,
  taboo,
  handleDispatchDate,
  dispatchDate,
  dispatchDateTitle,
  handleClickCell,
  cartDay,
}) => {
  const { actions } = useLayoutFacade()

  const [toolbarCart, setToolbarCart] = useState(false)
  const [countCartCards, setCountCartCards] = useState<number | false | null>(
    null
  )

  useEffect(() => {
    if (!cartDay) return
    setCountCartCards(
      cartDay.length > 1 ? cartDay.length : cartDay.length === 1 ? false : null
    )
  }, [cartDay])

  useEffect(() => {
    if (!dispatchDateTitle.isSelected || !cartDay?.[0]?.date?.isSelected) {
      setToolbarCart(false)
      return
    }

    const match =
      cartDay[0].date.year === dispatchDateTitle.year &&
      cartDay[0].date.month === dispatchDateTitle.month

    if (!match) {
      setToolbarCart(false)
    }
  }, [cartDay, dispatchDateTitle])

  const addDispatchDate = () => {
    if (!dispatchDateTitle.isSelected || dayCurrent == null) return
    handleDispatchDate(
      !!taboo,
      dispatchDateTitle.year!,
      dispatchDateTitle.month!,
      dayCurrent
    )
  }

  const handleImgCartClick = (_evt: React.MouseEvent, day: number) => {
    if (!dispatchDateTitle.isSelected) return
    actions.setLockDateCartCards(true)
    actions.setChoiceClip(toolbarCart ? true : false)
    actions.setDateCartCards({
      isSelected: true,
      year: dispatchDateTitle.year!,
      month: dispatchDateTitle.month!,
      day,
    })
  }

  const renderDay = () => {
    if (title) {
      return <div className={clsx(styles.cell, styles.title)}>{title}</div>
    }

    const dynamicClass = clsx(
      styles.cell,
      {
        [styles.today]: today,
        [styles.dispatch]: dispatchDate,
        [styles.taboo]: taboo,
        [styles.before]: dayBefore != null,
        [styles.after]: dayAfter != null,
        [styles.current]: dayCurrent != null,
        [styles.cart]: !!cartDay,
      },
      `day-${dayCurrent ?? dayBefore ?? dayAfter}`
    )

    if (dayCurrent != null) {
      return (
        <div
          className={dynamicClass}
          onClick={() => !cartDay && addDispatchDate()}
        >
          {cartDay ? (
            <div
              className={styles.cartContainer}
              onClick={() => setToolbarCart((s) => !s)}
            >
              <span
                className={clsx(styles.cartFilter, {
                  [styles.cartFilterSelected]: dispatchDate,
                })}
              >
                <span className={styles.cartShadow}>{dayCurrent}</span>
              </span>
              <img
                className={styles.cartImg}
                alt="cart-day"
                src={cartDay?.[0]?.img}
              />
              {countCartCards && !toolbarCart && (
                <span className={styles.cartCount}>{cartDay.length}</span>
              )}
              {toolbarCart && (
                <Toolbar
                  day={dayCurrent}
                  cartDay={cartDay}
                  handleImageCartClick={handleImgCartClick}
                  handleCellCartClick={addDispatchDate}
                  countCartCards={countCartCards}
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
        <div className={dynamicClass} onClick={() => handleClickCell('before')}>
          {dayBefore}
        </div>
      )
    }

    return (
      <div className={dynamicClass} onClick={() => handleClickCell('after')}>
        {dayAfter}
      </div>
    )
  }

  return renderDay()
}
