import React, { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconX, IconListDate, IconCart } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { useCartFacade } from '../application/facades'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { CartListEntry, type CartListEntryVariant } from './CartListEntry'
import type { PostcardStatus, Postcard } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import styles from './CartListPanel.module.scss'
import {
  CardCalendarIndex,
  CalendarCardItem,
} from '@/entities/card/domain/types'
// import { PostcardStatusLegend } from './postcardStatusLegend/PostcardStatusLegend'

export type CartListPanelItem = {
  id: string
  cardId?: string
  sourceDate?: Postcard
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  variant?: CartListEntryVariant
  previewStatus?: PostcardStatus
  previewIsProcessed?: boolean
  onDelete?: () => void
}

type Props = {
  entries?: CartListPanelItem[]
  onSelectEntry?: (item: CartListPanelItem) => void
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

function flattenCartList(dayData: CardCalendarIndex): CalendarCardItem[] {
  const list: CalendarCardItem[] = []
  if (dayData.processed) list.push(dayData.processed)
  list.push(...dayData.cart)

  return list
}

const CartListPanelRow: React.FC<{
  item: CartListPanelItem
  onSelectEntry?: (item: CartListPanelItem) => void
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
    <CartListEntry
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

export const CartListPanel: React.FC<Props> = ({
  entries = [],
  onSelectEntry,
}) => {
  const { listPanelOpen, setCartListPanelOpen } = useCartFacade()
  const hasRows = entries.length > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  const handleCloseList = useCallback(() => {
    setCartListPanelOpen(false)
  }, [listPanelOpen])

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerToolbar}>
          <Toolbar section="cartList" />
        </div>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={handleCloseList}
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
          {/* <CartListEntry /> */}
          {hasRows ? (
            entries.map((item) => (
              <CartListPanelRow
                key={item.id}
                item={item}
                onSelectEntry={onSelectEntry}
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconCart className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
      {/* {hasRows && (
        <div className={styles.indicators}>
          <div className={styles.indicatorsInner}>
            <PostcardStatusLegend spot="dateList" />
          </div>
        </div>
      )} */}
    </div>
  )
}
