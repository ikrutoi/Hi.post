import React from 'react'
import clsx from 'clsx'
import { useCalendarFacade } from '@/features/date/calendar/application/facades/useCalendarFacade'
import styles from './PostcardIndicator.module.scss'

export const PostcardIndicator: React.FC = () => {
  const { postcardStatuses } = useCalendarFacade()

  return (
    <div className={styles.postcardIndicatorContainer}>
      {postcardStatuses.cart && (
        <span
          className={clsx(styles.postcardIndicator, styles.cart, {})}
        ></span>
      )}
      {postcardStatuses.ready && (
        <span
          className={clsx(styles.postcardIndicator, styles.ready, {})}
        ></span>
      )}
      {postcardStatuses.sent && (
        <span
          className={clsx(styles.postcardIndicator, styles.sent, {})}
        ></span>
      )}
      {postcardStatuses.delivered && (
        <span
          className={clsx(styles.postcardIndicator, styles.delivered, {})}
        ></span>
      )}
      {postcardStatuses.error && (
        <span
          className={clsx(styles.postcardIndicator, styles.error, {})}
        ></span>
      )}
    </div>
  )
}
