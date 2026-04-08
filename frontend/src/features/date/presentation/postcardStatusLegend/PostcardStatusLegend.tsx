import React from 'react'
import clsx from 'clsx'
import {
  IconCart,
  IconPostcardSend,
  IconPostcardReady,
  IconPostcardDelivered,
  IconPostcardError,
} from '@shared/ui/icons'
import styles from './PostcardStatusLegend.module.scss'

export const PostcardStatusLegend: React.FC = () => (
  <div
    className={styles.root}
    aria-label="Postcard status colors in calendar"
  >
    <div className={styles.row} aria-hidden>
      <div className={styles.item}>
        <span className={clsx(styles.dot, styles.cart)} />
        <IconCart className={styles.icon} />
      </div>
      <div className={styles.item}>
        <span className={clsx(styles.dot, styles.ready)} />
        <IconPostcardReady className={styles.icon} />
      </div>
      <div className={styles.item}>
        <span className={clsx(styles.dot, styles.sent)} />
        <IconPostcardSend className={clsx(styles.icon, styles.iconSend)} />
      </div>
      <div className={styles.item}>
        <span className={clsx(styles.dot, styles.delivered)} />
        <IconPostcardDelivered className={styles.icon} />
      </div>
      <div className={styles.item}>
        <span className={clsx(styles.dot, styles.error)} />
        <IconPostcardError className={styles.icon} />
      </div>
    </div>
  </div>
)
