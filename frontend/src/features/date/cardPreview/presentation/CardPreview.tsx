import React, { useMemo } from 'react'
import clsx from 'clsx'
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
import previewItemStyles from './CardPreviewItem.module.scss'
import styles from './CardPreview.module.scss'
import { CalendarCardItem } from '@entities/card/domain/types'
import type { DispatchDate } from '@entities/date/domain/types'
import { CardSection } from '@/shared/config/constants'

function dispatchDateKey(d: DispatchDate): string {
  return `${d.year}-${d.month}-${d.day}`
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
  /** Для бейджа «×N» в секции «Дата» не считаем корзину — только отправка по конвейеру + processed. */
  const nonCartPipeline = [...ready, ...sent, ...delivered, ...error]
  const totalOnDayForBadge = isCartCalendar
    ? pipelineCount
    : isHistoryLike
      ? pipelineCount + (processed ? 1 : 0)
      : nonCartPipeline.length + (processed ? 1 : 0)
  const firstPipelineWithPreview =
    pipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

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

  /** В режиме «Дата» миниатюру из корзины не показываем — только жёлтый индикатор. */
  const primaryItemForDisplay =
    !isHistoryLike &&
    !isCartCalendar &&
    primaryItem &&
    !primaryItem.isProcessed &&
    primaryItem.status === 'cart'
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
    !primaryItem &&
    !photoPreview?.previewUrl

  /** Режим «Дата» (не полоса корзины): на днях с открытками в корзине — жёлтый индикатор на превью. */
  const showDateModeCartPresenceIndicator =
    !isHistoryLike && !isCartCalendar && cart.length > 0

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
            hasCartPostcardsOnDay={showDateModeCartPresenceIndicator}
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
          {showDateModeCartPresenceIndicator ? (
            <span
              className={clsx(
                previewItemStyles.previewIndicator,
                previewItemStyles.cart,
              )}
              aria-hidden
            />
          ) : null}
        </div>
      ) : showDateModeCartPresenceIndicator ? (
        <div className={styles.previewWrapper}>
          <span
            className={clsx(
              previewItemStyles.previewIndicator,
              previewItemStyles.cart,
            )}
            aria-hidden
          />
        </div>
      ) : null}
    </div>
  )
}
