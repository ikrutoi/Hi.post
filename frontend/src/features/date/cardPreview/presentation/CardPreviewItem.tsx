import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardFacade } from '@entities/card/application/facades'
import { CalendarCardItem } from '@entities/card/domain/types'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import styles from './CardPreviewItem.module.scss'
import type { CardStatus } from '@entities/card/domain/types'
import { PreviewItem } from '@cardphoto/domain/types'

export const CardPreviewItem: React.FC<PreviewItem> = ({
  item,
  status,
  cardId,
}) => {
  const { openPreview } = useCardFacade()
  const cachedUrl = useAppSelector(selectCalendarPreviewDisplayUrl(item.cardId))
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!cachedUrl && item.previewUrl) {
      dispatch(
        requestCalendarPreview({ cardId: item.cardId, previewUrl: item.previewUrl }),
      )
    }
  }, [cachedUrl, item.cardId, item.previewUrl, dispatch])

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (cardId) {
      openPreview(cardId)
    }
  }

  const displayUrl = cachedUrl ?? item.previewUrl

  return (
    <div className={styles.previewItem} onClick={handlePreviewClick}>
      {displayUrl ? (
        <img
          src={displayUrl}
          alt="card thumb"
          className={styles.previewImage}
        />
      ) : (
        <div className={styles.previewImage} aria-hidden />
      )}
      <span className={clsx(styles.previewIndicator, styles[status])}></span>
    </div>
  )
}
