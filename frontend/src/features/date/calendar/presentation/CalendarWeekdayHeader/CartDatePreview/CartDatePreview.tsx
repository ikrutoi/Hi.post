import React from 'react'
import clsx from 'clsx'
import type { CartItem } from '@entities/cart/domain/types'
import styles from './CartDatePreview.module.scss'

interface CartDatePreviewProps {
  day: number
  cartItem: CartItem
  countCartCards: number
  handleImageCartDateClick: (evt: React.MouseEvent, day: number) => void
  handleCellCartDateClick: () => void
}

export const CartDatePreview: React.FC<CartDatePreviewProps> = ({
  day,
  cartItem,
  countCartCards,
  handleImageCartDateClick,
  handleCellCartDateClick,
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.day} onClick={handleCellCartDateClick}>
        {day}
      </div>
      {/* <img
        className={styles.img}
        alt="cart-day"
        src={cartItem.card.cardphoto.data.preview?.blob ?? ''}
        onClick={(evt) => handleImageCartDateClick(evt, day)}
      /> */}
      {countCartCards > 1 && (
        <span className={clsx(styles.count, styles.countImg)}>
          {countCartCards}
        </span>
      )}
    </div>
  )
}
