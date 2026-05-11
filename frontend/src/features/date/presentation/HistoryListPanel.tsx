import React, { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useCartFacade } from '@cart/application/facades'
import { setHistoryListSelectedLocalId } from '@date/calendar/infrastructure/state'
import { IconHistory } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { type HistoryListEntryVariant } from './historyList/HistoryListEntry'
import {
  POSTCARD_DISPATCH_DATE_FALLBACK,
  type PostcardStatus,
} from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import styles from './HistoryListPanel.module.scss'
import { PostcardStatusLegend } from './postcardStatusLegend/PostcardStatusLegend'
import { HistoryListEntry } from './historyList/HistoryListEntry'
import clsx from 'clsx'
import { getCurrentDate } from '@shared/utils/date'
import { PostcardIndicator } from '@toolbar/presentation/PostcardIndictor'

export type HistoryListPanelItem = {
  id: string
  cardId?: string
  /** Для строк из `cart.items` — переключение правого CardPie, как в корзине. */
  postcardLocalId?: number
  sourceDate?: DispatchDate
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: HistoryListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onDelete?: () => void
}

type Props = {
  onClose: () => void
  entries?: HistoryListPanelItem[]
  /** Выбранная открытка для подсветки строки и правого CardPie. */
  listSelectedLocalId?: number | null
  onSelectEntry?: (item: HistoryListPanelItem) => void
  /** True if postcards exist before status filter (keeps legend colors when list is filtered empty). */
  hasUnderlyingHistoryEntries?: boolean
  /** Число открыток по статусу (до фильтра) — для бейджей в легенде. */
  legendStatusCounts?: Record<PostcardStatus, number>
  // section: 'date' | 'history'
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

function isFallbackDispatchDate(d: DispatchDate): boolean {
  return (
    d.year === POSTCARD_DISPATCH_DATE_FALLBACK.year &&
    d.month === POSTCARD_DISPATCH_DATE_FALLBACK.month &&
    d.day === POSTCARD_DISPATCH_DATE_FALLBACK.day
  )
}

function dispatchDateUtcMidnightMs(d: DispatchDate): number {
  return Date.UTC(d.year, d.month, d.day)
}

function absDayDistance(a: DispatchDate, b: DispatchDate): number {
  return Math.round(
    Math.abs(dispatchDateUtcMidnightMs(a) - dispatchDateUtcMidnightMs(b)) /
      86400000,
  )
}

/** Ближайшие даты отправки к «сегодня» выше, без даты / fallback — в конце. */
function compareHistoryEntriesByDispatchDate(
  a: HistoryListPanelItem,
  b: HistoryListPanelItem,
  today: DispatchDate,
): number {
  const da = a.sourceDate
  const db = b.sourceDate
  const aBad = !da || isFallbackDispatchDate(da)
  const bBad = !db || isFallbackDispatchDate(db)
  if (aBad && bBad) return 0
  if (aBad) return 1
  if (bBad) return -1
  const distA = absDayDistance(da, today)
  const distB = absDayDistance(db, today)
  if (distA !== distB) return distA - distB
  return dispatchDateUtcMidnightMs(da) - dispatchDateUtcMidnightMs(db)
}

const HistoryListPanelRow: React.FC<{
  item: HistoryListPanelItem
  listSelectedLocalId?: number | null
  onSelectEntry?: (item: HistoryListPanelItem) => void
}> = ({ item, listSelectedLocalId, onSelectEntry }) => {
  const dispatch = useAppDispatch()
  const { removeItem } = useCartFacade()
  const cachedUrl = useAppSelector(
    selectCalendarPreviewDisplayUrl(item.cardId ?? ''),
  )

  useEffect(() => {
    if (item.cardId && !cachedUrl && item.previewUrl) {
      dispatch(
        requestCalendarPreview({
          cardId: item.cardId,
          previewUrl: item.previewUrl,
        }),
      )
    }
  }, [dispatch, cachedUrl, item.cardId, item.previewUrl])

  const allowBlobFallback =
    item.cardId === 'current_session' || Boolean(item.previewIsProcessed)
  const safeFallbackUrl =
    isBlobUrl(item.previewUrl) && !allowBlobFallback ? null : item.previewUrl
  const displayUrl = cachedUrl ?? safeFallbackUrl

  const handleRemoveFromList = useCallback(() => {
    const lid = item.postcardLocalId
    if (lid == null) return
    removeItem(lid)
    if (lid === listSelectedLocalId) {
      dispatch(setHistoryListSelectedLocalId(null))
    }
  }, [dispatch, item.postcardLocalId, listSelectedLocalId, removeItem])

  const onDeleteRow =
    item.onDelete ??
    (item.postcardLocalId != null ? handleRemoveFromList : undefined)

  return (
    <HistoryListEntry
      key={item.id}
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      detailLine={item.detailLine}
      variant={item.variant}
      previewStatus={item.previewStatus}
      previewIsProcessed={item.previewIsProcessed}
      onSelect={
        onSelectEntry && item.variant !== 'inactive'
          ? () => onSelectEntry(item)
          : undefined
      }
      isSelected={
        item.postcardLocalId != null &&
        item.postcardLocalId === listSelectedLocalId
      }
      onDelete={onDeleteRow}
    />
  )
}

export const HistoryListPanel: React.FC<Props> = ({
  onClose,
  entries = [],
  listSelectedLocalId = null,
  onSelectEntry,
  hasUnderlyingHistoryEntries,
  legendStatusCounts,
  // section,
}) => {
  const sortedEntries = useMemo(() => {
    if (entries.length < 2) return entries
    const t = getCurrentDate()
    const today: DispatchDate = { year: t.year, month: t.month, day: t.day }
    return [...entries].sort((a, b) =>
      compareHistoryEntriesByDispatchDate(a, b, today),
    )
  }, [entries])

  const hasRows = sortedEntries.length > 0
  const listContentKey = sortedEntries.map((e) => e.id).join('|')
  const legendTreatAsEmpty =
    hasUnderlyingHistoryEntries === undefined
      ? !hasRows
      : !hasUnderlyingHistoryEntries

  return (
    <div className={styles.panel}>
      <ListPanelStackedHeader
        leadIconKey="listHistory"
        headerTopCenter={
          <div className={styles.headerPostcardDots}>
            <PostcardIndicator />
          </div>
        }
        toolbar={<Toolbar section="historyList" />}
        onClose={onClose}
        closeAriaLabel="Close date list"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label="Dispatch date list"
        >
          {hasRows ? (
            sortedEntries.map((item) => (
              <HistoryListPanelRow
                key={item.id}
                item={item}
                listSelectedLocalId={listSelectedLocalId}
                onSelectEntry={onSelectEntry}
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconHistory className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
      <div className={clsx(styles.indicators)}>
        <div className={styles.indicatorsInner}>
          <PostcardStatusLegend
            spot="historyList"
            isHistoryEmpty={legendTreatAsEmpty}
            statusCounts={legendStatusCounts}
          />
        </div>
      </div>
    </div>
  )
}
