import React from 'react'
import clsx from 'clsx'
import styles from './Mark.module.scss'
import markNotActive from '@data/envelope/mark-not-active.svg'

export const Mark = () => {
  return (
    <div className={styles.mark}>
      <div className={clsx(styles.markStamp, styles.markStampNotActive)} />
    </div>
  )
}
