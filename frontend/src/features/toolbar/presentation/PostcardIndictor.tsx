import React from 'react'
import clsx from 'clsx'
import { useCalendarFacade } from '@/features/date/calendar/application/facades/useCalendarFacade'
import { useDateFacade } from '@/features/date/application/facades/useDateFacade'
import styles from './PostcardIndicator.module.scss'

export const PostcardIndicator: React.FC = () => {
  const { postcardStatuses } = useCalendarFacade()
  // const { isHistoryMode } = useDateFacade()

  return (
    <div
      className={clsx(styles.postcardIndicatorContainer, {
        // [styles.historyMode]: isHistoryMode,
      })}
    >
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
