import React from 'react'
import clsx from 'clsx'
import {
  IconCart,
  IconPostcardSend,
  IconPostcardReady,
  IconPostcardDelivered,
  IconPostcardError,
  IconPostcardNotDelivered,
} from '@shared/ui/icons'
import styles from './PostcardStatusLegend.module.scss'
import { useCalendarFacade } from '../../calendar/application/facades/useCalendarFacade'
import {
  PostcardStatus,
  PostcardStatuses,
} from '@/entities/postcard/domain/types'
import { setPostcardStatusesCount } from '../../calendar/infrastructure/state'

export const PostcardStatusLegend: React.FC<{
  spot: 'calendar' | 'historyList'
  isHistoryEmpty: boolean
  // isHistoryMode: boolean
}> = ({ spot, isHistoryEmpty }) => {
  const { postcardStatuses, setPostcardStatuses } = useCalendarFacade()

  const handlePostcardStatusClick = (status: PostcardStatus) => {
    setPostcardStatuses({
      ...postcardStatuses,
      [status]: !postcardStatuses[status],
    })
  }

  return (
    <div
      className={clsx(
        styles.root,
        styles[`root-${spot}`],
        isHistoryEmpty && styles.rootEmpty,
        // isHistoryMode && styles.rootActive,
      )}
      aria-label={
        // isHistoryMode
        // ? 'Postcard status colors in history'
        // : 'Postcard status colors in calendar'
        'Postcard status colors'
      }
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
        </div>
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
        </div>
      </div>
    </div>
  )
}
