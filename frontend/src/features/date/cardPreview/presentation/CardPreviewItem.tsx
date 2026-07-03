import React from 'react'
import clsx from 'clsx'
import { useCardFacade } from '@entities/card/application/facades'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { getToolbarIcon } from '@shared/utils/icons'
import styles from './CardPreviewItem.module.scss'
import { PreviewItemForCalendar } from '@cardphoto/domain/types'

export const CardPreviewItem: React.FC<
  PreviewItemForCalendar & {
    onArchivePostcardClick?: () => void
  }
> = ({
  item,
  status,
  isProcessed,
  previewAllowBlob,
  cardId,
  isHistory,
  isSelectedDate,
  isCartDateDisabledPreview = false,
  isAdjacentMonthEdge = false,
  hasCartPostcardsOnDay = false,
  historyIndicatorStatuses,
  isActiveCardPiePostcard = false,
  onArchivePostcardClick,
}) => {
  const { openPreview } = useCardFacade()
  const { displayUrl, onPreviewImgError } = useListCardPreviewUrl(
    item.cardId,
    item.previewUrl,
    { previewIsProcessed: previewAllowBlob ?? isProcessed },
  )

  const handlePreviewClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (onArchivePostcardClick) {
      onArchivePostcardClick()
      return
    }
    if (cardId) {
      openPreview(cardId)
    }
  }

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
      onError={onPreviewImgError}
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
        isActiveCardPiePostcard && styles.previewItemActiveCardPie,
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
