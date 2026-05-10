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
}

export const PostcardStatusLegend: React.FC<PostcardStatusLegendProps> = ({
  spot,
  isHistoryEmpty,
  statusCounts,
  calendarDispatchDimmed = false,
  calendarCartStripLegendOnly = false,
  calendarCartStripBlockedLegend = false,
}) => {
  const { postcardStatuses, setPostcardStatuses } = useCalendarFacade()

  const handlePostcardStatusClick = (status: PostcardStatus) => {
    if (status === 'cart') {
      const nextCartValue = !postcardStatuses.cart
      setPostcardStatuses({
        ...postcardStatuses,
        cart: nextCartValue,
        cartBlocked: nextCartValue,
      })
      return
    }
    setPostcardStatuses({
      ...postcardStatuses,
      [status]: !postcardStatuses[status],
    })
  }

  const statusCount = (status: PostcardStatus) => {
    if (spot !== 'historyList' || statusCounts == null) return null
    const n =
      status === 'cart'
        ? statusCounts.cart + statusCounts.cartBlocked
        : statusCounts[status]
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
        isHistoryEmpty && styles.rootEmpty,
        spot === 'calendar' &&
          calendarDispatchDimmed &&
          !calendarCartStripLegendOnly &&
          styles.rootCalendarDimmed,
      )}
      aria-label="Postcard status colors"
    >
      <div className={styles.row} aria-hidden>
        <div
          className={clsx(
            styles.item,
            styles.cart,
            postcardStatuses.cart ? styles.active : styles.inactive,
          )}
          onClick={() => handlePostcardStatusClick('cart')}
        >
          <span className={clsx(styles.dot, styles.dotCart)} />
          <IconCart className={styles.icon} />
          {statusCount('cart')}
        </div>
        {spot === 'calendar' && calendarCartStripLegendOnly ? (
          <>
            {calendarCartStripBlockedLegend ? (
              <div
                className={clsx(
                  styles.item,
                  styles.cartBlocked,
                  postcardStatuses.cartBlocked
                    ? styles.active
                    : styles.inactive,
                )}
                onClick={() => handlePostcardStatusClick('cartBlocked')}
              >
                <span className={clsx(styles.dot, styles.dotCartBlocked)} />
                <IconCardBlocked className={styles.icon} />
              </div>
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
            <div
              className={clsx(
                styles.item,
                styles.ready,
                postcardStatuses.ready ? styles.active : styles.inactive,
              )}
              onClick={() => handlePostcardStatusClick('ready')}
            >
              <span className={clsx(styles.dot, styles.dotReady)} />
              <IconPostcardReady className={styles.icon} />
              {statusCount('ready')}
            </div>
            <div
              className={clsx(
                styles.item,
                styles.sent,
                postcardStatuses.sent ? styles.active : styles.inactive,
              )}
              onClick={() => handlePostcardStatusClick('sent')}
            >
              <span className={clsx(styles.dot, styles.dotSent)} />
              <IconPostcardSend
                className={clsx(styles.icon, styles.iconSend)}
              />
              {statusCount('sent')}
            </div>
            <div
              className={clsx(
                styles.item,
                styles.delivered,
                postcardStatuses.delivered ? styles.active : styles.inactive,
              )}
              onClick={() => handlePostcardStatusClick('delivered')}
            >
              <span className={clsx(styles.dot, styles.dotDelivered)} />
              <IconPostcardDelivered className={styles.icon} />
              {statusCount('delivered')}
            </div>
            <div
              className={clsx(
                styles.item,
                styles.error,
                postcardStatuses.error ? styles.active : styles.inactive,
              )}
              onClick={() => handlePostcardStatusClick('error')}
            >
              <span className={clsx(styles.dot, styles.dotError)} />
              <IconPostcardNotDelivered className={styles.icon} />
              {statusCount('error')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
