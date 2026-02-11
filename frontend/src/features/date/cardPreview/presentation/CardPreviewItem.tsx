import React from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardFacade } from '@entities/card/application/facades'
import { CalendarCardItem, Card } from '@entities/card/domain/types'
import { setPreviewCardId } from '@entities/card/infrastructure/state'
import styles from './CardPreviewItem.module.scss'
import type { CardStatus } from '@entities/card/domain/types'

interface ItemProps {
  item: { previewUrl: string }
  status: CardStatus
  cardId: string
}

export const CardPreviewItem: React.FC<ItemProps> = ({
  item,
  status,
  cardId,
}) => {
  const { openPreview } = useCardFacade()

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (cardId) {
      openPreview(cardId)
    }
  }

  return (
    <div className={styles.previewItem} onClick={handlePreviewClick}>
      <img
        src={item.previewUrl}
        alt="card thumb"
        className={styles.previewImage}
      />
      <span className={clsx(styles.previewIndicator, styles[status])}></span>
    </div>
  )
}
