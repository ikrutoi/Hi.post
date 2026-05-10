import React, { useEffect } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCardFacade } from '@entities/card/application/facades'
import { CalendarCardItem } from '@entities/card/domain/types'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './CardPreviewItem.module.scss'
import { PreviewItemForCalendar } from '@cardphoto/domain/types'

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

export const CardPreviewItem: React.FC<PreviewItemForCalendar> = ({
  item,
  status,
  isProcessed,
  cardId,
  isHistory,
  isSelectedDate,
  isCartDateDisabledPreview = false,
  isAdjacentMonthEdge = false,
  hasCartPostcardsOnDay = false,
  historyIndicatorStatuses,
}) => {
  const { openPreview } = useCardFacade()
  const cachedUrl = useAppSelector(selectCalendarPreviewDisplayUrl(item.cardId))
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (!cachedUrl && item.previewUrl) {
      dispatch(
        requestCalendarPreview({
          cardId: item.cardId,
          previewUrl: item.previewUrl,
        }),
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

  const allowBlobFallback =
    item.cardId === 'current_session' || Boolean(isProcessed)
  const safeFallbackUrl =
    isBlobUrl(item.previewUrl) && !allowBlobFallback ? null : item.previewUrl
  const displayUrl = cachedUrl ?? safeFallbackUrl
  const hasDisplayUrl =
    typeof displayUrl === 'string' && displayUrl.trim().length > 0

  const showCardphotoPlaceholder =
    !isHistory && isSelectedDate && !hasDisplayUrl

  const isCartLikeStatus = status === 'cart' || status === 'cartBlocked'

  const dateDimmedMedia =
    !isHistory &&
    !isSelectedDate &&
    !isAdjacentMonthEdge &&
    !isCartLikeStatus

  const mediaBlock = hasDisplayUrl ? (
    <img
      src={displayUrl}
      alt="card thumb"
      className={clsx(
        styles.previewImage,
        isCartDateDisabledPreview && styles.previewImageCartDisabled,
      )}
    />
  ) : showCardphotoPlaceholder ? (
    <div className={styles.miniCardphotoPlaceholder} aria-hidden>
      {getToolbarIcon({ key: 'cardphoto' })}
    </div>
  ) : (
    <div className={styles.previewImage} aria-hidden />
  )

  return (
    <div
      className={clsx(
        styles.previewItem,
        isHistory
          ? styles.previewItemHistory
          : isSelectedDate
            ? styles.previewItemSelected
            : isAdjacentMonthEdge
              ? styles.previewItemAdjacentEdge
              : isCartLikeStatus
                ? styles.previewItemHistory
                : null,
      )}
      onClick={handlePreviewClick}
    >
      {dateDimmedMedia ? (
        <div className={styles.previewDateMedia}>{mediaBlock}</div>
      ) : (
        mediaBlock
      )}
      {historyIndicatorStatuses != null &&
      historyIndicatorStatuses.length > 0 ? (
        <div className={styles.historyIndicatorStack} aria-hidden>
          {historyIndicatorStatuses.map((s) => (
            <span
              key={s}
              className={clsx(styles.previewIndicator, styles[s])}
            />
          ))}
        </div>
      ) : isHistory && !isProcessed ? (
        <span
          className={clsx(styles.previewIndicator, styles[status])}
          aria-hidden
        />
      ) : hasCartPostcardsOnDay ? (
        <span
          className={clsx(styles.previewIndicator, styles.cart)}
          aria-hidden
        />
      ) : null}
    </div>
  )
}
