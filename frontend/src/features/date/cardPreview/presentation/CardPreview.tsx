import React from 'react'
import { useAppSelector } from '@app/hooks'
import { selectRecipientsPendingIds } from '@envelope/infrastructure/selectors'
import { selectRecipientEnabled } from '@envelope/recipient/infrastructure/selectors'
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
  const recipientEnabled = useAppSelector(selectRecipientEnabled)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const { processed, cart, ready, sent, delivered, error } = data

  const isHistory = section === 'history'
  const pipelineCards = [...cart, ...ready, ...sent, ...delivered, ...error]
  const pipelineCount = pipelineCards.length
  const firstPipelineWithPreview =
    pipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

  /** Выбранный день: показываем слот `processed` (редактор / current_session), а не превью посткарда из pipeline. */
  const workingSlotForSelectedDay =
    !isHistory && isSelectedDate && processed ? processed : null

  const primaryItem: CalendarCardItem | null =
    workingSlotForSelectedDay ??
    firstPipelineWithPreview ??
    firstPipeline ??
    processed ??
    null

  const totalOnDay = pipelineCount + (processed ? 1 : 0)
  const pendingRecipientCount = recipientsPendingIds.length
  const recipientFactor =
    !isHistory &&
    recipientEnabled &&
    pendingRecipientCount > 1
      ? pendingRecipientCount
      : 1
  const badgeNumeric =
    recipientFactor > 1 ? Math.max(totalOnDay, recipientFactor) : totalOnDay
  const badgeCount = badgeNumeric > 1 ? badgeNumeric : 0
  /** В режиме Дата счётчик только для выбранного дня; для приглушённого превью из pipeline не показываем. */
  const showExtraCountBadge =
    badgeCount > 0 && (isHistory || isSelectedDate)

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
          {showExtraCountBadge ? (
            <span className={styles.extraCount} aria-hidden>
              x{badgeCount}
            </span>
          ) : null}
        </div>
      )}
    </div>
  )
}
