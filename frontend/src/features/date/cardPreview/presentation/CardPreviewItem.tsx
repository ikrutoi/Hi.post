import React from 'react'
import clsx from 'clsx'
import { CalendarCardItem, Card } from '@entities/card/domain/types'
import styles from './CardPreviewItem.module.scss'

interface ItemProps {
  item: CalendarCardItem
  isProcessed?: boolean
}

export const CardPreviewItem: React.FC<ItemProps> = ({ item, isProcessed }) => {
  return (
    <div
      className={clsx(styles.previewItem, { [styles.processed]: isProcessed })}
    >
      <img
        src={item.previewUrl}
        alt="card thumb"
        className={styles.previewImage}
      />
    </div>
  )
}
