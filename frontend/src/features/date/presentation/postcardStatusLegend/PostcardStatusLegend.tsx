import React, { useCallback, useMemo } from 'react'
import clsx from 'clsx'
import { useAppDispatch, useAppSelector } from '@app/hooks'
import { store } from '@app/state/store'
import { setCartListSelectedLocalId } from '@cart/infrastructure/state'
import {
  setHistoryListSelectedLocalId,
  stepStripMonthCycle,
} from '@date/calendar/infrastructure/state'
import { selectLastStripMonthCycleStep, selectHistoryListSelectedLocalId } from '@date/calendar/infrastructure/selectors'
import { selectCartItems, selectCartListSelectedLocalId } from '@cart/infrastructure/selectors'
import {
  calendarMonthAtStripCycleIndex,
  orderedStripPostcardsByDispatchDate,
  stripPostcardAtCycleIndex,
  stripPostcardIndexByLocalId,
  stripPostcardsLocalIdsKey,
  type CalendarStripKind,
  type CartStripMonthCycleStatus,
  type HistoryStripMonthCycleStatus,
} from '@date/application/helpers/calendarStripMonthCycle'
import { applyRightListArchiveToolbarVisuals } from '@toolbar/application/syncRightListArchiveToolbarVisuals'
import type { PostcardHydrated } from '@entities/postcard'
import {
  IconCart,
  IconCardBlocked,
  IconPostcardSend,
  IconPostcardReady,
  IconPostcardDelivered,
  IconPostcardNotDelivered,
} from '@shared/ui/icons'
import styles from './PostcardStatusLegend.module.scss'
import { useCalendarFacade } from '../../calendar/application/facades/useCalendarFacade'
import { PostcardStatus } from '@/entities/postcard/domain/types'

export type PostcardStatusLegendProps = {
  spot: 'calendar' | 'historyList'
  isHistoryEmpty: boolean
  statusCounts?: Record<PostcardStatus, number>
  calendarDispatchDimmed?: boolean
  calendarCartStripLegendOnly?: boolean
  calendarCartStripBlockedLegend?: boolean
  /** Футер календаря в режиме «История» (аналог `calendarCartStripBlockedLegend` для корзины). */
  calendarHistoryStripLegend?: boolean
  /** Mobile footer: cart / history strip — чуть крупнее точки и иконки. */
  calendarCartHistoryFooter?: boolean
  /** Футер календаря (cart/history): всегда enabled, без active при клике. */
  calendarFooterAlwaysEnabled?: boolean
}

const HISTORY_STRIP_STATUSES: HistoryStripMonthCycleStatus[] = [
  'ready',
  'sent',
  'delivered',
  'error',
]

function isHistoryStripStatus(
  status: PostcardStatus,
): status is HistoryStripMonthCycleStatus {
  return (HISTORY_STRIP_STATUSES as readonly PostcardStatus[]).includes(status)
}

export const PostcardStatusLegend: React.FC<PostcardStatusLegendProps> = ({
  spot,
  isHistoryEmpty,
  statusCounts,
  calendarDispatchDimmed = false,
  calendarCartStripLegendOnly = false,
  calendarCartStripBlockedLegend = false,
  calendarHistoryStripLegend = false,
  calendarCartHistoryFooter = false,
  calendarFooterAlwaysEnabled = false,
}) => {
  const dispatch = useAppDispatch()
  const { postcardStatuses, togglePostcardStatus, setCalendarViewDate } =
    useCalendarFacade()
  const cartItems = useAppSelector(selectCartItems)

  const orderedCartPostcards = useMemo(
    () => orderedStripPostcardsByDispatchDate(cartItems, 'cart'),
    [cartItems],
  )
  const orderedCartBlockedPostcards = useMemo(
    () => orderedStripPostcardsByDispatchDate(cartItems, 'cartBlocked'),
    [cartItems],
  )

  const orderedHistoryReady = useMemo(
    () => orderedStripPostcardsByDispatchDate(cartItems, 'ready'),
    [cartItems],
  )
  const orderedHistorySent = useMemo(
    () => orderedStripPostcardsByDispatchDate(cartItems, 'sent'),
    [cartItems],
  )
  const orderedHistoryDelivered = useMemo(
    () => orderedStripPostcardsByDispatchDate(cartItems, 'delivered'),
    [cartItems],
  )
  const orderedHistoryError = useMemo(
    () => orderedStripPostcardsByDispatchDate(cartItems, 'error'),
    [cartItems],
  )

  const historyItemsByStatus = useMemo(
    () => ({
      ready: orderedHistoryReady,
      sent: orderedHistorySent,
      delivered: orderedHistoryDelivered,
      error: orderedHistoryError,
    }),
    [
      orderedHistoryDelivered,
      orderedHistoryError,
      orderedHistoryReady,
      orderedHistorySent,
    ],
  )

  const showStatusCounts =
    statusCounts != null && spot === 'historyList'

  const hideCartInCalendarDateFooter =
    calendarCartStripLegendOnly && !calendarCartStripBlockedLegend

  const statusCountValue = (status: PostcardStatus): number => {
    if (statusCounts == null) return 0
    if (status === 'cart' && !calendarCartStripBlockedLegend) {
      return statusCounts.cart + statusCounts.cartBlocked
    }
    return statusCounts[status]
  }

  const stripCycleItemCount = (status: PostcardStatus): number => {
    if (calendarCartStripBlockedLegend && status === 'cart') {
      return orderedCartPostcards.length
    }
    if (calendarCartStripBlockedLegend && status === 'cartBlocked') {
      return orderedCartBlockedPostcards.length
    }
    if (calendarHistoryStripLegend && status === 'cart') {
      return orderedCartPostcards.length
    }
    if (calendarHistoryStripLegend && isHistoryStripStatus(status)) {
      return historyItemsByStatus[status].length
    }
    return statusCountValue(status)
  }

  const cycleStripMonth = useCallback(
    (
      strip: CalendarStripKind,
      status: CartStripMonthCycleStatus | HistoryStripMonthCycleStatus | 'cart',
      items: readonly PostcardHydrated[],
      archiveSource?: 'cart' | 'history',
    ) => {
      if (items.length === 0) return

      const localIdsKey = stripPostcardsLocalIdsKey(items)
      const selectedLocalId =
        archiveSource === 'cart'
          ? selectCartListSelectedLocalId(store.getState())
          : archiveSource === 'history'
            ? selectHistoryListSelectedLocalId(store.getState())
            : null
      const selectedIndex = stripPostcardIndexByLocalId(items, selectedLocalId)

      dispatch(
        stepStripMonthCycle({
          strip,
          status,
          localIdsKey,
          itemCount: items.length,
          selectedIndex: selectedIndex >= 0 ? selectedIndex : undefined,
        }),
      )

      const step = selectLastStripMonthCycleStep(store.getState())
      if (
        step == null ||
        step.strip !== strip ||
        step.status !== status
      ) {
        return
      }

      const item = stripPostcardAtCycleIndex(items, step.index)
      const nextMonth = calendarMonthAtStripCycleIndex(items, step.index)
      if (nextMonth == null || item == null) return

      setCalendarViewDate(nextMonth)

      if (archiveSource === 'cart') {
        dispatch(setCartListSelectedLocalId(item.localId))
        applyRightListArchiveToolbarVisuals(dispatch, store.getState(), 'cart')
      } else if (archiveSource === 'history') {
        dispatch(setHistoryListSelectedLocalId(item.localId))
        applyRightListArchiveToolbarVisuals(
          dispatch,
          store.getState(),
          'history',
        )
      }
    },
    [dispatch, setCalendarViewDate],
  )

  const handlePostcardStatusClick = (status: PostcardStatus) => {
    if (
      calendarFooterAlwaysEnabled &&
      calendarCartStripBlockedLegend &&
      (status === 'cart' || status === 'cartBlocked')
    ) {
      if (stripCycleItemCount(status) <= 0) return
      cycleStripMonth(
        'cart',
        status,
        status === 'cart' ? orderedCartPostcards : orderedCartBlockedPostcards,
        'cart',
      )
      return
    }
    if (
      calendarFooterAlwaysEnabled &&
      calendarHistoryStripLegend &&
      status === 'cart'
    ) {
      if (stripCycleItemCount(status) <= 0) return
      cycleStripMonth('history', 'cart', orderedCartPostcards, 'history')
      return
    }
    if (
      calendarFooterAlwaysEnabled &&
      calendarHistoryStripLegend &&
      isHistoryStripStatus(status)
    ) {
      if (stripCycleItemCount(status) <= 0) return
      cycleStripMonth(
        'history',
        status,
        historyItemsByStatus[status],
        'history',
      )
      return
    }
    if (calendarFooterAlwaysEnabled) return
    togglePostcardStatus(status)
  }

  const itemStateClass = (status: PostcardStatus) => {
    if (calendarFooterAlwaysEnabled) return styles.inactive
    return postcardStatuses[status] ? styles.active : styles.inactive
  }

  const itemVisualStateClass = (status: PostcardStatus) => {
    if (!calendarFooterAlwaysEnabled) return itemStateClass(status)
    return stripCycleItemCount(status) > 0
      ? styles.itemIconEnabled
      : styles.itemIconDisabled
  }

  const statusCount = (status: PostcardStatus) => {
    if (!showStatusCounts || statusCounts == null) return null
    const n = statusCountValue(status)
    if (n <= 0) return null
    return (
      <span className={styles.count} aria-hidden>
        {n}
      </span>
    )
  }

  return (
    <div
      className={clsx(
        styles.root,
        styles[`root-${spot}`],
        spot === 'calendar' &&
          calendarDispatchDimmed &&
          !calendarCartStripLegendOnly &&
          styles.rootCalendarDimmed,
        spot === 'calendar' &&
          calendarCartHistoryFooter &&
          styles.rootCalendarCartHistory,
        calendarFooterAlwaysEnabled && styles.rootCalendarFooterAlwaysEnabled,
        spot === 'historyList' && isHistoryEmpty && styles.rootEmpty,
      )}
      aria-label="Postcard status colors"
    >
      <div className={styles.row}>
        {!hideCartInCalendarDateFooter ? (
          <button
            type="button"
            className={clsx(
              styles.item,
              styles.cart,
              itemVisualStateClass('cart'),
            )}
            aria-pressed={postcardStatuses.cart}
            onClick={() => handlePostcardStatusClick('cart')}
          >
            <span className={clsx(styles.dot, styles.dotCart)} />
            <IconCart className={styles.icon} />
            {statusCount('cart')}
          </button>
        ) : null}
        {calendarCartStripLegendOnly ? (
          <>
            {calendarCartStripBlockedLegend ? (
              <button
                type="button"
                className={clsx(
                  styles.item,
                  styles.cartBlocked,
                  itemVisualStateClass('cartBlocked'),
                )}
                aria-pressed={postcardStatuses.cartBlocked}
                onClick={() => handlePostcardStatusClick('cartBlocked')}
              >
                <span className={clsx(styles.dot, styles.dotCartBlocked)} />
                <IconCardBlocked className={styles.icon} />
                {statusCount('cartBlocked')}
              </button>
            ) : null}
            {(calendarCartStripBlockedLegend ? [0, 1, 2] : [0, 1, 2, 3]).map(
              (i) => (
                <div
                  key={`legend-phantom-${i}`}
                  className={clsx(
                    styles.item,
                    styles.ready,
                    styles.inactive,
                    styles.legendPhantom,
                  )}
                  aria-hidden
                >
                  <span className={clsx(styles.dot, styles.dotReady)} />
                  <IconPostcardReady className={styles.icon} />
                </div>
              ),
            )}
          </>
        ) : (
          <>
            <button
              type="button"
              className={clsx(
                styles.item,
                styles.ready,
                itemVisualStateClass('ready'),
              )}
              aria-pressed={postcardStatuses.ready}
              onClick={() => handlePostcardStatusClick('ready')}
            >
              <span className={clsx(styles.dot, styles.dotReady)} />
              <IconPostcardReady className={styles.icon} />
              {statusCount('ready')}
            </button>
            <button
              type="button"
              className={clsx(
                styles.item,
                styles.sent,
                itemVisualStateClass('sent'),
              )}
              aria-pressed={postcardStatuses.sent}
              onClick={() => handlePostcardStatusClick('sent')}
            >
              <span className={clsx(styles.dot, styles.dotSent)} />
              <IconPostcardSend
                className={clsx(styles.icon, styles.iconSend)}
              />
              {statusCount('sent')}
            </button>
            <button
              type="button"
              className={clsx(
                styles.item,
                styles.delivered,
                itemVisualStateClass('delivered'),
              )}
              aria-pressed={postcardStatuses.delivered}
              onClick={() => handlePostcardStatusClick('delivered')}
            >
              <span className={clsx(styles.dot, styles.dotDelivered)} />
              <IconPostcardDelivered className={styles.icon} />
              {statusCount('delivered')}
            </button>
            <button
              type="button"
              className={clsx(
                styles.item,
                styles.error,
                itemVisualStateClass('error'),
              )}
              aria-pressed={postcardStatuses.error}
              onClick={() => handlePostcardStatusClick('error')}
            >
              <span className={clsx(styles.dot, styles.dotError)} />
              <IconPostcardNotDelivered className={styles.icon} />
              {statusCount('error')}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

