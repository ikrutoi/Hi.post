import React, { useCallback, useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconCart } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { useCartFacade } from '../application/facades'
import { selectCartItems } from '@cart/infrastructure/selectors'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { listEntryPriceLine } from '@shared/utils/listEntryPriceLine'
import { CartListEntry, type CartListEntryVariant } from './CartListEntry'
import type { Postcard } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import styles from './CartListPanel.module.scss'

export type CartListPanelItem = {
  id: string
  cardId?: string
  sourceDate?: DispatchDate
  postcard?: Postcard
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  priceLine?: string
  variant?: CartListEntryVariant
  previewIsProcessed?: boolean
  onDelete?: () => void
}

type Props = {
  /** If omitted, rows are built from Redux cart items with `status === 'cart'`. */
  entries?: CartListPanelItem[]
  onSelectEntry?: (item: CartListPanelItem) => void
}

const isBlobUrl = (url: string | null | undefined): boolean =>
  typeof url === 'string' && url.startsWith('blob:')

function formatDispatchDateLabel(d: DispatchDate): string {
  if (d.year === 0 && d.month === 0 && d.day === 0) {
    return '—'
  }
  const date = new Date(d.year, d.month, d.day)
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatRecipientLine(postcard: Postcard | undefined): string | undefined {
  const recipient = postcard?.card?.envelope?.recipient
  if (!recipient) return undefined
  const source =
    recipient.appliedData ??
    recipient.viewDraft ??
    recipient.formDraft ??
    null
  const name = String(source?.name ?? '').trim()
  const country = String(source?.country ?? '').trim()
  const city = String(source?.city ?? '').trim()
  const region = country || city
  if (name && region) return `${name}, ${region}`
  return name || region || undefined
}

function cartPostcardsToEntries(postcards: Postcard[]): CartListPanelItem[] {
  return postcards
    .filter((p) => p.status === 'cart')
    .map((p) => ({
      id: `cart-${p.id}`,
      cardId: p.card.id,
      sourceDate: p.date,
      postcard: p,
      dateLabel: formatDispatchDateLabel(p.date),
      previewUrl: p.card.thumbnailUrl ?? null,
      detailLine: formatRecipientLine(p),
      priceLine: listEntryPriceLine(p),
      variant: 'default' as const,
      previewIsProcessed: Boolean(p.card.isProcessed),
    }))
}

const CartListPanelRow: React.FC<{
  item: CartListPanelItem
  onSelectEntry?: (item: CartListPanelItem) => void
  isSelected?: boolean
}> = ({ item, onSelectEntry, isSelected = false }) => {
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
      priceLine={item.priceLine ?? listEntryPriceLine(item.postcard)}
      variant={item.variant}
      onSelect={
        onSelectEntry && item.variant !== 'inactive'
          ? () => onSelectEntry(item)
          : undefined
      }
      isSelected={isSelected}
      onDelete={item.onDelete}
    />
  )
}

export const CartListPanel: React.FC<Props> = ({
  entries: entriesProp,
  onSelectEntry,
}) => {
  const cartItems = useAppSelector(selectCartItems)
  const { setCartListPanelOpen, listSelectedLocalId } = useCartFacade()

  const entriesFromStore = useMemo(
    () => cartPostcardsToEntries(cartItems),
    [cartItems],
  )

  const entries = entriesProp ?? entriesFromStore
  const hasRows = entries.length > 0
  const listContentKey = entries.map((e) => e.id).join('|')

  const handleCloseList = useCallback(() => {
    setCartListPanelOpen(false)
  }, [setCartListPanelOpen])

  return (
    <div className={styles.panel}>
      <ListPanelStackedHeader
        leadIconKey="cart"
        toolbar={<Toolbar section="cartList" />}
        onClose={handleCloseList}
        closeAriaLabel="Close cart list"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label="Cart postcards list"
        >
          {hasRows ? (
            entries.map((item) => (
              <CartListPanelRow
                key={item.id}
                item={item}
                onSelectEntry={onSelectEntry}
                isSelected={
                  item.postcard?.localId != null &&
                  item.postcard.localId === listSelectedLocalId
                }
              />
            ))
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              <IconCart className={styles.listEmptyIcon} />
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
