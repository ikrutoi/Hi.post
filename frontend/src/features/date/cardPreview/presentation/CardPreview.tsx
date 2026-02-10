import React from 'react'
import { CardPreviewItem } from './CardPreviewItem'
import styles from './CardPreview.module.scss'
import { CalendarCardItem } from '@entities/card/domain/types'

interface CardPreviewProps {
  data: {
    processed: CalendarCardItem | null
    cart: CalendarCardItem[]
    sent: CalendarCardItem[]
  }
}

export const CardPreview: React.FC<CardPreviewProps> = ({ data }) => {
  const { processed, cart, sent } = data

  const otherCards = [...cart, ...sent]
  const visibleOthers = otherCards.slice(0, 2)
  const extraCount = otherCards.length - visibleOthers.length

  return (
    <div className={styles.cardPreviewContainer}>
      {processed && (
        <div className={styles.previewWrapper}>
          <CardPreviewItem item={processed} isProcessed />
        </div>
      )}

      <div className={styles.list}>
        {visibleOthers.map((item) => (
          <CardPreviewItem key={item.cardId} item={item} />
        ))}
        {extraCount > 0 && <span className={styles.badge}>+{extraCount}</span>}
      </div>
    </div>
  )
}
