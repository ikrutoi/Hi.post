import React from 'react'
import clsx from 'clsx'
import { IconCircleV2 } from '@shared/ui/icons'
import { CARDTEXT_CONFIG } from '@cardtext/domain/types'
import { PostcardStatuses } from '@entities/postcard/domain/types'
import styles from './PostcardIndicator.module.scss'

export interface PostcardIndicatorProps {
  statuses: PostcardStatuses
}

export const PostcardIndicator: React.FC<PostcardIndicatorProps> = ({
  statuses,
}) => {
  return (
    <div className={styles.postcardIndicatorContainer}>
      {statuses.cart && (
        <span
          // key={status.cart}
          className={clsx(styles.postcardIndicator, styles.cart, {
            // [styles.active]: isCurrent,
            // [styles.filled]: isFilled,
            // [styles.empty]: isEmpty,
          })}
        ></span>
      )}
      {statuses.ready && (
        <span
          // key={status}
          className={clsx(styles.postcardIndicator, styles.ready, {
            // [styles.active]: isCurrent,
            // [styles.filled]: isFilled,
            // [styles.empty]: isEmpty,
          })}
        ></span>
      )}
      {statuses.sent && (
        <span
          // key={status}
          className={clsx(styles.postcardIndicator, styles.sent, {
            // [styles.active]: isCurrent,
            // [styles.filled]: isFilled,
            // [styles.empty]: isEmpty,
          })}
        ></span>
      )}
      {statuses.delivered && (
        <span
          // key={status}
          className={clsx(styles.postcardIndicator, styles.delivered, {
            // [styles.active]: isCurrent,
            // [styles.filled]: isFilled,
            // [styles.empty]: isEmpty,
          })}
        ></span>
      )}
      {statuses.error && (
        <span
          // key={status}
          className={clsx(styles.postcardIndicator, styles.error, {
            // [styles.active]: isCurrent,
            // [styles.filled]: isFilled,
            // [styles.empty]: isEmpty,
          })}
        ></span>
      )}
    </div>
  )
}
