import React from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardFacade } from '@entities/card/application/facades'
import { CalendarCardItem, Card } from '@entities/card/domain/types'
import { setPreviewCardId } from '@entities/card/infrastructure/state'
import styles from './CardPreviewItem.module.scss'
import type { CardStatus } from '@entities/card/domain/types'
import { PreviewItem } from '@cardphoto/domain/types'

export const CardPreviewItem: React.FC<PreviewItem> = ({
  item,
  status,
  cardId,
}) => {
  const { openPreview } = useCardFacade()

  console.log('CardPreviewItem', item, status, cardId)

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
