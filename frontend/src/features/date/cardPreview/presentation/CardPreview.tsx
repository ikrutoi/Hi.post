import React from 'react'
import { CardPreviewItem } from './CardPreviewItem'
import styles from './CardPreview.module.scss'
import { CalendarCardItem } from '@entities/card/domain/types'
import { CardSection } from '@/shared/config/constants'

interface CardPreviewProps {
  data: {
    processed: CalendarCardItem | null
    cart: CalendarCardItem[]
    ready: CalendarCardItem[]
    sent: CalendarCardItem[]
    delivered: CalendarCardItem[]
    error: CalendarCardItem[]
  }
  section: CardSection | null
  isSelectedDate: boolean
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  data,
  section,
  isSelectedDate,
}) => {
  const { processed, cart, ready, sent, delivered, error } = data

  const isHistory = section === 'history'
  const pipelineCards = [...cart, ...ready, ...sent, ...delivered, ...error]
  const pipelineCount = pipelineCards.length
  const firstPipelineWithPreview =
    pipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

  const primaryItem: CalendarCardItem | null =
    firstPipelineWithPreview ?? firstPipeline ?? processed ?? null

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
            isHistory={isHistory}
            isSelectedDate={isSelectedDate}
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
