import React, { useCallback, useEffect, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { IconCardBlocked, IconCart } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { useCartFacade } from '../application/facades'
import {
  selectCartItems,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import { setCartListStatusSegment } from '@cart/infrastructure/state'
import { setCartCalendarDatePickMode } from '@date/calendar/infrastructure/state'
import type { CartListStatusSegment } from '@cart/domain/types'
import { requestCalendarPreview } from '@entities/card/infrastructure/state'
import { selectCalendarPreviewDisplayUrl } from '@entities/card/infrastructure/selectors'
import { listEntryPriceLine } from '@shared/utils/listEntryPriceLine'
import { CartListEntry, type CartListEntryVariant } from './CartListEntry'
import type { PostcardHydrated } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import styles from './CartListPanel.module.scss'

export type CartListPanelItem = {
  id: string
  cardId?: string
  sourceDate?: DispatchDate
  postcard?: PostcardHydrated
  dateLabel: string
  previewUrl?: string | null
  detailLine?: string
  priceLine?: string
  variant?: CartListEntryVariant
  previewStatus?: PostcardHydrated['status']
  previewIsProcessed?: boolean
  onDelete?: () => void
}

export type { CartListStatusSegment }

type Props = {
  /** If omitted, rows are built from Redux cart items filtered by выбранный сегмент (кнопки cart / cartBlocked). */
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

/** Сортировка: раньше по календарю (ближе по дате отправки) выше; «—» / без даты — в конец. */
function dispatchDateSortTimestamp(d: DispatchDate | undefined): number {
  if (d == null || (d.year === 0 && d.month === 0 && d.day === 0)) {
    return Number.POSITIVE_INFINITY
  }
  return new Date(d.year, d.month, d.day).getTime()
}

function compareCartListPanelItemsByDispatchDate(
  a: CartListPanelItem,
  b: CartListPanelItem,
): number {
  const ta = dispatchDateSortTimestamp(a.sourceDate)
  const tb = dispatchDateSortTimestamp(b.sourceDate)
  if (ta !== tb) return ta - tb
  const la = a.postcard?.localId
  const lb = b.postcard?.localId
  if (la != null && lb != null && la !== lb) return la - lb
  return a.id.localeCompare(b.id)
}

function formatRecipientLine(
  postcard: PostcardHydrated | undefined,
): string | undefined {
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

/** Leading amount in a list price string (aligned with row `priceLine` / `listEntryPriceLine`). */
function numericFromPriceLine(line: string): number {
  const m = line.match(/[\d]+(?:[.,]\d+)?/)
  if (!m) return 0
  return parseFloat(m[0].replace(',', '.')) || 0
}

/** Text after the first number (e.g. `USD` from `6.00 USD`). */
function currencySuffixFromPriceLine(line: string): string {
  const m = line.match(/[\d]+(?:[.,]\d+)?/)
  if (!m) return 'USD'
  const tail = line.slice(line.indexOf(m[0]) + m[0].length).trim()
  return tail || 'USD'
}

function cartPostcardsToEntries(
  postcards: PostcardHydrated[],
  segment: CartListStatusSegment,
): CartListPanelItem[] {
  const currentDate = getCurrentDate()
  return postcards
    .filter((p) => p.status === segment)
    .map((p) => {
      const variant = isDispatchDateDisabledForOrder(p.date, currentDate)
        ? ('inactive' as const)
        : ('default' as const)
      return {
        id: `${segment}-${p.id}`,
        cardId: p.card.id,
        sourceDate: p.date,
        postcard: p,
        dateLabel: formatDispatchDateLabel(p.date),
        previewUrl: p.card.thumbnailUrl ?? null,
        detailLine: formatRecipientLine(p),
        priceLine: listEntryPriceLine(p),
        variant,
        previewStatus: p.status,
        previewIsProcessed: Boolean(p.card.isProcessed),
      } satisfies CartListPanelItem
    })
}

const CartListPanelRow: React.FC<{
  item: CartListPanelItem
  onSelectEntry?: (item: CartListPanelItem) => void
  isSelected?: boolean
}> = ({ item, onSelectEntry, isSelected = false }) => {
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
  const hidePrice = item.variant === 'inactive'

  const handleRemoveFromCart = useCallback(() => {
    const lid = item.postcard?.localId
    if (lid != null) removeItem(lid)
  }, [item.postcard?.localId, removeItem])

  const onDeleteRow =
    item.onDelete ??
    (item.postcard?.localId != null ? handleRemoveFromCart : undefined)

  return (
    <CartListEntry
      key={item.id}
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      detailLine={item.detailLine}
      priceLine={
        hidePrice ? undefined : (item.priceLine ?? listEntryPriceLine(item.postcard))
      }
      variant={item.variant}
      previewStatus={item.previewStatus}
      previewIsProcessed={item.previewIsProcessed}
      postcardLocalId={item.postcard?.localId}
      onSelect={onSelectEntry ? () => onSelectEntry(item) : undefined}
      isSelected={isSelected}
      onDelete={onDeleteRow}
    />
  )
}

export const CartListPanel: React.FC<Props> = ({
  entries: entriesProp,
  onSelectEntry,
}) => {
  const dispatch = useAppDispatch()
  const cartItems = useAppSelector(selectCartItems)
  const listSegment = useAppSelector(selectCartListStatusSegment)
  const {
    setCartListPanelOpen,
    listSelectedLocalId,
    setCartListSelectedLocalId,
  } = useCartFacade()

  const handleSelectCartSegment = useCallback(() => {
    if (listSegment === 'cartBlocked') {
      dispatch(setCartCalendarDatePickMode(false))
    }
    dispatch(setCartListStatusSegment('cart'))
  }, [dispatch, listSegment])

  const cartSegmentCounts = useMemo(() => {
    const cart = cartItems.filter((p) => p.status === 'cart').length
    const cartBlocked = cartItems.filter(
      (p) => p.status === 'cartBlocked',
    ).length
    return { cart, cartBlocked }
  }, [cartItems])

  const entriesFromStore = useMemo(() => {
    if (entriesProp != null) return []
    return cartPostcardsToEntries(cartItems, listSegment)
  }, [entriesProp, cartItems, listSegment])

  const entries = useMemo(() => {
    const raw = entriesProp ?? entriesFromStore
    return [...raw].sort(compareCartListPanelItemsByDispatchDate)
  }, [entriesProp, entriesFromStore])

  /** Смена сегмента: снять выбор, если открытка не в текущем списке. */
  useEffect(() => {
    if (entriesProp != null) return
    const lids = new Set(
      entriesFromStore
        .map((e) => e.postcard?.localId)
        .filter((id): id is number => id != null),
    )
    if (
      listSelectedLocalId != null &&
      !lids.has(listSelectedLocalId)
    ) {
      setCartListSelectedLocalId(null)
    }
  }, [
    entriesProp,
    entriesFromStore,
    listSelectedLocalId,
    setCartListSelectedLocalId,
  ])
  const hasRows = entries.length > 0
  /**
   * У футера «неактивные» только в режиме `cart` из стора. В `cartBlocked` — все строки сверху,
   * как у активных в обычной корзине.
   */
  const splitInactiveToFooter =
    entriesProp != null || listSegment === 'cart'

  const activeEntries = useMemo(() => {
    if (!splitInactiveToFooter) return entries
    return entries.filter((e) => e.variant !== 'inactive')
  }, [entries, splitInactiveToFooter])

  const inactiveEntries = useMemo(() => {
    if (!splitInactiveToFooter) return []
    return entries.filter((e) => e.variant === 'inactive')
  }, [entries, splitInactiveToFooter])
  const listContentKey =
    entriesProp != null
      ? entries.map((e) => e.id).join('|')
      : `${listSegment}|${entries.map((e) => e.id).join('|')}`

  const cartTotalDisplay = useMemo(() => {
    const billableEntries = entries.filter((e) => e.variant !== 'inactive')
    if (billableEntries.length === 0) {
      const emptyLine = listEntryPriceLine(undefined)
      return `0.00 ${currencySuffixFromPriceLine(emptyLine)}`
    }
    let sum = 0
    for (const e of billableEntries) {
      const line = e.priceLine ?? listEntryPriceLine(e.postcard)
      sum += numericFromPriceLine(line)
    }
    const suffix = currencySuffixFromPriceLine(
      billableEntries[0].priceLine ?? listEntryPriceLine(billableEntries[0].postcard),
    )
    return `${sum.toFixed(2)} ${suffix}`
  }, [entries])

  const handleCloseList = useCallback(() => {
    setCartListPanelOpen(false)
  }, [setCartListPanelOpen])

  /** Total footer only for billable cart; hidden for blocked segment from store. */
  const showCartFooter =
    entriesProp != null || listSegment === 'cart'

  const listLeadIconKey =
    entriesProp == null && listSegment === 'cartBlocked'
      ? 'cardBlocked'
      : 'cart'

  return (
    <div
      className={clsx(
        styles.panel,
        !showCartFooter && styles.panelNoFooter,
        !hasRows && styles.panelEmptyNoToolbar,
      )}
    >
      <ListPanelStackedHeader
        leadIconKey={listLeadIconKey}
        headerTopCenter={
          entriesProp == null ? (
            <div
              className={styles.cartHeaderSegments}
              role="group"
              aria-label="Cart list header actions"
            >
              <div className={styles.headerBelowSegmentSlot}>
                <button
                  type="button"
                  className={clsx(styles.headerBelowSquare, styles.cart)}
                  aria-label={
                    cartSegmentCounts.cart > 0
                      ? `Cart, ${cartSegmentCounts.cart} postcards`
                      : 'Cart'
                  }
                  aria-pressed={listSegment === 'cart'}
                  onClick={handleSelectCartSegment}
                >
                  {cartSegmentCounts.cart > 0 ? (
                    <span className={styles.headerBelowCount} aria-hidden>
                      {cartSegmentCounts.cart}
                    </span>
                  ) : null}
                </button>
              </div>
              <div className={styles.headerBelowSegmentSlot}>
                <button
                  type="button"
                  className={clsx(
                    styles.headerBelowSquare,
                    styles.cartBlocked,
                  )}
                  aria-label={
                    cartSegmentCounts.cartBlocked > 0
                      ? `Cart blocked, ${cartSegmentCounts.cartBlocked} postcards`
                      : 'Cart blocked'
                  }
                  aria-pressed={listSegment === 'cartBlocked'}
                  onClick={() =>
                    dispatch(setCartListStatusSegment('cartBlocked'))
                  }
                >
                  {cartSegmentCounts.cartBlocked > 0 ? (
                    <span className={styles.headerBelowCount} aria-hidden>
                      {cartSegmentCounts.cartBlocked}
                    </span>
                  ) : null}
                </button>
              </div>
            </div>
          ) : undefined
        }
        toolbar={hasRows ? <Toolbar section="cartList" /> : false}
        showDividerWithoutToolbar={!hasRows}
        onClose={handleCloseList}
        closeAriaLabel="Close cart list"
      />
      <div className={styles.panelScrollTrack} aria-hidden />
      <ScrollArea className={styles.listScrollArea}>
        <div
          key={listContentKey}
          className={styles.list}
          tabIndex={0}
          aria-label={
            entriesProp != null
              ? 'Cart postcards list'
              : listSegment === 'cart'
                ? 'Postcards in cart'
                : 'Postcards cart blocked'
          }
        >
          {hasRows ? (
            <>
              <div className={styles.listActiveGroup}>
                {activeEntries.map((item) => (
                  <CartListPanelRow
                    key={item.id}
                    item={item}
                    onSelectEntry={onSelectEntry}
                    isSelected={
                      item.postcard?.localId != null &&
                      item.postcard.localId === listSelectedLocalId
                    }
                  />
                ))}
              </div>
              {inactiveEntries.length > 0 ? (
                <div className={styles.listInactiveGroup}>
                  {inactiveEntries.map((item) => (
                    <CartListPanelRow
                      key={item.id}
                      item={item}
                      onSelectEntry={onSelectEntry}
                      isSelected={
                        item.postcard?.localId != null &&
                        item.postcard.localId === listSelectedLocalId
                      }
                    />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className={styles.listEmpty} aria-hidden>
              {entriesProp == null && listSegment === 'cartBlocked' ? (
                <IconCardBlocked className={styles.listEmptyIcon} />
              ) : (
                <IconCart className={styles.listEmptyIcon} />
              )}
            </div>
          )}
        </div>
      </ScrollArea>
      {showCartFooter ? (
        <footer
          className={styles.footer}
          aria-label={`Cart total ${cartTotalDisplay}`}
        >
          <span className={styles.footerLabel}>Total</span>
          <span className={styles.footerAmount}>{cartTotalDisplay}</span>
        </footer>
      ) : null}
    </div>
  )
}
