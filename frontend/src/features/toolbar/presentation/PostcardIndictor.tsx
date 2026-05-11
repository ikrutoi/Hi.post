import React from 'react'
import clsx from 'clsx'
import { useCalendarFacade } from '@/features/date/calendar/application/facades/useCalendarFacade'
import styles from './PostcardIndicator.module.scss'

export const PostcardIndicator: React.FC = () => {
  const { postcardStatuses } = useCalendarFacade()
  const cartOn = postcardStatuses.cart || postcardStatuses.cartBlocked

  return (
    <div
      data-postcard-indicator=""
      className={styles.postcardIndicatorContainer}
    >
      <span
        className={clsx(
          styles.postcardIndicator,
          styles.cart,
          !cartOn && styles.postcardIndicatorHidden,
        )}
        aria-hidden={!cartOn}
      />
      <span
        className={clsx(
          styles.postcardIndicator,
          styles.ready,
          !postcardStatuses.ready && styles.postcardIndicatorHidden,
        )}
        aria-hidden={!postcardStatuses.ready}
      />
      <span
        className={clsx(
          styles.postcardIndicator,
          styles.sent,
          !postcardStatuses.sent && styles.postcardIndicatorHidden,
        )}
        aria-hidden={!postcardStatuses.sent}
      />
      <span
        className={clsx(
          styles.postcardIndicator,
          styles.delivered,
          !postcardStatuses.delivered && styles.postcardIndicatorHidden,
        )}
        aria-hidden={!postcardStatuses.delivered}
      />
      <span
        className={clsx(
          styles.postcardIndicator,
          styles.error,
          !postcardStatuses.error && styles.postcardIndicatorHidden,
        )}
        aria-hidden={!postcardStatuses.error}
      />
    </div>
  )
}
