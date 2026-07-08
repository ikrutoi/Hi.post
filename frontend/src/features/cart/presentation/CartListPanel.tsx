import React, { useCallback, useEffect, useMemo } from 'react'
import { useListCardPreviewUrl } from '@entities/card/application/hooks/useListCardPreviewUrl'
import { cardListPreviewUrlFromCard } from '@entities/card/domain/helpers'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { useSizeFacade } from '@layout/application/facades/useSizeFacade'
import { IconCardBlocked, IconCart } from '@shared/ui/icons'
import { ScrollArea } from '@shared/ui/ScrollArea/ScrollArea'
import { Toolbar } from '@toolbar/presentation/Toolbar'
import { CART_LIST_TOOLBAR } from '@toolbar/domain/types/cartList.types'
import { ListPanelStackedHeader } from '@shared/ui/ListPanelStackedHeader/ListPanelStackedHeader'
import { cartListBillableLocalIds } from '@cart/application/logic/cartListBillableLocalIds'
import { useCartFacade } from '../application/facades'
import {
  selectCartItems,
  selectCartListCheckedLocalIds,
  selectCartListStatusSegment,
} from '@cart/infrastructure/selectors'
import {
  setCartListCheckedLocalIds,
  toggleCartListEntryChecked,
} from '@cart/infrastructure/state'
import { updateToolbarIcon } from '@toolbar/infrastructure/state'
import { notebookTabCartClicked } from '@date/calendar/application/orchestration/notebookOrchestration.events'
import type { CartListStatusSegment } from '@cart/domain/types'
import { listEntryPriceLine } from '@shared/utils/listEntryPriceLine'
import { CartListEntry, type CartListEntryVariant } from './CartListEntry'
import { CartHeaderSegments } from './CartHeaderSegments'
import type { PostcardHydrated } from '@entities/postcard'
import type { DispatchDate } from '@entities/date/domain/types'
import { getCurrentDate } from '@shared/utils/date'
import { isDispatchDateDisabledForOrder } from '@entities/date/utils'
import type { IconKey } from '@shared/config/constants'
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
  /** cartBlocked: dateEdit — правый CardPie и данные открытки строки. */
  onDateEditEntry?: (item: CartListPanelItem) => void
  /** Мобильный список: иконка «Дата» вместо корзины / blocked. */
  leadIconKeyOverride?: IconKey
  /** Мобильный список: без иконки «Дата» и кнопки закрытия в шапке. */
  hideListHeaderChrome?: boolean
  /** Mobile factory: toolbars live in shell, not in panel header. */
  factoryChrome?: boolean
}

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
        previewUrl: cardListPreviewUrlFromCard(p.card),
        detailLine: formatRecipientLine(p),
        priceLine: listEntryPriceLine(p),
        variant,
        previewStatus: p.status,
        previewIsProcessed:
          Boolean(p.card.isProcessed) ||
          Boolean(p.card.cardphoto?.appliedData ?? p.card.cardphoto?.assetData),
      } satisfies CartListPanelItem
    })
}

const CartListPanelRow: React.FC<{
  item: CartListPanelItem
  onSelectEntry?: (item: CartListPanelItem) => void
  onDateEditEntry?: (item: CartListPanelItem) => void
  isSelected?: boolean
  isChecked?: boolean
  onToggleChecked?: (localId: number) => void
  hideRowDelete?: boolean
}> = ({
  item,
  onSelectEntry,
  onDateEditEntry,
  isSelected = false,
  isChecked = false,
  onToggleChecked,
  hideRowDelete = false,
}) => {
  const { removeItem } = useCartFacade()
  const { displayUrl, onPreviewImgError } = useListCardPreviewUrl(
    item.cardId,
    item.previewUrl,
    { previewIsProcessed: item.previewIsProcessed },
  )
  const hidePrice = item.variant === 'inactive'

  const handleRemoveFromCart = useCallback(() => {
    const lid = item.postcard?.localId
    if (lid != null) removeItem(lid)
  }, [item.postcard?.localId, removeItem])

  const onDeleteRow = hideRowDelete
    ? undefined
    : (item.onDelete ??
      (item.postcard?.localId != null ? handleRemoveFromCart : undefined))

  return (
    <CartListEntry
      key={item.id}
      dateLabel={item.dateLabel}
      previewUrl={displayUrl}
      onPreviewImgError={onPreviewImgError}
      detailLine={item.detailLine}
      priceLine={
        hidePrice ? undefined : (item.priceLine ?? listEntryPriceLine(item.postcard))
      }
      variant={item.variant}
      previewStatus={item.previewStatus}
      previewIsProcessed={item.previewIsProcessed}
      postcardLocalId={item.postcard?.localId}
      onSelect={onSelectEntry ? () => onSelectEntry(item) : undefined}
      onDateEditActivate={
        onDateEditEntry ? () => onDateEditEntry(item) : undefined
      }
      isChecked={isChecked}
      onCheckedChange={
        onToggleChecked && item.postcard?.localId != null
          ? () => onToggleChecked(item.postcard!.localId)
          : undefined
      }
      isSelected={isSelected}
      onDelete={onDeleteRow}
    />
  )
}

export const CartListPanel: React.FC<Props> = ({
  entries: entriesProp,
  onSelectEntry,
  onDateEditEntry,
  leadIconKeyOverride,
  hideListHeaderChrome = false,
  factoryChrome = false,
}) => {
  const dispatch = useAppDispatch()
  const { isMobileLayout } = useSizeFacade()
  const useFactoryChrome = factoryChrome && isMobileLayout
  const cartItems = useAppSelector(selectCartItems)
  const listSegment = useAppSelector(selectCartListStatusSegment)
  const checkedLocalIds = useAppSelector(selectCartListCheckedLocalIds)
  const checkedLocalIdSet = useMemo(
    () => new Set(checkedLocalIds),
    [checkedLocalIds],
  )
  const {
    setCartListPanelOpen,
    listSelectedLocalId,
    setCartListSelectedLocalId,
  } = useCartFacade()

  const handleToggleEntryChecked = useCallback(
    (localId: number) => {
      dispatch(toggleCartListEntryChecked(localId))
    },
    [dispatch],
  )

  const billableCartLocalIds = useMemo(
    () => cartListBillableLocalIds(cartItems),
    [cartItems],
  )

  /** Синхронизация галочки в toolbar checkBox при ручном выборе строк. */
  useEffect(() => {
    if (entriesProp != null || listSegment !== 'cart') return

    const validIds = new Set(cartItems.map((p) => p.localId))
    const pruned = checkedLocalIds.filter((id) => validIds.has(id))
    if (pruned.length !== checkedLocalIds.length) {
      dispatch(setCartListCheckedLocalIds(pruned))
      return
    }

    const allChecked =
      billableCartLocalIds.length > 0 &&
      billableCartLocalIds.every((id) => checkedLocalIdSet.has(id))
    dispatch(
      updateToolbarIcon({
        section: 'cartList',
        key: 'checkBox',
        value: allChecked ? 'active' : 'enabled',
      }),
    )
  }, [
    billableCartLocalIds,
    cartItems,
    checkedLocalIdSet,
    checkedLocalIds,
    dispatch,
    entriesProp,
    listSegment,
  ])

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
    const entriesForTotal = entries.filter((e) => e.variant !== 'inactive')

    if (entriesForTotal.length === 0) {
      const emptyLine = listEntryPriceLine(undefined)
      return `0.00 ${currencySuffixFromPriceLine(emptyLine)}`
    }
    let sum = 0
    for (const e of entriesForTotal) {
      const line = e.priceLine ?? listEntryPriceLine(e.postcard)
      sum += numericFromPriceLine(line)
    }
    const suffix = currencySuffixFromPriceLine(
      entriesForTotal[0].priceLine ??
        listEntryPriceLine(entriesForTotal[0].postcard),
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
    leadIconKeyOverride ??
    (entriesProp == null && listSegment === 'cartBlocked'
      ? 'cardBlocked'
      : 'cart')

  const cartListToolbarGroupsOverride = useMemo(() => {
    if (entriesProp != null || listSegment !== 'cartBlocked') {
      return undefined
    }
    return CART_LIST_TOOLBAR.filter((group) => group.group !== 'cartList')
  }, [entriesProp, listSegment])

  const handleLeadIconClick = useCallback(() => {
    if (leadIconKeyOverride == null) return
    dispatch(notebookTabCartClicked())
  }, [dispatch, leadIconKeyOverride])

  return (
    <div
      className={clsx(
        styles.panel,
        !showCartFooter && styles.panelNoFooter,
        !hasRows && styles.panelEmptyNoToolbar,
        useFactoryChrome && styles.panelFactoryChrome,
      )}
    >
      {!useFactoryChrome ? (
        <ListPanelStackedHeader
          leadIconKey={listLeadIconKey}
          cardPieListHeaderIcons
          hideLeadIcon={hideListHeaderChrome}
          hideClose={hideListHeaderChrome}
          onLeadIconClick={
            !hideListHeaderChrome && leadIconKeyOverride != null
              ? handleLeadIconClick
              : undefined
          }
          leadIconAriaLabel="Cart calendar"
          headerTopCenter={
            entriesProp == null ? <CartHeaderSegments /> : undefined
          }
          toolbar={
            hasRows ? (
              <Toolbar
                section="cartList"
                groupsOverride={cartListToolbarGroupsOverride}
                justifyGroupsEnd={cartListToolbarGroupsOverride != null}
              />
            ) : (
              false
            )
          }
          showDividerWithoutToolbar={!hasRows}
          onClose={hideListHeaderChrome ? undefined : handleCloseList}
          closeAriaLabel="Close cart list"
        />
      ) : null}
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
                    onDateEditEntry={onDateEditEntry}
                    hideRowDelete={isMobileLayout}
                    isSelected={
                      item.postcard?.localId != null &&
                      item.postcard.localId === listSelectedLocalId
                    }
                    isChecked={
                      item.postcard?.localId != null &&
                      checkedLocalIdSet.has(item.postcard.localId)
                    }
                    onToggleChecked={
                      listSegment === 'cart' ? handleToggleEntryChecked : undefined
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
                      onDateEditEntry={onDateEditEntry}
                      hideRowDelete={isMobileLayout}
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
          <span className={styles.footerAmount}>{cartTotalDisplay}</span>
        </footer>
      ) : null}
    </div>
  )
}
