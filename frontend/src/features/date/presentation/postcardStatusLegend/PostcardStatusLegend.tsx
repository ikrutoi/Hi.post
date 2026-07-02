import React from 'react'
import clsx from 'clsx'
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
  /** Mobile footer: cart / history strip — чуть крупнее точки и иконки. */
  calendarCartHistoryFooter?: boolean
  /** Футер календаря (cart/history): всегда enabled, без active при клике. */
  calendarFooterAlwaysEnabled?: boolean
}

export const PostcardStatusLegend: React.FC<PostcardStatusLegendProps> = ({
  spot,
  isHistoryEmpty,
  statusCounts,
  calendarDispatchDimmed = false,
  calendarCartStripLegendOnly = false,
  calendarCartStripBlockedLegend = false,
  calendarCartHistoryFooter = false,
  calendarFooterAlwaysEnabled = false,
}) => {
  const { postcardStatuses, togglePostcardStatus } = useCalendarFacade()

  const showStatusCounts =
    statusCounts != null && spot === 'historyList'

  const hideCartInCalendarDateFooter =
    calendarCartStripLegendOnly && !calendarCartStripBlockedLegend

  const handlePostcardStatusClick = (status: PostcardStatus) => {
    togglePostcardStatus(status)
  }

  const itemStateClass = (status: PostcardStatus) => {
    if (calendarFooterAlwaysEnabled) return styles.inactive
    return postcardStatuses[status] ? styles.active : styles.inactive
  }

  const statusCountValue = (status: PostcardStatus): number => {
    if (statusCounts == null) return 0
    if (status === 'cart' && !calendarCartStripBlockedLegend) {
      return statusCounts.cart + statusCounts.cartBlocked
    }
    return statusCounts[status]
  }

  const itemVisualStateClass = (status: PostcardStatus) => {
    if (!calendarFooterAlwaysEnabled) return itemStateClass(status)
    return statusCountValue(status) > 0
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
