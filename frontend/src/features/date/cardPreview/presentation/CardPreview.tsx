import React from 'react'
import { CardPreviewItem } from './CardPreviewItem'
import styles from './CardPreview.module.scss'
import { CalendarCardItem } from '@entities/card/domain/types'

interface CardPreviewProps {
  data: {
    processed: CalendarCardItem | null
    cart: CalendarCardItem[]
    ready: CalendarCardItem[]
    sent: CalendarCardItem[]
    delivered: CalendarCardItem[]
    error: CalendarCardItem[]
  }
}

export const CardPreview: React.FC<CardPreviewProps> = ({ data }) => {
  const { processed, cart, ready, sent, delivered, error } = data

  /** Открытки из воронки (IDB / корзина и т.д.), не черновик редактора. */
  const pipelineCards = [...cart, ...ready, ...sent, ...delivered, ...error]
  const pipelineCount = pipelineCards.length
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

  // Если на день есть и postcard, и рабочая — в основном слоте первая из postcard.
  const primaryItem: CalendarCardItem | null =
    firstPipeline ?? processed ?? null

  /** Всего слотов на день на превью; xN — полное число (не «минус видимая»). */
  const totalOnDay = pipelineCount + (processed ? 1 : 0)
  const badgeCount = totalOnDay > 1 ? totalOnDay : 0

  return (
    <div className={styles.cardPreviewContainer}>
      {primaryItem && (
        <div className={styles.previewWrapper}>
          <CardPreviewItem
            key={primaryItem.rowKey}
            item={primaryItem}
            status={primaryItem.status}
            isProcessed={primaryItem.isProcessed}
            cardId={primaryItem.cardId}
          />
          {badgeCount > 0 ? (
            <span className={styles.extraCount} aria-hidden>
              x{badgeCount}
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
