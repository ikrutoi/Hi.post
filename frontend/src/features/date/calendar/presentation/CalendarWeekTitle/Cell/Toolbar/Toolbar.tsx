import React from 'react'
import clsx from 'clsx'
import { DispatchDate } from '@entities/date/domain/types'
import styles from './Toolbar.module.scss'

interface ToolbarProps {
  day: number
  cartDay: { date?: DispatchDate; length: number; [key: string]: any }[]
  handleImageCartClick: (evt: React.MouseEvent, day: number) => void
  handleCellCartClick: () => void
  countCartCards: number | false | null
}

export const Toolbar: React.FC<ToolbarProps> = ({
  day,
  cartDay,
  handleImageCartClick,
  handleCellCartClick,
  countCartCards,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.day} onClick={handleCellCartClick}>
        {day}
      </div>
      <img
        className={styles.img}
        alt="cart-day"
        src={cartDay?.[0]?.img}
        onClick={(evt) => handleImageCartClick(evt, day)}
      />
      {countCartCards && (
        <span className={clsx(styles.count, styles.countImg)}>
          {cartDay.length}
        </span>
      )}
    </div>
  )
}
