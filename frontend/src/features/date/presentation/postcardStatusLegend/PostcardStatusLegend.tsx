import React from 'react'
import clsx from 'clsx'
import {
  IconCart,
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
  /** Только для `historyList`: числа по статусам (все открытки до фильтра). */
  statusCounts?: Record<PostcardStatus, number>
  /**
   * Только `spot="calendar"`, секция Дата: те же индикаторы, но точки и иконки с opacity 0.5.
   */
  calendarDispatchDimmed?: boolean
  /**
   * Только `spot="calendar"`, секции Дата и Корзина: в футере только пункт Cart
   * (те же фантомные ячейки сетки, что в режиме корзины).
   */
  calendarCartStripLegendOnly?: boolean
}

export const PostcardStatusLegend: React.FC<PostcardStatusLegendProps> = ({
  spot,
  isHistoryEmpty,
  statusCounts,
  calendarDispatchDimmed = false,
  calendarCartStripLegendOnly = false,
}) => {
  const { postcardStatuses, setPostcardStatuses } = useCalendarFacade()

  const handlePostcardStatusClick = (status: PostcardStatus) => {
    setPostcardStatuses({
      ...postcardStatuses,
      [status]: !postcardStatuses[status],
    })
  }

  const statusCount = (status: PostcardStatus) => {
    if (spot !== 'historyList' || statusCounts == null) return null
    const n = statusCounts[status]
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
            {/** Та же сетка 5×1fr, что в «Истории» — Cart остаётся в той же ячейке, без скачков. */}
            {[0, 1, 2, 3].map((i) => (
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
            ))}
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
              <IconPostcardSend className={clsx(styles.icon, styles.iconSend)} />
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
