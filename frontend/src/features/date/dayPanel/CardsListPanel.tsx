import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListCardphotoV2 } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import type {
  CalendarCardItem,
  CardCalendarIndex,
} from '@entities/card/domain/types'
import { DateListEntry } from '@features/date/presentation/dateList/DateListEntry'
import styles from './CardsListPanel.module.scss'

type Props = {
  dateKey: string
  dayData: CardCalendarIndex
  onClose: () => void
  onSelectCard?: (item: CalendarCardItem) => void
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

function formatDateKey(dateKey: string): string {
  if (dateKey === 'preview') return 'Cards'
  const [y, m, d] = dateKey.split('-').map(Number)
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return dateKey
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function flattenDayData(dayData: CardCalendarIndex): CalendarCardItem[] {
  const list: CalendarCardItem[] = []
  if (dayData.processed) list.push(dayData.processed)
  list.push(...dayData.cart)
  list.push(...dayData.ready)
  list.push(...dayData.sent)
  list.push(...dayData.delivered)
  list.push(...dayData.error)
  return list
}

function formatStatusLabel(item: CalendarCardItem): string {
  if (item.isProcessed) return 'Processed'
  return item.status.charAt(0).toUpperCase() + item.status.slice(1)
}

const DayPanelDateListEntry: React.FC<{
  item: CalendarCardItem
  isFocused: boolean
  onSelect: (entry: CalendarCardItem) => void
}> = ({ item, isFocused, onSelect }) => {
  const displayUrl = useAppSelector(selectCalendarPreviewDisplayUrl(item.cardId))
  const safeFallbackUrl = isBlobUrl(item.previewUrl) ? null : item.previewUrl

  return (
    <DateListEntry
      dateLabel={item.cardId}
      previewUrl={displayUrl ?? safeFallbackUrl}
      detailLine={formatStatusLabel(item)}
      previewStatus={item.status}
      previewIsProcessed={item.isProcessed}
      isFocused={isFocused}
      onSelect={() => onSelect(item)}
    />
  )
}

export const CardsListPanel: React.FC<Props> = ({
  dateKey,
  dayData,
  onClose,
  onSelectCard,
}) => {
  const dispatch = useAppDispatch()
  const entries = flattenDayData(dayData)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    entries.forEach((item) => {
      if (item.previewUrl) {
        dispatch(
          requestCalendarPreview({
            cardId: item.cardId,
            previewUrl: item.previewUrl,
          }),
        )
      }
    })
  }, [dateKey, entries, dispatch])
  const scrollbarTrackRef = useRef<HTMLDivElement>(null)
  const [scrollbarTrackReady, setScrollbarTrackReady] = useState(false)
  const setScrollbarTrackRef = useCallback((el: HTMLDivElement | null) => {
    ;(
      scrollbarTrackRef as React.MutableRefObject<HTMLDivElement | null>
    ).current = el
    if (el) setScrollbarTrackReady(true)
  }, [])
  const [focusedIndex, setFocusedIndex] = useState(0)

  useEffect(() => {
    listRef.current?.focus()
  }, [])

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${focusedIndex}"]`)
    el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [focusedIndex])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (entries.length === 0) return
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setFocusedIndex((i) => Math.min(i + 1, entries.length - 1))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setFocusedIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter' && onSelectCard) {
        e.preventDefault()
        onSelectCard(entries[focusedIndex])
      }
    },
    [entries, focusedIndex, onClose, onSelectCard],
  )

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <span className={styles.headerTitle}>{formatDateKey(dateKey)}</span>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close cards list"
        >
          <IconX />
        </button>
      </div>
      <div
        ref={setScrollbarTrackRef}
        className={styles.panelScrollTrack}
        aria-hidden
      />
      <ScrollArea
        className={styles.listScrollArea}
        scrollbarPortalTarget={
          scrollbarTrackReady ? scrollbarTrackRef : undefined
        }
      >
        <div
          ref={listRef}
          className={styles.list}
          tabIndex={0}
          role="listbox"
          aria-label="Cards for this day"
          onKeyDown={handleKeyDown}
        >
          {entries.length === 0 ? (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardphotoV2 className={styles.listEmptyIcon} />
            </div>
          ) : (
            entries.map((item, index) => (
              <div key={item.rowKey} data-index={index} role="option">
                <DayPanelDateListEntry
                  item={item}
                  isFocused={focusedIndex === index}
                  onSelect={(entry) => {
                    setFocusedIndex(index)
                    onSelectCard?.(entry)
                  }}
                />
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
