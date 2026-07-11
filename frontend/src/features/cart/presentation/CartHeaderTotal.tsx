import React from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectCartCheckedTotalDisplay,
  selectCartCheckedTotalNumeric,
} from '@cart/infrastructure/selectors'
import styles from './CartHeaderTotal.module.scss'

export const CartHeaderTotal: React.FC = () => {
  const totalNumeric = useAppSelector(selectCartCheckedTotalNumeric)
  const totalDisplay = useAppSelector(selectCartCheckedTotalDisplay)

  if (totalNumeric <= 0) return null

  return (
    <span className={styles.root} aria-label={`Cart total ${totalDisplay}`}>
      {totalDisplay}
    </span>
  )
}
