import React from 'react'
import { Price } from './Price'
import styles from './AssemblyPieCornerFrame.module.scss'

/** Знак цены на центральном пае режима «Сборка открытки». */
export const AssemblyPieCornerFrame: React.FC = () => (
  <div className={styles.frame}>
    <Price className={styles.price} />
  </div>
)
