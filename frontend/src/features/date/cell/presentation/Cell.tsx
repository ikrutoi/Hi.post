import React, { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import styles from './Cell.module.scss'
import { Toolbar } from '../../calendar/presentation/CalendarWeekTitle/Cell/Toolbar/Toolbar'
import { useLayoutFacade } from '@layout/application/facades'
import type { DispatchDate } from '@entities/date/domain/types'
import type { CartDayItem } from '@cart/domain/types'

const cx = classNames.bind(styles)

interface CellProps {
  title?: string
  dayBefore?: number
  dayCurrent?: number
  dayAfter?: number
  today?: boolean
  isTaboo?: boolean
  handleDispatchDate?: (
    isTaboo: boolean,
    year: number,
    month: number,
    day: number
  ) => void
  dispatchDate?: boolean
  dispatchDateTitle?: DispatchDate
  handleClickCell?: (direction: 'before' | 'after') => void
  cartDay?: CartDayItem[]
}

export const Cell: React.FC<CellProps> = ({
  title,
  dayBefore,
  dayCurrent,
  dayAfter,
  today,
  isTaboo,
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

  if (!dispatchDateTitle?.isSelected) return null

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
    if (
      !dispatchDateTitle?.isSelected ||
      dayCurrent == null ||
      !handleDispatchDate
    )
      return
    handleDispatchDate(
      !!isTaboo,
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
      return <div className={cx('cell', 'title')}>{title}</div>
    }

    const dynamicClass = cx('cell', {
      'cell--today': today,
      'cell--dispatch': dispatchDate,
      'cell--taboo': isTaboo,
      'cell--before': dayBefore != null,
      'cell--after': dayAfter != null,
      'cell--current': dayCurrent != null,
      'cell--cart': !!cartDay,
    })

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
                className={cx('cartFilter', {
                  'cartFilter--selected': dispatchDate,
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
        <div
          className={dynamicClass}
          onClick={() => handleClickCell?.('before')}
        >
          {dayBefore}
        </div>
      )
    }

    return (
      <div className={dynamicClass} onClick={() => handleClickCell?.('after')}>
        {dayAfter}
      </div>
    )
  }

  return renderDay()
}
