import React, { useMemo } from 'react'
import { useAppSelector } from '@app/hooks'
import { selectCardphotoPreview } from '@cardphoto/infrastructure/selectors'
import { getToolbarIcon } from '@shared/utils/icons'
import { selectRecipientsPendingIds } from '@envelope/infrastructure/selectors'
import { selectRecipientEnabled } from '@envelope/recipient/infrastructure/selectors'
import {
  selectExcludedDispatchBranchSet,
  selectRecipientBranchSlotKeys,
} from '@date/infrastructure/selectors'
import { CardPreviewItem } from './CardPreviewItem'
import styles from './CardPreview.module.scss'
import { CalendarCardItem } from '@entities/card/domain/types'
import {
  POSTCARD_STATUSES_HIDDEN_ON_DATE_CALENDAR_THUMBNAIL,
  type PostcardStatus,
} from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { CardSection } from '@/shared/config/constants'

function dispatchDateKey(d: DispatchDate): string {
  return `${d.year}-${d.month}-${d.day}`
}

/** Индикаторы дня в календаре «История» (сверху вниз: cart, ready, sent, delivered, error). */
function historyStatusIndicatorsForCalendarDay(data: {
  cart: CalendarCardItem[]
  ready: CalendarCardItem[]
  sent: CalendarCardItem[]
  delivered: CalendarCardItem[]
  error: CalendarCardItem[]
}): PostcardStatus[] {
  const indicators: PostcardStatus[] = []
  const hasPlainCart = data.cart.some((i) => i.status === 'cart')
  const hasCartBlockedOnly =
    !hasPlainCart && data.cart.some((i) => i.status === 'cartBlocked')
  if (hasPlainCart) {
    indicators.push('cart')
  } else if (hasCartBlockedOnly) {
    indicators.push('cartBlocked')
  }
  if (data.ready.length > 0) indicators.push('ready')
  if (data.sent.length > 0) indicators.push('sent')
  if (data.delivered.length > 0) indicators.push('delivered')
  if (data.error.length > 0) indicators.push('error')
  return indicators
}

/** `cart` = Date strip while right cart list is open (calendar shows cart on days). */
export type CardPreviewCalendarSection = CardSection | 'cart'

interface CardPreviewProps {
  data: {
    processed: CalendarCardItem | null
    cart: CalendarCardItem[]
    ready: CalendarCardItem[]
    sent: CalendarCardItem[]
    delivered: CalendarCardItem[]
    error: CalendarCardItem[]
  }
  section: CardPreviewCalendarSection | null
  isSelectedDate: boolean
  isDisabledDate?: boolean
  /** День ячейки календаря — для бейджа числа веток с учётом excludeDispatchBranch. */
  calendarDispatchDate?: DispatchDate
  /** Маркер для Cell: hover скрывает плейсхолдер и показывает стрелку соседнего месяца. */
  adjacentSessionPlaceholderNavSwap?: boolean
  /** Ячейка dayBefore/dayAfter — стили превью как у края месяца, без dim невыбранного дня. */
  isAdjacentMonthEdge?: boolean
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  data,
  section,
  isSelectedDate,
  isDisabledDate = false,
  calendarDispatchDate,
  adjacentSessionPlaceholderNavSwap = false,
  isAdjacentMonthEdge = false,
}) => {
  const recipientEnabled = useAppSelector(selectRecipientEnabled)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientBranchSlotKeys = useAppSelector(selectRecipientBranchSlotKeys)
  const excludedDispatchBranchSet = useAppSelector(selectExcludedDispatchBranchSet)
  const photoPreview = useAppSelector(selectCardphotoPreview)
  const { processed, cart, ready, sent, delivered, error } = data

  const isHistory = section === 'history'
  const isCartCalendar = section === 'cart'
  const isHistoryLike = isHistory || isCartCalendar
  /**
   * Порядок для миниатюры: в «Дата» сначала конвейер, корзина в конце (жёлтый индикатор по `cart` отдельно).
   * В «Истории» — прежний порядок; в полосе корзины — только `cart`.
   */
  const pipelineCards = isCartCalendar
    ? [...cart]
    : isHistory
      ? [...cart, ...ready, ...sent, ...delivered, ...error]
      : [...ready, ...sent, ...delivered, ...error, ...cart]
  const pipelineCount = pipelineCards.length
  /**
   * В закладке «История» миниатюра ячейки не берётся из `cartBlocked` (только корзина / дата),
   * счётчик «×N» по-прежнему учитывает все карточки дня.
   */
  const thumbnailPipelineCards =
    isHistory
      ? [
          ...cart.filter((item) => item.status !== 'cartBlocked'),
          ...ready,
          ...sent,
          ...delivered,
          ...error,
        ]
      : pipelineCards
  /**
   * Бейдж «×N»: в «Истории» / полосе корзины — все карточки дня (+ processed).
   * В «Дата» не считаем ни корзину, ни конвейер `ready`…`error` (только ветки получателя / см. ниже).
   */
  const totalOnDayForBadge = isCartCalendar
    ? pipelineCount
    : isHistoryLike
      ? pipelineCount + (processed ? 1 : 0)
      : processed
        ? 1
        : 0
  const firstPipelineWithPreview =
    thumbnailPipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline =
    thumbnailPipelineCards.length > 0 ? thumbnailPipelineCards[0] : null

  /** Выбранный день: показываем слот `processed` (редактор / current_session), а не превью посткарда из pipeline. */
  const workingSlotForSelectedDay =
    !isHistoryLike && isSelectedDate && processed ? processed : null

  /** Нет картинки в cardphoto: в ячейке выбранного дня — плейсхолдер cardphoto, а не превью из корзины. */
  const noSessionCardphotoImage = !photoPreview?.previewUrl

  const primaryItem: CalendarCardItem | null =
    !isHistoryLike && isSelectedDate && noSessionCardphotoImage
      ? workingSlotForSelectedDay ?? null
      : isCartCalendar
        ? firstPipelineWithPreview ?? firstPipeline ?? null
        : workingSlotForSelectedDay ??
          firstPipelineWithPreview ??
          firstPipeline ??
          processed ??
          null

  /** В режиме «Дата» миниатюру не берём из корзины и из конвейера `ready`…`error`. */
  const primaryItemForDisplay =
    !isHistoryLike &&
    !isCartCalendar &&
    primaryItem &&
    !primaryItem.isProcessed &&
    POSTCARD_STATUSES_HIDDEN_ON_DATE_CALENDAR_THUMBNAIL.has(primaryItem.status)
      ? null
      : primaryItem

  const pendingRecipientCount = recipientsPendingIds.length

  const effectiveRecipientCount = useMemo(() => {
    if (
      isHistoryLike ||
      !recipientEnabled ||
      !isSelectedDate ||
      !calendarDispatchDate
    ) {
      return pendingRecipientCount
    }
    const dk = dispatchDateKey(calendarDispatchDate)
    const active = recipientBranchSlotKeys.filter(
      (k) => !excludedDispatchBranchSet.has(`${dk}|${k}`),
    ).length
    if (active > 0) return active
    return pendingRecipientCount > 0 ? pendingRecipientCount : 0
  }, [
    isHistoryLike,
    recipientEnabled,
    isSelectedDate,
    calendarDispatchDate,
    recipientBranchSlotKeys,
    excludedDispatchBranchSet,
    pendingRecipientCount,
  ])

  const countForRecipientBadge =
    isSelectedDate &&
    !isHistoryLike &&
    recipientEnabled &&
    calendarDispatchDate
      ? effectiveRecipientCount
      : pendingRecipientCount

  const recipientFactor =
    !isHistoryLike &&
    recipientEnabled &&
    countForRecipientBadge > 1
      ? countForRecipientBadge
      : 1

  const useActiveBranchesOnlyForBadge =
    !isHistoryLike &&
    isSelectedDate &&
    Boolean(calendarDispatchDate) &&
    recipientEnabled &&
    recipientBranchSlotKeys.length > 1

  const badgeNumeric = useActiveBranchesOnlyForBadge
    ? effectiveRecipientCount
    : recipientFactor > 1
      ? Math.max(totalOnDayForBadge, recipientFactor)
      : totalOnDayForBadge
  const badgeCount = badgeNumeric > 1 ? badgeNumeric : 0
  /** В режиме Дата счётчик только для выбранного дня; для приглушённого превью из pipeline не показываем. */
  const showExtraCountBadge =
    badgeCount > 0 && (isHistoryLike || isSelectedDate)

  const showEmptySessionPlaceholder =
    !isHistoryLike &&
    isSelectedDate &&
    !primaryItemForDisplay &&
    !photoPreview?.previewUrl

  const historyStatusIndicatorStack = isHistory
    ? historyStatusIndicatorsForCalendarDay(data)
    : []

  return (
    <div className={styles.cardPreviewContainer}>
      {primaryItemForDisplay ? (
        <div className={styles.previewWrapper}>
          <CardPreviewItem
            key={primaryItemForDisplay.rowKey}
            item={primaryItemForDisplay}
            status={primaryItemForDisplay.status}
            isProcessed={primaryItemForDisplay.isProcessed}
            cardId={primaryItemForDisplay.cardId}
            isHistory={isHistoryLike}
            isSelectedDate={isSelectedDate}
            isCartDateDisabledPreview={isCartCalendar && isDisabledDate}
            isAdjacentMonthEdge={isAdjacentMonthEdge}
            historyIndicatorStatuses={
              isHistory && historyStatusIndicatorStack.length > 0
                ? historyStatusIndicatorStack
                : undefined
            }
          />
          {showExtraCountBadge ? (
            <span className={styles.extraCount} aria-hidden>
              x{badgeCount}
            </span>
          ) : null}
        </div>
      ) : showEmptySessionPlaceholder ? (
        <div className={styles.previewWrapper}>
          <div
            className={styles.miniCardphotoPlaceholder}
            aria-hidden
            data-calendar-session-placeholder={
              adjacentSessionPlaceholderNavSwap ? 'true' : undefined
            }
          >
            {getToolbarIcon({ key: 'cardphoto' })}
          </div>
        </div>
      ) : null}
    </div>
  )
}
