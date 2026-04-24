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
import styles from './CardPreview.module.scss'
import { CalendarCardItem } from '@entities/card/domain/types'
import type { DispatchDate } from '@entities/date/domain/types'
import { CardSection } from '@/shared/config/constants'

function dispatchDateKey(d: DispatchDate): string {
  return `${d.year}-${d.month}-${d.day}`
}

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
  /** День ячейки календаря — для бейджа числа веток с учётом excludeDispatchBranch. */
  calendarDispatchDate?: DispatchDate
  /** Маркер для Cell: hover скрывает плейсхолдер и показывает стрелку соседнего месяца. */
  adjacentSessionPlaceholderNavSwap?: boolean
  /** Соседний месяц + cardphoto в сессии — приглушить только блок превью, не всю ячейку. */
  adjacentMonthCardphotoDim?: boolean
  /** Ячейка dayBefore/dayAfter — превью без opacity как у невыбранного дня текущего месяца. */
  isAdjacentMonthEdge?: boolean
}

export const CardPreview: React.FC<CardPreviewProps> = ({
  data,
  section,
  isSelectedDate,
  calendarDispatchDate,
  adjacentSessionPlaceholderNavSwap = false,
  adjacentMonthCardphotoDim = false,
  isAdjacentMonthEdge = false,
}) => {
  const recipientEnabled = useAppSelector(selectRecipientEnabled)
  const recipientsPendingIds = useAppSelector(selectRecipientsPendingIds)
  const recipientBranchSlotKeys = useAppSelector(selectRecipientBranchSlotKeys)
  const excludedDispatchBranchSet = useAppSelector(selectExcludedDispatchBranchSet)
  const photoPreview = useAppSelector(selectCardphotoPreview)
  const { processed, cart, ready, sent, delivered, error } = data

  const isHistory = section === 'history'
  const pipelineCards = [...cart, ...ready, ...sent, ...delivered, ...error]
  const pipelineCount = pipelineCards.length
  /** Для бейджа «×N» в секции «Дата» не считаем корзину — только отправка по конвейеру + processed. */
  const nonCartPipeline = [...ready, ...sent, ...delivered, ...error]
  const totalOnDayForBadge =
    isHistory
      ? pipelineCount + (processed ? 1 : 0)
      : nonCartPipeline.length + (processed ? 1 : 0)
  const firstPipelineWithPreview =
    pipelineCards.find((item) => Boolean(item.previewUrl)) ?? null
  const firstPipeline = pipelineCount > 0 ? pipelineCards[0] : null

  /** Выбранный день: показываем слот `processed` (редактор / current_session), а не превью посткарда из pipeline. */
  const workingSlotForSelectedDay =
    !isHistory && isSelectedDate && processed ? processed : null

  /** Нет картинки в cardphoto: в ячейке выбранного дня — плейсхолдер cardphoto, а не превью из корзины. */
  const noSessionCardphotoImage = !photoPreview?.previewUrl

  const primaryItem: CalendarCardItem | null =
    !isHistory && isSelectedDate && noSessionCardphotoImage
      ? workingSlotForSelectedDay ?? null
      : workingSlotForSelectedDay ??
        firstPipelineWithPreview ??
        firstPipeline ??
        processed ??
        null

  const pendingRecipientCount = recipientsPendingIds.length

  const effectiveRecipientCount = useMemo(() => {
    if (
      isHistory ||
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
    isHistory,
    recipientEnabled,
    isSelectedDate,
    calendarDispatchDate,
    recipientBranchSlotKeys,
    excludedDispatchBranchSet,
    pendingRecipientCount,
  ])

  const countForRecipientBadge =
    isSelectedDate && !isHistory && recipientEnabled && calendarDispatchDate
      ? effectiveRecipientCount
      : pendingRecipientCount

  const recipientFactor =
    !isHistory &&
    recipientEnabled &&
    countForRecipientBadge > 1
      ? countForRecipientBadge
      : 1

  const useActiveBranchesOnlyForBadge =
    !isHistory &&
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
    badgeCount > 0 && (isHistory || isSelectedDate)

  const showEmptySessionPlaceholder =
    !isHistory &&
    isSelectedDate &&
    !primaryItem &&
    !photoPreview?.previewUrl

  return (
    <div
      className={clsx(
        styles.cardPreviewContainer,
        adjacentMonthCardphotoDim && styles.cardPreviewContainerDim,
      )}
    >
      {primaryItem ? (
        <div className={styles.previewWrapper}>
          <CardPreviewItem
            key={primaryItem.rowKey}
            item={primaryItem}
            status={primaryItem.status}
            isProcessed={primaryItem.isProcessed}
            cardId={primaryItem.cardId}
            isHistory={isHistory}
            isSelectedDate={isSelectedDate}
            isAdjacentMonthEdge={isAdjacentMonthEdge}
            hasCartPostcardsOnDay={!isHistory && cart.length > 0}
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
