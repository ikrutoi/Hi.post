import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListDate, IconHistory } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { type HistoryListEntryVariant } from './historyList/HistoryListEntry'
import type { PostcardStatus } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import styles from './HistoryListPanel.module.scss'
import { PostcardStatusLegend } from './postcardStatusLegend/PostcardStatusLegend'
import { useDateFacade } from '../application/facades/useDateFacade'
import { DateListPanelItem } from './DateListPanel'
import { HistoryListEntry } from './historyList/HistoryListEntry'
import clsx from 'clsx'

export type HistoryListPanelItem = {
  id: string
  cardId?: string
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
  onSelectEntry?: (item: HistoryListPanelItem) => void
  // section: 'date' | 'history'
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

const DateListPanelRow: React.FC<{
  item: DateListPanelItem
  onSelectEntry?: (item: DateListPanelItem) => void
}> = ({ item, onSelectEntry }) => {
  const dispatch = useAppDispatch()
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
      onDelete={item.onDelete}
    />
  )
}

export const HistoryListPanel: React.FC<Props> = ({
  onClose,
  entries = [],
  onSelectEntry,
  // section,
}) => {
  // const { isHistoryMode } = useDateFacade()
  const hasRows = entries.length > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="historyList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close date list"
        >
          <IconX />
        </button>
        {/* <div className={styles.headerToolbarIndicator} /> */}
      </div>
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label="Dispatch date list"
        >
          {hasRows ? (
            entries.map((item) => (
              <DateListPanelRow
                key={item.id}
                item={item}
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
            // isHistoryMode={isHistoryMode}
          />
        </div>
      </div>
    </div>
  )
}
