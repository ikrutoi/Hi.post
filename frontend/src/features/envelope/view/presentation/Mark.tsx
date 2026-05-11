import React from 'react'
import clsx from 'clsx'
import type { PostcardStatus } from '@entities/postcard'
import styles from './Mark.module.scss'

export type MarkProps = {
  simplifiedPeek?: boolean
  listArchivePostcardStatus?: PostcardStatus
}

function stampClassForArchiveStatus(
  status: PostcardStatus | undefined,
): typeof styles.markStampPeekCart | typeof styles.markStampPeekReady {
  if (status === 'ready' || status === 'sent' || status === 'delivered') {
    return styles.markStampPeekReady
  }
  return styles.markStampPeekCart
}

export const Mark: React.FC<MarkProps> = ({
  simplifiedPeek,
  listArchivePostcardStatus,
}) => {
  const stampClass = simplifiedPeek
    ? clsx(
        styles.markStamp,
        stampClassForArchiveStatus(listArchivePostcardStatus),
      )
    : clsx(styles.markStamp, styles.markStampNotActive)

  return (
    <div className={styles.mark}>
      <div className={stampClass} />
    </div>
  )
}
