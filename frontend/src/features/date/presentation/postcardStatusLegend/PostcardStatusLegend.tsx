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
  spot: 'calendar' | 'dateList'
}> = ({ spot }) => {
  const { postcardStatuses, setPostcardStatuses } = useCalendarFacade()

  const handlePostcardStatusClick = (status: PostcardStatus) => {
    setPostcardStatuses({
      ...postcardStatuses,
      [status]: !postcardStatuses[status],
    })
  }

  return (
    <div
      className={clsx(styles.root, styles[`root-${spot}`])}
      aria-label="Postcard status colors in calendar"
    >
      <div className={styles.row} aria-hidden>
        <div
          className={styles.item}
          onClick={() => handlePostcardStatusClick('cart')}
        >
          <span className={clsx(styles.dot, styles.cart)} />
          <IconCart className={styles.icon} />
        </div>
        <div
          className={styles.item}
          onClick={() => handlePostcardStatusClick('ready')}
        >
          <span className={clsx(styles.dot, styles.ready)} />
          <IconPostcardReady className={styles.icon} />
        </div>
        <div
          className={styles.item}
          onClick={() => handlePostcardStatusClick('sent')}
        >
          <span className={clsx(styles.dot, styles.sent)} />
          <IconPostcardSend className={clsx(styles.icon, styles.iconSend)} />
        </div>
        <div
          className={styles.item}
          onClick={() => handlePostcardStatusClick('delivered')}
        >
          <span className={clsx(styles.dot, styles.delivered)} />
          <IconPostcardDelivered className={styles.icon} />
        </div>
        <div
          className={styles.item}
          onClick={() => handlePostcardStatusClick('error')}
        >
          <span className={clsx(styles.dot, styles.error)} />
          <IconPostcardNotDelivered className={styles.icon} />
        </div>
      </div>
    </div>
  )
}
