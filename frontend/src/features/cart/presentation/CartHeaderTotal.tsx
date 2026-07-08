import React from 'react'
import { useAppSelector } from '@app/hooks'
import {
  selectCartBillableTotalDisplay,
  selectCartBillableTotalNumeric,
} from '@cart/infrastructure/selectors'
import styles from './CartHeaderTotal.module.scss'

export const CartHeaderTotal: React.FC = () => {
  const totalNumeric = useAppSelector(selectCartBillableTotalNumeric)
  const totalDisplay = useAppSelector(selectCartBillableTotalDisplay)

  if (totalNumeric <= 0) return null

  return (
    <span className={styles.root} aria-label={`Cart total ${totalDisplay}`}>
      {totalDisplay}
    </span>
  )
}
