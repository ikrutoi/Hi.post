import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListCardPie } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import {
  CardPieListEntry,
  type CardPieListEntryVariant,
} from './cardPieList/CardPieListEntry'
import type { PostcardStatus } from '@entities/postcard'
import styles from './CardPiePanel.module.scss'

export type CardPiePanelItem = {
  id: string
  cardId?: string
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: CardPieListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onDelete?: () => void
}

type Props = {
  onClose: () => void
  entries?: CardPiePanelItem[]
  onSelectEntry?: (item: CardPiePanelItem) => void
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

const CardPiePanelRow: React.FC<{
  item: CardPiePanelItem
  onSelectEntry?: (item: CardPiePanelItem) => void
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
    <CardPieListEntry
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

export const CardPiePanel: React.FC<Props> = ({
  onClose,
  entries = [],
  onSelectEntry,
}) => {
  const hasRows = entries.length > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="cardPieList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close card pie list"
        >
          <IconX />
        </button>
      </div>
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label="Card pie variants list"
        >
          {hasRows ? (
            entries.map((item) => (
              <CardPiePanelRow
                key={item.id}
                item={item}
                onSelectEntry={onSelectEntry}
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconListCardPie className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
