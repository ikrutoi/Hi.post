import React from 'react'
import clsx from 'clsx'
import type { PostcardStatus } from '@entities/postcard'
import { useMarkStampYearCount } from '@envelope/application/hooks/useMarkStampYearCount'
import { MarkStampComposite } from './MarkStampComposite'
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
  const yearCount = useMarkStampYearCount(Boolean(simplifiedPeek))
  const isReadyStamp =
    simplifiedPeek &&
    (listArchivePostcardStatus === 'ready' ||
      listArchivePostcardStatus === 'sent' ||
      listArchivePostcardStatus === 'delivered')

  return (
    <div className={styles.mark}>
      <div
        className={clsx(
          styles.markStamp,
          isReadyStamp
            ? styles.markStampPeekReady
            : simplifiedPeek
              ? stampClassForArchiveStatus(listArchivePostcardStatus)
              : styles.markStampNotActive,
        )}
      >
        <MarkStampComposite
          variant={isReadyStamp ? 'ready' : 'cart'}
          yearCount={yearCount}
        />
      </div>
    </div>
  )
}
